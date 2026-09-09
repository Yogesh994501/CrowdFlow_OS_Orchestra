import React, { useState } from 'react';
import { useCrowdFlowStore } from '../../store/useCrowdFlowStore';
import { 
  Printer, 
  Copy, 
  Check, 
  X, 
  FileText, 
  ShieldAlert, 
  Sparkles, 
  Building2, 
  Bus, 
  Clock, 
  CheckCircle2 
} from 'lucide-react';

interface ExecutiveBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExecutiveBriefingModal: React.FC<ExecutiveBriefingModalProps> = ({
  isOpen,
  onClose
}) => {
  const { 
    zones, 
    alerts, 
    interventions, 
    currentScenario, 
    weather,
    temporalMinutes 
  } = useCrowdFlowStore();

  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const totalVisitors = zones.reduce((acc, z) => acc + z.activeVisitors, 0);
  const avgPressure = zones.length > 0 ? Math.round(zones.reduce((acc, z) => acc + z.pressureScore, 0) / zones.length) : 0;
  const criticalZones = zones.filter(z => z.status === 'critical');
  const approvedInterventions = interventions.filter(i => i.status === 'approved' || i.status === 'executing' || i.status === 'completed');

  const reportDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const reportTime = new Date().toLocaleTimeString();

  const generateMarkdown = () => {
    return `# CrowdFlow OS - Executive Incident Briefing
**Event**: Mumbai Mega Event 2026 (Jio World Convention Centre & Metropolitan Sectors)
**Generated**: ${reportDate} at ${reportTime}
**Active Scenario**: ${currentScenario.toUpperCase()}
**Metropolitan Risk Index**: ${avgPressure} / 100
**Active Visitors**: ${totalVisitors.toLocaleString()} across 8 monitored sectors

---

## 1. Executive Summary
- **Current System Status**: ${avgPressure >= 75 ? 'HIGH ALERT / SURGE DETECTED' : 'OPERATIONAL EQUILIBRIUM'}
- **Critical Choke Points (${criticalZones.length})**: ${criticalZones.map(z => `${z.name} (Score: ${z.pressureScore})`).join(', ') || 'None currently active'}
- **Weather Condition**: ${weather.temperature}°C, ${weather.condition} (Risk Index: ${weather.weatherRisk}/100)
- **Temporal Forecast Offset**: +${Math.round(temporalMinutes)} minutes from live ticker

---

## 2. Authorized Cross-Sector Interventions (${approvedInterventions.length})
${approvedInterventions.length === 0 ? '- No automated interventions executed yet.' : approvedInterventions.map(i => `
### [${i.category.toUpperCase()}] ${i.title}
- **Target Sector**: ${i.targetZoneName}
- **Action Type**: ${i.actionType}
- **Confidence Score**: ${i.confidence}%
- **Expected Impact**: ${i.expectedImpact}
- **Assigned Operator**: ${i.assignedOperator}
- **Timestamp**: ${i.createdAt}
`).join('\n')}

---

## 3. High-Priority Incidents & Alerts
${alerts.slice(0, 5).map(a => `- **[${a.severity.toUpperCase()}]** ${a.title} (${a.zoneName}): ${a.message}`).join('\n')}

---
*Report generated automatically by CrowdFlow OS Decision Engine.*`;
  };

  const handleCopyMarkdown = () => {
    const md = generateMarkdown();
    navigator.clipboard.writeText(md).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl transition-opacity print:hidden"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl rounded-2xl bg-slate-900 border border-cyan-500/30 shadow-[0_25px_70px_rgba(0,0,0,0.85)] max-h-[90vh] flex flex-col overflow-hidden animate-scale-up print:m-0 print:p-0 print:border-none print:shadow-none print:max-w-none print:bg-white print:text-black">
        
        {/* Header Bar (Hidden in Print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-white/[0.02] print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Executive Incident Briefing</h2>
              <p className="text-xs text-slate-400 font-mono">Real-time situational post-mortem & mitigation summary</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-tab text-xs font-mono text-cyan-300 hover:text-white transition-all border-cyan-500/30"
              title="Copy Markdown to Clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Markdown' : 'Copy Markdown'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold transition-all shadow-md"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white transition-colors ml-2"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Report Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 font-sans print:p-0 print:space-y-4">
          
          {/* Document Title Block */}
          <div className="border-b border-white/10 pb-4 print:border-black/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold print:text-cyan-700">
                OFFICIAL SITUATION REPORT
              </span>
              <span className="text-xs font-mono text-slate-400 print:text-slate-600">
                {reportDate} • {reportTime}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1 print:text-black">
              Mumbai Mega Event 2026 — Operations Briefing
            </h1>
            <p className="text-xs text-slate-300 mt-1 print:text-slate-700">
              Generated via CrowdFlow OS Automated Decision Intelligence Engine.
            </p>
          </div>

          {/* KPI Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 print:gap-2">
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 print:border-slate-300 print:bg-slate-50">
              <div className="text-xs font-mono uppercase text-slate-400 print:text-slate-600">System Pressure</div>
              <div className={`text-2xl font-mono font-extrabold mt-1 ${avgPressure >= 75 ? 'text-rose-400 print:text-rose-700' : 'text-emerald-400 print:text-emerald-700'}`}>
                {avgPressure}<span className="text-xs text-slate-400">/100</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 print:border-slate-300 print:bg-slate-50">
              <div className="text-xs font-mono uppercase text-slate-400 print:text-slate-600">Active Visitors</div>
              <div className="text-2xl font-mono font-extrabold text-white mt-1 print:text-black">
                {totalVisitors.toLocaleString()}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 print:border-slate-300 print:bg-slate-50">
              <div className="text-xs font-mono uppercase text-slate-400 print:text-slate-600">Critical Sectors</div>
              <div className="text-2xl font-mono font-extrabold text-amber-400 mt-1 print:text-amber-700">
                {criticalZones.length}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 print:border-slate-300 print:bg-slate-50">
              <div className="text-xs font-mono uppercase text-slate-400 print:text-slate-600">Active Scenario</div>
              <div className="text-sm font-mono font-bold text-cyan-300 mt-2 truncate uppercase print:text-cyan-800">
                {currentScenario}
              </div>
            </div>
          </div>

          {/* Section 1: Bottleneck Sectors */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold border-b border-white/10 pb-1 print:text-black print:border-black/20">
              1. SECTOR PRESSURE & BOTTLENECK ANALYSIS
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {zones.map(z => (
                <div key={z.id} className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.08] flex items-center justify-between print:border-slate-200">
                  <div className="font-semibold text-slate-200 print:text-black">{z.name}</div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-slate-400 print:text-slate-600">{z.activeVisitors.toLocaleString()} pax</span>
                    <span className={`px-2 py-0.5 rounded font-bold ${
                      z.pressureScore >= 85 ? 'bg-rose-500/20 text-rose-300 print:text-rose-800' :
                      z.pressureScore >= 70 ? 'bg-amber-500/20 text-amber-300 print:text-amber-800' :
                      'bg-emerald-500/20 text-emerald-300 print:text-emerald-800'
                    }`}>
                      {z.pressureScore}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Authorized Interventions Log */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold border-b border-white/10 pb-1 print:text-black print:border-black/20">
              2. AUTHORIZED INTERVENTIONS LOG
            </h3>
            {approvedInterventions.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">No cross-sector interventions have been authorized in this operational cycle.</p>
            ) : (
              <div className="space-y-2">
                {approvedInterventions.map(int => (
                  <div key={int.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.08] text-xs space-y-1 print:border-slate-300">
                    <div className="flex items-center justify-between font-mono">
                      <span className="font-bold text-cyan-300 uppercase print:text-cyan-800">
                        [{int.category}] {int.title}
                      </span>
                      <span className="text-emerald-400 font-semibold print:text-emerald-700">
                        Confidence: {int.confidence}%
                      </span>
                    </div>
                    <p className="text-slate-300 print:text-slate-700 leading-relaxed font-sans">
                      <strong>Expected Impact:</strong> {int.expectedImpact}
                    </p>
                    <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400 print:text-slate-500 pt-1">
                      <span>Target: {int.targetZoneName}</span>
                      <span>Operator: {int.assignedOperator}</span>
                      <span>Authorized at: {int.createdAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Document Footer */}
          <div className="pt-4 border-t border-white/10 text-center text-xs font-mono text-slate-500 print:border-black/20 print:text-slate-600">
            CONFIDENTIAL — FOR INTERNAL COMMAND CENTER & EMERGENCY OPERATIONS USE ONLY
          </div>

        </div>

      </div>
    </div>
  );
};
