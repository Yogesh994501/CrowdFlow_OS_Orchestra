import React, { useState } from 'react';
import { useCrowdFlowStore } from '../../store/useCrowdFlowStore';
import { HyperspeedBackground } from '../backgrounds/HyperspeedBackground';
import { 
  ArrowRight, 
  Smartphone, 
  Activity, 
  ShieldCheck, 
  Layers, 
  Navigation, 
  Zap,
  Radio
} from 'lucide-react';

export const LandingScreen: React.FC = () => {
  const { setActiveScreen, setRole } = useCrowdFlowStore();
  const [isWarping, setIsWarping] = useState(false);

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
    <div className="relative min-h-screen bg-[#070A0F] text-[#F8FAFC] overflow-hidden flex flex-col justify-between selection:bg-cyan-500/30">
      
      {/* 1. Procedural Hyperspeed Background (Section 1) */}
      <HyperspeedBackground isAccelerating={isWarping} />

      {/* 2. Minimal Transparent Top Navigation (Section 1) */}
      <header className="relative z-20 w-full px-6 lg:px-12 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
            <Activity className="w-4 h-4 text-cyan-electric" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-white font-mono">
            CrowdFlow<span className="text-cyan-electric">OS</span>
          </span>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-electric border border-cyan-500/20 ml-1">
            Mumbai 2026
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExploreAttendee}
            className="text-xs font-mono text-[#94A3B8] hover:text-white transition-colors hidden sm:flex items-center gap-1.5"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Attendee View</span>
          </button>
          <button
            onClick={handleEnterCommandCenter}
            className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-[#141A26] hover:bg-[#1E273A] border border-white/[0.08] hover:border-cyan-500/30 transition-all flex items-center gap-1.5"
          >
            <span>Live Console</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* 3. Hero Content & Telemetry Section */}
      <main className="relative z-20 max-w-7xl mx-auto px-6 lg:px-12 py-12 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content (Section 1) */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0E121B]/80 border border-white/[0.08] text-xs font-mono backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[#94A3B8]">Mega-Event Intelligence Platform</span>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-electric font-bold block">
                CROWDFLOW OS
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#F8FAFC] tracking-tight leading-[1.08]">
                Orchestrating the city before the crowd arrives.
              </h1>
            </div>

            <p className="text-base sm:text-lg text-[#94A3B8] max-w-xl font-normal leading-relaxed">
              Predict demand. Simulate disruption. Redirect movement. Coordinate the entire event hospitality and mobility ecosystem from one intelligent platform.
            </p>

            {/* CTAs with Hyperspeed Transition (Section 1 & 10) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={handleEnterCommandCenter}
                disabled={isWarping}
                className="h-12 px-6 rounded-xl text-xs font-bold font-mono tracking-wider uppercase text-[#090B10] bg-cyan-electric hover:bg-cyan-400 transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_-5px_rgba(34,211,238,0.4)]"
              >
                <span>{isWarping ? 'Entering Intelligence Grid...' : 'Enter Command Center →'}</span>
                {!isWarping && <ArrowRight className="w-4 h-4" />}
              </button>

              <button
                onClick={handleExploreAttendee}
                className="h-12 px-6 rounded-xl text-xs font-mono font-medium text-[#94A3B8] hover:text-white bg-[#0E121B]/80 hover:bg-[#141A26] border border-white/[0.08] transition-all flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4 text-cyan-electric" />
                <span>Explore Attendee Experience</span>
              </button>
            </div>

            {/* Micro proof points */}
            <div className="flex items-center gap-6 pt-4 text-xs font-mono text-[#94A3B8]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Explainable AI Playbooks
              </span>
              <span className="flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-cyan-electric" />
                Real-Time State Sync
              </span>
            </div>

          </div>

          {/* Right: Floating Integrated Telemetry Objects (Section 1) */}
          <div className="lg:col-span-5 space-y-3.5 relative">
            
            {/* Ambient backdrop glow */}
            <div className="absolute -inset-4 bg-cyan-500/5 rounded-3xl blur-2xl pointer-events-none"></div>

            {/* Telemetry Element 1: Pressure Score */}
            <div className="p-4 rounded-2xl bg-[#0E121B]/90 border border-white/[0.08] backdrop-blur-md space-y-1.5 relative">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#94A3B8] uppercase">Metropolitan Pressure</span>
                <span className="text-amber-400 font-bold">WATCH</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono text-white">67 <span className="text-xs text-[#94A3B8] font-normal">/ 100</span></span>
                <span className="text-xs font-mono text-cyan-electric">BKC • Dadar • Virār</span>
              </div>
              <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-400 via-amber-400 to-rose-400 w-[67%]"></div>
              </div>
            </div>

            {/* Telemetry Element 2: Crowd Flow & Influx */}
            <div className="p-4 rounded-2xl bg-[#0E121B]/90 border border-white/[0.08] backdrop-blur-md flex items-center justify-between relative">
              <div>
                <span className="text-[10px] font-mono text-[#94A3B8] uppercase block">Crowd Inflow Rate</span>
                <div className="text-xl font-bold font-mono text-white">14,200 <span className="text-xs text-[#94A3B8] font-sans">attendees/hr</span></div>
              </div>
              <span className="text-xs font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                +8.2% Inbound
              </span>
            </div>

            {/* Telemetry Element 3: Transit Headway */}
            <div className="p-4 rounded-2xl bg-[#0E121B]/90 border border-white/[0.08] backdrop-blur-md flex items-center justify-between relative">
              <div>
                <span className="text-[10px] font-mono text-[#94A3B8] uppercase block">Multimodal Transit Load</span>
                <div className="text-xl font-bold font-mono text-white">76% <span className="text-xs text-[#94A3B8] font-sans">Capacity</span></div>
              </div>
              <span className="text-xs font-mono text-cyan-electric px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                20 Corridors
              </span>
            </div>

            {/* Telemetry Element 4: Active Orchestration Zones */}
            <div className="p-4 rounded-2xl bg-[#0E121B]/90 border border-white/[0.08] backdrop-blur-md flex items-center justify-between relative">
              <div>
                <span className="text-[10px] font-mono text-[#94A3B8] uppercase block">Synchronized Zones</span>
                <div className="text-xl font-bold font-mono text-white">8 Districts Active</div>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                <span className="text-xs font-mono text-[#94A3B8] ml-1">Live Synced</span>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="relative z-20 w-full px-6 lg:px-12 py-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-[#94A3B8]/60">
        <span>CrowdFlow OS • Mumbai Mega Event Orchestration 2026</span>
        <span>FLOW → DETECTION → PREDICTION → INTERVENTION → IMPACT</span>
      </footer>

    </div>
  );
};
