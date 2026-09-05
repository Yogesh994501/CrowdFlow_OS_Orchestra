import React from 'react';
import { Intervention } from '../../types';
import { Sparkles, ArrowRight, ShieldCheck, AlertCircle, Shuffle, Check, X } from 'lucide-react';

interface ExplainabilityPanelProps {
  intervention: Intervention;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onExecute?: (id: string) => void;
  compact?: boolean;
}

export const ExplainabilityPanel: React.FC<ExplainabilityPanelProps> = ({
  intervention,
  onApprove,
  onReject,
  onExecute,
  compact = false,
}) => {
  return (
    <div className="rounded-2xl glass-panel border border-cyan-500/20 p-5 space-y-4 hover:border-cyan-500/40 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" />
              Explainable Recommendation
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Zone: <strong className="text-white">{intervention.targetZoneName}</strong>
            </span>
          </div>
          <h4 className="text-base font-semibold text-white leading-snug">
            {intervention.title}
          </h4>
        </div>

        {/* Confidence Meter */}
        <div className="text-right shrink-0">
          <div className="text-xs text-slate-400 font-mono">Confidence</div>
          <div className="text-lg font-bold font-mono text-cyan-400 flex items-center justify-end gap-1">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            {intervention.confidence}%
          </div>
        </div>
      </div>

      {/* WHY Section */}
      <div className="p-3 rounded-xl bg-dark-900/80 border border-white/5 space-y-1">
        <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-300 flex items-center gap-1.5 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          Why This Recommendation Was Generated
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          {intervention.why}
        </p>
      </div>

      {/* Quantitative Signals Used */}
      <div>
        <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2">
          Telemetry Signals Evaluated:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {intervention.signals.map((sig, idx) => (
            <div
              key={idx}
              className="p-2 rounded-lg bg-dark-800/60 border border-white/5 flex flex-col justify-between"
            >
              <span className="text-[10px] text-slate-400 line-clamp-1">{sig.label}</span>
              <span className="text-xs font-mono font-bold text-white mt-0.5">{sig.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Expected Impact & Trade-Off Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
          <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-1 font-semibold">
            <ArrowRight className="w-3.5 h-3.5" />
            Expected Operational Impact
          </div>
          <p className="text-xs text-emerald-200">
            {intervention.expectedImpact}
          </p>
          <div className="text-[11px] font-mono text-emerald-300 font-bold">
            Predicted Pressure Reduction: -{intervention.pressureReduction} pts
          </div>
        </div>

        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
          <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1 font-semibold">
            <AlertCircle className="w-3.5 h-3.5" />
            Operational Trade-Off
          </div>
          <p className="text-xs text-amber-200">
            {intervention.tradeOff}
          </p>
        </div>
      </div>

      {/* Alternative Fallback Option */}
      {!compact && intervention.alternative && (
        <div className="flex items-start gap-2 text-xs text-slate-400 bg-dark-900/50 p-2.5 rounded-lg border border-white/5">
          <Shuffle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-300">Alternative Fallback: </span>
            {intervention.alternative}
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">Status:</span>
          <span
            className={`text-xs uppercase font-mono px-2 py-0.5 rounded font-bold ${
              intervention.status === 'completed'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : intervention.status === 'approved'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : intervention.status === 'rejected'
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}
          >
            {intervention.status}
          </span>
          {intervention.executedAt && (
            <span className="text-[11px] text-slate-500 font-mono">
              at {intervention.executedAt}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {intervention.status === 'pending' && (
            <>
              {onReject && (
                <button
                  onClick={() => onReject(intervention.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-white/5 hover:border-rose-500/30 transition-all flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  Reject
                </button>
              )}
              {onApprove && (
                <button
                  onClick={() => onApprove(intervention.id)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-dark-950 bg-cyan-400 hover:bg-cyan-300 shadow-glow-cyan-sm transition-all flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  Approve Plan
                </button>
              )}
            </>
          )}

          {intervention.status === 'approved' && onExecute && (
            <button
              onClick={() => onExecute(intervention.id)}
              className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 shadow-glow-green transition-all flex items-center gap-1.5 animate-pulse"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              Execute Intervention
            </button>
          )}

          {intervention.status === 'completed' && intervention.actualImpact && (
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1 font-semibold">
              <Check className="w-3.5 h-3.5" />
              Impact Verified: -{intervention.pressureReduction} pts
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
