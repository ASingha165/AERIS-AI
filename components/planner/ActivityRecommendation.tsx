'use client';

import React from 'react';
import { RoutineActivity } from '@/types/planner';
import { ShieldCheck, ArrowRight, AlertTriangle, Sparkles } from 'lucide-react';

interface ActivityRecommendationProps {
  activity: RoutineActivity;
  durationMinutes: number;
}

export function ActivityRecommendation({
  activity,
  durationMinutes,
}: ActivityRecommendationProps) {
  return (
    <div className="bg-[#142235] p-6 rounded-2xl border border-[#1F334E] shadow-surface-card space-y-4">
      <div className="flex items-center gap-2 font-heading text-xs text-primary-container uppercase font-bold tracking-wider">
        <Sparkles className="w-4 h-4 text-primary-container" />
        <span>Optimized Schedule Decision</span>
      </div>

      <div className="p-4 rounded-xl bg-[#080F1C] border border-[#1F334E] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="font-heading text-[10px] text-outline uppercase tracking-wider">
            Safe Window Identified
          </span>
          <div className="font-heading text-xl font-bold text-primary-container mt-0.5">
            13:30 – 15:30 IST
          </div>
          <p className="text-xs text-on-surface-variant mt-1 max-w-md">
            For {activity.name} ({durationMinutes} mins). Solar convection breaks the thermal inversion layer, lowering micro-particulate inhalation by 42%.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-2 rounded-xl bg-[#101C2B] border border-[#1F334E] text-center">
            <span className="font-mono text-xs text-primary font-bold block">-42%</span>
            <span className="font-heading text-[9px] text-outline uppercase">PM2.5 Inhaled</span>
          </div>
          <div className="px-3 py-2 rounded-xl bg-[#101C2B] border border-[#1F334E] text-center">
            <span className="font-mono text-xs text-secondary font-bold block">135</span>
            <span className="font-heading text-[9px] text-outline uppercase">Estimated AQI</span>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 p-3 rounded-xl bg-[#101C2B] border border-[#1F334E] text-xs text-on-surface-variant">
        <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
        <span>
          Avoid 06:00 - 08:30 (Morning Inversion trap) and 18:00 - 21:00 (Evening traffic condensation) where respiratory load is highest.
        </span>
      </div>
    </div>
  );
}

