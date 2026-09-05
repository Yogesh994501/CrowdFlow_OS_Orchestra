import { Zone, Venue, PressureStatus } from '../types';

export class CrowdService {
  private static instance: CrowdService;

  public static getInstance(): CrowdService {
    if (!CrowdService.instance) {
      CrowdService.instance = new CrowdService();
    }
    return CrowdService.instance;
  }

  public calculatePressureScore(
    occupancy: number,
    predictedArrivalsNorm: number,
    transitLoad: number,
    venueLoad: number,
    weatherRisk: number
  ): number {
    const score = (
      0.30 * occupancy +
      0.25 * predictedArrivalsNorm +
      0.20 * transitLoad +
      0.15 * venueLoad +
      0.10 * weatherRisk
    );
    return Math.min(100, Math.max(0, Math.round(score)));
  }

  public getPressureStatus(score: number): PressureStatus {
    if (score >= 85) return 'critical';
    if (score >= 70) return 'high';
    if (score >= 50) return 'watch';
    return 'stable';
  }

  public getTopContributors(
    occupancy: number,
    predictedArrivalsNorm: number,
    transitLoad: number,
    venueLoad: number,
    weatherRisk: number
  ): string[] {
    const factors = [
      { name: `Accommodation occupancy: ${Math.round(occupancy)}%`, value: 0.30 * occupancy },
      { name: `Predicted arrivals: ${Math.round(predictedArrivalsNorm)}%`, value: 0.25 * predictedArrivalsNorm },
      { name: `Transit load: ${Math.round(transitLoad)}%`, value: 0.20 * transitLoad },
      { name: `Venue load: ${Math.round(venueLoad)}%`, value: 0.15 * venueLoad },
      { name: `Weather risk: ${Math.round(weatherRisk)}%`, value: 0.10 * weatherRisk },
    ];

    factors.sort((a, b) => b.value - a.value);
    return factors.slice(0, 3).map(f => f.name);
  }

  public getInitialVenues(): Venue[] {
    return [
      {
        id: 'venue_jio_bkc',
        name: 'Jio World Convention Centre',
        zoneId: 'bkc',
        capacity: 38000,
        currentAttendance: 32400,
        lat: 19.0657,
        lng: 72.8686,
        gates: [
          { id: 'gate_a', name: 'Gate 1 (Central Plaza)', queueTimeMin: 32, flowRate: 95, status: 'critical' },
          { id: 'gate_b', name: 'Gate 2 (Express Pass)', queueTimeMin: 12, flowRate: 140, status: 'stable' },
          { id: 'gate_c', name: 'Gate 3 (Pavilion West)', queueTimeMin: 24, flowRate: 110, status: 'watch' },
        ]
      },
      {
        id: 'venue_mmrda_bkc',
        name: 'MMRDA Mega Arena Grounds',
        zoneId: 'bkc',
        capacity: 55000,
        currentAttendance: 48900,
        lat: 19.0610,
        lng: 72.8615,
        gates: [
          { id: 'gate_a', name: 'Main Concourse North', queueTimeMin: 38, flowRate: 120, status: 'critical' },
          { id: 'gate_b', name: 'South VIP & Media Gate', queueTimeMin: 8, flowRate: 60, status: 'stable' },
          { id: 'gate_c', name: 'East Transit Gate', queueTimeMin: 28, flowRate: 150, status: 'high' },
        ]
      },
      {
        id: 'venue_wankhede',
        name: 'Wankhede Iconic Stadium',
        zoneId: 'churchgate',
        capacity: 33000,
        currentAttendance: 24800,
        lat: 18.9389,
        lng: 72.8258,
        gates: [
          { id: 'gate_1', name: 'Vinoo Mankad Gate', queueTimeMin: 18, flowRate: 110, status: 'watch' },
          { id: 'gate_2', name: 'Garware Pavilion Gate', queueTimeMin: 14, flowRate: 130, status: 'stable' },
        ]
      },
      {
        id: 'venue_shivaji_park',
        name: 'Shivaji Park Cultural Amphitheatre',
        zoneId: 'dadar',
        capacity: 25000,
        currentAttendance: 21200,
        lat: 19.0269,
        lng: 72.8378,
        gates: [
          { id: 'gate_sp1', name: 'Catering North Entrance', queueTimeMin: 26, flowRate: 90, status: 'high' },
          { id: 'gate_sp2', name: 'South Promenade Gate', queueTimeMin: 15, flowRate: 105, status: 'stable' },
        ]
      },
      {
        id: 'venue_nesco_goregaon',
        name: 'Bombay Exhibition Centre (NESCO)',
        zoneId: 'goregaon',
        capacity: 42000,
        currentAttendance: 26100,
        lat: 19.1551,
        lng: 72.8557,
        gates: [
          { id: 'gate_n1', name: 'Hall 1 Express', queueTimeMin: 10, flowRate: 180, status: 'stable' },
          { id: 'gate_n2', name: 'Hall 4 Main Entry', queueTimeMin: 19, flowRate: 130, status: 'watch' },
        ]
      },
      {
        id: 'venue_cidco_navi_mumbai',
        name: 'CIDCO Exhibition Centre',
        zoneId: 'navi_mumbai',
        capacity: 30000,
        currentAttendance: 11800,
        lat: 19.0626,
        lng: 72.9978,
        gates: [
          { id: 'gate_c1', name: 'Vashi Creek Entry', queueTimeMin: 6, flowRate: 190, status: 'stable' },
          { id: 'gate_c2', name: 'Plaza South Entry', queueTimeMin: 5, flowRate: 160, status: 'stable' },
        ]
      },
      {
        id: 'venue_andheri_sports',
        name: 'Andheri Shahaji Raje Complex',
        zoneId: 'andheri',
        capacity: 20000,
        currentAttendance: 14500,
        lat: 19.1298,
        lng: 72.8361,
        gates: [
          { id: 'gate_ar1', name: 'Link Road Gate', queueTimeMin: 16, flowRate: 115, status: 'watch' },
          { id: 'gate_ar2', name: 'Veera Desai Gate', queueTimeMin: 9, flowRate: 130, status: 'stable' },
        ]
      },
      {
        id: 'venue_thane_upvan',
        name: 'Upvan Lake Pavilion Hub',
        zoneId: 'thane',
        capacity: 18000,
        currentAttendance: 8900,
        lat: 19.2241,
        lng: 72.9628,
        gates: [
          { id: 'gate_u1', name: 'Lakeside Concourse', queueTimeMin: 6, flowRate: 120, status: 'stable' },
        ]
      }
    ];
  }

