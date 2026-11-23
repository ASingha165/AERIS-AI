'use client';

import React from 'react';
import { DiurnalForecastPoint } from '@/types/air-quality';
import { cn, getAQITheme } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

interface PollutionTimelineProps {
  forecastData: DiurnalForecastPoint[];
  optimalStartHour?: number;
  optimalEndHour?: number;
}

export function PollutionTimeline({
  forecastData,
  optimalStartHour = 13.5,
  optimalEndHour = 16,
}: PollutionTimelineProps) {
  return (
    <div className="bg-[#142235] p-6 rounded-2xl border border-[#1F334E] shadow-surface-card space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading text-base font-semibold text-on-surface">
              Hourly Exposure Horizon
            </h3>
            <span className="font-heading text-[10px] px-2 py-0.5 rounded bg-primary-container/20 text-primary-container font-bold border border-primary-container/30">
              Inhalation Risk Matrix
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Hourly simulation showing thermal boundary height vs ground pollutant concentration.
          </p>
        </div>
      </div>

      {/* Horizontal timeline cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 pt-2">
        {forecastData.slice(0, 12).map((item, idx) => {
          const theme = getAQITheme(item.aqi);
          const isOptimalWindow = item.hour >= optimalStartHour && item.hour <= optimalEndHour;

          return (
            <div
              key={idx}
              className={cn(
                'p-3 rounded-xl border flex flex-col justify-between transition-all text-xs',
                isOptimalWindow
                  ? 'bg-primary-container/15 border-primary-container shadow-glow-primary'
                  : 'bg-[#101C2B] border-[#1F334E]'
              )}
            >
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-on-surface-variant">{item.time}</span>
                {isOptimalWindow && (
                  <span className="text-[9px] font-bold uppercase tracking-wider text-primary-container">
                    Optimal
                  </span>
                )}
              </div>

              <div className="my-2 flex items-baseline gap-1">
                <span className="font-heading text-lg font-bold" style={{ color: theme.hex }}>
                  {item.aqi}
                </span>
                <span className="font-mono text-[10px] text-outline">AQI</span>
              </div>

              <div className="text-[10px] font-mono text-outline border-t border-[#1F334E]/50 pt-1.5 flex justify-between">
                <span>PM2.5</span>
                <span className="text-on-surface">{item.pm25} µg</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

