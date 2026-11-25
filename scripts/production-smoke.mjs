/**
 * Zero-secret, read-only production verification for AERIS-AI.
 *
 * This smoke suite tests the public deployment and API validation contracts.
 * It does NOT call Gemini with a valid prompt or claim a real model response.
 */
import assert from 'node:assert/strict';

const base = (process.env.AERIS_BASE_URL || 'https://aeris-ai-steel.vercel.app').replace(/\/$/, '');
const results = [];

async function request(path, init = {}) {
  let latest;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(base + path, {
        ...init,
        headers: {
          Accept: init.headers?.Accept || 'application/json, text/html',
          ...(init.headers ?? {}),
        },
        redirect: 'follow',
        signal: AbortSignal.timeout(15000),
        cache: 'no-store',
      });
      if (![502, 503, 504].includes(response.status) || attempt === 3) return response;
      latest = new Error(`HTTP ${response.status} from ${path}`);
    } catch (error) {
      latest = error;
      if (attempt === 3) throw error;
    }
    await new Promise(resolve => setTimeout(resolve, 1300 * attempt));
  }
  throw latest || new Error('Unexpected retry failure');
}

async function check(name, action) {
  const started = Date.now();
  try {
    await action();
    results.push({ name, passed: true, ms: Date.now() - started });
    console.log('PASS ' + name);
  } catch (error) {
    results.push({ name, passed: false, ms: Date.now() - started, error: String(error) });
    console.error('FAIL ' + name + ': ' + String(error));
  }
}

for (const path of ['/', '/dashboard', '/planner', '/copilot']) {
  await check('Public HTML ' + path, async () => {
    const response = await request(path, { headers: { Accept: 'text/html' } });
    assert.equal(response.status, 200, `${path}: HTTP ${response.status}`);
    assert.match(response.headers.get('content-type') ?? '', /text\/html/i);
    const html = await response.text();
    assert.match(html, /AERIS/i, 'Unexpected page content; may be a deployment protection screen');
  });
}

await check('Missing air-quality coordinates return HTTP 400', async () => {
  const response = await request('/api/air-quality?lat=&lon=');
  assert.equal(response.status, 400);
  const body = await response.json();
  assert.equal(body.error, 'Invalid query parameters');
});

await check('Impossible coordinates return HTTP 400', async () => {
  const response = await request('/api/air-quality?lat=91&lon=200');
  assert.equal(response.status, 400);
});

await check('Malformed Copilot payload returns HTTP 400 without a Gemini call', async () => {
  const response = await request('/api/copilot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{invalid-json',
  });
  assert.equal(response.status, 400);
  const body = await response.json();
  assert.match(body.error ?? '', /valid JSON/);
});

await check('Invalid Copilot location returns HTTP 400', async () => {
  const response = await request('/api/copilot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'Explain pollution',
      location: { name: 'Kolkata', latitude: 999, longitude: 888 },
    }),
  });
  assert.equal(response.status, 400);
});

await check('Public location search contract', async () => {
  const response = await request('/api/locations/search?q=Kolkata');
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.ok(Array.isArray(body), 'Location search must return a list');
});

await check('OpenAQ-optional environmental API contract', async () => {
  const response = await request('/api/air-quality?lat=22.5726&lon=88.3639&name=Kolkata');
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(typeof body.status, 'string');
  assert.ok(['FORECAST_ONLY', 'LIVE_OBSERVATION', 'PARTIAL_OBSERVATION', 'UNAVAILABLE'].includes(body.status));
  assert.ok(Array.isArray(body.sources));
  assert.ok(body.aqi && typeof body.aqi.status === 'string');
  for (const metric of Object.values(body.observations ?? {})) {
    if (!metric) continue;
    assert.ok(['MODELED_FORECAST', 'MEASURED_STATION'].includes(metric.observationType));
    if (metric.provider === 'Open-Meteo') assert.equal(metric.observationType, 'MODELED_FORECAST');
  }
});

const passed = results.filter(result => result.passed).length;
console.log('\nProduction smoke summary: ' + passed + '/' + results.length + ' checks passed.');
console.log(JSON.stringify({ base, checkedAt: new Date().toISOString(), results }, null, 2));
if (passed !== results.length) process.exitCode = 1;
