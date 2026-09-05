import type { RouteOption, RouteStrategy } from '../types/route';
import type { OSRMRouteResult } from '../services/api/osrmApi';

export class RoutingAdapter {
  /**
   * Calculate Crowd-Aware Route Score (0 - 100, lower is superior)
   * Formula: 40% Travel Time + 30% Crowd Pressure + 20% Transit Load + 10% Weather Risk
   */
  static calculateRouteScore(
    durationMinutes: number,
    zonePressure: number,
    transitLoad: number,
    weatherRisk: number
  ): number {
    // Normalize duration: 15 min = 20, 60 min = 80
    const normDuration = Math.min(100, Math.max(10, Math.round((durationMinutes / 60) * 80)));
    const score = (
      0.40 * normDuration +
      0.30 * zonePressure +
      0.20 * transitLoad +
      0.10 * weatherRisk
    );
    return Math.round(score);
  }

  /**
   * Generate 4 multimodal route options combining OSRM baseline with operational telemetry
   */
  static generateMultimodalRouteOptions(
    originName: string,
    destinationName: string,
    osrmResult: OSRMRouteResult,
    targetZonePressure: number,
    transitLoad: number,
    weatherRisk: number
  ): RouteOption[] {
    const baseDurationMin = Math.max(12, Math.round(osrmResult.durationSeconds / 60));
    const distanceKm = Math.round((osrmResult.distanceMeters / 1000) * 10) / 10;

    // 1. FASTEST ROUTE (Optimizes time, tolerates higher central load)
    const fastestDuration = baseDurationMin;
    const fastestScore = RoutingAdapter.calculateRouteScore(
      fastestDuration,
      targetZonePressure,
      transitLoad,
      weatherRisk
    );

    // 2. LEAST CROWDED ROUTE (Bypasses saturated Dadar/Kurla, uses dedicated bypass corridor)
    const leastCrowdedDuration = Math.round(baseDurationMin * 1.15); // +15% travel time
    const leastCrowdedPressure = Math.max(25, targetZonePressure - 28); // 28 pts less crowd pressure
    const leastCrowdedTransitLoad = Math.max(30, transitLoad - 35);
    const leastCrowdedScore = RoutingAdapter.calculateRouteScore(
      leastCrowdedDuration,
      leastCrowdedPressure,
      leastCrowdedTransitLoad,
      weatherRisk
    );

    // 3. ACCESSIBLE ROUTE (Step-free, continuous elevators, dedicated assistance shuttles)
    const accessibleDuration = Math.round(baseDurationMin * 1.25);
    const accessibleScore = RoutingAdapter.calculateRouteScore(
      accessibleDuration,
      targetZonePressure * 0.8,
      transitLoad * 0.7,
      weatherRisk * 0.9
    );

    // 4. EMERGENCY DIVERSION ROUTE (Completely avoids critical core bottleneck)
    const diversionDuration = Math.round(baseDurationMin * 1.35);
    const diversionScore = RoutingAdapter.calculateRouteScore(
      diversionDuration,
      35, // Diverts to low-stress buffer
      40,
      weatherRisk
    );

    return [
      {
        id: 'route-least-crowded',
        title: 'Recommended: Crowd-Bypass Transit Corridor',
        strategy: 'least_crowded',
        durationMin: leastCrowdedDuration,
        distanceKm: distanceKm + 1.8,
        crowdLevel: 'low',
        modes: ['Metro Line 3', 'EV Dedicated Shuttle'],
        routeScore: leastCrowdedScore,
        steps: [
          `Board Metro Line 3 at ${originName} (Platform 2, Northbound)`,
          'Bypass Dadar interchange via direct BKC underground corridor',
          'Arrive at Gate 2 Express Drop (Queue Time: 4 mins)'
        ],
        highlight: `Saves ~28 pts of crowd pressure; avoids Dadar platform congestion`,
        waypoints: osrmResult.waypoints
      },
      {
        id: 'route-fastest',
        title: 'Fastest Direct Route (Suburban Rail + Auto)',
        strategy: 'fastest',
        durationMin: fastestDuration,
        distanceKm,
        crowdLevel: targetZonePressure > 75 ? 'high' : 'moderate',
        modes: ['Western Railway Fast', 'Walking'],
        routeScore: fastestScore,
        steps: [
          `Board Western Railway Fast local at ${originName}`,
          'Transfer at Bandra Station East concourse',
          'Walk 600m via North Link to Gate 1 (Queue Time: 18 mins)'
        ],
        highlight: 'Fastest clock time, but high congestion at terminal pedestrian bridge',
        waypoints: osrmResult.waypoints
      },
      {
        id: 'route-accessible',
        title: 'Step-Free Accessible Route',
        strategy: 'accessible',
        durationMin: accessibleDuration,
        distanceKm: distanceKm + 0.6,
        crowdLevel: 'low',
        modes: ['Low-Floor EV Shuttle', 'Assisted Entry'],
        routeScore: accessibleScore,
        steps: [
          `Board Low-Floor AC Electric Shuttle at ${originName} Bay 1`,
          'Direct ramp drop-off at Gate 3 Hospitality & Accessibility concourse',
          'Elevator direct to Level 1 arena'
        ],
        highlight: 'Zero stairs, 100% tactile paving, wheelchair-accessible boarding',
        waypoints: osrmResult.waypoints
      },
      {
        id: 'route-emergency-diversion',
        title: 'Emergency Peripheral Corridor',
        strategy: 'emergency_diversion',
        durationMin: diversionDuration,
        distanceKm: distanceKm + 4.2,
        crowdLevel: 'low',
        modes: ['Eastern Freeway Express', 'Buffer Shuttle'],
        routeScore: diversionScore,
        steps: [
          'Route via Eastern Freeway bypass towards Kurla-Sion link',
          'Avoid central BKC entry jams entirely',
          'Access via South Holding Area'
        ],
        highlight: 'Activated during critical perimeter hold or rain diversion',
        waypoints: osrmResult.waypoints
      }
    ];
  }
}
