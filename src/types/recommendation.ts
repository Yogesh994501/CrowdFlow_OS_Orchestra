import type { UserRole } from './index';

export interface SignalBreakdown {
  signalName: string;
  weightPct: number;
  value: string;
  description: string;
}

export interface Intervention {
  id: string;
  title: string;
  category: 'accommodation_redirect' | 'transit_surge' | 'gate_throttle' | 'incentive_push' | 'route_diversion';
  targetZoneId: string;
  targetZoneName: string;
  why: string;
  signals: SignalBreakdown[];
  confidencePct: number;
  expectedImpact: string;
  predictedPressureReduction: number;
  tradeOffs: string[];
  alternativeOption: string;
  status: 'pending' | 'approved' | 'executing' | 'completed' | 'rejected';
  approvedBy?: UserRole;
  approvedAt?: string;
  createdAt: string;
  executionProgressPct: number;
}
