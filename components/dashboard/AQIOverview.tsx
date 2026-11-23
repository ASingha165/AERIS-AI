'use client';

import React from 'react';
import {
  AlertTriangle,
  Radio,
  CheckCircle2,
  Clock,
  Layers,
  Info,
} from 'lucide-react';
import { AQIGauge } from './AQIGauge';
import { AirQualityReading, AirQualityResponse } from '@/types/air-quality';
import { getAQITheme } from '@/lib/utils';
import { FreshnessService } from '@/lib/air-quality/services/freshness-service';

interface AQIOverviewProps {
  data?: AirQualityResponse | null;
  reading?: AirQualityReading;
}

export function AQIOverview({ data, reading }: AQIOverviewProps) {
  // Use live data if provided, otherwise fallback to demonstration reading
  const aqiValue = data ? data.aqi.value : reading?.aqi ?? null;
  const categoryName = data ? data.aqi.category ?? 'Uncalculated' : reading?.category ?? 'Unknown';
  const theme = getAQITheme(aqiValue);

  const locationTitle = data
    ? `${data.location.name}${data.location.state ? `, ${data.location.state}` : ''} — ${data.location.country}`
    : reading?.location.name ?? 'Unknown Location';

  const statusReason = data
    ? data.aqi.statusReason
    : reading?.primaryHazardDriver ?? 'Telemetry snapshot';

  const syncRecency = data
    ? FreshnessService.formatTimeDifference(data.updatedAt)
    : reading?.syncRecency ?? 'Just now';

  const isLiveObservation = data?.status === 'LIVE_OBSERVATION' || data?.status === 'PARTIAL_OBSERVATION';

  const observationTypeLabel = data
    ? data.status === 'LIVE_OBSERVATION'
      ? 'Ground Station'
      : data.status === 'PARTIAL_OBSERVATION'
      ? 'Hybrid Telemetry'
      : 'CAMS Atmospheric Model'
    : 'Simulated Demo';

  const providerAttribution = data
    ? data.sources.map((s) => s.provider).join(' + ') || 'Open-Meteo'
    : 'CPCB OpenAQ Ref';

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#142235] border border-[#1F334E] p-6 lg:p-7 shadow-surface-card glow-border">
      {/* Subtle atmospheric ambient glow */}
      <div className="absolute -top-24 left-1/4 w-96 h-96 rounded-full bg-primary-container/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 right-10 w-96 h-96 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 lg:gap-8">
        {/* Left: Gauge and Category Callout */}
        <div className="flex flex-col sm:flex-row items-center gap-6 shrink-0">
          <AQIGauge aqi={aqiValue} label={data?.aqi.status === 'CALCULATED' ? 'CPCB NAQI' : 'Indicative Index'} />

          <div className="flex flex-col gap-2 text-center sm:text-left">
            <div className="inline-flex items-center self-center sm:self-start gap-2 px-3 py-1 rounded-full bg-[#101C2B] border border-[#1F334E] shadow-inner">
              <span
                className="w-2.5 h-2.5 rounded-full animate-pulse"
                style={{ backgroundColor: theme.hex }}
              />
              <span
                className="font-heading text-xs font-bold uppercase tracking-wider"
                style={{ color: theme.hex }}
              >
                {categoryName}
              </span>
              {data?.aqi.status === 'CALCULATED' && (
                <span className="font-mono text-[10px] text-primary border-l border-[#1F334E] pl-2">
                  Official Standard
                </span>
              )}
            </div>

            <h2 className="font-heading text-lg lg:text-xl text-on-surface font-semibold max-w-md">
              {locationTitle}
            </h2>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#101C2B] border border-[#1F334E] max-w-md text-left">
              {data?.aqi.status === 'INSUFFICIENT_DATA' ? (
                <Info className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
              )}
              <div className="text-xs text-on-surface-variant leading-relaxed">
                <p>{statusReason}</p>
                {data?.aqi.dominantPollutant && (
                  <p className="font-mono text-[11px] text-primary mt-1">
                    Dominant sub-index driver: <span className="font-bold">{data.aqi.dominantPollutant}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Telemetry Grid & Provenance Badges */}
        <div className="flex flex-col justify-between gap-4 lg:border-l lg:border-[#1F334E] lg:pl-8 flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Sync Recency */}
            <div className="p-3 rounded-xl bg-[#101C2B] border border-[#1F334E] flex flex-col">
              <span className="font-heading text-[10px] text-outline uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3 h-3" /> Sync Recency
              </span>
              <span className="font-heading text-sm text-on-surface font-semibold mt-1">
                {syncRecency}
              </span>
              <span className="font-mono text-[10px] text-primary flex items-center gap-1 mt-0.5 truncate">
                <span className={`w-1.5 h-1.5 rounded-full ${isLiveObservation ? 'bg-primary' : 'bg-secondary'}`} />
                {providerAttribution}
              </span>
            </div>

            {/* Telemetry Vector */}
            <div className="p-3 rounded-xl bg-[#101C2B] border border-[#1F334E] flex flex-col">
              <span className="font-heading text-[10px] text-outline uppercase tracking-wider flex items-center gap-1">
                <Radio className="w-3 h-3" /> Provenance
              </span>
              <span className="font-heading text-sm text-secondary font-semibold mt-1">
                {observationTypeLabel}
              </span>
              <span className="font-mono text-[10px] text-outline mt-0.5 truncate">
                {data?.sources[0]?.modelResolution || (isLiveObservation ? 'Physical Station' : 'Synthetic Node')}
              </span>
            </div>

            {/* Standard Verification */}
            <div className="p-3 rounded-xl bg-[#101C2B] border border-[#1F334E] flex flex-col col-span-2 sm:col-span-1">
              <span className="font-heading text-[10px] text-outline uppercase tracking-wider flex items-center gap-1">
                <Layers className="w-3 h-3" /> CPCB NAQI Status
              </span>
              <span className="font-heading text-sm text-on-surface font-semibold mt-1">
                {data?.aqi.status === 'CALCULATED' ? 'Certified NAQI' : data ? 'Indicative Sub-Index' : 'Illustrative'}
              </span>
              <span className="font-mono text-[10px] text-outline mt-0.5">
                {data ? `${data.aqi.qualifyingPollutantsCount} Pollutants Monitored` : 'Demonstration Data'}
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#1F334E]">
            <div className="flex items-center gap-2 text-xs font-mono text-outline">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span>Standard: India CPCB NAQI (Particulate-Mandated)</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#101C2B] text-on-surface-variant border border-[#1F334E]">
                {data?.sources[0]?.datasetName || 'Copernicus Atmospheric Ensemble'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
