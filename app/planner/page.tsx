'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ActivitySelector } from '@/components/planner/ActivitySelector';
import { PollutionTimeline } from '@/components/planner/PollutionTimeline';
import { ActivityRecommendation } from '@/components/planner/ActivityRecommendation';
import { DEMO_ROUTINE_ACTIVITIES, DEMO_DIURNAL_FORECAST } from '@/lib/demo-data';
import { RoutineActivity } from '@/types/planner';
import { ShieldAlert } from 'lucide-react';

export default function PlannerPage() {
  const [selectedActivity, setSelectedActivity] = useState<RoutineActivity>(DEMO_ROUTINE_ACTIVITIES[0]);
  const [targetDate, setTargetDate] = useState<'today' | 'tomorrow'>('today');
  const [durationMinutes, setDurationMinutes] = useState<number>(45);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 font-heading text-[10px] text-secondary uppercase tracking-widest mb-1">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>Micro-Atmospheric Schedule Optimization • WRF-Chem Dispersion Engine</span>
            </div>
            <h1 className="font-heading text-2xl lg:text-4xl text-on-surface font-bold tracking-tight">
              Plan Around the Air<span className="text-primary-container">.</span>
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-2xl mt-1">
              Find better moments for everyday activities. AERIS models meteorological boundary shifts to shield respiratory pathways.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#142235] px-4 py-2 rounded-xl border border-[#1F334E] shadow-sm text-xs">
            <div className="flex flex-col text-right">
              <span className="font-heading text-[9px] uppercase text-outline">Boundary Layer (PBLH)</span>
              <span className="font-heading text-sm text-primary font-bold">580 m</span>
            </div>
            <div className="h-6 w-px bg-[#1F334E]" />
            <div className="flex flex-col text-right">
              <span className="font-heading text-[9px] uppercase text-outline">Surface Inversion</span>
              <span className="font-mono text-danger font-bold">Active (Strong)</span>
            </div>
          </div>
        </div>

        {/* Forecast-Based Relative Windows Disclaimer */}
        <div className="rounded-xl bg-[#101C2B] p-4 border border-[#1F334E] shadow-surface-card flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
          <div className="text-xs text-on-surface-variant leading-relaxed">
            <strong className="text-on-surface font-semibold">Forecast-Based Relative Windows:</strong> AERIS calculates comparative pollution windows based on meteorological dispersion models. No outdoor exposure window during seasonal high-AQI periods is guaranteed completely risk-free; always tailor decisions to personal pulmonary sensitivity and clinical history.
          </div>
        </div>

        {/* 2-Column Split: Activity Config on Left, Recommendation & Timeline on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-4">
            <ActivitySelector
              activities={DEMO_ROUTINE_ACTIVITIES}
              selectedActivityId={selectedActivity.id}
              onSelectActivity={setSelectedActivity}
              targetDate={targetDate}
              onChangeTargetDate={setTargetDate}
              durationMinutes={durationMinutes}
              onChangeDuration={setDurationMinutes}
            />
          </div>

          <div className="lg:col-span-8 space-y-6">
            <ActivityRecommendation
              activity={selectedActivity}
              durationMinutes={durationMinutes}
            />

            <PollutionTimeline
              forecastData={DEMO_DIURNAL_FORECAST}
              optimalStartHour={13.5}
              optimalEndHour={16}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

