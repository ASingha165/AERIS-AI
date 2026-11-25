'use client';

import { useMemo, useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ActivitySelector } from '@/components/planner/ActivitySelector';
import { useAirQuality } from '@/lib/context/AirQualityContext';
import { DEMO_ROUTINE_ACTIVITIES } from '@/lib/demo-data';
import type { RoutineActivity } from '@/types/planner';

const kolkataDate = (date: Date) =>
  new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Kolkata' }).format(date);

/** Relative PM2.5 forecast comparison. Not a health/safety certification. */
export default function PlannerPage() {
  const [selectedActivity, setSelectedActivity] = useState<RoutineActivity>(DEMO_ROUTINE_ACTIVITIES[0]);
  const [targetDate, setTargetDate] = useState<'today' | 'tomorrow'>('today');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const { data, isDemoMode, isLoading, error, selectedLocation } = useAirQuality();

  const today = kolkataDate(new Date());
  const tomorrow = kolkataDate(new Date(Date.now() + 86400000));
  const date = targetDate === 'today' ? today : tomorrow;

  const candidates = useMemo(() => {
    if (!data || isDemoMode) return [];
    return data.forecast
      .filter(point => point.time.slice(0, 10) === date)
      .filter(point => Number.isFinite(point.pm25) && point.pm25 !== null && point.pm25 >= 0)
      .filter(point => point.hour >= 6 && point.hour <= 21)
      .map(point => ({ time: point.time, hour: point.hour, pm25: point.pm25 as number }))
      .sort((a, b) => a.pm25 - b.pm25 || a.hour - b.hour);
  }, [data, date, isDemoMode]);

  const preferred = candidates.length >= 3 ? candidates[0] : null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <header>
          <p className="text-xs font-semibold uppercase tracking-widest text-secondary">CAMS modeled forecast comparison</p>
          <h1 className="mt-2 text-3xl font-bold text-on-surface">Plan Around the Air.</h1>
          <p className="mt-2 text-sm text-on-surface-variant">
            Compare relative modeled PM2.5 concentrations for {selectedLocation.name}. No hour is guaranteed safe.
          </p>
        </header>

        <div className="flex items-start gap-3 rounded-xl border border-[#1F334E] bg-[#101C2B] p-4 text-xs text-on-surface-variant">
          <ShieldAlert className="h-5 w-5 shrink-0 text-warning" aria-hidden />
          <p>Open-Meteo CAMS modeled atmospheric values are not local ground measurements. This tool does not calculate inhaled dose, official AQI, or individual clinical risk. Follow relevant public-health advice.</p>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <ActivitySelector
              activities={DEMO_ROUTINE_ACTIVITIES}
              selectedActivityId={selectedActivity.id}
              onSelectActivity={setSelectedActivity}
              targetDate={targetDate}
              onChangeTargetDate={setTargetDate}
              durationMinutes={durationMinutes}
              onChangeDuration={setDurationMinutes}
            />
          </div>
          <section aria-label="Compared forecast hours" className="space-y-4 rounded-2xl border border-[#1F334E] bg-[#142235] p-6 lg:col-span-8">
            <h2 className="text-lg font-semibold text-on-surface">Relative forecast outlook · {date}</h2>
            <p role="status" className="text-sm text-on-surface-variant">
              {isDemoMode ? 'Demonstration mode is active. Live forecast suggestions are unavailable.'
                : isLoading ? 'Loading modeled forecast…'
                : error ? 'Forecast request failed; no activity period can be recommended.'
                : preferred ? `Comparatively lower modeled PM2.5 at ${preferred.hour.toString().padStart(2, '0')}:00 (forecast local time): ${preferred.pm25.toFixed(1)} µg/m³.`
                : 'Insufficient comparable forecast data for this day. No period recommended.'}
            </p>
            <p className="text-xs text-on-surface-variant">For {selectedActivity.name} ({durationMinutes} minutes). Lowest modeled concentration does not mean a safe time, and does not quantify exposure reduction.</p>
            {candidates.length >= 3 && (
              <div className="grid gap-3 sm:grid-cols-3">
                {candidates.slice(0, 3).map(point => (
                  <div key={point.time} className="rounded-xl border border-[#1F334E] bg-[#101C2B] p-4">
                    <p className="text-sm font-semibold text-on-surface">{point.hour.toString().padStart(2, '0')}:00</p>
                    <p className="mt-2 text-xl font-bold text-primary">{point.pm25.toFixed(1)} <span className="text-xs font-normal">µg/m³ PM2.5</span></p>
                    <p className="mt-1 text-[11px] text-on-surface-variant">CAMS atmospheric model</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
