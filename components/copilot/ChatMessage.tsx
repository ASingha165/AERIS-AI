'use client';

import React from 'react';
import {
  Bot,
  User,
  CheckCheck,
  AlertTriangle,
  Lightbulb,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { CopilotMessage } from '@/types/copilot';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: CopilotMessage;
  onSelectActionChip?: (chipText: string) => void;
}

export function ChatMessage({ message, onSelectActionChip }: ChatMessageProps) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex items-start justify-end gap-3 pl-8">
        <div className="flex flex-col items-end max-w-xl">
          <div className="flex items-center gap-2 mb-1 font-mono text-[11px] text-outline">
            <span>{message.senderName || 'Dr. Priya Sen'}</span>
            <span>•</span>
            <span>{message.timestamp}</span>
          </div>
          <div className="rounded-2xl rounded-tr-none bg-[#142235] p-4 text-on-surface border border-[#1F334E] shadow-surface-card">
            <p className="text-sm leading-relaxed">{message.content}</p>
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-outline font-mono text-[10px]">
            <CheckCheck className="w-3.5 h-3.5 text-primary-container" />
            <span>Delivered to Atmospheric Engine</span>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#1F334E] flex items-center justify-center text-primary-container shrink-0 mt-3 border border-[#1F334E]">
          <User className="w-4 h-4 text-primary" />
        </div>
      </div>
    );
  }

  // Assistant Message
  return (
    <div className="flex items-start gap-3 pr-2">
      <div className="w-9 h-9 rounded-xl bg-[#142235] border border-primary-container/40 flex items-center justify-center text-primary shrink-0 shadow-glow-primary">
        <Bot className="w-5 h-5 text-primary-container" />
      </div>

      <div className="flex-1 flex flex-col gap-3">
        {/* Confidence & Telemetry Status Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {message.confidenceScore && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-heading text-[10px] uppercase tracking-wider font-bold border border-primary/25 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
              GenAI Analysis • Confidence: {message.confidenceScore}%
            </span>
          )}
          {message.sensitiveGroupFlag && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#142235] text-on-surface-variant font-mono text-[11px] border border-[#1F334E]">
              {message.sensitiveGroupFlag}
            </span>
          )}
          {message.timeWindowTag && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#142235] text-on-surface-variant font-mono text-[11px] border border-[#1F334E]">
              <Calendar className="w-3 h-3 text-primary-container" />
              {message.timeWindowTag}
            </span>
          )}
        </div>

        {/* Main Copilot Card with Top Glow Accent */}
        <div className="rounded-2xl rounded-tl-none bg-[#101C2B] p-5 lg:p-6 border border-[#1F334E] shadow-surface-card relative overflow-hidden">
          {/* Top highlight bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-transparent opacity-80" />

          {/* Main Answer Content (when plain answer is provided) */}
          {message.content && !message.strategicRecommendation && (
            <div className="p-4 rounded-xl bg-[#080F1C]/90 border border-[#1F334E] mb-4 shadow-inner">
              <p className="text-xs md:text-sm text-on-surface leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
            </div>
          )}

          {/* 1. Short Strategic Recommendation */}
          {message.strategicRecommendation && (
            <div className="p-4 rounded-xl bg-[#080F1C]/90 border border-[#1F334E] mb-4 shadow-inner">
              <div className="flex items-start gap-3">
                <span className="text-2xl mt-0.5">
                  {message.strategicRecommendation.statusEmoji}
                </span>
                <div>
                  <h4 className="font-heading text-sm lg:text-base text-on-surface font-semibold">
                    {message.strategicRecommendation.headline}
                  </h4>
                  <p className="text-xs md:text-sm text-on-surface mt-1 leading-relaxed">
                    {message.strategicRecommendation.summary}
                  </p>
                  {message.strategicRecommendation.optimalAlternativeTime && (
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary/15 text-secondary border border-secondary/30 font-mono text-xs font-bold">
                      Recommended: {message.strategicRecommendation.optimalAlternativeTime}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Visual Inhalation Exposure SVG Chart */}
          {message.projectedExposure && (
            <div className="rounded-xl bg-[#142235]/70 border border-[#1F334E] p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-heading text-[10px] text-outline uppercase tracking-wider font-bold">
                  Projected Inhalation Exposure ({message.projectedExposure.location})
                </span>
                <span className="font-mono text-xs text-secondary">
                  PM2.5 Trend (µg/m³)
                </span>
              </div>

              {/* Graphic projection sparkline */}
              <div className="h-20 w-full relative flex items-end">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 400 80">
                  <defs>
                    <linearGradient id="copilotGraphGrad" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#37E6B5" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#37E6B5" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path d="M0,58 Q70,62 130,52 T250,22 T400,8 L400,80 L0,80 Z" fill="url(#copilotGraphGrad)" />
                  <path d="M0,58 Q70,62 130,52 T250,22 T400,8" fill="none" stroke="#37E6B5" strokeWidth="2.5" />
                  <circle cx="270" cy="20" r="4.5" fill="#37E6B5" stroke="#101C2B" strokeWidth="2" />
                  <line x1="270" y1="20" x2="270" y2="80" stroke="#53C7F5" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                </svg>
              </div>

              {/* Labels below chart */}
              <div className="flex justify-between items-center font-mono text-[11px] text-outline mt-2 pt-2 border-t border-[#1F334E]/40">
                {message.projectedExposure.points.map((pt, i) => (
                  <span
                    key={i}
                    className={cn(
                      pt.alertLevel === 'high' || pt.alertLevel === 'critical'
                        ? 'text-danger font-bold'
                        : 'text-on-surface-variant'
                    )}
                  >
                    {pt.timeLabel} ({pt.pm25Concentration} µg)
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 2. Atmospheric & Physiological Reasoning */}
          {message.reasoning && (
            <div className="mb-4">
              <div className="flex items-center gap-1.5 font-heading text-[11px] text-secondary uppercase font-bold tracking-wider mb-1.5">
                <Lightbulb className="w-3.5 h-3.5" />
                <span>{message.reasoning.headline}</span>
              </div>
              <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                {message.reasoning.details}
              </p>
            </div>
          )}

          {/* Action Chips */}
          {message.actionChips && message.actionChips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#1F334E]/60">
              <span className="font-heading text-[10px] uppercase text-outline mr-1">
                Suggested Actions:
              </span>
              {message.actionChips.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectActionChip && onSelectActionChip(chip)}
                  className="px-3 py-1 rounded-lg bg-[#142235] hover:bg-[#19202D] text-on-surface text-xs font-mono border border-[#1F334E] hover:border-primary-container transition-all"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Grounding Source Attribution */}
          {message.groundingSources && (
            <div className="mt-4 pt-3 border-t border-[#1F334E]/40 flex flex-wrap items-center gap-3 text-[10px] font-mono text-outline">
              <span className="flex items-center gap-1 text-primary">
                <ShieldCheck className="w-3.5 h-3.5" />
                Grounding Sources:
              </span>
              <span>{message.groundingSources.cpcbStandard}</span>
              <span>•</span>
              <span>{message.groundingSources.whoGuideline}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

