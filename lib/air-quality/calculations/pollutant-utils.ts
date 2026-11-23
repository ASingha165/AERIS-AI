import { PollutantType } from '@/types/air-quality';
import { POLLUTANT_METADATA } from '../constants/pollutant-metadata';

/**
 * Normalizes pollutant units to standard CPCB reference units.
 * CPCB standards require:
 * - PM2.5: µg/m³
 * - PM10: µg/m³
 * - NO2: µg/m³
 * - SO2: µg/m³
 * - O3: µg/m³
 * - CO: mg/m³
 * 
 * Standard temperature and pressure: 25 °C, 101.325 kPa (1 atm)
 * Molar volume of ideal gas = 24.45 L/mol
 */
export function normalizeConcentrationForCPCB(
  pollutant: PollutantType,
  value: number,
  unit: string
): { value: number; normalizedUnit: string } | null {
  if (value === null || value === undefined || isNaN(value) || value < 0) {
    return null;
  }

  const cleanUnit = unit.trim().toLowerCase().replace('μ', 'µ');

  switch (pollutant) {
    case 'PM2.5':
    case 'PM10': {
      if (cleanUnit === 'µg/m³' || cleanUnit === 'ug/m3' || cleanUnit === 'µg/m3') {
        return { value, normalizedUnit: 'µg/m³' };
      }
      if (cleanUnit === 'mg/m³' || cleanUnit === 'mg/m3') {
        return { value: value * 1000, normalizedUnit: 'µg/m³' };
      }
      return null;
    }

    case 'CO': {
      // CPCB requires mg/m³
      if (cleanUnit === 'mg/m³' || cleanUnit === 'mg/m3') {
        return { value, normalizedUnit: 'mg/m³' };
      }
      if (cleanUnit === 'µg/m³' || cleanUnit === 'ug/m3' || cleanUnit === 'µg/m3') {
        return { value: value / 1000, normalizedUnit: 'mg/m³' };
      }
      if (cleanUnit === 'ppm') {
        // CO molecular weight = 28.01 g/mol
        // mg/m³ = ppm * 28.01 / 24.45 = ppm * 1.1456
        return { value: value * 1.1456, normalizedUnit: 'mg/m³' };
      }
      if (cleanUnit === 'ppb') {
        return { value: (value * 1.1456) / 1000, normalizedUnit: 'mg/m³' };
      }
      return null;
    }

    case 'NO2': {
      // CPCB requires µg/m³
      if (cleanUnit === 'µg/m³' || cleanUnit === 'ug/m3' || cleanUnit === 'µg/m3') {
        return { value, normalizedUnit: 'µg/m³' };
      }
      if (cleanUnit === 'ppb') {
        // NO2 molecular weight = 46.01 g/mol
        // µg/m³ = ppb * 46.01 / 24.45 = ppb * 1.8818
        return { value: value * 1.8818, normalizedUnit: 'µg/m³' };
      }
      if (cleanUnit === 'ppm') {
        return { value: value * 1881.8, normalizedUnit: 'µg/m³' };
      }
      return null;
    }

    case 'SO2': {
      // CPCB requires µg/m³
      if (cleanUnit === 'µg/m³' || cleanUnit === 'ug/m3' || cleanUnit === 'µg/m3') {
        return { value, normalizedUnit: 'µg/m³' };
      }
      if (cleanUnit === 'ppb') {
        // SO2 molecular weight = 64.06 g/mol
        // µg/m³ = ppb * 64.06 / 24.45 = ppb * 2.620
        return { value: value * 2.620, normalizedUnit: 'µg/m³' };
      }
      if (cleanUnit === 'ppm') {
        return { value: value * 2620, normalizedUnit: 'µg/m³' };
      }
      return null;
    }

    case 'O3': {
      // CPCB requires µg/m³
      if (cleanUnit === 'µg/m³' || cleanUnit === 'ug/m3' || cleanUnit === 'µg/m3') {
        return { value, normalizedUnit: 'µg/m³' };
      }
      if (cleanUnit === 'ppb') {
        // O3 molecular weight = 48.00 g/mol
        // µg/m³ = ppb * 48.00 / 24.45 = ppb * 1.9632
        return { value: value * 1.9632, normalizedUnit: 'µg/m³' };
      }
      if (cleanUnit === 'ppm') {
        return { value: value * 1963.2, normalizedUnit: 'µg/m³' };
      }
      return null;
    }

    default:
      return null;
  }
}
