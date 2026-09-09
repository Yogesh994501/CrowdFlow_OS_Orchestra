import { create } from 'zustand';
import type { 
  UserRole, 
  DemoScenario, 
  Zone, 
  Venue, 
  AccommodationProvider, 
  TransitRoute, 
  OperationalAlert, 
  Intervention, 
  SimulationParams, 
  SimulationResult, 
  AttendeeIncentive, 
  RestaurantProvider,
  PressureStatus
} from '../types';
import { crowdService } from '../services/crowdService';
import { accommodationService } from '../services/accommodationService';
import { mobilityService } from '../services/mobilityService';
import type { CongestionCorridor } from '../services/mobilityService';
import { alertService } from '../services/alertService';
import { weatherService } from '../services/weatherService';
import type { WeatherData } from '../services/weatherService';
import { restaurantService } from '../services/restaurantService';
import { DataOrchestrator } from '../orchestrator/dataOrchestrator';
import { fallbackManager } from '../orchestrator/fallbackManager';
import type { DataSourceStatus, OrchestrationHealth } from '../orchestrator/fallbackManager';
import { EventContextBuilder } from '../orchestrator/eventContextBuilder';
import type { ZoneContext } from '../orchestrator/eventContextBuilder';
import { getProjectedZoneTelemetry } from '../services/temporalEngine';
import type { ScenarioId } from '../services/temporalEngine';
import { soundService } from '../services/soundService';

export type OpsTheme = 'rail' | 'monsoon' | 'metro' | 'glass';

interface CrowdFlowState {
  // Visual Theme Engine
  activeTheme: OpsTheme;
  setTheme: (theme: OpsTheme) => void;

  // Temporal Prediction Engine
  temporalMinutes: number;
  isForecastPlaying: boolean;
  isAudioMuted: boolean;
  setTemporalMinutes: (minutes: number) => void;
  setIsForecastPlaying: (playing: boolean) => void;
  toggleAudioMute: () => void;
  // Navigation & Role
  currentRole: UserRole;
  currentScenario: DemoScenario;
  activeScreen: 'landing' | 'overview' | 'map' | 'capacity' | 'mobility' | 'alerts' | 'interventions' | 'simulation' | 'dependency' | 'operators' | 'attendee';
  activeOperatorTab: 'hotel' | 'transport' | 'restaurant';
  activeMobileTab: 'home' | 'map' | 'plan' | 'alerts' | 'profile';
  isMobileDeviceFrame: boolean;
  selectedZoneId: string | null;

  // Live Ticker State
  isLiveDemoRunning: boolean;
  lastTickTimestamp: string;
  demoTickCount: number;

  // Domain Datasets
  zones: Zone[];
  venues: Venue[];
  accommodations: AccommodationProvider[];
  transitRoutes: TransitRoute[];
  congestionCorridors: CongestionCorridor[];
  alerts: OperationalAlert[];
  interventions: Intervention[];
  restaurants: RestaurantProvider[];
  weather: WeatherData;
  attendeeIncentives: AttendeeIncentive[];

  // Data Source Health & Intelligence Context
  dataSourceStatuses: DataSourceStatus[];
  orchestrationHealth: OrchestrationHealth;
  dataConfidence: number;
  orchestrationCycleNumber: number;
  lastOrchestrationLatencyMs: number;
  lastOrchestrationAt: string | null;
  zoneContexts: ZoneContext[];

  // Simulation Lab
  simulationParams: SimulationParams;
  simulationResult: SimulationResult | null;

  // Core Actions
  setRole: (role: UserRole) => void;
  setScenario: (scenario: DemoScenario) => void;
  setActiveScreen: (screen: CrowdFlowState['activeScreen']) => void;
  setActiveOperatorTab: (tab: 'hotel' | 'transport' | 'restaurant') => void;
  setActiveMobileTab: (tab: 'home' | 'map' | 'plan' | 'alerts' | 'profile') => void;
  toggleMobileDeviceFrame: () => void;
  setSelectedZoneId: (zoneId: string | null) => void;
  toggleLiveDemo: (forceState?: boolean) => void;
  tickMetrics: () => void;
  orchestratePipeline: (forceManual?: boolean) => Promise<void>;

  // Intervention Lifecycle
  reviewIntervention: (id: string) => void;
  approveIntervention: (id: string, operator?: string) => void;
  rejectIntervention: (id: string) => void;
  executeIntervention: (id: string) => void;

