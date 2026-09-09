/**
 * Deterministic Temporal Prediction Engine
 * Provides hand-authored keyframes across 5 discrete time-steps (0–180 minutes)
 * with continuous easeInOutCubic interpolation for reliable, repeatable demo data.
 */

export const TIME_STEP_MINUTES = [0, 30, 60, 120, 180] as const;
export type TimeStepIndex = 0 | 1 | 2 | 3 | 4;

export interface ZoneKeyframes {
  pressure: [number, number, number, number, number];          // 0–100 score
  arrivals: [number, number, number, number, number];          // arrivals / min
  transitCongestion: [number, number, number, number, number]; // 0–100 load %
}

export type ScenarioId = 
  | 'normal' 
  | 'heavy_rain' 
  | 'metro_disruption' 
  | 'hotel_saturation' 
  | 'gate_closure' 
  | 'demand_surge';

export type ZoneId = 
  | 'bkc' 
  | 'colaba' 
  | 'dadar' 
  | 'andheri' 
  | 'bandra' 
  | 'kurla' 
  | 'lower_parel' 
  | 'navi_mumbai';

export const SURGE_THRESHOLD = 75;

// Hand-authored deterministic keyframes per zone, per scenario:
// Indices: [0m (NOW), 30m (+30m), 60m (+1h), 120m (+2h), 180m (+3h)]
export const SCENARIO_TIMELINES: Record<ScenarioId, Record<ZoneId, ZoneKeyframes>> = {
  normal: {
    bkc: {
      pressure: [42, 46, 52, 45, 38],
      arrivals: [140, 165, 185, 150, 120],
      transitCongestion: [40, 48, 55, 46, 35]
    },
    colaba: {
      pressure: [32, 35, 38, 36, 30],
      arrivals: [90, 100, 115, 100, 85],
      transitCongestion: [30, 34, 40, 35, 28]
    },
    dadar: {
      pressure: [48, 52, 58, 50, 42],
      arrivals: [210, 230, 260, 220, 180],
      transitCongestion: [55, 60, 68, 58, 48]
    },
    andheri: {
      pressure: [45, 48, 54, 47, 40],
      arrivals: [180, 200, 225, 190, 160],
      transitCongestion: [50, 55, 62, 52, 42]
    },
    bandra: {
      pressure: [38, 42, 48, 41, 35],
      arrivals: [130, 150, 175, 145, 120],
      transitCongestion: [42, 48, 54, 45, 36]
    },
    kurla: {
      pressure: [44, 49, 56, 48, 39],
      arrivals: [160, 185, 210, 175, 140],
      transitCongestion: [48, 54, 64, 53, 40]
    },
    lower_parel: {
      pressure: [36, 40, 45, 39, 32],
      arrivals: [110, 125, 145, 120, 100],
      transitCongestion: [38, 44, 50, 42, 34]
    },
    navi_mumbai: {
      pressure: [28, 32, 36, 33, 27],
      arrivals: [95, 110, 130, 105, 85],
      transitCongestion: [25, 30, 36, 30, 24]
    }
  },

  heavy_rain: {
    bkc: {
      pressure: [55, 72, 91, 84, 62],
      arrivals: [180, 240, 310, 260, 170],
      transitCongestion: [58, 76, 94, 86, 60]
    },
    colaba: {
      pressure: [38, 46, 56, 50, 42],
      arrivals: [100, 120, 140, 125, 105],
      transitCongestion: [38, 48, 62, 54, 44]
    },
    dadar: {
      pressure: [62, 78, 92, 85, 65],
      arrivals: [240, 310, 380, 320, 230],
      transitCongestion: [68, 85, 96, 88, 66]
    },
    andheri: {
      pressure: [56, 70, 84, 76, 58],
      arrivals: [210, 270, 330, 280, 200],
      transitCongestion: [62, 78, 90, 80, 60]
    },
    bandra: {
      pressure: [48, 60, 74, 66, 50],
      arrivals: [150, 195, 245, 205, 155],
      transitCongestion: [52, 68, 80, 70, 52]
    },
    kurla: {
      pressure: [58, 74, 88, 80, 60],
      arrivals: [190, 250, 320, 270, 190],
      transitCongestion: [60, 78, 92, 82, 62]
    },
    lower_parel: {
      pressure: [44, 55, 68, 60, 46],
      arrivals: [130, 165, 205, 175, 135],
      transitCongestion: [46, 60, 72, 64, 48]
    },
    navi_mumbai: {
      pressure: [34, 42, 52, 46, 38],
      arrivals: [110, 135, 165, 140, 115],
      transitCongestion: [32, 42, 54, 46, 35]
    }
  },

  metro_disruption: {
    bkc: {
      pressure: [48, 65, 87, 78, 54],
      arrivals: [160, 220, 290, 240, 160],
      transitCongestion: [65, 84, 98, 88, 62]
    },
    colaba: {
      pressure: [34, 38, 44, 40, 32],
      arrivals: [95, 110, 125, 110, 90],
      transitCongestion: [32, 38, 46, 40, 30]
    },
    dadar: {
      pressure: [65, 84, 96, 88, 66],
      arrivals: [260, 340, 420, 350, 250],
      transitCongestion: [74, 92, 99, 90, 70]
    },
    andheri: {
      pressure: [60, 76, 91, 82, 62],
      arrivals: [230, 300, 370, 310, 220],
      transitCongestion: [70, 88, 97, 86, 65]
    },
    bandra: {
      pressure: [44, 55, 70, 62, 46],
      arrivals: [140, 180, 225, 190, 145],
      transitCongestion: [50, 64, 78, 68, 50]
    },
    kurla: {
      pressure: [54, 70, 86, 76, 56],
      arrivals: [180, 240, 300, 250, 180],
      transitCongestion: [58, 76, 92, 80, 58]
    },
    lower_parel: {
      pressure: [40, 50, 62, 54, 40],
      arrivals: [120, 150, 185, 155, 120],
      transitCongestion: [42, 54, 68, 58, 42]
    },
    navi_mumbai: {
      pressure: [30, 36, 44, 38, 30],
      arrivals: [100, 120, 145, 125, 100],
      transitCongestion: [28, 36, 46, 38, 28]
    }
  },

  hotel_saturation: {
    bkc: {
      pressure: [52, 68, 86, 80, 58],
      arrivals: [160, 200, 250, 210, 150],
      transitCongestion: [46, 58, 70, 60, 44]
    },
    colaba: {
      pressure: [48, 64, 82, 75, 54],
      arrivals: [130, 170, 215, 180, 130],
      transitCongestion: [44, 56, 72, 62, 44]
    },
    dadar: {
      pressure: [54, 68, 84, 76, 56],
      arrivals: [220, 270, 330, 280, 210],
      transitCongestion: [58, 70, 82, 72, 56]
    },
    andheri: {
      pressure: [50, 65, 80, 72, 52],
      arrivals: [190, 240, 295, 250, 185],
      transitCongestion: [54, 66, 78, 68, 50]
    },
    bandra: {
      pressure: [46, 60, 76, 68, 48],
      arrivals: [145, 185, 235, 195, 140],
      transitCongestion: [48, 60, 72, 62, 46]
    },
    kurla: {
      pressure: [48, 62, 78, 70, 50],
      arrivals: [170, 215, 265, 225, 165],
      transitCongestion: [50, 62, 74, 64, 48]
    },
    lower_parel: {
      pressure: [45, 58, 74, 66, 46],
      arrivals: [125, 160, 200, 170, 125],
      transitCongestion: [44, 56, 68, 58, 44]
    },
    navi_mumbai: {
      pressure: [36, 46, 58, 50, 36],
      arrivals: [110, 140, 175, 145, 110],
      transitCongestion: [32, 42, 52, 44, 32]
    }
  },

  gate_closure: {
    bkc: {
      pressure: [58, 76, 94, 85, 60],
      arrivals: [170, 230, 300, 250, 165],
      transitCongestion: [50, 65, 82, 70, 50]
    },
    colaba: {
      pressure: [35, 40, 48, 42, 34],
      arrivals: [95, 110, 130, 115, 95],
      transitCongestion: [32, 38, 48, 40, 32]
    },
    dadar: {
      pressure: [52, 64, 76, 68, 50],
      arrivals: [220, 260, 310, 270, 205],
      transitCongestion: [58, 68, 78, 70, 54]
    },
    andheri: {
      pressure: [48, 58, 70, 62, 46],
      arrivals: [190, 225, 270, 230, 180],
      transitCongestion: [52, 62, 72, 64, 48]
    },
    bandra: {
      pressure: [45, 56, 72, 64, 46],
      arrivals: [140, 175, 220, 185, 135],
      transitCongestion: [46, 58, 70, 60, 44]
    },
    kurla: {
      pressure: [50, 64, 80, 70, 52],
      arrivals: [170, 210, 260, 220, 160],
      transitCongestion: [52, 66, 78, 68, 50]
    },
    lower_parel: {
      pressure: [38, 46, 56, 48, 36],
      arrivals: [115, 135, 165, 140, 110],
      transitCongestion: [40, 48, 58, 50, 38]
    },
    navi_mumbai: {
      pressure: [30, 36, 44, 38, 30],
      arrivals: [100, 120, 145, 125, 100],
      transitCongestion: [28, 36, 46, 38, 28]
    }
  },

  demand_surge: {
    bkc: {
      pressure: [50, 70, 93, 86, 64],
      arrivals: [190, 270, 360, 300, 190],
      transitCongestion: [54, 72, 90, 80, 58]
    },
    colaba: {
      pressure: [40, 52, 66, 58, 44],
      arrivals: [120, 155, 195, 160, 125],
      transitCongestion: [38, 50, 64, 54, 40]
    },
    dadar: {
      pressure: [58, 75, 93, 84, 62],
      arrivals: [250, 330, 410, 340, 240],
      transitCongestion: [65, 82, 95, 84, 62]
    },
    andheri: {
      pressure: [52, 68, 86, 76, 56],
      arrivals: [210, 280, 350, 290, 205],
      transitCongestion: [58, 74, 88, 78, 56]
    },
    bandra: {
      pressure: [46, 62, 78, 70, 50],
      arrivals: [155, 205, 265, 215, 150],
      transitCongestion: [50, 66, 80, 70, 50]
    },
    kurla: {
      pressure: [52, 68, 85, 75, 54],
      arrivals: [185, 245, 315, 260, 180],
      transitCongestion: [54, 70, 86, 76, 54]
    },
    lower_parel: {
      pressure: [42, 56, 70, 62, 44],
      arrivals: [130, 170, 220, 180, 130],
      transitCongestion: [44, 58, 72, 62, 44]
    },
    navi_mumbai: {
      pressure: [34, 44, 56, 48, 36],
      arrivals: [115, 145, 180, 150, 120],
      transitCongestion: [30, 40, 52, 42, 32]
    }
  }
};

