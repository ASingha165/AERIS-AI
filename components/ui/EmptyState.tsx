import React from 'react';
import { Wind, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center rounded-xl bg-surface-container border border-outline-variant/60 shadow-surface-card max-w-lg mx-auto',
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center text-primary mb-4 border border-outline-variant/50 shadow-inner">
        {icon || <Wind className="w-7 h-7 text-primary" />}
      </div>
      <h3 className="font-heading text-lg font-bold text-on-surface mb-2">{title}</h3>
      <p className="text-sm text-on-surface-variant max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-container text-on-primary-container font-heading text-sm font-bold shadow-glow-primary hover:shadow-glow-primary-lg transition-all"
        >
          <span>{actionLabel}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