  // Alerts Actions
  acknowledgeAlert: (id: string) => void;
  assignAlertOwner: (id: string, owner: string) => void;
  resolveAlert: (id: string) => void;

  // Operator Actions
  addEmergencyShuttle: (routeId: string, count: number) => void;
  redirectTransitArrivals: (fromZone: string, toZone: string) => void;
  updateAccommodationCapacity: (id: string, newTotal: number, newOccupied: number) => void;
  toggleEmergencyBeds: (id: string, count: number) => void;
  updateRestaurantCapacity: (id: string, currentOccupied: number, mealPacks: number) => void;

  // Simulation Lab
  setSimulationParams: (params: Partial<SimulationParams>) => void;
  runSimulation: () => void;

  // Attendee Actions
  claimIncentive: (id: string) => void;
  reserveStayInterest: (accommodationId: string) => void;
  refreshWeather: () => Promise<void>;
}

const initialInterventions: Intervention[] = [
  {
    id: 'int_01',
    title: 'Redirect 18% Incoming Arrivals from BKC to Navi Mumbai',
    category: 'accommodation',
    targetZone: 'bkc',
    targetZoneName: 'Bandra-Kurla Complex',
    actionType: 'Attendee Load Shifting',
    why: 'BKC is predicted to reach 96% accommodation occupancy by 18:30 with incoming influx of 14,200 visitors.',
    signals: [
      { label: 'BKC Occupancy', value: '96%' },
      { label: 'Predicted Arrivals', value: '14,200' },
      { label: 'Navi Mumbai Availability', value: '52%' },
      { label: 'MTHL Transit Capacity', value: '82%' }
    ],
    confidence: 88,
    expectedImpact: 'Reduce BKC pressure by 12 points and prevent gate gridlock.',
    pressureReduction: 12,
    tradeOff: 'Average attendee travel time increases by approximately 11 minutes via express MTHL coach.',
    alternative: 'Activate emergency accommodation capacity in Goregaon NESCO reserve dorms.',
    status: 'pending',
    assignedOperator: 'City Transport & Hospitality Taskforce',
    createdAt: '18:10:00'
  },
  {
    id: 'int_02',
    title: 'Activate Emergency Accommodation Buffer in Goregaon',
    category: 'accommodation',
    targetZone: 'goregaon',
    targetZoneName: 'Goregaon Hub',
    actionType: 'Reserve Capacity Expansion',
    capacityAdded: 500,
    why: 'Anticipated spillover from BKC will exceed available standard rooms within 45 minutes.',
    signals: [
      { label: 'NESCO Reserve Dorms', value: '350 Beds Ready' },
      { label: 'Turnaround Time', value: '15 Minutes' },
      { label: 'Safety Index', value: '94 / 100' }
    ],
    confidence: 87,
    expectedImpact: 'Reduce overall hospitality deficit by 500 beds; lower BKC pressure by 9 points.',
    pressureReduction: 9,
    tradeOff: 'Requires operating 4 continuous feeder buses between Goregaon and BKC.',
    alternative: 'Contract private hotels in Thane at premium event rates.',
    status: 'pending',
    assignedOperator: 'Accommodation Operator Lead',
    createdAt: '18:05:00'
  },
  {
    id: 'int_03',
    title: 'Deploy 6 Dedicated Electric Shuttles on Dadar-BKC Corridor',
    category: 'transport',
    targetZone: 'dadar',
    targetZoneName: 'Dadar Transit Core',
    actionType: 'Rapid Transit Augmentation',
    capacityAdded: 480,
    why: 'Dadar railway interchange predicted to exceed safe platform footbridge capacity after 19:15.',
    signals: [
      { label: 'Dadar Footbridge Density', value: '4.8 persons/m²' },
      { label: 'Platform 3 Dwell Time', value: '+3.2 min' },
      { label: 'Available BEST Depot Fleet', value: '12 Electric Buses' }
    ],
    confidence: 92,
    expectedImpact: 'Bypass Dadar station concourse, shifting 720 passengers/hr directly to venue gates.',
    pressureReduction: 8,
    tradeOff: 'Requires dedicating 1 curbside lane on Tilak Bridge for shuttle turnaround.',
    alternative: 'Request Western Railway to increase local train halt times.',
    status: 'pending',
    assignedOperator: 'Transport Operator Lead',
    createdAt: '18:00:00'
  },
  {
    id: 'int_04',
    title: 'Open Venue Gate 2 (Express Pass) to General Admission',
    category: 'gate',
    targetZone: 'bkc',
    targetZoneName: 'Bandra-Kurla Complex',
    actionType: 'Turnstile Load Balancing',
    why: 'Jio World Convention Centre Gate 1 queue is growing 18% faster than model, exceeding 32 minutes.',
    signals: [
      { label: 'Gate 1 Queue Time', value: '32 min' },
      { label: 'Gate 2 Queue Time', value: '12 min' },
      { label: 'Turnstile 4 Status', value: 'Recalibrating' }
    ],
    confidence: 90,
    expectedImpact: 'Reduces peak concourse queue from 32 min to 14 min within 12 minutes.',
    pressureReduction: 7,
    tradeOff: 'VIP and delegate express lane will share screening portal with general badge holders.',
    alternative: 'Deploy 6 handheld mobile scanners to Gate 1 security perimeter.',
    status: 'pending',
    assignedOperator: 'Venue Operations Commander',
    createdAt: '17:55:00'
  }
];

