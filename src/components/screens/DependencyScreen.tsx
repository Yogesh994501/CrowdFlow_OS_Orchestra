import React, { useState } from 'react';
import { useCrowdFlowStore } from '../../store/useCrowdFlowStore';
import { 
  GitBranch, 
  CloudRain, 
  Bus, 
  Users, 
  DoorOpen, 
  Building2, 
  Hotel, 
  ArrowRight, 
  Sparkles, 
  AlertTriangle, 
  Layers,
  CheckCircle2,
  Sliders,
  RotateCcw
} from 'lucide-react';
import type { DemoScenario } from '../../types';

interface DependencyNode {
  id: string;
  step: number;
  title: string;
  category: string;
  icon: React.ElementType;
  color: string;
  status: 'critical' | 'high' | 'watch' | 'stable';
  cause: string;
  downstreamImpact: string;
  affectedResources: string[];
  recommendedIntervention: string;
  targetScreen: 'mobility' | 'capacity' | 'interventions' | 'alerts' | 'map';
}

export const DependencyScreen: React.FC = () => {
  const { 
    setActiveScreen, 
    currentScenario, 
    setScenario,
    approveIntervention 
  } = useCrowdFlowStore();

  const [selectedNodeId, setSelectedNodeId] = useState<string>('weather');
  const [mitigatedNodes, setMitigatedNodes] = useState<Record<string, boolean>>({});

  // Dynamic status evaluation based on active scenario and mitigation
  const getNodeStatus = (nodeId: string): 'critical' | 'high' | 'watch' | 'stable' => {
    if (mitigatedNodes[nodeId]) return 'stable';

    if (currentScenario === 'normal') {
      return nodeId === 'weather' || nodeId === 'accommodation' ? 'stable' : 'watch';
    }
    if (currentScenario === 'heavy_rain') {
      if (nodeId === 'weather' || nodeId === 'transit' || nodeId === 'arrival') return 'critical';
      if (nodeId === 'gate') return 'critical';
      return 'high';
    }
    if (currentScenario === 'hotel_saturation') {
      if (nodeId === 'accommodation') return 'critical';
      if (nodeId === 'venue') return 'high';
      return 'watch';
    }
    if (currentScenario === 'metro_disruption') {
      if (nodeId === 'transit' || nodeId === 'arrival') return 'critical';
      if (nodeId === 'gate') return 'high';
      return 'watch';
    }
    if (currentScenario === 'gate_closure') {
      if (nodeId === 'gate' || nodeId === 'arrival') return 'critical';
      if (nodeId === 'venue') return 'high';
      return 'watch';
    }
    if (currentScenario === 'demand_surge') {
      if (nodeId === 'arrival' || nodeId === 'gate') return 'critical';
      if (nodeId === 'transit' || nodeId === 'venue') return 'high';
      return 'watch';
    }
    return 'watch';
  };

  const nodes: DependencyNode[] = [
    {
      id: 'weather',
      step: 1,
      title: 'Weather Risk',
      category: 'Meteorological Trigger',
      icon: CloudRain,
      color: '#06B6D4',
      status: getNodeStatus('weather'),
      cause: 'Arabian Sea coastal depression generates heavy monsoon rain and 38 km/h wind gusts during event peak.',
      downstreamImpact: 'Reduces bus transit speeds by 35% and increases pedestrian transfer slippage on open footbridges.',
      affectedResources: ['Eastern Freeway', 'Bandra-Worli Sea Link', 'Marine Drive Promenade'],
      recommendedIntervention: 'Deploy covered rain canopies and preposition 8 high-capacity emergency shuttles.',
      targetScreen: 'mobility'
    },
    {
      id: 'transit',
      step: 2,
      title: 'Transit Corridor',
      category: 'Mobility Network',
      icon: Bus,
      color: '#F97316',
      status: getNodeStatus('transit'),
      cause: 'Rain slowdown combined with Dadar platform interchange density creates 22-minute train boarding backlogs.',
      downstreamImpact: 'Arrival waves bunch up into clustered spikes; 14,000 attendees delayed simultaneously.',
      affectedResources: ['Western Railway Platform 3', 'Metro Line 3 Sahar Station', 'Kalanagar Flyover'],
      recommendedIntervention: 'Inject 6 express electric shuttles from Dadar to bypass crowded station platforms.',
      targetScreen: 'mobility'
    },
    {
      id: 'arrival',
      step: 3,
      title: 'Inflow Surges',
      category: 'Crowd Dynamics',
      icon: Users,
      color: '#EF4444',
      status: getNodeStatus('arrival'),
      cause: 'Delayed trains discharge 8,000 attendees simultaneously in a single 15-minute window rather than uniform spread.',
      downstreamImpact: 'Plaza crowd density hits 4.6 persons/m², overwhelming standard security concourse flow.',
      affectedResources: ['Jio World Convention Concourse', 'MMRDA Arena East Plaza'],
      recommendedIntervention: 'Push mobile incentive vouchers directing 25% of attendees to North Plaza dining precinct.',
      targetScreen: 'interventions'
    },
    {
      id: 'gate',
      step: 4,
      title: 'Turnstile Gates',
      category: 'Venue Access Control',
      icon: DoorOpen,
      color: '#EF4444',
      status: getNodeStatus('gate'),
      cause: 'Inflow surge exceeds Gate 1 screening throughput; queue wait time shoots to 32 minutes.',
      downstreamImpact: 'Spillover queue backs up across pedestrian avenues, blocking emergency vehicle access lanes.',
      affectedResources: ['Turnstiles 1-6', 'Security Magnetometers', 'VIP Concourse Lane'],
      recommendedIntervention: 'Open Gate 2 (Express Pass) to general badge holders to cut wait time in half immediately.',
      targetScreen: 'interventions'
    },
    {
      id: 'accommodation',
      step: 5,
      title: 'Hospitality Saturation',
      category: 'Hospitality Capacity',
      icon: Hotel,
      color: '#6366F1',
      status: getNodeStatus('accommodation'),
      cause: 'Delayed egress forces same-day travelers to seek emergency overnight lodging in central Mumbai.',
      downstreamImpact: 'BKC and Dadar standard hotel rooms reach 100% saturation; prices spike uncontrollably.',
      affectedResources: ['BKC Hotels (Trident/Sofitel)', 'Dadar Heritage Inns', 'Short-Stay Hostels'],
      recommendedIntervention: 'Activate 500 pre-staged emergency dorm beds in Goregaon NESCO & publish Virār buffer packages.',
      targetScreen: 'capacity'
    }
  ];

  const activeNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];
  const ActiveIcon = activeNode.icon;

  const handleMitigate = (nodeId: string) => {
    setMitigatedNodes(prev => ({ ...prev, [nodeId]: true }));
    approveIntervention('int_01');
  };

  const handleResetMitigations = () => {
    setMitigatedNodes({});
  };

  return (
    <div className="space-y-6 pb-12 max-w-[1520px] mx-auto">
      
      {/* Normalized Single <h1> Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <GitBranch className="w-6 h-6 text-cyan-400" />
            <span>Resource Dependency & Cascading Bottlenecks</span>
          </h1>
          <p className="text-xs text-slate-400">
            Interactive Directed Acyclic Graph (DAG) tracing how meteorological and transit delays propagate downstream.
          </p>
        </div>

        {/* Quick Scenario Bar */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/10 overflow-x-auto">
          {(['normal', 'heavy_rain', 'metro_disruption', 'hotel_saturation', 'gate_closure'] as DemoScenario[]).map(sc => (
            <button
              key={sc}
              onClick={() => { setScenario(sc); handleResetMitigations(); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${
                currentScenario === sc
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {sc.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Visual DAG Pipeline Canvas */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-xl space-y-6 relative overflow-hidden">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
              CROSS-SECTOR PROPAGATION GRAPH (DAG)
            </span>
            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
              • Click any node to inspect causality and trigger mitigations
            </span>
          </div>

          {Object.keys(mitigatedNodes).length > 0 && (
            <button
              onClick={handleResetMitigations}
              className="flex items-center gap-1 text-xs font-mono text-cyan-300 hover:text-white"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Mitigations</span>
            </button>
          )}
        </div>

        {/* Visual Connected Nodes Flow */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {nodes.map((node, index) => {
            const Icon = node.icon;
            const isSelected = selectedNodeId === node.id;
            const isCritical = node.status === 'critical';
            const isHigh = node.status === 'high';
            const isMitigated = mitigatedNodes[node.id];

            return (
              <div key={node.id} className="relative flex flex-col items-center">
                
                {/* Node Card */}
                <div
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`w-full p-4 rounded-2xl border transition-all cursor-pointer relative group flex flex-col justify-between min-h-[140px] ${
                    isSelected
                      ? 'bg-cyan-500/15 border-cyan-500/70 shadow-[0_0_20px_rgba(6,182,212,0.25)] scale-[1.03]'
                      : 'bg-slate-950/70 border-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Step Header */}
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center font-mono font-bold text-xs text-cyan-300">
                      {node.step}
                    </span>
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      isMitigated ? 'bg-emerald-400' :
                      isCritical ? 'bg-rose-500 animate-ping' :
                      isHigh ? 'bg-amber-400' : 'bg-emerald-400'
                    }`} />
                  </div>

                  {/* Icon & Title */}
                  <div className="space-y-1 my-2">
                    <Icon className={`w-6 h-6 ${isSelected ? 'text-cyan-300' : 'text-slate-400 group-hover:text-white'}`} />
                    <div className="text-xs font-bold text-white tracking-tight">
                      {node.title}
                    </div>
                    <div className="text-[10px] font-mono uppercase text-slate-400">
                      {node.category}
                    </div>
                  </div>

                  {/* Status Pill */}
                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono">
                    <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                      isMitigated ? 'bg-emerald-500/20 text-emerald-300' :
                      isCritical ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                      isHigh ? 'bg-amber-500/20 text-amber-300' :
                      'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {isMitigated ? 'MITIGATED' : node.status}
                    </span>
                  </div>
                </div>

                {/* Arrow Connector to Next Node (Desktop only) */}
                {index < nodes.length - 1 && (
                  <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-500">
                    <ArrowRight className={`w-4 h-4 ${isCritical ? 'text-rose-400 animate-pulse' : 'text-slate-600'}`} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Animated SVG Propagation Line Overlay */}
        <div className="hidden md:block w-full h-1.5 rounded-full bg-slate-800 overflow-hidden relative">
          <div 
            className="h-full bg-gradient-to-r from-cyan-400 via-amber-400 to-rose-500 animate-pulse transition-all duration-500"
            style={{ width: '100%' }}
          />
        </div>
      </div>

      {/* Selected Node Detailed Cascade Inspector */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-cyan-500/30 shadow-2xl space-y-5 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <ActiveIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
                STAGE {activeNode.step} CAUSALITY & CASCADE PROFILE
              </div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                {activeNode.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!mitigatedNodes[activeNode.id] ? (
              <button
                onClick={() => handleMitigate(activeNode.id)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-mono font-bold transition-all shadow-md"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Apply Instant Mitigation</span>
              </button>
            ) : (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Mitigation Active on Site</span>
              </span>
            )}

            <button
              onClick={() => setActiveScreen(activeNode.targetScreen)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass-tab text-xs font-mono text-cyan-300 hover:text-white transition-all border border-cyan-500/30"
            >
              <span>View in {activeNode.targetScreen.toUpperCase()}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Detailed Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
          
          {/* Root Trigger */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-rose-300 font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>ROOT CAUSE IDENTIFIED</span>
            </div>
            <p className="text-slate-300 leading-relaxed font-sans text-xs">
              {activeNode.cause}
            </p>
          </div>

          {/* Downstream Cascade */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-amber-300 font-bold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>DOWNSTREAM CASCADING IMPACT</span>
            </div>
            <p className="text-slate-300 leading-relaxed font-sans text-xs">
              {activeNode.downstreamImpact}
            </p>
          </div>

          {/* Automated Mitigation */}
          <div className="p-4 rounded-2xl bg-cyan-500/[0.06] border border-cyan-500/30 space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>RECOMMENDED INTERVENTION</span>
            </div>
            <p className="text-slate-200 leading-relaxed font-sans text-xs">
              {activeNode.recommendedIntervention}
            </p>
          </div>

        </div>

        {/* Impacted Infrastructure Resources */}
        <div className="pt-2">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-2">
            DIRECTLY IMPACTED INFRASTRUCTURE RESOURCES:
          </div>
          <div className="flex flex-wrap gap-2">
            {activeNode.affectedResources.map(res => (
              <span key={res} className="px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-slate-300 font-mono text-xs">
                {res}
              </span>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
