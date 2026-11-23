'use client';

import React from 'react';
import { RoutineActivity } from '@/types/planner';
import { cn } from '@/lib/utils';
import { CheckCircle2, Clock } from 'lucide-react';

interface ActivitySelectorProps {
  activities: RoutineActivity[];
  selectedActivityId: string;
  onSelectActivity: (activity: RoutineActivity) => void;
  targetDate: 'today' | 'tomorrow';
  onChangeTargetDate: (date: 'today' | 'tomorrow') => void;
  durationMinutes: number;
  onChangeDuration: (mins: number) => void;
}

export function ActivitySelector({
  activities,
  selectedActivityId,
  onSelectActivity,
  targetDate,
  onChangeTargetDate,
  durationMinutes,
  onChangeDuration,
}: ActivitySelectorProps) {
  return (
    <div className="bg-[#142235] p-6 rounded-2xl border border-[#1F334E] shadow-surface-card space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-base font-semibold text-on-surface">
          Activity Configuration
        </h3>
        <span className="font-heading text-[10px] px-2 py-0.5 rounded-full bg-[#101C2B] text-on-surface-variant border border-[#1F334E]">
          Target Planner
        </span>
      </div>

      {/* Routine Grid */}
      <div className="space-y-2">
        <label className="font-heading text-[10px] uppercase text-outline tracking-wider">
          Select Routine
        </label>
        <div className="grid grid-cols-2 gap-2">
          {activities.map((act) => {
            const isSelected = act.id === selectedActivityId;
            return (
              <button
                key={act.id}
                type="button"
                onClick={() => onSelectActivity(act)}
                className={cn(
                  'group flex flex-col items-start p-3 rounded-xl border text-left transition-all',
                  isSelected
                    ? 'bg-gradient-to-br from-primary-container/15 to-transparent border-primary-container/50 shadow-glow-primary'
                    : 'bg-[#101C2B] border-[#1F334E] hover:border-outline'
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xl">{act.emoji}</span>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-primary-container" />
                  )}
                </div>
                <span className="font-heading text-xs font-semibold text-on-surface mt-1.5">
                  {act.name}
                </span>
                <span className="font-mono text-[10px] text-primary-container">
                  {act.exertionLevel}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Date Switcher */}
      <div className="space-y-1.5 pt-2">
        <label className="font-heading text-[10px] uppercase text-outline tracking-wider block">
          Target Date
        </label>
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#080F1C] rounded-xl border border-[#1F334E]">
          <button
            type="button"
            onClick={() => onChangeTargetDate('today')}
            className={cn(
              'py-1.5 text-center font-heading text-xs rounded-lg font-bold transition-all',
              targetDate === 'today'
                ? 'bg-primary-container text-[#003829] shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            )}
          >
            Today (Nov 23)
          </button>
          <button
            type="button"
            onClick={() => onChangeTargetDate('tomorrow')}
            className={cn(
              'py-1.5 text-center font-heading text-xs rounded-lg font-bold transition-all',
              targetDate === 'tomorrow'
                ? 'bg-primary-container text-[#003829] shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            )}
          >
            Tomorrow (Nov 24)
          </button>
        </div>
      </div>

      {/* Duration Slider */}
      <div className="space-y-2 pt-2">
        <div className="flex justify-between items-center text-xs">
          <label className="font-heading text-[10px] uppercase text-outline tracking-wider">
            Estimated Duration
          </label>
          <span className="font-mono text-xs font-bold text-primary-container px-2 py-0.5 rounded bg-[#101C2B] border border-[#1F334E]">
            {durationMinutes} mins
          </span>
        </div>
        <input
          type="range"
          min={15}
          max={120}
          step={15}
          value={durationMinutes}
          onChange={(e) => onChangeDuration(Number(e.target.value))}
          className="w-full h-1.5 bg-[#1F334E] rounded-lg appearance-none cursor-pointer accent-primary-container"
        />
        <div className="flex justify-between font-mono text-[10px] text-outline">
          <span>15m (Brief)</span>
          <span>45m</span>
          <span>120m (Long)</span>
        </div>
      </div>
    </div>
  );
}

