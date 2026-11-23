import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Sensor Stream Interrupted',
  message = 'Unable to synchronize telemetry with the regional station grid. Please check network connectivity or try refreshing.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'p-6 rounded-xl bg-surface-container border border-danger/30 shadow-surface-card flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left',
        className
      )}
    >
      <div className="p-3 rounded-xl bg-danger/10 text-danger shrink-0 border border-danger/20">
        <AlertTriangle className="w-6 h-6 text-danger" />
      </div>
      <div className="flex-1">
        <h4 className="font-heading font-semibold text-on-surface text-base mb-1">
          {title}
        </h4>
        <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
          {message}
        </p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-mono font-medium border border-outline-variant/60 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-primary" />
            <span>Re-Sync Grid</span>
          </button>
        )}
      </div>
    </div>
  );
}

