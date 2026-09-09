import React, { useState, useMemo } from 'react';
import { useCrowdFlowStore } from '../../store/useCrowdFlowStore';
import { 
  LayoutDashboard, 
  HelpCircle, 
  Sparkles, 
  X 
} from 'lucide-react';
import type { Zone } from '../../types';
import { SystemHealthHero } from './overview/SystemHealthHero';
import { ActionableCriticalAlert } from './overview/ActionableCriticalAlert';
import { KpiCardsRow } from './overview/KpiCardsRow';
import { ZonePressureMatrix } from './overview/ZonePressureMatrix';
import { ActiveAlertsStream } from './overview/ActiveAlertsStream';
import { ZoneDetailDrawer } from './overview/ZoneDetailDrawer';
import { PressureFormulaModal } from '../common/PressureFormulaModal';

export const OverviewScreen: React.FC = () => {
  const { 
    zones, 
    alerts, 
    interventions, 
    setActiveScreen, 
    setSelectedZoneId,
    approveIntervention,
    weather,
    currentScenario 
  } = useCrowdFlowStore();

  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [justApproved, setJustApproved] = useState(false);
  const [isFormulaModalOpen, setIsFormulaModalOpen] = useState(false);
  const [showCoachBanner, setShowCoachBanner] = useState(true);

  // Aggregated operational metrics with memoization and zero-division safeguard
  const totalVisitors = useMemo(() => {
    return zones.reduce((acc, z) => acc + z.activeVisitors, 0);
  }, [zones]);

  const avgOccupancy = useMemo(() => {
    if (zones.length === 0) return 0;
    return Math.round(zones.reduce((acc, z) => acc + z.accommodationOccupancy, 0) / zones.length);
  }, [zones]);

  const avgTransit = useMemo(() => {
    if (zones.length === 0) return 0;
    return Math.round(zones.reduce((acc, z) => acc + z.transitLoad, 0) / zones.length);
  }, [zones]);

  const systemPressureScore = useMemo(() => {
    if (zones.length === 0) return 0;
    return Math.round(zones.reduce((acc, z) => acc + z.pressureScore, 0) / zones.length);
  }, [zones]);

  const pendingInterventions = useMemo(() => {
    return interventions.filter(i => i.status === 'pending');
  }, [interventions]);

  const criticalAlerts = useMemo(() => {
    return alerts.filter(a => a.severity === 'critical' || a.severity === 'high');
  }, [alerts]);

  const activeIntervention = pendingInterventions[0];

  // Scenario-reactive operational timeline & bottleneck
  const scenarioData = useMemo(() => {
    switch (currentScenario) {
      case 'heavy_rain':
        return {
          slots: [
            { time: '12:00', isPeak: false },
            { time: '▲ 14:00 (EARLY INFLOW)', isPeak: true },
            { time: '▲ 16:00 (RAIN PEAK)', isPeak: true },
            { time: '18:00', isPeak: false },
            { time: '20:00', isPeak: false },
          ],
          peakWindow: 'Peak Window: 14:00 - 17:30 (Early Inflow / Rain)',
          bottleneckTitle: 'Dadar & BKC Transit Hub Concourse Saturation',
          bottleneckSub: '· Platform drainage warning · +2,140 delayed arrivals'
        };
      case 'metro_disruption':
        return {
          slots: [
            { time: '12:00', isPeak: false },
            { time: '14:00', isPeak: false },
            { time: '▲ 16:00 (BUS RELIEF)', isPeak: true },
            { time: '▲ 18:00 (GRIDLOCK)', isPeak: true },
            { time: '▲ 20:00 (EVENING CROWD)', isPeak: true },
          ],
          peakWindow: 'Peak Window: 16:00 - 21:00 (Extended Disruption)',
          bottleneckTitle: 'Metro Line 3 Intermodal Surface Backlog',
          bottleneckSub: '· Bus bridges operating at 94% load · +3,400 queued'
        };
      case 'hotel_saturation':
        return {
          slots: [
            { time: '12:00', isPeak: false },
            { time: '14:00', isPeak: false },
            { time: '16:00', isPeak: false },
            { time: '▲ 18:00 (CHECK-IN)', isPeak: true },
            { time: '▲ 20:00 (SPIKE)', isPeak: true },
          ],
          peakWindow: 'Peak Window: 18:00 - 22:30 (Overnight Stays)',
          bottleneckTitle: 'BKC & Bandra Accommodation Depletion',
          bottleneckSub: '· 98.4% occupied · +1,850 delegates awaiting buffer hubs'
        };
      case 'gate_closure':
        return {
          slots: [
            { time: '12:00', isPeak: false },
            { time: '14:00', isPeak: false },
            { time: '16:00', isPeak: false },
            { time: '▲ 18:00 (GATE SPIKE)', isPeak: true },
            { time: '20:00', isPeak: false },
          ],
          peakWindow: 'Peak Window: 17:00 - 19:30 (Gate 2 Diversion)',
          bottleneckTitle: 'Gate 1 & 3 Turnstile Convergence Bottleneck',
          bottleneckSub: '· Gate 2 shutdown causing +18m queue delays'
        };
      case 'demand_surge':
        return {
          slots: [
            { time: '12:00', isPeak: false },
            { time: '▲ 14:00 (INFLOW)', isPeak: true },
            { time: '▲ 16:00 (HIGH SURGE)', isPeak: true },
            { time: '▲ 18:00 (PEAK CAPACITY)', isPeak: true },
            { time: '▲ 20:00 (DISPERSAL)', isPeak: true },
          ],
          peakWindow: 'Peak Window: 14:00 - 21:00 (Sustained Inflow)',
          bottleneckTitle: 'Venue Perimeter & Concourse Overcapacity',
          bottleneckSub: '· 97% max envelope reached · Buffer holding active'
        };
      default:
        return {
          slots: [
            { time: '12:00', isPeak: false },
            { time: '14:00', isPeak: false },
            { time: '16:00', isPeak: false },
            { time: '▲ 18:00 (PEAK)', isPeak: true },
            { time: '20:00', isPeak: false },
          ],
          peakWindow: 'Peak Window: 17:30 - 20:00',
          bottleneckTitle: 'BKC accommodation approaching capacity',
          bottleneckSub: '· 96% occupied · +1,240 predicted arrivals'
        };
    }
  }, [currentScenario]);

  // Group zones by status tier
  const criticalZones = useMemo(() => zones.filter(z => z.status === 'critical'), [zones]);
  const highZones = useMemo(() => zones.filter(z => z.status === 'high'), [zones]);
  const watchZones = useMemo(() => zones.filter(z => z.status === 'watch'), [zones]);
  const stableZones = useMemo(() => zones.filter(z => z.status === 'stable'), [zones]);

  const handleApprove = (id: string) => {
    approveIntervention(id);
    setJustApproved(true);
    setTimeout(() => setJustApproved(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12 max-w-[1520px] mx-auto relative selection:bg-cyan-500/30">
      
      {/* Subtle Ambient Radial Lighting */}
      <div className="absolute -top-12 -right-12 w-96 h-96 rounded-full bg-cyan-500/[0.03] blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 -left-12 w-96 h-96 rounded-full bg-indigo-500/[0.025] blur-3xl pointer-events-none -z-10" />

      {/* Normalized Single <h1> Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <LayoutDashboard className="w-6 h-6 text-cyan-400" />
            <span>Command Center & Operations Overview</span>
          </h1>
          <p className="text-xs text-slate-400">
            Real-time metropolitan telemetry, predictive pressure scoring, and automated cross-sector interventions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFormulaModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-tab text-xs font-mono text-cyan-300 hover:text-white transition-all border border-cyan-500/30"
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>Pressure Formula Guide</span>
          </button>
        </div>
      </div>

      {/* Dismissible Coach Mark Banner (In-App Explainability Guide) */}
      {showCoachBanner && (
        <div className="p-4 rounded-2xl bg-cyan-500/[0.07] border border-cyan-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md animate-fade-in">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-xs text-slate-300 leading-relaxed font-sans">
              <strong className="text-white font-semibold">How Pressure Scores Work:</strong> Each zone score (0-100) is dynamically computed from 5 inputs: 30% Accommodation, 25% Inflow Arrivals, 20% Transit Load, 15% Turnstiles, and 10% Monsoon/Weather.
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <button
              onClick={() => setIsFormulaModalOpen(true)}
              className="text-xs font-mono font-bold text-cyan-300 hover:text-white underline underline-offset-2 px-2 py-1"
            >
              View Formula Tiers
            </button>
            <button
              onClick={() => setShowCoachBanner(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
              title="Dismiss banner"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 1. TOP ROW: SYSTEM HEALTH HERO + RECOMMENDED ACTION */}
      <SystemHealthHero
        systemPressureScore={systemPressureScore}
        weather={weather}
        scenarioData={scenarioData}
        activeIntervention={activeIntervention}
        justApproved={justApproved}
        onApproveIntervention={handleApprove}
        onInspectBottleneck={() => {
          setSelectedZoneId('bkc');
          setActiveScreen('capacity');
        }}
        onReviewPlan={() => setActiveScreen('interventions')}
        onOpenFormulaGuide={() => setIsFormulaModalOpen(true)}
      />

      {/* 2. DEDICATED ACTIONABLE CRITICAL ALERT */}
      <ActionableCriticalAlert
        onRedirectFlow={() => setActiveScreen('interventions')}
        onViewZone={() => {
          setSelectedZoneId('bkc');
          setActiveScreen('capacity');
        }}
        onAssignTeam={() => setActiveScreen('operators')}
      />

      {/* 3. MIDDLE ROW: 4 VITAL KPI GLASS CARDS */}
      <KpiCardsRow
        totalVisitors={totalVisitors}
        avgOccupancy={avgOccupancy}
        avgTransit={avgTransit}
        zoneCount={zones.length}
      />

      {/* 4. BOTTOM ROW: ZONE PRESSURE MATRIX + ACTIVE ALERTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8">
          <ZonePressureMatrix
            criticalZones={criticalZones}
            highZones={highZones}
            watchZones={watchZones}
            stableZones={stableZones}
            onSelectZone={(zone) => setSelectedZone(zone)}
            onNavigateToMap={() => setActiveScreen('map')}
          />
        </div>

        <div className="lg:col-span-4">
          <ActiveAlertsStream
            alerts={alerts}
            criticalCount={criticalAlerts.length}
            onNavigateToAlerts={() => setActiveScreen('alerts')}
          />
        </div>
      </div>

      {/* 5. CONTEXTUAL PROGRESSIVE DISCLOSURE DRAWER */}
      <ZoneDetailDrawer
        selectedZone={selectedZone}
        onClose={() => setSelectedZone(null)}
        onViewOnMap={(zoneId) => {
          setSelectedZoneId(zoneId);
          setActiveScreen('map');
        }}
        onViewCapacity={(zoneId) => {
          setSelectedZoneId(zoneId);
          setActiveScreen('capacity');
        }}
      />

      {/* 6. PRESSURE SCORE FORMULA & THRESHOLDS GUIDE MODAL */}
      <PressureFormulaModal
        isOpen={isFormulaModalOpen}
        onClose={() => setIsFormulaModalOpen(false)}
      />

    </div>
  );
};
