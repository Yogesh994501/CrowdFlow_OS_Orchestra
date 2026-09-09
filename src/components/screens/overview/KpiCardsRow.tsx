import React from 'react';
import { 
  Users, 
  Activity, 
  Building2, 
  Bus, 
  TrendingUp 
} from 'lucide-react';

interface KpiCardsRowProps {
  totalVisitors: number;
  avgOccupancy: number;
  avgTransit: number;
  zoneCount: number;
}

export const KpiCardsRow: React.FC<KpiCardsRowProps> = ({
  totalVisitors,
  avgOccupancy,
  avgTransit,
  zoneCount,
}) => {
  return (
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
            {zoneCount} metro sectors
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
  );
};
