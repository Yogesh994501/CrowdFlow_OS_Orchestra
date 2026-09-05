/**
 * Fallback & Data Source Status Manager for CrowdFlow OS
 * Tracks live connection health, latency, cache TTL, failover state,
 * and transparent Data Confidence scoring for all event data sources.
 */

export type SourceStatusMode = 'live' | 'cached' | 'demo' | 'unavailable';

export interface DataSourceStatus {
  id: string; // for backward compatibility
  sourceId: string;
  name: string;
  sourceName?: string; // alias
  source: 'live' | 'cached' | 'demo' | 'unavailable'; // alias for status
  status: SourceStatusMode;
  connectionStatus?: 'connected' | 'degraded' | 'simulated' | 'unavailable'; // UI display alias
  latencyMs: number;
  lastChecked: string;
  lastCheckedAt: string;
  lastSuccessfulAt?: string;
  fallbackReason?: string;
  cacheAgeSeconds?: number;
  confidence: number;
  dataUsedBy?: string[];
  description?: string;
}

export interface HealthSummary {
  overallStatus: 'healthy' | 'degraded' | 'demo';
  liveSources: number;
  cachedSources: number;
  demoSources: number;
  unavailableSources: number;
  dataConfidence: number;
  totalLatencyMs: number;
  cycleNumber: number;
}

export interface OrchestrationHealth {
  cycleNumber: number;
  lastCycleLatencyMs: number;
  totalCyclesRun: number;
  lastCycleTimestamp: string;
  liveSourceCount: number;
  cachedSourceCount: number;
  demoSourceCount: number;
  unavailableSourceCount: number;
  dataConfidence: number;
}

class FallbackManager {
  private statuses: Map<string, DataSourceStatus> = new Map();
  private _lastOrchestrationLatencyMs = 0;
  private _totalOrchestrationsRun = 0;
  private _orchestrationCycleNumber = 0;
  private _lastOrchestrationAt: string | null = null;

  constructor() {
    this.initDefaultStatuses();
  }

  private initDefaultStatuses() {
    this.statuses.set('open_meteo', {
      id: 'open_meteo',
      sourceId: 'open_meteo',
      name: 'Open-Meteo Weather Service',
      sourceName: 'Open-Meteo',
      source: 'live',
      status: 'live',
      connectionStatus: 'connected',
      latencyMs: 124,
      lastChecked: 'Ready',
      lastCheckedAt: new Date().toLocaleTimeString(),
      lastSuccessfulAt: new Date().toLocaleTimeString(),
      confidence: 100,
      description: 'Free no-key open API for convective precipitation, rain probability & wind',
      dataUsedBy: ['Weather Risk', 'Pressure Score', 'Walking Desirability', 'Gate Queueing']
    });

    this.statuses.set('gtfs', {
      id: 'gtfs',
      sourceId: 'gtfs',
      name: 'GTFS Transit Telemetry',
      sourceName: 'GTFS Transit',
      source: 'demo',
      status: 'demo',
      connectionStatus: 'simulated',
      latencyMs: 18,
      lastChecked: 'Ready',
      lastCheckedAt: new Date().toLocaleTimeString(),
      fallbackReason: 'Mumbai Suburban live feed token restricted; using calibrated 2026 event schedule',
      confidence: 65,
      description: 'Suburban railway, Metro Line 3, and BEST bus telemetry & headways',
      dataUsedBy: ['Transit Load', 'Corridor Delays', 'Mobility Control', 'Route Scoring']
    });

    this.statuses.set('overpass', {
      id: 'overpass',
      sourceId: 'overpass',
      name: 'Overpass API (OSM POIs)',
      sourceName: 'Overpass API',
      source: 'cached',
      status: 'cached',
      connectionStatus: 'degraded',
      latencyMs: 310,
      lastChecked: 'Ready',
      lastCheckedAt: new Date().toLocaleTimeString(),
      lastSuccessfulAt: new Date().toLocaleTimeString(),
      confidence: 85,
      cacheAgeSeconds: 120,
      description: 'Discovers public hotels, guest houses, clinics, parking, and transit stops',
      dataUsedBy: ['Geographic Context', 'Nearby Amenities', 'Hospital Access', 'Parking Capacity']
    });

    this.statuses.set('nominatim', {
      id: 'nominatim',
      sourceId: 'nominatim',
      name: 'Nominatim Geocoding',
      sourceName: 'Nominatim',
      source: 'cached',
      status: 'cached',
      connectionStatus: 'connected',
      latencyMs: 145,
      lastChecked: 'On-Demand Ready',
      lastCheckedAt: new Date().toLocaleTimeString(),
      confidence: 90,
      description: 'OpenStreetMap location lookup and address geocoding (rate-limited, no live typing spam)',
      dataUsedBy: ['Attendee Search', 'Venue Geofencing', 'Zone Resolution']
    });

    this.statuses.set('osrm', {
      id: 'osrm',
      sourceId: 'osrm',
      name: 'OSRM Route Optimization',
      sourceName: 'OSRM',
      source: 'live',
      status: 'live',
      connectionStatus: 'connected',
      latencyMs: 98,
      lastChecked: 'Ready',
      lastCheckedAt: new Date().toLocaleTimeString(),
      lastSuccessfulAt: new Date().toLocaleTimeString(),
      confidence: 100,
      description: 'High-performance open routing machine for walking, shuttle, and multimodal corridors',
      dataUsedBy: ['Route Scoring', 'Travel Times', 'Crowd-Aware Guidance', 'Emergency Diversions']
    });

    this.statuses.set('demo_telemetry', {
      id: 'demo_telemetry',
      sourceId: 'demo_telemetry',
      name: 'CrowdFlow Demo Engine',
      sourceName: 'Demo Telemetry',
      source: 'live',
      status: 'live',
      connectionStatus: 'connected',
      latencyMs: 4,
      lastChecked: 'Active',
      lastCheckedAt: new Date().toLocaleTimeString(),
      confidence: 100,
      description: 'Local deterministic simulation generating dynamic gate queues, headways & occupancy',
      dataUsedBy: ['Live Dashboard', 'Zone Pressure Heatmap', 'Active Attendees Count']
    });
  }

