'use client';

import React, { useState } from 'react';
import {
  Bed,
  UtensilsCrossed,
  Armchair,
  BookOpen,
  ShowerHead,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  ShieldCheck,
  TrendingDown,
} from 'lucide-react';
import { DEMO_ROOM_ZONES } from '@/lib/demo-data';
import { RoomZone } from '@/types/indoor';
import { cn } from '@/lib/utils';

export function RoomSelector() {
  const [selectedRoomId, setSelectedRoomId] = useState<string>('bedroom');
  const [rooms, setRooms] = useState<RoomZone[]>(DEMO_ROOM_ZONES);

  const activeRoom = rooms.find((r) => r.id === selectedRoomId) || rooms[0];

  const toggleStrategy = (strategyId: string) => {
    setRooms((prev) =>
      prev.map((room) => {
        if (room.id !== activeRoom.id) return room;
        return {
          ...room,
          strategies: room.strategies.map((strat) =>
            strat.id === strategyId
              ? { ...strat, isCompleted: !strat.isCompleted }
              : strat
          ),
        };
      })
    );
  };

  const getIcon = (id: string) => {
    switch (id) {
      case 'bedroom':
        return <Bed className="w-4 h-4" />;
      case 'kitchen':
        return <UtensilsCrossed className="w-4 h-4" />;
      case 'living':
        return <Armchair className="w-4 h-4" />;
      case 'study':
        return <BookOpen className="w-4 h-4" />;
      case 'bath':
        return <ShowerHead className="w-4 h-4" />;
      default:
        return <Bed className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Zone */}
      <div className="relative overflow-hidden rounded-2xl bg-[#101C2B] p-6 lg:p-7 border border-[#1F334E] shadow-surface-card">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 font-heading text-[10px] text-primary uppercase tracking-widest mb-1">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              <span>Indoor Telemetry Shield • ISO 16000-Compliant</span>
            </div>
            <h1 className="font-heading text-2xl lg:text-3xl font-bold text-on-surface tracking-tight">
              Better Air Begins Indoors.
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Practical, budget-friendly guidance to safeguard your home micro-climate with zero synthetic hype.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#142235]/90 border border-[#1F334E] px-4 py-2.5 rounded-xl shadow-md">
            <div className="w-12 h-12 rounded-full border-2 border-primary-container flex items-center justify-center font-heading text-primary-container font-bold text-base">
              74%
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-[10px] uppercase text-outline tracking-wider">
                Estimated Home Exposure
              </span>
              <span className="font-heading text-sm text-on-surface font-semibold">
                Moderated Micro-Zone
              </span>
              <span className="font-mono text-xs text-primary flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5" />
                -38 µg/m³ vs Ambient Outdoor
              </span>
            </div>
          </div>
        </div>

        {/* Scientific accuracy banner */}
        <div className="mt-5 pt-4 border-t border-[#1F334E]/60 flex items-start gap-2.5 text-xs text-on-surface-variant">
          <ShieldCheck className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
          <p>
            <strong className="text-on-surface font-semibold">Evidence-Based Indoor Recommendations:</strong> AERIS does not manufacture synthetic indoor AQI readings without verified in-home hardware probes. The strategies below are derived from empirical indoor air science, ventilation physics, and building dynamics.
          </p>
        </div>
      </div>

      {/* Sub-Zones Tabs */}
      <div className="space-y-2">
        <span className="font-heading text-[10px] uppercase tracking-wider text-outline">
          Household Sub-Zones
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {rooms.map((room) => {
            const isSelected = room.id === selectedRoomId;
            return (
              <button
                key={room.id}
                type="button"
                onClick={() => setSelectedRoomId(room.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl font-heading text-xs transition-all shrink-0 border',
                  isSelected
                    ? 'bg-primary-container text-[#003829] font-bold border-primary-container shadow-glow-primary'
                    : 'bg-[#101C2B] text-on-surface-variant hover:text-on-surface border-[#1F334E]'
                )}
              >
                {getIcon(room.id)}
                <span>{room.name}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#003829]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Room Details & Diagnostic Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Spatial Geometry Profile */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-[#142235] border border-[#1F334E] shadow-surface-card flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-heading text-[10px] uppercase text-primary tracking-wider">
                Spatial Geometry Data
              </span>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#101C2B] text-secondary border border-[#1F334E]">
                ID: {activeRoom.id.toUpperCase()}-01
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-2">
              <span className="font-heading text-3xl font-bold text-on-surface">
                {activeRoom.areaSqFt}
              </span>
              <span className="text-xs text-outline font-heading">sq ft</span>
              <span className="font-mono text-xs text-on-surface-variant ml-auto">
                V = {activeRoom.volumeM3} m³
              </span>
            </div>

            {/* Spec Tiles */}
            <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
              <div className="p-2.5 rounded-xl bg-[#101C2B] border border-[#1F334E]">
                <span className="font-heading text-[9px] uppercase text-outline block">
                  Occupancy
                </span>
                <span className="text-on-surface font-semibold">{activeRoom.occupancyDescription}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#101C2B] border border-[#1F334E]">
                <span className="font-heading text-[9px] uppercase text-outline block">
                  Fenestration
                </span>
                <span className="text-on-surface font-semibold">{activeRoom.fenestration}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#101C2B] border border-[#1F334E]">
                <span className="font-heading text-[9px] uppercase text-outline block">
                  Ventilation
                </span>
                <span className="text-on-surface font-semibold">{activeRoom.ventilationType}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#101C2B] border border-[#1F334E]">
                <span className="font-heading text-[9px] uppercase text-outline block">
                  Thermal Unit
                </span>
                <span className="text-on-surface font-semibold">{activeRoom.thermalUnit}</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#080F1C] border border-[#1F334E] text-xs font-mono flex justify-between items-center">
            <span className="text-outline">Air Changes Target:</span>
            <span className="text-primary font-bold">{activeRoom.recommendedAirChangesPerHour} ACH</span>
          </div>
        </div>

        {/* Actionable Strategies Checklist */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#142235] border border-[#1F334E] shadow-surface-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-base font-semibold text-on-surface">
              Micro-Zone Safeguard Checklist ({activeRoom.name})
            </h3>
            <span className="font-mono text-xs text-primary">
              {activeRoom.strategies.filter((s) => s.isCompleted).length} / {activeRoom.strategies.length} Implemented
            </span>
          </div>

          <div className="space-y-3">
            {activeRoom.strategies.map((strat) => (
              <div
                key={strat.id}
                onClick={() => toggleStrategy(strat.id)}
                className={cn(
                  'p-4 rounded-xl border flex items-start justify-between gap-3 cursor-pointer transition-all',
                  strat.isCompleted
                    ? 'bg-[#101C2B] border-primary-container/40'
                    : 'bg-[#101C2B] border-[#1F334E] hover:border-outline'
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      'w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors',
                      strat.isCompleted
                        ? 'bg-primary-container border-primary-container text-[#003829]'
                        : 'border-outline bg-transparent'
                    )}
                  >
                    {strat.isCompleted && <CheckCircle2 className="w-4 h-4" />}
                  </div>

                  <div>
                    <span
                      className={cn(
                        'font-heading text-sm font-semibold block',
                        strat.isCompleted ? 'text-on-surface line-through opacity-80' : 'text-on-surface'
                      )}
                    >
                      {strat.title}
                    </span>
                    <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                      {strat.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="font-mono text-[10px] text-primary font-bold">
                    +{strat.effectivenessPercent}% Purity
                  </span>
                  <span className="font-heading text-[9px] px-2 py-0.5 rounded bg-[#142235] text-outline uppercase border border-[#1F334E]">
                    {strat.costLevel}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Low-cost DIY Callout */}
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-primary-container/10 via-secondary/10 to-transparent border border-primary-container/30 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-primary-container shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <strong className="text-on-surface font-semibold">AERIS Budget Insight:</strong> Instead of high-end ₹25,000+ commercial units for every room, a simple MERV-13 filter strapped to a standard 20-inch box fan (Corsi-Rosenthal Box) achieves identical Clean Air Delivery Rate (CADR 250 CFM) for under ₹1,800.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

