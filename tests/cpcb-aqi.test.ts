import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { calculateSubIndex, getCPCBCategory, calculateOverallAQI } from '@/lib/air-quality/calculations/cpcb-aqi';
import { ObservationMetric } from '@/types/air-quality';

describe('CPCB Sub-Index Calculations', () => {
  test('PM2.5 exact breakpoint interpolation', () => {
    assert.equal(calculateSubIndex('PM2.5', 0, 'µg/m³'), 0);
    assert.equal(calculateSubIndex('PM2.5', 30, 'µg/m³'), 50);
    assert.equal(calculateSubIndex('PM2.5', 60, 'µg/m³'), 100);
    assert.equal(calculateSubIndex('PM2.5', 90, 'µg/m³'), 200);
    assert.equal(calculateSubIndex('PM2.5', 120, 'µg/m³'), 300);
    assert.equal(calculateSubIndex('PM2.5', 250, 'µg/m³'), 400);
    assert.equal(calculateSubIndex('PM2.5', 380, 'µg/m³'), 500);
    assert.equal(calculateSubIndex('PM2.5', 450, 'µg/m³'), 500);
  });

  test('PM10 exact breakpoint interpolation', () => {
    assert.equal(calculateSubIndex('PM10', 50, 'µg/m³'), 50);
    assert.equal(calculateSubIndex('PM10', 100, 'µg/m³'), 100);
    assert.equal(calculateSubIndex('PM10', 250, 'µg/m³'), 200);
    assert.equal(calculateSubIndex('PM10', 350, 'µg/m³'), 300);
    assert.equal(calculateSubIndex('PM10', 430, 'µg/m³'), 400);
    assert.equal(calculateSubIndex('PM10', 510, 'µg/m³'), 500);
    assert.equal(calculateSubIndex('PM10', 600, 'µg/m³'), 500);
  });

  test('NO2 breakpoint interpolation', () => {
    assert.equal(calculateSubIndex('NO2', 40, 'µg/m³'), 50);
    assert.equal(calculateSubIndex('NO2', 80, 'µg/m³'), 100);
    assert.equal(calculateSubIndex('NO2', 180, 'µg/m³'), 200);
    assert.equal(calculateSubIndex('NO2', 280, 'µg/m³'), 300);
    assert.equal(calculateSubIndex('NO2', 400, 'µg/m³'), 400);
  });

  test('CO unit handling: mg/m³ standard', () => {
    assert.equal(calculateSubIndex('CO', 1.0, 'mg/m³'), 50);
    assert.equal(calculateSubIndex('CO', 2.0, 'mg/m³'), 100);
    assert.equal(calculateSubIndex('CO', 10.0, 'mg/m³'), 200);
  });

  test('Negative concentration returns null', () => {
    assert.equal(calculateSubIndex('PM2.5', -5, 'µg/m³'), null);
  });
});

describe('CPCB Categories', () => {
  test('Category classification matches official standard', () => {
    assert.equal(getCPCBCategory(0), 'Good');
    assert.equal(getCPCBCategory(50), 'Good');
    assert.equal(getCPCBCategory(51), 'Satisfactory');
    assert.equal(getCPCBCategory(100), 'Satisfactory');
    assert.equal(getCPCBCategory(101), 'Moderately Polluted');
    assert.equal(getCPCBCategory(200), 'Moderately Polluted');
    assert.equal(getCPCBCategory(201), 'Poor');
    assert.equal(getCPCBCategory(300), 'Poor');
    assert.equal(getCPCBCategory(301), 'Very Poor');
    assert.equal(getCPCBCategory(400), 'Very Poor');
    assert.equal(getCPCBCategory(401), 'Severe');
    assert.equal(getCPCBCategory(500), 'Severe');
  });
});

describe('Overall CPCB NAQI Calculation Rules', () => {
  const createMockMetric = (pollutant: any, value: number, unit = 'µg/m³'): ObservationMetric => ({
    pollutant,
    fullName: pollutant,
    value,
    unit,
    observationType: 'MEASURED_STATION',
    provider: 'OpenAQ',
    sourceName: 'Station Test',
    timestamp: new Date().toISOString(),
    freshness: 'LIVE',
  });

  test('Fails when fewer than 3 pollutants are available', () => {
    const obs = {
      'PM2.5': createMockMetric('PM2.5', 60),
      'NO2': createMockMetric('NO2', 40),
    };
    const result = calculateOverallAQI(obs, { hasFull24HourHistory: true });
    assert.equal(result.status, 'INSUFFICIENT_DATA');
    assert.equal(result.qualifyingPollutantsCount, 2);
    assert.match(result.statusReason, /at least 3 qualifying pollutants/i);
  });

  test('Fails when neither PM2.5 nor PM10 is available', () => {
    const obs = {
      'NO2': createMockMetric('NO2', 60),
      'SO2': createMockMetric('SO2', 50),
      'O3': createMockMetric('O3', 80),
    };
    const result = calculateOverallAQI(obs, { hasFull24HourHistory: true });
    assert.equal(result.status, 'INSUFFICIENT_DATA');
    assert.equal(result.hasParticulateMatter, false);
    assert.match(result.statusReason, /particulate pollutant/i);
  });

  test('Calculates CPCB-methodology result only when caller supplies averaged concentrations', () => {
    // These values represent already-averaged pollutant concentrations, not single sensor snapshots.
    const averagedConcentrations = {
      concentrations: { 'PM2.5': 85, 'PM10': 140, 'NO2': 50 },
      isAveragedPeriod: true,
    } as const;
    const result = calculateOverallAQI(averagedConcentrations);
    assert.equal(result.status, 'CALCULATED');
    assert.equal(result.dominantPollutant, 'PM2.5');
    assert.ok(result.value !== null && result.value > 150 && result.value < 200);
    assert.equal(result.category, 'Moderately Polluted');
    assert.match(result.statusReason, /not a CPCB-issued certification/i);
  });

  test('Marks instantaneous observations INSUFFICIENT_DATA even when pollutant count is met', () => {
    const obs = {
      'PM2.5': createMockMetric('PM2.5', 120),
      'PM10': createMockMetric('PM10', 250),
      'NO2': createMockMetric('NO2', 80),
    };
    const result = calculateOverallAQI(obs, { hasFull24HourHistory: false });
    assert.equal(result.status, 'INSUFFICIENT_DATA');
    assert.match(result.statusReason, /statutory averaging windows have not been verified/i);
    assert.ok(result.value !== null);
  });
});
