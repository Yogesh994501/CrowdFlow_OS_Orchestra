import { TransitRoute, PressureStatus } from '../types';

export interface CongestionCorridor {
  id: string;
  name: string;
  fromZone: string;
  toZone: string;
  normalTravelTime: number; // min
  currentTravelTime: number; // min
  predictedPeakTime: string;
  delayPercentage: number;
  status: PressureStatus;
  primaryCause: string;
}

export class MobilityService {
  private static instance: MobilityService;

  public static getInstance(): MobilityService {
    if (!MobilityService.instance) {
      MobilityService.instance = new MobilityService();
    }
    return MobilityService.instance;
  }

  public getInitialRoutes(): TransitRoute[] {
    return [
      {
        id: 'route_metro_3',
        name: 'Metro Line 3 (Aqua Line Underground)',
        type: 'metro',
        fromZone: 'churchgate',
        toZone: 'bkc',
        normalTravelTime: 22,
        currentTravelTime: 27,
        delayPercentage: 23,
        predictedPeakTime: '18:45',
        status: 'watch',
        vehiclesActive: 16,
        seatsRemaining: 420,
        waitTime: 4,
        nextDeparture: '2 min',
        routeTier: 'fastest',
        path: [
          [18.9322, 72.8264],
          [18.9800, 72.8350],
          [19.0178, 72.8478],
          [19.0657, 72.8686]
        ]
      },
      {
        id: 'route_western_rail_fast',
        name: 'Western Railway Fast Event Special',
        type: 'rail',
        fromZone: 'virar',
        toZone: 'bkc',
        normalTravelTime: 54,
        currentTravelTime: 62,
        delayPercentage: 15,
        predictedPeakTime: '18:00',
        status: 'stable',
        vehiclesActive: 24,
        seatsRemaining: 1850,
        waitTime: 6,
        nextDeparture: '4 min',
        routeTier: 'least_crowded',
        path: [
          [19.4700, 72.8000],
          [19.3620, 72.8200],
          [19.2300, 72.8560],
          [19.1136, 72.8697],
          [19.0657, 72.8686]
        ]
      },
      {
        id: 'route_dadar_shuttle_express',
        name: 'Dadar Junction - BKC Direct Electric Shuttle',
        type: 'shuttle',
        fromZone: 'dadar',
        toZone: 'bkc',
        normalTravelTime: 18,
        currentTravelTime: 36,
        delayPercentage: 100,
        predictedPeakTime: '19:15',
        status: 'critical',
        vehiclesActive: 12,
        seatsRemaining: 48,
        waitTime: 14,
        nextDeparture: '1 min',
        routeTier: 'fastest',
        path: [
          [19.0178, 72.8478],
          [19.0400, 72.8520],
          [19.0657, 72.8686]
        ]
      },
      {
        id: 'route_navi_mumbai_express_shuttle',
        name: 'Navi Mumbai Vashi - BKC Dedicated Connector',
        type: 'shuttle',
        fromZone: 'navi_mumbai',
        toZone: 'bkc',
        normalTravelTime: 35,
        currentTravelTime: 39,
        delayPercentage: 11,
        predictedPeakTime: '19:30',
        status: 'stable',
        vehiclesActive: 14,
        seatsRemaining: 540,
        waitTime: 5,
        nextDeparture: '3 min',
        routeTier: 'least_crowded',
        path: [
          [19.0640, 72.9980],
          [19.0550, 72.9300],
          [19.0657, 72.8686]
        ]
      },
      {
        id: 'route_goregaon_feeder',
        name: 'Goregaon NESCO - BKC Rapid Transit Bus',
        type: 'bus',
        fromZone: 'goregaon',
        toZone: 'bkc',
        normalTravelTime: 28,
        currentTravelTime: 34,
        delayPercentage: 21,
        predictedPeakTime: '18:15',
        status: 'watch',
        vehiclesActive: 10,
        seatsRemaining: 190,
        waitTime: 8,
        nextDeparture: '5 min',
        routeTier: 'accessible',
        path: [
          [19.1551, 72.8557],
          [19.1136, 72.8697],
          [19.0657, 72.8686]
        ]
      },
      {
        id: 'route_central_rail_kurla',
        name: 'Central Railway Main Line (Thane - Kurla Interchange)',
        type: 'rail',
        fromZone: 'thane',
        toZone: 'bkc',
        normalTravelTime: 38,
        currentTravelTime: 49,
        delayPercentage: 29,
        predictedPeakTime: '19:00',
        status: 'high',
        vehiclesActive: 18,
        seatsRemaining: 680,
        waitTime: 7,
        nextDeparture: '3 min',
        routeTier: 'fastest',
        path: [
          [19.2183, 72.9781],
          [19.1400, 72.9400],
          [19.0680, 72.8800],
          [19.0657, 72.8686]
        ]
      },
      {
        id: 'route_andheri_metro_1',
        name: 'Metro Line 1 (Ghatkopar - Andheri West)',
        type: 'metro',
        fromZone: 'andheri',
        toZone: 'bkc',
        normalTravelTime: 20,
        currentTravelTime: 24,
        delayPercentage: 20,
        predictedPeakTime: '18:30',
        status: 'watch',
        vehiclesActive: 14,
        seatsRemaining: 310,
        waitTime: 4,
        nextDeparture: '2 min',
        routeTier: 'fastest',
        path: [
          [19.1136, 72.8697],
          [19.0850, 72.8900],
          [19.0657, 72.8686]
        ]
      },
      {
        id: 'route_bkc_pedestrian_link',
        name: 'BKC Concourse Skywalk & Shaded Pedestrian Corridor',
        type: 'walking',
        fromZone: 'bkc',
        toZone: 'bkc',
        normalTravelTime: 12,
        currentTravelTime: 14,
        delayPercentage: 16,
        predictedPeakTime: '19:00',
        status: 'stable',
        vehiclesActive: 0,
        seatsRemaining: 9999,
        waitTime: 0,
        nextDeparture: 'Continuous',
        routeTier: 'accessible',
        path: [
          [19.0630, 72.8640],
          [19.0657, 72.8686],
          [19.0680, 72.8710]
        ]
      },
      {
        id: 'route_emergency_diversion_east',
        name: 'Eastern Freeway Emergency Diversion Corridor',
        type: 'shuttle',
        fromZone: 'churchgate',
        toZone: 'bkc',
        normalTravelTime: 28,
        currentTravelTime: 31,
        delayPercentage: 10,
        predictedPeakTime: '20:00',
        status: 'stable',
        vehiclesActive: 8,
        seatsRemaining: 260,
        waitTime: 6,
        nextDeparture: '4 min',
        routeTier: 'emergency',
        path: [
          [18.9322, 72.8264],
          [18.9600, 72.8500],
          [19.0300, 72.8900],
          [19.0657, 72.8686]
        ]
      },
      {
        id: 'route_harbour_link_vashi',
        name: 'Mumbai Trans Harbour Link (MTHL Atal Setu) Express Coach',
        type: 'bus',
        fromZone: 'navi_mumbai',
        toZone: 'churchgate',
        normalTravelTime: 38,
        currentTravelTime: 40,
        delayPercentage: 5,
        predictedPeakTime: '17:30',
        status: 'stable',
        vehiclesActive: 16,
        seatsRemaining: 620,
        waitTime: 5,
        nextDeparture: '3 min',
        routeTier: 'least_crowded',
        path: [
          [19.0000, 73.0000],
          [18.9800, 72.9300],
          [18.9400, 72.8400],
          [18.9322, 72.8264]
        ]
      }
    ];
  }

