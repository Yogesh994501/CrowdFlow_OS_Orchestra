export interface RouteOption {
  id: string;
  tier: 'fastest' | 'least_crowded' | 'accessible' | 'emergency';
  title: string;
  description: string;
  totalTimeMin: number;
  walkingTimeMin: number;
  walkingDistanceMeters: number;
  transitModes: ('metro' | 'rail' | 'bus' | 'shuttle' | 'walking')[];
  crowdRating: 'Low' | 'Moderate' | 'Heavy' | 'Extreme';
  crowdPercentage: number;
  eta: string;
  recommendedArrivalWindow: string;
  assignedGate: string;
  co2SavedKg: number;
  steps: {
    instruction: string;
    mode: 'metro' | 'rail' | 'bus' | 'shuttle' | 'walking';
    durationMin: number;
    distanceMeters: number;
  }[];
}

export class RoutingService {
  private static instance: RoutingService;

  public static getInstance(): RoutingService {
    if (!RoutingService.instance) {
      RoutingService.instance = new RoutingService();
    }
    return RoutingService.instance;
  }

  public getSmartArrivalPlan(fromZone = 'andheri', toVenue = 'Jio World Convention Centre BKC'): RouteOption[] {
    const now = new Date();
    const addMinutes = (mins: number) => {
      const d = new Date(now.getTime() + mins * 60000);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return [
      {
        id: 'opt_least_crowded',
        tier: 'least_crowded',
        title: 'Smart Crowd-Bypass Route (Recommended)',
        description: 'Bypasses congested Dadar interchange via Western Railway Fast to Bandra + Dedicated Event Shuttle directly into Gate 2.',
        totalTimeMin: 28,
        walkingTimeMin: 4,
        walkingDistanceMeters: 320,
        transitModes: ['rail', 'shuttle', 'walking'],
        crowdRating: 'Low',
        crowdPercentage: 34,
        eta: addMinutes(28),
        recommendedArrivalWindow: '17:15 - 17:35 (Avoids 18:00 Peak)',
        assignedGate: 'Gate 2 (Express Pass - 4 min wait)',
        co2SavedKg: 2.4,
        steps: [
          { instruction: 'Board Western Railway Fast local from Platform 3 toward Bandra', mode: 'rail', durationMin: 14, distanceMeters: 8200 },
          { instruction: 'Transfer to CrowdFlow Electric Shuttle at Bandra East Depot (Bay 4)', mode: 'shuttle', durationMin: 10, distanceMeters: 3100 },
          { instruction: 'Walk shaded concourse straight to Gate 2 Express Pavilion', mode: 'walking', durationMin: 4, distanceMeters: 320 }
        ]
      },
      {
        id: 'opt_fastest',
        tier: 'fastest',
        title: 'Direct Metro Line 3 Underground',
        description: 'Fastest transit speed directly underneath the city with high air-conditioned frequency.',
        totalTimeMin: 22,
        walkingTimeMin: 7,
        walkingDistanceMeters: 550,
        transitModes: ['metro', 'walking'],
        crowdRating: 'Moderate',
        crowdPercentage: 72,
        eta: addMinutes(22),
        recommendedArrivalWindow: '17:30 - 17:50',
        assignedGate: 'Gate 1 (Central Plaza - 22 min wait)',
        co2SavedKg: 2.1,
        steps: [
          { instruction: 'Board Metro Line 3 Aqua at Sahar Road Underground Station', mode: 'metro', durationMin: 15, distanceMeters: 9400 },
          { instruction: 'Exit at BKC Central Station Concourse A', mode: 'walking', durationMin: 7, distanceMeters: 550 }
        ]
      },
      {
        id: 'opt_accessible',
        tier: 'accessible',
        title: 'Step-Free Barrier-Free Route',
        description: '100% elevator-accessible, step-free low-floor AC transit with priority tactile pavers.',
        totalTimeMin: 34,
        walkingTimeMin: 3,
        walkingDistanceMeters: 180,
        transitModes: ['bus', 'walking'],
        crowdRating: 'Low',
        crowdPercentage: 40,
        eta: addMinutes(34),
        recommendedArrivalWindow: '17:10 - 17:30',
        assignedGate: 'Gate 3 (Accessible Dedicated Pavilion)',
        co2SavedKg: 1.8,
        steps: [
          { instruction: 'Board Low-Floor Wheelchair Accessible BEST Route 310-AC', mode: 'bus', durationMin: 31, distanceMeters: 8600 },
          { instruction: 'Ramp access directly into Gate 3 Accessible Entrance', mode: 'walking', durationMin: 3, distanceMeters: 180 }
        ]
      },
      {
        id: 'opt_emergency',
        tier: 'emergency',
        title: 'Crowd Dispersal Contingency Route',
        description: 'Reserved green corridor activated during peak stadium dispersal windows.',
        totalTimeMin: 26,
        walkingTimeMin: 5,
        walkingDistanceMeters: 400,
        transitModes: ['shuttle', 'walking'],
        crowdRating: 'Low',
        crowdPercentage: 25,
        eta: addMinutes(26),
        recommendedArrivalWindow: 'Anytime during operational surge',
        assignedGate: 'Gate 4 (South Transit Hub)',
        co2SavedKg: 2.0,
        steps: [
          { instruction: 'Board Emergency Dispersal Coach at North Gate', mode: 'shuttle', durationMin: 21, distanceMeters: 7500 },
          { instruction: 'Step-free walk to Western Express Arterial Link', mode: 'walking', durationMin: 5, distanceMeters: 400 }
        ]
      }
    ];
  }
}

export const routingService = RoutingService.getInstance();
