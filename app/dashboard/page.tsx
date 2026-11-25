'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AQIOverview } from '@/components/dashboard/AQIOverview';
import { PollutantCard } from '@/components/dashboard/PollutantCard';
import { AirQualityChart } from '@/components/dashboard/AirQualityChart';
import { RecommendationPreview } from '@/components/dashboard/RecommendationPreview';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { useAirQuality } from '@/lib/context/AirQualityContext';
import { DEMO_AIR_QUALITY_READING, DEMO_DIURNAL_FORECAST, DEMO_ACTIVITY_WINDOWS, DEMO_SENSOR_NODES } from '@/lib/demo-data';
import { Radio, RefreshCw, AlertCircle } from 'lucide-react';

function DashboardContent() {
  const { data, isLoading, error, refetch, selectedLocation, isDemoMode, setIsDemoMode } = useAirQuality();

  if (isLoading && !data) {
    return (
      <div className="space-y-6 pt-4">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-primary animate-ping" />
          <span className="font-heading text-sm text-primary uppercase tracking-wider">
            Connecting to Live Atmospheric Providers (Open-Meteo & OpenAQ v3)...
          </span>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  if (error && !data && !isDemoMode) {
    return (
      <div className="py-8">
        <ErrorState
          title="Environmental Data Stream Interrupted"
          message={`Could not retrieve real-time air quality telemetry for ${selectedLocation.name}: ${error}. You may retry or examine the illustrative demonstration dataset.`}
          onRetry={() => refetch()}
        />
        <div className="flex justify-center mt-4">
          <button
            type="button"
            onClick={() => setIsDemoMode(true)}
            className="px-4 py-2 rounded-xl bg-[#142235] hover:bg-[#19202D] text-secondary text-xs font-mono border border-secondary/30 transition-colors"
          >
            Switch to Isolated Demonstration Mode
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Title Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-1">
        <div>
          <div className="flex items-center gap-2 font-heading text-[10px] text-primary uppercase tracking-widest mb-1">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
            <span>Atmospheric Diagnostic Vector • Stage 2 Live Data</span>
          </div>
          <h1 className="font-heading text-2xl lg:text-4xl text-on-surface font-bold tracking-tight">
            Your Environment, <span className="text-primary-container">Decoded.</span>
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant max-w-xl mt-1">
            Decision intelligence synthesizing outdoor atmospheric dispersion with residential vulnerability and statutory Indian CPCB standards.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#142235] border border-[#1F334E] text-xs font-mono shadow-sm">
            <Radio className="w-3.5 h-3.5 text-secondary" />
            <span className="text-on-surface">
              {data ? `${data.location.name} (${data.location.latitude.toFixed(2)}°N, ${data.location.longitude.toFixed(2)}°E)` : DEMO_AIR_QUALITY_READING.location.gridZone}
            </span>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#19202D] hover:bg-[#232A38] text-on-surface text-xs font-mono border border-[#1F334E] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-primary ${isLoading ? 'animate-spin' : ''}`} />
            <span>Re-Sync</span>
          </button>
        </div>
      </div>

      {/* Hero AQI Command Card */}
      <AQIOverview data={isDemoMode ? null : data} reading={isDemoMode ? DEMO_AIR_QUALITY_READING : undefined} />

      {/* 4 Primary Pollutant Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <PollutantCard
          metric={!isDemoMode && data?.observations['PM2.5'] ? data.observations['PM2.5'] : undefined}
          demoMetric={isDemoMode ? DEMO_AIR_QUALITY_READING.metrics['PM2.5'] : undefined}
        />
        <PollutantCard
          metric={!isDemoMode && data?.observations['PM10'] ? data.observations['PM10'] : undefined}
          demoMetric={isDemoMode ? DEMO_AIR_QUALITY_READING.metrics['PM10'] : undefined}
        />
        <PollutantCard
          metric={!isDemoMode && data?.observations['NO2'] ? data.observations['NO2'] : undefined}
          demoMetric={isDemoMode ? DEMO_AIR_QUALITY_READING.metrics['NO2'] : undefined}
        />
        <PollutantCard
          metric={!isDemoMode && data?.observations['O3'] ? data.observations['O3'] : undefined}
          demoMetric={isDemoMode ? DEMO_AIR_QUALITY_READING.metrics['O3'] : undefined}
        />
      </div>

      {/* 24-Hour Diurnal Trajectory Chart */}
      <AirQualityChart
        forecast={!isDemoMode && data?.forecast ? data.forecast : undefined}
        data={isDemoMode ? DEMO_DIURNAL_FORECAST : undefined}
      />

      {/* Activity Windows & Sensor Health Dual Panel */}
      <RecommendationPreview
        forecast={!isDemoMode && data?.forecast ? data.forecast : undefined}
        sources={!isDemoMode && data?.sources ? data.sources : undefined}
        activityWindows={isDemoMode ? DEMO_ACTIVITY_WINDOWS : undefined}
        sensorNodes={isDemoMode ? DEMO_SENSOR_NODES : undefined}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <DashboardContent />
    </DashboardLayout>
  );
}
