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

    // Hub specific route definitions
    if (fromZone === 'dadar') {
      const baseLeast = isRain ? 26 : isSurge ? 24 : 18;
      const baseFastest = isMetroDown ? 28 : isRain ? 22 : isSurge ? 20 : 15;
      const baseAccessible = isRain ? 32 : isSurge ? 28 : 22;

      return [
        {
          id: 'opt_least_crowded',
          tier: 'least_crowded',
          title: 'Dadar East Express Shuttle (Direct Bypass)',
          description: isRain
            ? 'Covered boarding bay at Dadar East Depot avoiding flooded road chokepoints directly into Gate 2.'
            : 'Dedicated event transit lane via Senapati Bapat Marg directly to Gate 2 Express Pavilion.',
          totalTimeMin: baseLeast,
          walkingTimeMin: isRain ? 4 : 3,
          walkingDistanceMeters: 240,
          transitModes: ['shuttle', 'walking'],
          crowdRating: isSurge ? 'Moderate' : 'Low',
          crowdPercentage: isSurge ? 48 : isRain ? 38 : 28,
          eta: addMinutes(baseLeast),
          recommendedArrivalWindow: '17:10 - 17:30 (Minimal Queue)',
          assignedGate: isGateClosure ? 'Gate 4 (Rerouted)' : 'Gate 2 (Express Pass - 3 min wait)',
          co2SavedKg: 1.8,
          steps: [
            {
              instruction: 'Board Dadar East Dedicated Event Shuttle at Bay 2 (opposite Swaminarayan Mandir)',
              mode: 'shuttle',
              durationMin: isRain ? 20 : 14,
              distanceMeters: 6200
            },
            {
              instruction: 'Disembark at BKC North Perimeter dedicated drop-off zone',
              mode: 'walking',
              durationMin: 2,
              distanceMeters: 120
            },
            {
              instruction: isGateClosure 
                ? 'Follow green signs to Gate 4 South transit ingress' 
                : 'Walk covered concourse directly to Gate 2 Express Turnstiles',
              mode: 'walking',
              durationMin: isRain ? 4 : 2,
              distanceMeters: 120
            }
          ]
        },
        {
          id: 'opt_fastest',
          tier: 'fastest',
          title: 'Central Railway Fast to Kurla + E-Shuttle',
          description: 'High-frequency suburban fast train with dedicated crowd-cleared connection at Kurla.',
          totalTimeMin: baseFastest,
          walkingTimeMin: 5,
          walkingDistanceMeters: 410,
          transitModes: ['rail', 'shuttle', 'walking'],
          crowdRating: isSurge ? 'Heavy' : 'Moderate',
          crowdPercentage: isSurge ? 78 : 62,
          eta: addMinutes(baseFastest),
          recommendedArrivalWindow: '17:25 - 17:45',
          assignedGate: 'Gate 1 (Central Concourse)',
          co2SavedKg: 2.2,
          steps: [
            {
              instruction: 'Board Central Railway Fast Local from Dadar Platform 4 toward Kurla',
              mode: 'rail',
              durationMin: 9,
              distanceMeters: 5100
            },
            {
              instruction: 'Transfer at Kurla West Skywalk to CrowdFlow Rapid Link Shuttle',
              mode: 'shuttle',
              durationMin: 6,
              distanceMeters: 2200
            },
            {
              instruction: 'Fast-track security checkpoint at Gate 1 Central Concourse',
              mode: 'walking',
              durationMin: 3,
              distanceMeters: 200
            }
          ]
        },
        {
          id: 'opt_accessible',
          tier: 'accessible',
          title: 'Dadar Step-Free Low-Floor Transit',
          description: '100% elevator-accessible connection with priority boarding and zero steps.',
          totalTimeMin: baseAccessible,
          walkingTimeMin: 3,
          walkingDistanceMeters: 160,
          transitModes: ['bus', 'walking'],
          crowdRating: 'Low',
          crowdPercentage: 35,
          eta: addMinutes(baseAccessible),
          recommendedArrivalWindow: '17:00 - 17:25',
          assignedGate: 'Gate 3 (Accessible Dedicated Pavilion)',
          co2SavedKg: 1.5,
          steps: [
            {
              instruction: 'Take elevator from Dadar Concourse to Low-Floor BEST 310-AC bus stand',
              mode: 'walking',
              durationMin: 3,
              distanceMeters: 100
            },
            {
              instruction: 'Board wheelchair-accessible AC Electric bus to BKC Gate 3',
              mode: 'bus',
              durationMin: baseAccessible - 5,
              distanceMeters: 6400
            },
            {
              instruction: 'Level ramp access straight into Gate 3 Accessible Hall',
              mode: 'walking',
              durationMin: 2,
              distanceMeters: 60
            }
          ]
        }
      ];
    }

    if (fromZone === 'colaba') {
      const baseLeast = isRain ? 34 : isSurge ? 32 : 25;
      const baseFastest = isRain ? 32 : isSurge ? 30 : 22;
      const baseAccessible = isRain ? 40 : isSurge ? 36 : 30;

      return [
        {
          id: 'opt_least_crowded',
          tier: 'least_crowded',
          title: 'Coastal Road Express Shuttle (Direct Bypass)',
          description: 'Glides over South Mumbai traffic via Coastal Road & Sea Link straight into BKC Connector.',
          totalTimeMin: baseLeast,
          walkingTimeMin: 3,
          walkingDistanceMeters: 210,
          transitModes: ['shuttle', 'walking'],
          crowdRating: 'Low',
          crowdPercentage: 30,
          eta: addMinutes(baseLeast),
          recommendedArrivalWindow: '17:00 - 17:30 (Scenic & Calm)',
          assignedGate: 'Gate 2 (Express Pass)',
          co2SavedKg: 2.8,
          steps: [
            {
              instruction: 'Board Coastal Road Express at Regal Cinema Depot (Bay 1)',
              mode: 'shuttle',
              durationMin: baseLeast - 4,
              distanceMeters: 16200
            },
            {
              instruction: 'Smooth descent from BKC Connector directly to Gate 2 drop-off',
              mode: 'walking',
              durationMin: 4,
              distanceMeters: 210
            }
          ]
        },
        {
          id: 'opt_fastest',
          tier: 'fastest',
          title: 'Churchgate Fast Local + Bandra Shuttle',
          description: 'Fast suburban corridor bypassing downtown road delays, connecting to event shuttle.',
          totalTimeMin: baseFastest,
          walkingTimeMin: 6,
          walkingDistanceMeters: 450,
          transitModes: ['rail', 'shuttle', 'walking'],
          crowdRating: isSurge ? 'Heavy' : 'Moderate',
          crowdPercentage: isSurge ? 82 : 65,
          eta: addMinutes(baseFastest),
          recommendedArrivalWindow: '17:20 - 17:45',
          assignedGate: 'Gate 1 (Central Plaza)',
          co2SavedKg: 2.5,
          steps: [
            {
              instruction: 'Board Western Railway Fast local from Churchgate Platform 1 to Bandra',
              mode: 'rail',
              durationMin: 18,
              distanceMeters: 15400
            },
            {
              instruction: 'Transfer to CrowdFlow Electric Shuttle at Bandra East Depot',
              mode: 'shuttle',
              durationMin: 9,
              distanceMeters: 2900
            },
            {
              instruction: 'Concourse walk to Gate 1 security lane',
              mode: 'walking',
              durationMin: 4,
              distanceMeters: 300
            }
          ]
        },
        {
          id: 'opt_accessible',
          tier: 'accessible',
          title: 'Nariman Point AC Low-Floor Priority Coach',
          description: 'Step-free transit link with designated accessible seating and low curb boarding.',
          totalTimeMin: baseAccessible,
          walkingTimeMin: 3,
          walkingDistanceMeters: 150,
          transitModes: ['bus', 'walking'],
          crowdRating: 'Low',
          crowdPercentage: 35,
          eta: addMinutes(baseAccessible),
          recommendedArrivalWindow: '17:05 - 17:35',
          assignedGate: 'Gate 3 (Accessible Dedicated Pavilion)',
          co2SavedKg: 2.1,
          steps: [
            {
              instruction: 'Board low-floor AC coach at Nariman Point bus terminal with priority ramp',
              mode: 'bus',
              durationMin: baseAccessible - 4,
              distanceMeters: 16800
            },
            {
              instruction: 'Direct step-free tactile path into Gate 3 Accessible Pavilion',
              mode: 'walking',
              durationMin: 3,
              distanceMeters: 150
            }
          ]
        }
      ];
    }

    if (fromZone === 'navi_mumbai') {
      const baseLeast = isRain ? 32 : isSurge ? 30 : 24;
      const baseFastest = isRain ? 30 : isSurge ? 28 : 22;
      const baseAccessible = isRain ? 38 : isSurge ? 35 : 30;

      return [
        {
          id: 'opt_least_crowded',
          tier: 'least_crowded',
          title: 'Atal Setu (MTHL) Expressway Express Coach',
          description: 'Direct transit across Atal Setu with zero railway transfers, avoiding peak station bottlenecks.',
          totalTimeMin: baseLeast,
          walkingTimeMin: 3,
          walkingDistanceMeters: 200,
          transitModes: ['shuttle', 'walking'],
          crowdRating: 'Low',
          crowdPercentage: 32,
          eta: addMinutes(baseLeast),
          recommendedArrivalWindow: '17:15 - 17:40 (Smooth Ingress)',
          assignedGate: 'Gate 2 (Express Pass)',
          co2SavedKg: 3.1,
          steps: [
            {
              instruction: 'Board MTHL Event Express from Vashi Sector 17 Depot',
              mode: 'shuttle',
              durationMin: baseLeast - 4,
              distanceMeters: 18500
            },
            {
              instruction: 'Direct disembarkation at Gate 2 covered pedestrian walkway',
              mode: 'walking',
              durationMin: 3,
              distanceMeters: 200
            }
          ]
        },
        {
          id: 'opt_fastest',
          tier: 'fastest',
          title: 'Harbour Line to Kurla + E-Shuttle',
          description: 'Suburban train connection via Kurla interchange with priority gate entry.',
          totalTimeMin: baseFastest,
          walkingTimeMin: 5,
          walkingDistanceMeters: 380,
          transitModes: ['rail', 'shuttle', 'walking'],
          crowdRating: isSurge ? 'Heavy' : 'Moderate',
          crowdPercentage: isSurge ? 75 : 60,
          eta: addMinutes(baseFastest),
          recommendedArrivalWindow: '17:20 - 17:45',
          assignedGate: 'Gate 1 (Central Plaza)',
          co2SavedKg: 2.6,
          steps: [
            {
              instruction: 'Board Harbour Line local from Vashi Station to Kurla Platform 7',
              mode: 'rail',
              durationMin: 16,
              distanceMeters: 14200
            },
            {
              instruction: 'Board high-frequency electric shuttle at Kurla East Depot',
              mode: 'shuttle',
              durationMin: 7,
              distanceMeters: 2400
            },
            {
              instruction: 'Walk into Gate 1 security lane',
              mode: 'walking',
              durationMin: 3,
              distanceMeters: 220
            }
          ]
        },
        {
          id: 'opt_accessible',
          tier: 'accessible',
          title: 'NMMT Step-Free AC Electric Bus',
          description: '100% accessible low-floor AC coach with direct wheelchair ramp and assistance staff.',
          totalTimeMin: baseAccessible,
          walkingTimeMin: 2,
          walkingDistanceMeters: 130,
          transitModes: ['bus', 'walking'],
          crowdRating: 'Low',
          crowdPercentage: 38,
          eta: addMinutes(baseAccessible),
          recommendedArrivalWindow: '17:05 - 17:35',
          assignedGate: 'Gate 3 (Accessible Dedicated Pavilion)',
          co2SavedKg: 2.3,
          steps: [
            {
              instruction: 'Board low-floor NMMT AC Electric Bus from Vashi Highway Terminal',
              mode: 'bus',
              durationMin: baseAccessible - 4,
              distanceMeters: 17800
            },
            {
              instruction: 'Tactile paving ramp access into Gate 3 Accessible Pavilion',
              mode: 'walking',
              durationMin: 2,
              distanceMeters: 130
            }
          ]
        }
      ];
    }

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
