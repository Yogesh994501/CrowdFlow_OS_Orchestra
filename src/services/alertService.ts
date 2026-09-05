import { OperationalAlert } from '../types';

export interface IncidentResponsePlan {
  alertId: string;
  title: string;
  severity: string;
  leadAgency: string;
  executiveSummary: string;
  immediateActions: string[];
  secondaryActions: string[];
  requiredResources: string[];
  attendeeAdvisoryMessage: string;
  expectedResolutionTime: string;
}

export class AlertService {
  private static instance: AlertService;

  public static getInstance(): AlertService {
    if (!AlertService.instance) {
      AlertService.instance = new AlertService();
    }
    return AlertService.instance;
  }

  public getInitialAlerts(): OperationalAlert[] {
    return [
      {
        id: 'alt_01',
        timestamp: '18:12:05',
        zoneId: 'bkc',
        zoneName: 'Bandra-Kurla Complex',
        severity: 'critical',
        title: 'BKC Hospitality Saturation Approaching Critical Threshold',
        message: 'BKC hotels likely to exceed 96% occupancy by 18:30. Only 54 total standard rooms remain across the entire G-Block district.',
        cause: 'High density of VIP delegates arriving ahead of plenary session combined with delayed checkouts.',
        confidence: 94,
        recommendedAction: 'Redirect 18% of incoming arrivals toward Goregaon Nesco buffer & Navi Mumbai express stays.',
        acknowledged: false,
        assignedOwner: 'Hospitality Taskforce Lead',
        status: 'active'
      },
      {
        id: 'alt_02',
        timestamp: '18:09:40',
        zoneId: 'dadar',
        zoneName: 'Dadar Transit Core',
        severity: 'critical',
        title: 'Dadar Station Footbridge & Platform Density Exceeds Safety Margin',
        message: 'Dadar station predicted to exceed safe platform threshold after 19:15 as Western and Central lines discharge simultaneously.',
        cause: 'Peak commuter hour overlaps with event surge. Stairway 3 bottlenecking.',
        confidence: 91,
        recommendedAction: 'Inject 6 dedicated electric express shuttles between Dadar East and BKC MMRDA Gate.',
        acknowledged: true,
        assignedOwner: 'Mumbai Central Railway Ops',
        status: 'in_progress'
      },
      {
        id: 'alt_03',
        timestamp: '18:06:15',
        zoneId: 'bkc',
        zoneName: 'Bandra-Kurla Complex',
        severity: 'high',
        title: 'Jio World Convention Centre Gate 1 Queue Surge',
        message: 'Venue Gate 1 queue is growing 18% faster than expected model. Wait time now 32 minutes with 1,400 attendees queuing on the plaza.',
        cause: 'Metal detector lane 4 recalibration and bag check friction.',
        confidence: 89,
        recommendedAction: 'Open overflow Gate 2 (Express Pass) to general attendees and broadcast mobile app nudge.',
        acknowledged: false,
        assignedOwner: 'Venue Security Operations',
        status: 'active'
      },
      {
        id: 'alt_04',
        timestamp: '18:02:50',
        zoneId: 'churchgate',
        zoneName: 'Churchgate & Fort',
        severity: 'high',
        title: 'Coastal Wind & Evening Rain Probability Elevated',
        message: 'Open-Meteo sensors indicate wind gusts up to 38 km/h and rain probability at 78% during the stadium exit window.',
        cause: 'Arabian Sea localized low-pressure depression advancing eastward.',
        confidence: 86,
        recommendedAction: 'Pre-position covered boarding buses and extend pedestrian awning deployers along Marine Drive.',
        acknowledged: false,
        assignedOwner: 'Disaster Management Cell',
        status: 'active'
      },
      {
        id: 'alt_05',
        timestamp: '17:58:30',
        zoneId: 'andheri',
        zoneName: 'Andheri West & East',
        severity: 'medium',
        title: 'Metro Line 1 Ghatkopar Interchange Congestion',
        message: 'High dwell times at Western Express Highway station causing 6-minute ripple delays on Line 1 heading toward BKC.',
        cause: 'Ticket barrier card reader validation delay during heavy baggage transit.',
        confidence: 82,
        recommendedAction: 'Open emergency free-flow QR validation gates to clear concourse.',
        acknowledged: true,
        assignedOwner: 'Mumbai Metro One Ops',
        status: 'in_progress'
      },
      {
        id: 'alt_06',
        timestamp: '17:54:10',
        zoneId: 'goregaon',
        zoneName: 'Goregaon Hub',
        severity: 'medium',
        title: 'Western Express Highway Santacruz Flyover Inbound Slowdown',
        message: 'Traffic speed dropped to 14 km/h approaching Kalanagar junction due to rideshare drop-off clustering.',
        cause: 'Unregulated passenger alighting along curbside near BKC entry arch.',
        confidence: 88,
        recommendedAction: 'Enforce dedicated geofenced drop-off zone at Asian Heart Institute parking lot.',
        acknowledged: true,
        assignedOwner: 'Mumbai Traffic Police',
        status: 'in_progress'
      },
      {
        id: 'alt_07',
        timestamp: '17:49:00',
        zoneId: 'navi_mumbai',
        zoneName: 'Navi Mumbai',
        severity: 'info',
        title: 'Navi Mumbai Buffer Operating at High Reserve Availability',
        message: 'Vashi and Belapur accommodation hubs report 52% free capacity with zero transit congestion on Atal Setu connector.',
        cause: 'Low initial awareness among regional travelers arriving via Pune Expressway.',
        confidence: 96,
        recommendedAction: 'Issue dynamic ₹400 ride credit voucher to attendees choosing Navi Mumbai hotels.',
        acknowledged: false,
        assignedOwner: 'Attendee Experience Team',
        status: 'active'
      },
      {
        id: 'alt_08',
        timestamp: '17:44:20',
        zoneId: 'virar',
        zoneName: 'Virār & Vasai Buffer',
        severity: 'info',
        title: 'Virār Express Western Railway Service Frequency Doubled',
        message: 'Western Railway has added 4 additional 15-car non-stop specials from Virār to Bandra, cutting transit headway to 8 minutes.',
        cause: 'Scheduled mega-event rapid transit timetable activation.',
        confidence: 99,
        recommendedAction: 'Maintain current passenger flow and keep attendee guidance displays active.',
        acknowledged: true,
        assignedOwner: 'Western Railway Control',
        status: 'resolved'
      },
      {
        id: 'alt_09',
        timestamp: '17:40:05',
        zoneId: 'bkc',
        zoneName: 'Bandra-Kurla Complex',
        severity: 'high',
        title: 'Food Court & Dining Pressure Exceeds 92% in G-Block',
        message: 'Wait times at all 14 quick-service dining clusters around MMRDA Grounds exceed 28 minutes.',
        cause: 'Early dinner rush before main opening ceremony.',
        confidence: 85,
        recommendedAction: 'Dispatch 6 mobile culinary trucks to North Concourse and push dining discounts for off-site eateries.',
        acknowledged: false,
        assignedOwner: 'Hospitality Ops',
        status: 'active'
      },
      {
        id: 'alt_10',
        timestamp: '17:35:50',
        zoneId: 'thane',
        zoneName: 'Thane Metropolitan',
        severity: 'info',
        title: 'Thane Park-and-Ride Deck 2 Reaches 65% Capacity',
        message: '1,800 spaces remaining at Viviana Event Feeder Parking. Feeder buses departing every 6 minutes.',
        cause: 'Smooth transfer of attendees arriving from Nashik & Pune highways.',
        confidence: 95,
        recommendedAction: 'Continue digital signage guidance along Eastern Express Highway.',
        acknowledged: true,
        assignedOwner: 'Thane Municipal Corporation',
        status: 'resolved'
      }
    ];
  }

