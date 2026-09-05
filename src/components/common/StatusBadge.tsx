import React from 'react';
import { PressureStatus } from '../../types';
import { CheckCircle2, AlertTriangle, AlertOctagon, ShieldAlert } from 'lucide-react';

interface StatusBadgeProps {
  status: PressureStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  label?: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
  label,
  className = '',
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'stable':
        return {
          text: label || 'STABLE',
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          dot: 'bg-emerald-400',
          icon: CheckCircle2,
        };
      case 'watch':
        return {
          text: label || 'WATCH',
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          dot: 'bg-amber-400',
          icon: AlertTriangle,
        };
      case 'high':
        return {
          text: label || 'HIGH PRESSURE',
          bg: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
          dot: 'bg-orange-400',
          icon: ShieldAlert,
        };
      case 'critical':
        return {
          text: label || 'CRITICAL',
          bg: 'bg-rose-500/15 text-rose-400 border-rose-500/40 shadow-glow-critical',
          dot: 'bg-rose-400 animate-ping',
          icon: AlertOctagon,
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1 font-medium',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-bold',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border backdrop-blur-sm uppercase tracking-wider ${config.bg} ${sizeClasses} ${className}`}
    >
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />}
      <span>{config.text}</span>
    </span>
  );
};