  /**
   * Transparent Data Confidence Score calculation:
   * Base: Live = 100%, Cached = 85%, Demo = 65%, Unavailable = 0%
   * Penalized slightly if cache age exceeds 15 mins
   */
  public calculateConfidence(status: SourceStatusMode, cacheAgeSeconds = 0): number {
    let base = 65;
    if (status === 'live') base = 100;
    else if (status === 'cached') base = 85;
    else if (status === 'demo') base = 65;
    else if (status === 'unavailable') base = 0;

    // Cache age penalty (if cached for more than 15 mins, decrease by 5% per 10 mins)
    if (status === 'cached' && cacheAgeSeconds > 900) {
      const extraBlocks = Math.floor((cacheAgeSeconds - 900) / 600);
      base = Math.max(50, base - extraBlocks * 5);
    }

    return base;
  }

  updateSource(
    id: string,
    status: SourceStatusMode,
    latencyMs?: number,
    reason?: string,
    cacheAgeSeconds?: number
  ) {
    const existing = this.statuses.get(id);
    if (existing) {
      existing.status = status;
      existing.source = status;
      existing.connectionStatus = 
        status === 'live' ? 'connected' : 
        status === 'cached' ? 'degraded' : 
        status === 'demo' ? 'simulated' : 'unavailable';

      if (latencyMs !== undefined) existing.latencyMs = latencyMs;
      if (reason) existing.fallbackReason = reason;
      else if (status === 'live') existing.fallbackReason = undefined;

      if (cacheAgeSeconds !== undefined) existing.cacheAgeSeconds = cacheAgeSeconds;

      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      existing.lastChecked = timeStr;
      existing.lastCheckedAt = timeStr;

      if (status === 'live' || status === 'cached') {
        existing.lastSuccessfulAt = timeStr;
      }

      existing.confidence = this.calculateConfidence(status, existing.cacheAgeSeconds);
    }
  }

  /** Call at the end of each orchestration cycle */
  recordCycleComplete(cycleLatencyMs: number) {
    this._orchestrationCycleNumber += 1;
    this._totalOrchestrationsRun += 1;
    this._lastOrchestrationLatencyMs = Math.round(cycleLatencyMs);
    this._lastOrchestrationAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  /**
   * Returns aggregate data confidence across all active sources
   */
  getOverallDataConfidence(): number {
    const all = this.getAllStatuses();
    if (all.length === 0) return 0;
    const totalConfidence = all.reduce((sum, s) => sum + s.confidence, 0);
    return Math.round(totalConfidence / all.length);
  }

  getHealthSummary(): HealthSummary {
    const all = this.getAllStatuses();
    const live = all.filter(s => s.status === 'live').length;
    const cached = all.filter(s => s.status === 'cached').length;
    const demo = all.filter(s => s.status === 'demo').length;
    const unavailable = all.filter(s => s.status === 'unavailable').length;

    const overallStatus: HealthSummary['overallStatus'] = 
      unavailable > 1 ? 'degraded' :
      live >= 3 ? 'healthy' : 'demo';

    return {
      overallStatus,
      liveSources: live,
      cachedSources: cached,
      demoSources: demo,
      unavailableSources: unavailable,
      dataConfidence: this.getOverallDataConfidence(),
      totalLatencyMs: all.reduce((sum, s) => sum + s.latencyMs, 0),
      cycleNumber: this._orchestrationCycleNumber
    };
  }

  getAllStatuses(): DataSourceStatus[] {
    return Array.from(this.statuses.values());
  }

  getSource(id: string): DataSourceStatus | undefined {
    return this.statuses.get(id);
  }

  getOrchestrationHealth(): OrchestrationHealth {
    const all = this.getAllStatuses();
    return {
      cycleNumber: this._orchestrationCycleNumber,
      lastCycleLatencyMs: this._lastOrchestrationLatencyMs,
      totalCyclesRun: this._totalOrchestrationsRun,
      lastCycleTimestamp: this._lastOrchestrationAt || 'Awaiting initial cycle',
      liveSourceCount: all.filter(s => s.status === 'live').length,
      cachedSourceCount: all.filter(s => s.status === 'cached').length,
      demoSourceCount: all.filter(s => s.status === 'demo').length,
      unavailableSourceCount: all.filter(s => s.status === 'unavailable').length,
      dataConfidence: this.getOverallDataConfidence()
    };
  }
}

export const fallbackManager = new FallbackManager();
