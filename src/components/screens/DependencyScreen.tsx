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
  Layers 
} from 'lucide-react';

interface DependencyNode {
  id: string;
  title: string;
  category: string;
  icon: React.ElementType;
  color: string;
  status: 'critical' | 'high' | 'watch' | 'stable';
  cause: string;
  downstreamImpact: string;
  affectedResources: string[];
  recommendedIntervention: string;
  step: number;
}

export const DependencyScreen: React.FC = () => {
  const { setActiveScreen } = useCrowdFlowStore();

  const nodes: DependencyNode[] = [
    {
      id: 'weather',
      step: 1,
      title: '1. Weather Risk Trigger',
      category: 'Meteorological Telemetry',
      icon: CloudRain,
      color: '#06B6D4',
      status: 'high',
      cause: 'Arabian Sea coastal depression generates 78% rain risk and wind gusts of 38 km/h during stadium egress window.',
      downstreamImpact: 'Slowing outdoor vehicular transit, reduced bus operating speeds by 30%, and slippery pedestrian footbridges.',
      affectedResources: ['Eastern Freeway', 'Bandra-Worli Sea Link', 'Marine Drive Promenade'],
      recommendedIntervention: 'Deploy high-capacity covered boarding canopies and preposition 8 emergency buses.'
    },
    {
      id: 'transit',
      step: 2,
      title: '2. Transit Corridor Delays',
      category: 'Mobility Network',
      icon: Bus,
      color: '#F97316',
      status: 'critical',
      cause: 'Rain slowdown combined with Dadar platform interchange density creates 22-minute train boarding backlogs.',
      downstreamImpact: 'Arrival waves bunch up instead of staggering uniformly; 14,000 attendees delayed in transit.',
      affectedResources: ['Western Railway Platform 3', 'Metro Line 3 Sahar Station', 'Kalanagar Flyover'],
      recommendedIntervention: 'Inject 6 express electric shuttles from Dadar to bypass crowded station platforms.'
    },
    {
      id: 'arrival',
      step: 3,
      title: '3. Clustered Arrival Surges',
      category: 'Crowd Dynamics',
      icon: Users,
      color: '#EF4444',
      status: 'critical',
      cause: 'Delayed trains discharge 8,000 attendees simultaneously in a single 15-minute window rather than over 60 minutes.',
      downstreamImpact: 'Plaza crowd density peaks at 4.6 persons/m², overwhelming standard security concourse flow.',
      affectedResources: ['Jio World Convention Concourse', 'MMRDA Arena East Plaza'],
      recommendedIntervention: 'Issue mobile incentive notifications directing 25% of attendees to North Plaza food trucks first.'
    },
    {
      id: 'gate',
      step: 4,
      title: '4. Gate & Turnstile Gridlock',
      category: 'Venue Access Control',
      icon: DoorOpen,
      color: '#EF4444',
      status: 'critical',
      cause: 'Surge hits Gate 1 faster than manual bag checking flow; queue wait time shoots to 32 minutes.',
      downstreamImpact: 'Spillover queue backs up across pedestrian road, blocking emergency vehicle access lanes.',
      affectedResources: ['Turnstiles 1-6', 'Security Magnetometers', 'VIP Concourse Lane'],
      recommendedIntervention: 'Open Gate 2 (Express Pass) to general badge holders to cut wait time in half immediately.'
    },
    {
      id: 'venue',
      step: 5,
      title: '5. Venue Internal Overpressure',
      category: 'Facility Operations',
      icon: Building2,
      color: '#F59E0B',
      status: 'watch',
      cause: 'Late entry shifts plenary hall seating schedule by 40 minutes, causing food court and restroom queue spikes.',
      downstreamImpact: 'Evening session ending delayed past 21:30, forcing late departure into night transit hours.',
      affectedResources: ['Grand Concourse Dining', 'Restroom Clusters A-D', 'Main Auditorium'],
      recommendedIntervention: 'Stagger closing plenary announcements by pavilion tier to regulate egress waves.'
    },
    {
      id: 'accommodation',
      step: 6,
      title: '6. Hospitality Extension Spike',
      category: 'Accommodation & Hospitality',
      icon: Hotel,
      color: '#6366F1',
      status: 'high',
      cause: 'Delayed end time forces same-day travelers to seek emergency overnight lodging in central Mumbai.',
      downstreamImpact: 'BKC and Dadar standard hotel rooms reach 100% saturation; prices surge unpredictably.',
      affectedResources: ['BKC Hotels (Trident/Sofitel)', 'Dadar Heritage Inns', 'Short-Stay Hostels'],
      recommendedIntervention: 'Activate 500 pre-staged emergency dorm beds in Goregaon NESCO & publish Virār buffer packages.'
    }
  ];

  const [selectedNodeId, setSelectedNodeId] = useState<string>('weather');
  const activeNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <GitBranch className="w-6 h-6 text-cyan-400" />
          <span>Resource Dependency & Bottleneck Cascade</span>
        </h1>
        <p className="text-xs text-slate-400">
          Trace how an isolated weather perturbation propagates downstream through transit, gates, and hospitality capacity.
        </p>
      </div>

      {/* Interactive Visual Graph Sequence */}
      <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
        <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
          Cascade Propagation Flow (Click any stage to inspect cause & downstream effects):
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {nodes.map(node => {
            const Icon = node.icon;
            const isSelected = selectedNodeId === node.id;
            return (
              <div
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative group flex flex-col justify-between ${
                  isSelected
                    ? 'bg-cyan-500/15 border-cyan-500/60 shadow-glow-cyan-sm scale-[1.02]'
                    : 'bg-dark-900/80 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-lg bg-dark-800 flex items-center justify-center font-mono font-bold text-xs text-cyan-300">
                      {node.step}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${
                      node.status === 'critical' ? 'bg-rose-500 animate-ping' : node.status === 'high' ? 'bg-orange-500' : 'bg-amber-400'
                    }`} />
                  </div>
                  <Icon className={`w-6 h-6 ${isSelected ? 'text-cyan-300' : 'text-slate-400 group-hover:text-white'}`} />
                  <div className="text-xs font-bold text-white leading-snug">
                    {node.title.split('. ')[1]}
                  </div>
                </div>

                <div className="text-xs font-mono text-slate-400 mt-3 pt-2 border-t border-white/5">
                  {node.category}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Downstream Impact Inspection Card */}
      {activeNode && (
        <div className="p-6 rounded-3xl glass-panel-glow border border-cyan-500/30 space-y-5 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
                <activeNode.icon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                  Node Analysis • Step {activeNode.step} of 6
                </span>
                <h3 className="text-lg font-bold text-white leading-tight">
                  {activeNode.title}
                </h3>
              </div>
            </div>

            <span className="text-xs font-mono px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold uppercase">
              {activeNode.status} Severity
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Root Trigger */}
            <div className="p-4 rounded-2xl bg-dark-900 border border-white/5 space-y-1.5">
              <div className="font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                Root Trigger Cause
              </div>
              <p className="text-slate-300 font-sans leading-relaxed">
                {activeNode.cause}
              </p>
            </div>

            {/* Downstream Cascade Impact */}
            <div className="p-4 rounded-2xl bg-dark-900 border border-white/5 space-y-1.5">
              <div className="font-mono uppercase tracking-wider text-rose-400 font-bold flex items-center gap-1.5">
                <ArrowRight className="w-3.5 h-3.5" />
                Downstream Compounding Cascade
              </div>
              <p className="text-slate-300 font-sans leading-relaxed">
                {activeNode.downstreamImpact}
              </p>
            </div>
          </div>

          {/* Affected Assets & Prescribed Action */}
          <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="text-slate-400">Affected Physical Assets:</span>
              {activeNode.affectedResources.map((res, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-dark-850 text-cyan-300 border border-white/5 font-semibold">
                  {res}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-cyan-500/20">
              <div className="space-y-0.5">
                <span className="text-xs font-mono font-bold text-cyan-300 uppercase flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Prescribed Decoupling Intervention:
                </span>
                <p className="text-xs text-white font-sans">
                  {activeNode.recommendedIntervention}
                </p>
              </div>

              <button
                onClick={() => setActiveScreen('interventions')}
                className="px-4 py-2 rounded-xl text-xs font-bold text-dark-950 bg-cyan-400 hover:bg-cyan-300 shadow-glow-cyan-sm transition-all shrink-0 flex items-center gap-1.5"
              >
                Execute Mitigation
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
