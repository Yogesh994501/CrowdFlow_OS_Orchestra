import React, { useEffect } from 'react';
import { useCrowdFlowStore } from '../../store/useCrowdFlowStore';
import { 
  FlaskConical, 
  Play, 
  RotateCcw, 
  CloudRain, 
  Clock, 
  Users, 
  Bus, 
  Sparkles, 
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';

export const SimulationScreen: React.FC = () => {
  const { 
    simulationParams, 
    setSimulationParams, 
    simulationResult, 
    runSimulation, 
    zones 
  } = useCrowdFlowStore();

  useEffect(() => {
    if (!simulationResult) {
      runSimulation();
    }
  }, []);

  // Improvement: Auto-run simulation on parameter change (300ms debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      runSimulation();
    }, 300);
    return () => clearTimeout(timer);
  }, [
    simulationParams.attendanceDelta,
    simulationParams.weatherCondition,
    simulationParams.eventDelayMin,
    simulationParams.transitDisruption,
    simulationParams.gateClosure,
    simulationParams.hotelCapacityLoss,
    simulationParams.emergencyShuttleAdded
  ]);

  const currentAvgPressure = Math.round(zones.reduce((s, z) => s + z.pressureScore, 0) / zones.length);
  const currentCritical = zones.filter(z => z.status === 'critical').length;

  const comparisonData = [
    {
      metric: 'Pressure',
      Current: currentAvgPressure,
      Simulated: simulationResult?.simulatedPressureAverage || 86,
      AfterIntervention: simulationResult?.afterInterventionPressure || 68,
    },
    {
      metric: 'Critical Zones',
      Current: currentCritical,
      Simulated: simulationResult?.simulatedCriticalZones || 4,
      AfterIntervention: simulationResult?.afterInterventionCriticalZones || 1,
    },
    {
      metric: 'Delay (min)',
      Current: 18,
      Simulated: simulationResult?.simulatedTransitDelay || 46,
      AfterIntervention: 24,
    },
    {
      metric: 'Queue (min)',
      Current: 22,
      Simulated: simulationResult?.simulatedQueueTime || 44,
      AfterIntervention: 16,
    },
  ];

  return (
    <div className="space-y-6 pb-12 max-w-[1400px] mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/[0.08]">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-indigo-400" />
            <span>Simulation Lab — Event Digital Twin</span>
          </h1>
          <p className="text-xs text-slate-400">
            Stress-test operations under multi-hazard scenarios. Compare pre-intervention strain against post-mitigation stabilization.
          </p>
        </div>

        <button
          onClick={runSimulation}
          className="px-4 py-2 rounded-xl text-xs font-bold text-[#090B10] bg-cyan-electric hover:bg-cyan-400 transition-colors flex items-center gap-1.5"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          Run Simulation
        </button>
      </div>

      {/* Two-Panel Layout (Section 12) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Scenario Controls (5-Cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl panel-elevated space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Simulation Parameters
            </span>
            <button
              onClick={() => {
                setSimulationParams({
                  attendanceDelta: 0,
                  weatherCondition: 'clear',
                  eventDelayMin: 0,
                  transitDisruption: 'none',
                  gateClosure: false,
                  hotelCapacityLoss: false,
                  emergencyShuttleAdded: false
                });
                runSimulation();
              }}
              className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Attendance Slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-cyan-electric" />
                Attendance Delta:
              </span>
              <span className="font-bold text-cyan-electric">
                {simulationParams.attendanceDelta > 0 ? `+${simulationParams.attendanceDelta}%` : `${simulationParams.attendanceDelta}%`}
              </span>
            </div>
            <input
              type="range"
              min="-30"
              max="50"
              step="5"
              value={simulationParams.attendanceDelta}
              onChange={e => setSimulationParams({ attendanceDelta: Number(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-xs font-mono text-slate-400">
              <span>-30%</span>
              <span>Baseline (184k)</span>
              <span>+50%</span>
            </div>
          </div>

          {/* Monsoon Weather */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
              <CloudRain className="w-3.5 h-3.5 text-cyan-electric" />
              Monsoon Severity:
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              {[
                { id: 'clear', label: 'Clear' },
                { id: 'light_rain', label: 'Passing Rain' },
                { id: 'heavy_rain', label: 'Monsoon Storm' },
              ].map(w => (
                <button
                  key={w.id}
                  onClick={() => setSimulationParams({ weatherCondition: w.id as any })}
                  className={`py-1.5 rounded-lg text-center border transition-colors ${
                    simulationParams.weatherCondition === w.id
                      ? 'bg-cyan-500/20 text-cyan-electric border-cyan-500/40 font-bold shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                      : 'glass-tab text-slate-400 hover:text-white'
                  }`}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </div>

          {/* Schedule Delay */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                Event Schedule Delay:
              </span>
              <span className="font-bold text-indigo-400">
                +{simulationParams.eventDelayMin} min
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="180"
              step="15"
              value={simulationParams.eventDelayMin}
              onChange={e => setSimulationParams({ eventDelayMin: Number(e.target.value) })}
              className="w-full accent-indigo-400 cursor-pointer"
            />
          </div>

          {/* Specific Stress Toggles */}
          <div className="space-y-1.5 pt-2 border-t border-white/[0.08] text-xs font-mono">

            {/* Transit Disruption Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
                <Bus className="w-3.5 h-3.5 text-indigo-400" />
                Transit Disruption:
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                {[
                  { id: 'none', label: 'None' },
                  { id: 'partial', label: 'Partial' },
                  { id: 'major', label: 'Major Halt' },
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setSimulationParams({ transitDisruption: t.id as any })}
                    className={`py-1.5 rounded-lg text-center border transition-colors ${
                      simulationParams.transitDisruption === t.id
                        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 font-bold shadow-[0_0_12px_rgba(99,102,241,0.2)]'
                        : 'glass-tab text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center justify-between p-2.5 rounded-xl glass-tab cursor-pointer">
              <span className="text-slate-400">Gate 1 Security Concourse Hold</span>
              <input
                type="checkbox"
                checked={simulationParams.gateClosure}
                onChange={e => setSimulationParams({ gateClosure: e.target.checked })}
                className="accent-cyan-400"
              />
            </label>
            <label className="flex items-center justify-between p-2.5 rounded-xl glass-tab cursor-pointer">
              <span className="text-amber-400 font-medium">Hotel Capacity Loss (BKC Saturation)</span>
              <input
                type="checkbox"
                checked={simulationParams.hotelCapacityLoss}
                onChange={e => setSimulationParams({ hotelCapacityLoss: e.target.checked })}
                className="accent-amber-400"
              />
            </label>
            <label className="flex items-center justify-between p-2.5 rounded-xl glass-tab cursor-pointer">
              <span className="text-emerald-400 font-medium">Activate Emergency Buffer Shuttles</span>
              <input
                type="checkbox"
                checked={simulationParams.emergencyShuttleAdded}
                onChange={e => setSimulationParams({ emergencyShuttleAdded: e.target.checked })}
                className="accent-emerald-400"
              />
            </label>
          </div>
        </div>

        {/* Right: Simulation Results & Tri-State Comparison (7-Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Below Sequence: CURRENT → SIMULATED → AFTER INTERVENTION (Section 12) */}
          <div className="p-4 rounded-2xl panel-elevated">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 font-semibold">
              Three-Tier Progression Model:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              
              <div className="p-3 rounded-xl glass-tab space-y-1">
                <span className="text-xs text-slate-400 uppercase">1. CURRENT BASELINE</span>
                <div className="text-xl font-bold text-slate-50">Pressure {currentAvgPressure}</div>
                <span className="text-xs text-slate-400">Normal Metropolitan Load</span>
              </div>

              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 space-y-1 backdrop-blur-md">
                <span className="text-xs text-rose-400 uppercase font-bold">2. SIMULATED STRAIN</span>
                <div className="text-xl font-bold text-rose-400">
                  Pressure {simulationResult?.simulatedPressureAverage || 86}
                </div>
                <span className="text-xs text-rose-300">+{Math.max(0, (simulationResult?.simulatedPressureAverage || 86) - currentAvgPressure)} pts increase</span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 space-y-1 backdrop-blur-md">
                <span className="text-xs text-emerald-400 uppercase font-bold">3. AFTER INTERVENTION</span>
                <div className="text-xl font-bold text-emerald-400">
                  Pressure {simulationResult?.afterInterventionPressure || 68}
                </div>
                <span className="text-xs text-emerald-300 font-semibold">
                  -{Math.max(0, (simulationResult?.simulatedPressureAverage || 86) - (simulationResult?.afterInterventionPressure || 68))} pts recovered
                </span>
              </div>

            </div>
          </div>

          {/* AI Narrative */}
          <div className="p-4 rounded-2xl panel-elevated space-y-1.5">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-electric font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              SYNTHESIZED SCENARIO NARRATIVE
            </span>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              "{simulationResult?.narrative || 'Simulated parameters applied. Rerouting via northern buffer clears physical platform thresholds.'}"
            </p>
          </div>

          {/* Bar Chart Comparison */}
          <div className="p-4 rounded-2xl panel-elevated">
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" opacity={0.5} />
                  <XAxis dataKey="metric" stroke="#64748B" fontSize={12} fontFamily="monospace" />
                  <YAxis stroke="#64748B" fontSize={12} fontFamily="monospace" />
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: '#0E121B', 
                      borderColor: 'rgba(255,255,255,0.1)', 
                      borderRadius: '10px',
                      color: '#fff',
                      fontSize: '12px',
                      fontFamily: 'monospace'
                    }} 
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', fontFamily: 'monospace' }} />
                  <Bar dataKey="Current" fill="#64748B" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Simulated" fill="#EF4444" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="AfterIntervention" fill="#22C55E" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
