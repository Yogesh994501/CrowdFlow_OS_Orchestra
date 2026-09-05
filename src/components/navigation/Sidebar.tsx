import React from 'react';
import { useCrowdFlowStore } from '../../store/useCrowdFlowStore';
import { 
  LayoutDashboard, 
  MapPin, 
  Building2, 
  Bus, 
  ShieldAlert, 
  Sparkles, 
  FlaskConical, 
  GitBranch, 
  Sliders, 
  Smartphone,
  CheckCircle2,
  Rocket
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeScreen, setActiveScreen, alerts, interventions } = useCrowdFlowStore();

  const pendingInterventions = interventions.filter(i => i.status === 'pending');
  const criticalAlerts = alerts.filter(a => a.severity === 'critical');

  const primaryNav = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, badge: null },
    { id: 'map', label: 'Live City Map', icon: MapPin, badge: 'Live', badgeColor: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/25' },
    { id: 'capacity', label: 'Capacity Intelligence', icon: Building2, badge: null },
    { id: 'mobility', label: 'Mobility Control', icon: Bus, badge: null },
    { 
      id: 'alerts', 
      label: 'Alert Center', 
      icon: ShieldAlert, 
      badge: criticalAlerts.length > 0 ? `${criticalAlerts.length}` : null,
      badgeColor: 'bg-rose-500/15 text-rose-400 border-rose-500/25'
    },
  ];

  const operationsNav = [
    { 
      id: 'interventions', 
      label: 'Interventions', 
      icon: Sparkles, 
      badge: pendingInterventions.length > 0 ? `${pendingInterventions.length}` : null,
      badgeColor: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/25'
    },
    { id: 'simulation', label: 'Simulation Lab', icon: FlaskConical, badge: 'Twin', badgeColor: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/25' },
    { id: 'dependency', label: 'Resource Cascades', icon: GitBranch, badge: null },
    { id: 'operators', label: 'Operator Hubs', icon: Sliders, badge: null },
  ];

  const attendeeNav = [
    { id: 'attendee', label: 'Attendee Portal', icon: Smartphone, badge: 'Mobile', badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  ];

  const renderNavGroup = (title: string | null, items: typeof primaryNav) => (
    <div className="space-y-1">
      {title && (
        <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400/70 px-3 py-1 font-semibold">
          {title}
        </div>
      )}
      {items.map(item => {
        const Icon = item.icon;
        const isActive = activeScreen === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveScreen(item.id as any)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group relative ${
              isActive
                ? 'glass-tab-active text-slate-100 font-semibold'
                : 'glass-tab text-slate-300 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {isActive && (
                <span className="absolute -left-3 w-1.5 h-5 bg-cyan-400 rounded-r-full shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
              )}
              <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-cyan-300' : 'text-slate-400 group-hover:text-cyan-300'}`} />
              <span className="tracking-tight">{item.label}</span>
            </div>
            {item.badge && (
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${item.badgeColor}`}>
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <aside 
      className="w-60 shrink-0 hidden md:flex flex-col justify-between p-3 min-h-[calc(100vh-64px)] sticky top-16 z-30 glass-sidebar"
    >
      <div className="space-y-4">
        
        {/* Navigation Group 1: Core Command */}
        {renderNavGroup('COMMAND CORE', primaryNav)}

        {/* Subtle separator */}
        <div className="h-[1px] bg-white/[0.06] mx-2" />

        {/* Navigation Group 2: Operations & Digital Twin */}
        {renderNavGroup('PREDICTIVE LABS', operationsNav)}

        {/* Subtle separator */}
        <div className="h-[1px] bg-white/[0.06] mx-2" />

        {/* Navigation Group 3: Attendee Guidance */}
        {renderNavGroup('END-USER GUIDANCE', attendeeNav)}

        {/* Adoption Rate Insight */}
        <div className="pt-2 px-2">
          <div className="p-3 rounded-xl glass-tab space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span className="tracking-wider uppercase">Adoption Rate</span>
              <span className="text-emerald-400 font-bold">+5.2%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold font-mono text-slate-100">68%</span>
              <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full" style={{ width: '68%' }} />
              </div>
            </div>
            <p className="text-[10px] text-slate-400/80 leading-snug">
              18 operational interventions executed.
            </p>
          </div>
        </div>

      </div>

      {/* Footer Node Metadata */}
      <div className="pt-3 border-t border-white/[0.06] text-[10px] text-slate-400/70 font-mono flex items-center justify-between px-2">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          MUMBAI CLUSTER
        </span>
        <span className="text-cyan-400 font-semibold">AP-SOUTH-1</span>
      </div>
    </aside>
  );
};
