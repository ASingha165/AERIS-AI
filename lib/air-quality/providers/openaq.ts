import { ObservationMetric, PollutantType, SourceAttribution, MonitoringStation } from '@/types/air-quality';
import { calculateSubIndex, getCPCBCategory } from '../calculations/cpcb-aqi';
import { normalizeConcentrationForCPCB } from '../calculations/pollutant-utils';
import { FreshnessService } from '../services/freshness-service';
import { POLLUTANT_METADATA } from '../constants/pollutant-metadata';

export interface OpenAQResult {
  available: boolean;
  attribution: SourceAttribution;
  station: MonitoringStation | null;
  measurements: Partial<Record<PollutantType, ObservationMetric>>;
  error?: string;
  reason?: 'NO_API_KEY' | 'NO_STATION_FOUND' | 'API_ERROR' | 'SUCCESS';
}

/**
 * OpenAQ API v3 Provider
 * Base URL: https://api.openaq.org/v3
 * 
 * Fetches actual ground observations reported by physical monitoring stations.
 * Adheres strictly to OpenAQ v3 schema and requires process.env.OPENAQ_API_KEY for authorization.
 */
export class OpenAQProvider {
  private static readonly BASE_URL = 'https://api.openaq.org/v3';
  private static readonly TIMEOUT_MS = 8000;

