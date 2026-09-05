import type { PressureStatus } from './zone';

export interface TransitRoute {
  id: string;
  name: string;
  type: 'metro' | 'rail' | 'bus' | 'shuttle';
  origin: string;
  destination: string;
  currentLoad: number; // 0 - 100
  capacityPerHour: number;
  activeVehicles: number;
  delayMinutes: number;
  status: PressureStatus;
  waypoints: [number, number][];
  headwayMin: number;
}

export type RouteStrategy = 'fastest' | 'least_crowded' | 'accessible' | 'emergency_diversion';

export interface RouteOption {
  id: string;
  title: string;
  strategy: RouteStrategy;
  durationMin: number;
  distanceKm: number;
  crowdLevel: 'low' | 'moderate' | 'high';
  modes: string[];
  routeScore: number; // 0 - 100 (lower is better)
  steps: string[];
  highlight: string;
  waypoints?: [number, number][];
}
