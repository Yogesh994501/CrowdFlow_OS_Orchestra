import React, { useState } from 'react';
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
  ChevronLeft,
  ChevronRight,
  Radio
} from 'lucide-react';

interface SidebarNavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | null;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const { activeScreen, setActiveScreen, alerts, interventions } = useCrowdFlowStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const pendingInterventions = interventions.filter(i => i.status === 'pending');
  const criticalAlerts = alerts.filter(a => a.severity === 'critical');

  const overviewNav: SidebarNavItem[] = [
    { id: 'overview', label: 'Command Center', icon: LayoutDashboard, badge: null },
    { id: 'map', label: 'Live City Map', icon: MapPin, badge: 'Live', badgeColor: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/25' },
  ];

  const intelligenceNav: SidebarNavItem[] = [
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

  const predictiveNav: SidebarNavItem[] = [
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

  const attendeeNav: SidebarNavItem[] = [
    { id: 'attendee', label: 'Attendee Portal', icon: Smartphone, badge: 'App', badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  ];

  const renderNavGroup = (title: string, items: SidebarNavItem[]) => (
    <div className="space-y-1">
      {!isCollapsed && (
        <div className="text-xs font-mono uppercase tracking-widest text-slate-400 px-3 py-1 font-semibold select-none">
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
            title={isCollapsed ? item.label : undefined}
            tabIndex={0}
            aria-label={`Navigate to ${item.label}`}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2 py-2.5' : 'justify-between px-3 py-2'} rounded-xl text-xs font-medium transition-all group relative ${
              isActive
                ? 'glass-tab-active text-slate-100 font-semibold shadow-md'
                : 'glass-tab text-slate-300 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {isActive && (
                <span className="absolute -left-3 w-1.5 h-5 bg-cyan-400 rounded-r-full shadow-[0_0_12px_rgba(6,182,212,0.8)]" />
              )}
              <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-cyan-300' : 'text-slate-400 group-hover:text-cyan-300'}`} />
              {!isCollapsed && <span className="tracking-tight truncate">{item.label}</span>}
            </div>
            {!isCollapsed && item.badge && (
              <span className={`text-xs font-mono px-2 py-0.5 rounded border ${item.badgeColor} shrink-0`}>
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
      className={`${isCollapsed ? 'w-16' : 'w-64'} shrink-0 hidden md:flex flex-col justify-between p-3 min-h-[calc(100vh-64px)] sticky top-16 z-30 glass-sidebar transition-all duration-300`}
    >
      <div className="space-y-4">
        
        {/* Collapse / Expand Toggle Button */}
        <div className="flex items-center justify-end pb-1 border-b border-white/[0.06]">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg glass-tab text-slate-400 hover:text-white transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Navigation Group 1: Event Overview */}
        {renderNavGroup('EVENT OVERVIEW', overviewNav)}

        <div className="h-[1px] bg-white/[0.06] mx-2" />

        {/* Navigation Group 2: Crowd Intelligence */}
        {renderNavGroup('CROWD INTELLIGENCE', intelligenceNav)}

        <div className="h-[1px] bg-white/[0.06] mx-2" />

        {/* Navigation Group 3: Predictive Labs */}
        {renderNavGroup('PREDICTIVE LABS', predictiveNav)}

        <div className="h-[1px] bg-white/[0.06] mx-2" />

        {/* Navigation Group 4: End-User Guidance */}
        {renderNavGroup('END-USER GUIDANCE', attendeeNav)}

        {/* Adoption Rate Insight (When expanded) */}
        {!isCollapsed && (
          <div className="pt-2 px-1">
            <div className="p-3 rounded-xl glass-tab space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="tracking-wider uppercase">Live Adoption</span>
                <span className="text-emerald-400 font-bold">+5.2%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold font-mono text-slate-100">68%</span>
                <div className="flex-1 h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full" style={{ width: '68%' }} />
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-snug">
                18 active interventions synchronized across venue grid.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Footer Node Metadata */}
      <div className="pt-3 border-t border-white/[0.06] text-xs text-slate-400 font-mono flex items-center justify-between px-2">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          {!isCollapsed && <span>MUMBAI CLUSTER</span>}
        </span>
        <span className="text-cyan-400 font-semibold">{isCollapsed ? 'AP' : 'AP-SOUTH-1'}</span>
      </div>
    </aside>
  );
};

