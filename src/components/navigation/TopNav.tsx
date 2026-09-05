import React, { useState } from 'react';
import { useCrowdFlowStore } from '../../store/useCrowdFlowStore';
import type { UserRole, DemoScenario } from '../../types';
import { DemoModeBadge } from '../common/DemoModeBadge';
import { 
  Users, 
  Hotel, 
  Bus, 
  Utensils, 
  Smartphone, 
  Bell, 
  ChevronDown, 
  Info, 
  Activity, 
  Calendar,
  CloudRain,
  SlidersHorizontal,
  X,
  Database
} from 'lucide-react';
import { DataSourcesDrawer } from '../common/DataSourcesDrawer';

export const TopNav: React.FC = () => {
  const { 
    currentRole, 
    setRole, 
    currentScenario, 
    setScenario, 
    alerts, 
    weather,
    isMobileDeviceFrame,
    toggleMobileDeviceFrame,
    setActiveScreen,
    activeScreen
  } = useCrowdFlowStore();

  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isDataSourcesOpen, setIsDataSourcesOpen] = useState(false);

  const unreadAlerts = alerts.filter(a => !a.acknowledged);

  const roles: { role: UserRole; label: string; icon: React.ElementType }[] = [
    { role: 'organizer', label: 'Event Organizer', icon: Users },
    { role: 'hotel', label: 'Hotel Operator', icon: Hotel },
    { role: 'transport', label: 'Transport Ops', icon: Bus },
    { role: 'restaurant', label: 'Dining Operator', icon: Utensils },
    { role: 'attendee', label: 'Attendee Portal', icon: Smartphone },
  ];

  const scenarios: { id: DemoScenario; label: string; tag: string }[] = [
    { id: 'normal', label: '1. Normal Operations', tag: 'Balanced Flow' },
    { id: 'hotel_saturation', label: '2. Hotel Saturation', tag: 'BKC/Dadar 96%+' },
    { id: 'heavy_rain', label: '3. Heavy Monsoon Exit', tag: 'Rain 78% + Delays' },
    { id: 'metro_disruption', label: '4. Metro Line 3 Disruption', tag: 'Rail Divert' },
    { id: 'gate_closure', label: '5. Gate 1 Perimeter Hold', tag: 'Queue Surge' },
    { id: 'demand_surge', label: '6. Suburban Demand Surge', tag: '+30% Influx' },
  ];

  return (
    <>
      <header 
        className="sticky top-0 z-40 w-full px-4 lg:px-6 h-16 flex items-center glass-header"
      >
        <div className="flex items-center justify-between w-full gap-4">
          
          {/* Left: Operation Breadcrumb & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div 
              onClick={() => setActiveScreen('overview')}
              className="flex items-center gap-2.5 cursor-pointer group select-none"
            >
              <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_12px_rgba(34,211,238,0.25)]">
                <Activity className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-sm tracking-tight text-slate-100">
                  CrowdFlow <span className="text-cyan-400 font-mono text-xs">OS</span>
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline font-mono">
                  / {activeScreen.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="h-4 w-[1px] bg-white/[0.08] hidden md:block"></div>

            {/* Event Context Pill */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full glass-tab text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="text-slate-200 font-semibold">Mumbai Mega Event 2026</span>
              <span className="text-slate-400 font-mono">• Day 1</span>
            </div>
          </div>

          {/* Right Controls: Grouped Operational Status */}
          <div className="flex items-center gap-2.5">
            
            {/* Live Demo Status */}
            <DemoModeBadge />

            {/* Weather & Date Info */}
            <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-slate-300 px-3 py-1.5 rounded-xl glass-tab">
              <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
              <span>{weather.temperature}°C</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">{weather.condition}</span>
            </div>

            <div className="h-4 w-[1px] bg-white/[0.08] hidden sm:block"></div>

            {/* Unified Data Sources Indicator */}
            <button
              onClick={() => setIsDataSourcesOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass-tab text-slate-300 hover:text-white transition-all text-xs font-mono"
              title="View Central Data Sources & Failover Status"
            >
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden xl:inline">Data Sources</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"></span>
            </button>

            {/* Scenario Picker */}
            <div className="relative group hidden xl:block">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-tab text-xs font-mono text-slate-300 cursor-pointer transition-colors">
                <SlidersHorizontal className="w-3 h-3 text-cyan-400" />
                <span className="text-slate-200 font-medium">
                  {scenarios.find(s => s.id === currentScenario)?.label.split('. ')[1] || 'Normal'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400 group-hover:rotate-180 transition-transform" />
              </div>

              {/* Dropdown */}
              <div className="absolute right-0 mt-1 w-64 rounded-2xl glass-overlay p-2 shadow-2xl opacity-0 translate-y-1 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all z-50">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2 py-1 border-b border-white/[0.06] mb-1">
                  Demo Scenarios:
                </div>
                {scenarios.map(sc => (
                  <button
                    key={sc.id}
                    onClick={() => setScenario(sc.id)}
                    className={`w-full text-left px-2.5 py-2 rounded-xl text-xs font-mono flex items-center justify-between transition-colors ${
                      currentScenario === sc.id
                        ? 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30'
                        : 'text-slate-300 hover:bg-white/[0.05] hover:text-white'
                    }`}
                  >
                    <span>{sc.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications Button */}
            <button
              onClick={() => setIsNotificationDrawerOpen(!isNotificationDrawerOpen)}
              className="relative p-1.5 rounded-lg glass-tab text-[#94A3B8] hover:text-white transition-colors"
              title="Operational Alerts"
            >
              <Bell className="w-4 h-4" />
              {unreadAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[9px] font-mono font-bold flex items-center justify-center">
                  {unreadAlerts.length}
                </span>
              )}
            </button>

            {/* Mobile Companion Frame Toggle (for desktop testing) */}
            <button
              onClick={toggleMobileDeviceFrame}
              title={isMobileDeviceFrame ? "Close Phone Companion" : "Open Phone Companion"}
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono border transition-colors ${
                isMobileDeviceFrame
                  ? 'bg-cyan-500/20 text-cyan-electric border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                  : 'glass-tab text-[#94A3B8] hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Phone Frame</span>
            </button>

            {/* Role Switcher */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-2.5 py-1 rounded-lg glass-tab hover:border-cyan-500/40 transition-colors text-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-electric"></span>
                <span className="text-[#F8FAFC] font-semibold">
                  {roles.find(r => r.role === currentRole)?.label || 'Organizer'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400 group-hover:rotate-180 transition-transform" />
              </button>

              <div className="absolute right-0 mt-1 w-56 rounded-xl glass-overlay p-1.5 shadow-2xl opacity-0 translate-y-1 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all z-50">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2 py-1 border-b border-white/[0.08] mb-1">
                  Active User Role:
                </div>
                {roles.map(r => {
                  const Icon = r.icon;
                  const isSelected = currentRole === r.role;
                  return (
                    <button
                      key={r.role}
                      onClick={() => setRole(r.role)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs font-mono transition-colors ${
                        isSelected
                          ? 'bg-cyan-500/20 text-cyan-electric font-semibold border border-cyan-500/30'
                          : 'text-[#94A3B8] hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5" />
                        {r.label}
                      </span>
                      {isSelected && <span className="text-[10px] text-cyan-electric">●</span>}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </header>

      {/* System Health Explainability Modal */}
      {isHealthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl glass-overlay p-6 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">System Health Assessment</h3>
                  <p className="text-xs font-mono text-amber-400">Status: WATCH (Score: 64/100)</p>
                </div>
              </div>
              <button 
                onClick={() => setIsHealthModalOpen(false)}
                className="p-1.5 rounded-lg glass-tab text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl glass-tab text-xs text-slate-300 space-y-2">
              <div className="font-semibold text-white">Why is CrowdFlow OS currently in WATCH status?</div>
              <ul className="space-y-1.5 list-disc list-inside text-[#94A3B8]">
                <li><strong className="text-rose-400">BKC (Bandra-Kurla Complex):</strong> Accommodation occupancy reached 96% with 14,200 incoming arrivals predicted.</li>
                <li><strong className="text-amber-400">Dadar Transit Core:</strong> Platform interchange density approaches safe physical margins.</li>
                <li><strong className="text-emerald-400">Buffer Reserves Healthy:</strong> Virār and Navi Mumbai offer 1,830+ available beds and &lt;45% transit load to absorb demand.</li>
              </ul>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsHealthModalOpen(false)}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold glass-tab text-white shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Drawer */}
      {isNotificationDrawerOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 glass-overlay border-l border-white/15 shadow-2xl p-5 flex flex-col justify-between animate-slide-up">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-cyan-electric" />
                <h3 className="font-bold text-sm text-white">Active Operational Alerts</h3>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30">
                  {unreadAlerts.length}
                </span>
              </div>
              <button 
                onClick={() => setIsNotificationDrawerOpen(false)}
                className="p-1.5 rounded-lg glass-tab text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-[calc(100vh-140px)] overflow-y-auto pr-1">
              {alerts.slice(0, 6).map(alert => (
                <div 
                  key={alert.id}
                  onClick={() => {
                    setActiveScreen('alerts');
                    setIsNotificationDrawerOpen(false);
                  }}
                  className="p-3 rounded-xl glass-tab hover:border-cyan-400/40 text-xs cursor-pointer transition-all space-y-1 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-cyan-electric font-bold uppercase">
                      {alert.zoneName}
                    </span>
                    <span className="font-mono text-[10px] text-slate-500">
                      {alert.timestamp}
                    </span>
                  </div>
                  <div className="font-semibold text-white leading-tight">
                    {alert.title}
                  </div>
                  <div className="text-[#94A3B8] text-[11px] line-clamp-2">
                    {alert.message}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.08]">
            <button
              onClick={() => {
                setActiveScreen('alerts');
                setIsNotificationDrawerOpen(false);
              }}
              className="w-full py-2 rounded-xl text-xs font-semibold glass-tab text-cyan-electric hover:text-cyan-300 transition-colors shadow-sm"
            >
              Open Full Alert Center ({alerts.length})
            </button>
          </div>
        </div>
      )}

      {/* Central Data Sources & Failover Status Drawer */}
      <DataSourcesDrawer 
        isOpen={isDataSourcesOpen} 
        onClose={() => setIsDataSourcesOpen(false)} 
      />
    </>
  );
};
