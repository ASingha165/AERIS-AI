'use client';

import React from 'react';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ShieldCheck,
  Radio,
  MapPin,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { ActivityWindowRecommendation, HourlyForecastPoint, MonitoringStation, SensorNodeStatus, SourceAttribution } from '@/types/air-quality';
import { cn } from '@/lib/utils';

interface RecommendationPreviewProps {
  activityWindows?: ActivityWindowRecommendation[];
  sensorNodes?: SensorNodeStatus[];
  forecast?: HourlyForecastPoint[];
  sources?: SourceAttribution[];
}

export function RecommendationPreview({
  activityWindows,
  sensorNodes,
  forecast,
  sources,
}: RecommendationPreviewProps) {
  const windows: ActivityWindowRecommendation[] = activityWindows ?? [];

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
            <span className="font-heading text-[10px] px-2 py-0.5 rounded bg-[#101C2B] text-primary font-bold border border-[#1F334E]">
              Diurnal Science
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Activity windows are withheld unless explicitly supported by evidence. Modeled pollution forecasts do not establish safe exposure hours.
          </p>

          {/* Activity Cards List */}
          <div className="flex flex-col gap-2.5 mt-4">
            {windows.length === 0 && <p role="status" className="rounded-xl bg-[#101C2B] p-4 text-xs text-on-surface-variant">No validated activity windows available. Consult the modeled PM2.5 forecast and local public-health advice; no safe period can be guaranteed.</p>}
            {windows.map((item) => {
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

        <div className="mt-4 pt-3 border-t border-[#1F334E] flex items-center justify-between text-xs">
          <span className="text-outline">Forecast comparisons do not prove safe exposure</span>
          <span className="font-mono text-[11px] text-primary flex items-center gap-1">
            Source-aware guidance
          </span>
        </div>
      </div>

      {/* Right 5 cols: Environmental Telemetry Sources & Sensors */}
      <div className="lg:col-span-5 p-6 rounded-2xl bg-[#142235] border border-[#1F334E] shadow-surface-card flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-secondary" />
              <h3 className="font-heading text-base font-semibold text-on-surface">
                Telemetry & Model Providers
              </h3>
            </div>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#101C2B] text-outline border border-[#1F334E]">
              Data Lineage
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Verified environmental provenance separating physical station observations from numerical atmospheric models.
          </p>

          <div className="flex flex-col gap-2.5 mt-4">
            {/* Provider A: Open-Meteo */}
            <div className="p-3 rounded-xl bg-[#101C2B] border border-[#1F334E] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-heading text-xs font-bold text-on-surface flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-secondary" />
                  Open-Meteo Air Quality
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-secondary-container/20 text-secondary">
                  Atmospheric Model
                </span>
              </div>
              <p className="text-xs text-on-surface-variant">
                Copernicus Atmosphere Monitoring Service (CAMS) Global numerical dispersion model (~40km resolution outside Europe).
              </p>
              <div className="flex items-center justify-between font-mono text-[10px] text-outline pt-1 border-t border-[#1F334E]/60">
                <span>Variables: PM2.5, PM10, NO2, O3, SO2, CO</span>
                <span>5-Day Forecast</span>
              </div>
            </div>

            {/* Provider B: OpenAQ API v3 */}
            <div className="p-3 rounded-xl bg-[#101C2B] border border-[#1F334E] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-heading text-xs font-bold text-on-surface flex items-center gap-1.5">
                  <span
                    className={cn(
                      'w-2 h-2 rounded-full',
                      sources?.some((s) => s.provider === 'OpenAQ' && s.isStationObservation)
                        ? 'bg-primary'
                        : 'bg-warning'
                    )}
                  />
                  OpenAQ API v3
                </span>
                {sources?.some((s) => s.provider === 'OpenAQ' && s.isStationObservation) ? (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary-container/20 text-primary">
                    Ground Station Active
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-warning/15 text-warning border border-warning/30">
                    Unavailable (Using CAMS Fallback)
                  </span>
                )}
              </div>
              <p className="text-xs text-on-surface-variant">
                {sources?.some((s) => s.provider === 'OpenAQ' && s.isStationObservation)
                  ? 'Aggregates official physical monitoring stations (CPCB / State Pollution Control Boards) with strict radius discovery.'
                  : 'Ground station observations are currently unavailable (optional OPENAQ_API_KEY not configured or no eligible station in radius). Serving Open-Meteo CAMS forecast fallback.'}
              </p>
              <div className="flex items-center justify-between font-mono text-[10px] text-outline pt-1 border-t border-[#1F334E]/60">
                <span>Optional Server-Side X-API-Key</span>
                <span>Zero-Fabrication Guardrail</span>
              </div>
            </div>

            {/* Indian CPCB NAQI Engine */}
            <div className="p-3 rounded-xl bg-[#101C2B] border border-[#1F334E] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-heading text-xs font-bold text-on-surface flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-success" />
                  CPCB NAQI Calculation Engine
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-success/20 text-success">
                  Statutory Rule
                </span>
              </div>
              <p className="text-xs text-on-surface-variant">
                Piecewise linear interpolation on standard Indian breakpoints. Requires at least 3 qualifying pollutants including PM2.5 or PM10.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#1F334E] flex items-center justify-between text-xs font-mono text-outline">
          <span>Zero-Fabrication Standard</span>
          <span className="text-primary flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            Provenance disclosed
          </span>
        </div>
      </div>
    </div>
  );
}
