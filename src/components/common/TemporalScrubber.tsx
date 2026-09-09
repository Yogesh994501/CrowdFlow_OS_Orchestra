import React, { useEffect, useRef, useState } from 'react';
import { useCrowdFlowStore } from '../../store/useCrowdFlowStore';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  Sparkles, 
  AlertTriangle,
  Zap,
  ChevronRight
} from 'lucide-react';
import { TIME_STEP_MINUTES, checkSurgeActive } from '../../services/temporalEngine';
import type { ScenarioId } from '../../services/temporalEngine';

export const TemporalScrubber: React.FC = () => {
  const { 
    temporalMinutes, 
    setTemporalMinutes, 
    isForecastPlaying, 
    setIsForecastPlaying,
    currentScenario 
  } = useCrowdFlowStore();

  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const [sliderVal, setSliderVal] = useState(temporalMinutes);

  // Sync internal slider with store temporalMinutes
  useEffect(() => {
    setSliderVal(temporalMinutes);
  }, [temporalMinutes]);

  // Continuous auto-play using requestAnimationFrame (0-180m in ~15s = 12m per second)
  useEffect(() => {
    if (!isForecastPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      lastTimeRef.current = null;
      return;
    }

    const speedMinutesPerSec = 12; // 180 min over 15 seconds

    const step = (now: number) => {
      if (lastTimeRef.current !== null) {
        const deltaSec = (now - lastTimeRef.current) / 1000;
        const nextMin = Math.min(180, temporalMinutes + deltaSec * speedMinutesPerSec);
        
        setTemporalMinutes(nextMin);
        
        if (nextMin >= 180) {
          setIsForecastPlaying(false);
          lastTimeRef.current = null;
          return;
        }
      }
      lastTimeRef.current = now;
      animFrameRef.current = requestAnimationFrame(step);
    };

    animFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isForecastPlaying, temporalMinutes, setTemporalMinutes, setIsForecastPlaying]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setSliderVal(val);
    setTemporalMinutes(val);
  };

  const handleReset = () => {
    setIsForecastPlaying(false);
    setTemporalMinutes(0);
  };

  const handleTogglePlay = () => {
    if (temporalMinutes >= 180) {
      setTemporalMinutes(0);
    }
    setIsForecastPlaying(!isForecastPlaying);
  };

  // Base mock event clock starts at 18:15
  const baseMinutesFromMidnight = 18 * 60 + 15;
  const currentClockMinutes = (baseMinutesFromMidnight + Math.round(temporalMinutes)) % (24 * 60);
  const clockH = Math.floor(currentClockMinutes / 60).toString().padStart(2, '0');
  const clockM = (currentClockMinutes % 60).toString().padStart(2, '0');
  const formattedClock = `${clockH}:${clockM}`;

  const isSurge = checkSurgeActive(currentScenario as ScenarioId, temporalMinutes);

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 max-w-2xl w-[94%] sm:w-full select-none pointer-events-auto">
      
      {/* Dynamic Scenario-Aware Surge Warning Banner */}
      {isSurge && (
        <div className="mb-2 px-3.5 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 backdrop-blur-md flex items-center justify-between text-xs text-rose-200 animate-pulse shadow-lg">
          <div className="flex items-center gap-2 font-mono">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="font-bold tracking-wide">PREDICTED SURGE WINDOW:</span>
            <span className="text-rose-100 hidden sm:inline">BKC & transit choke points exceeding critical thresholds</span>
          </div>
          <span className="font-mono text-xs px-2 py-0.5 rounded bg-rose-500/30 text-rose-100 font-extrabold">
            +{Math.round(temporalMinutes)}m
          </span>
        </div>
      )}

      {/* Main Scrubber Glass Dock */}
      <div className="p-3 sm:p-4 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-cyan-500/30 shadow-[0_12px_45px_rgba(0,0,0,0.65)] space-y-3">
        
        {/* Header Row: Controls & Clock Pill */}
        <div className="flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleTogglePlay}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all shadow-md ${
                isForecastPlaying 
                  ? 'bg-amber-500 text-slate-950 hover:bg-amber-400' 
                  : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]'
              }`}
              title={isForecastPlaying ? 'Pause Forecast' : 'Play 3-Hour Forecast'}
            >
              {isForecastPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Forecast</span>
                </>
              )}
            </button>

            {temporalMinutes > 0 && (
              <button
                onClick={handleReset}
                className="p-1.5 rounded-xl glass-tab text-slate-400 hover:text-white transition-colors"
                title="Reset to Live Time (NOW)"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}

            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-mono pl-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>4D Temporal Prediction</span>
            </div>
          </div>

          {/* Time Dial Indicator */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/[0.05] border border-white/10 text-xs font-mono text-slate-200">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-bold text-white">{formattedClock}</span>
              <span className="text-cyan-300 font-semibold text-[11px]">
                {temporalMinutes === 0 ? '(LIVE)' : `(+${Math.round(temporalMinutes)}m)`}
              </span>
            </div>
          </div>
        </div>

        {/* Continuous Slider Bar with Custom Track Styling */}
        <div className="space-y-1.5 relative pt-1">
          <input
            type="range"
            min="0"
            max="180"
            step="0.5"
            value={sliderVal}
            onChange={handleSliderChange}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
            style={{
              background: `linear-gradient(to right, rgb(6 182 212) ${(sliderVal / 180) * 100}%, rgb(30 41 59) ${(sliderVal / 180) * 100}%)`
            }}
          />

          {/* Snap-Point Time Labels */}
          <div className="flex justify-between text-[10px] sm:text-xs font-mono text-slate-400 px-0.5">
            <button 
              onClick={() => setTemporalMinutes(0)}
              className={`hover:text-cyan-300 transition-colors ${temporalMinutes === 0 ? 'text-cyan-400 font-bold' : ''}`}
            >
              NOW
            </button>
            <button 
              onClick={() => setTemporalMinutes(30)}
              className={`hover:text-cyan-300 transition-colors ${Math.abs(temporalMinutes - 30) < 5 ? 'text-cyan-400 font-bold' : ''}`}
            >
              +30m
            </button>
            <button 
              onClick={() => setTemporalMinutes(60)}
              className={`hover:text-cyan-300 transition-colors ${Math.abs(temporalMinutes - 60) < 5 ? 'text-cyan-400 font-bold' : ''}`}
            >
              +1h (Peak)
            </button>
            <button 
              onClick={() => setTemporalMinutes(120)}
              className={`hover:text-cyan-300 transition-colors ${Math.abs(temporalMinutes - 120) < 5 ? 'text-cyan-400 font-bold' : ''}`}
            >
              +2h
            </button>
            <button 
              onClick={() => setTemporalMinutes(180)}
              className={`hover:text-cyan-300 transition-colors ${temporalMinutes >= 175 ? 'text-cyan-400 font-bold' : ''}`}
            >
              +3h
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