  public getCongestionCorridors(): CongestionCorridor[] {
    return [
      {
        id: 'corridor_bkc_connector',
        name: 'BKC-Kalanagar Flyover Connector',
        fromZone: 'bkc',
        toZone: 'bkc',
        normalTravelTime: 6,
        currentTravelTime: 22,
        delayPercentage: 266,
        predictedPeakTime: '18:45 - 20:30',
        status: 'critical',
        primaryCause: 'Vehicular merge bottleneck & VIP convoy lane reservation'
      },
      {
        id: 'corridor_dadar_tilak',
        name: 'Dadar Tilak Bridge & Platform Concourse',
        fromZone: 'dadar',
        toZone: 'dadar',
        normalTravelTime: 8,
        currentTravelTime: 24,
        delayPercentage: 200,
        predictedPeakTime: '19:15 - 21:00',
        status: 'critical',
        primaryCause: 'Simultaneous transfer between Central & Western local trains'
      },
      {
        id: 'corridor_santacruz_weh',
        name: 'Western Express Highway (Santacruz Jn)',
        fromZone: 'andheri',
        toZone: 'bkc',
        normalTravelTime: 14,
        currentTravelTime: 29,
        delayPercentage: 107,
        predictedPeakTime: '18:00 - 19:45',
        status: 'high',
        primaryCause: 'Heavy airport inbound traffic merging with event attendees'
      },
      {
        id: 'corridor_sion_connector',
        name: 'Sion-Bandra Link Road',
        fromZone: 'dadar',
        toZone: 'bkc',
        normalTravelTime: 10,
        currentTravelTime: 18,
        delayPercentage: 80,
        predictedPeakTime: '18:30 - 20:00',
        status: 'high',
        primaryCause: 'High volume of app-based cabs entering G-Block'
      },
      {
        id: 'corridor_vashi_creek',
        name: 'Vashi Creek Bridge Corridor',
        fromZone: 'navi_mumbai',
        toZone: 'bkc',
        normalTravelTime: 22,
        currentTravelTime: 26,
        delayPercentage: 18,
        predictedPeakTime: '17:30 - 18:45',
        status: 'stable',
        primaryCause: 'Flowing smoothly with active electronic toll clearance'
      },
      {
        id: 'corridor_virar_fast',
        name: 'Virār - Andheri Express Rail Corridor',
        fromZone: 'virar',
        toZone: 'andheri',
        normalTravelTime: 36,
        currentTravelTime: 40,
        delayPercentage: 11,
        predictedPeakTime: '17:00 - 18:30',
        status: 'stable',
        primaryCause: 'Western Railway 15-car locals running on scheduled headway'
      }
    ];
  }
}

export const mobilityService = MobilityService.getInstance();
