import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

// Safely extract API key from .env.local without logging it
function getApiKey(): string {
  try {
    const envContent = fs.readFileSync('.env.local', 'utf-8');
    for (const line of envContent.split(/\r?\n/)) {
      const idx = line.indexOf('=');
      if (idx !== -1) {
        const k = line.substring(0, idx).trim();
        if (k === 'GEMINI_API_KEY') {
          return line.substring(idx + 1).trim();
        }
      }
    }
  } catch {}
  return process.env.GEMINI_API_KEY || '';
}

describe('Gemini Copilot Functional Integration Tests', () => {
  const apiKey = getApiKey();

  test('Missing API key returns HTTP 503 with helpful configuration notice', async () => {
    const originalKey = process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_API_KEY;

    const { POST } = await import('@/app/api/copilot/route');
    const req = new Request('http://localhost:3000/api/copilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Hello AERIS',
        location: { name: 'Kolkata', latitude: 22.57, longitude: 88.36 },
      }),
    });

    const res = await POST(req as any);
    assert.equal(res.status, 503);
    const body = await res.json();
    assert.ok(body.error.includes('GEMINI_API_KEY'));

    if (originalKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = originalKey;
  });

  test('Invalid request body returns HTTP 400 with validation details', async () => {
    process.env.GEMINI_API_KEY = apiKey;
    const { POST } = await import('@/app/api/copilot/route');
    const req = new Request('http://localhost:3000/api/copilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: '', // Too short (< 2 chars)
        location: { name: '', latitude: 999, longitude: 999 }, // Invalid coords
      }),
    });

    const res = await POST(req as any);
    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.error, 'Invalid Copilot request.');
    assert.ok(body.details);
  });

  test('Live Gemini 3.5 Flash-Lite generates grounded environmental response', {
    skip: !apiKey ? 'Live Gemini smoke test needs GEMINI_API_KEY; not verified by CI' : false,
  }, async () => {

    process.env.GEMINI_API_KEY = apiKey;
    const { POST } = await import('@/app/api/copilot/route');
    const req = new Request('http://localhost:3000/api/copilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Is it safe for my child with asthma to play outdoors in Park Street this morning?',
        location: {
          name: 'Kolkata, WB — Park Street',
          latitude: 22.5448,
          longitude: 88.3426,
        },
      }),
    });

    const res = await POST(req as any);
    assert.equal(res.status, 200);

    const body = await res.json();
    assert.equal(body.model, 'gemini-3.5-flash-lite');
    assert.ok(typeof body.answer === 'string' && body.answer.length > 20);
    assert.ok(body.grounding);
    assert.ok(body.grounding.location);
    assert.ok(Array.isArray(body.grounding.sources));
    assert.ok(body.generatedAt);

    // Security check: Confirm zero credentials in response body
    const rawResponse = JSON.stringify(body);
    assert.equal(rawResponse.includes(apiKey), false, 'API key must never appear in response body');
  });
});
