'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AQIOverview } from '@/components/dashboard/AQIOverview';
import { PollutantCard } from '@/components/dashboard/PollutantCard';
import { AirQualityChart } from '@/components/dashboard/AirQualityChart';
import { RecommendationPreview } from '@/components/dashboard/RecommendationPreview';
import {
  DEMO_AIR_QUALITY_READING,
  DEMO_DIURNAL_FORECAST,
  DEMO_ACTIVITY_WINDOWS,
  DEMO_SENSOR_NODES,
} from '@/lib/demo-data';
import { Radio, RefreshCw } from 'lucide-react';

export default function DashboardPage() {
  const reading = DEMO_AIR_QUALITY_READING;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Title Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-1">
          <div>
            <div className="flex items-center gap-2 font-heading text-[10px] text-primary uppercase tracking-widest mb-1">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              <span>Atmospheric Diagnostic Vector</span>
            </div>
            <h1 className="font-heading text-2xl lg:text-4xl text-on-surface font-bold tracking-tight">
              Your Environment, <span className="text-primary-container">Decoded.</span>
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-xl mt-1">
              Understand the air around you and make informed decisions using high-resolution predictive tropospheric sensing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#142235] border border-[#1F334E] text-xs font-mono shadow-sm">
              <Radio className="w-3.5 h-3.5 text-secondary" />
              <span className="text-on-surface">{reading.location.gridZone}</span>
            </div>
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#19202D] hover:bg-[#232A38] text-on-surface text-xs font-mono border border-[#1F334E] transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-primary" />
              <span>Re-Sync</span>
            </button>
          </div>
        </div>

        {/* Hero AQI Command Card */}
        <AQIOverview reading={reading} />

        {/* 4 Primary Pollutant Bento Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <PollutantCard metric={reading.metrics['PM2.5']} />
          <PollutantCard metric={reading.metrics['PM10']} />
          <PollutantCard metric={reading.metrics['NO2']} />
          <PollutantCard metric={reading.metrics['O3']} />
        </div>

        {/* 24-Hour Diurnal Trajectory Chart */}
        <AirQualityChart data={DEMO_DIURNAL_FORECAST} />

        {/* Activity Windows & Sensor Health Dual Panel */}
        <RecommendationPreview
          activityWindows={DEMO_ACTIVITY_WINDOWS}
          sensorNodes={DEMO_SENSOR_NODES}
        />
      </div>
    </DashboardLayout>
  );
}

