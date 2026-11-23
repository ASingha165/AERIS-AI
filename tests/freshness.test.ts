import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { FreshnessService } from '@/lib/air-quality/services/freshness-service';

describe('FreshnessService', () => {
  test('Freshness threshold categorization', () => {
    const now = Date.now();

    // Less than 2 hours: LIVE
    const liveIso = new Date(now - 30 * 60 * 1000).toISOString(); // 30m ago
    assert.equal(FreshnessService.getFreshness(liveIso), 'LIVE');

    // 2 - 12 hours: RECENT
    const recentIso = new Date(now - 4 * 60 * 60 * 1000).toISOString(); // 4h ago
    assert.equal(FreshnessService.getFreshness(recentIso), 'RECENT');

    // 12 - 48 hours: STALE
    const staleIso = new Date(now - 24 * 60 * 60 * 1000).toISOString(); // 24h ago
    assert.equal(FreshnessService.getFreshness(staleIso), 'STALE');

    // > 48 hours: UNAVAILABLE
    const oldIso = new Date(now - 72 * 60 * 60 * 1000).toISOString(); // 3 days ago
    assert.equal(FreshnessService.getFreshness(oldIso), 'UNAVAILABLE');

    // Null or invalid: UNAVAILABLE
    assert.equal(FreshnessService.getFreshness(null), 'UNAVAILABLE');
    assert.equal(FreshnessService.getFreshness(undefined), 'UNAVAILABLE');
    assert.equal(FreshnessService.getFreshness('not-a-date'), 'UNAVAILABLE');
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