  public generateIncidentResponsePlan(alert: OperationalAlert): IncidentResponsePlan {
    let leadAgency = 'City Incident Coordination Team';
    let summary = '';
    const immediateActions: string[] = [];
    const secondaryActions: string[] = [];
    const requiredResources: string[] = [];
    let attendeeAdvisory = '';
    let resolutionTime = '25 - 40 minutes';

    if (alert.zoneId === 'bkc') {
      leadAgency = 'BKC Unified Incident Command & MMRDA Operations';
      summary = `Urgent capacity and flow mitigation for Bandra-Kurla Complex in response to: "${alert.title}". Immediate load redistribution is required to prevent compound failure across transit corridors and venue concourses.`;
      immediateActions.push('Broadcast dynamic attendee route diversion through the mobile Attendee Portal.');
      immediateActions.push('Authorize activation of 500 reserve emergency beds at NESCO Goregaon Annex.');
      immediateActions.push('Open secondary security lanes at Jio World Convention Centre Gate 2 and Gate 3.');
      secondaryActions.push('Deploy 8 BEST electric high-capacity double-decker buses for direct express shuttle to Dadar/Andheri.');
      secondaryActions.push('Coordinate with Mumbai Police for green-corridor priority for outbound attendee shuttles.');
      requiredResources.push('12 Senior Event Marshals', '8 Electric Buses', '500 Pre-staged Dorm Beds', '3 Mobile Digital Signage Trailers');
      attendeeAdvisory = 'BKC Notice: To avoid delays at main gates, please use Gate 2 (Express) or explore nearby dining at Asian Heart Plaza.';
      resolutionTime = '30 minutes';
    } else if (alert.zoneId === 'dadar') {
      leadAgency = 'Mumbai Central Railway & Traffic Police Joint Operations';
      summary = `Critical passenger flow stabilization at Dadar interchange concourse. Preventing stampede risk and platform overcrowding following: "${alert.title}".`;
      immediateActions.push('Implement metered holding queues on footbridge 2 to prevent platform stair overfilling.');
      immediateActions.push('Divert arriving BKC-bound passengers directly to street-level express feeder buses.');
      immediateActions.push('Sound automated platform safety announcements in Hindi, Marathi, and English every 90 seconds.');
      secondaryActions.push('Request Central Railway to increase fast local train halt duration by 45 seconds for safer detraining.');
      secondaryActions.push('Activate standby medical team at Platform 4 Station Master office.');
      requiredResources.push('24 Railway Protection Force (RPF) Officers', '6 Street Shuttles', '2 Paramedic Teams');
      attendeeAdvisory = 'Dadar Transit Advisory: Please follow ground marshals to Street Exit 4 for direct event shuttles. Avoid Footbridge 2.';
      resolutionTime = '20 minutes';
    } else {
      leadAgency = 'Mumbai Disaster Management & Civic Transport Authority';
      summary = `Operational mitigation protocol activated for ${alert.zoneName}: "${alert.title}". Resource coordination deployed to ensure attendee comfort and safety.`;
      immediateActions.push('Initiate field team verification and live sensor check.');
      immediateActions.push('Update dynamic navigation feeds to reflect localized conditions.');
      secondaryActions.push('Log incident telemetry in the operations central event registry.');
      requiredResources.push('6 Municipal Operations Staff', '2 Standby Transport Units');
      attendeeAdvisory = `Update for ${alert.zoneName}: Normal event operations continue with guided marshaling assistance.`;
      resolutionTime = '15 - 25 minutes';
    }

    return {
      alertId: alert.id,
      title: alert.title,
      severity: alert.severity.toUpperCase(),
      leadAgency,
      executiveSummary: summary,
      immediateActions,
      secondaryActions,
      requiredResources,
      attendeeAdvisoryMessage: attendeeAdvisory,
      expectedResolutionTime: resolutionTime
    };
  }
}

export const alertService = AlertService.getInstance();
