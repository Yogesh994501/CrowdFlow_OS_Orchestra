export type PressureStatus = 'stable' | 'watch' | 'high' | 'critical';

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
