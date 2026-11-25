import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { OpenMeteoProvider } from '@/lib/air-quality/providers/open-meteo';

const validForecast = {
  latitude: 22.57,
  longitude: 88.36,
  timezone: 'Asia/Kolkata',
  hourly: {
    time: ['2026-11-25T06:00', '2026-11-25T07:00'],
    pm2_5: [42.5, 33.1],
    pm10: [75.2, 54.1],
    nitrogen_dioxide: [12, 10],
    sulphur_dioxide: [4, 5],
    ozone: [20, 25],
    carbon_monoxide: [100, 110],
  },
};

async function withFetchMock(
  mock: typeof fetch,
  run: () => Promise<void>,
) {
  const previousFetch = globalThis.fetch;
  globalThis.fetch = mock;
  try { await run(); }
  finally { globalThis.fetch = previousFetch; }
}

describe('Open-Meteo provider contracts with deterministic HTTP fixtures', () => {
  test('successful modeled responses retain provenance and never claim stations', async () => {
    const fetchMock = (async (input: RequestInfo | URL) => {
      const url = new URL(String(input));
      assert.equal(url.searchParams.get('domains'), 'cams_global');
      assert.equal(url.searchParams.get('forecast_days'), '5');
      return new Response(JSON.stringify(validForecast), {
        status: 200, headers: { 'Content-Type': 'application/json' },
      });
    }) as typeof fetch;

    await withFetchMock(fetchMock, async () => {
      const result = await OpenMeteoProvider.getForecast(22.57, 88.36);
      assert.equal(result.success, true);
      assert.equal(result.attribution.provider, 'Open-Meteo');
      assert.equal(result.attribution.isStationObservation, false);
      assert.equal(result.hourlyForecast.length, 2);
      assert.equal(result.hourlyForecast[0].pm25, 42.5);
      assert.ok(result.currentHourPoint);
    });
  });

  test('malformed provider data is rejected rather than silently fabricated', async () => {
    const fetchMock = (async () => new Response(JSON.stringify({ hourly: { time: ['2026-11-25T06:00'] } }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    })) as typeof fetch;

    await withFetchMock(fetchMock, async () => {
      const result = await OpenMeteoProvider.getForecast(22.57, 88.36);
      assert.equal(result.success, false);
      assert.deepEqual(result.hourlyForecast, []);
      assert.equal(result.currentHourPoint, null);
      assert.match(result.error ?? '', /schema validation/i);
    });
  });

  test('upstream HTTP 503 returns explicit unavailable state without throwing', async () => {
    const fetchMock = (async () => new Response('temporarily unavailable', {
      status: 503, statusText: 'Service Unavailable',
    })) as typeof fetch;

    await withFetchMock(fetchMock, async () => {
      const result = await OpenMeteoProvider.getForecast(22.57, 88.36);
      assert.equal(result.success, false);
      assert.deepEqual(result.hourlyForecast, []);
      assert.match(result.error ?? '', /503/);
    });
  });

  test('network errors return unsuccessful result rather than an invented forecast', async () => {
    const fetchMock = (async () => { throw new Error('mock network disconnected'); }) as typeof fetch;
    await withFetchMock(fetchMock, async () => {
      const result = await OpenMeteoProvider.getForecast(22.57, 88.36);
      assert.equal(result.success, false);
      assert.equal(result.currentHourPoint, null);
      assert.match(result.error ?? '', /mock network disconnected/);
    });
  });
});
