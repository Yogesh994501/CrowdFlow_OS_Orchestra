import React, { useState } from 'react';
import { useCrowdFlowStore } from '../../store/useCrowdFlowStore';
import type { OperationalAlert } from '../../types';
import { alertService } from '../../services/alertService';
import type { IncidentResponsePlan } from '../../services/alertService';
import { 
  ShieldAlert, 
  AlertOctagon, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  FileText, 
  X, 
  Clock, 
  MapPin, 
  ArrowRight,
  ShieldCheck,
  Check,
  ChevronRight,
  UserCheck,
  Layers,
  Sparkles
} from 'lucide-react';

export const AlertsScreen: React.FC = () => {
  const { 
    alerts, 
    acknowledgeAlert, 
    assignAlertOwner, 
    resolveAlert, 
    setActiveScreen 
  } = useCrowdFlowStore();

  const [activeIncidentPlan, setActiveIncidentPlan] = useState<IncidentResponsePlan | null>(null);

  // Grouping into operational severity tiers
  const criticalIncidents = alerts.filter(a => a.severity === 'critical' && a.status !== 'resolved');
  const highPriorityAlerts = alerts.filter(a => a.severity === 'high' && a.status !== 'resolved');
  const monitoringAlerts = alerts.filter(a => (a.severity === 'medium' || a.severity === 'info') && a.status !== 'resolved');
  const resolvedAlerts = alerts.filter(a => a.status === 'resolved');

  const ownersList = [
    'Hospitality Taskforce Lead',
    'Mumbai Central Railway Ops',
    'Venue Security Operations',
    'Disaster Management Cell',
    'Mumbai Traffic Police',
    'Attendee Experience Team',
    'Western Railway Control',
  ];

  // Lifecycle Pipeline Steps (Section 8)
  const pipelineSteps = [
    { label: 'DETECTED', state: 'complete' },
    { label: 'ANALYZED', state: 'complete' },
    { label: 'RECOMMENDED', state: 'complete' },
    { label: 'ACKNOWLEDGED', state: 'active' },
    { label: 'ACTION TAKEN', state: 'upcoming' },
    { label: 'MONITORING', state: 'upcoming' },
    { label: 'RESOLVED', state: 'upcoming' },
  ];

  const handleGeneratePlan = (alert: OperationalAlert) => {
    const plan = alertService.generateIncidentResponsePlan(alert);
    setActiveIncidentPlan(plan);
  };

  return (
    <div className="space-y-6 pb-12 max-w-[1300px] mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-rose-500" />
            <span>Incident Command & Alert Pipeline</span>
          </h1>
          <p className="text-xs text-slate-400">
            Categorized operational telemetry prioritizing active disruptions with automated containment playbooks.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30 font-bold">
            {criticalIncidents.length} Critical
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/20 font-bold">
            {highPriorityAlerts.length} High
          </span>
          <span className="px-2.5 py-1 rounded-xl glass-tab text-slate-300">
            {resolvedAlerts.length} Resolved
          </span>
        </div>
      </div>

      {/* Section 8: Visual Incident Lifecycle Pipeline Banner */}
      <div className="p-4 rounded-2xl panel-elevated space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-cyan-300" />
            7-Stage Automated Incident Lifecycle Pipeline
          </span>
          <span className="text-slate-400">Target Resolution: &lt; 15 min</span>
        </div>

        <div className="overflow-x-auto pb-1">
          <div className="flex items-center justify-between min-w-[720px] gap-2 pt-1 font-mono text-xs">
            {pipelineSteps.map((step, idx) => (
              <React.Fragment key={step.label}>
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                    step.state === 'complete'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : step.state === 'active'
                      ? 'bg-cyan-400 text-slate-950 shadow-md animate-pulse'
                      : 'bg-white/5 text-slate-400 border border-white/10'
                  }`}>
                    {step.state === 'complete' ? '✓' : idx + 1}
                  </div>
                  <span className={`font-semibold ${
                    step.state === 'complete' 
                      ? 'text-emerald-400' 
                      : step.state === 'active' 
                      ? 'text-cyan-300 font-bold' 
                      : 'text-slate-400'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {idx < pipelineSteps.length - 1 && (
                  <div className="flex-1 h-0.5 bg-white/10 min-w-[24px]" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* 1. ACTIVE CRITICAL INCIDENTS (Dominant Visual Priority) */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-rose-400">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
          ACTIVE CRITICAL INCIDENTS ({criticalIncidents.length})
        </div>

        <div className="space-y-3">
          {criticalIncidents.map(alert => (
            <div
              key={alert.id}
              className="p-5 rounded-2xl panel-elevated border-rose-500/40 space-y-3.5 shadow-lg transition-all hover:border-rose-500/60"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 uppercase">
                    CRITICAL
                  </span>
                  <span className="text-xs font-mono text-cyan-300 font-bold">
                    {alert.zoneName}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-xs font-mono text-slate-400">
                    {alert.timestamp}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-slate-400">Assign Owner:</span>
                  <select
                    value={alert.assignedOwner || ''}
                    onChange={e => assignAlertOwner(alert.id, e.target.value)}
                    className="px-2.5 py-1 rounded-xl glass-tab text-white text-xs font-mono border-white/10 focus:border-cyan-400 outline-none"
                  >
                    <option value="" className="bg-slate-900">Unassigned</option>
                    {ownersList.map(o => (
                      <option key={o} value={o} className="bg-slate-900">{o}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">
                  {alert.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed font-sans">
                  {alert.message}
                </p>
              </div>

              <div className="p-3.5 rounded-xl glass-tab text-xs flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-mono uppercase text-slate-400 font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    Prescribed Containment Action:
                  </span>
                  <p className="text-cyan-300 font-sans">{alert.recommendedAction}</p>
                </div>
                <div className="text-right pl-4 shrink-0 font-mono">
                  <span className="text-xs text-slate-400 block font-semibold">CONFIDENCE</span>
                  <span className="text-sm font-bold text-white">{alert.confidence}%</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-1 border-t border-white/[0.06]">
                <span className="text-xs font-mono text-rose-400 font-semibold">
                  Immediate containment protocol required
                </span>
                <div className="flex items-center gap-2 font-mono">
                  {!alert.acknowledged && (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white glass-tab transition-colors"
                    >
                      Acknowledge
                    </button>
                  )}
                  <button
                    onClick={() => handleGeneratePlan(alert)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Review Incident Plan
                  </button>
                  <button
                    onClick={() => resolveAlert(alert.id)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 transition-colors"
                  >
                    Resolve
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. HIGH PRIORITY (Contained cards) */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-amber-400">
          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          HIGH PRIORITY ({highPriorityAlerts.length})
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {highPriorityAlerts.map(alert => (
            <div
              key={alert.id}
              className="p-4 rounded-2xl panel-elevated border-amber-500/25 space-y-2.5 shadow-sm"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-amber-400 font-bold uppercase">{alert.zoneName}</span>
                <span className="text-slate-400">{alert.timestamp}</span>
              </div>
              <h4 className="text-sm font-bold text-white leading-snug">{alert.title}</h4>
              <p className="text-xs text-slate-300 line-clamp-2 font-sans">{alert.message}</p>
              <div className="pt-2 flex items-center justify-between border-t border-white/[0.06] text-xs">
                <span className="text-xs font-mono text-cyan-300 truncate max-w-[220px]">
                  {alert.recommendedAction}
                </span>
                <button
                  onClick={() => handleGeneratePlan(alert)}
                  className="text-xs font-mono text-cyan-300 hover:text-cyan-200 font-semibold shrink-0"
                >
                  Inspect →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. MONITORING & ADVISORY (Receded visually) */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center gap-2 text-xs font-mono font-medium uppercase tracking-wider text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
          MONITORING & ADVISORY ({monitoringAlerts.length})
        </div>

        <div className="space-y-2">
          {monitoringAlerts.map(alert => (
            <div
              key={alert.id}
              className="p-3 rounded-xl glass-tab flex items-center justify-between text-xs font-mono"
            >
              <div className="flex items-center gap-3">
                <span className="text-slate-400">{alert.timestamp}</span>
                <span className="text-cyan-300 font-semibold uppercase">{alert.zoneName}</span>
                <span className="text-slate-300 font-sans">{alert.title}</span>
              </div>
              <button
                onClick={() => handleGeneratePlan(alert)}
                className="text-xs text-slate-400 hover:text-white font-mono"
              >
                Details
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 4. RESOLVED / MITIGATED */}
      {resolvedAlerts.length > 0 && (
        <section className="space-y-2 pt-2 opacity-80">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
            <Check className="w-3.5 h-3.5" />
            RESOLVED / MITIGATED ({resolvedAlerts.length})
          </div>
          <div className="space-y-1.5">
            {resolvedAlerts.map(alert => (
              <div
                key={alert.id}
                className="p-2.5 rounded-xl glass-tab flex items-center justify-between text-xs font-mono text-slate-400"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{alert.zoneName}: {alert.title}</span>
                </div>
                <span className="text-xs text-emerald-400 font-semibold">Mitigated</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Incident Response Plan Modal */}
      {activeIncidentPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-xl rounded-2xl glass-overlay p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-white/[0.08]">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
                  ACTION PROTOCOL • {activeIncidentPlan.severity}
                </span>
                <h2 className="text-base font-bold text-white mt-1">
                  {activeIncidentPlan.title}
                </h2>
                <div className="text-xs font-mono text-slate-400">
                  Lead Agency: {activeIncidentPlan.leadAgency}
                </div>
              </div>
              <button 
                onClick={() => setActiveIncidentPlan(null)}
                className="p-1.5 rounded-lg glass-tab text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl glass-tab text-xs text-slate-300 space-y-1 font-sans">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold block">
                Executive Briefing:
              </span>
              <p className="leading-relaxed">{activeIncidentPlan.executiveSummary}</p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-cyan-300 font-bold block">
                Immediate Actions (0 - 15 Mins):
              </span>
              <div className="space-y-1.5">
                {activeIncidentPlan.immediateActions.map((act, i) => (
                  <div key={i} className="p-2.5 rounded-xl glass-tab text-xs text-slate-200 flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed font-sans">{act}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-white/[0.08] font-mono">
              <button
                onClick={() => setActiveIncidentPlan(null)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-medium glass-tab text-slate-300 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setActiveIncidentPlan(null);
                  setActiveScreen('interventions');
                }}
                className="px-4 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors"
              >
                Deploy Interventions →
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
