import { AQICategory, PollutantType } from '@/types/air-quality';

export interface BreakpointRange {
  bLow: number;
  bHigh: number;
  iLow: number;
  iHigh: number;
  category: AQICategory;
}

/**
 * Official Central Pollution Control Board (CPCB) National Air Quality Index (NAQI) Breakpoints
 * Reference: CPCB National Air Quality Index report, Ministry of Environment, Forest & Climate Change, Govt. of India.
 * 
 * Category Ranges:
 * 0 - 50: Good
 * 51 - 100: Satisfactory
 * 101 - 200: Moderately Polluted
 * 201 - 300: Poor
 * 301 - 400: Very Poor
 * 401 - 500: Severe
 */
export const CPCB_BREAKPOINTS: Record<PollutantType, BreakpointRange[]> = {
  'PM2.5': [
    { bLow: 0, bHigh: 30, iLow: 0, iHigh: 50, category: 'Good' },
    { bLow: 31, bHigh: 60, iLow: 51, iHigh: 100, category: 'Satisfactory' },
    { bLow: 61, bHigh: 90, iLow: 101, iHigh: 200, category: 'Moderately Polluted' },
    { bLow: 91, bHigh: 120, iLow: 201, iHigh: 300, category: 'Poor' },
    { bLow: 121, bHigh: 250, iLow: 301, iHigh: 400, category: 'Very Poor' },
    { bLow: 251, bHigh: 380, iLow: 401, iHigh: 500, category: 'Severe' },
  ],
  'PM10': [
    { bLow: 0, bHigh: 50, iLow: 0, iHigh: 50, category: 'Good' },
    { bLow: 51, bHigh: 100, iLow: 51, iHigh: 100, category: 'Satisfactory' },
    { bLow: 101, bHigh: 250, iLow: 101, iHigh: 200, category: 'Moderately Polluted' },
    { bLow: 251, bHigh: 350, iLow: 201, iHigh: 300, category: 'Poor' },
    { bLow: 351, bHigh: 430, iLow: 301, iHigh: 400, category: 'Very Poor' },
    { bLow: 431, bHigh: 510, iLow: 401, iHigh: 500, category: 'Severe' },
  ],
  'NO2': [
    { bLow: 0, bHigh: 40, iLow: 0, iHigh: 50, category: 'Good' },
    { bLow: 41, bHigh: 80, iLow: 51, iHigh: 100, category: 'Satisfactory' },
    { bLow: 81, bHigh: 180, iLow: 101, iHigh: 200, category: 'Moderately Polluted' },
    { bLow: 181, bHigh: 280, iLow: 201, iHigh: 300, category: 'Poor' },
    { bLow: 281, bHigh: 400, iLow: 301, iHigh: 400, category: 'Very Poor' },
    { bLow: 401, bHigh: 500, iLow: 401, iHigh: 500, category: 'Severe' },
  ],
  'SO2': [
    { bLow: 0, bHigh: 40, iLow: 0, iHigh: 50, category: 'Good' },
    { bLow: 41, bHigh: 80, iLow: 51, iHigh: 100, category: 'Satisfactory' },
    { bLow: 81, bHigh: 380, iLow: 101, iHigh: 200, category: 'Moderately Polluted' },
    { bLow: 381, bHigh: 800, iLow: 201, iHigh: 300, category: 'Poor' },
    { bLow: 801, bHigh: 1600, iLow: 301, iHigh: 400, category: 'Very Poor' },
    { bLow: 1601, bHigh: 2000, iLow: 401, iHigh: 500, category: 'Severe' },
  ],
  'CO': [
    // Note: CO is in mg/m³
    { bLow: 0.0, bHigh: 1.0, iLow: 0, iHigh: 50, category: 'Good' },
    { bLow: 1.1, bHigh: 2.0, iLow: 51, iHigh: 100, category: 'Satisfactory' },
    { bLow: 2.1, bHigh: 10.0, iLow: 101, iHigh: 200, category: 'Moderately Polluted' },
    { bLow: 10.1, bHigh: 17.0, iLow: 201, iHigh: 300, category: 'Poor' },
    { bLow: 17.1, bHigh: 34.0, iLow: 301, iHigh: 400, category: 'Very Poor' },
    { bLow: 34.1, bHigh: 50.0, iLow: 401, iHigh: 500, category: 'Severe' },
  ],
  'O3': [
    // Note: O3 is in µg/m³ for 8-hour averaging
    { bLow: 0, bHigh: 50, iLow: 0, iHigh: 50, category: 'Good' },
    { bLow: 51, bHigh: 100, iLow: 51, iHigh: 100, category: 'Satisfactory' },
    { bLow: 101, bHigh: 168, iLow: 101, iHigh: 200, category: 'Moderately Polluted' },
    { bLow: 169, bHigh: 208, iLow: 201, iHigh: 300, category: 'Poor' },
    { bLow: 209, bHigh: 748, iLow: 301, iHigh: 400, category: 'Very Poor' },
    { bLow: 749, bHigh: 1000, iLow: 401, iHigh: 500, category: 'Severe' },
  ],
};

export const CPCB_CATEGORIES: {
  category: AQICategory;
  min: number;
  max: number;
  color: string;
  healthDescription: string;
}[] = [
  {
    category: 'Good',
    min: 0,
    max: 50,
    color: '#43D9A3',
    healthDescription: 'Minimal health impact; clean air conditions.',
  },
  {
    category: 'Satisfactory',
    min: 51,
    max: 100,
    color: '#53C7F5',
    healthDescription: 'Minor breathing discomfort to sensitive people.',
  },
  {
    category: 'Moderately Polluted',
    min: 101,
    max: 200,
    color: '#F6C453',
    healthDescription: 'Breathing discomfort to people with lung disease, asthma, and heart diseases.',
  },
  {
    category: 'Poor',
    min: 201,
    max: 300,
    color: '#F89843',
    healthDescription: 'Breathing discomfort to most people on prolonged exposure.',
  },
  {
    category: 'Very Poor',
    min: 301,
    max: 400,
    color: '#F16B77',
    healthDescription: 'Respiratory illness to people on prolonged exposure; pronounced effect on sensitive groups.',
  },
  {
    category: 'Severe',
    min: 401,
    max: 500,
    color: '#93000A',
    healthDescription: 'Affects healthy people and seriously impacts those with existing diseases; emergency conditions.',
  },
];
