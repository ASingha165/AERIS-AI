import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';
import { GET as getAirQuality } from '@/app/api/air-quality/route';
import { GET as searchLocations } from '@/app/api/locations/search/route';
import { POST as askCopilot } from '@/app/api/copilot/route';

const request = (url: string) => new NextRequest(url);
const post = (body: string) => new NextRequest('http://localhost/api/copilot', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body,
});

describe('API route contracts (no upstream API calls required)', () => {
  test('air-quality endpoint rejects absent lat/lon (not coerced to 0,0)', async () => {
    const response = await getAirQuality(request('http://localhost/api/air-quality'));
    assert.equal(response.status, 400);
    assert.equal((await response.json()).error, 'Invalid query parameters');
  });

  test('air-quality endpoint rejects empty lat/lon instead of treating them as zero', async () => {
    const response = await getAirQuality(request('http://localhost/api/air-quality?lat=&lon='));
    assert.equal(response.status, 400);
  });

  test('air-quality endpoint rejects impossible latitude and longitude', async () => {
    for (const query of ['lat=91&lon=88', 'lat=22&lon=181', 'lat=NaN&lon=88']) {
      const response = await getAirQuality(request('http://localhost/api/air-quality?' + query));
      assert.equal(response.status, 400, query);
    }
  });

  test('air-quality endpoint enforces OpenAQ search radius bounds', async () => {
    for (const radius of ['999', '25001', 'oops']) {
      const response = await getAirQuality(request('http://localhost/api/air-quality?lat=22&lon=88&radius=' + radius));
      assert.equal(response.status, 400, radius);
    }
  });

  test('location search rejects empty and overly long terms', async () => {
    for (const q of ['', '  ', 'a'.repeat(101)]) {
      const response = await searchLocations(request('http://localhost/api/locations/search?q=' + encodeURIComponent(q)));
      assert.equal(response.status, 400, q.length.toString());
    }
  });

  test('Copilot rejects malformed JSON before checking Gemini credentials', async () => {
    const response = await askCopilot(post('{not-json'));
    assert.equal(response.status, 400);
    assert.match((await response.json()).error, /valid JSON/);
  });

  test('Copilot rejects invalid location and prompt without upstream access', async () => {
    const response = await askCopilot(post(JSON.stringify({
      message: '',
      location: { name: '', latitude: 999, longitude: -999 },
    })));
    assert.equal(response.status, 400);
    const body = await response.json();
    assert.equal(body.error, 'Invalid Copilot request.');
    assert.ok(body.details);
  });

  test('Copilot returns configuration error for valid input without an API key', async () => {
    const previousKey = process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_API_KEY;
    try {
      const response = await askCopilot(post(JSON.stringify({
        message: 'Explain modeled particulate forecasts',
        location: { name: 'Kolkata', latitude: 22.5726, longitude: 88.3639 },
      })));
      assert.equal(response.status, 503);
      assert.match((await response.json()).error, /GEMINI_API_KEY/);
    } finally {
      if (previousKey === undefined) delete process.env.GEMINI_API_KEY;
      else process.env.GEMINI_API_KEY = previousKey;
    }
  });
});
