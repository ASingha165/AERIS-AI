import { PollutantType } from '@/types/air-quality';

export interface PollutantMetadata {
  pollutant: PollutantType;
  name: string;
  fullName: string;
  chemicalFormula: string;
  defaultUnit: string;
  standardUnit: string;
  cpcbStandardUnit: string;
  averagingPeriodHours: number;
  whoDailyGuidelineUgM3?: number;
  cpcbDailyStandardUgM3?: number;
  description: string;
  sourcesDescription: string;
}

export const POLLUTANT_METADATA: Record<PollutantType, PollutantMetadata> = {
  'PM2.5': {
    pollutant: 'PM2.5',
    name: 'Fine Particulate Matter (≤ 2.5 µm)',
    fullName: 'Fine Particulate Matter (≤ 2.5 µm)',
    chemicalFormula: 'PM₂.₅',
    defaultUnit: 'µg/m³',
    standardUnit: 'µg/m³',
    cpcbStandardUnit: 'µg/m³',
    averagingPeriodHours: 24,
    whoDailyGuidelineUgM3: 15,
    cpcbDailyStandardUgM3: 60,
    description: 'Microscopic solid particles and liquid droplets that penetrate deep into the pulmonary alveoli and enter the bloodstream.',
    sourcesDescription: 'Vehicular exhaust, biomass burning, coal-fired power stations, industrial emissions, and secondary chemical aerosols.',
  },
  'PM10': {
    pollutant: 'PM10',
    name: 'Coarse Particulate Matter (≤ 10 µm)',
    fullName: 'Coarse Particulate Matter (≤ 10 µm)',
    chemicalFormula: 'PM₁₀',
    defaultUnit: 'µg/m³',
    standardUnit: 'µg/m³',
    cpcbStandardUnit: 'µg/m³',
    averagingPeriodHours: 24,
    whoDailyGuidelineUgM3: 45,
    cpcbDailyStandardUgM3: 100,
    description: 'Inhalable particles that deposit in the upper respiratory tract, irritating mucous membranes and aggravating bronchial asthma.',
    sourcesDescription: 'Road dust re-suspension, construction debris, soil dust, agricultural burning, and industrial crushing operations.',
  },
  'NO2': {
    pollutant: 'NO2',
    name: 'Nitrogen Dioxide',
    fullName: 'Nitrogen Dioxide',
    chemicalFormula: 'NO₂',
    defaultUnit: 'µg/m³',
    standardUnit: 'µg/m³',
    cpcbStandardUnit: 'µg/m³',
    averagingPeriodHours: 24,
    whoDailyGuidelineUgM3: 25,
    cpcbDailyStandardUgM3: 80,
    description: 'Reactive toxic gas that inflames the lining of the lungs and reduces immunity to lung infections.',
    sourcesDescription: 'High-temperature fuel combustion, motor vehicle engines, thermal power plants, and industrial boilers.',
  },
  'SO2': {
    pollutant: 'SO2',
    name: 'Sulphur Dioxide',
    fullName: 'Sulphur Dioxide',
    chemicalFormula: 'SO₂',
    defaultUnit: 'µg/m³',
    standardUnit: 'µg/m³',
    cpcbStandardUnit: 'µg/m³',
    averagingPeriodHours: 24,
    whoDailyGuidelineUgM3: 40,
    cpcbDailyStandardUgM3: 80,
    description: 'Pungent, suffocating gas that severely irritates the eyes, throat, and respiratory tract.',
    sourcesDescription: 'Coal and oil combustion in power generation, metal smelting, and diesel exhaust from heavy freight transport.',
  },
  'O3': {
    pollutant: 'O3',
    name: 'Ground-Level Ozone',
    fullName: 'Ground-Level Ozone',
    chemicalFormula: 'O₃',
    defaultUnit: 'µg/m³',
    standardUnit: 'µg/m³',
    cpcbStandardUnit: 'µg/m³',
    averagingPeriodHours: 8,
    whoDailyGuidelineUgM3: 100,
    cpcbDailyStandardUgM3: 100,
    description: 'Secondary photochemical oxidant formed when NOx and volatile organic compounds react in sunlight.',
    sourcesDescription: 'Secondary photochemical synthesis driven by solar radiation acting on vehicular and industrial precursor gases.',
  },
  'CO': {
    pollutant: 'CO',
    name: 'Carbon Monoxide',
    fullName: 'Carbon Monoxide',
    chemicalFormula: 'CO',
    defaultUnit: 'mg/m³',
    standardUnit: 'mg/m³',
    cpcbStandardUnit: 'mg/m³',
    averagingPeriodHours: 8,
    whoDailyGuidelineUgM3: 4,
    cpcbDailyStandardUgM3: 2,
    description: 'Colorless, odorless gas that binds to hemoglobin in the bloodstream, severely restricting oxygen delivery to vital organs.',
    sourcesDescription: 'Incomplete combustion of carbon fuels in vehicle exhausts, biomass cooking stoves, and metallurgical manufacturing.',
  },
};
