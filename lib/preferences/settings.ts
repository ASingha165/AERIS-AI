import { z } from 'zod';

export const SettingsPreferencesSchema = z.object({
  defaultLocation: z.enum(['Kolkata Park Street', 'Kolkata Salt Lake', 'Mumbai BKC', 'Delhi Anand Vihar']),
  aqiStandard: z.enum(['CPCB-NAQI', 'US-EPA']),
  alertThreshold: z.number().int().min(80).max(250),
  emailAlerts: z.boolean(),
  pushAlerts: z.boolean(),
  dataSourcePriority: z.enum(['cpcb-first', 'open-meteo-blend']),
});
export type SettingsPreferences = z.infer<typeof SettingsPreferencesSchema>;

export const DEFAULT_SETTINGS_PREFERENCES: SettingsPreferences = {
  defaultLocation: 'Kolkata Park Street',
  aqiStandard: 'CPCB-NAQI',
  alertThreshold: 150,
  emailAlerts: true,
  pushAlerts: true,
  dataSourcePriority: 'cpcb-first',
};
export const SETTINGS_STORAGE_KEY = 'aeris.settings.v1';
type BrowserStorage = Pick<Storage, 'getItem' | 'setItem'>;

/** Read validated preferences from the current browser only. */
export function loadSettingsPreferences(storage: BrowserStorage): SettingsPreferences {
  try {
    const raw = storage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS_PREFERENCES;
    const parsed = SettingsPreferencesSchema.safeParse(JSON.parse(raw));
    return parsed.success ? { ...DEFAULT_SETTINGS_PREFERENCES, ...parsed.data } : DEFAULT_SETTINGS_PREFERENCES;
  } catch {
    return DEFAULT_SETTINGS_PREFERENCES;
  }
}

/** Persist only non-sensitive UI preferences in the current browser. */
export function saveSettingsPreferences(storage: BrowserStorage, preferences: SettingsPreferences): void {
  storage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(SettingsPreferencesSchema.parse(preferences)));
}
