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
  // In-memory cache for API route responses (10 minutes TTL)
  private static cache = new Map<string, CacheEntry>();
  private static readonly CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

  private static getCacheKey(lat: number, lon: number, radiusMeters: number): string {
    return `${lat.toFixed(2)}_${lon.toFixed(2)}_${radiusMeters}`;
  }

  /**
   * Fetch complete air quality telemetry and forecast for coordinates.
   * Runs OpenAQ (ground observations) and Open-Meteo (model forecast) in parallel.
   */
  public static async getAirQualityData(
    latitude: number,
    longitude: number,
    radiusMeters: number = 25000,
    customLocationName?: string
  ): Promise<AirQualityResponse> {
    const cacheKey = this.getCacheKey(latitude, longitude, radiusMeters);
    const cached = this.cache.get(cacheKey);

    if (cached && cached.expiresAt > Date.now()) {
      return cached.data;
    }

    // Resolve location metadata
    const location: LocationMetadata = customLocationName
      ? {
          name: customLocationName,
          country: 'India',
          latitude,
          longitude,
        }
      : LocationService.getNearestPredefinedLocation(latitude, longitude);

    // Run providers in parallel
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
              attributionText: 'Official ground monitoring station observations aggregated via OpenAQ.',
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
              datasetName: 'Open-Meteo Air Quality API',
              attributionText: 'Modeled atmospheric dispersion forecast data provided by Open-Meteo.',
              url: 'https://open-meteo.com',
              isStationObservation: false,
            },
            hourlyForecast: [],
            currentHourPoint: null,
            error: openMeteoSettled.reason?.message || 'Failed to query Open-Meteo',
          };

    // Synthesize into verified standard response
    const normalizedResponse = NormalizationService.synthesize(
      location,
      openaqResult,
      openMeteoResult
    );

    // Cache valid response
    this.cache.set(cacheKey, {
      data: normalizedResponse,
      expiresAt: Date.now() + this.CACHE_TTL_MS,
    });

    return normalizedResponse;
  }
}
