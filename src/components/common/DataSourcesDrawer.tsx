import React, { useState } from 'react';
import { fallbackManager } from '../../orchestrator/fallbackManager';
import { 
  Database, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Layers, 
  ShieldCheck, 
  X, 
  RefreshCw,
  Server
} from 'lucide-react';
import { SkeletonLoader } from './SkeletonLoader';

interface DataSourcesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataSourcesDrawer: React.FC<DataSourcesDrawerProps> = ({ isOpen, onClose }) => {
  const [statuses, setStatuses] = useState(() => fallbackManager.getAllStatuses());
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!isOpen) return null;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setStatuses(fallbackManager.getAllStatuses());
      setIsRefreshing(false);
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-2xl glass-overlay border border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.2)]">
              <Database className="w-4 h-4 text-cyan-electric" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-mono tracking-tight text-slate-50">
                CENTRAL DATA SOURCES & FAILOVER STATUS
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Real-time Open-Data API Adapters & Graceful Fallback Transparency
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-1.5 rounded-lg glass-tab text-slate-400 hover:text-white transition-colors"
              title="Refresh Feeds Status"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg glass-tab text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Strict Policy Banner */}
          <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-start gap-3 backdrop-blur-md">
            <ShieldCheck className="w-5 h-5 text-cyan-electric shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-semibold text-cyan-200">Strict Free & Open-Data Architecture:</span>
              <p className="text-slate-300 leading-relaxed font-sans">
                CrowdFlow OS uses only free, public open-data services (OpenStreetMap, Overpass, Nominatim, Open-Meteo, OSRM, GTFS). 
                Zero paid subscriptions or API keys required. Automatic in-memory caching and authentic Mumbai local mock fallbacks prevent any service outage.
              </p>
            </div>
          </div>

          {/* Sources List */}
          <div className="space-y-2.5">
            {isRefreshing ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 rounded-xl glass-tab flex items-center justify-between gap-4 animate-fade-in"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <SkeletonLoader className="h-4 w-32 rounded-md" />
                      <SkeletonLoader className="h-4 w-16 rounded-full" />
                    </div>
                    <SkeletonLoader className="h-3 w-48 rounded" />
                  </div>
                  <div className="flex items-center gap-4 text-right shrink-0">
                    <div className="space-y-1">
                      <SkeletonLoader className="h-3 w-12 rounded ml-auto" />
                      <SkeletonLoader className="h-3 w-16 rounded ml-auto" />
                    </div>
                    <div className="space-y-1">
                      <SkeletonLoader className="h-3 w-10 rounded ml-auto" />
                      <SkeletonLoader className="h-3 w-14 rounded ml-auto" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              statuses.map(s => {
                const isLive = s.source === 'live';
                const isCached = s.source === 'cached';

                return (
                  <div 
                    key={s.id}
                    className="p-3.5 rounded-xl glass-tab hover:border-white/20 transition-all flex items-center justify-between gap-4 shadow-sm"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-50">{s.name}</span>
                        <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${
                          isLive 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25 font-bold'
                            : isCached
                            ? 'bg-cyan-500/10 text-cyan-electric border-cyan-500/25 font-bold'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/25 font-bold'
                        }`}>
                          {isLive ? '● LIVE' : isCached ? '● CACHED' : '● SIMULATED'}
                        </span>
                      </div>

                      {s.fallbackReason && (
                        <p className="text-xs text-slate-400 font-mono">
                          {s.fallbackReason}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-right shrink-0">
                      <div>
                        <div className="text-xs font-mono text-slate-400">LATENCY</div>
                        <div className="text-xs font-mono font-bold text-white">{s.latencyMs} ms</div>
                      </div>
                      <div>
                        <div className="text-xs font-mono text-slate-400">STATUS</div>
                        <div className="flex items-center gap-1 text-xs font-mono text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span className="capitalize">{s.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Orchestration Pipeline Architecture Summary */}
          <div className="p-3 rounded-xl bg-[#141A26] border border-white/[0.08] text-xs font-mono text-slate-300 space-y-1.5">
            <div className="text-white font-bold flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-cyan-electric" />
              Intelligence Pipeline Flow
            </div>
            <p className="text-xs leading-relaxed font-sans text-slate-400">
              External Feeds → Adapters → Data Normalization → Central Intelligence Engine (30% Occupancy + 25% Arrivals + 20% Transit + 15% Venue + 10% Weather) → Zustand Central State → All Consoles
            </p>
          </div>

          {/* Strict Public API Policy & Documentation Links */}
          <div className="p-3.5 rounded-xl bg-[#0B101A] border border-white/[0.06] space-y-2">
            <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <ExternalLink className="w-3 h-3 text-cyan-electric" />
              Approved Open-Service Policies & Documentation
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <a 
                href="https://open-meteo.com/en/about" 
                target="_blank" 
                rel="noreferrer"
                className="p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.05] transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="font-semibold text-slate-50 group-hover:text-cyan-electric transition-colors">Open-Meteo</div>
                  <div className="text-xs text-slate-400">Free open-meteo weather API terms</div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-electric shrink-0" />
              </a>

              <a 
                href="https://operations.osmfoundation.org/policies/" 
                target="_blank" 
                rel="noreferrer"
                className="p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.05] transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="font-semibold text-slate-50 group-hover:text-cyan-electric transition-colors">OpenStreetMap Policies</div>
                  <div className="text-xs text-slate-400">OSMF tile usage & fair-use rules</div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-electric shrink-0" />
              </a>

              <a 
                href="https://operations.osmfoundation.org/policies/nominatim/" 
                target="_blank" 
                rel="noreferrer"
                className="p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.05] transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="font-semibold text-slate-50 group-hover:text-cyan-electric transition-colors">Nominatim Usage Policy</div>
                  <div className="text-xs text-slate-400">1 req/s max, no auto-complete spam</div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-electric shrink-0" />
              </a>

              <a 
                href="https://project-osrm.org/docs/v26.4.0/http" 
                target="_blank" 
                rel="noreferrer"
                className="p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.05] transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="font-semibold text-slate-50 group-hover:text-cyan-electric transition-colors">OSRM Documentation</div>
                  <div className="text-xs text-slate-400">Routing protocol & HTTP endpoints</div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-electric shrink-0" />
              </a>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-slate-400">
          <span>MUMBAI CLUSTER: AP-SOUTH-1</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-cyan-electric text-[#090B10] font-bold hover:bg-cyan-400 transition-colors shadow-sm"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
};
