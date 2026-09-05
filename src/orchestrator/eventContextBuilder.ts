/**
 * Event Context Builder for CrowdFlow OS
 * Normalized Event Context layer between adapters/APIs and the intelligence engine.
 * Single source of normalized intelligence inputs across all 8 metropolitan zones.
 */

import type { 
  Zone, 
  Venue, 
  AccommodationProvider, 
  TransitRoute, 
  OperationalAlert, 
  Intervention, 
  PressureStatus 
} from '../types';
import type { WeatherData } from '../types/weather';
import type { DataSourceStatus } from './fallbackManager';
import type { NormalizedPOI } from '../adapters/mapAdapter';

export interface RouteConnection {
  routeId: string;
  name: string;
  type: string;
  fromZone: string;
  toZone: string;
  travelTimeMin: number;
  transitLoadPct: number;
  status: PressureStatus;
}

export interface ContributingFactor {
  name: string;
  value: number;
  percentage: number;
}

export interface ZoneContext {
  zoneId: string;
  zoneName: string;

  weatherRisk: number;
  transitLoad: number;
  accommodationOccupancy: number;
  venueLoad: number;
  predictedArrivals: number;

  activeVisitors: number;
  availableCapacity: number;

  nearbyPois: NormalizedPOI[];
  routeConnections: RouteConnection[];

  pressureScore: number;
  status: PressureStatus;

  contributingFactors: ContributingFactor[];

  activeAlerts: string[];
  recommendationIds: string[];

  dataSources: DataSourceStatus[];
}

export class EventContextBuilder {
  /**
   * Builds normalized, unified zone-level intelligence models by fusing
   * weather telemetry, transit loads, accommodation occupancy, venue crowds,
   * POIs, active alerts, and operator interventions.
   */
  static buildZoneContexts(
    zones: Zone[],
    accommodations: AccommodationProvider[],
    routes: TransitRoute[],
    venues: Venue[],
    weather: WeatherData,
    alerts: OperationalAlert[],
    interventions: Intervention[],
    pois: NormalizedPOI[] = [],
    dataSources: DataSourceStatus[] = []
  ): ZoneContext[] {
    return zones.map(zone => {
      // 1. Filter Accommodations for this zone
      const zoneAccs = accommodations.filter(a => a.zoneId === zone.id);
      const totalRooms = zoneAccs.reduce((sum, a) => sum + a.totalRooms, 0);
      const occupiedRooms = zoneAccs.reduce((sum, a) => sum + a.occupiedRooms, 0);
      const accommodationOccupancy = totalRooms > 0 
        ? Math.round((occupiedRooms / totalRooms) * 100) 
        : zone.accommodationOccupancy;

      // 2. Filter Venues for this zone
      const zoneVenues = venues.filter(v => v.zoneId === zone.id);
      const totalVenueCap = zoneVenues.reduce((sum, v) => sum + v.capacity, 0);
      const totalVenueAtt = zoneVenues.reduce((sum, v) => sum + v.currentAttendance, 0);
      const venueLoad = totalVenueCap > 0 
        ? Math.round((totalVenueAtt / totalVenueCap) * 100) 
        : zone.venueLoad;

      // 3. Connect Routes impacting this zone
      const relevantRoutes = routes.filter(r => r.fromZone === zone.id || r.toZone === zone.id);
      const routeConnections: RouteConnection[] = relevantRoutes.map(r => ({
        routeId: r.id,
        name: r.name,
        type: r.type,
        fromZone: r.fromZone,
        toZone: r.toZone,
        travelTimeMin: r.currentTravelTime,
        transitLoadPct: r.status === 'critical' ? 92 : r.status === 'high' ? 82 : r.status === 'watch' ? 68 : 45,
        status: r.status
      }));

      // Calculate composite transit load for this zone
      const transitLoad = relevantRoutes.length > 0
        ? Math.round(routeConnections.reduce((sum, rc) => sum + rc.transitLoadPct, 0) / relevantRoutes.length)
        : zone.transitLoad;

      // 4. Normalized POIs associated with this zone
      const nearbyPois = pois.filter(p => p.zoneId === zone.id);

      // 5. Active Alerts impacting this zone
      const activeAlerts = alerts
        .filter(a => a.zoneId === zone.id && !a.acknowledged)
        .map(a => a.id);

      // 6. Active Recommendations targeting or involving this zone
      const recommendationIds = interventions
        .filter(i => i.targetZone === zone.id || i.targetZoneName.toLowerCase().includes(zone.id))
        .map(i => i.id);

      // 7. Deterministic Contributing Factors Breakdown
      // Formula: 30% Occupancy + 25% Arrivals + 20% Transit + 15% Venue + 10% Weather
      const arrivalsNorm = zone.predictedArrivalsNorm || Math.min(100, Math.round((zone.predictedArrivals / 16000) * 100));
      const wRisk = weather.weatherRisk ?? weather.weatherRiskScore ?? zone.weatherRisk;

      const factorOccupancy = 0.30 * accommodationOccupancy;
      const factorArrivals = 0.25 * arrivalsNorm;
      const factorTransit = 0.20 * transitLoad;
      const factorVenue = 0.15 * venueLoad;
      const factorWeather = 0.10 * wRisk;

      const pressureScore = Math.min(100, Math.max(0, Math.round(
        factorOccupancy + factorArrivals + factorTransit + factorVenue + factorWeather
      )));

      const status: PressureStatus = 
        pressureScore >= 85 ? 'critical' :
        pressureScore >= 70 ? 'high' :
        pressureScore >= 50 ? 'watch' : 'stable';

      const contributingFactors: ContributingFactor[] = [
        { name: 'Accommodation Saturation', value: Math.round(factorOccupancy), percentage: accommodationOccupancy },
        { name: 'Predicted Arrivals Velocity', value: Math.round(factorArrivals), percentage: arrivalsNorm },
        { name: 'Transit Corridor Load', value: Math.round(factorTransit), percentage: transitLoad },
        { name: 'Venue Concourse Density', value: Math.round(factorVenue), percentage: venueLoad },
        { name: 'Weather Risk Impact', value: Math.round(factorWeather), percentage: wRisk }
      ].sort((a, b) => b.value - a.value);

      const availableCapacity = Math.max(0, zone.capacityLimit - zone.activeVisitors);

      return {
        zoneId: zone.id,
        zoneName: zone.name,
        weatherRisk: wRisk,
        transitLoad,
        accommodationOccupancy,
        venueLoad,
        predictedArrivals: zone.predictedArrivals,
        activeVisitors: zone.activeVisitors,
        availableCapacity,
        nearbyPois,
        routeConnections,
        pressureScore,
        status,
        contributingFactors,
        activeAlerts,
        recommendationIds,
        dataSources
      };
    });
  }
}
