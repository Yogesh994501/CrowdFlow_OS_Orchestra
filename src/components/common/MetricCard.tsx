import React from 'react';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendGood?: boolean; // if true, down is green or up is green
  icon?: LucideIcon;
  subtitle?: string;
  sparklineData?: number[];
  accentColor?: 'cyan' | 'amber' | 'emerald' | 'rose' | 'indigo';
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  change,
  trend,
  trendGood = true,
  icon: Icon,
  subtitle,
  sparklineData = [35, 42, 38, 55, 62, 58, 70, 68, 76],
  accentColor = 'cyan',
  onClick,
}) => {
  const getAccentBorder = () => {
    switch (accentColor) {
      case 'cyan':
        return 'hover:border-cyan-500/40 hover:shadow-glow-cyan-sm';
      case 'rose':
        return 'hover:border-rose-500/40 hover:shadow-glow-critical';
      case 'amber':
        return 'hover:border-amber-500/40 hover:shadow-glow-amber';
      case 'emerald':
        return 'hover:border-emerald-500/40 hover:shadow-glow-green';
      default:
        return 'hover:border-indigo-500/40';
    }
  };

  const isPositive = trend === 'up';
  const trendColorClass =
    trend === 'neutral'
      ? 'text-slate-400 bg-slate-800/60 border-slate-700'
      : (isPositive && trendGood) || (!isPositive && !trendGood)
      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
      : 'text-rose-400 bg-rose-500/10 border-rose-500/30';

  // Generate SVG sparkline path
  const min = Math.min(...sparklineData);
  const max = Math.max(...sparklineData);
  const range = max - min || 1;
  const width = 100;
  const height = 28;
  const points = sparklineData
    .map((d, i) => {
      const x = (i / (sparklineData.length - 1)) * width;
      const y = height - ((d - min) / range) * (height - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <div
      onClick={onClick}
      className={`relative group rounded-2xl glass-panel p-4 md:p-5 transition-all duration-300 ${getAccentBorder()} ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="space-y-1">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block font-semibold">
            {title}
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl lg:text-3xl font-bold tracking-tight text-white font-mono">
              {value}
            </span>
            {unit && <span className="text-xs text-slate-400 font-sans">{unit}</span>}
          </div>
        </div>
        {Icon && (
          <div className="w-9 h-9 rounded-xl bg-dark-800/80 border border-white/10 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <div className="flex items-center gap-2">
          {change && (
            <span
              className={`inline-flex items-center gap-0.5 text-xs font-mono font-medium px-2 py-0.5 rounded border ${trendColorClass}`}
            >
              {trend === 'up' && <TrendingUp className="w-3 h-3" />}
              {trend === 'down' && <TrendingDown className="w-3 h-3" />}
              {change}
            </span>
          )}
          {subtitle && (
            <span className="text-xs text-slate-400 line-clamp-1">{subtitle}</span>
          )}
        </div>

        {/* Micro Sparkline */}
        <div className="w-16 h-6 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
            <polyline
              fill="none"
              stroke={accentColor === 'rose' ? '#EF4444' : accentColor === 'amber' ? '#F59E0B' : '#06B6D4'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
