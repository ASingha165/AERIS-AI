import { AirQualityResponse, LocationMetadata } from '@/types/air-quality';
import { OpenMeteoProvider, OpenMeteoResult } from '../providers/open-meteo';
import { OpenAQProvider, OpenAQResult } from '../providers/openaq';
import { NormalizationService } from './normalization-service';
import { LocationService } from './location-service';

interface CacheEntry {
  data: AirQualityResponse;
  expiresAt: number;
}

export class AirQualityService {
  private static cache = new Map<string, CacheEntry>();
  private static readonly CACHE_TTL_MS = 10 * 60 * 1000;

  private static getCacheKey(lat: number, lon: number, radiusMeters: number): string {
    // Four decimal places (~11 m latitude precision) avoids merging nearby neighborhoods.
    return `${lat.toFixed(4)}_${lon.toFixed(4)}_${radiusMeters}`;
  }

  public static async getAirQualityData(
    latitude: number,
    longitude: number,
    radiusMeters: number = 25000,
    customLocationName?: string
  ): Promise<AirQualityResponse> {
    const cacheKey = this.getCacheKey(latitude, longitude, radiusMeters);
    const cached = this.cache.get(cacheKey);

    if (cached && cached.expiresAt > Date.now()) return cached.data;

    const location: LocationMetadata = customLocationName
      ? { name: customLocationName, country: 'India', latitude, longitude }
      : LocationService.getNearestPredefinedLocation(latitude, longitude);

    const [openaqSettled, openMeteoSettled] = await Promise.allSettled([
      OpenAQProvider.getNearestObservations(latitude, longitude, radiusMeters),
      OpenMeteoProvider.getForecast(latitude, longitude),
    ]);

    const openaqResult: OpenAQResult =
      openaqSettled.status === 'fulfilled'
        ? openaqSettled.value
        : {
            available: false,
            attribution: {
              provider: 'OpenAQ',
              datasetName: 'OpenAQ API v3 Global Station Telemetry',
              attributionText: 'Latest measurements reported by monitoring stations via OpenAQ.',
              url: 'https://openaq.org',
              isStationObservation: true,
            },
            station: null,
            measurements: {},
            reason: 'API_ERROR',
            error: openaqSettled.reason?.message || 'Failed to query OpenAQ',
          };

    const openMeteoResult: OpenMeteoResult =
      openMeteoSettled.status === 'fulfilled'
        ? openMeteoSettled.value
        : {
            success: false,
            attribution: {
              provider: 'Open-Meteo',
              datasetName: 'Open-Meteo Air Quality API (CAMS Global)',
              attributionText: 'Modeled atmospheric dispersion forecast from CAMS Global via Open-Meteo.',
              url: 'https://open-meteo.com/en/docs/air-quality-api',
              modelResolution: 'CAMS Global (~0.4° / ~45 km grid; 3-hourly)',
              isStationObservation: false,
            },
            hourlyForecast: [],
            currentHourPoint: null,
            error: openMeteoSettled.reason?.message || 'Failed to query Open-Meteo',
          };

    const normalizedResponse = NormalizationService.synthesize(
      location,
      openaqResult,
      openMeteoResult
    );

    this.cache.set(cacheKey, {
      data: normalizedResponse,
      expiresAt: Date.now() + this.CACHE_TTL_MS,
    });

    return normalizedResponse;
  }
}
