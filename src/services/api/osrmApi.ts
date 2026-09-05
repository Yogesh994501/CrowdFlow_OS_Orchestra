/**
 * OSRM Public Routing API Client & Route Cache for CrowdFlow OS
 * Open Source Routing Machine for distance, travel duration, and polyline steps
 * Free demo endpoint with rate protection, corridor caching, and Mumbai geometric fallback.
 */

export interface CachedRoute {
  cacheKey: string;
  origin: [number, number]; // [lat, lng]
  destination: [number, number]; // [lat, lng]
  distanceMeters: number;
  durationSeconds: number;
  waypoints: [number, number][];
  source: 'live' | 'cached' | 'demo';
  createdAt: string;
  lastUsedAt: string;
}

export type OSRMRouteResult = CachedRoute;

class OSRMApiClient {
  private routeCache: Map<string, CachedRoute> = new Map();
  private readonly CACHE_TTL_MS = 60 * 60 * 1000; // 1 hr
  private readonly OSRM_ENDPOINT = 'https://router.project-osrm.org/route/v1/driving';
  private readonly TIMEOUT_MS = 3500;

  /**
   * Generates a deterministic cache key matching requirement:
   * originZone-destinationZone-routeType
   */
  public generateCacheKey(originZone: string, destinationZone: string, routeType = 'fastest'): string {
    return `${originZone.toLowerCase()}-${destinationZone.toLowerCase()}-${routeType.toLowerCase()}`;
  }

  /**
   * Retrieve cached route if valid, or compute across OSRM
   */
  async getRouteByZone(
    originZone: string,
    destinationZone: string,
    routeType = 'fastest',
    start: [number, number],
    end: [number, number]
  ): Promise<CachedRoute> {
    const cacheKey = this.generateCacheKey(originZone, destinationZone, routeType);
    const cached = this.routeCache.get(cacheKey);

    if (cached) {
      const age = Date.now() - new Date(cached.createdAt).getTime();
      if (age < this.CACHE_TTL_MS) {
        cached.lastUsedAt = new Date().toISOString();
        cached.source = 'cached';
        return cached;
      }
    }

    const calculated = await this.calculateRoute(start, end, cacheKey);
    this.routeCache.set(cacheKey, calculated);
    return calculated;
  }

  async calculateRoute(
    start: [number, number], // [lat, lng]
    end: [number, number],   // [lat, lng]
    customKey?: string
  ): Promise<CachedRoute> {
    const nowIso = new Date().toISOString();
    const key = customKey || `${start[0].toFixed(3)},${start[1].toFixed(3)}_${end[0].toFixed(3)},${end[1].toFixed(3)}`;
    
    const cached = this.routeCache.get(key);
    if (cached) {
      const age = Date.now() - new Date(cached.createdAt).getTime();
      if (age < this.CACHE_TTL_MS) {
        cached.lastUsedAt = nowIso;
        cached.source = 'cached';
        return cached;
      }
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

      // OSRM expects coordinates in {lng},{lat} order
      const coordinates = `${start[1]},${start[0]};${end[1]},${end[0]}`;
      const url = `${this.OSRM_ENDPOINT}/${coordinates}?overview=simplified&geometries=geojson`;

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          const coords: [number, number][] = (route.geometry?.coordinates || []).map(
            (c: [number, number]) => [c[1], c[0]] // convert [lng, lat] to [lat, lng]
          );

          const result: CachedRoute = {
            cacheKey: key,
            origin: start,
            destination: end,
            distanceMeters: Math.round(route.distance),
            durationSeconds: Math.round(route.duration),
            waypoints: coords.length > 0 ? coords : [start, end],
            source: 'live',
            createdAt: nowIso,
            lastUsedAt: nowIso
          };

          this.routeCache.set(key, result);
          return result;
        }
      }
    } catch {
      // Graceful fallback on network timeout / rate-limit
    }

    // Local geometric distance estimation for Mumbai corridors
    const latDiff = end[0] - start[0];
    const lngDiff = end[1] - start[1];
    const approxKm = Math.sqrt(Math.pow(latDiff * 111, 2) + Math.pow(lngDiff * 102, 2));
    const approxDurationSec = Math.max(300, Math.round((approxKm / 28) * 3600)); // ~28 km/h Mumbai traffic average

    const fallbackResult: CachedRoute = {
      cacheKey: key,
      origin: start,
      destination: end,
      distanceMeters: Math.round(approxKm * 1000),
      durationSeconds: approxDurationSec,
      waypoints: [
        start,
        [(start[0] + end[0]) / 2 + 0.005, (start[1] + end[1]) / 2 - 0.004], // realistic road curve
        end
      ],
      source: 'demo',
      createdAt: nowIso,
      lastUsedAt: nowIso
    };

    this.routeCache.set(key, fallbackResult);
    return fallbackResult;
  }
}

export const osrmApi = new OSRMApiClient();
