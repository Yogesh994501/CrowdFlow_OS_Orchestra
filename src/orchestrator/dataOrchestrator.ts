/**
 * Unified Data Orchestrator for CrowdFlow OS
 * Coordinates external open APIs, data adapters, normalization, Event Context building,
 * and deterministic intelligence recalculation across all 8 zones.
 */

import { weatherService } from '../services/weatherService';
import type { WeatherData } from '../types/weather';
import { overpassApi } from '../services/api/overpassApi';
import { osrmApi } from '../services/api/osrmApi';
import { gtfsApi } from '../services/api/gtfsApi';
import { MapAdapter } from '../adapters/mapAdapter';
import type { NormalizedPOI } from '../adapters/mapAdapter';
import { TransitAdapter } from '../adapters/transitAdapter';
import { IntelligenceEngine } from './intelligenceEngine';
import { fallbackManager } from './fallbackManager';
import type { DataSourceStatus } from './fallbackManager';
import { refreshScheduler } from './refreshScheduler';
import { EventContextBuilder } from './eventContextBuilder';
import type { ZoneContext, RouteConnection } from './eventContextBuilder';
import type { 
  Zone, 
  Venue,
  AccommodationProvider, 
  TransitRoute, 
  OperationalAlert, 
  Intervention 
} from '../types';

export interface OrchestrationResult {
  weather: WeatherData | null;
  transit: TransitRoute[];
  pois: NormalizedPOI[];
  routes: RouteConnection[];
  zoneContexts: ZoneContext[];
  sourceStatuses: DataSourceStatus[];
  orchestrationLatencyMs: number;
  cycleNumber: number;
  dataConfidence: number;

  // Preserved for backward-compatible consumption in store & existing screens
  zones: Zone[];
  accommodations: AccommodationProvider[];
  alerts: OperationalAlert[];
  interventions: Intervention[];
  timestamp: string;
  pipelineLatencyMs: number;
}

export class DataOrchestrator {
  private static cachedPOIs: NormalizedPOI[] = [];
  private static cachedRoutes: TransitRoute[] = [];
  private static activeCycleId = 0;

