import React, { useState, useEffect } from 'react';
import { useCrowdFlowStore } from '../../store/useCrowdFlowStore';
import type { UserRole, DemoScenario, ScreenType } from '../../types';
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
  Database,
  Menu,
  LayoutDashboard,
  MapPin,
  Building2,
  ShieldAlert,
  Sparkles,
  FlaskConical,
  GitBranch,
  Sliders
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
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [secondsAgo, setSecondsAgo] = useState(2);
  const [roleToast, setRoleToast] = useState<string | null>(null);

  const handleRoleSwitch = (role: UserRole) => {
    const label = roles.find(r => r.role === role)?.label || role;
    setRole(role);
    setRoleToast(`Switched to ${label}`);
    setTimeout(() => setRoleToast(null), 3000);
  };

  // Live updated ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsAgo(prev => (prev >= 3 ? 1 : prev + 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // ESC key dismissal for accessible drawer control
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileDrawerOpen(false);
      }
    };
    if (isMobileDrawerOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileDrawerOpen]);

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
          
          {/* Left: Hamburger (Mobile) & Operation Breadcrumb & Brand */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Operator Mobile Drawer Hamburger Button */}
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="md:hidden p-2 rounded-xl glass-tab text-slate-300 hover:text-white transition-colors"
              title="Open Operator Navigation"
            >
              <Menu className="w-4 h-4 text-cyan-400" />
            </button>

            <div 
              onClick={() => setActiveScreen('overview')}
              className="flex items-center gap-2.5 cursor-pointer group select-none"
            >
              <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.25)]">
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

            {/* Real-time Status & Live Updated Ticker */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-bold">LIVE</span>
              <span className="text-slate-400">· {secondsAgo}s ago</span>
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
              <span className="text-slate-400">•</span>
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
                <div className="text-xs font-mono uppercase tracking-wider text-slate-400 px-2 py-1 border-b border-white/[0.06] mb-1">
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
              className="relative p-1.5 rounded-lg glass-tab text-slate-400 hover:text-white transition-colors"
              title="Operational Alerts"
            >
              <Bell className="w-4 h-4" />
              {unreadAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-xs font-mono font-bold flex items-center justify-center">
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
                  : 'glass-tab text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Phone Frame</span>
            </button>

            {/* Role Switcher */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-2.5 py-1 rounded-lg glass-tab hover:border-cyan-500/40 transition-colors text-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-electric"></span>
                <span className="text-slate-50 font-semibold">
                  {roles.find(r => r.role === currentRole)?.label || 'Organizer'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400 group-hover:rotate-180 transition-transform" />
              </button>

              <div className="absolute right-0 mt-1 w-56 rounded-xl glass-overlay p-1.5 shadow-2xl opacity-0 translate-y-1 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all z-50">
                <div className="text-xs font-mono uppercase tracking-wider text-slate-400 px-2 py-1 border-b border-white/[0.08] mb-1">
                  Active User Role:
                </div>
                {roles.map(r => {
                  const Icon = r.icon;
                  const isSelected = currentRole === r.role;
                  return (
                    <button
                      key={r.role}
                      onClick={() => handleRoleSwitch(r.role)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs font-mono transition-colors ${
                        isSelected
                          ? 'bg-cyan-500/20 text-cyan-electric font-semibold border border-cyan-500/30'
                          : 'text-slate-400 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5" />
                        {r.label}
                      </span>
                      {isSelected && <span className="text-xs text-cyan-electric">●</span>}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </header>

      {/* Role Switch Toast Notification */}
      {roleToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className="px-5 py-2.5 rounded-xl bg-dark-900/95 backdrop-blur-xl border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.2)] text-sm font-mono text-cyan-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            {roleToast}
          </div>
        </div>
      )}

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
              <ul className="space-y-1.5 list-disc list-inside text-slate-400">
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
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 font-bold">
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
                    <span className="font-mono text-xs text-cyan-electric font-bold uppercase">
                      {alert.zoneName}
                    </span>
                    <span className="font-mono text-xs text-slate-400">
                      {alert.timestamp}
                    </span>
                  </div>
                  <div className="font-semibold text-white leading-tight">
                    {alert.title}
                  </div>
                  <div className="text-slate-400 text-xs line-clamp-2">
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
              className="w-full py-2.5 rounded-xl text-xs font-semibold glass-tab text-cyan-300 hover:text-cyan-200 transition-colors shadow-sm font-mono"
            >
              Open Full Alert Center ({alerts.length})
            </button>
          </div>
        </div>
      )}

      {/* Operator Mobile Navigation Drawer (< md screens) */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden animate-fade-in">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-md" 
            onClick={() => setIsMobileDrawerOpen(false)} 
          />

          {/* Drawer Content */}
          <div className="relative w-80 max-w-[85vw] h-full glass-overlay border-r border-white/10 p-5 flex flex-col justify-between overflow-y-auto z-10 animate-slide-right">
            <div className="space-y-5">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center">
                    <Activity className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">CrowdFlow <span className="text-cyan-400 font-mono text-xs">OS</span></div>
                    <div className="text-xs text-slate-400 font-mono">Mission Control</div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1.5 rounded-lg glass-tab text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation Categories */}
              <div className="space-y-4 text-xs font-mono">
                {/* Event Overview */}
                <div className="space-y-1">
                  <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold px-2 py-0.5">
                    EVENT OVERVIEW
                  </div>
                  <button
                    onClick={() => { setActiveScreen('overview'); setIsMobileDrawerOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all ${
                      activeScreen === 'overview' ? 'glass-tab-active font-bold text-white' : 'glass-tab text-slate-300'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                    <span>Command Center</span>
                  </button>
                  <button
                    onClick={() => { setActiveScreen('map'); setIsMobileDrawerOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all ${
                      activeScreen === 'map' ? 'glass-tab-active font-bold text-white' : 'glass-tab text-slate-300'
                    }`}
                  >
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <span>Live City Map</span>
                  </button>
                </div>

                {/* Crowd Intelligence */}
                <div className="space-y-1">
                  <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold px-2 py-0.5">
                    CROWD INTELLIGENCE
                  </div>
                  <button
                    onClick={() => { setActiveScreen('capacity'); setIsMobileDrawerOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all ${
                      activeScreen === 'capacity' ? 'glass-tab-active font-bold text-white' : 'glass-tab text-slate-300'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-amber-400" />
                    <span>Capacity Intelligence</span>
                  </button>
                  <button
                    onClick={() => { setActiveScreen('mobility'); setIsMobileDrawerOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all ${
                      activeScreen === 'mobility' ? 'glass-tab-active font-bold text-white' : 'glass-tab text-slate-300'
                    }`}
                  >
                    <Bus className="w-4 h-4 text-indigo-400" />
                    <span>Mobility Control</span>
                  </button>
                  <button
                    onClick={() => { setActiveScreen('alerts'); setIsMobileDrawerOpen(false); }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                      activeScreen === 'alerts' ? 'glass-tab-active font-bold text-white' : 'glass-tab text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <ShieldAlert className="w-4 h-4 text-rose-400" />
                      <span>Alert Center</span>
                    </div>
                    {unreadAlerts.length > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs">
                        {unreadAlerts.length}
                      </span>
                    )}
                  </button>
                </div>

                {/* Predictive Labs */}
                <div className="space-y-1">
                  <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold px-2 py-0.5">
                    PREDICTIVE LABS
                  </div>
                  <button
                    onClick={() => { setActiveScreen('interventions'); setIsMobileDrawerOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all ${
                      activeScreen === 'interventions' ? 'glass-tab-active font-bold text-white' : 'glass-tab text-slate-300'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>Interventions</span>
                  </button>
                  <button
                    onClick={() => { setActiveScreen('simulation'); setIsMobileDrawerOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all ${
                      activeScreen === 'simulation' ? 'glass-tab-active font-bold text-white' : 'glass-tab text-slate-300'
                    }`}
                  >
                    <FlaskConical className="w-4 h-4 text-indigo-400" />
                    <span>Simulation Lab</span>
                  </button>
                  <button
                    onClick={() => { setActiveScreen('dependency'); setIsMobileDrawerOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all ${
                      activeScreen === 'dependency' ? 'glass-tab-active font-bold text-white' : 'glass-tab text-slate-300'
                    }`}
                  >
                    <GitBranch className="w-4 h-4 text-slate-300" />
                    <span>Resource Cascades</span>
                  </button>
                  <button
                    onClick={() => { setActiveScreen('operators'); setIsMobileDrawerOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all ${
                      activeScreen === 'operators' ? 'glass-tab-active font-bold text-white' : 'glass-tab text-slate-300'
                    }`}
                  >
                    <Sliders className="w-4 h-4 text-slate-300" />
                    <span>Operator Hubs</span>
                  </button>
                </div>

                {/* End-User Guidance */}
                <div className="space-y-1">
                  <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold px-2 py-0.5">
                    END-USER GUIDANCE
                  </div>
                  <button
                    onClick={() => { setActiveScreen('attendee'); setIsMobileDrawerOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all ${
                      activeScreen === 'attendee' ? 'glass-tab-active font-bold text-white' : 'glass-tab text-emerald-400'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span>Attendee Portal</span>
                  </button>
                </div>

                {/* Mobile Operational Scenario Picker */}
                <div className="space-y-1.5 pt-2 border-t border-white/10">
                  <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold px-2">
                    SIMULATION SCENARIO
                  </div>
                  <select
                    value={currentScenario}
                    onChange={e => { setScenario(e.target.value as any); setIsMobileDrawerOpen(false); }}
                    className="w-full bg-dark-900 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500/50"
                  >
                    {scenarios.map(s => (
                      <option key={s.id} value={s.id} className="bg-dark-950 text-white">
                        {s.label} ({s.tag})
                      </option>
                    ))}
                  </select>
                </div>

              </div>

            </div>

            {/* Bottom Status */}
            <div className="pt-4 border-t border-white/10 space-y-2 text-xs font-mono text-slate-400">
              <div className="flex items-center justify-between">
                <span>Cluster Node:</span>
                <span className="text-cyan-400 font-bold">MUMBAI-AP-1</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Weather Risk:</span>
                <span className="text-slate-200">{weather.weatherRisk}% · {weather.condition}</span>
              </div>
            </div>

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

