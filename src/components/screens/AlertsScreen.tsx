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
  Check
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

  // Grouping into senior design categories (Section 11)
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

  const handleGeneratePlan = (alert: OperationalAlert) => {
    const plan = alertService.generateIncidentResponsePlan(alert);
    setActiveIncidentPlan(plan);
  };

  return (
    <div className="space-y-6 pb-12 max-w-[1300px] mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/[0.08]">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            <span>Incident Command Alert Feed</span>
          </h1>
          <p className="text-xs text-[#94A3B8]">
            Categorized operational feed prioritizing active disruptions with automated containment playbooks.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30 font-bold">
            {criticalIncidents.length} Critical
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-orange-500/15 text-orange-400 border border-orange-500/20">
            {highPriorityAlerts.length} High
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-[#141A26] text-[#94A3B8] border border-white/[0.08]">
            {resolvedAlerts.length} Resolved
          </span>
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
              className="p-5 rounded-2xl panel-elevated border-rose-500/40 space-y-3.5 shadow-lg"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 uppercase">
                    CRITICAL
                  </span>
                  <span className="text-xs font-mono text-cyan-electric font-bold">
                    {alert.zoneName}
                  </span>
                  <span className="text-[#94A3B8]">•</span>
                  <span className="text-xs font-mono text-[#94A3B8]">
                    {alert.timestamp}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-[#94A3B8]">Assign Owner:</span>
                  <select
                    value={alert.assignedOwner || ''}
                    onChange={e => assignAlertOwner(alert.id, e.target.value)}
                    className="px-2 py-0.5 rounded-lg glass-tab text-white text-xs font-mono"
                  >
                    <option value="" className="bg-[#09101C]">Unassigned</option>
                    {ownersList.map(o => (
                      <option key={o} value={o} className="bg-[#09101C]">{o}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">
                  {alert.title}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  {alert.message}
                </p>
              </div>

              <div className="p-3 rounded-xl glass-tab text-xs flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono uppercase text-[#94A3B8]">Prescribed Action:</span>
                  <p className="text-cyan-electric font-sans">{alert.recommendedAction}</p>
                </div>
                <div className="text-right pl-4 shrink-0 font-mono">
                  <span className="text-[10px] text-[#94A3B8] block">CONFIDENCE</span>
                  <span className="text-sm font-bold text-white">{alert.confidence}%</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-1 border-t border-white/[0.06]">
                <span className="text-xs font-mono text-rose-400">
                  Immediate containment required
                </span>
                <div className="flex items-center gap-2">
                  {!alert.acknowledged && (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white glass-tab transition-colors"
                    >
                      Acknowledge
                    </button>
                  )}
                  <button
                    onClick={() => handleGeneratePlan(alert)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-[#090B10] bg-cyan-electric hover:bg-cyan-400 transition-colors flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Review Incident Plan
                  </button>
                  <button
                    onClick={() => resolveAlert(alert.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 transition-colors"
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
        <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-orange-400">
          <span className="w-2 h-2 rounded-full bg-orange-400"></span>
          HIGH PRIORITY ({highPriorityAlerts.length})
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {highPriorityAlerts.map(alert => (
            <div
              key={alert.id}
              className="p-4 rounded-xl panel-elevated border-orange-500/25 space-y-2 shadow-sm"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-orange-400 font-bold uppercase">{alert.zoneName}</span>
                <span className="text-[#94A3B8] text-[11px]">{alert.timestamp}</span>
              </div>
              <h4 className="text-sm font-bold text-white leading-snug">{alert.title}</h4>
              <p className="text-xs text-[#94A3B8] line-clamp-2">{alert.message}</p>
              <div className="pt-2 flex items-center justify-between border-t border-white/[0.06] text-xs">
                <span className="text-[11px] font-mono text-cyan-electric truncate max-w-[200px]">
                  {alert.recommendedAction}
                </span>
                <button
                  onClick={() => handleGeneratePlan(alert)}
                  className="text-xs font-mono text-cyan-electric hover:underline shrink-0"
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
        <div className="flex items-center gap-2 text-xs font-mono font-medium uppercase tracking-wider text-[#94A3B8]">
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
                <span className="text-slate-500">{alert.timestamp}</span>
                <span className="text-cyan-electric font-semibold uppercase">{alert.zoneName}</span>
                <span className="text-slate-300 font-sans">{alert.title}</span>
              </div>
              <button
                onClick={() => handleGeneratePlan(alert)}
                className="text-[11px] text-[#94A3B8] hover:text-white"
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
                className="p-2.5 rounded-lg glass-tab flex items-center justify-between text-xs font-mono text-[#94A3B8]"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{alert.zoneName}: {alert.title}</span>
                </div>
                <span className="text-[11px] text-emerald-400">Mitigated</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Incident Response Plan Modal */}
      {activeIncidentPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-xl rounded-2xl glass-overlay p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-white/[0.08]">
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-electric uppercase tracking-wider">
                  ACTION PROTOCOL • {activeIncidentPlan.severity}
                </span>
                <h2 className="text-base font-bold text-white mt-1">
                  {activeIncidentPlan.title}
                </h2>
                <div className="text-xs font-mono text-[#94A3B8]">
                  Lead: {activeIncidentPlan.leadAgency}
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
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#94A3B8] font-bold block">
                Executive Briefing:
              </span>
              <p>{activeIncidentPlan.executiveSummary}</p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-cyan-electric font-bold block">
                Immediate Actions (0 - 15 Mins):
              </span>
              <div className="space-y-1.5">
                {activeIncidentPlan.immediateActions.map((act, i) => (
                  <div key={i} className="p-2.5 rounded-xl glass-tab text-xs text-slate-200 flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-electric font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{act}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-white/[0.08]">
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
                className="px-4 py-1.5 rounded-xl text-xs font-bold text-[#090B10] bg-cyan-electric hover:bg-cyan-400"
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