  public static async getNearestObservations(
    latitude: number,
    longitude: number,
    radiusMeters: number = 25000
  ): Promise<OpenAQResult> {
    const apiKey = process.env.OPENAQ_API_KEY;

    const defaultAttribution: SourceAttribution = {
      provider: 'OpenAQ',
      datasetName: 'OpenAQ API v3 Global Station Telemetry',
      attributionText: 'Official ground monitoring station observations aggregated via OpenAQ.',
      url: 'https://openaq.org',
      isStationObservation: true,
    };

    if (!apiKey) {
      return {
        available: false,
        attribution: defaultAttribution,
        station: null,
        measurements: {},
        reason: 'NO_API_KEY',
        error: 'OpenAQ API key (OPENAQ_API_KEY) is not configured in server environment.',
      };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

    try {
      // Step 1: Query nearby monitoring locations within radius
      const locationsUrl = new URL(`${this.BASE_URL}/locations`);
      locationsUrl.searchParams.set('coordinates', `${latitude},${longitude}`);
      locationsUrl.searchParams.set('radius', radiusMeters.toString());
      locationsUrl.searchParams.set('limit', '10');

      const res = await fetch(locationsUrl.toString(), {
        signal: controller.signal,
        headers: {
          'X-API-Key': apiKey,
          'Accept': 'application/json',
          'User-Agent': 'AERIS-AI/2.0 (Environmental Data Engine)',
        },
        next: { revalidate: 600 }, // 10-min cache
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        return {
          available: false,
          attribution: defaultAttribution,
          station: null,
          measurements: {},
          reason: 'API_ERROR',
          error: `OpenAQ API returned status ${res.status}: ${res.statusText}`,
        };
      }

      const locationsData = await res.json();
      const results = locationsData?.results;

      if (!Array.isArray(results) || results.length === 0) {
        return {
          available: false,
          attribution: defaultAttribution,
          station: null,
          measurements: {},
          reason: 'NO_STATION_FOUND',
          error: `No eligible monitoring stations found within ${radiusMeters / 1000} km radius of coordinates.`,
        };
      }

      // Step 2: Select the closest active station
      const bestLocation = results[0];
      const stationId = String(bestLocation.id);
      const stationName = bestLocation.name || 'Regional Monitoring Station';
      const stationDistanceMeters = bestLocation.distance ?? 0;
      const stationDistanceKm = Number((stationDistanceMeters / 1000).toFixed(1));
      const providerName = bestLocation.provider?.name || 'National Environmental Agency';

      // Step 3: Fetch latest measurements from this location
      const latestUrl = `${this.BASE_URL}/locations/${stationId}/latest`;
      const latestRes = await fetch(latestUrl, {
        headers: {
          'X-API-Key': apiKey,
          'Accept': 'application/json',
          'User-Agent': 'AERIS-AI/2.0',
        },
        next: { revalidate: 300 },
      });

      let latestSensors: any[] = [];
      if (latestRes.ok) {
        const latestJson = await latestRes.json();
        latestSensors = latestJson?.results || [];
      } else if (Array.isArray(bestLocation.sensors)) {
        latestSensors = bestLocation.sensors;
      }

      const measurements: Partial<Record<PollutantType, ObservationMetric>> = {};
      const availableSensorsList: PollutantType[] = [];
      let mostRecentTimestamp = '';

      for (const item of latestSensors) {
        const parameterName = (
          item.parameter?.name ||
          item.parameter?.displayName ||
          item.parameter ||
          ''
        ).toLowerCase();

        const pollutantType = this.mapParameterToPollutantType(parameterName);
        if (!pollutantType) continue;

        const rawValue = item.value ?? item.latest?.value;
        const rawUnit = item.parameter?.units || item.units || 'µg/m³';
        const timestamp = item.datetime?.utc || item.latest?.datetime || bestLocation.datetimeLast?.utc || new Date().toISOString();

        if (rawValue === null || rawValue === undefined || isNaN(rawValue)) {
          continue;
        }

        if (timestamp > mostRecentTimestamp) {
          mostRecentTimestamp = timestamp;
        }

        const normalized = normalizeConcentrationForCPCB(pollutantType, rawValue, rawUnit);
        if (!normalized) continue;

        const subIndex = calculateSubIndex(pollutantType, normalized.value);
        const freshness = FreshnessService.getFreshness(timestamp);

        measurements[pollutantType] = {
          pollutant: pollutantType,
          fullName: POLLUTANT_METADATA[pollutantType].name,
          value: Number(normalized.value.toFixed(1)),
          unit: normalized.normalizedUnit,
          observationType: 'MEASURED_STATION',
          provider: 'OpenAQ',
          sourceName: `${providerName} (${stationName})`,
          timestamp,
          freshness,
          averagingHoursExpected: POLLUTANT_METADATA[pollutantType].averagingPeriodHours,
          subIndex,
          subIndexCategory: subIndex !== null ? getCPCBCategory(subIndex) : null,
          station: {
            id: stationId,
            name: stationName,
            distanceKm: stationDistanceKm,
            coordinates: {
              latitude: bestLocation.coordinates?.latitude || latitude,
              longitude: bestLocation.coordinates?.longitude || longitude,
            },
          },
        };

        if (!availableSensorsList.includes(pollutantType)) {
          availableSensorsList.push(pollutantType);
        }
      }

      const station: MonitoringStation = {
        id: stationId,
        name: stationName,
        provider: providerName,
        distanceKm: stationDistanceKm,
        coordinates: {
          latitude: bestLocation.coordinates?.latitude || latitude,
          longitude: bestLocation.coordinates?.longitude || longitude,
        },
        lastUpdated: mostRecentTimestamp || bestLocation.datetimeLast?.utc || new Date().toISOString(),
        availableSensors: availableSensorsList,
        status: availableSensorsList.length > 0 ? 'active' : 'stale',
      };

      const attribution: SourceAttribution = {
        ...defaultAttribution,
        datasetName: `OpenAQ (${providerName} • ${stationName})`,
        stationCount: results.length,
      };

      return {
        available: Object.keys(measurements).length > 0,
        attribution,
        station,
        measurements,
        reason: Object.keys(measurements).length > 0 ? 'SUCCESS' : 'NO_STATION_FOUND',
      };
    } catch (err: any) {
      clearTimeout(timeoutId);
      const isAbort = err.name === 'AbortError';
      return {
        available: false,
        attribution: defaultAttribution,
        station: null,
        measurements: {},
        reason: 'API_ERROR',
        error: isAbort ? 'OpenAQ request timed out after 8000ms' : (err.message || 'Unknown network error'),
      };
    }
  }

  private static mapParameterToPollutantType(param: string): PollutantType | null {
    if (param === 'pm25' || param === 'pm2.5' || param.includes('pm2.5') || param.includes('pm25')) return 'PM2.5';
    if (param === 'pm10' || param.includes('pm10')) return 'PM10';
    if (param === 'no2' || param.includes('nitrogen dioxide') || param === 'no₂') return 'NO2';
    if (param === 'so2' || param.includes('sulfur dioxide') || param.includes('sulphur dioxide') || param === 'so₂') return 'SO2';
    if (param === 'o3' || param.includes('ozone') || param === 'o₃') return 'O3';
    if (param === 'co' || param.includes('carbon monoxide')) return 'CO';
    return null;
  }
}