  public getInitialZones(): Zone[] {
    const rawZones: Omit<Zone, 'pressureScore' | 'status' | 'topContributors'>[] = [
      {
        id: 'bkc',
        name: 'Bandra-Kurla Complex',
        shortName: 'BKC',
        coordinates: [19.0657, 72.8686],
        polygon: [
          [19.0750, 72.8550],
          [19.0740, 72.8790],
          [19.0560, 72.8760],
          [19.0580, 72.8520],
        ],
        trend: 'rising',
        activeVisitors: 48900,
        capacityLimit: 52000,
        accommodationOccupancy: 96,
        predictedArrivals: 14200,
        predictedArrivalsNorm: 89,
        transitLoad: 84,
        venueLoad: 92,
        weatherRisk: 30,
        topRisk: 'Accommodation saturation & Gate 1 queue bottleneck',
        recommendedAction: 'Redirect 18% incoming traffic to Navi Mumbai & open overflow beds in Goregaon',
        predictedPeak: '18:30 - 20:45'
      },
      {
        id: 'dadar',
        name: 'Dadar Transit Core',
        shortName: 'Dadar',
        coordinates: [19.0178, 72.8478],
        polygon: [
          [19.0320, 72.8350],
          [19.0300, 72.8600],
          [19.0060, 72.8580],
          [19.0090, 72.8330],
        ],
        trend: 'rising',
        activeVisitors: 31400,
        capacityLimit: 36000,
        accommodationOccupancy: 88,
        predictedArrivals: 11500,
        predictedArrivalsNorm: 79,
        transitLoad: 92,
        venueLoad: 72,
        weatherRisk: 30,
        topRisk: 'Central & Western railway platform interchange overload',
        recommendedAction: 'Deploy 6 emergency express shuttles to bypass Dadar station',
        predictedPeak: '19:15 - 21:30'
      },
      {
        id: 'andheri',
        name: 'Andheri West & East',
        shortName: 'Andheri',
        coordinates: [19.1136, 72.8697],
        polygon: [
          [19.1350, 72.8450],
          [19.1300, 72.8850],
          [19.0980, 72.8820],
          [19.1020, 72.8420],
        ],
        trend: 'stable',
        activeVisitors: 22600,
        capacityLimit: 32000,
        accommodationOccupancy: 74,
        predictedArrivals: 7800,
        predictedArrivalsNorm: 62,
        transitLoad: 68,
        venueLoad: 64,
        weatherRisk: 25,
        topRisk: 'Metro Line 1 interchange congestion',
        recommendedAction: 'Stagger departure times with +15 min off-peak attendee vouchers',
        predictedPeak: '17:45 - 19:15'
      },
      {
        id: 'churchgate',
        name: 'Churchgate & Fort',
        shortName: 'Churchgate',
        coordinates: [18.9322, 72.8264],
        polygon: [
          [18.9450, 72.8180],
          [18.9420, 72.8380],
          [18.9180, 72.8350],
          [18.9220, 72.8150],
        ],
        trend: 'falling',
        activeVisitors: 19800,
        capacityLimit: 28000,
        accommodationOccupancy: 79,
        predictedArrivals: 6100,
        predictedArrivalsNorm: 55,
        transitLoad: 64,
        venueLoad: 70,
        weatherRisk: 35,
        topRisk: 'High-end hotel saturation & coastal wind gust',
        recommendedAction: 'Channel south-bound visitors to Wankhede Garware Gate 2',
        predictedPeak: '16:30 - 18:00'
      },
      {
        id: 'goregaon',
        name: 'Goregaon Hub',
        shortName: 'Goregaon',
        coordinates: [19.1663, 72.8526],
        polygon: [
          [19.1800, 72.8350],
          [19.1750, 72.8750],
          [19.1480, 72.8720],
          [19.1510, 72.8320],
        ],
        trend: 'stable',
        activeVisitors: 16500,
        capacityLimit: 34000,
        accommodationOccupancy: 65,
        predictedArrivals: 5800,
        predictedArrivalsNorm: 52,
        transitLoad: 58,
        venueLoad: 60,
        weatherRisk: 20,
        topRisk: 'Western Express Highway evening pinch point',
        recommendedAction: 'Activate 500 emergency buffer beds for overflow from BKC',
        predictedPeak: '18:00 - 19:30'
      },
      {
        id: 'navi_mumbai',
        name: 'Navi Mumbai (Vashi/Belapur)',
        shortName: 'Navi Mumbai',
        coordinates: [19.0330, 73.0297],
        polygon: [
          [19.0900, 72.9800],
          [19.0800, 73.0500],
          [19.0000, 73.0600],
          [19.0100, 72.9700],
        ],
        trend: 'falling',
        activeVisitors: 14200,
        capacityLimit: 45000,
        accommodationOccupancy: 48,
        predictedArrivals: 3900,
        predictedArrivalsNorm: 34,
        transitLoad: 42,
        venueLoad: 38,
        weatherRisk: 20,
        topRisk: 'Underutilized reserve buffer capacity',
        recommendedAction: 'Promote 25% discount hotel packages with dedicated express AC shuttles',
        predictedPeak: '19:30 - 20:30'
      },
      {
        id: 'thane',
        name: 'Thane Metropolitan',
        shortName: 'Thane',
        coordinates: [19.2183, 72.9781],
        polygon: [
          [19.2450, 72.9450],
          [19.2400, 73.0100],
          [19.1800, 73.0050],
          [19.1850, 72.9400],
        ],
        trend: 'stable',
        activeVisitors: 12400,
        capacityLimit: 38000,
        accommodationOccupancy: 42,
        predictedArrivals: 3100,
        predictedArrivalsNorm: 30,
        transitLoad: 44,
        venueLoad: 35,
        weatherRisk: 15,
        topRisk: 'Eastern Express Highway traffic flow',
        recommendedAction: 'Designate secondary parking and rapid rail park-and-ride feeder',
        predictedPeak: '17:00 - 18:30'
      },
      {
        id: 'virar',
        name: 'Virār & Vasai Northern Buffer',
        shortName: 'Virār',
        coordinates: [19.4700, 72.8000],
        polygon: [
          [19.5000, 72.7800],
          [19.4900, 72.8400],
          [19.4300, 72.8350],
          [19.4400, 72.7750],
        ],
        trend: 'stable',
        activeVisitors: 5600,
        capacityLimit: 30000,
        accommodationOccupancy: 32,
        predictedArrivals: 1800,
        predictedArrivalsNorm: 22,
        transitLoad: 28,
        venueLoad: 20,
        weatherRisk: 15,
        topRisk: 'Long transit distance (58 min express train)',
        recommendedAction: 'Active overflow zone: 1,240 budget beds available with 15-min direct local trains',
        predictedPeak: '15:30 - 17:00'
      }
    ];

    return rawZones.map(z => {
      const pressureScore = this.calculatePressureScore(
        z.accommodationOccupancy,
        z.predictedArrivalsNorm,
        z.transitLoad,
        z.venueLoad,
        z.weatherRisk
      );
      const status = this.getPressureStatus(pressureScore);
      const topContributors = this.getTopContributors(
        z.accommodationOccupancy,
        z.predictedArrivalsNorm,
        z.transitLoad,
        z.venueLoad,
        z.weatherRisk
      );
      return {
        ...z,
        pressureScore,
        status,
        topContributors,
      };
    });
  }
}

export const crowdService = CrowdService.getInstance();
