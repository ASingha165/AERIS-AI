'use client';

import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  Cloud,
  Car,
  SunMedium,
} from 'lucide-react';
import { PollutantMetric } from '@/types/air-quality';
import { cn } from '@/lib/utils';

interface PollutantCardProps {
  metric: PollutantMetric;
}

export function PollutantCard({ metric }: PollutantCardProps) {
  const getIcon = () => {
    switch (metric.pollutant) {
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
    switch (metric.pollutant) {
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
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-heading text-lg font-bold text-on-surface">
              {metric.pollutant}
            </span>
            <span
              className="font-mono text-[10px] px-2 py-0.5 rounded font-semibold"
              style={{
                backgroundColor: `${color}18`,
                color: color,
                border: `1px solid ${color}30`,
              }}
            >
              {metric.standardComparison}
            </span>
          </div>
          <p className="text-xs text-outline mt-0.5">{metric.fullName}</p>
        </div>
        <div className="p-1.5 rounded-lg bg-[#101C2B] border border-[#1F334E]">
          {getIcon()}
        </div>
      </div>

      {/* Middle row: Numerical value & Trend */}
      <div className="my-4 flex items-baseline justify-between">
        <div className="flex items-baseline gap-1.5">
          <span className="font-heading text-3xl font-bold text-on-surface tracking-tight">
            {metric.value}
          </span>
          <span className="font-mono text-xs text-outline">{metric.unit}</span>
        </div>

        <div className="flex items-center gap-1 font-mono text-xs">
          {metric.trend === 'up' && (
            <span className="text-danger flex items-center gap-0.5 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              +{metric.changeVsYesterdayPercent}%
            </span>
          )}
          {metric.trend === 'down' && (
            <span className="text-primary flex items-center gap-0.5 font-medium">
              <TrendingDown className="w-3.5 h-3.5" />
              {metric.changeVsYesterdayPercent}%
            </span>
          )}
          {metric.trend === 'steady' && (
            <span className="text-on-surface-variant flex items-center gap-0.5">
              <Minus className="w-3.5 h-3.5" />
              Steady
            </span>
          )}
        </div>
      </div>

      {/* Bottom Sparkline SVG */}
      <div className="pt-2">
        <div className="h-9 w-full">
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 160 36">
            <defs>
              <linearGradient id={`grad-${metric.pollutant}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.25" />
                <stop offset="100%" stopColor={color} stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d="M0,28 Q30,24 60,18 T110,22 T160,8 L160,36 L0,36 Z"
              fill={`url(#grad-${metric.pollutant})`}
            />
            <path
              d="M0,28 Q30,24 60,18 T110,22 T160,8"
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="flex justify-between items-center text-outline font-heading text-[10px] mt-1 pt-1 border-t border-[#1F334E]/40">
          <span>00:00</span>
          <span>12:00</span>
          <span className="text-on-surface-variant font-bold">NOW</span>
        </div>
      </div>
    </div>
  );
}

