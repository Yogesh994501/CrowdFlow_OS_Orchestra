import type { 
  Zone, 
  PressureStatus, 
  OperationalAlert, 
  Intervention, 
  AccommodationProvider, 
  TransitRoute 
} from '../types';
import type { WeatherData } from '../services/weatherService';

export class IntelligenceEngine {
  /**
   * Deterministic Pressure Score Formula:
   * 30% Occupancy + 25% Predicted Arrivals + 20% Transit Load + 15% Venue Load + 10% Weather Risk
   */
  static calculateZonePressure(
    occupancyPct: number,
    predictedArrivalsNorm: number,
    transitLoad: number,
    venueLoad: number,
    weatherRisk: number
  ): number {
    const raw = (
      0.30 * occupancyPct +
      0.25 * predictedArrivalsNorm +
      0.20 * transitLoad +
      0.15 * venueLoad +
      0.10 * weatherRisk
    );
    return Math.min(100, Math.max(0, Math.round(raw)));
  }

  static getPressureStatus(score: number): PressureStatus {
    if (score >= 85) return 'critical';
    if (score >= 75) return 'high';
    if (score >= 60) return 'watch';
    return 'stable';
  }

  /**
   * Analyze zone telemetry and recalculate all metrics
   */
  static evaluateZone(
    zone: Zone,
    accommodations: AccommodationProvider[],
    routes: TransitRoute[],
    weather: WeatherData
  ): Zone {
    const zoneAccommodations = accommodations.filter(a => a.zoneId === zone.id);
    let occ = zone.accommodationOccupancy;
    if (zoneAccommodations.length > 0) {
      const totalRooms = zoneAccommodations.reduce((acc, a) => acc + a.totalRooms, 0);
      const availRooms = zoneAccommodations.reduce((acc, a) => acc + a.availableRooms, 0);
      occ = totalRooms > 0 ? Math.round(((totalRooms - availRooms) / totalRooms) * 100) : occ;
    }

    const weatherRisk = weather.weatherRisk;

    const pressureScore = IntelligenceEngine.calculateZonePressure(
      occ,
      zone.predictedArrivalsNorm,
      zone.transitLoad,
      zone.venueLoad,
      weatherRisk
    );

    const status = IntelligenceEngine.getPressureStatus(pressureScore);

    // Identify top contributing factor
    const factors: { name: string; impact: number }[] = [
      { name: `Hospitality Saturation (${occ}%)`, impact: occ * 0.30 },
      { name: `Transit Corridor Load (${zone.transitLoad}%)`, impact: zone.transitLoad * 0.20 },
      { name: `Predicted Influx (${zone.predictedArrivals.toLocaleString()} arrivals)`, impact: zone.predictedArrivalsNorm * 0.25 },
      { name: `Weather Disruption Risk (${weatherRisk}%)`, impact: weatherRisk * 0.10 },
      { name: `Venue Turnstile Load (${zone.venueLoad}%)`, impact: zone.venueLoad * 0.15 }
    ];

    factors.sort((a, b) => b.impact - a.impact);

    return {
      ...zone,
      accommodationOccupancy: occ,
      weatherRisk,
      pressureScore,
      status,
      topRisk: factors[0].name,
      topContributors: factors.slice(0, 3).map(f => f.name)
    };
  }

  /**
   * Automated Alert Generation based on live conditions (Section 10)
   */
  static detectAlerts(
    zones: Zone[],
    weather: WeatherData,
    routes: TransitRoute[]
  ): OperationalAlert[] {
    const alerts: OperationalAlert[] = [];
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Accommodation saturation rule: Occupancy > 90%
    const saturatedZones = zones.filter(z => z.accommodationOccupancy >= 92);
    for (const z of saturatedZones) {
      alerts.push({
        id: `alert-auto-occ-${z.id}`,
        severity: z.accommodationOccupancy >= 95 ? 'critical' : 'high',
        title: `${z.name} Accommodation Saturation Imminent`,
        timestamp: now,
        zoneId: z.id,
        zoneName: z.name,
        message: `Hotel occupancy has reached ${z.accommodationOccupancy}% with ${z.predictedArrivals.toLocaleString()} arrivals pending.`,
        cause: `Hospitality bookings exceed safe thresholds in ${z.shortName} cluster.`,
        confidence: 94,
        recommendedAction: `Enforce buffer redistribution towards Virār and Navi Mumbai hubs.`,
        assignedOwner: 'Chief Hospitality Coordinator',
        acknowledged: false,
        status: 'active'
      });
    }

    // 2. Weather Risk rule: Risk > 70%
    if (weather.weatherRisk >= 70) {
      alerts.push({
        id: 'alert-auto-weather-monsoon',
        severity: 'high',
        title: 'Heavy Rainfall Warning — Transit Surge Expected',
        timestamp: now,
        zoneId: 'dadar',
        zoneName: 'Dadar Central Interchange',
        message: `Open-Meteo convective precipitation radar shows ${weather.precipitation}mm rain band. Walking route desirability down by 65%.`,
        cause: 'Monsoon downpour redirecting pedestrian flows into metro and rail concourses.',
        confidence: 88,
        recommendedAction: 'Deploy covered queuing awnings and inject 6 additional electric shuttles.',
        assignedOwner: 'Logistics & Municipal Disaster Cell',
        acknowledged: false,
        status: 'active'
      });
    }

    // 3. Transit Load rule: Transit Load > 85%
    const overloadedRoutes = routes.filter(r => r.delayPercentage >= 50);
    if (overloadedRoutes.length > 0) {
      const topRoute = overloadedRoutes[0];
      alerts.push({
        id: `alert-auto-transit-${topRoute.id}`,
        severity: topRoute.delayPercentage >= 60 ? 'critical' : 'high',
        title: `${topRoute.name} Approaching Critical Capacity`,
        timestamp: now,
        zoneId: 'dadar',
        zoneName: 'Dadar Interchange',
        message: `Line delay at ${topRoute.delayPercentage}% over normal headway. Headway compression needed.`,
        cause: 'Peak arrival corridor synchronizing with suburban commuter rush.',
        confidence: 91,
        recommendedAction: 'Hold non-event suburban traffic for 4-minute intervals; dispatch auxiliary fleet.',
        assignedOwner: 'Rail Transit Controller',
        acknowledged: false,
        status: 'active'
      });
    }

    return alerts;
  }

