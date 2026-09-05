/**
 * Overpass API Client for CrowdFlow OS
 * Queries public OpenStreetMap data for Mumbai POIs (Hotels, Hospitals, Transit, Amenities)
 * Strict Zero-API-Key Policy, In-Memory TTL Caching, Rate-Limit Protection, Instant Fallback
 */

export interface RawOverpassElement {
  type: 'node' | 'way' | 'relation';
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

export interface OverpassQueryResult {
  elements: RawOverpassElement[];
  timestamp: string;
  source: 'live' | 'cached' | 'demo';
}

class OverpassApiClient {
  private cache: Map<string, { data: RawOverpassElement[]; timestamp: number }> = new Map();
  private readonly CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour session cache
  private readonly OVERPASS_ENDPOINT = 'https://overpass-api.de/api/interpreter';
  private readonly TIMEOUT_MS = 5000;

  // Mumbai Bounding Box: [south, west, north, east]
  private readonly MUMBAI_BBOX = '18.89,72.75,19.48,73.10';

  /**
   * Fetch accommodation POIs (hotels, guest houses, hostels) in Mumbai
   */
  async fetchAccommodations(zoneBounds?: string): Promise<OverpassQueryResult> {
    const bbox = zoneBounds || this.MUMBAI_BBOX;
    const cacheKey = `accommodations_${bbox}`;

    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL_MS) {
      return { elements: cached.data, timestamp: new Date(cached.timestamp).toISOString(), source: 'cached' };
    }

    const query = `
      [out:json][timeout:5];
      (
        node["tourism"~"hotel|guest_house|hostel"](${bbox});
        way["tourism"~"hotel|guest_house|hostel"](${bbox});
      );
      out center 40;
    `;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

      const response = await fetch(this.OVERPASS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(query)}`,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Overpass returned HTTP ${response.status}`);
      }

      const json = await response.json();
      const elements: RawOverpassElement[] = json.elements || [];

      if (elements.length > 0) {
        this.cache.set(cacheKey, { data: elements, timestamp: Date.now() });
        return { elements, timestamp: new Date().toISOString(), source: 'live' };
      }
    } catch (err) {
      // Graceful fallback without crashing
      // Return empty elements; adapter will fall back to accommodations.json
    }

    return { elements: [], timestamp: new Date().toISOString(), source: 'demo' };
  }

  /**
   * Fetch Essential Services (Hospitals, Clinics, Police, Parking)
   */
  async fetchEssentialServices(category: 'hospital' | 'parking' | 'transit'): Promise<OverpassQueryResult> {
    const cacheKey = `essential_${category}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL_MS) {
      return { elements: cached.data, timestamp: new Date(cached.timestamp).toISOString(), source: 'cached' };
    }

    let filter = 'amenity~"hospital|clinic"';
    if (category === 'parking') filter = 'amenity="parking"';
    if (category === 'transit') filter = 'railway~"station|subway_entrance"';

    const query = `
      [out:json][timeout:5];
      (
        node[${filter}](${this.MUMBAI_BBOX});
        way[${filter}](${this.MUMBAI_BBOX});
      );
      out center 25;
    `;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

      const response = await fetch(this.OVERPASS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(query)}`,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const json = await response.json();
        const elements: RawOverpassElement[] = json.elements || [];
        this.cache.set(cacheKey, { data: elements, timestamp: Date.now() });
        return { elements, timestamp: new Date().toISOString(), source: 'live' };
      }
    } catch {
      // Fallback
    }

    return { elements: [], timestamp: new Date().toISOString(), source: 'demo' };
  }
}

export const overpassApi = new OverpassApiClient();
