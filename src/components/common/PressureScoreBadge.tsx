import React from 'react';
import type { PressureStatus } from '../../types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

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
  const getColorClass = () => {
    switch (status) {
      case 'stable':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'watch':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'high':
        return 'text-orange-400 bg-orange-500/15 border-orange-500/40';
      case 'critical':
        return 'text-rose-400 bg-rose-500/20 border-rose-500/40 shadow-glow-critical';
    }
  };

  const getTrendIcon = () => {
    if (trend === 'rising') return <span title="Rising pressure"><TrendingUp className="w-3.5 h-3.5 text-rose-400" /></span>;
    if (trend === 'falling') return <span title="Falling pressure"><TrendingDown className="w-3.5 h-3.5 text-emerald-400" /></span>;
    if (trend === 'stable') return <span title="Stable pressure"><Minus className="w-3.5 h-3.5 text-slate-400" /></span>;
    return null;
  };

  return (
    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border backdrop-blur-sm ${getColorClass()}`}>
      {showLabel && <span className="text-xs uppercase tracking-wider text-slate-400 font-mono">Pressure:</span>}
      <span className={`font-mono font-bold ${size === 'lg' ? 'text-lg' : size === 'sm' ? 'text-xs' : 'text-sm'}`}>
        {score} <span className="text-xs font-normal opacity-70">/ 100</span>
      </span>
      {trend && getTrendIcon()}
    </div>
  );
};
