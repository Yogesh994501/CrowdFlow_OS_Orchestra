import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

export const SkeletonLoader: React.FC<SkeletonProps> = ({ 
  className = '', 
  width, 
  height 
}) => {
  return (
    <div 
      className={`skeleton-shimmer ${className}`}
      style={{
        width: width,
        height: height,
      }}
      aria-hidden="true"
    />
  );
};

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`p-4 rounded-xl panel-elevated space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <SkeletonLoader className="h-4 w-28 rounded-md" />
        <SkeletonLoader className="h-4 w-12 rounded-md" />
      </div>
      <SkeletonLoader className="h-8 w-24 rounded-lg" />
      <div className="space-y-1.5 pt-1">
        <SkeletonLoader className="h-3 w-full rounded" />
        <SkeletonLoader className="h-3 w-3/4 rounded" />
      </div>
    </div>
  );
};

export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 4 }) => {
  return (
    <div className="space-y-2.5 p-3 rounded-xl panel-base">
      <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
        <SkeletonLoader className="h-4 w-32 rounded-md" />
        <SkeletonLoader className="h-4 w-20 rounded-md" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-2 border-b border-white/[0.04]">
          <SkeletonLoader className="h-4 w-6 rounded" />
          <SkeletonLoader className="h-4 flex-1 rounded" />
          <SkeletonLoader className="h-4 w-16 rounded" />
          <SkeletonLoader className="h-4 w-12 rounded" />
        </div>
      ))}
    </div>
  );
};
