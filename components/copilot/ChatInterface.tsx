'use client';

import React, { useState } from 'react';
import { ShieldAlert, RotateCcw, Satellite } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { SuggestionPrompts } from './SuggestionPrompts';
import { DEMO_COPILOT_SUGGESTIONS } from '@/lib/demo-data';
import { CopilotMessage } from '@/types/copilot';
import { useAirQuality } from '@/lib/context/AirQualityContext';

export function ChatInterface() {
  const { selectedLocation } = useAirQuality();
  const [messages, setMessages] = useState<CopilotMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (trimmed.length < 2 || isLoading) return;

    const userMsg: CopilotMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      senderName: 'You',
    };

    const priorHistory = messages
      .filter((item) => item.role === 'user' || item.role === 'assistant')
      .slice(-12)
      .map((item) => ({ role: item.role as 'user' | 'assistant', content: item.content }));

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: priorHistory,
          location: {
            name: selectedLocation.name,
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude,
          },
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'AERIS could not complete the request.');

      const assistantMsg: CopilotMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: payload.answer,
        timestamp: new Date(payload.generatedAt ?? Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sensitiveGroupFlag: 'Environmental advisory · not medical care',
        timeWindowTag: `Data: ${payload.grounding?.dataStatus ?? 'unknown'}`,
        reasoning: {
          headline: `Grounded by ${payload.model}`,
          details: `Location: ${payload.grounding?.location ?? selectedLocation.name}. AQI status: ${payload.grounding?.aqiStatus ?? 'unknown'}. Sources: ${(payload.grounding?.sources ?? []).map((source: { provider: string; isStationObservation: boolean }) => `${source.provider} (${source.isStationObservation ? 'station observation' : 'modeled data'})`).join(', ') || 'No live source returned'}.`,
        },
        groundingSources: {
          cpcbStandard: 'CPCB methodology; certification status disclosed',
          whoGuideline: 'Follow local public-health guidance',
          satelliteSensor: 'Only providers returned by the live data service',
        },
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unexpected error contacting AERIS.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-heading text-[10px] text-primary uppercase tracking-widest mb-1">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>Grounded environmental reasoning · Gemini</span>
          </div>
          <h1 className="font-heading text-2xl lg:text-3xl font-bold text-on-surface tracking-tight">Ask AERIS.</h1>
          <p className="text-sm text-on-surface-variant max-w-xl mt-1">
            Environmental decision support grounded in {selectedLocation.name} data.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#142235] text-on-surface-variant text-xs font-mono border border-[#1F334E]">
            <Satellite className="w-3.5 h-3.5 text-secondary" />
            <span>Gemini 3.5 Flash-Lite</span>
            <span className="text-outline">•</span>
            <span className="text-primary font-bold">Server-side</span>
          </div>
          <button type="button" onClick={handleReset} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#142235] hover:bg-[#19202D] text-on-surface text-xs font-heading border border-[#1F334E] transition-all">
            <RotateCcw className="w-3.5 h-3.5 text-primary" />
            <span>Reset Thread</span>
          </button>
        </div>
      </div>

      <div className="rounded-xl bg-[#101C2B] p-4 border border-[#1F334E] shadow-surface-card flex items-start gap-3">
        <div className="p-2 rounded-lg bg-secondary/15 text-secondary shrink-0"><ShieldAlert className="w-5 h-5 text-secondary" /></div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-heading text-[10px] text-secondary uppercase font-bold tracking-wider">Advisory Protocol</span>
            <span className="text-outline text-xs">•</span>
            <span className="font-mono text-[10px] text-outline">Environmental decision support</span>
          </div>
          <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
            AERIS provides environmental information, not medical diagnosis or treatment. Current readings can be incomplete or unavailable. Follow local public-health guidance and your clinician&apos;s advice.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="flex flex-col gap-5 pt-2 pb-4">
            {messages.length === 0 && (
              <div className="rounded-2xl border border-[#1F334E] bg-[#101C2B] p-6 text-sm text-on-surface-variant">
                Ask about outdoor activity timing, pollution readings, ventilation, commuting, or ways to reduce exposure in {selectedLocation.name}. AERIS will disclose when the available data is incomplete.
              </div>
            )}
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} onSelectActionChip={handleSendMessage} />
            ))}
            {isLoading && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-[#101C2B] border border-[#1F334E] text-xs font-mono text-primary animate-pulse">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                <span>Retrieving environmental context and generating a grounded response…</span>
              </div>
            )}
            {error && (
              <div role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-100">{error}</div>
            )}
          </div>
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>

        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="p-5 rounded-2xl bg-[#142235] border border-[#1F334E] shadow-surface-card space-y-4">
            <SuggestionPrompts suggestions={DEMO_COPILOT_SUGGESTIONS} onSelectSuggestion={handleSendMessage} />
            <div className="pt-4 border-t border-[#1F334E]/60 space-y-3">
              <span className="font-heading text-[10px] uppercase text-outline tracking-wider">Active data context</span>
              <div className="p-3 rounded-xl bg-[#101C2B] border border-[#1F334E] space-y-2 text-xs">
                <div className="font-semibold text-on-surface">{selectedLocation.name}</div>
                <div className="text-on-surface-variant text-[11px]">Location context is retrieved server-side for each question. No household medical profile is assumed.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
