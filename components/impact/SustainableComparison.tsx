'use client';

import React, { useState } from 'react';
import {
  Train,
  Bus,
  Bike,
  Car,
  Footprints,
  Leaf,
  Users,
  ShieldCheck,
  TreePine,
  ArrowRight,
} from 'lucide-react';
import {
  DEMO_TRANSPORT_COMPARISONS,
  DEMO_COMMUNITY_IMPACT,
} from '@/lib/demo-data';
import { TransportModeComparison } from '@/types/impact';
import { cn } from '@/lib/utils';

export function SustainableComparison() {
  const [commuteDistanceKm, setCommuteDistanceKm] = useState<number>(12);
  const [selectedModeId, setSelectedModeId] = useState<string>('metro');

  const selectedMode = DEMO_TRANSPORT_COMPARISONS.find((m) => m.id === selectedModeId) || DEMO_TRANSPORT_COMPARISONS[0];
  const carMode = DEMO_TRANSPORT_COMPARISONS.find((m) => m.id === 'car')!;

  const co2SavedPerTripGrams = (carMode.co2GramsPerKm - selectedMode.co2GramsPerKm) * commuteDistanceKm;
  const pmSavedPerTripGrams = (carMode.pmEmissionsGramPerKm - selectedMode.pmEmissionsGramPerKm) * commuteDistanceKm;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-heading text-[10px] text-primary uppercase tracking-widest mb-1">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>Sustainable Impact Explorer</span>
          </div>
          <h1 className="font-heading text-2xl lg:text-3xl font-bold text-on-surface tracking-tight">
            Climate & Commute Exposure Impact
          </h1>
          <p className="text-sm text-on-surface-variant max-w-xl mt-1">
            Quantify how everyday transit choices reduce tailpipe emissions and curtail your own personal inhalation of toxic aerosols.
          </p>
        </div>
      </div>

      {/* Community Impact Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {DEMO_COMMUNITY_IMPACT.map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-[#142235] border border-[#1F334E] shadow-surface-card flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="font-heading text-[10px] text-outline uppercase tracking-wider">
                {item.title}
              </span>
              <Leaf className="w-4 h-4 text-primary" />
            </div>

            <div className="my-3 flex items-baseline gap-1.5">
              <span className="font-heading text-3xl font-bold text-on-surface">
                {item.metricValue}
              </span>
              <span className="font-mono text-xs text-primary">{item.metricUnit}</span>
            </div>

            <div className="pt-2 border-t border-[#1F334E]/60 flex items-center justify-between text-[11px] font-mono">
              <span className="text-outline">{item.subtext}</span>
              <span className="text-secondary font-bold">{item.changeRate}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Commute Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Transport Mode Selection */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#142235] border border-[#1F334E] shadow-surface-card space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-base font-semibold text-on-surface">
              Daily Commute Mode Comparison
            </h3>
            <span className="font-heading text-[10px] px-2 py-0.5 rounded bg-[#101C2B] text-secondary border border-[#1F334E]">
              Kolkata Transit Matrix
            </span>
          </div>

          {/* Distance Slider */}
          <div className="space-y-1.5 p-3 rounded-xl bg-[#101C2B] border border-[#1F334E]">
            <div className="flex justify-between items-center text-xs">
              <span className="text-outline font-heading uppercase text-[10px]">
                One-Way Commute Distance
              </span>
              <span className="font-mono text-xs font-bold text-primary-container">
                {commuteDistanceKm} km
              </span>
            </div>
            <input
              type="range"
              min={2}
              max={35}
              value={commuteDistanceKm}
              onChange={(e) => setCommuteDistanceKm(Number(e.target.value))}
              className="w-full h-1.5 bg-[#1F334E] rounded-lg appearance-none cursor-pointer accent-primary-container"
            />
          </div>

          {/* Mode List */}
          <div className="space-y-2.5">
            {DEMO_TRANSPORT_COMPARISONS.map((mode) => {
              const isSelected = mode.id === selectedModeId;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setSelectedModeId(mode.id)}
                  className={cn(
                    'w-full p-3.5 rounded-xl border flex items-center justify-between text-left transition-all',
                    isSelected
                      ? 'bg-gradient-to-r from-primary-container/15 via-[#142235] to-transparent border-primary-container shadow-glow-primary'
                      : 'bg-[#101C2B] border-[#1F334E] hover:border-outline'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#142235] flex items-center justify-center text-primary-container border border-[#1F334E]">
                      {mode.id === 'metro' && <Train className="w-4 h-4" />}
                      {mode.id === 'ebus' && <Bus className="w-4 h-4" />}
                      {mode.id === 'cycle' && <Bike className="w-4 h-4" />}
                      {mode.id === 'car' && <Car className="w-4 h-4" />}
                      {mode.id === 'scooter' && <Bike className="w-4 h-4" />}
                    </div>

                    <div>
                      <span className="font-heading text-xs font-bold text-on-surface block">
                        {mode.name}
                      </span>
                      {mode.sustainableBadge && (
                        <span className="font-mono text-[10px] text-primary">
                          {mode.sustainableBadge}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right font-mono text-xs">
                    <span className="text-on-surface font-semibold block">
                      {mode.co2GramsPerKm} g CO₂/km
                    </span>
                    <span className="text-outline text-[10px]">
                      Inhalation Index: {mode.personalExposureIndex} / 10
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Savings Breakdown vs Car Baseline */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#142235] border border-[#1F334E] shadow-surface-card flex flex-col justify-between space-y-4">
          <div>
            <span className="font-heading text-[10px] uppercase text-outline tracking-wider">
              Offset Comparison vs ICE Car Baseline
            </span>
            <h4 className="font-heading text-lg font-bold text-on-surface mt-1">
              Your Daily Direct Air Benefit
            </h4>
            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
              Choosing {selectedMode.name} over driving a single-occupancy petrol vehicle saves considerable urban particulate emissions.
            </p>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-3 rounded-xl bg-[#101C2B] border border-[#1F334E]">
                <span className="font-heading text-[9px] uppercase text-outline block">
                  CO₂ Saved Per Day
                </span>
                <span className="font-heading text-xl font-bold text-primary-container mt-1 block">
                  {Math.max(0, (co2SavedPerTripGrams * 2) / 1000).toFixed(2)} kg
                </span>
                <span className="font-mono text-[10px] text-outline">Roundtrip (2x)</span>
              </div>

              <div className="p-3 rounded-xl bg-[#101C2B] border border-[#1F334E]">
                <span className="font-heading text-[9px] uppercase text-outline block">
                  Direct PM Output Cut
                </span>
                <span className="font-heading text-xl font-bold text-secondary mt-1 block">
                  {Math.max(0, pmSavedPerTripGrams * 2).toFixed(1)} g
                </span>
                <span className="font-mono text-[10px] text-outline">Fine soot particles</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#080F1C] border border-[#1F334E] space-y-2 text-xs">
            <div className="flex items-center gap-2 text-primary font-heading font-semibold">
              <TreePine className="w-4 h-4 text-primary" />
              <span>Yearly Forest Carbon Equivalent</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Maintaining this commute avoids approx <strong className="text-on-surface">620 kg CO₂ annually</strong>, equivalent to the lifetime annual carbon sequestration of <strong className="text-primary">28 urban trees</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

