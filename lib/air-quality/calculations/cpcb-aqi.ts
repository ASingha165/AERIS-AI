import { AQICategory, PollutantType, CPCB_AQI_Result, AQISubIndex, ObservationMetric } from '@/types/air-quality';
import { CPCB_BREAKPOINTS, CPCB_CATEGORIES } from '../constants/cpcb-breakpoints';
import { POLLUTANT_METADATA } from '../constants/pollutant-metadata';

/**
 * Calculates pollutant sub-index based on CPCB piecewise linear interpolation formula:
 * I_p = ((I_Hi - I_Lo) / (B_Hi - B_Lo)) * (C_p - B_Lo) + I_Lo
 * 
 * Where:
 * B_Hi = Breakpoint concentration greater than or equal to given concentration
 * B_Lo = Breakpoint concentration less than or equal to given concentration
 * I_Hi = AQI value corresponding to B_Hi
 * I_Lo = AQI value corresponding to B_Lo
 * C_p  = Actual pollutant concentration
 */
export function calculateSubIndex(
  pollutant: PollutantType,
  concentration: number,
  _unit?: string
): number | null {
  if (concentration === null || concentration === undefined || isNaN(concentration) || concentration < 0) {
    return null;
  }

  const breakpoints = CPCB_BREAKPOINTS[pollutant];
  if (!breakpoints || breakpoints.length === 0) {
    return null;
  }

  // Check if exceeds maximum severe breakpoint
  const maxBreakpoint = breakpoints[breakpoints.length - 1];
  if (concentration >= maxBreakpoint.bHigh) {
    return 500; // CPCB AQI is capped at 500
  }

  // Find matching breakpoint interval
  for (const bp of breakpoints) {
    if (concentration >= bp.bLow && concentration <= bp.bHigh) {
      const bDiff = bp.bHigh - bp.bLow;
      if (bDiff === 0) return bp.iLow;

      const subIndex =
        ((bp.iHigh - bp.iLow) / bDiff) * (concentration - bp.bLow) + bp.iLow;
      return Math.round(subIndex);
    }
  }

  return null;
}

/**
 * Maps an AQI number to its official Indian CPCB category.
 */
export function getCPCBCategory(aqi: number): AQICategory {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Satisfactory';
  if (aqi <= 200) return 'Moderately Polluted';
  if (aqi <= 300) return 'Poor';
  if (aqi <= 400) return 'Very Poor';
  return 'Severe';
}

export interface OverallAQIInput {
  concentrations: Partial<Record<PollutantType, number>>;
  isAveragedPeriod: boolean; // Must be true for official NAQI (24-hr for PM/NO2/SO2, 8-hr for CO/O3)
}

export type AQIInputType =
  | OverallAQIInput
  | Partial<Record<PollutantType, ObservationMetric>>
  | Partial<Record<PollutantType, number>>;

/**
 * Calculates overall CPCB National AQI following official rules:
 * 1. At least three pollutants must have valid data.
 * 2. At least one of the three must be either PM2.5 or PM10.
 * 3. The overall AQI is the maximum of the calculated sub-indices.
 * 4. If observations are purely instantaneous/single-hour, official AQI cannot be certified.
 */
