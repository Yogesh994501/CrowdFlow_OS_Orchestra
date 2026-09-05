import React, { useState } from 'react';
import { useCrowdFlowStore } from '../../store/useCrowdFlowStore';
import { 
  Activity, 
  ChevronDown, 
  ChevronUp, 
  Cloud, 
  MapPin, 
  Navigation, 
  Train, 
  Map,
  Search,
  Zap,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Radio,
  ExternalLink,
  Database,
  RefreshCw,
  Info,
  ShieldCheck,
  XCircle,
  HelpCircle,
  Cpu
} from 'lucide-react';
import type { DataSourceStatus } from '../../orchestrator/fallbackManager';

const sourceIcons: Record<string, React.ReactNode> = {
  open_meteo: <Cloud className="w-3.5 h-3.5" />,
  gtfs: <Train className="w-3.5 h-3.5" />,
  overpass: <MapPin className="w-3.5 h-3.5" />,
  nominatim: <Search className="w-3.5 h-3.5" />,
  osrm: <Navigation className="w-3.5 h-3.5" />,
  demo_telemetry: <Cpu className="w-3.5 h-3.5" />,
  osm: <Map className="w-3.5 h-3.5" />,
};

export const DataSourcePanel: React.FC = () => {
  const { 
    dataSourceStatuses, 
    orchestrationHealth, 
    dataConfidence,
    orchestrationCycleNumber,
    lastOrchestrationLatencyMs,
    lastOrchestrationAt,
    orchestratePipeline 
  } = useCrowdFlowStore();

  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleManualRefresh = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRefreshing(true);
    try {
      await orchestratePipeline(true);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getStatusBadge = (status: DataSourceStatus['status']) => {
    switch (status) {
      case 'live':
        return (
          <span className="flex items-center gap-1 text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
            LIVE
          </span>
        );
      case 'cached':
        return (
          <span className="flex items-center gap-1 text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Database className="w-2.5 h-2.5 text-cyan-400" />
            CACHED
          </span>
        );
      case 'demo':
        return (
          <span className="flex items-center gap-1 text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Radio className="w-2.5 h-2.5 text-amber-400" />
            DEMO
          </span>
        );
      case 'unavailable':
        return (
          <span className="flex items-center gap-1 text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-2.5 h-2.5 text-rose-400" />
            UNAVAILABLE
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-500/10 text-slate-400 border border-slate-500/20">
            <HelpCircle className="w-2.5 h-2.5" />
            READY
          </span>
        );
    }
  };

  const activeConfidence = dataConfidence || orchestrationHealth.dataConfidence || 92;
  const activeCycle = orchestrationCycleNumber || orchestrationHealth.cycleNumber || 1;
  const activeLatency = lastOrchestrationLatencyMs || orchestrationHealth.lastCycleLatencyMs || 184;

  const selectedSource = dataSourceStatuses.find(s => s.sourceId === selectedSourceId || s.id === selectedSourceId);

  return (
    <div 
      className="data-source-panel"
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '88px',
        zIndex: 45,
        width: isExpanded ? '380px' : 'auto',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Collapsed Pill Button (Prompt Section 10) */}
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-white/10 hover:border-cyan-500/40 text-xs font-mono shadow-2xl backdrop-blur-xl transition-all group select-none"
          style={{
            background: 'rgba(8, 15, 27, 0.78)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)'
          }}
          title="Inspect Central Data Sources, Latencies & Confidence"
        >
          <span className="text-cyan-400 font-bold text-sm">⌁</span>
          <span className="font-bold text-slate-200 tracking-tight text-xs font-mono">Data Sources</span>
          
          {/* Status dots indicator row */}
          <div className="flex items-center gap-1 mx-0.5">
            {dataSourceStatuses.map((s, idx) => (
              <span 
                key={idx} 
                className={`w-1.5 h-1.5 rounded-full ${
                  s.status === 'live' ? 'bg-emerald-400' :
                  s.status === 'cached' ? 'bg-cyan-400' :
                  s.status === 'demo' ? 'bg-amber-400' : 'bg-slate-500'
                }`}
                title={`${s.name}: ${s.status.toUpperCase()}`}
              />
            ))}
          </div>

          <span className="text-cyan-300 font-bold font-mono text-xs">{activeConfidence}% Confidence</span>
          <ChevronUp className="w-3 h-3 text-slate-400 group-hover:text-white transition-colors" />
        </button>
      ) : (
        /* Expanded Floating Card */
        <div className="bg-[#0B0F19]/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden animate-slide-up flex flex-col max-h-[85vh]">
          
          {/* Header */}
          <div className="px-4 py-3 bg-[#0E1424] border-b border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <div>
                <h4 className="text-xs font-bold font-mono tracking-wider text-slate-100 uppercase">
                  Data Sources & Orchestration
                </h4>
                <p className="text-xs text-slate-400 font-mono">
                  Single Coordinated Intelligence Pipeline
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-cyan-300 transition-colors"
                title="Force Refresh Active Feeds"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => {
                  setIsExpanded(false);
                  setSelectedSourceId(null);
                }}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                title="Minimize Panel"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Sources List */}
          <div className="p-3 space-y-1.5 overflow-y-auto max-h-[380px] custom-scrollbar">
            {dataSourceStatuses.map(source => {
              const isSelected = (selectedSourceId === source.sourceId || selectedSourceId === source.id);
              const icon = sourceIcons[source.sourceId] || sourceIcons[source.id] || <Activity className="w-3.5 h-3.5" />;

              return (
                <div key={source.id || source.sourceId} className="flex flex-col">
                  <div
                    onClick={() => setSelectedSourceId(isSelected ? null : (source.sourceId || source.id))}
                    className={`px-3 py-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                      isSelected 
                        ? 'bg-cyan-500/10 border-cyan-500/30' 
                        : 'bg-white/[0.02] hover:bg-white/[0.05] border-white/[0.04]'
                    }`}
                  >
                    {/* Icon & Name */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`p-1.5 rounded-lg shrink-0 ${
                        source.status === 'live' ? 'bg-emerald-500/10 text-emerald-400' :
                        source.status === 'cached' ? 'bg-cyan-500/10 text-cyan-400' :
                        source.status === 'demo' ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-500/10 text-slate-400'
                      }`}>
                        {icon}
                      </div>

                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-200 truncate font-sans">
                          {source.sourceName || source.name}
                        </div>
                        <div className="text-xs text-slate-400 truncate font-mono">
                          {source.status === 'demo' && source.fallbackReason ? 'Calibrated Event Fallback' : source.description?.slice(0, 36) + '...'}
                        </div>
                      </div>
                    </div>

                    {/* Status Badge & Latency */}
                    <div className="flex items-center gap-2 shrink-0">
                      {getStatusBadge(source.status)}
                      <span className="text-xs font-mono text-slate-400 min-w-[38px] text-right">
                        {source.latencyMs}ms
                      </span>
                    </div>
                  </div>

                  {/* Detail Accordion Card */}
                  {isSelected && (
                    <div className="mt-1 p-3 rounded-xl bg-[#101726] border border-cyan-500/20 text-xs font-mono space-y-2 animate-fadeIn">
                      <div className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                        {source.name}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        {source.description || 'Continuous event intelligence stream for CrowdFlow OS.'}
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-white/5">
                        <div>
                          <span className="text-slate-400 block">STATUS</span>
                          <span className="font-bold text-slate-200 uppercase">{source.status}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">LATENCY</span>
                          <span className="font-bold text-cyan-400">{source.latencyMs} ms</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">LAST CHECK</span>
                          <span className="text-slate-300">{source.lastCheckedAt || source.lastChecked}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">CACHE AGE</span>
                          <span className="text-slate-300">{source.cacheAgeSeconds ? `${source.cacheAgeSeconds}s` : 'Fresh'}</span>
                        </div>
                      </div>

                      {source.fallbackReason && (
                        <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 font-sans">
                          <span className="font-bold font-mono">Fallback Reason: </span>
                          {source.fallbackReason}
                        </div>
                      )}

                      {source.dataUsedBy && source.dataUsedBy.length > 0 && (
                        <div className="pt-1 border-t border-white/5">
                          <span className="text-slate-400 text-xs block mb-1 font-mono">DATA USED BY:</span>
                          <div className="flex flex-wrap gap-1">
                            {source.dataUsedBy.map(tag => (
                              <span key={tag} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-xs text-slate-300 font-mono">
                                • {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Orchestration Summary Bar */}
          <div className="p-3 bg-[#0E1424] border-t border-white/[0.08] space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-slate-400 text-xs block uppercase">Orchestration</span>
                <span className="font-bold text-cyan-400">Cycle #{activeCycle}</span>
              </div>
              <div>
                <span className="text-slate-400 text-xs block uppercase">Pipeline Latency</span>
                <span className="font-bold text-slate-200">{activeLatency} ms</span>
              </div>
              <div>
                <span className="text-slate-400 text-xs block uppercase">Data Confidence</span>
                <span className="font-bold text-emerald-400">{activeConfidence}%</span>
              </div>
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="w-full py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 hover:text-cyan-200 text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Running Orchestration Cycle...' : 'Refresh Available Data'}
            </button>
          </div>

          {/* Open Data Policies Link Footer (Fair Use Transparency) */}
          <div className="px-3 py-2 bg-[#090C14] border-t border-white/[0.04] flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1 text-slate-500">
              <ShieldCheck className="w-3 h-3 text-cyan-400" />
              Free Open Services Only
            </span>
            <div className="flex items-center gap-2">
              <a 
                href="https://open-meteo.com/en/about" 
                target="_blank" 
                rel="noreferrer"
                className="hover:text-cyan-300 transition-colors"
              >
                Meteo
              </a>
              <span>•</span>
              <a 
                href="https://operations.osmfoundation.org/policies/" 
                target="_blank" 
                rel="noreferrer"
                className="hover:text-cyan-300 transition-colors"
              >
                OSM
              </a>
              <span>•</span>
              <a 
                href="https://project-osrm.org/docs/v26.4.0/http" 
                target="_blank" 
                rel="noreferrer"
                className="hover:text-cyan-300 transition-colors"
              >
                OSRM
              </a>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
