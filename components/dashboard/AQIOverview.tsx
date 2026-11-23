'use client';

import React from 'react';
import {
  AlertTriangle,
  Map,
  Share2,
  Sliders,
  Radio,
  Sparkles,
  Wind,
} from 'lucide-react';
import { AQIGauge } from './AQIGauge';
import { AirQualityReading } from '@/types/air-quality';
import { getAQITheme } from '@/lib/utils';

interface AQIOverviewProps {
  reading: AirQualityReading;
}

export function AQIOverview({ reading }: AQIOverviewProps) {
  const theme = getAQITheme(reading.aqi);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#142235] border border-[#1F334E] p-6 lg:p-7 shadow-surface-card glow-border">
      {/* Subtle atmospheric ambient glow */}
      <div className="absolute -top-24 left-1/4 w-96 h-96 rounded-full bg-primary-container/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 right-10 w-96 h-96 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 lg:gap-8">
        {/* Left: Gauge and Category Callout */}
        <div className="flex flex-col sm:flex-row items-center gap-6 shrink-0">
          <AQIGauge aqi={reading.aqi} />

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
                {reading.category}
              </span>
            </div>

            <h2 className="font-heading text-lg lg:text-xl text-on-surface font-semibold max-w-md">
              {reading.location.name}
            </h2>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#101C2B] border border-[#1F334E] max-w-md text-left">
              <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {reading.primaryHazardDriver}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Telemetry Grid & Action Matrix */}
        <div className="flex flex-col justify-between gap-4 lg:border-l lg:border-[#1F334E] lg:pl-8 flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Sync Recency */}
            <div className="p-3 rounded-xl bg-[#101C2B] border border-[#1F334E] flex flex-col">
              <span className="font-heading text-[10px] text-outline uppercase tracking-wider">
                Sync Recency
              </span>
              <span className="font-heading text-sm text-on-surface font-semibold mt-1">
                {reading.syncRecency}
              </span>
              <span className="font-mono text-[10px] text-primary flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                CPCB OpenAQ
              </span>
            </div>

            {/* AI Model Trust */}
            <div className="p-3 rounded-xl bg-[#101C2B] border border-[#1F334E] flex flex-col">
              <span className="font-heading text-[10px] text-outline uppercase tracking-wider">
                AI Model Trust
              </span>
              <span className="font-heading text-sm text-secondary font-semibold mt-1">
                {reading.aiModelTrustPercent}%
              </span>
              <span className="font-mono text-[10px] text-outline mt-0.5">
                Dual-Ensemble
              </span>
            </div>

            {/* Ambient Vector */}
            <div className="p-3 rounded-xl bg-[#101C2B] border border-[#1F334E] flex flex-col col-span-2 sm:col-span-1">
              <span className="font-heading text-[10px] text-outline uppercase tracking-wider">
                Ambient Vector
              </span>
              <span className="font-heading text-sm text-on-surface font-semibold mt-1">
                {reading.weatherAmbient.temperatureC}°C • {reading.weatherAmbient.relativeHumidityPercent}% RH
              </span>
              <span className="font-mono text-[10px] text-outline mt-0.5">
                Wind: {reading.weatherAmbient.windSpeedKmh} km/h {reading.weatherAmbient.windDirection}
              </span>
            </div>
          </div>

          {/* Quick Action Ribbon */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <button
              type="button"
              className="flex-1 min-w-[130px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary-container text-[#003829] font-heading text-xs font-bold hover:shadow-glow-primary transition-all"
            >
              <Map className="w-4 h-4 text-[#003829]" />
              <span>Sensor Map</span>
            </button>
            <button
              type="button"
              className="flex-1 min-w-[130px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#19202D] hover:bg-[#232A38] text-on-surface font-heading text-xs border border-[#1F334E] transition-colors"
            >
              <Share2 className="w-4 h-4 text-secondary" />
              <span>Share Report</span>
            </button>
            <button
              type="button"
              className="p-2.5 rounded-xl bg-[#19202D] hover:bg-[#232A38] text-on-surface border border-[#1F334E] transition-colors"
              title="Calibrate Home Monitors"
            >
              <Sliders className="w-4 h-4 text-primary" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

