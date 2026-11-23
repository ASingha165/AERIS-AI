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
 * Open-Meteo Air Quality Provider.
 * AERIS targets Indian urban locations and pins requests to CAMS Global.
 * CAMS Global is a modeled grid product (~0.4° / ~45 km, 3-hourly), never a
 * substitute for a local ground monitoring station.
 */
export class OpenMeteoProvider {
  private static readonly BASE_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';
  private static readonly TIMEOUT_MS = 8000;

  public static async getForecast(latitude: number, longitude: number): Promise<OpenMeteoResult> {
    const modelResolution = 'CAMS Global (~0.4° / ~45 km grid; 3-hourly)';

    const attribution: SourceAttribution = {
      provider: 'Open-Meteo',
      datasetName: 'Open-Meteo Air Quality API (CAMS Global)',
      attributionText: 'Modeled atmospheric dispersion forecast from the Copernicus Atmosphere Monitoring Service (CAMS) Global domain.',
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
    url.searchParams.set('domains', 'cams_global');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

    try {
      const res = await fetch(url.toString(), {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'AERIS-AI/2.1 (Environmental Intelligence)',
        },
        next: { revalidate: 900 },
      });

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
      let currentHourPoint: HourlyForecastPoint | null = null;
      let minTimeDiff = Infinity;

      for (let i = 0; i < times.length; i++) {
        const timeStr = times[i];
        const dateObj = new Date(timeStr);
        if (!Number.isFinite(dateObj.getTime())) continue;
        const hour = dateObj.getHours();

        const pm25Raw = data.hourly.pm2_5?.[i] ?? null;
        const pm10Raw = data.hourly.pm10?.[i] ?? null;
        const no2Raw = data.hourly.nitrogen_dioxide?.[i] ?? null;
        const so2Raw = data.hourly.sulphur_dioxide?.[i] ?? null;
        const o3Raw = data.hourly.ozone?.[i] ?? null;
        const coRaw = data.hourly.carbon_monoxide?.[i] ?? null;

        const coNorm = coRaw !== null
          ? normalizeConcentrationForCPCB('CO', coRaw, 'µg/m³')?.value ?? null
          : null;

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

        const diff = Math.abs(dateObj.getTime() - Date.now());
        if (diff < minTimeDiff) {
          minTimeDiff = diff;
          currentHourPoint = { ...point, isCurrentHour: true };
        }
      }

      return { success: true, attribution, hourlyForecast, currentHourPoint };
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error('Unknown network error');
      const isAbort = error.name === 'AbortError';
      return {
        success: false,
        attribution,
        hourlyForecast: [],
        currentHourPoint: null,
        error: isAbort ? `Open-Meteo request timed out after ${this.TIMEOUT_MS}ms` : error.message,
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
