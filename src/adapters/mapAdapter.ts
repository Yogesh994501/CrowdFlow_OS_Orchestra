import type { RawOverpassElement } from '../services/api/overpassApi';
import zonesData from '../data/zones.json';

export interface NormalizedPOI {
  id: string;
  name: string;
  type: 'hotel' | 'hospital' | 'parking' | 'transit' | 'restaurant' | 'venue';
  latitude: number;
  longitude: number;
  address: string;
  zoneId: string;
  capacityEstimate: number;
  source: 'live' | 'cached' | 'demo';
}

export class MapAdapter {
  /**
   * Determine closest CrowdFlow zone for a given [lat, lng]
   */
  static matchZoneId(lat: number, lng: number): string {
    let closestZoneId = 'bkc';
    let minDistance = Infinity;

    for (const zone of zonesData) {
      const zLat = zone.coordinates[0];
      const zLng = zone.coordinates[1];
      const dist = Math.sqrt(Math.pow(lat - zLat, 2) + Math.pow(lng - zLng, 2));

      if (dist < minDistance) {
        minDistance = dist;
        closestZoneId = zone.id;
      }
    }

    return closestZoneId;
  }

  /**
   * Convert raw Overpass OSM elements to NormalizedPOIs
   */
  static normalizeOverpassElements(
    elements: RawOverpassElement[],
    source: 'live' | 'cached' | 'demo'
  ): NormalizedPOI[] {
    return elements
      .filter(el => {
        const lat = el.lat ?? el.center?.lat;
        const lon = el.lon ?? el.center?.lon;
        return lat !== undefined && lon !== undefined;
      })
      .map(el => {
        const lat = el.lat ?? el.center!.lat;
        const lon = el.lon ?? el.center!.lon;
        const tags = el.tags || {};

        let type: NormalizedPOI['type'] = 'hotel';
        if (tags.amenity === 'hospital' || tags.amenity === 'clinic') type = 'hospital';
        else if (tags.amenity === 'parking') type = 'parking';
        else if (tags.railway || tags.highway === 'bus_stop') type = 'transit';
        else if (tags.amenity === 'restaurant') type = 'restaurant';

        const name = tags.name || tags['name:en'] || `${type.toUpperCase()} - Mumbai Node #${el.id}`;
        const address = tags['addr:street'] ? `${tags['addr:street']}, Mumbai` : 'Greater Mumbai Area';
        const zoneId = MapAdapter.matchZoneId(lat, lon);

        // Estimate capacity based on type & tags
        let capacityEstimate = 120;
        if (type === 'hotel') capacityEstimate = tags.rooms ? parseInt(tags.rooms, 10) : 180;
        if (type === 'hospital') capacityEstimate = tags.beds ? parseInt(tags.beds, 10) : 350;
        if (type === 'parking') capacityEstimate = tags.capacity ? parseInt(tags.capacity, 10) : 250;

        return {
          id: `osm-${el.id}`,
          name,
          type,
          latitude: lat,
          longitude: lon,
          address,
          zoneId,
          capacityEstimate,
          source
        };
      });
  }

  /**
   * Enrich operational accommodation dataset with OpenStreetMap geographic POI context.
   * Preserves all simulated operational data (totalRooms, occupiedRooms, availableRooms, pressure, etc.)
   * Adds nearby transit access, hospital distances, and geographic context.
   */
  static enrichAccommodationsWithPOIs(
    accommodations: any[],
    pois: NormalizedPOI[]
  ): any[] {
    if (!pois || pois.length === 0) return accommodations;

    const transitPOIs = pois.filter(p => p.type === 'transit');
    const hospitalPOIs = pois.filter(p => p.type === 'hospital');
    const parkingPOIs = pois.filter(p => p.type === 'parking');

    return accommodations.map(acc => {
      // Find matching POIs in the same zone or within close geographic proximity (< 1.5km)
      const nearbyTransit = transitPOIs.filter(p => {
        if (p.zoneId === acc.zoneId) return true;
        const dLat = Math.abs(p.latitude - acc.lat);
        const dLng = Math.abs(p.longitude - acc.lng);
        return dLat < 0.015 && dLng < 0.015;
      });

      const nearbyHospitals = hospitalPOIs.filter(p => {
        if (p.zoneId === acc.zoneId) return true;
        const dLat = Math.abs(p.latitude - acc.lat);
        const dLng = Math.abs(p.longitude - acc.lng);
        return dLat < 0.02 && dLng < 0.02;
      });

      const nearbyParking = parkingPOIs.filter(p => p.zoneId === acc.zoneId);

      // Enhance amenities or context tags without touching rooms / occupancy
      const newAmenities = [...(acc.amenities || [])];
      if (nearbyTransit.length > 0 && !newAmenities.includes('OSM Verified Transit Hub')) {
        newAmenities.push('OSM Verified Transit Hub');
      }
      if (nearbyHospitals.length > 0 && !newAmenities.includes('Emergency Corridor Linked')) {
        newAmenities.push('Emergency Corridor Linked');
      }

      return {
        ...acc,
        amenities: newAmenities,
        // Computed enrichment indicators
        nearbyTransitCount: nearbyTransit.length,
        hasEmergencyAccess: nearbyHospitals.length > 0,
        hasDedicatedParking: nearbyParking.length > 0
      };
    });
  }
}
