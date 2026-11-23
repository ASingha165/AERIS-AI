import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { FreshnessService } from '@/lib/air-quality/services/freshness-service';

describe('FreshnessService', () => {
  test('Freshness threshold categorization', () => {
    const now = Date.now();
    assert.equal(FreshnessService.getFreshness(new Date(now - 30 * 60 * 1000).toISOString()), 'LIVE');
    assert.equal(FreshnessService.getFreshness(new Date(now - 4 * 60 * 60 * 1000).toISOString()), 'RECENT');
    assert.equal(FreshnessService.getFreshness(new Date(now - 24 * 60 * 60 * 1000).toISOString()), 'STALE');
    assert.equal(FreshnessService.getFreshness(new Date(now - 72 * 60 * 60 * 1000).toISOString()), 'UNAVAILABLE');
    assert.equal(FreshnessService.getFreshness(null), 'UNAVAILABLE');
    assert.equal(FreshnessService.getFreshness(undefined), 'UNAVAILABLE');
    assert.equal(FreshnessService.getFreshness('not-a-date'), 'UNAVAILABLE');
  });

  test('Small future timestamp drift is tolerated', () => {
    const thirtyMinutesAhead = new Date(Date.now() + 30 * 60 * 1000).toISOString();
    assert.equal(FreshnessService.getFreshness(thirtyMinutesAhead), 'LIVE');
  });

  test('Materially future-dated timestamps are unavailable', () => {
    const twoHoursAhead = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
    assert.equal(FreshnessService.getFreshness(twoHoursAhead), 'UNAVAILABLE');
  });

  test('Format time difference display', () => {
    const now = Date.now();
    assert.equal(FreshnessService.formatTimeDifference(new Date(now - 30 * 1000).toISOString()), 'Just now');
    assert.equal(FreshnessService.formatTimeDifference(new Date(now - 15 * 60 * 1000).toISOString()), '15m ago');
    assert.equal(FreshnessService.formatTimeDifference(new Date(now - 3 * 60 * 60 * 1000).toISOString()), '3h ago');
    assert.equal(FreshnessService.formatTimeDifference(new Date(now - 48 * 60 * 60 * 1000).toISOString()), '2d ago');
    assert.equal(FreshnessService.formatTimeDifference(null), 'No sync timestamp');
  });
});
