'use client';

import React from 'react';
import {
  AlertCircle,
  Cloud,
  Car,
  SunMedium,
  Radio,
  Clock,
  Sparkles,
} from 'lucide-react';
import { ObservationMetric, PollutantMetric, PollutantType } from '@/types/air-quality';
import { cn, getAQITheme } from '@/lib/utils';

interface PollutantCardProps {
  metric?: ObservationMetric;
  demoMetric?: PollutantMetric;
}

export function PollutantCard({ metric, demoMetric }: PollutantCardProps) {
  const pollutant: PollutantType = (metric?.pollutant || demoMetric?.pollutant || 'PM2.5') as PollutantType;
  const fullName = metric?.fullName || demoMetric?.fullName || 'Pollutant';
  const value = metric ? metric.value : demoMetric?.value ?? '--';
  const unit = metric?.unit || demoMetric?.unit || 'µg/m³';
  const isStation = metric?.observationType === 'MEASURED_STATION';
  const isModeled = metric?.observationType === 'MODELED_FORECAST';

  const subIndex = metric?.subIndex ?? null;
  const subIndexCategory = metric?.subIndexCategory ?? null;
  const subIndexTheme = getAQITheme(subIndex);

  const getIcon = () => {
    switch (pollutant) {
      case 'PM2.5':
        return <AlertCircle className="w-5 h-5 text-danger" />;
      case 'PM10':
        return <Cloud className="w-5 h-5 text-warning" />;
      case 'NO2':
        return <Car className="w-5 h-5 text-secondary" />;
      case 'O3':
        return <SunMedium className="w-5 h-5 text-primary" />;
      default:
        return <AlertCircle className="w-5 h-5 text-outline" />;
    }
  };

  const getMetricColor = () => {
    switch (pollutant) {
      case 'PM2.5':
        return '#F16B77';
      case 'PM10':
        return '#F6C453';
      case 'NO2':
        return '#53C7F5';
      case 'O3':
        return '#37E6B5';
      default:
        return '#85948C';
    }
  };

  const color = getMetricColor();

  return (
    <div className="p-5 rounded-xl bg-[#142235] border border-[#1F334E] flex flex-col justify-between shadow-surface-card hover:border-primary/40 transition-all group">
      {/* Top row: Name & Standard tag */}
      <div>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-lg font-bold text-on-surface">
                {pollutant}
              </span>

              {/* Sub-index or Standard Benchmark Pill */}
              {subIndex !== null ? (
                <span
                  className="font-mono text-[10px] px-2 py-0.5 rounded font-semibold"
                  style={{
                    backgroundColor: `${subIndexTheme.hex}18`,
                    color: subIndexTheme.hex,
                    border: `1px solid ${subIndexTheme.hex}30`,
                  }}
                  title={`Calculated CPCB Sub-index: ${subIndex} (${subIndexCategory})`}
                >
                  Sub-Index {subIndex}
                </span>
              ) : demoMetric ? (
                <span
                  className="font-mono text-[10px] px-2 py-0.5 rounded font-semibold"
                  style={{
                    backgroundColor: `${color}18`,
                    color: color,
                    border: `1px solid ${color}30`,
                  }}
                >
                  {demoMetric.standardComparison}
                </span>
              ) : (
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#101C2B] text-outline border border-[#1F334E]">
                  Pending 24h
                </span>
              )}
            </div>
            <p className="text-xs text-outline mt-0.5">{fullName}</p>
          </div>
          <div className="p-1.5 rounded-lg bg-[#101C2B] border border-[#1F334E]">
            {getIcon()}
          </div>
        </div>

        {/* Middle row: Numerical value */}
        <div className="my-4 flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="font-heading text-3xl font-bold text-on-surface tracking-tight">
              {value}
            </span>
            <span className="font-mono text-xs text-outline">{unit}</span>
          </div>

          {/* Freshness / Recency indicator */}
          {metric && (
            <div className="flex items-center gap-1 font-mono text-[11px]">
              <span
                className={cn(
                  'w-1.5 h-1.5 rounded-full',
                  metric.freshness === 'LIVE' ? 'bg-primary animate-pulse' : 'bg-outline'
                )}
              />
              <span className={metric.freshness === 'LIVE' ? 'text-primary' : 'text-outline'}>
                {metric.freshness}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom row: Provenance attribution badge */}
      <div className="pt-3 border-t border-[#1F334E]/60 flex items-center justify-between text-[11px] font-mono">
        {isStation ? (
          <div className="flex items-center gap-1.5 text-primary truncate">
            <Radio className="w-3 h-3 shrink-0" />
            <span className="truncate" title={`Physical station: ${metric?.station?.name || 'OpenAQ'}`}>
              {metric?.station?.name ? `Stn: ${metric.station.name}` : 'Ground Station (OpenAQ)'}
            </span>
          </div>
        ) : isModeled ? (
          <div
            className="flex items-center gap-1.5 text-secondary truncate"
            title="Modeled atmospheric dispersion estimate (Open-Meteo CAMS) — not a physical ground station measurement"
          >
            <Sparkles className="w-3 h-3 shrink-0" />
            <span className="truncate">MODELED_FORECAST · CAMS</span>
          </div>
        ) : (
          <span className="text-outline">Illustrative Dataset</span>
        )}

        {metric?.averagingHoursExpected && (
          <span className="text-outline shrink-0 ml-2">
            {metric.averagingHoursExpected}h avg
          </span>
        )}
      </div>
    </div>
  );
}
