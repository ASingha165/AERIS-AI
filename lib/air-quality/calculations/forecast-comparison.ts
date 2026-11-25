import type { HourlyForecastPoint } from '@/types/air-quality';

export interface ComparableModeledHour {
  time: string;
  hour: number;
  pm25: number;
}

/**
 * Compare modeled PM2.5 only. Not AQI, personal exposure, or a safety certification.
 * Reject unsupported, negative, and non-finite pollutant values.
 */
export function compareForecastHours(
  points: HourlyForecastPoint[],
  localDate: string,
): ComparableModeledHour[] {
  return points
    .filter(point => point.time.slice(0, 10) === localDate)
    .filter(point => point.hour >= 6 && point.hour <= 21)
    .filter(point => point.pm25 !== null && Number.isFinite(point.pm25) && point.pm25 >= 0)
    .map(point => ({ time: point.time, hour: point.hour, pm25: point.pm25 as number }))
    .sort((a, b) => a.pm25 - b.pm25 || a.hour - b.hour);
}

export function lowestComparableHour(
  points: HourlyForecastPoint[],
  localDate: string,
): ComparableModeledHour | null {
  const candidates = compareForecastHours(points, localDate);
  return candidates.length >= 3 ? candidates[0] : null;
}
