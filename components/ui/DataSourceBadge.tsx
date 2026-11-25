'use client';

import React from 'react';
import { Database, AlertCircle, ShieldCheck, Sparkles, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAirQuality } from '@/lib/context/AirQualityContext';

interface DataSourceBadgeProps {
  sourceName?: string;
  isSimulated?: boolean;
  timestamp?: string;
  className?: string;
}

export function DataSourceBadge({
  sourceName = 'Open-Meteo / OpenAQ',
  isSimulated = false,
  timestamp = 'Just now',
  className,
}: DataSourceBadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono backdrop-blur-md transition-all',
        isSimulated
          ? 'bg-surface-container-high/90 text-on-surface-variant border border-outline-variant/60 shadow-sm'
          : 'bg-primary-container/15 text-primary border border-primary/30',
        className
      )}
      title={
        isSimulated
          ? 'Illustrative Demonstration Telemetry. Simulated values for testing.'
          : `Live sync from ${sourceName}`
      }
    >
      <div className="flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span
            className={cn(
              'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
              isSimulated ? 'bg-secondary' : 'bg-primary'
            )}
          />
          <span
            className={cn(
              'relative inline-flex rounded-full h-2 w-2',
              isSimulated ? 'bg-secondary' : 'bg-primary'
            )}
          />
        </span>
        <span className="font-semibold text-on-surface">{sourceName}</span>
      </div>

      <span className="text-outline-variant">•</span>
      <span className="text-on-surface-variant">{timestamp}</span>

      {isSimulated ? (
        <span className="px-1.5 py-0.2 rounded text-[10px] uppercase font-bold tracking-wider bg-secondary-container/20 text-secondary">
          Simulated Demo
        </span>
      ) : (
        <span className="px-1.5 py-0.2 rounded text-[10px] uppercase font-bold tracking-wider bg-primary-container/20 text-primary">
          Live Telemetry
        </span>
      )}
    </div>
  );
}

export function DemonstrationNoticeBanner({ className }: { className?: string }) {
  const { isDemoMode, setIsDemoMode, data } = useAirQuality();

  if (isDemoMode) {
    return (
      <div
        className={cn(
          'flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-2.5 rounded-lg bg-surface-container-high/90 border border-outline-variant/50 backdrop-blur-md shadow-sm text-sm',
          className
        )}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <AlertCircle className="w-4 h-4 text-warning shrink-0" />
          <p className="text-xs md:text-sm text-on-surface-variant truncate">
            <span className="font-bold text-warning uppercase tracking-wider font-heading mr-1.5">
              Demonstration Mode:
            </span>
            Currently viewing isolated demonstration telemetry. Switch to live data to fetch real-time atmospheric APIs.
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsDemoMode(false)}
            className="text-xs font-mono font-bold text-primary hover:underline px-2 py-0.5 rounded bg-primary-container/10 border border-primary/30"
          >
            Switch to Live API
          </button>
        </div>
      </div>
    );
  }

  const isForecastOnly = data?.status === 'FORECAST_ONLY';
  const isStationActive = data?.status === 'LIVE_OBSERVATION' || data?.status === 'PARTIAL_OBSERVATION';

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-2.5 rounded-lg backdrop-blur-md shadow-sm text-sm',
        isForecastOnly
          ? 'bg-[#101C2B]/90 border border-secondary/30'
          : 'bg-[#101C2B]/90 border border-primary/20',
        className
      )}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {isForecastOnly ? (
          <AlertCircle className="w-4 h-4 text-secondary shrink-0" />
        ) : (
          <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
        )}
        <p className="text-xs md:text-sm text-on-surface-variant">
          {isForecastOnly ? (
            <>
              <span className="font-bold text-secondary uppercase tracking-wider font-heading mr-1.5">
                Modeled Forecast Fallback (Open-Meteo CAMS):
              </span>
              Ground station observations (OpenAQ) are unavailable. Displaying numerical atmospheric dispersion estimates (MODELED_FORECAST) — not physical station measurements.
            </>
          ) : isStationActive ? (
            <>
              <span className="font-bold text-primary uppercase tracking-wider font-heading mr-1.5">
                Live Environmental Telemetry Active:
              </span>
              Ground station observations (OpenAQ) paired with Open-Meteo Copernicus CAMS forecast. CPCB-methodology applied.
            </>
          ) : (
            <>
              <span className="font-bold text-primary uppercase tracking-wider font-heading mr-1.5">
                Connecting Atmospheric Telemetry:
              </span>
              Synchronizing Open-Meteo Copernicus CAMS dispersion model and optional OpenAQ ground station feed.
            </>
          )}
        </p>
      </div>
      <div className="shrink-0 flex items-center gap-2 font-mono text-xs">
        <span className="px-2 py-0.5 rounded bg-[#142235] text-secondary border border-[#1F334E] text-[11px]">
          {isForecastOnly ? 'MODELED_FORECAST' : data?.status || 'CONNECTING'}
        </span>
        <button
          type="button"
          onClick={() => setIsDemoMode(true)}
          className="text-xs text-outline hover:text-on-surface underline text-[11px]"
        >
          View Demo
        </button>
      </div>
    </div>
  );
}
