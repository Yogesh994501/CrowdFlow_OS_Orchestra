import React from 'react';
import { useCrowdFlowStore } from '../../store/useCrowdFlowStore';
import { Play, Pause, RefreshCw } from 'lucide-react';

export const DemoModeBadge: React.FC = () => {
  const { isLiveDemoRunning, toggleLiveDemo, lastTickTimestamp, currentScenario } = useCrowdFlowStore();

  const getScenarioLabel = () => {
    switch (currentScenario) {
      case 'hotel_saturation':
        return 'Hotel Saturation';
      case 'heavy_rain':
        return 'Heavy Monsoon Exit';
      case 'metro_disruption':
        return 'Metro Disruption';
      case 'gate_closure':
        return 'Gate Closure';
      case 'demand_surge':
        return 'Suburban Surge';
      default:
        return 'Normal Operations';
    }
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-850/90 border border-cyan-500/20 shadow-glow-cyan-sm backdrop-blur-md">
      {/* Pulsing indicator */}
      <div className="flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          {isLiveDemoRunning && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          )}
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isLiveDemoRunning ? 'bg-cyan-400' : 'bg-slate-500'}`}></span>
        </span>
        <span className="text-xs font-mono font-bold tracking-wider text-cyan-300 uppercase">
          LIVE DEMO MODE
        </span>
      </div>

      <span className="text-slate-600">|</span>

      {/* Scenario badge */}
      <span className="text-xs font-mono text-slate-300 hidden sm:inline-block">
        {getScenarioLabel()}
      </span>

      <span className="text-slate-600 hidden sm:inline-block">|</span>

      {/* Timestamp */}
      <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
        <RefreshCw className={`w-3 h-3 text-cyan-400 ${isLiveDemoRunning ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
        {lastTickTimestamp}
      </span>

      {/* Play/Pause toggle */}
      <button
        onClick={() => toggleLiveDemo()}
        title={isLiveDemoRunning ? 'Pause live simulation ticker' : 'Resume live simulation ticker'}
        className="ml-1 p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-cyan-300 transition-colors"
      >
        {isLiveDemoRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current text-cyan-400" />}
      </button>
    </div>
  );
};
