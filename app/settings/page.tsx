'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  Bell,
  MapPin,
  Database,
  Save,
  CheckCircle2,
} from 'lucide-react';
import {
  DEFAULT_SETTINGS_PREFERENCES,
  loadSettingsPreferences,
  saveSettingsPreferences,
} from '@/lib/preferences/settings';

export default function SettingsPage() {
  const [defaultLocation, setDefaultLocation] = useState(DEFAULT_SETTINGS_PREFERENCES.defaultLocation);
  const [aqiStandard, setAqiStandard] = useState<'CPCB-NAQI' | 'US-EPA'>(DEFAULT_SETTINGS_PREFERENCES.aqiStandard);
  const [alertThreshold, setAlertThreshold] = useState<number>(DEFAULT_SETTINGS_PREFERENCES.alertThreshold);
  const [emailAlerts, setEmailAlerts] = useState<boolean>(DEFAULT_SETTINGS_PREFERENCES.emailAlerts);
  const [pushAlerts, setPushAlerts] = useState<boolean>(DEFAULT_SETTINGS_PREFERENCES.pushAlerts);
  const [dataSourcePriority, setDataSourcePriority] = useState<'cpcb-first' | 'open-meteo-blend'>(DEFAULT_SETTINGS_PREFERENCES.dataSourcePriority);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    const preferences = loadSettingsPreferences(window.localStorage);
    setDefaultLocation(preferences.defaultLocation);
    setAqiStandard(preferences.aqiStandard);
    setAlertThreshold(preferences.alertThreshold);
    setEmailAlerts(preferences.emailAlerts);
    setPushAlerts(preferences.pushAlerts);
    setDataSourcePriority(preferences.dataSourcePriority);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      saveSettingsPreferences(window.localStorage, {
        defaultLocation,
        aqiStandard,
        alertThreshold,
        emailAlerts,
        pushAlerts,
        dataSourcePriority,
      });
      setSaveError(null);
      setSavedSuccess(true);
      window.setTimeout(() => setSavedSuccess(false), 2500);
    } catch {
      setSavedSuccess(false);
      setSaveError('Could not save preferences in this browser. Check available site storage and try again.');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 font-heading text-[10px] text-primary uppercase tracking-widest mb-1">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>Platform Configuration</span>
          </div>
          <h1 className="font-heading text-2xl lg:text-3xl font-bold text-on-surface tracking-tight">
            Application Settings
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Configure telemetry sources, vulnerability thresholds, and notification alerts.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Section 1: Monitoring Grid & Telemetry Preferences */}
          <div className="p-6 rounded-2xl bg-[#142235] border border-[#1F334E] shadow-surface-card space-y-4">
            <div className="flex items-center gap-2 font-heading text-base font-semibold text-on-surface">
              <MapPin className="w-4 h-4 text-primary-container" />
              <span>Location & Regional Standards</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-heading text-[10px] uppercase text-outline block mb-1.5">
                  Default Monitoring Location
                </label>
                <select
                  value={defaultLocation}
                  onChange={(e) => setDefaultLocation(e.target.value as 'Kolkata Park Street' | 'Kolkata Salt Lake' | 'Mumbai BKC' | 'Delhi Anand Vihar')}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#101C2B] text-on-surface border border-[#1F334E] focus:outline-none focus:border-primary-container"
                >
                  <option value="Kolkata Park Street">Kolkata, WB — Park Street Ward 63</option>
                  <option value="Kolkata Salt Lake">Kolkata, WB — Salt Lake Sector V</option>
                  <option value="Mumbai BKC">Mumbai, MH — Bandra Kurla Complex</option>
                  <option value="Delhi Anand Vihar">Delhi, DL — Anand Vihar</option>
                </select>
              </div>

              <div>
                <label className="font-heading text-[10px] uppercase text-outline block mb-1.5">
                  Index Calculation Standard
                </label>
                <select
                  value={aqiStandard}
                  onChange={(e) => setAqiStandard(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#101C2B] text-on-surface border border-[#1F334E] focus:outline-none focus:border-primary-container"
                >
                  <option value="CPCB-NAQI">CPCB National Air Quality Index (India Standard)</option>
                  <option value="US-EPA">US EPA Air Quality Index Standard</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Data Source Priority */}
          <div className="p-6 rounded-2xl bg-[#142235] border border-[#1F334E] shadow-surface-card space-y-4">
            <div className="flex items-center gap-2 font-heading text-base font-semibold text-on-surface">
              <Database className="w-4 h-4 text-secondary" />
              <span>Data Source Ingestion Strategy</span>
            </div>

            <div className="space-y-3 text-xs">
              <label className="flex items-start gap-3 p-3.5 rounded-xl bg-[#101C2B] border border-[#1F334E] cursor-pointer">
                <input
                  type="radio"
                  name="sourcePriority"
                  value="cpcb-first"
                  checked={dataSourcePriority === 'cpcb-first'}
                  onChange={(e) => setDataSourcePriority(e.target.value as 'cpcb-first' | 'open-meteo-blend')}
                  className="mt-1 accent-primary-container"
                />
                <div>
                  <span className="font-heading text-xs font-semibold text-on-surface block">
                    CPCB Government Ground Sensors First (Recommended)
                  </span>
                  <span className="text-on-surface-variant">
                    Prioritizes certified local Beta Attenuation Monitors (BAM). Falls back to OpenAQ v3 when nodes delay.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 rounded-xl bg-[#101C2B] border border-[#1F334E] cursor-pointer">
                <input
                  type="radio"
                  name="sourcePriority"
                  value="open-meteo-blend"
                  checked={dataSourcePriority === 'open-meteo-blend'}
                  onChange={(e) => setDataSourcePriority(e.target.value as 'cpcb-first' | 'open-meteo-blend')}
                  className="mt-1 accent-primary-container"
                />
                <div>
                  <span className="font-heading text-xs font-semibold text-on-surface block">
                    Dual-Ensemble Blend (CPCB + Open-Meteo WRF-Chem)
                  </span>
                  <span className="text-on-surface-variant">
                    Merges real-time ground observations with high-resolution numerical reanalysis models for smoother predictive forecasting.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Section 3: Health Threshold Alerts */}
          <div className="p-6 rounded-2xl bg-[#142235] border border-[#1F334E] shadow-surface-card space-y-4">
            <div className="flex items-center gap-2 font-heading text-base font-semibold text-on-surface">
              <Bell className="w-4 h-4 text-warning" />
              <span>Notification & Vulnerability Thresholds</span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-heading text-[10px] uppercase text-outline">
                    Air Hazard Push Alert Trigger (AQI)
                  </span>
                  <span className="font-mono text-warning font-bold">
                    AQI {alertThreshold}+
                  </span>
                </div>
                <input
                  type="range"
                  min={80}
                  max={250}
                  step={10}
                  value={alertThreshold}
                  onChange={(e) => setAlertThreshold(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#1F334E] rounded-lg appearance-none cursor-pointer accent-warning"
                />
                <div className="flex justify-between font-mono text-[10px] text-outline mt-1">
                  <span>80 (Moderate)</span>
                  <span>150 (Sensitive Alert)</span>
                  <span>250 (Severe Hazard)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#101C2B] border border-[#1F334E] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pushAlerts}
                    onChange={(e) => setPushAlerts(e.target.checked)}
                    className="accent-primary-container"
                  />
                  <span className="text-on-surface">Real-time Browser Push Notifications</span>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#101C2B] border border-[#1F334E] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="accent-primary-container"
                  />
                  <span className="text-on-surface">Daily Morning Forecast Digest</span>
                </label>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-between pt-2">
            {saveError ? (
              <span role="alert" className="text-xs font-mono text-danger">{saveError}</span>
            ) : savedSuccess ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-primary">
                <CheckCircle2 className="w-4 h-4" />
                Settings saved successfully
              </span>
            ) : (
              <span className="text-xs font-mono text-outline">
                Saved locally to client preferences
              </span>
            )}

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-container text-[#003829] font-heading text-xs font-bold shadow-glow-primary hover:shadow-glow-primary-lg transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Preferences</span>
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