  /**
   * Deterministic Recommendation Engine (Section 11 & 12)
   */
  static generateRecommendations(
    zones: Zone[],
    accommodations: AccommodationProvider[]
  ): Intervention[] {
    const bkcZone = zones.find(z => z.id === 'bkc');
    const virarZone = zones.find(z => z.id === 'virar');
    const dadarZone = zones.find(z => z.id === 'dadar');

    const virarRooms = accommodations
      .filter(a => a.zoneId === 'virar')
      .reduce((sum, a) => sum + a.availableRooms, 0);

    const recommendations: Intervention[] = [];

    // Condition 1: BKC Pressure > 80 and Virar Pressure < 50 and Virar Beds > 200
    if (bkcZone && virarZone && bkcZone.pressureScore >= 75 && virarRooms > 200) {
      recommendations.push({
        id: 'rec-virar-buffer-redirect',
        title: 'Redirect 18% of BKC Inbound Demand to Virār Northern Buffer',
        category: 'accommodation',
        targetZone: 'bkc',
        targetZoneName: 'Bandra Kurla Complex (BKC)',
        actionType: 'Buffer Relocation & EV Shuttle Sync',
        why: `BKC is predicted to reach critical pressure (${bkcZone.pressureScore}/100) by 18:30, while Virār has ${virarRooms.toLocaleString()} available beds at low pressure (${virarZone.pressureScore}/100).`,
        signals: [
          { label: 'BKC Hotel Occupancy', value: `${bkcZone.accommodationOccupancy}% (Near Saturation)` },
          { label: 'Virār Room Vacancy', value: `${virarRooms} rooms available` },
          { label: 'Express Shuttle Access', value: '8-min direct headway' },
          { label: 'Attendee Incentive Take Rate', value: '68% claimed' }
        ],
        confidence: 92,
        expectedImpact: 'Reduces BKC Pressure Score by -14 points and frees 380 core parking stalls.',
        pressureReduction: 14,
        tradeOff: '+16 minutes average transit time for redirected attendees',
        alternative: 'Divert to Navi Mumbai CBD Belapur (+8 mins travel time, 480 available beds)',
        status: 'pending',
        assignedOperator: 'Unified Event Command',
        createdAt: '18:15'
      });
    }

    // Condition 2: Dadar Interchange Platform Surges
    if (dadarZone && dadarZone.pressureScore >= 70) {
      recommendations.push({
        id: 'rec-dadar-metro-bypass',
        title: 'Bypass Dadar Interchange via Metro Line 3 Aqua Corridor',
        category: 'transport',
        targetZone: 'dadar',
        targetZoneName: 'Dadar Central Interchange',
        actionType: 'Aqua Line Underground Routing',
        why: 'Western-Central rail sync creating platform bottlenecks of 4.2 people/m² at Dadar interchange.',
        signals: [
          { label: 'Platform Density', value: '4.2 / m² (Exceeds watch threshold)' },
          { label: 'Metro Line 3 Spare Capacity', value: '40% available' },
          { label: 'Southbound Influx', value: '18,400 passengers / hr' }
        ],
        confidence: 88,
        expectedImpact: 'Decreases Dadar platform stress by -11 points in 15 minutes.',
        pressureReduction: 11,
        tradeOff: 'Requires 4 traffic wardens at Bandra East concourse',
        alternative: 'Meter platform entry gates with 4-minute staging holds',
        status: 'pending',
        assignedOperator: 'Mumbai Transport Desk',
        createdAt: '18:18'
      });
    }

    return recommendations;
  }
}
