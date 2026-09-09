import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle 
} from 'lucide-react';
import type { Intervention } from '../../../types';
import type { WeatherData } from '../../../services/weatherService';

interface SystemHealthHeroProps {
  systemPressureScore: number;
  weather: WeatherData;
  scenarioData: {
    slots: { time: string; isPeak: boolean }[];
    peakWindow: string;
    bottleneckTitle: string;
    bottleneckSub: string;
  };
  activeIntervention?: Intervention;
  justApproved: boolean;
  onApproveIntervention: (id: string) => void;
  onInspectBottleneck: () => void;
  onReviewPlan: () => void;
  onOpenFormulaGuide: () => void;
}

export const SystemHealthHero: React.FC<SystemHealthHeroProps> = ({
  systemPressureScore,
  weather,
  scenarioData,
  activeIntervention,
  justApproved,
  onApproveIntervention,
  onInspectBottleneck,
  onReviewPlan,
  onOpenFormulaGuide,
}) => {
  const getStatusDetails = () => {
    if (systemPressureScore >= 85) {
      return {
        label: 'CRITICAL',
        sub: 'Critical Metropolitan Saturation',
        badgeBg: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
        dot: 'bg-rose-400',
        gradColor: '#F43F5E',
      };
    }
    if (systemPressureScore >= 70) {
      return {
        label: 'HIGH',
        sub: 'Elevated Sector Pressure',
        badgeBg: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
        dot: 'bg-orange-400',
        gradColor: '#F97316',
      };
    }
    if (systemPressureScore >= 50) {
      return {
        label: 'WATCH',
        sub: 'Contained Pressure Elevation',
        badgeBg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
        dot: 'bg-amber-400',
        gradColor: '#F59E0B',
      };
    }
    return {
      label: 'STABLE',
      sub: 'Nominal Operations Grid',
      badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      dot: 'bg-emerald-400',
      gradColor: '#10B981',
    };
  };

  const status = getStatusDetails();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* 1. System Health Hero & Radial Gauge */}
      <div className="lg:col-span-7 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl transition-all panel-elevated">
        <div>
          {/* Header meta */}
          <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-white/[0.08]">
            <span className="font-mono uppercase tracking-widest text-xs font-bold text-slate-300 flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${status.dot} animate-pulse`} />
              SYSTEM OPERATIONS STATUS
            </span>
            <div className="flex items-center gap-3 font-mono text-xs text-slate-400">
              <button
                onClick={onOpenFormulaGuide}
                className="hidden sm:flex items-center gap-1 text-cyan-300 hover:text-white transition-colors"
                title="Explain Pressure Formula"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Formula</span>
              </button>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>Weather: <strong className="text-cyan-300">{weather.weatherRisk}%</strong> · {weather.condition}</span>
              </div>
            </div>
          </div>

          {/* Core Status & Radial Pressure Gauge */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 pt-5 items-center">
            {/* Left Narrative */}
            <div className="sm:col-span-7 space-y-2.5">
              <div className="flex items-center gap-3">
                <span className="text-4xl font-extrabold tracking-tight text-white font-mono">
                  {status.label}
                </span>
                <span className={`px-3 py-1 rounded-full border text-xs font-mono font-medium shadow-sm ${status.badgeBg}`}>
                  {status.sub}
                </span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                Mumbai operations grid is active. Bandra-Kurla Complex (BKC) accommodation reserves and Dadar transit require attention prior to evening peak hours.
              </p>
            </div>

            {/* Right Gauge */}
            <div className="sm:col-span-5 flex flex-col items-center sm:items-end justify-center">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={status.gradColor} stopOpacity="0.8" />
                      <stop offset="100%" stopColor={status.gradColor} />
                    </linearGradient>
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
                    stroke="url(#gaugeGrad)"
                    strokeWidth="7"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - Math.min(1, Math.max(0, systemPressureScore / 100)))}
                    strokeLinecap="round"
                    fill="transparent"
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

          {/* Operational Timeline Bar */}
          <div className="pt-5 mt-4 border-t border-white/[0.08]">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2">
              <span className="tracking-widest uppercase text-slate-300 font-semibold">EVENT TIMELINE & OPERATIONAL SLOTS</span>
              <span className="text-cyan-400">{scenarioData.peakWindow}</span>
            </div>
            <div className="flex items-center justify-between gap-2 pt-1">
              {scenarioData.slots.map((slot) => (
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

        {/* Primary Bottleneck Action */}
        <div className="pt-4 mt-5 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold">
              PRIMARY BOTTLENECK
            </span>
            <div className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <span>{scenarioData.bottleneckTitle}</span>
              <span className="text-slate-400 font-normal text-xs font-mono">{scenarioData.bottleneckSub}</span>
            </div>
          </div>
          
          <button
            onClick={onInspectBottleneck}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass-tab text-xs font-medium text-cyan-300 hover:text-white transition-all shrink-0 font-mono shadow-sm"
          >
            <span>Inspect Bottleneck</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Actionable Recommended Intervention */}
      <div className="lg:col-span-5 rounded-2xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden transition-all panel-elevated border-cyan-500/30">
        <div className="space-y-4">
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
                  {activeIntervention.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed font-sans">
                  {activeIntervention.expectedImpact}
                </p>
              </div>

              {/* WHY NOW Callout */}
              <div className="p-3.5 rounded-xl bg-cyan-500/[0.06] border border-cyan-500/20 space-y-1 text-xs">
                <div className="text-xs font-mono uppercase tracking-widest text-cyan-300 font-bold">
                  WHY NOW
                </div>
                <p className="text-slate-300 leading-relaxed font-sans text-xs">
                  {activeIntervention.why}
                </p>
              </div>

              {/* Expected Impact */}
              <div className="pt-1">
                <div className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold mb-2">
                  EXPECTED IMPACT
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-center">
                    <div className="text-lg font-extrabold font-mono text-emerald-400">-{activeIntervention.pressureReduction}</div>
                    <div className="text-xs text-slate-400 font-mono">Pressure Pts</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-center">
                    <div className="text-lg font-extrabold font-mono text-cyan-300">{activeIntervention.confidence}%</div>
                    <div className="text-xs text-slate-400 font-mono">Confidence</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-center">
                    <div className="text-xs font-bold font-mono text-slate-200 truncate py-1" title={activeIntervention.tradeOff}>
                      {activeIntervention.tradeOff || 'Balanced'}
                    </div>
                    <div className="text-xs text-slate-400 font-mono">Trade-off</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-slate-400 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto opacity-80" />
              <p>All recommended interventions have been authorized and active.</p>
            </div>
          )}
        </div>

        {/* Action CTAs */}
        {activeIntervention && (
          <div className="pt-4 mt-4 border-t border-white/[0.08] flex items-center gap-3">
            <button
              onClick={onReviewPlan}
              className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Review Plan
            </button>
            <button
              onClick={() => onApproveIntervention(activeIntervention.id)}
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
  );
};
