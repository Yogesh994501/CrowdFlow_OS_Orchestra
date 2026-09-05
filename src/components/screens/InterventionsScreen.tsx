import React, { useState } from 'react';
import { useCrowdFlowStore } from '../../store/useCrowdFlowStore';
import { ExplainabilityPanel } from '../common/ExplainabilityPanel';
import { Intervention } from '../../types';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Sliders, 
  ShieldCheck, 
  History, 
  TrendingDown, 
  Layers, 
  UserCheck, 
  Workflow 
} from 'lucide-react';

export const InterventionsScreen: React.FC = () => {
  const { 
    interventions, 
    approveIntervention, 
    rejectIntervention, 
    executeIntervention 
  } = useCrowdFlowStore();

  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  const pendingInterventions = interventions.filter(i => i.status === 'pending' || i.status === 'approved' || i.status === 'reviewing');
  const historyInterventions = interventions.filter(i => i.status === 'completed' || i.status === 'rejected');

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-cyan-400" />
            <span>Intervention Orchestration Engine</span>
          </h1>
          <p className="text-xs text-slate-400">
            End-to-end explainable operational workflows: Review, Modify, Authorize, Execute, and Measure Real-World Impact.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-dark-900 border border-white/10 text-xs font-mono">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'active'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Active Recommendations ({pendingInterventions.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'history'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Executed History ({historyInterventions.length})</span>
          </button>
        </div>
      </div>

      {/* Operational Workflow Progress Stepper */}
      <div className="p-4 rounded-2xl glass-panel border border-white/10">
        <div className="flex items-center justify-between overflow-x-auto pb-1 text-xs font-mono">
          {[
            { step: '1', title: 'AI Recommendation', desc: 'Continuous Telemetry Fusion' },
            { step: '2', title: 'Human Review', desc: 'Inspect Signals & Trade-offs' },
            { step: '3', title: 'Approve & Assign', desc: 'Designate Operator Role' },
            { step: '4', title: 'Execute', desc: 'Publish Capacity & Route' },
            { step: '5', title: 'Measure Impact', desc: 'Verify Pressure Drop' },
          ].map((s, idx) => (
            <div key={s.step} className="flex items-center gap-2 shrink-0 px-2">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center font-bold text-[11px]">
                {s.step}
              </div>
              <div>
                <div className="font-semibold text-white">{s.title}</div>
                <div className="text-[10px] text-slate-400 font-sans">{s.desc}</div>
              </div>
              {idx < 4 && <ArrowRight className="w-4 h-4 text-slate-600 mx-2" />}
            </div>
          ))}
        </div>
      </div>

      {/* Main List: Active or History */}
      {activeTab === 'active' ? (
        <div className="space-y-4">
          {pendingInterventions.length === 0 ? (
            <div className="p-12 text-center rounded-3xl glass-panel border border-white/10 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h3 className="text-base font-bold text-white">All Recommended Interventions Executed</h3>
              <p className="text-xs text-slate-400">
                The operations platform has normalized current bottlenecks. Live sensors continue monitoring for new surges.
              </p>
            </div>
          ) : (
            pendingInterventions.map(int => (
              <ExplainabilityPanel
                key={int.id}
                intervention={int}
                onApprove={approveIntervention}
                onReject={rejectIntervention}
                onExecute={executeIntervention}
              />
            ))
          )}
        </div>
      ) : (
        /* History View with Before/After Pressure Delta */
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-3xl glass-panel border border-white/10 p-5">
            <h3 className="text-base font-bold text-white mb-1">
              Executed Interventions Audit Log
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Historical record of authorized interventions, designated operators, and actual measured pressure reductions.
            </p>

            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 text-[11px] uppercase tracking-wider">
                  <th className="py-2.5 px-3">Intervention Action</th>
                  <th className="py-2.5 px-3">Target Zone</th>
                  <th className="py-2.5 px-3">Assigned Operator</th>
                  <th className="py-2.5 px-3 text-center">Before Pressure</th>
                  <th className="py-2.5 px-3 text-center">After Pressure</th>
                  <th className="py-2.5 px-3 text-right">Measured Impact</th>
                  <th className="py-2.5 px-3 text-right">Execution Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {historyInterventions.map(int => (
                  <tr key={int.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-3">
                      <div className="font-bold text-white">{int.title}</div>
                      <div className="text-[10px] text-slate-400 font-sans">{int.actionType}</div>
                    </td>
                    <td className="py-3 px-3 text-cyan-300 font-medium">
                      {int.targetZoneName}
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      {int.assignedOperator}
                    </td>
                    <td className="py-3 px-3 text-center text-rose-400 font-bold">
                      {int.beforePressure ?? 91}
                    </td>
                    <td className="py-3 px-3 text-center text-emerald-400 font-bold">
                      {int.afterPressure ?? (91 - int.pressureReduction)}
                    </td>
                    <td className="py-3 px-3 text-right text-emerald-300 font-bold">
                      -{int.pressureReduction} pts
                    </td>
                    <td className="py-3 px-3 text-right text-slate-400">
                      {int.executedAt || '18:15:22'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
