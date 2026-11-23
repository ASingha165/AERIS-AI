'use client';

import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Sparkles, Info } from 'lucide-react';
import { DiurnalForecastPoint } from '@/types/air-quality';
import { cn } from '@/lib/utils';

interface AirQualityChartProps {
  data: DiurnalForecastPoint[];
}

export function AirQualityChart({ data }: AirQualityChartProps) {
  const [selectedPollutant, setSelectedPollutant] = useState<'pm25' | 'pm10' | 'no2' | 'aqi'>('pm25');
  const [selectedRange, setSelectedRange] = useState<'24h' | '3day' | '7day'>('24h');

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload as DiurnalForecastPoint;
      return (
        <div className="p-3 rounded-xl bg-[#142235]/95 backdrop-blur-md border border-[#1F334E] shadow-2xl text-xs space-y-1">
          <div className="flex items-center justify-between gap-4 font-heading text-[10px] text-outline">
            <span>{point.time} • {point.isHistorical ? 'MEASURED TELEMETRY' : 'AI GENERATIVE FORECAST'}</span>
            {point.annotation && (
              <span className="text-secondary font-bold">{point.annotation}</span>
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-base font-bold text-on-surface">
              AQI {point.aqi}
            </span>
            <span className="font-mono text-outline">PM2.5: {point.pm25} µg/m³</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-on-surface-variant pt-1 border-t border-[#1F334E]">
            <span>PM10: {point.pm10} µg</span>
            <span>•</span>
            <span>NO₂: {point.no2} ppb</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 rounded-2xl bg-[#142235] border border-[#1F334E] shadow-surface-card flex flex-col gap-5">
      {/* Chart Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading text-base lg:text-lg text-on-surface font-bold">
              24-Hour Diurnal Trajectory & Predictive Horizon
            </h3>
            <span className="font-heading text-[10px] px-2 py-0.5 rounded-full bg-secondary-container/20 text-secondary font-bold border border-secondary/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-secondary" />
              AI Synthetic Model
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Continuous ground sensor telemetry paired with AERIS atmospheric dispersion simulation.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Pollutant Toggles */}
          <div className="flex items-center p-1 rounded-lg bg-[#101C2B] border border-[#1F334E]">
            {(['pm25', 'pm10', 'no2', 'aqi'] as const).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedPollutant(key)}
                className={cn(
                  'px-3 py-1 rounded text-xs font-heading font-medium transition-all',
                  selectedPollutant === key
                    ? 'bg-primary-container text-[#003829] font-bold shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                )}
              >
                {key === 'pm25' ? 'PM2.5' : key === 'pm10' ? 'PM10' : key === 'no2' ? 'NO₂' : 'AQI Agg.'}
              </button>
            ))}
          </div>

          {/* Time range */}
          <div className="flex items-center p-1 rounded-lg bg-[#101C2B] border border-[#1F334E]">
            {(['24h', '3day', '7day'] as const).map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setSelectedRange(range)}
                className={cn(
                  'px-2.5 py-1 rounded text-[11px] font-mono transition-all',
                  selectedRange === range
                    ? 'bg-[#1F334E] text-on-surface font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface'
                )}
              >
                {range === '24h' ? 'Today (24h)' : range === '3day' ? '3-Day AI' : '7-Day Hist'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Recharts Canvas */}
      <div className="w-full h-72 relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="chartEmeraldGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#37E6B5" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#37E6B5" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              stroke="#85948C"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#1F334E' }}
            />
            <YAxis
              stroke="#85948C"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#1F334E' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={50} stroke="#43D9A3" strokeDasharray="3 3" opacity={0.3} label={{ value: 'Good (50)', fill: '#43D9A3', fontSize: 9, position: 'right' }} />
            <ReferenceLine y={100} stroke="#53C7F5" strokeDasharray="3 3" opacity={0.3} label={{ value: 'Moderate (100)', fill: '#53C7F5', fontSize: 9, position: 'right' }} />
            <ReferenceLine y={150} stroke="#F6C453" strokeDasharray="3 3" opacity={0.4} label={{ value: 'Unhealthy (150)', fill: '#F6C453', fontSize: 9, position: 'right' }} />
            <Area
              type="monotone"
              dataKey={selectedPollutant}
              stroke="#37E6B5"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#chartEmeraldGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Legend & Telemetry Status */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#1F334E]/60 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-1 rounded bg-primary" />
            <span className="text-on-surface">Measured In-Situ Data</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-1 rounded bg-secondary border-b border-dashed" />
            <span className="text-on-surface">AI Generative Forecast</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded bg-secondary/30" />
            <span className="text-outline">95% Confidence Corridor</span>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] text-outline">
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span>Thermal boundary layer expected to collapse at 17:30 IST</span>
        </div>
      </div>
    </div>
  );
}

