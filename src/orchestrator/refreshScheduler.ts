/**
 * Source-Aware Refresh Scheduler for CrowdFlow OS
 * Enforces responsible public API usage policies, rate-limiting, and independent TTLs per service.
 * Prevents redundant external network traffic while ensuring intelligence freshness.
 */

export type ManagedSourceId = 
  | 'open_meteo' 
  | 'gtfs' 
  | 'overpass' 
  | 'nominatim' 
  | 'osrm' 
  | 'demo_telemetry';

export interface SourceSchedulePolicy {
  sourceId: ManagedSourceId;
  name: string;
  refreshIntervalMs: number;
  allowAutomatedLoop: boolean;
  requiresUserAction: boolean;
  description: string;
}

export class RefreshScheduler {
  private static instance: RefreshScheduler;

  private policies: Map<ManagedSourceId, SourceSchedulePolicy> = new Map([
    [
      'demo_telemetry',
      {
        sourceId: 'demo_telemetry',
        name: 'CrowdFlow Demo Engine',
        refreshIntervalMs: 3500, // 3.5s mock telemetry
        allowAutomatedLoop: true,
        requiresUserAction: false,
        description: 'Updates local crowd counts, gate queues, and occupancy every 3.5s'
      }
    ],
    [
      'gtfs',
      {
        sourceId: 'gtfs',
        name: 'GTFS Transit Feeds',
        refreshIntervalMs: 45000, // 45s feed check
        allowAutomatedLoop: true,
        requiresUserAction: false,
        description: 'Periodic check of suburban rail & metro telemetry'
      }
    ],
    [
      'open_meteo',
      {
        sourceId: 'open_meteo',
        name: 'Open-Meteo Weather API',
        refreshIntervalMs: 15 * 60 * 1000, // 15 mins
        allowAutomatedLoop: true,
        requiresUserAction: false,
        description: 'Convective rain probability & weather risk, cached for 15 mins'
      }
    ],
    [
      'overpass',
      {
        sourceId: 'overpass',
        name: 'Overpass API (OSM POIs)',
        refreshIntervalMs: 60 * 60 * 1000, // 60 mins / startup cache
        allowAutomatedLoop: false, // Startup + manual refresh only
        requiresUserAction: false,
        description: 'Amenity and POI discovery, cached for session duration'
      }
    ],
    [
      'nominatim',
      {
        sourceId: 'nominatim',
        name: 'Nominatim Geocoding',
        refreshIntervalMs: Infinity, // On-demand only
        allowAutomatedLoop: false,
        requiresUserAction: true,
        description: 'Only queried on explicit attendee search; zero polling'
      }
    ],
    [
      'osrm',
      {
        sourceId: 'osrm',
        name: 'OSRM Route Optimization',
        refreshIntervalMs: 5 * 60 * 1000, // 5 min route cache
        allowAutomatedLoop: false,
        requiresUserAction: false,
        description: 'Cached by origin-destination-mode; refreshed on route demand or disruptions'
      }
    ]
  ]);

  private lastFetchTimes: Map<ManagedSourceId, number> = new Map();
  private dirtyFlags: Map<ManagedSourceId, boolean> = new Map();

  public static getInstance(): RefreshScheduler {
    if (!RefreshScheduler.instance) {
      RefreshScheduler.instance = new RefreshScheduler();
    }
    return RefreshScheduler.instance;
  }

  /**
   * Evaluates if a given source should be fetched across the wire now.
   * Considers TTL staleness, dirty flags, and explicit manual overrides.
   */
  public shouldFetch(sourceId: ManagedSourceId, forceManual = false): boolean {
    if (forceManual) return true;

    const policy = this.policies.get(sourceId);
    if (!policy) return false;

    // Sources that strictly require user actions are never auto-fetched
    if (policy.requiresUserAction && !forceManual) {
      return false;
    }

    // Check if flagged as dirty by an operator or scenario intervention
    if (this.dirtyFlags.get(sourceId)) {
      return true;
    }

    const lastFetch = this.lastFetchTimes.get(sourceId) || 0;
    const elapsed = Date.now() - lastFetch;

    // Has never been fetched
    if (lastFetch === 0) return true;

    // Check if expired based on source-specific interval
    return elapsed >= policy.refreshIntervalMs;
  }

  /**
   * Record that a source was fetched (live, cached, or simulated)
   */
  public recordFetch(sourceId: ManagedSourceId) {
    this.lastFetchTimes.set(sourceId, Date.now());
    this.dirtyFlags.set(sourceId, false);
  }

  /**
   * Mark a source as dirty to force a refresh on the next cycle
   */
  public markDirty(sourceId: ManagedSourceId) {
    this.dirtyFlags.set(sourceId, true);
  }

  /**
   * Get the age of a source's cache in seconds
   */
  public getCacheAgeSeconds(sourceId: ManagedSourceId): number {
    const last = this.lastFetchTimes.get(sourceId);
    if (!last) return 0;
    return Math.round((Date.now() - last) / 1000);
  }

  public getPolicy(sourceId: ManagedSourceId): SourceSchedulePolicy | undefined {
    return this.policies.get(sourceId);
  }
}

export const refreshScheduler = RefreshScheduler.getInstance();
