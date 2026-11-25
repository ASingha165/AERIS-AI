import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { OpenAQProvider } from '@/lib/air-quality/providers/openaq';
import { AirQualityService } from '@/lib/air-quality/services/air-quality-service';

describe('OpenAQ Optional Key & Fallback Handling', () => {
  test('OpenAQProvider returns unavailable without throwing when OPENAQ_API_KEY is missing or empty', async () => {
    const originalKey = process.env.OPENAQ_API_KEY;
    delete process.env.OPENAQ_API_KEY;

    const result1 = await OpenAQProvider.getNearestObservations(22.5726, 88.3639);
    assert.equal(result1.available, false);
    assert.equal(result1.reason, 'NO_API_KEY');
    assert.equal(result1.station, null);
    assert.deepEqual(result1.measurements, {});

    process.env.OPENAQ_API_KEY = '   ';
    const result2 = await OpenAQProvider.getNearestObservations(22.5726, 88.3639);
    assert.equal(result2.available, false);
    assert.equal(result2.reason, 'NO_API_KEY');

    process.env.OPENAQ_API_KEY = originalKey;
  });

  test('AirQualityService seamlessly falls back to Open-Meteo CAMS MODELED_FORECAST when OPENAQ_API_KEY is absent', async () => {
    const originalKey = process.env.OPENAQ_API_KEY;
    delete process.env.OPENAQ_API_KEY;

    // Fetch with unique coordinates to bypass 10-min cache
    const response = await AirQualityService.getAirQualityData(22.58, 88.37, 25000, 'Kolkata Fallback Test');

    assert.equal(response.status, 'FORECAST_ONLY');
    assert.ok(response.sources.length >= 1);
    assert.equal(response.sources[0].provider, 'Open-Meteo');
    assert.equal(response.sources[0].isStationObservation, false);

    // Every populated observation must be marked MODELED_FORECAST, never MEASURED_STATION
    const obsList = Object.values(response.observations).filter(Boolean);
    assert.ok(obsList.length > 0);
    for (const obs of obsList) {
      assert.equal(obs?.observationType, 'MODELED_FORECAST');
      assert.equal(obs?.provider, 'Open-Meteo');
      assert.equal(obs?.station, undefined);
    }

    process.env.OPENAQ_API_KEY = originalKey;
  });
});
