import { 
  AirQualityResponse, 
  DataFreshness, 
  HourlyForecastPoint, 
  LocationMetadata, 
  ObservationMetric, 
  PollutantType, 
  SourceAttribution 
} from '@/types/air-quality';
import { calculateOverallAQI, calculateSubIndex, getCPCBCategory } from '../calculations/cpcb-aqi';
import { POLLUTANT_METADATA } from '../constants/pollutant-metadata';
import { OpenMeteoResult } from '../providers/open-meteo';
import { OpenAQResult } from '../providers/openaq';
import { FreshnessService } from './freshness-service';

export class NormalizationService {
  /**
   * Synthesize data from OpenAQ (ground observations) and Open-Meteo (modeled forecast)
   * into a standardized, type-safe AirQualityResponse without data leakage or fabrication.
   */
  public static synthesize(
    location: LocationMetadata,
    openaqResult: OpenAQResult,
    openMeteoResult: OpenMeteoResult
  ): AirQualityResponse {
    const observations: Partial<Record<PollutantType, ObservationMetric>> = {};
    const sources: SourceAttribution[] = [];

    // Track provenance
    let stationObservationCount = 0;
    let modeledObservationCount = 0;
    let freshestIso: string | null = null;

    // 1. Ingest physical station observations from OpenAQ if available
    if (openaqResult.available && Object.keys(openaqResult.measurements).length > 0) {
      sources.push(openaqResult.attribution);

      for (const [key, metric] of Object.entries(openaqResult.measurements) as [PollutantType, ObservationMetric][]) {
        observations[key] = metric;
        stationObservationCount++;

        if (!freshestIso || new Date(metric.timestamp) > new Date(freshestIso)) {
          freshestIso = metric.timestamp;
        }
      }
    }

    // 2. For pollutants where physical station telemetry is absent, fill with Open-Meteo current-hour modeled forecast
    if (openMeteoResult.success && openMeteoResult.currentHourPoint) {
      sources.push(openMeteoResult.attribution);
      const current = openMeteoResult.currentHourPoint;

      const candidatePollutants: { type: PollutantType; val: number | null }[] = [
        { type: 'PM2.5', val: current.pm25 },
        { type: 'PM10', val: current.pm10 },
        { type: 'NO2', val: current.no2 },
        { type: 'O3', val: current.o3 },
        { type: 'SO2', val: current.so2 },
        { type: 'CO', val: current.co },
      ];

      for (const candidate of candidatePollutants) {
        // Only supplement if not already present from physical station
        if (!observations[candidate.type] && candidate.val !== null && candidate.val !== undefined) {
          const meta = POLLUTANT_METADATA[candidate.type];
          const subIndex = calculateSubIndex(candidate.type, candidate.val, meta.standardUnit);
          const subCat = subIndex !== null ? getCPCBCategory(subIndex) : null;

          observations[candidate.type] = {
            pollutant: candidate.type,
            fullName: meta.fullName,
            value: candidate.val,
            unit: meta.standardUnit,
            observationType: 'MODELED_FORECAST',
            provider: 'Open-Meteo',
            sourceName: 'Copernicus Atmospheric Reanalysis (Open-Meteo)',
            timestamp: current.time,
            freshness: FreshnessService.getFreshness(current.time),
            averagingHoursExpected: meta.averagingPeriodHours,
            subIndex,
            subIndexCategory: subCat,
          };
          modeledObservationCount++;

          if (!freshestIso || new Date(current.time) > new Date(freshestIso)) {
            freshestIso = current.time;
          }
        }
      }
    }

    // 3. Compute Official Indian CPCB NAQI Result
    // In real telemetry, 24-hour statutory averaging is required for PM/NO2/SO2 and 8-hour for CO/O3.
    // If only instantaneous or partial observations are available, the CPCB algorithm marks status as INSUFFICIENT_DATA
    // with an indicative sub-index and explanatory reason.
    const aqiResult = calculateOverallAQI(observations, {
      hasFull24HourHistory: false, // Explicitly false for instantaneous API snapshots
    });

    // 4. Determine overall system status
    let status: 'LIVE_OBSERVATION' | 'PARTIAL_OBSERVATION' | 'FORECAST_ONLY' | 'UNAVAILABLE';

    if (stationObservationCount > 0 && observations['PM2.5']?.observationType === 'MEASURED_STATION') {
      const pmFreshness = observations['PM2.5']?.freshness;
      status = pmFreshness === 'LIVE' ? 'LIVE_OBSERVATION' : 'PARTIAL_OBSERVATION';
    } else if (stationObservationCount > 0) {
      status = 'PARTIAL_OBSERVATION';
    } else if (modeledObservationCount > 0) {
      status = 'FORECAST_ONLY';
    } else {
      status = 'UNAVAILABLE';
    }

    // 5. Overall freshness
    const overallFreshness = FreshnessService.getFreshness(freshestIso);

    return {
      location,
      observations,
      forecast: openMeteoResult.hourlyForecast,
      aqi: aqiResult,
      sources,
      updatedAt: freshestIso || new Date().toISOString(),
      status,
      freshness: overallFreshness,
    };
  }
}
