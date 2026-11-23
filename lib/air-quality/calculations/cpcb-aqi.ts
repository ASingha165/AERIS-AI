import { AQICategory, PollutantType, CPCB_AQI_Result, AQISubIndex, ObservationMetric } from '@/types/air-quality';
import { CPCB_BREAKPOINTS, CPCB_CATEGORIES } from '../constants/cpcb-breakpoints';
import { POLLUTANT_METADATA } from '../constants/pollutant-metadata';

export function calculateSubIndex(
  pollutant: PollutantType,
  concentration: number,
  _unit?: string
): number | null {
  if (concentration === null || concentration === undefined || isNaN(concentration) || concentration < 0) return null;

  const breakpoints = CPCB_BREAKPOINTS[pollutant];
  if (!breakpoints || breakpoints.length === 0) return null;

  const maxBreakpoint = breakpoints[breakpoints.length - 1];
  if (concentration >= maxBreakpoint.bHigh) return 500;

  for (const bp of breakpoints) {
    if (concentration >= bp.bLow && concentration <= bp.bHigh) {
      const bDiff = bp.bHigh - bp.bLow;
      if (bDiff === 0) return bp.iLow;
      const subIndex = ((bp.iHigh - bp.iLow) / bDiff) * (concentration - bp.bLow) + bp.iLow;
      return Math.round(subIndex);
    }
  }

  return null;
}

export function getCPCBCategory(aqi: number): AQICategory {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Satisfactory';
  if (aqi <= 200) return 'Moderately Polluted';
  if (aqi <= 300) return 'Poor';
  if (aqi <= 400) return 'Very Poor';
  return 'Severe';
}

export interface OverallAQIInput {
  /** Concentrations must already be averaged over each pollutant's statutory window. */
  concentrations: Partial<Record<PollutantType, number>>;
  isAveragedPeriod: boolean;
}

export type AQIInputType =
  | OverallAQIInput
  | Partial<Record<PollutantType, ObservationMetric>>
  | Partial<Record<PollutantType, number>>;

export function calculateOverallAQI(
  input: AQIInputType,
  options?: { hasFull24HourHistory?: boolean; isAveragedPeriod?: boolean }
): CPCB_AQI_Result {
  const subIndices: Partial<Record<PollutantType, AQISubIndex>> = {};
  let maxSubIndex = -1;
  let dominantPollutant: PollutantType | null = null;

  let concentrationsMap: Partial<Record<PollutantType, number>> = {};
  let isAveraged = false;

  if (input && 'concentrations' in input && typeof input.concentrations === 'object' && input.concentrations !== null) {
    concentrationsMap = (input as OverallAQIInput).concentrations;
    isAveraged = (input as OverallAQIInput).isAveragedPeriod === true;
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

  if (options?.hasFull24HourHistory !== undefined) isAveraged = options.hasFull24HourHistory;
  if (options?.isAveragedPeriod !== undefined) isAveraged = options.isAveragedPeriod;

  for (const [key, conc] of Object.entries(concentrationsMap)) {
    const pollutant = key as PollutantType;
    if (conc === undefined || conc === null) continue;
    const subIndexVal = calculateSubIndex(pollutant, conc);
    if (subIndexVal === null) continue;

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

  const validPollutants = Object.keys(subIndices) as PollutantType[];
  const qualifyingCount = validPollutants.length;
  const hasPM = validPollutants.includes('PM2.5') || validPollutants.includes('PM10');

  if (qualifyingCount < 3) {
    return {
      value: maxSubIndex >= 0 ? maxSubIndex : null,
      category: maxSubIndex >= 0 ? getCPCBCategory(maxSubIndex) : null,
      standard: 'INDIA_CPCB_NAQI',
      status: 'INSUFFICIENT_DATA',
      dominantPollutant,
      statusReason: `CPCB criteria require data for at least 3 qualifying pollutants (received ${qualifyingCount}). Individual sub-indices are indicative only.`,
      subIndices,
      qualifyingPollutantsCount: qualifyingCount,
      hasParticulateMatter: hasPM,
    };
  }

  if (!hasPM) {
    return {
      value: maxSubIndex >= 0 ? maxSubIndex : null,
      category: maxSubIndex >= 0 ? getCPCBCategory(maxSubIndex) : null,
      standard: 'INDIA_CPCB_NAQI',
      status: 'INSUFFICIENT_DATA',
      dominantPollutant,
      statusReason: 'At least one particulate pollutant (PM2.5 or PM10) is mandatory under CPCB NAQI criteria.',
      subIndices,
      qualifyingPollutantsCount: qualifyingCount,
      hasParticulateMatter: false,
    };
  }

  if (!isAveraged) {
    return {
      value: maxSubIndex,
      category: getCPCBCategory(maxSubIndex),
      standard: 'INDIA_CPCB_NAQI',
      status: 'INSUFFICIENT_DATA',
      dominantPollutant,
      statusReason: 'Indicative sub-index only. CPCB statutory averaging windows have not been verified (24-hour for PM/NO2/SO2; 8-hour for CO/O3).',
      subIndices,
      qualifyingPollutantsCount: qualifyingCount,
      hasParticulateMatter: true,
    };
  }

  return {
    value: maxSubIndex,
    category: getCPCBCategory(maxSubIndex),
    standard: 'INDIA_CPCB_NAQI',
    status: 'CALCULATED',
    dominantPollutant,
    statusReason: `CPCB-methodology NAQI calculated from ${qualifyingCount} qualifying pollutant concentrations. This is not a CPCB-issued certification.`,
    subIndices,
    qualifyingPollutantsCount: qualifyingCount,
    hasParticulateMatter: true,
  };
}