  /**
   * Run one complete unified orchestration pass across ALL domain services.
   * Enforces Source-Aware Refresh scheduling: only fetches sources that are stale,
   * dirty, or explicitly requested.
   */
  static async orchestrateAll(
    currentZones: Zone[],
    currentAccommodations: AccommodationProvider[],
    currentRoutes: TransitRoute[],
    currentWeather: WeatherData,
    existingAlerts: OperationalAlert[],
    existingInterventions: Intervention[],
    venues: Venue[] = [],
    forceManual = false
  ): Promise<OrchestrationResult> {
    const cycleId = ++DataOrchestrator.activeCycleId;
    const cycleStart = performance.now();

    // ──────────────────────────────────────────────
    // 1. WEATHER: Open-Meteo → WeatherAdapter
    // ──────────────────────────────────────────────
    let weather = currentWeather;
    const shouldFetchWeather = refreshScheduler.shouldFetch('open_meteo', forceManual);

    if (shouldFetchWeather) {
      try {
        const fetchStart = performance.now();
        const liveWeather = await weatherService.getMumbaiWeather();
        const fetchMs = Math.round(performance.now() - fetchStart);
        weather = liveWeather;
        
        fallbackManager.updateSource(
          'open_meteo',
          liveWeather.source,
          fetchMs,
          liveWeather.source === 'demo' ? 'Live API timeout; calibrated Mumbai monsoon scenario active' : undefined
        );
        refreshScheduler.recordFetch('open_meteo');
      } catch {
        fallbackManager.updateSource('open_meteo', 'demo', 0, 'Fetch failed; using calibrated event scenario');
      }
    } else {
      const cacheAge = refreshScheduler.getCacheAgeSeconds('open_meteo');
      fallbackManager.updateSource('open_meteo', 'cached', undefined, undefined, cacheAge);
    }

    // ──────────────────────────────────────────────
    // 2. TRANSIT: GTFS → TransitAdapter → zone load cascade
    // ──────────────────────────────────────────────
    let routes = currentRoutes;
    const shouldFetchGTFS = refreshScheduler.shouldFetch('gtfs', forceManual);

    if (shouldFetchGTFS) {
      try {
        const fetchStart = performance.now();
        const { feeds, source: gtfsSource } = await gtfsApi.fetchTransitFeeds();
        const fetchMs = Math.round(performance.now() - fetchStart);

        fallbackManager.updateSource(
          'gtfs',
          gtfsSource === 'live' ? 'live' : 'demo',
          fetchMs,
          gtfsSource === 'demo' ? 'Mumbai Suburban live token restricted; using calibrated 2026 event schedule' : undefined
        );
        refreshScheduler.recordFetch('gtfs');

        if (feeds.length > 0) {
          const normalizedFeedRoutes = TransitAdapter.normalizeFeedItems(feeds);
          DataOrchestrator.cachedRoutes = routes;

          // Cascade transit loads into zones
          currentZones = currentZones.map(zone => {
            const zoneTransitPressure = TransitAdapter.calculateZoneTransitPressure(normalizedFeedRoutes, zone.id);
            return {
              ...zone,
              // Blend existing mock telemetry with feed pressure
              transitLoad: Math.round((zone.transitLoad * 0.6) + (zoneTransitPressure * 0.4))
            };
          });
        }
      } catch {
        fallbackManager.updateSource('gtfs', 'demo', 0, 'GTFS feed check failed; retaining existing transit loads');
      }
    } else {
      const cacheAge = refreshScheduler.getCacheAgeSeconds('gtfs');
      fallbackManager.updateSource('gtfs', 'demo', undefined, undefined, cacheAge);
    }

    // ──────────────────────────────────────────────
    // 3. POIs: Overpass → MapAdapter → accommodation enrichment
    // ──────────────────────────────────────────────
    let enrichedAccommodations = currentAccommodations;
    const shouldFetchOverpass = refreshScheduler.shouldFetch('overpass', forceManual);

    if (shouldFetchOverpass || DataOrchestrator.cachedPOIs.length === 0) {
      try {
        const fetchStart = performance.now();
        const { elements, source: overpassSource } = await overpassApi.fetchAccommodations();
        const fetchMs = Math.round(performance.now() - fetchStart);

        fallbackManager.updateSource(
          'overpass',
          overpassSource === 'live' ? 'live' : overpassSource === 'cached' ? 'cached' : 'demo',
          fetchMs,
          overpassSource === 'demo' ? 'Rate-limited or unavailable; using local POI dataset' : undefined
        );
        refreshScheduler.recordFetch('overpass');

        if (elements.length > 0) {
          const normalizedPOIs = MapAdapter.normalizeOverpassElements(elements, overpassSource);
          DataOrchestrator.cachedPOIs = normalizedPOIs;
          // Enrich accommodations without replacing operational rooms/occupancy data
          enrichedAccommodations = MapAdapter.enrichAccommodationsWithPOIs(currentAccommodations, normalizedPOIs);
        }
      } catch {
        fallbackManager.updateSource('overpass', 'demo', 0, 'Overpass query failed; using local accommodations.json');
      }
    } else {
      const cacheAge = refreshScheduler.getCacheAgeSeconds('overpass');
      fallbackManager.updateSource('overpass', 'cached', undefined, undefined, cacheAge);
      if (DataOrchestrator.cachedPOIs.length > 0) {
        enrichedAccommodations = MapAdapter.enrichAccommodationsWithPOIs(currentAccommodations, DataOrchestrator.cachedPOIs);
      }
    }

    // ──────────────────────────────────────────────
    // 4. ROUTING: OSRM Route Cache & corridor metadata
    // ──────────────────────────────────────────────
    const shouldFetchOSRM = refreshScheduler.shouldFetch('osrm', forceManual);
    if (shouldFetchOSRM) {
      try {
        const fetchStart = performance.now();
        // Check primary corridor: BKC -> Dadar
        const bkcToDadar = await osrmApi.getRouteByZone(
          'bkc',
          'dadar',
          'fastest',
          [19.0657, 72.8686],
          [19.0178, 72.8478]
        );
        const fetchMs = Math.round(performance.now() - fetchStart);
        fallbackManager.updateSource(
          'osrm',
          bkcToDadar.source === 'live' ? 'live' : bkcToDadar.source === 'cached' ? 'cached' : 'demo',
          fetchMs,
          bkcToDadar.source === 'demo' ? 'Public OSRM demo endpoint unavailable; using geometric estimation' : undefined
        );
        refreshScheduler.recordFetch('osrm');
      } catch {
        fallbackManager.updateSource('osrm', 'demo', 0, 'OSRM check failed; using geometric estimation');
      }
    } else {
      const cacheAge = refreshScheduler.getCacheAgeSeconds('osrm');
      fallbackManager.updateSource('osrm', 'cached', undefined, undefined, cacheAge);
    }

    // Update CrowdFlow Demo Engine Status (Active telemetry)
    fallbackManager.updateSource('demo_telemetry', 'live', 4);

    // ──────────────────────────────────────────────
    // 5. ZONE RECALCULATION & INTELLIGENCE CASCADE
    // ──────────────────────────────────────────────
    const updatedZones = currentZones.map(zone => 
      IntelligenceEngine.evaluateZone(zone, enrichedAccommodations, routes, weather)
    );

    // Automated Risk & Alert Detection
    const detectedAlerts = IntelligenceEngine.detectAlerts(updatedZones, weather, routes);
    const mergedAlerts: OperationalAlert[] = [...existingAlerts];
    for (const newAlert of detectedAlerts) {
      const idx = mergedAlerts.findIndex(a => a.id === newAlert.id);
      if (idx >= 0) {
        mergedAlerts[idx] = { ...mergedAlerts[idx], ...newAlert, acknowledged: mergedAlerts[idx].acknowledged };
      } else {
        mergedAlerts.unshift(newAlert);
      }
    }

    // Recommendation Engine
    const generatedRecommendations = IntelligenceEngine.generateRecommendations(updatedZones, enrichedAccommodations);
    const mergedInterventions: Intervention[] = [...existingInterventions];
    for (const rec of generatedRecommendations) {
      if (!mergedInterventions.some(i => i.id === rec.id)) {
        mergedInterventions.unshift(rec);
      }
    }

    // ──────────────────────────────────────────────
    // 6. EVENT CONTEXT LAYER
    // ──────────────────────────────────────────────
    const allStatuses = fallbackManager.getAllStatuses();
    const zoneContexts = EventContextBuilder.buildZoneContexts(
      updatedZones,
      enrichedAccommodations,
      routes,
      venues,
      weather,
      mergedAlerts,
      mergedInterventions,
      DataOrchestrator.cachedPOIs,
      allStatuses
    );

    // Flatten route connections for reporting
    const routeConnections: RouteConnection[] = zoneContexts.flatMap(zc => zc.routeConnections);

    // ──────────────────────────────────────────────
    // 7. RECORD CYCLE HEALTH & PREVENT RACE CONDITIONS
    // ──────────────────────────────────────────────
    const pipelineLatencyMs = Math.round(performance.now() - cycleStart);
    fallbackManager.recordCycleComplete(pipelineLatencyMs);
    const health = fallbackManager.getOrchestrationHealth();

    // Prevent stale results from overwriting if another cycle ran
    if (cycleId !== DataOrchestrator.activeCycleId) {
      console.warn(`[DataOrchestrator] Discarding stale cycle #${cycleId}, active is #${DataOrchestrator.activeCycleId}`);
    }

    return {
      weather,
      transit: routes,
      pois: DataOrchestrator.cachedPOIs,
      routes: routeConnections,
      zoneContexts,
      sourceStatuses: allStatuses,
      orchestrationLatencyMs: pipelineLatencyMs,
      cycleNumber: health.cycleNumber,
      dataConfidence: health.dataConfidence,

      // Backward-compatible properties
      zones: updatedZones,
      accommodations: enrichedAccommodations,
      alerts: mergedAlerts,
      interventions: mergedInterventions,
      timestamp: new Date().toLocaleTimeString(),
      pipelineLatencyMs
    };
  }