/**
 * Smooth cubic easing for natural crowd flow progression.
 */
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Continuous interpolation across 5 keyframe values (0–180 minutes).
 */
export function getInterpolatedMetric(
  keyframes: [number, number, number, number, number],
  scrubMinutes: number
): number {
  const clampedMinutes = Math.max(0, Math.min(180, scrubMinutes));
  
  // Find which interval contains clampedMinutes
  let idx = 0;
  while (idx < TIME_STEP_MINUTES.length - 1 && clampedMinutes > TIME_STEP_MINUTES[idx + 1]) {
    idx++;
  }
  
  const lowerIdx = idx;
  const upperIdx = Math.min(TIME_STEP_MINUTES.length - 1, idx + 1);
  const lowerT = TIME_STEP_MINUTES[lowerIdx];
  const upperT = TIME_STEP_MINUTES[upperIdx];
  
  if (upperT === lowerT) {
    return keyframes[lowerIdx];
  }
  
  const rawFraction = (clampedMinutes - lowerT) / (upperT - lowerT);
  const eased = easeInOutCubic(rawFraction);
  const val = keyframes[lowerIdx] + (keyframes[upperIdx] - keyframes[lowerIdx]) * eased;
  
  return Math.round(val * 10) / 10;
}

/**
 * Retrieve projected metrics for a specific zone under a scenario at a continuous time offset.
 * Gracefully degrades to the 'normal' scenario if the requested scenario or zone is missing.
 */