const initialIncentives: AttendeeIncentive[] = [
  {
    id: 'inc_01',
    title: 'Early Arrival Dining Perk',
    reward: '₹250 Gourmet Food Voucher',
    why: 'Travel before 17:30 to avoid the peak evening surge at Jio World Convention Centre.',
    estimatedImpact: 'Reduces 18:00 Gate 1 peak pressure by 14%',
    expiry: 'Valid today until 17:30',
    gateOrZone: 'BKC Concourse',
    claimed: false,
    code: 'EARLY-BKC-250'
  },
  {
    id: 'inc_02',
    title: 'Gate 2 Express Flow Reward',
    reward: 'Exclusive Event Souvenir Badge + Fast Queue Entry',
    why: 'Use Gate 2 instead of Gate 1 to bypass the 32-minute concourse queue.',
    estimatedImpact: 'Saves 20+ minutes of queuing time',
    expiry: 'Valid during peak entry (17:00 - 19:30)',
    gateOrZone: 'Gate 2 Express',
    claimed: false,
    code: 'GATE2-EXP-PASS'
  },
  {
    id: 'inc_03',
    title: 'Buffer Zone Eco-Stay Rebate',
    reward: '₹800 Transit Travel Credit + 20% Hotel Discount',
    why: 'Stay in Virār or Navi Mumbai to experience comfortable stays and zero crowd pressure.',
    estimatedImpact: 'Reduces central Mumbai hotel occupancy by 6%',
    expiry: 'Valid throughout Mega Event 2026',
    gateOrZone: 'Navi Mumbai & Virār Hubs',
    claimed: false,
    code: 'BUFFER-ECO-800'
  }
];

