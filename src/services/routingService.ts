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

  public getSmartArrivalPlan(fromZone = 'andheri', toVenue = 'Jio World Convention Centre BKC', scenario = 'normal'): RouteOption[] {
    const now = new Date();
    const addMinutes = (mins: number) => {
      const d = new Date(now.getTime() + mins * 60000);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const isRain = scenario === 'heavy_rain';
    const isMetroDown = scenario === 'metro_disruption';
    const isGateClosure = scenario === 'gate_closure';
    const isSurge = scenario === 'demand_surge';

    const leastCrowdedTime = isRain ? 36 : isSurge ? 34 : 28;
    const fastestTime = isMetroDown ? 42 : isRain ? 28 : isSurge ? 31 : 22;
    const accessibleTime = isRain ? 44 : isSurge ? 39 : 34;

    return [
      {
        id: 'opt_least_crowded',
        tier: 'least_crowded',
        title: 'Smart Crowd-Bypass Route (Recommended)',
        description: isRain 
          ? 'Bypasses surface waterlogging via Western Railway Elevated Corridor + Covered Event Shuttle directly to Gate 2.' 
          : 'Bypasses congested Dadar interchange via Western Railway Fast to Bandra + Dedicated Event Shuttle directly into Gate 2.',
        totalTimeMin: leastCrowdedTime,
        walkingTimeMin: isRain ? 6 : 4,
        walkingDistanceMeters: 320,
        transitModes: ['rail', 'shuttle', 'walking'],
        crowdRating: isSurge ? 'Moderate' : 'Low',
        crowdPercentage: isSurge ? 52 : isRain ? 42 : 34,
        eta: addMinutes(leastCrowdedTime),
        recommendedArrivalWindow: isRain ? '16:45 - 17:15 (Before monsoon rain intensifies)' : '17:15 - 17:35 (Avoids 18:00 Peak)',
        assignedGate: isGateClosure ? 'Gate 4 (Rerouted - Gate 2 Closed)' : 'Gate 2 (Express Pass - 4 min wait)',
        co2SavedKg: 2.4,
        steps: [
          { 
            instruction: isRain 
              ? 'Board Western Railway Fast local from Platform 3 toward Bandra (monsoon caution speed active)' 
              : 'Board Western Railway Fast local from Platform 3 toward Bandra', 
            mode: 'rail', 
            durationMin: isRain ? 18 : 14, 
            distanceMeters: 8200 
          },
          { 
            instruction: isMetroDown 
              ? 'Transfer to Auxiliary High-Capacity Relief Shuttle at Bandra East Depot (Bay 4)' 
              : 'Transfer to CrowdFlow Electric Shuttle at Bandra East Depot (Bay 4)', 
            mode: 'shuttle', 
            durationMin: isRain ? 12 : 10, 
            distanceMeters: 3100 
          },
          { 
            instruction: isRain 
              ? 'Walk via covered, rain-sheltered concourse straight to Gate 2 Express Pavilion' 
              : 'Walk shaded concourse straight to Gate 2 Express Pavilion', 
            mode: 'walking', 
            durationMin: isRain ? 6 : 4, 
            distanceMeters: 320 
          }
        ]
      },
      {
        id: 'opt_fastest',
        tier: 'fastest',
        title: isMetroDown ? 'Surface Bus Bridge (Metro Relief)' : 'Direct Metro Line 3 Underground',
        description: isMetroDown 
          ? 'Metro Line 3 track maintenance / disruption active. High-frequency surface bus bridge deployed between stations.'
          : isRain
          ? 'Fastest underground route sheltered from surface rain; high frequency air-conditioned transit.'
          : 'Fastest transit speed directly underneath the city with high air-conditioned frequency.',
        totalTimeMin: fastestTime,
        walkingTimeMin: 7,
        walkingDistanceMeters: 550,
        transitModes: isMetroDown ? ['bus', 'walking'] : ['metro', 'walking'],
        crowdRating: isMetroDown || isSurge ? 'Heavy' : 'Moderate',
        crowdPercentage: isMetroDown ? 88 : isSurge ? 82 : 72,
        eta: addMinutes(fastestTime),
        recommendedArrivalWindow: isMetroDown ? '16:30 - 17:00 (Expect bus-bridge queues)' : '17:30 - 17:50',
        assignedGate: isGateClosure ? 'Gate 3 (Accessible Hub)' : 'Gate 1 (Central Plaza - 22 min wait)',
        co2SavedKg: 2.1,
        steps: isMetroDown ? [
          { instruction: 'Board Metro Line 3 Surface Relief Bus Bridge outside Sahar Road Station', mode: 'bus', durationMin: 28, distanceMeters: 9400 },
          { instruction: 'Alight at BKC Central Connector and proceed via concourse to Gate 1', mode: 'walking', durationMin: 7, distanceMeters: 550 }
        ] : [
          { instruction: isRain ? 'Board Metro Line 3 Aqua at Sahar Road (Underground dry corridor)' : 'Board Metro Line 3 Aqua at Sahar Road Underground Station', mode: 'metro', durationMin: isRain ? 18 : 15, distanceMeters: 9400 },
          { instruction: 'Exit at BKC Central Station Concourse A', mode: 'walking', durationMin: 7, distanceMeters: 550 }
        ]
      },
      {
        id: 'opt_accessible',
        tier: 'accessible',
        title: 'Step-Free Barrier-Free Route',
        description: isRain 
          ? '100% elevator-accessible, low-floor AC transit with sheltered boarding zones.'
          : '100% elevator-accessible, step-free low-floor AC transit with priority tactile pavers.',
        totalTimeMin: accessibleTime,
        walkingTimeMin: 3,
        walkingDistanceMeters: 180,
        transitModes: ['bus', 'walking'],
        crowdRating: isSurge ? 'Moderate' : 'Low',
        crowdPercentage: isSurge ? 56 : 40,
        eta: addMinutes(accessibleTime),
        recommendedArrivalWindow: '17:10 - 17:30',
        assignedGate: 'Gate 3 (Accessible Dedicated Pavilion)',
        co2SavedKg: 1.8,
        steps: [
          { 
            instruction: isRain 
              ? 'Board Low-Floor Wheelchair Accessible BEST Route 310-AC (Sheltered bay)' 
              : 'Board Low-Floor Wheelchair Accessible BEST Route 310-AC', 
            mode: 'bus', 
            durationMin: isRain ? 37 : 31, 
            distanceMeters: 8600 
          },
          { instruction: 'Ramp access directly into Gate 3 Accessible Entrance', mode: 'walking', durationMin: 3, distanceMeters: 180 }
        ]
      },
      {
        id: 'opt_emergency',
        tier: 'emergency',
        title: 'Crowd Dispersal Contingency Route',
        description: 'Reserved green corridor activated during peak event dispersal windows.',
        totalTimeMin: isSurge ? 20 : 26,
        walkingTimeMin: 5,
        walkingDistanceMeters: 400,
        transitModes: ['shuttle', 'walking'],
        crowdRating: 'Low',
        crowdPercentage: 25,
        eta: addMinutes(isSurge ? 20 : 26),
        recommendedArrivalWindow: 'Anytime during operational surge',
        assignedGate: 'Gate 4 (South Transit Hub)',
        co2SavedKg: 2.0,
        steps: [
          { instruction: 'Board Emergency Dispersal Coach at North Gate', mode: 'shuttle', durationMin: isSurge ? 15 : 21, distanceMeters: 7500 },
          { instruction: 'Step-free walk to Western Express Arterial Link', mode: 'walking', durationMin: 5, distanceMeters: 400 }
        ]
      }
    ];
  }
}

export const routingService = RoutingService.getInstance();
