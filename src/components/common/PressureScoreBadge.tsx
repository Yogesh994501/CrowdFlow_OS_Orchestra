import React from 'react';
import type { PressureStatus } from '../../types';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  AlertOctagon 
} from 'lucide-react';

interface PressureScoreBadgeProps {
  score: number;
  status: PressureStatus;
  trend?: 'rising' | 'falling' | 'stable';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const PressureScoreBadge: React.FC<PressureScoreBadgeProps> = ({
  score,
  status,
  trend,
  size = 'md',
  showLabel = true,
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'stable':
        return {
          style: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
          icon: CheckCircle2,
          label: 'STABLE'
        };
      case 'watch':
        return {
          style: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
          icon: AlertTriangle,
          label: 'WATCH'
        };
      case 'high':
        return {
          style: 'text-orange-400 bg-orange-500/15 border-orange-500/40',
          icon: ShieldAlert,
          label: 'HIGH'
        };
      case 'critical':
        return {
          style: 'text-rose-400 bg-rose-500/20 border-rose-500/40 shadow-glow-critical',
          icon: AlertOctagon,
          label: 'CRITICAL'
        };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;

  const getTrendIcon = () => {
    if (trend === 'rising') return <span title="Rising pressure"><TrendingUp className="w-3.5 h-3.5 text-rose-400" /></span>;
    if (trend === 'falling') return <span title="Falling pressure"><TrendingDown className="w-3.5 h-3.5 text-emerald-400" /></span>;
    if (trend === 'stable') return <span title="Stable pressure"><Minus className="w-3.5 h-3.5 text-slate-400" /></span>;
    return null;
  };

  const iconSizeClass = size === 'lg' ? 'w-4 h-4' : size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';

  return (
    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border backdrop-blur-sm ${config.style}`}>
      <span title={`${config.label} Status`} className="flex items-center">
        <StatusIcon className={`${iconSizeClass} shrink-0`} />
      </span>
      {showLabel && <span className="text-xs uppercase tracking-wider text-slate-400 font-mono">Pressure:</span>}
      <span className={`font-mono font-bold ${size === 'lg' ? 'text-lg' : size === 'sm' ? 'text-xs' : 'text-sm'}`}>
        {score} <span className="text-xs font-normal opacity-70">/ 100</span>
      </span>
      {trend && getTrendIcon()}
    </div>
  );
};