export const useCrowdFlowStore = create<CrowdFlowState>((set, get) => ({
  // Navigation
  currentRole: 'organizer',
  currentScenario: 'normal',
  activeScreen: 'landing',
  activeOperatorTab: 'hotel',
  activeMobileTab: 'home',
  isMobileDeviceFrame: false,
  selectedZoneId: 'bkc',

  // Live Ticker
  isLiveDemoRunning: true,
  lastTickTimestamp: new Date().toLocaleTimeString(),
  demoTickCount: 0,

  // Datasets
  zones: crowdService.getInitialZones(),
  venues: crowdService.getInitialVenues(),
  accommodations: accommodationService.getInitialProviders(),
  transitRoutes: mobilityService.getInitialRoutes(),
  congestionCorridors: mobilityService.getCongestionCorridors(),
  alerts: alertService.getInitialAlerts(),
  interventions: initialInterventions,
  restaurants: restaurantService.getInitialRestaurants(),
  weather: weatherService.getFallbackWeather(),
  attendeeIncentives: initialIncentives,

  // Data Source Health & Intelligence Context
  dataSourceStatuses: fallbackManager.getAllStatuses(),
  orchestrationHealth: fallbackManager.getOrchestrationHealth(),
  dataConfidence: fallbackManager.getOverallDataConfidence(),
  orchestrationCycleNumber: 0,
  lastOrchestrationLatencyMs: 0,
  lastOrchestrationAt: null,
  zoneContexts: [],

  // Simulation Lab
  simulationParams: {
    attendanceDelta: 15,
    weatherCondition: 'light_rain',
    eventDelayMin: 30,
    transitDisruption: 'partial',
    gateClosure: false,
    hotelCapacityLoss: false,
    emergencyShuttleAdded: true
  },
  simulationResult: null,

  // Visual Theme Engine
  activeTheme: (typeof window !== 'undefined' ? (localStorage.getItem('crowdflow_ops_theme') as OpsTheme) || 'rail' : 'rail'),
  setTheme: (theme: OpsTheme) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('crowdflow_ops_theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
    }
    soundService.playTickClick();
    set({ activeTheme: theme });
  },

  // Temporal Prediction Engine
  temporalMinutes: 0,
  isForecastPlaying: false,
  isAudioMuted: soundService.getIsMuted(),

  setTemporalMinutes: (minutes: number) => {
    const clamped = Math.max(0, Math.min(180, minutes));
    const { currentScenario, zones, isAudioMuted } = get();

    if (clamped === 0) {
      // Revert to current scenario base zones
      get().setScenario(currentScenario);
      set({ temporalMinutes: 0 });
      return;
    }

    const prevBkc = zones.find(z => z.id === 'bkc')?.pressureScore ?? 0;

    const updatedZones = zones.map(zone => {
      const telemetry = getProjectedZoneTelemetry(currentScenario as ScenarioId, zone.id, clamped);
      let status: PressureStatus = 'stable';
      if (telemetry.pressure >= 85) status = 'critical';
      else if (telemetry.pressure >= 70) status = 'high';
      else if (telemetry.pressure >= 50) status = 'watch';

      return {
        ...zone,
        pressureScore: telemetry.pressure,
        transitLoad: telemetry.transitCongestion,
        predictedArrivals: telemetry.arrivals,
        status
      };
    });

    const newBkc = updatedZones.find(z => z.id === 'bkc')?.pressureScore ?? 0;
    if (prevBkc < 75 && newBkc >= 75 && !isAudioMuted) {
      soundService.playWarningBeep();
    }

    set({ temporalMinutes: clamped, zones: updatedZones });
  },

  setIsForecastPlaying: (playing: boolean) => {
    set({ isForecastPlaying: playing });
  },

  toggleAudioMute: () => {
    const newMuted = soundService.toggleMute();
    set({ isAudioMuted: newMuted });
  },

  setRole: (role: UserRole) => {
    let nextScreen: CrowdFlowState['activeScreen'] = get().activeScreen;
    if (role === 'attendee') {
      nextScreen = 'attendee';
    } else if (role === 'hotel' || role === 'transport' || role === 'restaurant') {
      nextScreen = 'operators';
      set({ activeOperatorTab: role });
    } else if (role === 'organizer' && nextScreen === 'attendee') {
      nextScreen = 'overview';
    }
    set({ currentRole: role, activeScreen: nextScreen });
  },

  setScenario: (scenario: DemoScenario) => {
    const baseZones = crowdService.getInitialZones();
    const baseRoutes = mobilityService.getInitialRoutes();
    const baseWeather = weatherService.getFallbackWeather();

    let updatedWeather = { ...baseWeather };
    let zoneModifications: Partial<Zone>[] = [];

    if (scenario === 'hotel_saturation') {
      zoneModifications = baseZones.map(z => {
        if (z.id === 'bkc') {
          return {
            accommodationOccupancy: 99,
            predictedArrivalsNorm: 95,
            topRisk: 'Acute hospitality saturation: Zero standard rooms available in 5km radius'
          };
        }
        if (z.id === 'dadar') {
          return {
            accommodationOccupancy: 96,
            predictedArrivalsNorm: 88,
            topRisk: 'Spillover hotels at 96% occupancy'
          };
        }
        return {};
      });
    } else if (scenario === 'heavy_rain') {
      updatedWeather = weatherService.getFallbackWeather('heavy_rain');
      zoneModifications = baseZones.map(z => ({
        weatherRisk: 85,
        transitLoad: Math.min(100, z.transitLoad + 25),
        topRisk: 'Monsoon downpour causing +45m transit delays & outdoor queue waterlogging'
      }));
    } else if (scenario === 'metro_disruption') {
      zoneModifications = baseZones.map(z => {
        if (z.id === 'dadar' || z.id === 'andheri') {
          return {
            transitLoad: 98,
            topRisk: 'Metro Line 3 signalling fault diverts 18,000 riders to suburban rail'
          };
        }
        return {};
      });
    } else if (scenario === 'gate_closure') {
      zoneModifications = baseZones.map(z => {
        if (z.id === 'bkc') {
          return {
            venueLoad: 98,
            topRisk: 'Gate 1 security perimeter hold: Plaza crowd density exceeds 4.5/m²'
          };
        }
        return {};
      });
    } else if (scenario === 'demand_surge') {
      zoneModifications = baseZones.map(z => ({
        activeVisitors: Math.round(z.activeVisitors * 1.3),
        predictedArrivalsNorm: Math.min(100, z.predictedArrivalsNorm + 22),
        topRisk: 'Unexpected 30% suburban surge arriving simultaneously'
      }));
    }

    const recalculatedZones = baseZones.map((z, idx) => {
      const mod = zoneModifications[idx] || {};
      const occupancy = mod.accommodationOccupancy ?? z.accommodationOccupancy;
      const arrivals = mod.predictedArrivalsNorm ?? z.predictedArrivalsNorm;
      const transit = mod.transitLoad ?? z.transitLoad;
      const venue = mod.venueLoad ?? z.venueLoad;
      const weatherRisk = mod.weatherRisk ?? updatedWeather.weatherRisk;

      const pressureScore = crowdService.calculatePressureScore(occupancy, arrivals, transit, venue, weatherRisk);
      const status = crowdService.getPressureStatus(pressureScore);
      const topContributors = crowdService.getTopContributors(occupancy, arrivals, transit, venue, weatherRisk);

      return {
        ...z,
        ...mod,
        pressureScore,
        status,
        topContributors
      };
    });

    set({
      currentScenario: scenario,
      weather: updatedWeather,
      zones: recalculatedZones,
      transitRoutes: baseRoutes,
      lastTickTimestamp: new Date().toLocaleTimeString()
    });
  },

  setActiveScreen: (screen) => set({ activeScreen: screen }),
  setActiveOperatorTab: (tab) => set({ activeOperatorTab: tab }),
  setActiveMobileTab: (tab) => set({ activeMobileTab: tab }),
  toggleMobileDeviceFrame: () => set((s) => ({ isMobileDeviceFrame: !s.isMobileDeviceFrame })),
  setSelectedZoneId: (zoneId) => set({ selectedZoneId: zoneId }),
  toggleLiveDemo: (forceState) => set((s) => ({ isLiveDemoRunning: forceState ?? !s.isLiveDemoRunning })),

  // Improvement 12: Performance-optimized tickMetrics (structural sharing & zero-delta guard)
  tickMetrics: () => {
    const { zones, isLiveDemoRunning, demoTickCount } = get();
    if (!isLiveDemoRunning) return;

    const delta = ((demoTickCount % 2 === 0) ? 1 : -1) * (Math.random() > 0.5 ? 1 : 0);

    // Fast-path: if delta is 0, advance tick count without creating new object references
    if (delta === 0) {
      set({
        demoTickCount: demoTickCount + 1,
        lastTickTimestamp: new Date().toLocaleTimeString()
      });
      return;
    }

    let hasAnyChanged = false;
    const updatedZones = zones.map(z => {
      const occ = Math.min(99, Math.max(20, z.accommodationOccupancy + (z.id === 'bkc' ? 0 : delta)));
      const transit = Math.min(99, Math.max(20, z.transitLoad + delta));
      const arrivals = Math.min(99, Math.max(15, z.predictedArrivalsNorm + delta));
      const pressure = crowdService.calculatePressureScore(occ, arrivals, transit, z.venueLoad, z.weatherRisk);
      const status = crowdService.getPressureStatus(pressure);
      const newVisitors = Math.max(1000, z.activeVisitors + (delta * 12));

      // Structural sharing check: if values haven't changed, reuse existing object reference
      if (
        occ === z.accommodationOccupancy &&
        transit === z.transitLoad &&
        arrivals === z.predictedArrivalsNorm &&
        pressure === z.pressureScore &&
        status === z.status &&
        newVisitors === z.activeVisitors
      ) {
        return z;
      }

      hasAnyChanged = true;
      return {
        ...z,
        accommodationOccupancy: occ,
        transitLoad: transit,
        predictedArrivalsNorm: arrivals,
        pressureScore: pressure,
        status,
        activeVisitors: newVisitors
      };
    });

    set({
      zones: hasAnyChanged ? updatedZones : zones,
      demoTickCount: demoTickCount + 1,
      lastTickTimestamp: new Date().toLocaleTimeString()
    });
  },

  // Interventions Workflow
  reviewIntervention: (id: string) => {
    set((s) => ({
      interventions: s.interventions.map(i => i.id === id ? { ...i, status: 'reviewing' } : i)
    }));
  },

  approveIntervention: (id: string, operator = 'Unified Event Command') => {
    set((s) => ({
      interventions: s.interventions.map(i => 
        i.id === id ? { ...i, status: 'approved', assignedOperator: operator } : i
      )
    }));
  },

  rejectIntervention: (id: string) => {
    set((s) => ({
      interventions: s.interventions.map(i => i.id === id ? { ...i, status: 'rejected' } : i)
    }));
  },

  executeIntervention: (id: string) => {
    const intervention = get().interventions.find(i => i.id === id);
    if (!intervention) return;

    const targetZoneId = intervention.targetZone;
    const reduction = intervention.pressureReduction;

    const updatedInterventions = get().interventions.map(i => {
      if (i.id === id) {
        const beforeScore = get().zones.find(z => z.id === targetZoneId)?.pressureScore ?? 88;
        return {
          ...i,
          status: 'completed' as const,
          executedAt: new Date().toLocaleTimeString(),
          beforePressure: beforeScore,
          afterPressure: Math.max(20, beforeScore - reduction),
          actualImpact: `Target zone pressure dropped by ${reduction} points. Attendee flows rerouted smoothly.`
        };
      }
      return i;
    });

    const updatedZones = get().zones.map(z => {
      if (z.id === targetZoneId) {
        const newPressure = Math.max(25, z.pressureScore - reduction);
        return {
          ...z,
          pressureScore: newPressure,
          status: crowdService.getPressureStatus(newPressure),
          trend: 'falling' as const
        };
      }
      if (intervention.id === 'int_01' && (z.id === 'navi_mumbai' || z.id === 'goregaon')) {
        return {
          ...z,
          activeVisitors: z.activeVisitors + 1800,
          accommodationOccupancy: Math.min(80, z.accommodationOccupancy + 6)
        };
      }
      return z;
    });

    const updatedAlerts = get().alerts.map(a => {
      if (a.zoneId === targetZoneId && a.severity === 'critical') {
        return { ...a, status: 'resolved' as const, acknowledged: true };
      }
      return a;
    });

    set({
      interventions: updatedInterventions,
      zones: updatedZones,
      alerts: updatedAlerts
    });

    if (!get().isAudioMuted) {
      soundService.playSuccessChime();
    }
  },

  acknowledgeAlert: (id: string) => {
    set((s) => ({
      alerts: s.alerts.map(a => a.id === id ? { ...a, acknowledged: true } : a)
    }));
  },

  assignAlertOwner: (id: string, owner: string) => {
    set((s) => ({
      alerts: s.alerts.map(a => a.id === id ? { ...a, assignedOwner: owner, status: 'in_progress' } : a)
    }));
  },

  resolveAlert: (id: string) => {
    set((s) => ({
      alerts: s.alerts.map(a => a.id === id ? { ...a, status: 'resolved', acknowledged: true } : a)
    }));
  },

  addEmergencyShuttle: (routeId: string, count: number) => {
    set((s) => {
      const updatedRoutes: TransitRoute[] = s.transitRoutes.map(r => {
        if (r.id === routeId) {
          const newVehicles = r.vehiclesActive + count;
          const newCurrentTime = Math.max(r.normalTravelTime, r.currentTravelTime - 8);
          const newDelay = Math.max(0, Math.round(((newCurrentTime - r.normalTravelTime) / r.normalTravelTime) * 100));
          const newStatus: PressureStatus = newDelay > 50 ? 'high' : 'watch';
          return {
            ...r,
            vehiclesActive: newVehicles,
            seatsRemaining: r.seatsRemaining + (count * 45),
            currentTravelTime: newCurrentTime,
            delayPercentage: newDelay,
            status: newStatus
          };
        }
        return r;
      });

      const updatedZones = s.zones.map(z => {
        if (z.id === 'dadar' || z.id === 'bkc') {
          const newTransit = Math.max(30, z.transitLoad - 9);
          const newPressure = crowdService.calculatePressureScore(z.accommodationOccupancy, z.predictedArrivalsNorm, newTransit, z.venueLoad, z.weatherRisk);
          return {
            ...z,
            transitLoad: newTransit,
            pressureScore: newPressure,
            status: crowdService.getPressureStatus(newPressure)
          };
        }
        return z;
      });

      return {
        transitRoutes: updatedRoutes,
        zones: updatedZones
      };
    });
  },

  redirectTransitArrivals: (fromZone: string, toZone: string) => {
    set((s) => {
      const updatedZones = s.zones.map(z => {
        if (z.id === fromZone) {
          const newPressure = Math.max(30, z.pressureScore - 11);
          return {
            ...z,
            predictedArrivalsNorm: Math.max(30, z.predictedArrivalsNorm - 15),
            pressureScore: newPressure,
            status: crowdService.getPressureStatus(newPressure)
          };
        }
        if (z.id === toZone) {
          return {
            ...z,
            predictedArrivalsNorm: Math.min(85, z.predictedArrivalsNorm + 10)
          };
        }
        return z;
      });
      return { zones: updatedZones };
    });
  },

  updateAccommodationCapacity: (id: string, newTotal: number, newOccupied: number) => {
    set((s) => {
      const updatedAccommodations: AccommodationProvider[] = s.accommodations.map(a => {
        if (a.id === id) {
          const available = Math.max(0, newTotal - newOccupied);
          const occPercent = Math.round((newOccupied / newTotal) * 100);
          const newStatus: PressureStatus = occPercent > 90 ? 'critical' : occPercent > 75 ? 'high' : occPercent > 50 ? 'watch' : 'stable';
          return {
            ...a,
            totalRooms: newTotal,
            occupiedRooms: newOccupied,
            availableRooms: available,
            pressure: occPercent,
            status: newStatus
          };
        }
        return a;
      });

      return { accommodations: updatedAccommodations };
    });
  },

  toggleEmergencyBeds: (id: string, count: number) => {
    set((s) => {
      let targetZoneId = 'goregaon';
      const updatedAccommodations = s.accommodations.map(a => {
        if (a.id === id) {
          targetZoneId = a.zoneId;
          const newTotal = a.totalRooms + count;
          const newAvailable = a.availableRooms + count;
          return {
            ...a,
            totalRooms: newTotal,
            availableRooms: newAvailable,
            pressure: Math.round((a.occupiedRooms / newTotal) * 100)
          };
        }
        return a;
      });

      const updatedZones = s.zones.map(z => {
        if (z.id === targetZoneId) {
          const newOcc = Math.max(20, z.accommodationOccupancy - 8);
          const newPressure = crowdService.calculatePressureScore(newOcc, z.predictedArrivalsNorm, z.transitLoad, z.venueLoad, z.weatherRisk);
          return {
            ...z,
            accommodationOccupancy: newOcc,
            pressureScore: newPressure,
            status: crowdService.getPressureStatus(newPressure)
          };
        }
        return z;
      });

      return {
        accommodations: updatedAccommodations,
        zones: updatedZones
      };
    });
  },

  updateRestaurantCapacity: (id: string, currentOccupied: number, mealPacks: number) => {
    set((s) => ({
      restaurants: s.restaurants.map(r => {
        if (r.id === id) {
          const occPercent = Math.round((currentOccupied / r.seatingCapacity) * 100);
          const newStatus: PressureStatus = occPercent > 90 ? 'critical' : occPercent > 75 ? 'high' : 'stable';
          return {
            ...r,
            currentOccupied,
            mealInventoryPacks: mealPacks,
            status: newStatus
          };
        }
        return r;
      })
    }));
  },

  setSimulationParams: (params) => {
    set((s) => ({ simulationParams: { ...s.simulationParams, ...params } }));
  },

  runSimulation: () => {
    const { simulationParams, zones } = get();

    const attendanceMod = simulationParams.attendanceDelta;
    const isHeavyRain = simulationParams.weatherCondition === 'heavy_rain';
    const isMajorTransit = simulationParams.transitDisruption === 'major';
    const delay = simulationParams.eventDelayMin;

    const currentAvgPressure = Math.round(zones.reduce((sum, z) => sum + z.pressureScore, 0) / zones.length);

    let simulatedAvg = currentAvgPressure + Math.round(attendanceMod * 0.4);
    if (isHeavyRain) simulatedAvg += 14;
    if (isMajorTransit) simulatedAvg += 12;
    if (delay > 60) simulatedAvg += 9;
    simulatedAvg = Math.min(98, Math.max(30, simulatedAvg));

    const simulatedCritical = simulatedAvg > 75 ? 4 : simulatedAvg > 60 ? 3 : 1;
    const simulatedTransitDelay = Math.round(18 + (isMajorTransit ? 38 : 12) + (delay * 0.25));
    const simulatedQueueTime = Math.round(16 + (attendanceMod > 0 ? attendanceMod * 0.6 : 0) + (simulationParams.gateClosure ? 22 : 0));
    const simulatedAccommodationGap = Math.max(0, Math.round((attendanceMod * 140) + (simulationParams.hotelCapacityLoss ? 650 : 0)));

    const afterInterventionAvg = Math.max(35, simulatedAvg - (simulationParams.emergencyShuttleAdded ? 15 : 8));
    const afterInterventionCritical = Math.max(1, simulatedCritical - 2);

    const narrative = `Under ${simulationParams.weatherCondition === 'heavy_rain' ? 'heavy monsoon showers' : 'moderate weather'} and a ${simulationParams.eventDelayMin}-minute event delay scenario, Dadar and BKC enter Critical status. Activating 6 emergency shuttles and redirecting 18% of arrivals to Navi Mumbai & Goregaon buffers reduces the combined metropolitan pressure score by 14 points, clearing platform safety thresholds.`;

    const zoneDeltas: Record<string, number> = {};
    zones.forEach(z => {
      zoneDeltas[z.id] = Math.round((simulatedAvg - currentAvgPressure) * (z.id === 'bkc' || z.id === 'dadar' ? 1.3 : 0.8));
    });

    set({
      simulationResult: {
        simulatedPressureAverage: simulatedAvg,
        simulatedCriticalZones: simulatedCritical,
        simulatedTransitDelay,
        simulatedQueueTime,
        simulatedAccommodationGap,
        afterInterventionPressure: afterInterventionAvg,
        afterInterventionCriticalZones: afterInterventionCritical,
        narrative,
        zoneDeltas
      }
    });
  },

  claimIncentive: (id: string) => {
    set((s) => ({
      attendeeIncentives: s.attendeeIncentives.map(inc => 
        inc.id === id ? { ...inc, claimed: true } : inc
      )
    }));
  },

  reserveStayInterest: (accommodationId: string) => {
    set((s) => ({
      accommodations: s.accommodations.map(a => 
        a.id === accommodationId ? { ...a, predictedCheckins: a.predictedCheckins + 1 } : a
      )
    }));
  },

  orchestratePipeline: async (forceManual = false) => {
    const s = get();
    try {
      const result = await DataOrchestrator.orchestrateAll(
        s.zones,
        s.accommodations,
        s.transitRoutes,
        s.weather,
        s.alerts,
        s.interventions,
        s.venues,
        forceManual
      );
      set({
        zones: result.zones,
        weather: result.weather || s.weather,
        accommodations: result.accommodations,
        transitRoutes: result.transit,
        alerts: result.alerts,
        interventions: result.interventions,
        lastTickTimestamp: result.timestamp,
        dataSourceStatuses: result.sourceStatuses,
        orchestrationHealth: fallbackManager.getOrchestrationHealth(),
        dataConfidence: result.dataConfidence,
        orchestrationCycleNumber: result.cycleNumber,
        lastOrchestrationLatencyMs: result.orchestrationLatencyMs,
        lastOrchestrationAt: result.timestamp,
        zoneContexts: result.zoneContexts
      });
    } catch {
      // Safe failover — still refresh source statuses
      set({
        dataSourceStatuses: fallbackManager.getAllStatuses(),
        orchestrationHealth: fallbackManager.getOrchestrationHealth(),
        dataConfidence: fallbackManager.getOverallDataConfidence()
      });
    }
  },

  refreshWeather: async () => {
    const { orchestratePipeline } = get();
    await orchestratePipeline();
  }
}));