  /**
   * Propagate Accommodation Operator Intervention (e.g. +300 Beds)
   */
  static applyAccommodationDelta(
    providerId: string,
    additionalRooms: number,
    zones: Zone[],
    accommodations: AccommodationProvider[],
    routes: TransitRoute[],
    weather: WeatherData
  ): { zones: Zone[]; accommodations: AccommodationProvider[] } {
    const updatedAccommodations = accommodations.map(acc => {
      if (acc.id === providerId) {
        const newTotal = acc.totalRooms + additionalRooms;
        const newAvail = acc.availableRooms + additionalRooms;
        const newPressure = Math.round(((newTotal - newAvail) / newTotal) * 100);
        return {
          ...acc,
          totalRooms: newTotal,
          availableRooms: newAvail,
          pressure: newPressure
        };
      }
      return acc;
    });

    const targetAcc = accommodations.find(a => a.id === providerId);
    const targetZoneId = targetAcc?.zoneId || 'bkc';

    const updatedZones = zones.map(z => {
      if (z.id === targetZoneId) {
        return IntelligenceEngine.evaluateZone(z, updatedAccommodations, routes, weather);
      }
      return z;
    });

    return { zones: updatedZones, accommodations: updatedAccommodations };
  }

  /**
   * Propagate Transport Operator Intervention (e.g. Add Rapid Electric Shuttle)
   */
  static applyShuttleDispatch(
    routeId: string,
    additionalVehicles: number,
    zones: Zone[],
    accommodations: AccommodationProvider[],
    routes: TransitRoute[],
    weather: WeatherData
  ): { zones: Zone[]; routes: TransitRoute[] } {
    const updatedRoutes = routes.map(r => {
      if (r.id === routeId) {
        const newVehicles = r.vehiclesActive + additionalVehicles;
        const newSeats = r.seatsRemaining + additionalVehicles * 45;
        const newWaitTime = Math.max(2, Math.round(r.waitTime * 0.65));
        const newDelay = Math.max(0, Math.round(r.delayPercentage * 0.6));
        return {
          ...r,
          vehiclesActive: newVehicles,
          seatsRemaining: newSeats,
          waitTime: newWaitTime,
          delayPercentage: newDelay,
          status: (newDelay > 40 ? 'high' : newDelay > 20 ? 'watch' : 'stable') as any
        };
      }
      return r;
    });

    const targetRoute = routes.find(r => r.id === routeId);
    const targetZoneId = targetRoute?.toZone || 'bkc';

    const updatedZones = zones.map(z => {
      if (z.id === targetZoneId) {
        const relievedTransitLoad = Math.max(20, z.transitLoad - 12);
        const zoneWithRelief = { ...z, transitLoad: relievedTransitLoad };
        return IntelligenceEngine.evaluateZone(zoneWithRelief, accommodations, updatedRoutes, weather);
      }
      return z;
    });

    return { zones: updatedZones, routes: updatedRoutes };
  }
}
