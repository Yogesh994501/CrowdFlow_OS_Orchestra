export type AlertSeverity = 'critical' | 'high' | 'watch' | 'monitoring' | 'resolved';

export interface OperationalAlert {
  id: string;
  severity: AlertSeverity;
  title: string;
  timestamp: string;
  impactedZoneId: string;
  impactedZoneName: string;
  message: string;
  rootCause: string;
  confidencePct: number;
  recommendedAction: string;
  assignedOwner: string;
  acknowledged: boolean;
  status: 'active' | 'mitigating' | 'resolved';
  linkedInterventionId?: string;
  impactIfIgnored: string;
  requiredCoordinationRoles: string[];
}
