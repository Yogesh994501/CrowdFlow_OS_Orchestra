import React, { useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  AlertOctagon, 
  HelpCircle, 
  Activity, 
  Building2, 
  Users, 
  Bus, 
  Compass, 
  CloudRain 
} from 'lucide-react';

interface PressureFormulaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PressureFormulaModal: React.FC<PressureFormulaModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const weights = [
    {
      name: 'Accommodation Occupancy',
      weight: '30%',
      icon: Building2,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
      desc: 'Real-time room occupancy & reserved buffer depletion across metropolitan hotels.'
    },
    {
      name: 'Predicted Inflow & Arrivals',
      weight: '25%',
      icon: Users,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20',
      desc: 'Predictive flight, high-speed rail, and express arrival velocities toward the sector.'
    },
    {
      name: 'Transit Corridor Load',
      weight: '20%',
      icon: Bus,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/20',
      desc: 'Suburban rail dwell times, metro concourse saturation, and arterial highway queueing.'
    },
    {
      name: 'Venue & Turnstile Load',
      weight: '15%',
      icon: Compass,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      desc: 'Perimeter turnstile throughput, bag-check line depths, and concourse density.'
    },
    {
      name: 'Meteorological Risk',
      weight: '10%',
      icon: CloudRain,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/20',
      desc: 'Live precipitation, waterlogging alerts, wind gust warnings, and road flooding index.'
    },
  ];

  const thresholds = [
    {
      name: 'STABLE BUFFER',
      range: '0 – 49',
      shape: 'Circle / Check',
      icon: CheckCircle2,
      color: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      desc: 'Standard operations. Ample accommodation reserves and free transit headways. Ready to receive overflow diversions.'
    },
    {
      name: 'WATCH ALERT',
      range: '50 – 69',
      shape: 'Triangle / Warning',
      icon: AlertTriangle,
      color: 'text-amber-400',
      badgeBg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      desc: 'Contained pressure elevation. Turnstiles and transit lines active but moving. Advisory routing recommended.'
    },
    {
      name: 'HIGH ATTENTION',
      range: '70 – 84',
      shape: 'Shield / Alert',
      icon: ShieldAlert,
      color: 'text-orange-400',
      badgeBg: 'bg-orange-500/15 text-orange-400 border-orange-500/40',
      desc: 'Capacity bottlenecks forming. Headway delays exceeding 6 mins. Proactive bus bridges & buffer diversions dispatched.'
    },
    {
      name: 'CRITICAL ACTION',
      range: '85 – 100',
      shape: 'Octagon / Stop',
      icon: AlertOctagon,
      color: 'text-rose-400',
      badgeBg: 'bg-rose-500/20 text-rose-400 border-rose-500/50 shadow-glow-critical',
      desc: 'Sector saturation imminent (e.g. 94%+ occupancy). Automated attendee perimeter holds, gate diversions & emergency protocols active.'
    }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pressure-guide-title"
    >
      <div 
        className="w-full max-w-2xl max-h-[90vh] glass-overlay border border-white/15 rounded-3xl p-6 sm:p-7 overflow-y-auto shadow-2xl space-y-6"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/[0.08]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                <Activity className="w-4 h-4" />
              </span>
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                Operational Telemetry Engine
              </span>
            </div>
            <h2 id="pressure-guide-title" className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Pressure Score Formula & Thresholds
            </h2>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              How CrowdFlow OS computes metropolitan zone risk and activates proactive interventions before bottlenecks form.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl glass-tab text-slate-400 hover:text-white transition-colors"
            aria-label="Close formula guide"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* The Mathematical Formula */}
        <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2.5 font-mono">
          <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold flex items-center justify-between">
            <span>Deterministic Multi-Factor Formula</span>
            <span className="text-cyan-400 text-xs">Weights sum to 1.00</span>
          </div>
          <div className="p-3 rounded-xl bg-cyan-500/[0.06] border border-cyan-500/20 text-cyan-300 text-xs sm:text-sm font-bold overflow-x-auto leading-relaxed">
            Score = (0.30 × Occupancy) + (0.25 × Arrivals) + (0.20 × Transit) + (0.15 × Venue) + (0.10 × Weather)
          </div>
        </div>

        {/* 5 Weighted Telemetry Inputs */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
            5-Point Telemetry Decomposition
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {weights.map((w) => {
              const Icon = w.icon;
              return (
                <div key={w.name} className={`p-3 rounded-xl border ${w.bg} space-y-1`}>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-white font-sans">
                      <Icon className={`w-3.5 h-3.5 ${w.color}`} />
                      {w.name}
                    </span>
                    <span className={`text-xs font-mono font-extrabold ${w.color}`}>
                      {w.weight}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {w.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4 Zone Status Thresholds & Non-Color Redundancy */}
        <div className="space-y-2.5 pt-2 border-t border-white/[0.08]">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
              Four Operational Severity Tiers
            </h3>
            <span className="text-xs font-mono text-slate-400">
              WCAG 1.4.1 Shape + Color Redundancy
            </span>
          </div>

          <div className="space-y-2">
            {thresholds.map((t) => {
              const Icon = t.icon;
              return (
                <div 
                  key={t.name}
                  className="p-3.5 rounded-xl glass-tab border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 sm:max-w-[70%]">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border flex items-center gap-1.5 ${t.badgeBg}`}>
                        <Icon className="w-3.5 h-3.5" />
                        <span>{t.name}</span>
                      </span>
                      <span className="text-xs font-mono text-white font-bold">
                        {t.range} pts
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed">
                      {t.desc}
                    </p>
                  </div>

                  <div className="text-right shrink-0 text-xs font-mono text-slate-400 sm:border-l sm:border-white/10 sm:pl-4">
                    <div className="text-slate-300 font-semibold">Shape Indicator:</div>
                    <div className={`${t.color} font-bold mt-0.5 flex items-center sm:justify-end gap-1`}>
                      <Icon className="w-3.5 h-3.5" />
                      <span>{t.shape}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-slate-400">
          <span>CrowdFlow OS • Explainable Intelligence Specification</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950 transition-colors shadow-md"
          >
            Got It
          </button>
        </div>

      </div>
    </div>
  );
};
