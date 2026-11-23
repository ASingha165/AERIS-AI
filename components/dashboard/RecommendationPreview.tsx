'use client';

import React from 'react';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ShieldAlert,
  ArrowRight,
  Radio,
} from 'lucide-react';
import { ActivityWindowRecommendation, SensorNodeStatus } from '@/types/air-quality';
import { cn } from '@/lib/utils';

interface RecommendationPreviewProps {
  activityWindows: ActivityWindowRecommendation[];
  sensorNodes: SensorNodeStatus[];
}

export function RecommendationPreview({
  activityWindows,
  sensorNodes,
}: RecommendationPreviewProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Left 7 cols: Recommended Activity Windows */}
      <div className="lg:col-span-7 p-6 rounded-2xl bg-[#142235] border border-[#1F334E] shadow-surface-card flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-primary-container" />
              <h3 className="font-heading text-base font-semibold text-on-surface">
                Recommended Activity Windows Today
              </h3>
            </div>
            <span className="font-heading text-[10px] px-2 py-0.5 rounded bg-[#101C2B] text-on-surface-variant font-bold border border-[#1F334E]">
              Dynamic Guidance
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Chronological scheduling matrix computed against predicted pollutant density gradients.
          </p>

          {/* Activity Cards List */}
          <div className="flex flex-col gap-2.5 mt-4">
            {activityWindows.map((item) => {
              const isOptimal = item.status === 'optimal';
              const isCaution = item.status === 'caution';
              const isNotAdvised = item.status === 'not-advised';

              return (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-3 p-3 rounded-xl bg-[#101C2B] border border-[#1F334E] hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5',
                        isOptimal && 'bg-primary-container/20 text-primary',
                        isCaution && 'bg-warning/20 text-warning',
                        isNotAdvised && 'bg-danger/20 text-danger'
                      )}
                    >
                      {isOptimal && <CheckCircle2 className="w-4 h-4" />}
                      {isCaution && <AlertCircle className="w-4 h-4" />}
                      {isNotAdvised && <XCircle className="w-4 h-4" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-heading text-sm font-semibold text-on-surface">
                          {item.title}
                        </span>
                        <span className="font-mono text-xs text-outline">
                          {item.timeRange}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        {item.explanation}
                      </p>
                    </div>
                  </div>

                  <span
                    className={cn(
                      'font-heading text-[10px] px-2.5 py-1 rounded font-bold uppercase shrink-0',
                      isOptimal && 'bg-primary-container text-[#003829]',
                      isCaution && 'bg-warning/20 text-warning border border-warning/30',
                      isNotAdvised && 'bg-danger/20 text-danger border border-danger/30'
                    )}
                  >
                    {item.badgeLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-4 flex items-center justify-between border-t border-[#1F334E]/60 mt-4 text-xs">
          <span className="font-mono text-outline">
            Next schedule recalculation: in 45m
          </span>
          <button
            type="button"
            className="text-primary hover:underline font-mono flex items-center gap-1"
          >
            <span>Export iCal Schedule</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Right 5 cols: Sensor Grid Health */}
      <div className="lg:col-span-5 p-6 rounded-2xl bg-[#142235] border border-[#1F334E] shadow-surface-card flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-secondary" />
              <h3 className="font-heading text-base font-semibold text-on-surface">
                Sensor Grid Health
              </h3>
            </div>
            <span className="font-mono text-xs text-secondary px-2 py-0.5 rounded bg-[#101C2B] border border-[#1F334E]">
              18ms Latency
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Station nodes feeding the spatial interpolation model.
          </p>

          {/* Node feed list */}
          <div className="flex flex-col gap-2 mt-4">
            {sensorNodes.map((node) => (
              <div
                key={node.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#101C2B] border border-[#1F334E]"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <div className="flex flex-col">
                    <span className="font-heading text-xs font-medium text-on-surface">
                      {node.name}
                    </span>
                    <span className="font-mono text-[10px] text-outline">
                      {node.sensorType} • {node.coordinates}
                    </span>
                  </div>
                </div>
                <span className="font-mono text-xs text-primary font-bold">
                  {node.uptimePercent}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#080F1C] border border-[#1F334E] mt-4 flex items-center justify-between text-xs font-mono">
          <span className="text-outline">Active Grid Protocol:</span>
          <span className="text-secondary font-semibold">BAM/Laser Synchronous</span>
        </div>
      </div>
    </div>
  );
}

