import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_SETTINGS_PREFERENCES,
  loadSettingsPreferences,
  saveSettingsPreferences,
  SETTINGS_STORAGE_KEY,
} from '@/lib/preferences/settings';

function createStorage(initial?: Record<string, string>) {
  const values = new Map(Object.entries(initial ?? {}));
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    values,
  };
}

describe('settings preferences storage', () => {
  test('returns defaults when no browser preference exists', () => {
    assert.deepEqual(loadSettingsPreferences(createStorage()), DEFAULT_SETTINGS_PREFERENCES);
  });

  test('round-trips validated preferences', () => {
    const storage = createStorage();
    const updated = { ...DEFAULT_SETTINGS_PREFERENCES, defaultLocation: 'Kolkata Salt Lake' as const, alertThreshold: 180, pushAlerts: false };
    saveSettingsPreferences(storage, updated);
    assert.deepEqual(loadSettingsPreferences(storage), updated);
    assert.ok(storage.values.has(SETTINGS_STORAGE_KEY));
  });

  test('falls back safely for malformed or invalid stored JSON', () => {
    const malformed = createStorage({ [SETTINGS_STORAGE_KEY]: '{not-json' });
    const invalid = createStorage({ [SETTINGS_STORAGE_KEY]: JSON.stringify({ ...DEFAULT_SETTINGS_PREFERENCES, alertThreshold: 900 }) });
    assert.deepEqual(loadSettingsPreferences(malformed), DEFAULT_SETTINGS_PREFERENCES);
    assert.deepEqual(loadSettingsPreferences(invalid), DEFAULT_SETTINGS_PREFERENCES);
  });

  test('rejects invalid preferences before saving', () => {
    const storage = createStorage();
    assert.throws(() => saveSettingsPreferences(storage, { ...DEFAULT_SETTINGS_PREFERENCES, alertThreshold: 999 }));
    assert.equal(storage.values.has(SETTINGS_STORAGE_KEY), false);
  });
});
