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
import { Sparkles, Info, Activity } from 'lucide-react';
import { DiurnalForecastPoint, HourlyForecastPoint } from '@/types/air-quality';
import { cn } from '@/lib/utils';

interface AirQualityChartProps {
  forecast?: HourlyForecastPoint[];
  data?: DiurnalForecastPoint[];
}

export function AirQualityChart({ forecast, data }: AirQualityChartProps) {
  const [selectedPollutant, setSelectedPollutant] = useState<'pm25' | 'pm10' | 'no2' | 'aqi'>('pm25');
  const [selectedRange, setSelectedRange] = useState<'24h' | '3day' | '5day'>('24h');

  // Prepare chart dataset
  let chartPoints: {
    time: string;
    pm25: number;
    pm10: number;
    no2: number;
    aqi: number;
    annotation?: string;
    isCurrentHour?: boolean;
  }[] = [];

  if (forecast && forecast.length > 0) {
    const limit = selectedRange === '24h' ? 24 : selectedRange === '3day' ? 72 : 120;
    chartPoints = forecast.slice(0, limit).map((pt) => {
      let timeLabel = pt.time;
      try {
        const d = new Date(pt.time);
        if (!isNaN(d.getTime())) {
          timeLabel = selectedRange === '24h'
            ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
            : `${d.toLocaleDateString([], { weekday: 'short' })} ${d.getHours()}:00`;
        }
      } catch {
        timeLabel = pt.time;
      }

      return {
        time: timeLabel,
        pm25: pt.pm25 ?? 0,
        pm10: pt.pm10 ?? 0,
        no2: pt.no2 ?? 0,
        aqi: pt.indicativeAqi ?? pt.pm25 ?? 0,
        annotation: pt.isCurrentHour ? 'Current Hour' : undefined,
        isCurrentHour: pt.isCurrentHour,
      };
    });
  } else if (data && data.length > 0) {
    chartPoints = data.map((d) => ({
      time: d.time,
      pm25: d.pm25,
      pm10: d.pm10,
      no2: d.no2,
      aqi: d.aqi,
      annotation: d.annotation,
      isCurrentHour: !d.isHistorical,
    }));
  }

  const getMetricKey = () => {
    switch (selectedPollutant) {
      case 'pm25':
        return 'pm25';
      case 'pm10':
        return 'pm10';
      case 'no2':
        return 'no2';
      case 'aqi':
        return 'aqi';
    }
  };

  const getStrokeColor = () => {
    switch (selectedPollutant) {
      case 'pm25':
        return '#F16B77';
      case 'pm10':
        return '#F6C453';
      case 'no2':
        return '#53C7F5';
      case 'aqi':
        return '#37E6B5';
    }
  };

  const strokeColor = getStrokeColor();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const pt = payload[0].payload;
      return (
        <div className="p-3 rounded-xl bg-[#142235]/95 backdrop-blur-md border border-[#1F334E] shadow-2xl text-xs space-y-1">
          <div className="flex items-center justify-between gap-4 font-heading text-[10px] text-outline">
            <span>{pt.time} • CAMS Atmospheric Dispersion</span>
            {pt.annotation && (
              <span className="text-secondary font-bold">{pt.annotation}</span>
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-base font-bold text-on-surface">
              Indicative AQI: {pt.aqi}
            </span>
            <span className="font-mono text-outline">PM2.5: {pt.pm25} µg/m³</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-on-surface-variant pt-1 border-t border-[#1F334E]">
            <span>PM10: {pt.pm10} µg/m³</span>
            <span>•</span>
            <span>NO₂: {pt.no2} µg/m³</span>
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
              Diurnal Trajectory & Predictive Horizon
            </h3>
            <span className="font-heading text-[10px] px-2 py-0.5 rounded-full bg-secondary-container/20 text-secondary font-bold border border-secondary/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-secondary" />
              Open-Meteo CAMS Ensemble
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Modeled atmospheric pollution dispersion curve computed by Copernicus Atmospheric Service (~40km grid).
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
                {key === 'pm25' ? 'PM2.5' : key === 'pm10' ? 'PM10' : key === 'no2' ? 'NO₂' : 'Indicative AQI'}
              </button>
            ))}
          </div>

          {/* Time range */}
          <div className="flex items-center p-1 rounded-lg bg-[#101C2B] border border-[#1F334E]">
            {(['24h', '3day', '5day'] as const).map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setSelectedRange(range)}
                className={cn(
                  'px-2.5 py-1 rounded text-xs font-heading font-medium transition-all',
                  selectedRange === range
                    ? 'bg-[#19202D] text-on-surface font-bold border border-[#1F334E]'
                    : 'text-outline hover:text-on-surface'
                )}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartPoints} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.35} />
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="time"
              stroke="#A5B7C8"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#1F334E' }}
            />
            <YAxis
              stroke="#A5B7C8"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#1F334E' }}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Reference threshold lines */}
            <ReferenceLine
              y={60}
              stroke="#F6C453"
              strokeDasharray="3 3"
              label={{ value: 'CPCB Satisfactory Threshold (60)', fill: '#F6C453', fontSize: 10, position: 'right' }}
            />

            <Area
              type="monotone"
              dataKey={getMetricKey()}
              stroke={strokeColor}
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#chartGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Diagnostic Summary */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#1F334E] text-xs">
        <div className="flex items-center gap-4 text-outline font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: strokeColor }} />
            Active Parameter: {selectedPollutant.toUpperCase()}
          </span>
          <span>•</span>
          <span>Inversion Convection Model</span>
        </div>

        <div className="flex items-center gap-2 text-on-surface-variant font-mono text-[11px]">
          <Activity className="w-3.5 h-3.5 text-primary" />
          <span>Resolution: Hourly timestep / Copernicus CAMS Ensemble</span>
        </div>
      </div>
    </div>
  );
}
