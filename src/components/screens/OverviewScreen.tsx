import React, { useState } from 'react';
import { useCrowdFlowStore } from '../../store/useCrowdFlowStore';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Users, 
  Building2, 
  Bus, 
  Sparkles, 
  ArrowRight, 
  ShieldAlert, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Activity, 
  X, 
  CheckCircle2, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import type { Zone } from '../../types';

export const OverviewScreen: React.FC = () => {
  const { 
    zones, 
    alerts, 
    interventions, 
    setActiveScreen, 
    setSelectedZoneId,
    approveIntervention,
    weather 
  } = useCrowdFlowStore();

  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [justApproved, setJustApproved] = useState(false);

  // Aggregated operational metrics
  const totalVisitors = zones.reduce((acc, z) => acc + z.activeVisitors, 0);
  const avgOccupancy = Math.round(zones.reduce((acc, z) => acc + z.accommodationOccupancy, 0) / zones.length);
  const avgTransit = Math.round(zones.reduce((acc, z) => acc + z.transitLoad, 0) / zones.length);
  const systemPressureScore = Math.round(zones.reduce((acc, z) => acc + z.pressureScore, 0) / zones.length);
  const pendingInterventions = interventions.filter(i => i.status === 'pending');
  const criticalAlerts = alerts.filter(a => a.severity === 'critical' || a.severity === 'high');

  const activeIntervention = pendingInterventions[0];

  const timelineSlots = [
    { time: '12:00', isPeak: false },
    { time: '14:00', isPeak: false },
    { time: '16:00', isPeak: false },
    { time: '▲ 18:00 (PEAK)', isPeak: true },
    { time: '20:00', isPeak: false },
  ];

  const handleApprove = (id: string) => {
    approveIntervention(id);
    setJustApproved(true);
    setTimeout(() => setJustApproved(false), 2500);
  };

  // Group zones by status tier for the structured visual matrix (Section 6)
  const criticalZones = zones.filter(z => z.status === 'critical');
  const highZones = zones.filter(z => z.status === 'high');
  const watchZones = zones.filter(z => z.status === 'watch');
  const stableZones = zones.filter(z => z.status === 'stable');

  return (
    <div className="space-y-6 pb-12 max-w-[1520px] mx-auto relative selection:bg-cyan-500/30">
      
      {/* Subtle Ambient Radial Lighting (Section 1) */}
      <div className="absolute -top-12 -right-12 w-96 h-96 rounded-full bg-cyan-500/[0.03] blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 -left-12 w-96 h-96 rounded-full bg-indigo-500/[0.025] blur-3xl pointer-events-none -z-10" />

      {/* ========================================================================= */}
      {/* 1. TOP ROW: SYSTEM HEALTH HERO (7-Cols) + RECOMMENDED ACTION (5-Cols)     */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Dominant Hero: System Status & Radial Pressure Gauge (Prompt Section 3 & 6) */}
        <div className="lg:col-span-7 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl transition-all panel-elevated">
          <div>
            {/* Header meta */}
            <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-white/[0.08]">
              <span className="font-mono uppercase tracking-widest text-xs font-bold text-slate-300 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                SYSTEM OPERATIONS STATUS
              </span>
              <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span>Weather Risk: <strong className="text-cyan-300">{weather.weatherRisk}%</strong> · {weather.condition}</span>
              </div>
            </div>

            {/* Asymmetric Core: Status vs Large Amber Radial Pressure Gauge */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 pt-5 items-center">
              
              {/* Left Side: Status & Concise 2-line narrative */}
              <div className="sm:col-span-7 space-y-2.5">
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-extrabold tracking-tight text-white font-mono">
                    WATCH
                  </span>
                  <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-mono font-medium shadow-[0_0_12px_rgba(245,158,11,0.15)]">
                    Contained Pressure Elevation
                  </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed font-sans">
                  Mumbai operations are stable overall. Bandra-Kurla Complex (BKC) accommodation and Dadar transit require attention before the evening peak.
                </p>
              </div>

              {/* Center/Right: Large Radial Pressure Gauge with Amber Gradient */}
              <div className="sm:col-span-5 flex flex-col items-center sm:items-end justify-center">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                    <defs>
                      <linearGradient id="amberGaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FBBF24" />
                        <stop offset="100%" stopColor="#F59E0B" />
                      </linearGradient>
                      <filter id="gaugeGlow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="rgba(255,255,255,0.06)"
                      strokeWidth="7"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="url(#amberGaugeGrad)"
                      strokeWidth="7"
                      strokeDasharray={2 * Math.PI * 40}
                      strokeDashoffset={2 * Math.PI * 40 * (1 - (systemPressureScore / 100))}
                      strokeLinecap="round"
                      fill="transparent"
                      filter="url(#gaugeGlow)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-extrabold font-mono text-white tracking-tight leading-none">
                      {systemPressureScore}
                    </span>
                    <span className="text-xs font-mono uppercase tracking-widest text-slate-400 mt-1">
                      PRESSURE
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      /100
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Refined Event Timeline Bar (Prompt Section 3 & 6) */}
            <div className="pt-5 mt-4 border-t border-white/[0.08]">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2">
                <span className="tracking-widest uppercase text-slate-300 font-semibold">EVENT TIMELINE & OPERATIONAL SLOTS</span>
                <span className="text-cyan-400">Peak Window: 17:30 - 20:00</span>
              </div>
              <div className="flex items-center justify-between gap-2 pt-1">
                {timelineSlots.map((slot) => (
                  <div key={slot.time} className="flex-1 flex flex-col items-center gap-1.5">
                    <span className={`text-xs font-mono ${slot.isPeak ? 'text-amber-400 font-bold' : 'text-slate-400'}`}>
                      {slot.time}
                    </span>
                    <div 
                      className={`w-full h-3 rounded-full transition-all ${
                        slot.isPeak 
                          ? 'bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.6)]' 
                          : 'bg-white/[0.08] backdrop-blur-sm'
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Primary Bottleneck Action */}
          <div className="pt-4 mt-5 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold">
                PRIMARY BOTTLENECK
              </span>
              <div className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <span>BKC accommodation approaching capacity</span>
                <span className="text-slate-400 font-normal text-xs font-mono">· 96% occupied · +1,240 predicted arrivals</span>
              </div>
            </div>
            
            <button
              onClick={() => {
                setSelectedZoneId('bkc');
                setActiveScreen('capacity');
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass-tab text-xs font-medium text-cyan-300 hover:text-white transition-all shrink-0 font-mono shadow-sm"
            >
              <span>Inspect Bottleneck</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Actionable Recommended Intervention (Prompt Section 3 & 7) */}
        <div className="lg:col-span-5 rounded-2xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden transition-all panel-elevated border-cyan-500/30">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                ✦ RECOMMENDED ACTION
              </span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/25">
                AI Decision Engine
              </span>
            </div>

            {activeIntervention ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-100 tracking-tight">
                    REDIRECT ARRIVALS
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Move 18% of incoming BKC visitors toward Navi Mumbai and Virār buffer hubs.
                  </p>
                </div>

                {/* WHY NOW Callout Box (Prompt Section 3 & 7) */}
                <div className="p-3.5 rounded-xl bg-cyan-500/[0.06] border border-cyan-500/20 space-y-1 text-xs">
                  <div className="text-xs font-mono uppercase tracking-widest text-cyan-300 font-bold">
                    WHY NOW
                  </div>
                  <p className="text-slate-300 leading-relaxed font-sans text-xs">
                    BKC is projected to reach 96% accommodation occupancy before 18:30, with transit headways extending by 6 mins.
                  </p>
                </div>

                {/* Expected Impact Grid */}
                <div className="pt-1">
                  <div className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold mb-2">
                    EXPECTED IMPACT
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-center">
                      <div className="text-lg font-extrabold font-mono text-emerald-400">-12</div>
                      <div className="text-xs text-slate-400 font-mono">Pressure Pts</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-center">
                      <div className="text-lg font-extrabold font-mono text-cyan-300">88%</div>
                      <div className="text-xs text-slate-400 font-mono">Confidence</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-center">
                      <div className="text-lg font-extrabold font-mono text-slate-200">+11m</div>
                      <div className="text-xs text-slate-400 font-mono">Travel Trade-off</div>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-400 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto opacity-80" />
                <p>All recommended interventions have been authorized.</p>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          {activeIntervention && (
            <div className="pt-4 mt-4 border-t border-white/[0.08] flex items-center gap-3">
              <button
                onClick={() => setActiveScreen('interventions')}
                className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Review Plan
              </button>
              <button
                onClick={() => handleApprove(activeIntervention.id)}
                disabled={justApproved}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 text-slate-950 text-xs font-bold font-mono tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(34,211,238,0.3)] active:scale-[0.98]"
              >
                {justApproved ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-slate-950" />
                    <span>APPROVED & EXECUTING</span>
                  </>
                ) : (
                  <>
                    <span>Approve Intervention</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          )}

        </div>

      </div>

      {/* ========================================================================= */}
      {/* DEDICATED ACTIONABLE CRITICAL ALERT (Prompt Section 3 Requirement)        */}
      {/* ========================================================================= */}
      <div className="rounded-2xl p-5 border border-rose-500/40 bg-gradient-to-r from-rose-950/40 via-[#0E1528] to-rose-950/20 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-xs font-bold uppercase tracking-wider border border-rose-500/30">
                  🔴 CRITICAL
                </span>
                <span className="text-white font-bold text-sm">
                  Gate 1 / BKC Perimeter approaching maximum physical capacity
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-300">
                <span className="text-rose-400 font-bold">94% Occupancy</span>
                <span className="text-slate-400">•</span>
                <span className="text-amber-300 flex items-center gap-1 font-semibold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  ↑ 8% increase in the last 10 minutes
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-300">
                  Recommended response: <strong className="text-cyan-300 font-semibold">Redirect incoming attendees toward Gate B & Kurla buffer</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons (Section 3) */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setActiveScreen('interventions')}
              className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-rose-500 hover:bg-rose-400 text-slate-950 transition-all shadow-[0_0_16px_rgba(244,63,94,0.4)]"
            >
              Redirect Flow
            </button>
            <button
              onClick={() => {
                setSelectedZoneId('bkc');
                setActiveScreen('capacity');
              }}
              className="px-3 py-2 rounded-xl text-xs font-mono font-medium glass-tab text-slate-200 hover:text-white transition-all"
            >
              View Zone
            </button>
            <button
              onClick={() => setActiveScreen('operators')}
              className="px-3 py-2 rounded-xl text-xs font-mono font-medium glass-tab text-cyan-300 hover:text-white transition-all"
            >
              Assign Team
            </button>
          </div>
        </div>
      </div>


      {/* ========================================================================= */}
      {/* 2. MIDDLE ROW: 4 DISTINCT GLASS KPI CARDS (Prompt Section 8)                */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         {/* KPI 1: Expected Attendees */}
        <div className="rounded-2xl p-5 transition-all group panel-interactive">
          <div className="flex items-start justify-between">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              +12.4% vs baseline
            </span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold font-mono text-slate-100 tracking-tight">
              184,500
            </div>
            <div className="text-xs font-medium text-slate-300 mt-0.5">
              Expected Attendees
            </div>
          </div>
          {/* Mini Sparkline SVG */}
          <div className="mt-3 pt-2 border-t border-white/[0.04]">
            <svg className="w-full h-5 text-emerald-400/80" viewBox="0 0 100 20" preserveAspectRatio="none">
              <path d="M0 16 Q20 14 40 10 T80 6 T100 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* KPI 2: Active Visitors (Live Data - Cyan) */}
        <div className="rounded-2xl p-5 transition-all group panel-interactive">
          <div className="flex items-start justify-between">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Activity className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono text-cyan-300">
              8 metro zones
            </span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold font-mono text-slate-100 tracking-tight">
              {totalVisitors.toLocaleString()}
            </div>
            <div className="text-xs font-medium text-slate-300 mt-0.5">
              Active Visitors
            </div>
          </div>
          {/* Mini Sparkline SVG */}
          <div className="mt-3 pt-2 border-t border-white/[0.04]">
            <svg className="w-full h-5 text-cyan-400/80" viewBox="0 0 100 20" preserveAspectRatio="none">
              <path d="M0 14 Q25 10 50 12 T75 6 T100 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* KPI 3: Accommodation Occupancy (Warning Accent - Amber) */}
        <div className="rounded-2xl p-5 transition-all group relative overflow-hidden panel-interactive border-amber-500/30">
          <div className="flex items-start justify-between">
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <Building2 className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono text-amber-300 flex items-center gap-1.5 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Primary Risk
            </span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold font-mono text-amber-300 tracking-tight">
              {avgOccupancy}%
            </div>
            <div className="text-xs font-medium text-amber-200/90 mt-0.5">
              Accommodation Occupancy
            </div>
          </div>
          {/* Mini Sparkline SVG */}
          <div className="mt-3 pt-2 border-t border-white/[0.04]">
            <svg className="w-full h-5 text-amber-400/80" viewBox="0 0 100 20" preserveAspectRatio="none">
              <path d="M0 15 Q30 12 60 7 T100 3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* KPI 4: Transit Load (Mobility Accent - Indigo/Purple) */}
        <div className="rounded-2xl p-5 transition-all group panel-interactive border-indigo-500/30">
          <div className="flex items-start justify-between">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Bus className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono text-indigo-300">
              Evening surge expected
            </span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold font-mono text-slate-100 tracking-tight">
              {avgTransit}%
            </div>
            <div className="text-xs font-medium text-slate-300 mt-0.5">
              Transit Load
            </div>
          </div>
          {/* Mini Sparkline SVG */}
          <div className="mt-3 pt-2 border-t border-white/[0.04]">
            <svg className="w-full h-5 text-indigo-400/80" viewBox="0 0 100 20" preserveAspectRatio="none">
              <path d="M0 16 Q35 14 70 8 T100 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. BOTTOM ROW: ZONE PRESSURE MATRIX (8-Cols) + ACTIVE INCIDENTS (4-Cols)    */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Zone Pressure Matrix (Section 6) */}
        <div className="lg:col-span-8 rounded-2xl p-6 space-y-4 panel-elevated">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>ZONE PRESSURE MATRIX</span>
                <span className="text-xs text-[#94A3B8] font-normal font-mono">
                  (8 Orchestrated City Sectors)
                </span>
              </h2>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Click any zone for contextual diagnostic breakdown & intervention options.
              </p>
            </div>

            <button
              onClick={() => setActiveScreen('map')}
              className="text-xs font-medium text-cyan-electric hover:text-cyan-300 flex items-center gap-1 font-mono transition-colors"
            >
              <span>Live Map View</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Structured Visual Heatmap Grid Grouped by Tiers (Section 6) */}
          <div className="space-y-3 pt-2">
            
            {/* Critical & High Pressure Zones */}
            {(criticalZones.length > 0 || highZones.length > 0) && (
              <div className="space-y-2">
                <div className="text-xs font-mono uppercase tracking-wider text-rose-400/90 font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                  <span>HIGH & CRITICAL ATTENTION REQUIRED</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[...criticalZones, ...highZones].map(zone => (
                    <div
                      key={zone.id}
                      onClick={() => setSelectedZone(zone)}
                      className="p-3.5 rounded-xl glass-tab border-rose-500/30 hover:border-rose-500/60 cursor-pointer transition-all flex items-center justify-between group shadow-sm hover:scale-[1.01]"
                    >
                      <div className="space-y-1">
                        <div className="text-sm font-semibold text-white group-hover:text-cyan-electric transition-colors">
                          {zone.name}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono text-[#94A3B8]">
                          <span className="uppercase text-rose-400 font-bold">{zone.status}</span>
                          <span>·</span>
                          <span>{zone.activeVisitors.toLocaleString()} visitors</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold font-mono text-rose-400">
                          {zone.pressureScore}
                        </div>
                        <div className="text-xs font-mono text-rose-400 flex items-center justify-end gap-0.5">
                          <TrendingUp className="w-3 h-3" />
                          <span>↑ 8</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Watch Zones */}
            {watchZones.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="text-xs font-mono uppercase tracking-wider text-amber-400/90 font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>WATCH ZONES</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {watchZones.map(zone => (
                    <div
                      key={zone.id}
                      onClick={() => setSelectedZone(zone)}
                      className="p-3 rounded-xl glass-tab border-amber-500/25 hover:border-amber-500/50 cursor-pointer transition-all flex items-center justify-between group shadow-sm hover:scale-[1.01]"
                    >
                      <div className="space-y-0.5">
                        <div className="text-xs font-semibold text-white group-hover:text-cyan-electric transition-colors truncate max-w-[130px]">
                          {zone.shortName || zone.name}
                        </div>
                        <div className="text-xs font-mono text-amber-400">
                          {zone.activeVisitors.toLocaleString()} in zone
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xl font-bold font-mono text-amber-400">
                          {zone.pressureScore}
                        </div>
                        <div className="text-xs font-mono text-amber-400 flex items-center justify-end">
                          <TrendingUp className="w-2.5 h-2.5" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stable Zones */}
            {stableZones.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="text-xs font-mono uppercase tracking-wider text-emerald-400/90 font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>STABLE BUFFER ZONES</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {stableZones.map(zone => (
                    <div
                      key={zone.id}
                      onClick={() => setSelectedZone(zone)}
                      className="p-3 rounded-xl glass-tab hover:border-emerald-500/40 cursor-pointer transition-all flex items-center justify-between group shadow-sm hover:scale-[1.01]"
                    >
                      <div className="space-y-0.5">
                        <div className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors truncate max-w-[130px]">
                          {zone.shortName || zone.name}
                        </div>
                        <div className="text-xs font-mono text-emerald-400">
                          Ready for overflow
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xl font-bold font-mono text-emerald-400">
                          {zone.pressureScore}
                        </div>
                        <div className="text-xs font-mono text-[#94A3B8] flex items-center justify-end">
                          <Minus className="w-2.5 h-2.5" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Active Alerts Stream (4-Cols) (Section 8) */}
        <div className="lg:col-span-4 rounded-2xl p-6 flex flex-col justify-between space-y-4 panel-elevated">
          
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <span className="text-xs font-mono uppercase tracking-wider text-[#94A3B8] font-semibold flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                ACTIVE ALERTS
              </span>
              <span className="text-xs font-mono text-[#94A3B8]">
                <strong className="text-rose-400">{criticalAlerts.length} Critical</strong> · {alerts.length - criticalAlerts.length} Watch
              </span>
            </div>

            <div className="space-y-2.5">
              {alerts.slice(0, 3).map(alert => (
                <div
                  key={alert.id}
                  onClick={() => setActiveScreen('alerts')}
                  className="p-3 rounded-xl glass-tab hover:border-cyan-400/40 cursor-pointer transition-all space-y-1 group"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className={`font-bold uppercase ${alert.severity === 'critical' ? 'text-rose-400' : 'text-amber-400'}`}>
                      {alert.severity}
                    </span>
                    <span className="text-slate-400">{alert.timestamp}</span>
                  </div>
                  <div className="text-xs font-semibold text-white group-hover:text-cyan-electric transition-colors truncate">
                    {alert.title}
                  </div>
                  <p className="text-xs text-[#94A3B8] line-clamp-1">
                    {alert.cause || alert.message}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveScreen('alerts')}
            className="w-full py-2.5 rounded-xl text-xs font-medium glass-tab text-slate-300 hover:text-white transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>View All Operational Alerts</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. CONTEXTUAL PROGRESSIVE DISCLOSURE DRAWER (Section 6)                    */}
      {/* ========================================================================= */}
      {selectedZone && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs animate-fade-in">
          <div 
            className="w-full max-w-md h-full glass-overlay border-l border-white/15 p-6 flex flex-col justify-between overflow-y-auto shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="space-y-6">
              
              {/* Drawer Header */}
              <div className="flex items-start justify-between pb-4 border-b border-white/[0.08]">
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-cyan-electric font-semibold">
                    ZONE DIAGNOSTIC INTEL
                  </div>
                  <h3 className="text-xl font-bold text-white mt-1">
                    {selectedZone.name}
                  </h3>
                  <div className="text-xs text-[#94A3B8] font-mono mt-0.5">
                    ID: {selectedZone.id.toUpperCase()} · Peak: {selectedZone.predictedPeak}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedZone(null)}
                  className="p-1.5 rounded-lg glass-tab hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Pressure Score & Status */}
              <div className="p-4 rounded-xl glass-tab flex items-center justify-between shadow-sm">
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">
                    CALCULATED PRESSURE
                  </div>
                  <div className="text-3xl font-extrabold font-mono text-white mt-0.5">
                    {selectedZone.pressureScore} <span className="text-xs text-[#94A3B8] font-normal">/ 100</span>
                  </div>
                </div>
                <StatusBadge status={selectedZone.status} size="md" />
              </div>

              {/* Five Dimension Bar Visualizations (Section 13) */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-slate-200">
                  5-Point Telemetry Decomposition
                </div>

                {/* Accommodation */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-[#94A3B8]">
                    <span>Accommodation Occupancy</span>
                    <span className="font-mono font-bold text-white">{selectedZone.accommodationOccupancy}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/[0.08] rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${selectedZone.accommodationOccupancy > 90 ? 'bg-rose-400' : 'bg-cyan-electric'}`}
                      style={{ width: `${selectedZone.accommodationOccupancy}%` }}
                    />
                  </div>
                </div>

                {/* Predicted Arrivals */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-[#94A3B8]">
                    <span>Predicted Arrivals</span>
                    <span className="font-mono font-bold text-white">{selectedZone.predictedArrivalsNorm}% ({selectedZone.predictedArrivals.toLocaleString()})</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/[0.08] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-400 rounded-full"
                      style={{ width: `${selectedZone.predictedArrivalsNorm}%` }}
                    />
                  </div>
                </div>

                {/* Transit Load */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-[#94A3B8]">
                    <span>Transit Corridor Load</span>
                    <span className="font-mono font-bold text-white">{selectedZone.transitLoad}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/[0.08] rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${selectedZone.transitLoad > 80 ? 'bg-rose-400' : 'bg-amber-400'}`}
                      style={{ width: `${selectedZone.transitLoad}%` }}
                    />
                  </div>
                </div>

                {/* Venue Turnstile Load */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-[#94A3B8]">
                    <span>Venue Load</span>
                    <span className="font-mono font-bold text-white">{selectedZone.venueLoad}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/[0.08] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-cyan-electric rounded-full"
                      style={{ width: `${selectedZone.venueLoad}%` }}
                    />
                  </div>
                </div>

                {/* Weather Risk */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-[#94A3B8]">
                    <span>Weather Risk Factor</span>
                    <span className="font-mono font-bold text-white">{selectedZone.weatherRisk}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/[0.08] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-slate-400 rounded-full"
                      style={{ width: `${selectedZone.weatherRisk}%` }}
                    />
                  </div>
                </div>

              </div>

              {/* Recommended Action for this Zone */}
              <div className="p-3.5 rounded-xl glass-tab border-cyan-500/25 space-y-1 text-xs shadow-sm">
                <div className="text-xs font-mono uppercase tracking-wider text-cyan-electric font-semibold">
                  OPERATIONAL RECOMMENDATION
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {selectedZone.recommendedAction || 'Maintain continuous monitoring through next hourly sync.'}
                </p>
              </div>

            </div>

            {/* Actions at bottom of drawer */}
            <div className="pt-4 border-t border-white/[0.08] flex items-center gap-2.5">
              <button
                onClick={() => {
                  setSelectedZoneId(selectedZone.id);
                  setActiveScreen('map');
                }}
                className="flex-1 py-2 rounded-xl bg-cyan-electric text-[#080B12] text-xs font-bold font-mono tracking-wider hover:bg-cyan-400 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>View on Live Map</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  setSelectedZoneId(selectedZone.id);
                  setActiveScreen('capacity');
                }}
                className="py-2 px-3 rounded-xl glass-tab text-slate-300 hover:text-white text-xs font-medium transition-colors"
              >
                Stays
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