export function calculateOverallAQI(
  input: AQIInputType,
  options?: { hasFull24HourHistory?: boolean; isAveragedPeriod?: boolean }
): CPCB_AQI_Result {
  const subIndices: Partial<Record<PollutantType, AQISubIndex>> = {};
  let maxSubIndex = -1;
  let dominantPollutant: PollutantType | null = null;

  let concentrationsMap: Partial<Record<PollutantType, number>> = {};
  let isAveraged = false;

  if (
    input &&
    'concentrations' in input &&
    typeof (input as any).concentrations === 'object' &&
    (input as any).concentrations !== null
  ) {
    concentrationsMap = (input as OverallAQIInput).concentrations;
    isAveraged = !!(input as OverallAQIInput).isAveragedPeriod;
  } else if (input && typeof input === 'object') {
    for (const [key, val] of Object.entries(input)) {
      if (val !== undefined && val !== null) {
        if (typeof val === 'number') {
          concentrationsMap[key as PollutantType] = val;
        } else if (typeof val === 'object' && 'value' in val) {
          concentrationsMap[key as PollutantType] = (val as ObservationMetric).value;
        }
      }
    }
  }

  if (options) {
    if (options.hasFull24HourHistory !== undefined) isAveraged = options.hasFull24HourHistory;
    if (options.isAveragedPeriod !== undefined) isAveraged = options.isAveragedPeriod;
  }

  for (const [key, conc] of Object.entries(concentrationsMap)) {
    const pollutant = key as PollutantType;
    if (conc !== undefined && conc !== null) {
      const subIndexVal = calculateSubIndex(pollutant, conc);
      if (subIndexVal !== null) {
        const cat = getCPCBCategory(subIndexVal);
        const meta = POLLUTANT_METADATA[pollutant];
        subIndices[pollutant] = {
          pollutant,
          value: subIndexVal,
          concentration: conc,
          unit: meta ? meta.standardUnit : 'µg/m³',
          category: cat,
          averagingPeriodHours: meta ? meta.averagingPeriodHours : 24,
        };

        if (subIndexVal > maxSubIndex) {
          maxSubIndex = subIndexVal;
          dominantPollutant = pollutant;
        }
      }
    }
  }

  const validPollutants = Object.keys(subIndices) as PollutantType[];
  const qualifyingCount = validPollutants.length;
  const hasPM = validPollutants.includes('PM2.5') || validPollutants.includes('PM10');

  // Check CPCB mandatory qualification criteria: At least 3 qualifying pollutants
  if (qualifyingCount < 3) {
    return {
      value: maxSubIndex >= 0 ? maxSubIndex : null,
      category: maxSubIndex >= 0 ? getCPCBCategory(maxSubIndex) : null,
      standard: 'INDIA_CPCB_NAQI',
      status: 'INSUFFICIENT_DATA',
      dominantPollutant,
      statusReason: `CPCB criteria require data for at least 3 qualifying pollutants (received ${qualifyingCount}). At least 3 qualifying pollutants are required. Individual sub-indices are displayed.`,
      subIndices,
      qualifyingPollutantsCount: qualifyingCount,
      hasParticulateMatter: hasPM,
    };
  }

  // Check CPCB mandatory qualification criteria: At least one PM pollutant
  if (!hasPM) {
    return {
      value: maxSubIndex >= 0 ? maxSubIndex : null,
      category: maxSubIndex >= 0 ? getCPCBCategory(maxSubIndex) : null,
      standard: 'INDIA_CPCB_NAQI',
      status: 'INSUFFICIENT_DATA',
      dominantPollutant,
      statusReason: 'At least one particulate pollutant (PM2.5 or PM10) is mandatory under official CPCB NAQI criteria to compute official AQI.',
      subIndices,
      qualifyingPollutantsCount: qualifyingCount,
      hasParticulateMatter: false,
    };
  }

  // Check statutory averaging period
  if (!isAveraged) {
    return {
      value: maxSubIndex,
      category: getCPCBCategory(maxSubIndex),
      standard: 'INDIA_CPCB_NAQI',
      status: 'INSUFFICIENT_DATA',
      dominantPollutant,
      statusReason: 'Indicative sub-index displayed. Awaiting statutory 24-hour statutory averaging (mandated by CPCB for PM/NO2/SO2 and 8-hr for CO/O3).',
      subIndices,
      qualifyingPollutantsCount: qualifyingCount,
      hasParticulateMatter: true,
    };
  }

  // All criteria satisfied: Full official NAQI
  return {
    value: maxSubIndex,
    category: getCPCBCategory(maxSubIndex),
    standard: 'INDIA_CPCB_NAQI',
    status: 'CALCULATED',
    dominantPollutant,
    statusReason: `Official CPCB NAQI computed from ${qualifyingCount} qualifying monitored pollutants.`,
    subIndices,
    qualifyingPollutantsCount: qualifyingCount,
    hasParticulateMatter: true,
  };
}
