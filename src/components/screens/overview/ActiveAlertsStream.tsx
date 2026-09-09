import React from 'react';
import { 
  ShieldAlert, 
  ChevronRight, 
  AlertOctagon, 
  AlertTriangle 
} from 'lucide-react';
import type { OperationalAlert } from '../../../types';

interface ActiveAlertsStreamProps {
  alerts: OperationalAlert[];
  criticalCount: number;
  onNavigateToAlerts: () => void;
}

export const ActiveAlertsStream: React.FC<ActiveAlertsStreamProps> = ({
  alerts,
  criticalCount,
  onNavigateToAlerts,
}) => {
  return (
    <div className="rounded-2xl p-6 flex flex-col justify-between space-y-4 panel-elevated">
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            ACTIVE ALERTS STREAM
          </span>
          <span className="text-xs font-mono text-slate-400">
            <strong className="text-rose-400 flex items-center gap-1 inline-flex">
              <AlertOctagon className="w-3 h-3" /> {criticalCount} Critical
            </strong>
          </span>
        </div>

        <div className="space-y-2.5">
          {alerts.slice(0, 3).map(alert => {
            const isCritical = alert.severity === 'critical';
            const SeverityIcon = isCritical ? AlertOctagon : AlertTriangle;
            return (
              <div
                key={alert.id}
                onClick={onNavigateToAlerts}
                className="p-3 rounded-xl glass-tab hover:border-cyan-400/40 cursor-pointer transition-all space-y-1 group"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className={`font-bold uppercase flex items-center gap-1 ${isCritical ? 'text-rose-400' : 'text-amber-400'}`}>
                    <SeverityIcon className="w-3 h-3" />
                    <span>{alert.severity}</span>
                  </span>
                  <span className="text-slate-400">{alert.timestamp}</span>
                </div>
                <div className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors truncate">
                  {alert.title}
                </div>
                <p className="text-xs text-slate-400 line-clamp-1 font-sans">
                  {alert.cause || alert.message}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={onNavigateToAlerts}
        className="w-full py-2.5 rounded-xl text-xs font-medium glass-tab text-slate-300 hover:text-white transition-all flex items-center justify-center gap-1.5 shadow-sm"
      >
        <span>View All Operational Alerts ({alerts.length})</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
