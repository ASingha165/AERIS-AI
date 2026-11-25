import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import type { AirQualityResponse } from '@/types/air-quality';
import { buildGroundingContext } from '@/lib/copilot/grounding';

const fixture: AirQualityResponse = {
  location: { name: 'Kolkata', country: 'India', latitude: 22.5726, longitude: 88.3639 },
  observations: {
    'PM2.5': {
      pollutant: 'PM2.5', fullName: 'Fine particulate matter', value: 42, unit: 'µg/m³',
      observationType: 'MEASURED_STATION', provider: 'OpenAQ', sourceName: 'Station monitor',
      timestamp: '2026-11-25T05:00:00Z', freshness: 'LIVE',
    },
    'PM10': {
      pollutant: 'PM10', fullName: 'Particulate matter', value: 61, unit: 'µg/m³',
      observationType: 'MODELED_FORECAST', provider: 'Open-Meteo', sourceName: 'CAMS Global',
      timestamp: '2026-11-25T06:00:00Z', freshness: 'LIVE',
    },
  },
  forecast: [],
  aqi: {
    value: null, category: null, standard: 'INDIA_CPCB_NAQI', status: 'INSUFFICIENT_DATA',
    dominantPollutant: null, statusReason: 'Insufficient statutory averaging history.',
    subIndices: {}, qualifyingPollutantsCount: 0, hasParticulateMatter: true,
  },
  sources: [],
  updatedAt: '2026-11-25T06:00:00Z',
  status: 'PARTIAL_OBSERVATION',
  freshness: 'LIVE',
};

describe('buildGroundingContext', () => {
  test('keeps measured station observations separate from modeled estimates', () => {
    const context = buildGroundingContext(fixture);
    const stationSection = context.split('Modeled current-hour estimates')[0];
    const modeledSection = context.split('Modeled current-hour estimates')[1].split('Hourly CAMS')[0];

    assert.match(stationSection, /PM2\.5: 42/);
    assert.doesNotMatch(stationSection, /PM10: 61/);
    assert.match(modeledSection, /PM10: 61/);
    assert.match(context, /No forecast points are available\./);
  });

  test('discloses insufficient CPCB-methodology coverage', () => {
    const context = buildGroundingContext(fixture);
    assert.match(context, /status: INSUFFICIENT_DATA/);
    assert.match(context, /Insufficient statutory averaging history/);
  });
});
