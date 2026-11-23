'use client';

import React, { useState } from 'react';
import { ShieldAlert, RotateCcw, Satellite } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { SuggestionPrompts } from './SuggestionPrompts';
import {
  DEMO_COPILOT_CONVERSATION,
  DEMO_COPILOT_SUGGESTIONS,
} from '@/lib/demo-data';
import { CopilotMessage } from '@/types/copilot';

export function ChatInterface() {
  const [messages, setMessages] = useState<CopilotMessage[]>(DEMO_COPILOT_CONVERSATION);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = (text: string) => {
    const userMsg: CopilotMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      senderName: 'Dr. Priya Sen',
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    // Simulated responsive intelligence answer
    setTimeout(() => {
      const assistantMsg: CopilotMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        confidenceScore: 94,
        sensitiveGroupFlag: 'Household Personalization Filter Active',
        timeWindowTag: 'Calculated from Diurnal Gradient',
        strategicRecommendation: {
          statusEmoji: '🛡️',
          headline: 'Aerodynamic Shift Recommendation',
          summary: `Analyzing your inquiry: "${text}". Atmospheric boundary layer dispersion is strongest between 13:00 - 15:30 IST today. Keep windows sealed during evening nocturnal inversion hours.`,
          optimalAlternativeTime: '13:30 – 15:30 IST Today',
        },
        reasoning: {
          headline: 'Scientific Meteorological Basis',
          details: 'Ground inversion and vehicular particulate surges create localized micro-climates. Our dual-ensemble model estimates personal respiratory load can be curtailed by up to 45% simply by shifting outdoor exertion windows.',
        },
        actionChips: [
          'Filter by child vulnerability',
          'Export to Daily Planner',
          'Check HEPA indoor status',
        ],
        groundingSources: {
          cpcbStandard: 'CPCB National AQI Index Standards',
          whoGuideline: 'WHO 2021 Global Guidelines (Annual & 24h targets)',
          satelliteSensor: 'TROPOMI Satellite & High-Res Open-Meteo',
        },
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsLoading(false);
    }, 1000);
  };

  const handleReset = () => {
    setMessages(DEMO_COPILOT_CONVERSATION);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-heading text-[10px] text-primary uppercase tracking-widest mb-1">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>Orbital Telemetry Stream Active • Synced Session</span>
          </div>
          <h1 className="font-heading text-2xl lg:text-3xl font-bold text-on-surface tracking-tight">
            Ask AERIS.
          </h1>
          <p className="text-sm text-on-surface-variant max-w-xl mt-1">
            Environmental intelligence for everyday household decisions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#142235] text-on-surface-variant text-xs font-mono border border-[#1F334E]">
            <Satellite className="w-3.5 h-3.5 text-secondary" />
            <span>Sentinel-5P Overlay</span>
            <span className="text-outline">•</span>
            <span className="text-primary font-bold">Realtime</span>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#142235] hover:bg-[#19202D] text-on-surface text-xs font-heading border border-[#1F334E] transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 text-primary" />
            <span>Reset Thread</span>
          </button>
        </div>
      </div>

      {/* Advisory disclaimer banner */}
      <div className="rounded-xl bg-[#101C2B] p-4 border border-[#1F334E] shadow-surface-card flex items-start gap-3">
        <div className="p-2 rounded-lg bg-secondary/15 text-secondary shrink-0">
          <ShieldAlert className="w-5 h-5 text-secondary" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-heading text-[10px] text-secondary uppercase font-bold tracking-wider">
              Advisory Protocol
            </span>
            <span className="text-outline text-xs">•</span>
            <span className="font-mono text-[10px] text-outline">WHO & CPCB Ground Rules</span>
          </div>
          <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
            <strong className="text-on-surface">Notice:</strong> AERIS provides environmental intelligence and micro-exposure mitigation guidance, not medical diagnosis or clinical treatment. Always cross-evaluate with personal pediatric advice.
          </p>
        </div>
      </div>

      {/* 2-Column layout: Chat stream on left, Suggestions & Telemetry on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Chat history */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="flex flex-col gap-5 pt-2 pb-4">
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                onSelectActionChip={handleSendMessage}
              />
            ))}

            {isLoading && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-[#101C2B] border border-[#1F334E] text-xs font-mono text-primary animate-pulse">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                <span>AERIS Atmospheric Dispersion Model computing trajectory...</span>
              </div>
            )}
          </div>

          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>

        {/* Right: Quick suggestions and Context Dock */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="p-5 rounded-2xl bg-[#142235] border border-[#1F334E] shadow-surface-card space-y-4">
            <SuggestionPrompts
              suggestions={DEMO_COPILOT_SUGGESTIONS}
              onSelectSuggestion={handleSendMessage}
            />

            <div className="pt-4 border-t border-[#1F334E]/60 space-y-3">
              <span className="font-heading text-[10px] uppercase text-outline tracking-wider">
                Active Household Profile Context
              </span>
              <div className="p-3 rounded-xl bg-[#101C2B] border border-[#1F334E] space-y-2 text-xs">
                <div className="flex justify-between font-semibold">
                  <span className="text-on-surface">Dr. Priya Sen Household</span>
                  <span className="text-danger font-mono">High Sensitivity</span>
                </div>
                <div className="text-on-surface-variant space-y-1 text-[11px]">
                  <div>• 1 Child (Age 7, Mild Asthma)</div>
                  <div>• 1 Senior (Age 69, Cardiovascular)</div>
                  <div>• 4th Floor Apartment, Park Street</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

