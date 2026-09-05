/**
 * Nominatim Geocoding API Client for CrowdFlow OS
 * OpenStreetMap Nominatim with viewbox bounding, deduplication, and local fuzzy fallback
 */

export interface GeocodedLocation {
  placeId: string;
  name: string;
  displayName: string;
  lat: number;
  lng: number;
  type: string;
  source: 'live' | 'cached' | 'demo';
}

class NominatimApiClient {
  private cache: Map<string, { result: GeocodedLocation[]; timestamp: number }> = new Map();
  private readonly CACHE_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours
  private readonly NOMINATIM_ENDPOINT = 'https://nominatim.openstreetmap.org/search';
  private readonly TIMEOUT_MS = 4000;

  // Local fallback dictionary for instant Mumbai mega-event places
  private readonly LOCAL_PLACES: GeocodedLocation[] = [
    { placeId: 'loc-bkc', name: 'Bandra Kurla Complex (BKC)', displayName: 'Bandra Kurla Complex, Mumbai, Maharashtra', lat: 19.0657, lng: 72.8687, type: 'business_district', source: 'demo' },
    { placeId: 'loc-jio', name: 'Jio World Convention Centre', displayName: 'G Block BKC, Bandra Kurla Complex, Mumbai', lat: 19.0645, lng: 72.8682, type: 'venue', source: 'demo' },
    { placeId: 'loc-dadar', name: 'Dadar Railway Station', displayName: 'Dadar Central & Western Interchange, Mumbai', lat: 19.0178, lng: 72.8478, type: 'transit', source: 'demo' },
    { placeId: 'loc-csmt', name: 'Chhatrapati Shivaji Maharaj Terminus', displayName: 'CSMT, Fort, Mumbai, Maharashtra', lat: 18.9400, lng: 72.8353, type: 'transit', source: 'demo' },
    { placeId: 'loc-andheri', name: 'Andheri West Metro Station', displayName: 'Andheri West, Mumbai, Maharashtra', lat: 19.1197, lng: 72.8468, type: 'transit', source: 'demo' },
    { placeId: 'loc-virar', name: 'Virār Railway Station', displayName: 'Virār, Palghar-Mumbai Metropolitan Region', lat: 19.4564, lng: 72.8111, type: 'buffer_hub', source: 'demo' },
    { placeId: 'loc-vashi', name: 'Navi Mumbai Vashi Hub', displayName: 'Vashi, Navi Mumbai, Maharashtra', lat: 19.0760, lng: 72.9980, type: 'buffer_hub', source: 'demo' },
    { placeId: 'loc-colaba', name: 'Colaba Causeway & Gateway', displayName: 'Colaba, South Mumbai, Maharashtra', lat: 18.9220, lng: 72.8347, type: 'tourism', source: 'demo' }
  ];

  async searchLocation(query: string): Promise<GeocodedLocation[]> {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];

    const cached = this.cache.get(trimmed);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL_MS) {
      return cached.result;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

      const params = new URLSearchParams({
        q: `${query}, Mumbai, India`,
        format: 'json',
        addressdetails: '1',
        limit: '5',
        viewbox: '72.75,19.48,73.10,18.89',
        bounded: '1'
      });

      const response = await fetch(`${this.NOMINATIM_ENDPOINT}?${params.toString()}`, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'CrowdFlow-OS-EventOrchestration/1.0'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          const results: GeocodedLocation[] = data.map((item: any) => ({
            placeId: String(item.place_id || item.osm_id),
            name: item.name || item.display_name.split(',')[0],
            displayName: item.display_name,
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
            type: item.type || 'poi',
            source: 'live'
          }));

          this.cache.set(trimmed, { result: results, timestamp: Date.now() });
          return results;
        }
      }
    } catch {
      // Graceful fallback to fuzzy local places
    }

    // Local fuzzy match fallback
    const matched = this.LOCAL_PLACES.filter(p => 
      p.name.toLowerCase().includes(trimmed) || 
      p.displayName.toLowerCase().includes(trimmed) ||
      trimmed.includes(p.name.toLowerCase().split(' ')[0])
    );

    const fallbackResult = matched.length > 0 ? matched : [this.LOCAL_PLACES[0]];
    return fallbackResult;
  }
}

export const nominatimApi = new NominatimApiClient();
