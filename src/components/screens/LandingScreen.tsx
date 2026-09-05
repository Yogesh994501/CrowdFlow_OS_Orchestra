import React, { useState } from 'react';
import { useCrowdFlowStore } from '../../store/useCrowdFlowStore';
import { HyperspeedBackground } from '../backgrounds/HyperspeedBackground';
import { 
  ArrowRight, 
  Smartphone, 
  Activity, 
  ShieldCheck, 
  ShieldAlert,
  Radio,
  Building2,
  CheckCircle2
} from 'lucide-react';

export const LandingScreen: React.FC = () => {
  const { setActiveScreen, setRole, zones, alerts } = useCrowdFlowStore();
  const [isWarping, setIsWarping] = useState(false);

  const totalVisitors = zones.reduce((acc, z) => acc + z.activeVisitors, 0);
  const activeAttendees = totalVisitors > 0 ? totalVisitors : 48392;
  const operationalZones = zones.length > 0 ? zones.length : 12;
  const criticalAlertsCount = alerts.filter(a => a.severity === 'critical').length || 2;

  const handleEnterCommandCenter = () => {
    setIsWarping(true);
    setTimeout(() => {
      setActiveScreen('overview');
    }, 550);
  };

  const handleExploreAttendee = () => {
    setRole('attendee');
    setActiveScreen('attendee');
  };

  return (
    <div className="relative min-h-screen bg-[#060A12] text-[#F8FAFC] overflow-hidden flex flex-col justify-between selection:bg-cyan-500/30">
      
      {/* 1. Hyperspeed Environmental Layer */}
      <HyperspeedBackground isAccelerating={isWarping} />

      {/* 2. Top Global Command Bar */}
      <header className="relative z-20 w-full px-6 lg:px-12 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_16px_rgba(6,182,212,0.3)]">
            <Activity className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-extrabold text-base tracking-tight text-white font-mono">
              CROWDFLOW <span className="text-cyan-400">OS</span>
            </span>
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">
              MUMBAI 2026
            </span>
          </div>
        </div>

        {/* System Live Beacon & Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-xs font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold tracking-wider uppercase">SYSTEM LIVE</span>
          </div>

          <button
            onClick={handleExploreAttendee}
            className="text-xs font-mono text-slate-300 hover:text-white transition-colors hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-tab"
          >
            <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
            <span>Attendee App</span>
          </button>
          
          <button
            onClick={handleEnterCommandCenter}
            className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-[#0E172A] hover:bg-[#1E293B] border border-white/10 hover:border-cyan-400/40 text-cyan-300 hover:text-white transition-all flex items-center gap-1.5 shadow-md"
          >
            <span>Enter Console</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* 3. Hero Section (Section 2 Checklist Structure) */}
      <main className="relative z-20 max-w-7xl mx-auto px-6 lg:px-12 py-10 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Details */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-300 backdrop-blur-md">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Mission Control • Intelligent Mega-Event Operations</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
                Intelligent Orchestration for Mega Events
              </h1>
              <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-xl">
                Monitor crowds. Predict congestion. Coordinate hospitality. Optimize movement before bottlenecks occur.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={handleEnterCommandCenter}
                disabled={isWarping}
                className="h-12 px-7 rounded-xl text-xs font-bold font-mono tracking-wider uppercase text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(6,182,212,0.4)] active:scale-95"
              >
                <span>{isWarping ? 'Engaging Operations Grid...' : 'Enter Command Center'}</span>
                {!isWarping && <ArrowRight className="w-4 h-4" />}
              </button>

              <button
                onClick={handleExploreAttendee}
                className="h-12 px-6 rounded-xl text-xs font-mono font-semibold text-slate-200 hover:text-white glass-tab transition-all flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>Explore Platform</span>
              </button>
            </div>

            {/* Micro Guarantees */}
            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Explainable Decision Intelligence
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                Zero Freemium API Lock-in
              </span>
            </div>

          </div>

          {/* Right: Operational Telemetry Radar Object */}
          <div className="lg:col-span-5 space-y-3.5 relative">
            
            <div className="p-5 rounded-2xl panel-elevated space-y-3 relative shadow-2xl">
              <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-white/[0.08]">
                <span className="text-slate-400 uppercase tracking-wider font-semibold">Venue Grid Status</span>
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  ELEVATED WATCH
                </span>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <div className="text-3xl font-extrabold font-mono text-white">67 <span className="text-xs text-slate-400 font-normal">/ 100</span></div>
                  <div className="text-xs text-slate-300 font-sans mt-0.5">Composite Metropolitan Pressure</div>
                </div>
                <span className="text-xs font-mono text-cyan-300 bg-cyan-500/10 px-2 py-1 rounded-lg border border-cyan-500/20">
                  BKC · Dadar · Virār
                </span>
              </div>

              {/* Progress Gauge */}
              <div className="h-2 w-full bg-white/[0.08] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 w-[67%]"></div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="text-slate-400">Transit Load</div>
                  <div className="text-sm font-bold text-white mt-0.5">76% Dynamic</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="text-slate-400">Hospitality Surge</div>
                  <div className="text-sm font-bold text-amber-300 mt-0.5">96% BKC Hub</div>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* 4. Live Metric Pillars (Section 2 Checklist Exact Structure) */}
        <div className="mt-14 pt-8 border-t border-white/[0.08] grid grid-cols-2 md:grid-cols-4 gap-6">
          
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
              {activeAttendees.toLocaleString()}
            </div>
            <div className="text-xs font-medium text-slate-400 font-sans">
              Active Attendees
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-cyan-300 tracking-tight">
              {operationalZones}
            </div>
            <div className="text-xs font-medium text-slate-400 font-sans">
              Operational Zones
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-400 tracking-tight">
              97.8%
            </div>
            <div className="text-xs font-medium text-slate-400 font-sans">
              System Readiness
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-rose-400 tracking-tight flex items-center gap-2">
              <span>{criticalAlertsCount}</span>
              <ShieldAlert className="w-5 h-5 text-rose-400 opacity-80" />
            </div>
            <div className="text-xs font-medium text-slate-400 font-sans">
              Critical Alerts
            </div>
          </div>

        </div>

      </main>

      {/* Minimal Enterprise Footer */}
      <footer className="relative z-20 w-full px-6 lg:px-12 py-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-slate-400">
        <span>CrowdFlow OS • Mumbai Mega Event Orchestration 2026</span>
        <span className="hidden sm:inline">FLOW → DETECTION → PREDICTION → INTERVENTION → IMPACT</span>
      </footer>

    </div>
  );
};

