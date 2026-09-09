import React from 'react';
import { 
  ShieldAlert, 
  TrendingUp, 
  AlertOctagon 
} from 'lucide-react';

interface ActionableCriticalAlertProps {
  onRedirectFlow: () => void;
  onViewZone: () => void;
  onAssignTeam: () => void;
}

export const ActionableCriticalAlert: React.FC<ActionableCriticalAlertProps> = ({
  onRedirectFlow,
  onViewZone,
  onAssignTeam,
}) => {
  return (
    <div className="rounded-2xl p-5 border border-rose-500/40 bg-gradient-to-r from-rose-950/40 via-[#0E1528] to-rose-950/20 shadow-2xl relative overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-xs font-bold uppercase tracking-wider border border-rose-500/30 flex items-center gap-1">
                <AlertOctagon className="w-3 h-3 text-rose-400" />
                <span>CRITICAL ACTION</span>
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
                ↑ 8% increase in last 10 minutes
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-300">
                Recommended response: <strong className="text-cyan-300 font-semibold">Redirect incoming attendees toward Gate B & Kurla buffer</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onRedirectFlow}
            className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-rose-500 hover:bg-rose-400 text-slate-950 transition-all shadow-[0_0_16px_rgba(244,63,94,0.4)]"
          >
            Redirect Flow
          </button>
          <button
            onClick={onViewZone}
            className="px-3 py-2 rounded-xl text-xs font-mono font-medium glass-tab text-slate-200 hover:text-white transition-all"
          >
            View Zone
          </button>
          <button
            onClick={onAssignTeam}
            className="px-3 py-2 rounded-xl text-xs font-mono font-medium glass-tab text-cyan-300 hover:text-white transition-all"
          >
            Assign Team
          </button>
        </div>
      </div>
    </div>
  );
};
