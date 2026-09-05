import type { TransitRoute } from '../types/route';
import type { NormalizedTransitFeedItem } from '../services/api/gtfsApi';

export class TransitAdapter {
  static normalizeFeedItems(items: NormalizedTransitFeedItem[]): TransitRoute[] {
    return items.map(item => ({
      id: item.routeId,
      name: item.name,
      type: item.mode,
      origin: item.origin,
      destination: item.destination,
      currentLoad: item.currentLoad,
      capacityPerHour: item.capacity,
      activeVehicles: item.activeVehicles,
      delayMinutes: item.delayMinutes,
      status: item.status,
      headwayMin: item.mode === 'metro' ? 3.5 : item.mode === 'shuttle' ? 2.5 : 4.5,
      waypoints: [
        [19.065, 72.868],
        [19.018, 72.848]
      ]
    }));
  }

  static calculateZoneTransitPressure(routes: TransitRoute[], zoneId: string): number {
    // Determine relevant routes
    const zoneRoutes = routes.filter(r => 
      r.destination.toLowerCase().includes(zoneId) || 
      r.origin.toLowerCase().includes(zoneId) ||
      (zoneId === 'bkc' && (r.name.includes('BKC') || r.name.includes('Metro Line 3'))) ||
      (zoneId === 'dadar' && (r.name.includes('Suburban') || r.name.includes('Central')))
    );

    if (zoneRoutes.length === 0) return 45;

    const avgLoad = zoneRoutes.reduce((acc, r) => acc + r.currentLoad, 0) / zoneRoutes.length;
    const avgDelay = zoneRoutes.reduce((acc, r) => acc + r.delayMinutes, 0) / zoneRoutes.length;

    // Delay penalty: +3 pts per minute of delay
    const totalPressure = Math.min(100, Math.round(avgLoad + avgDelay * 3));
    return totalPressure;
  }
}
