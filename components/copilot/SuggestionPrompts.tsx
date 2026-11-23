'use client';

import React from 'react';
import { QuickPromptSuggestion } from '@/types/copilot';
import { Sparkles } from 'lucide-react';

interface SuggestionPromptsProps {
  suggestions: QuickPromptSuggestion[];
  onSelectSuggestion: (promptText: string) => void;
}

export function SuggestionPrompts({
  suggestions,
  onSelectSuggestion,
}: SuggestionPromptsProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5 font-heading text-[10px] text-outline uppercase tracking-wider">
        <Sparkles className="w-3 h-3 text-primary-container" />
        <span>Suggested Decision Inquiries</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((sug) => (
          <button
            key={sug.id}
            type="button"
            onClick={() => onSelectSuggestion(sug.promptText)}
            className="px-3.5 py-1.5 rounded-xl bg-[#142235] hover:bg-[#19202D] border border-[#1F334E] hover:border-primary-container/60 text-xs text-on-surface transition-all text-left shadow-sm"
          >
            <span className="text-primary-container font-mono mr-1.5">✦</span>
            <span>{sug.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