export function getProjectedZoneTelemetry(
  scenario: ScenarioId,
  zoneId: string,
  scrubMinutes: number
): { pressure: number; arrivals: number; transitCongestion: number } {
  const safeScenario = SCENARIO_TIMELINES[scenario] ? scenario : 'normal';
  const normZoneKey = (zoneId.toLowerCase().replace(/[\s-]/g, '_')) as ZoneId;
  const scenarioData = SCENARIO_TIMELINES[safeScenario][normZoneKey] 
    || SCENARIO_TIMELINES['normal'][normZoneKey] 
    || SCENARIO_TIMELINES['normal']['bkc'];

  return {
    pressure: Math.round(getInterpolatedMetric(scenarioData.pressure, scrubMinutes)),
    arrivals: Math.round(getInterpolatedMetric(scenarioData.arrivals, scrubMinutes)),
    transitCongestion: Math.round(getInterpolatedMetric(scenarioData.transitCongestion, scrubMinutes))
  };
}

/**
 * Determines whether the active surge banner should trigger at the given scrub time.
 */
export function checkSurgeActive(scenario: ScenarioId, scrubMinutes: number): boolean {
  const bkcTelemetry = getProjectedZoneTelemetry(scenario, 'bkc', scrubMinutes);
  const dadarTelemetry = getProjectedZoneTelemetry(scenario, 'dadar', scrubMinutes);
  return bkcTelemetry.pressure >= SURGE_THRESHOLD || dadarTelemetry.pressure >= SURGE_THRESHOLD;
}
