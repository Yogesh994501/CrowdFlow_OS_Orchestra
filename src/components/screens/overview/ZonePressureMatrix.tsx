import React, { useState } from 'react';
import { 
  TrendingUp, 
  Minus, 
  ChevronRight, 
  Layers, 
  ChevronDown, 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert 
} from 'lucide-react';
import type { Zone } from '../../../types';

interface ZonePressureMatrixProps {
  criticalZones: Zone[];
  highZones: Zone[];
  watchZones: Zone[];
  stableZones: Zone[];
  onSelectZone: (zone: Zone) => void;
  onNavigateToMap: () => void;
}

export const ZonePressureMatrix: React.FC<ZonePressureMatrixProps> = ({
  criticalZones,
  highZones,
  watchZones,
  stableZones,
  onSelectZone,
  onNavigateToMap,
}) => {
  // Progressive disclosure: glanceable priority view vs all 8 sectors
  const [viewMode, setViewMode] = useState<'priority' | 'all'>('priority');

  const priorityZones = [...criticalZones, ...highZones, ...watchZones];
  const allZonesCount = criticalZones.length + highZones.length + watchZones.length + stableZones.length;

  return (
    <div className="rounded-2xl p-6 space-y-4 panel-elevated">
      {/* Header & Progressive Disclosure Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span>ZONE PRESSURE MATRIX</span>
            <span className="text-xs text-slate-400 font-normal font-mono">
              ({allZonesCount} Orchestrated City Sectors)
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Click any zone for contextual diagnostic breakdown & intervention options.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Progressive Disclosure Toggle Buttons */}
          <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10 text-xs font-mono">
            <button
              onClick={() => setViewMode('priority')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                viewMode === 'priority'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              <span>Priority ({priorityZones.length})</span>
            </button>
            <button
              onClick={() => setViewMode('all')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                viewMode === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3 h-3 text-cyan-400" />
              <span>All ({allZonesCount})</span>
            </button>
          </div>

          <button
            onClick={onNavigateToMap}
            className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono transition-colors px-2 py-1"
          >
            <span className="hidden sm:inline">Map View</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Structured Visual Matrix */}
      <div className="space-y-4 pt-1">
        
        {/* Tier 1: Critical & High Attention */}
        {(criticalZones.length > 0 || highZones.length > 0) && (
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <AlertOctagon className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                HIGH & CRITICAL ATTENTION REQUIRED ({criticalZones.length + highZones.length})
              </span>
              <span className="text-xs font-normal text-slate-400">Immediate containment protocol</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[...criticalZones, ...highZones].map(zone => {
                const isCritical = zone.status === 'critical';
                const StatusIcon = isCritical ? AlertOctagon : ShieldAlert;
                return (
                  <div
                    key={zone.id}
                    onClick={() => onSelectZone(zone)}
                    className="p-3.5 rounded-xl glass-tab border-rose-500/30 hover:border-rose-500/60 cursor-pointer transition-all flex items-center justify-between group shadow-sm hover:scale-[1.01]"
                  >
                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                        {zone.name}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                        <span className="uppercase text-rose-400 font-bold flex items-center gap-1">
                          <StatusIcon className="w-3 h-3" />
                          {zone.status}
                        </span>
                        <span>·</span>
                        <span>{zone.activeVisitors.toLocaleString()} visitors</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold font-mono text-rose-400">
                        {zone.pressureScore}
                      </div>
                      <div className="text-xs font-mono text-rose-400 flex items-center justify-end gap-0.5">
                        <TrendingUp className="w-3 h-3" />
                        <span>↑ {zone.transitLoad > 80 ? '8%' : '5%'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tier 2: Watch Zones */}
        {watchZones.length > 0 && (
          <div className="space-y-2 pt-1">
            <div className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                WATCH ZONES ({watchZones.length})
              </span>
              <span className="text-xs font-normal text-slate-400">Approaching peak parameters</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {watchZones.map(zone => (
                <div
                  key={zone.id}
                  onClick={() => onSelectZone(zone)}
                  className="p-3 rounded-xl glass-tab border-amber-500/25 hover:border-amber-500/50 cursor-pointer transition-all flex items-center justify-between group shadow-sm hover:scale-[1.01]"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors truncate max-w-[130px]">
                      {zone.shortName || zone.name}
                    </div>
                    <div className="text-xs font-mono text-amber-400">
                      {zone.activeVisitors.toLocaleString()} in zone
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-bold font-mono text-amber-400">
                      {zone.pressureScore}
                    </div>
                    <div className="text-xs font-mono text-amber-400 flex items-center justify-end">
                      <TrendingUp className="w-2.5 h-2.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tier 3: Stable Buffer Zones (Progressive disclosure: shown in 'all' view or expandable) */}
        {stableZones.length > 0 && (
          viewMode === 'all' ? (
            <div className="space-y-2 pt-1 animate-fade-in">
              <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  STABLE BUFFER ZONES ({stableZones.length})
                </span>
                <span className="text-xs font-normal text-slate-400">Available overflow destinations</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {stableZones.map(zone => (
                  <div
                    key={zone.id}
                    onClick={() => onSelectZone(zone)}
                    className="p-3 rounded-xl glass-tab hover:border-emerald-500/40 cursor-pointer transition-all flex items-center justify-between group shadow-sm hover:scale-[1.01]"
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors truncate max-w-[130px]">
                        {zone.shortName || zone.name}
                      </div>
                      <div className="text-xs font-mono text-emerald-400">
                        Ready for overflow
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-bold font-mono text-emerald-400">
                        {zone.pressureScore}
                      </div>
                      <div className="text-xs font-mono text-slate-400 flex items-center justify-end">
                        <Minus className="w-2.5 h-2.5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="pt-2">
              <button
                onClick={() => setViewMode('all')}
                className="w-full py-2 px-3 rounded-xl border border-dashed border-white/15 hover:border-cyan-500/40 text-xs font-mono text-slate-400 hover:text-white transition-all flex items-center justify-center gap-2 glass-tab"
              >
                <span>+ Show {stableZones.length} Stable Buffer Zones (Available for Diversion)</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          )
        )}

      </div>
    </div>
  );
};
