import React from 'react';
import { getAQITheme } from '@/lib/utils';

interface AQIGaugeProps {
  aqi: number;
  maxAqi?: number;
  size?: number;
  strokeWidth?: number;
}

export function AQIGauge({
  aqi,
  maxAqi = 500,
  size = 208,
  strokeWidth = 12,
}: AQIGaugeProps) {
  const theme = getAQITheme(aqi);
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  // Arc length is ~270 degrees (3/4 of circle)
  const arcTotal = circumference * 0.75;
  const percentage = Math.min(Math.max(aqi / maxAqi, 0), 1);
  const activeStroke = percentage * arcTotal;
  const saturationPercent = (percentage * 100).toFixed(1);

  return (
    <div className="relative shrink-0 flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        className="w-full h-full -rotate-[135deg]"
        viewBox={`0 0 ${size} ${size}`}
      >
        <defs>
          <linearGradient id="aqiGaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#37E6B5" />
            <stop offset="50%" stopColor="#53C7F5" />
            <stop offset="100%" stopColor="#F6C453" />
          </linearGradient>
          <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor={theme.hex} floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Background Track Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1F334E"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcTotal} ${circumference}`}
          strokeLinecap="round"
        />

        {/* Active Value Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#aqiGaugeGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={`${activeStroke} ${circumference}`}
          strokeLinecap="round"
          filter="url(#gaugeGlow)"
        />
      </svg>

      {/* Center Readout HUD */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-heading text-[10px] uppercase tracking-wider text-outline">
          Estimated AQI
        </span>
        <span className="font-heading text-4xl lg:text-5xl font-bold leading-none text-on-surface my-1 tracking-tighter">
          {aqi}
        </span>
        <span className="font-mono text-xs text-secondary">
          Scale 0 - {maxAqi}
        </span>
      </div>

      {/* Needle & Saturation Badge */}
      <div className="absolute bottom-2 font-mono text-[11px] text-outline">
        ● {saturationPercent}% Saturation
      </div>
    </div>
  );
}

