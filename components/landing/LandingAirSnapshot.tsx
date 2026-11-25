'use client';
import Link from 'next/link';
import { useAirQuality } from '@/lib/context/AirQualityContext';

export function LandingAirSnapshot() {
  const { data, isLoading, error, isDemoMode, selectedLocation } = useAirQuality();
  const metric = data?.observations['PM2.5'];
  const valid = metric && Number.isFinite(metric.value) ? metric : null;
  const aqi = !isDemoMode && data?.aqi.status === 'CALCULATED' ? data.aqi.value : null;
  return (
    <section aria-label="Current air-quality information" className="mt-14 mx-auto max-w-3xl rounded-2xl border border-[#1F334E] bg-[#142235]/90 p-4 text-left">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-on-surface">{selectedLocation.name}</p>
          <p role="status" className="mt-1 text-xs text-on-surface-variant">
            {isDemoMode ? 'Demonstration mode — not real measurements.'
              : isLoading ? 'Retrieving environmental data…'
              : error ? 'Environmental service unavailable.'
              : valid ? `PM2.5: ${valid.value.toFixed(1)} ${valid.unit} · ${valid.observationType === 'MEASURED_STATION' ? 'Monitoring station' : 'Open-Meteo CAMS model'}`
              : 'No current pollutant measurement available.'}
          </p>
          {!isDemoMode && valid && <p className="mt-1 text-[11px] text-on-surface-variant">Source: {valid.sourceName} · {valid.timestamp}. Modeled forecasts are not physical observations.</p>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="rounded-lg bg-[#101C2B] px-3 py-2 text-xs text-on-surface">CPCB AQI: <strong>{aqi ?? 'Unavailable'}</strong></p>
          <Link href="/dashboard" className="rounded-lg bg-primary-container px-3 py-2 text-xs font-semibold text-[#003829]">View sources →</Link>
        </div>
      </div>
      <p className="mt-3 text-[11px] text-on-surface-variant">No outdoor hour is guaranteed safe. AQI is withheld without sufficient statutory averaging data.</p>
    </section>
  );
}