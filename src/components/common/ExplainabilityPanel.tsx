import React from 'react';
import { Intervention } from '../../types';
import { Sparkles, ArrowRight, ShieldCheck, AlertCircle, Shuffle, Check, X, TrendingDown, Gauge } from 'lucide-react';

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
    <div className="rounded-2xl panel-elevated border border-cyan-500/25 p-5 space-y-4 hover:border-cyan-500/45 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-cyan-300 bg-cyan-500/10 border border-cyan-500/25 px-2.5 py-0.5 rounded-full font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              AI Decision Intelligence
            </span>
            <span className="text-xs font-mono text-slate-400">
              Zone: <strong className="text-white font-sans">{intervention.targetZoneName}</strong>
            </span>
          </div>
          <h4 className="text-base font-bold text-white leading-snug">
            {intervention.title}
          </h4>
        </div>

        {/* Confidence Meter */}
        <div className="text-right shrink-0">
          <div className="text-xs text-slate-400 font-mono">Confidence Level</div>
          <div className="text-lg font-bold font-mono text-cyan-300 flex items-center justify-end gap-1">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            {intervention.confidence}%
          </div>
        </div>
      </div>

      {/* WHY Section (Explainable Reasoning) */}
      <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1.5">
        <div className="text-xs font-mono uppercase tracking-wider text-cyan-300 flex items-center gap-1.5 font-bold">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          Why This Recommendation Was Generated
        </div>
        <p className="text-xs text-slate-200 leading-relaxed font-sans">
          {intervention.why}
        </p>
      </div>

      {/* Current State vs Predicted State (Section 11) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* Current State */}
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold flex items-center gap-1">
              🔴 Current State (Bottleneck)
            </span>
            <span className="text-xs font-mono font-bold text-rose-300">
              Pressure: {intervention.beforePressure ?? 91}/100
            </span>
          </div>
          <p className="text-xs text-rose-200/90 leading-relaxed font-sans">
            Zone telemetry approaching physical turnstile thresholds with queuing delays expanding.
          </p>
        </div>

        {/* Predicted State */}
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1">
              🟢 Predicted State (Post-Action)
            </span>
            <span className="text-xs font-mono font-bold text-emerald-300 flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" />
              -{intervention.pressureReduction} pts reduction
            </span>
          </div>
          <p className="text-xs text-emerald-200/90 leading-relaxed font-sans">
            {intervention.expectedImpact}
          </p>
        </div>
      </div>

      {/* Quantitative Signals Used */}
      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 font-semibold">
          Evaluated Telemetry Signals:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {intervention.signals.map((sig, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex flex-col justify-between"
            >
              <span className="text-xs text-slate-400 line-clamp-1 font-sans">{sig.label}</span>
              <span className="text-xs font-mono font-bold text-cyan-300 mt-1">{sig.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Operational Trade-Off Matrix */}
      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
        <div className="text-xs font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1 font-bold">
          <AlertCircle className="w-3.5 h-3.5" />
          Operational Trade-Off Consideration
        </div>
        <p className="text-xs text-amber-200/90 leading-relaxed font-sans">
          {intervention.tradeOff}
        </p>
      </div>

      {/* Alternative Fallback Option */}
      {!compact && intervention.alternative && (
        <div className="flex items-start gap-2 text-xs text-slate-300 bg-black/30 p-3 rounded-xl border border-white/5 font-sans">
          <Shuffle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-white">Alternative Fallback Strategy: </span>
            {intervention.alternative}
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">Status:</span>
          <span
            className={`text-xs uppercase font-mono px-2.5 py-0.5 rounded-lg font-bold ${
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
            <span className="text-xs text-slate-400 font-mono">
              at {intervention.executedAt}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 font-mono">
          {intervention.status === 'pending' && (
            <>
              {onReject && (
                <button
                  onClick={() => onReject(intervention.id)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 glass-tab transition-all flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  Dismiss
                </button>
              )}
              {onApprove && (
                <button
                  onClick={() => onApprove(intervention.id)}
                  className="px-4 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 shadow-md transition-all flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  Approve Intervention
                </button>
              )}
            </>
          )}

          {intervention.status === 'approved' && onExecute && (
            <button
              onClick={() => onExecute(intervention.id)}
              className="px-4 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-md transition-all flex items-center gap-1.5 animate-pulse"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              Execute Intervention
            </button>
          )}

          {intervention.status === 'completed' && intervention.actualImpact && (
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1 font-bold">
              <Check className="w-3.5 h-3.5" />
              Impact Verified: -{intervention.pressureReduction} pts
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
