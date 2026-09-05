export type UserRole = 
  | 'organizer' 
  | 'hotel' 
  | 'transport' 
  | 'restaurant' 
  | 'attendee';

export type PressureStatus = 'stable' | 'watch' | 'high' | 'critical';

export type DemoScenario = 
  | 'normal' 
  | 'hotel_saturation' 
  | 'heavy_rain' 
  | 'metro_disruption' 
  | 'gate_closure' 
  | 'demand_surge';

export type ScreenType = 
  | 'landing' 
  | 'overview' 
  | 'map' 
  | 'capacity' 
  | 'mobility' 
  | 'alerts' 
  | 'interventions' 
  | 'simulation' 
  | 'dependency' 
  | 'operators' 
  | 'attendee';

export interface GateInfo {
  id: string;
  name: string;
  queueTimeMin: number;
  flowRate: number; // attendees per min
  status: PressureStatus;
}

export interface Venue {
  id: string;
  name: string;
  zoneId: string;
  capacity: number;
  currentAttendance: number;
  gates: GateInfo[];
  lat: number;
  lng: number;
}

export interface Zone {
  id: string;
  name: string;
  shortName: string;
  coordinates: [number, number]; // [lat, lng]
  polygon: [number, number][];
  pressureScore: number; // 0 - 100
  status: PressureStatus;
  trend: 'rising' | 'falling' | 'stable';
  activeVisitors: number;
  capacityLimit: number;
  accommodationOccupancy: number; // 0 - 100
  predictedArrivals: number; // raw count
  predictedArrivalsNorm: number; // 0 - 100
  transitLoad: number; // 0 - 100
  venueLoad: number; // 0 - 100
  weatherRisk: number; // 0 - 100
  topContributors: string[];
  topRisk: string;
  recommendedAction: string;
  predictedPeak: string;
}

export interface AccommodationProvider {
  id: string;
  name: string;
  zoneId: string;
  zoneName: string;
  type: 'hotel' | 'hostel' | 'guest_house' | 'dorm' | 'community_stay';
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  predictedCheckins: number;
  pressure: number;
  status: PressureStatus;
  priceBand: '₹' | '₹₹' | '₹₹₹' | '₹₹₹₹';
  pricePerNight: number;
  rating: number;
  travelTimeToVenue: number; // min
  transitAccessScore: number; // 0-100
  safetyScore: number; // 0-100
  crowdScore: number; // 0-100
  amenities: string[];
  address: string;
  lat: number;
  lng: number;
  isEmergencyBuffer?: boolean;
}

export interface TransitRoute {
  id: string;
  name: string;
  type: 'metro' | 'bus' | 'shuttle' | 'rail' | 'walking';
  fromZone: string;
  toZone: string;
  normalTravelTime: number; // min
  currentTravelTime: number; // min
  delayPercentage: number;
  predictedPeakTime: string;
  status: PressureStatus;
  vehiclesActive: number;
  seatsRemaining: number;
  waitTime: number; // min
  nextDeparture: string;
  routeTier: 'fastest' | 'least_crowded' | 'accessible' | 'emergency';
  path: [number, number][];
}

export interface OperationalAlert {
  id: string;
  timestamp: string;
  zoneId: string;
  zoneName: string;
  severity: 'critical' | 'high' | 'medium' | 'info';
  title: string;
  message: string;
  cause: string;
  confidence: number;
  recommendedAction: string;
  acknowledged: boolean;
  assignedOwner: string | null;
  status: 'active' | 'in_progress' | 'resolved';
}

export interface InterventionSignal {
  label: string;
  value: string;
}

export interface Intervention {
  id: string;
  title: string;
  category: 'accommodation' | 'transport' | 'gate' | 'incentive';
  targetZone: string;
  targetZoneName: string;
  actionType: string;
  capacityAdded?: number;
  why: string;
  signals: InterventionSignal[];
  confidence: number; // 0-100
  expectedImpact: string;
  pressureReduction: number;
  tradeOff: string;
  alternative: string;
  status: 'pending' | 'reviewing' | 'approved' | 'executing' | 'completed' | 'rejected';
  assignedOperator: string;
  createdAt: string;
  executedAt?: string;
  beforePressure?: number;
  afterPressure?: number;
  actualImpact?: string;
}

export interface SimulationParams {
  attendanceDelta: number; // -30% to +50%
  weatherCondition: 'clear' | 'light_rain' | 'heavy_rain';
  eventDelayMin: number; // 0 - 180 min
  transitDisruption: 'none' | 'partial' | 'major';
  gateClosure: boolean;
  hotelCapacityLoss: boolean;
  emergencyShuttleAdded: boolean;
}

export interface SimulationResult {
  simulatedPressureAverage: number;
  simulatedCriticalZones: number;
  simulatedTransitDelay: number;
  simulatedQueueTime: number;
  simulatedAccommodationGap: number;
  afterInterventionPressure: number;
  afterInterventionCriticalZones: number;
  narrative: string;
  zoneDeltas: Record<string, number>;
}

export interface AttendeeIncentive {
  id: string;
  title: string;
  reward: string;
  why: string;
  estimatedImpact: string;
  expiry: string;
  gateOrZone: string;
  claimed: boolean;
  code: string;
}

export interface RestaurantProvider {
  id: string;
  name: string;
  zoneId: string;
  seatingCapacity: number;
  currentOccupied: number;
  queueTimeMin: number;
  peakForecast: string;
  mealInventoryPacks: number;
  status: PressureStatus;
}
