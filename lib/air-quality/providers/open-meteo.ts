import { OpenMeteoAirQualityResponseSchema } from '../schemas/air-quality-schema';
import { HourlyForecastPoint, SourceAttribution } from '@/types/air-quality';
import { calculateSubIndex, getCPCBCategory } from '../calculations/cpcb-aqi';
import { normalizeConcentrationForCPCB } from '../calculations/pollutant-utils';

export interface OpenMeteoResult {
  success: boolean;
  attribution: SourceAttribution;
  hourlyForecast: HourlyForecastPoint[];
  currentHourPoint: HourlyForecastPoint | null;
  error?: string;
}

/**
 * Open-Meteo Air Quality Provider
 * Endpoint: https://air-quality-api.open-meteo.com/v1/air-quality
 * 
 * Provides numerical atmospheric dispersion reanalysis and forecasts.
 * Note on spatial resolution:
 * - Outside Europe: Copernicus Atmosphere Monitoring Service (CAMS) Global model (~0.4° ≈ 40 km resolution)
 * - Inside Europe: CAMS European Regional Ensemble (~0.1° ≈ 11 km resolution)
 * 
 * IMPORTANT: Forecast points represent grid-cell atmospheric model estimates, NOT ground monitoring stations.
 */
export class OpenMeteoProvider {
  private static readonly BASE_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';
  private static readonly TIMEOUT_MS = 8000;

  public static async getForecast(latitude: number, longitude: number): Promise<OpenMeteoResult> {
    const isEurope = latitude >= 30 && latitude <= 72 && longitude >= -25 && longitude <= 45;
    const modelResolution = isEurope
      ? 'CAMS European Regional Ensemble (~11km grid)'
      : 'Copernicus Global Atmospheric Model (CAMS ~40km grid)';

    const attribution: SourceAttribution = {
      provider: 'Open-Meteo',
      datasetName: 'Open-Meteo Air Quality API (Copernicus CAMS Ensemble)',
      attributionText: 'Modeled atmospheric dispersion forecast data provided by Open-Meteo via Copernicus CAMS.',
      url: 'https://open-meteo.com/en/docs/air-quality-api',
      modelResolution,
      isStationObservation: false,
    };

    const url = new URL(this.BASE_URL);
    url.searchParams.set('latitude', latitude.toFixed(4));
    url.searchParams.set('longitude', longitude.toFixed(4));
    url.searchParams.set(
      'hourly',
      'pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone'
    );
    url.searchParams.set('timezone', 'auto');
    url.searchParams.set('forecast_days', '5');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

    try {
      const res = await fetch(url.toString(), {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'AERIS-AI/2.0 (Environmental Intelligence)',
        },
        next: { revalidate: 900 }, // 15-min cache
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        return {
          success: false,
          attribution,
          hourlyForecast: [],
          currentHourPoint: null,
          error: `Open-Meteo returned status ${res.status}: ${res.statusText}`,
        };
      }

      const json = await res.json();
      const parsed = OpenMeteoAirQualityResponseSchema.safeParse(json);

      if (!parsed.success) {
        return {
          success: false,
          attribution,
          hourlyForecast: [],
          currentHourPoint: null,
          error: `Open-Meteo response failed schema validation: ${parsed.error.message}`,
        };
      }

      const data = parsed.data;
      const hourlyForecast: HourlyForecastPoint[] = [];

      const times = data.hourly.time;
      const nowIso = new Date().toISOString();
      let currentHourPoint: HourlyForecastPoint | null = null;
      let minTimeDiff = Infinity;

      for (let i = 0; i < times.length; i++) {
        const timeStr = times[i];
        const dateObj = new Date(timeStr);
        const hour = dateObj.getHours();

        const pm25Raw = data.hourly.pm2_5?.[i] ?? null;
        const pm10Raw = data.hourly.pm10?.[i] ?? null;
        const no2Raw = data.hourly.nitrogen_dioxide?.[i] ?? null;
        const so2Raw = data.hourly.sulphur_dioxide?.[i] ?? null;
        const o3Raw = data.hourly.ozone?.[i] ?? null;
        const coRaw = data.hourly.carbon_monoxide?.[i] ?? null;

        // Normalize CO if in µg/m³
        const coNorm = coRaw !== null
          ? normalizeConcentrationForCPCB('CO', coRaw, 'µg/m³')?.value ?? null
          : null;

        // Calculate indicative sub-index for visualization
        let indicativeAqi: number | null = null;
        if (pm25Raw !== null) {
          indicativeAqi = calculateSubIndex('PM2.5', pm25Raw);
        } else if (pm10Raw !== null) {
          indicativeAqi = calculateSubIndex('PM10', pm10Raw);
        }

        const point: HourlyForecastPoint = {
          time: timeStr,
          hour,
          pm25: pm25Raw !== null ? Number(pm25Raw.toFixed(1)) : null,
          pm10: pm10Raw !== null ? Number(pm10Raw.toFixed(1)) : null,
          no2: no2Raw !== null ? Number(no2Raw.toFixed(1)) : null,
          so2: so2Raw !== null ? Number(so2Raw.toFixed(1)) : null,
          o3: o3Raw !== null ? Number(o3Raw.toFixed(1)) : null,
          co: coNorm !== null ? Number(coNorm.toFixed(2)) : null,
          indicativeAqi,
          indicativeCategory: indicativeAqi !== null ? getCPCBCategory(indicativeAqi) : null,
        };

        hourlyForecast.push(point);

        // Track closest point to current wall clock time
        const diff = Math.abs(dateObj.getTime() - new Date(nowIso).getTime());
        if (diff < minTimeDiff) {
          minTimeDiff = diff;
          currentHourPoint = { ...point, isCurrentHour: true };
        }
      }

      return {
        success: true,
        attribution,
        hourlyForecast,
        currentHourPoint,
      };
    } catch (err: any) {
      clearTimeout(timeoutId);
      const isAbort = err.name === 'AbortError';
      return {
        success: false,
        attribution,
        hourlyForecast: [],
        currentHourPoint: null,
        error: isAbort ? 'Open-Meteo request timed out after 8000ms' : (err.message || 'Network error'),
      };
    }
  }
}
