'use client';

import React, { useState } from 'react';
import { Send, Sparkles, Mic, Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isLoading) return;
    onSendMessage(text.trim());
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative flex items-center rounded-2xl bg-[#101C2B] border border-[#1F334E] p-1.5 focus-within:border-primary-container focus-within:ring-2 focus-within:ring-primary-container/20 shadow-2xl transition-all">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask AERIS about children activities, windows, mask protocols..."
          disabled={isLoading}
          className="flex-1 bg-transparent px-4 py-2.5 text-sm text-on-surface placeholder:text-outline focus:outline-none"
        />

        <div className="flex items-center gap-1.5 pr-1">
          <button
            type="button"
            className="p-2 rounded-xl text-outline hover:text-on-surface hover:bg-[#142235] transition-colors"
            title="Attach Sensor Log"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <button
            type="submit"
            disabled={!text.trim() || isLoading}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl font-heading text-xs font-bold transition-all',
              text.trim() && !isLoading
                ? 'bg-primary-container text-[#003829] shadow-glow-primary hover:shadow-glow-primary-lg'
                : 'bg-[#19202D] text-outline cursor-not-allowed'
            )}
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between px-2 pt-1.5 text-[10px] font-mono text-outline">
        <span>AERIS AI Copilot v2.4 • Household Guidance Core</span>
        <span>Simulated AI Reasoning Mode</span>
      </div>
    </form>
  );
}

