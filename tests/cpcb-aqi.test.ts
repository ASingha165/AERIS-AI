import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { calculateSubIndex, getCPCBCategory, calculateOverallAQI } from '@/lib/air-quality/calculations/cpcb-aqi';
import { ObservationMetric } from '@/types/air-quality';

describe('CPCB Sub-Index Calculations', () => {
  test('PM2.5 exact breakpoint interpolation', () => {
    // 0 -> 0
    assert.equal(calculateSubIndex('PM2.5', 0, 'µg/m³'), 0);
    // 30 -> 50 (Good upper boundary)
    assert.equal(calculateSubIndex('PM2.5', 30, 'µg/m³'), 50);
    // 60 -> 100 (Satisfactory upper boundary)
    assert.equal(calculateSubIndex('PM2.5', 60, 'µg/m³'), 100);
    // 90 -> 200 (Moderate upper boundary)
    assert.equal(calculateSubIndex('PM2.5', 90, 'µg/m³'), 200);
    // 120 -> 300 (Poor upper boundary)
    assert.equal(calculateSubIndex('PM2.5', 120, 'µg/m³'), 300);
    // 250 -> 400 (Very Poor upper boundary)
    assert.equal(calculateSubIndex('PM2.5', 250, 'µg/m³'), 400);
    // 380 -> 500 (Severe upper boundary)
    assert.equal(calculateSubIndex('PM2.5', 380, 'µg/m³'), 500);
    // > 380 caps at 500
    assert.equal(calculateSubIndex('PM2.5', 450, 'µg/m³'), 500);
  });

  test('PM10 exact breakpoint interpolation', () => {
    // 50 -> 50
    assert.equal(calculateSubIndex('PM10', 50, 'µg/m³'), 50);
    // 100 -> 100
    assert.equal(calculateSubIndex('PM10', 100, 'µg/m³'), 100);
    // 250 -> 200
    assert.equal(calculateSubIndex('PM10', 250, 'µg/m³'), 200);
    // 350 -> 300
    assert.equal(calculateSubIndex('PM10', 350, 'µg/m³'), 300);
    // 430 -> 400
    assert.equal(calculateSubIndex('PM10', 430, 'µg/m³'), 400);
    // 510 -> 500
    assert.equal(calculateSubIndex('PM10', 510, 'µg/m³'), 500);
    // > 510 caps at 500
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
    // 1.0 mg/m³ -> 50
    assert.equal(calculateSubIndex('CO', 1.0, 'mg/m³'), 50);
    // 2.0 mg/m³ -> 100
    assert.equal(calculateSubIndex('CO', 2.0, 'mg/m³'), 100);
    // 10.0 mg/m³ -> 200
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
    assert.match(result.statusReason, /At least 3 qualifying pollutants are required/);
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
    assert.match(result.statusReason, /At least one particulate pollutant.*is mandatory/);
  });

  test('Successfully calculates official AQI with qualifying pollutants & full 24h averaging', () => {
    const obs = {
      'PM2.5': createMockMetric('PM2.5', 85), // Sub-index ~ 183
      'PM10': createMockMetric('PM10', 140), // Sub-index ~ 127
      'NO2': createMockMetric('NO2', 50),    // Sub-index ~ 63
    };

    const result = calculateOverallAQI(obs, { hasFull24HourHistory: true });
    assert.equal(result.status, 'CALCULATED');
    assert.equal(result.dominantPollutant, 'PM2.5');
    assert.ok(result.value !== null && result.value > 150 && result.value < 200);
    assert.equal(result.category, 'Moderately Polluted');
  });

  test('Marks status as INSUFFICIENT_DATA when 24h averaging is incomplete', () => {
    const obs = {
      'PM2.5': createMockMetric('PM2.5', 120),
      'PM10': createMockMetric('PM10', 250),
      'NO2': createMockMetric('NO2', 80),
    };

    // Instantaneous snapshot without full 24h statutory log
    const result = calculateOverallAQI(obs, { hasFull24HourHistory: false });
    assert.equal(result.status, 'INSUFFICIENT_DATA');
    assert.match(result.statusReason, /Awaiting statutory 24-hour statutory averaging/);
    // Still computes indicative sub-index
    assert.ok(result.value !== null);
  });
});
