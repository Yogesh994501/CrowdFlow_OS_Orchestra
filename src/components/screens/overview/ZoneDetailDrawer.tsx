import React, { useEffect } from 'react';
import { 
  X, 
  ExternalLink 
} from 'lucide-react';
import { StatusBadge } from '../../common/StatusBadge';
import type { Zone } from '../../../types';

interface ZoneDetailDrawerProps {
  selectedZone: Zone | null;
  onClose: () => void;
  onViewOnMap: (zoneId: string) => void;
  onViewCapacity: (zoneId: string) => void;
}

export const ZoneDetailDrawer: React.FC<ZoneDetailDrawerProps> = ({
  selectedZone,
  onClose,
  onViewOnMap,
  onViewCapacity,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (selectedZone) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedZone, onClose]);

  if (!selectedZone) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md h-full glass-overlay border-l border-white/15 p-6 flex flex-col justify-between overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="space-y-6">
          
          {/* Drawer Header */}
          <div className="flex items-start justify-between pb-4 border-b border-white/[0.08]">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                ZONE DIAGNOSTIC INTEL
              </div>
              <h3 className="text-xl font-bold text-white mt-1">
                {selectedZone.name}
              </h3>
              <div className="text-xs text-slate-400 font-mono mt-0.5">
                ID: {selectedZone.id.toUpperCase()} · Peak: {selectedZone.predictedPeak}
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg glass-tab hover:text-white transition-colors"
              aria-label="Close drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Pressure Score & Status */}
          <div className="p-4 rounded-xl glass-tab flex items-center justify-between shadow-sm">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
                CALCULATED PRESSURE
              </div>
              <div className="text-3xl font-extrabold font-mono text-white mt-0.5">
                {selectedZone.pressureScore} <span className="text-xs text-slate-400 font-normal">/ 100</span>
              </div>
            </div>
            <StatusBadge status={selectedZone.status} size="md" />
          </div>

          {/* Five Dimension Bar Visualizations */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-slate-200">
              5-Point Telemetry Decomposition
            </div>

            {/* Accommodation */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Accommodation Occupancy (30%)</span>
                <span className="font-mono font-bold text-white">{selectedZone.accommodationOccupancy}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/[0.08] rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${selectedZone.accommodationOccupancy > 90 ? 'bg-rose-400' : 'bg-cyan-400'}`}
                  style={{ width: `${selectedZone.accommodationOccupancy}%` }}
                />
              </div>
            </div>

            {/* Predicted Arrivals */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Predicted Arrivals (25%)</span>
                <span className="font-mono font-bold text-white">{selectedZone.predictedArrivalsNorm}% ({selectedZone.predictedArrivals.toLocaleString()})</span>
              </div>
              <div className="h-1.5 w-full bg-white/[0.08] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-400 rounded-full"
                  style={{ width: `${selectedZone.predictedArrivalsNorm}%` }}
                />
              </div>
            </div>

            {/* Transit Load */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Transit Corridor Load (20%)</span>
                <span className="font-mono font-bold text-white">{selectedZone.transitLoad}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/[0.08] rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${selectedZone.transitLoad > 80 ? 'bg-rose-400' : 'bg-amber-400'}`}
                  style={{ width: `${selectedZone.transitLoad}%` }}
                />
              </div>
            </div>

            {/* Venue Turnstile Load */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Venue Load (15%)</span>
                <span className="font-mono font-bold text-white">{selectedZone.venueLoad}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/[0.08] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-cyan-400 rounded-full"
                  style={{ width: `${selectedZone.venueLoad}%` }}
                />
              </div>
            </div>

            {/* Weather Risk */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Weather Risk Factor (10%)</span>
                <span className="font-mono font-bold text-white">{selectedZone.weatherRisk}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/[0.08] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-slate-400 rounded-full"
                  style={{ width: `${selectedZone.weatherRisk}%` }}
                />
              </div>
            </div>

          </div>

          {/* Recommended Action for this Zone */}
          <div className="p-3.5 rounded-xl glass-tab border-cyan-500/25 space-y-1 text-xs shadow-sm">
            <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
              OPERATIONAL RECOMMENDATION
            </div>
            <p className="text-slate-300 leading-relaxed font-sans">
              {selectedZone.recommendedAction || 'Maintain continuous monitoring through next hourly sync.'}
            </p>
          </div>

        </div>

        {/* Actions at bottom of drawer */}
        <div className="pt-4 border-t border-white/[0.08] flex items-center gap-2.5">
          <button
            onClick={() => onViewOnMap(selectedZone.id)}
            className="flex-1 py-2 rounded-xl bg-cyan-400 text-[#080B12] text-xs font-bold font-mono tracking-wider hover:bg-cyan-300 transition-colors flex items-center justify-center gap-1.5 shadow-md"
          >
            <span>View on Live Map</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onViewCapacity(selectedZone.id)}
            className="py-2 px-3.5 rounded-xl glass-tab text-slate-300 hover:text-white text-xs font-mono transition-colors"
          >
            Stays
          </button>
        </div>

      </div>
    </div>
  );
};
