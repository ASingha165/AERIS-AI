import React from 'react';
import { Database, AlertCircle, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DataSourceBadgeProps {
  sourceName?: string;
  isSimulated?: boolean;
  timestamp?: string;
  className?: string;
}

export function DataSourceBadge({
  sourceName = 'CPCB / OpenAQ Ref',
  isSimulated = true,
  timestamp = '4m ago',
  className,
}: DataSourceBadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono backdrop-blur-md transition-all',
        isSimulated
          ? 'bg-surface-container-high/90 text-on-surface-variant border border-outline-variant/60 shadow-sm'
          : 'bg-primary-container/15 text-primary border border-primary/30',
        className
      )}
      title={
        isSimulated
          ? 'Illustrative Demonstration Telemetry. Simulated values for testing.'
          : `Live sync from ${sourceName}`
      }
    >
      <div className="flex items-center gap-1.5">
        {isSimulated ? (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary" />
          </span>
        ) : (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
        )}
        <span className="font-semibold text-on-surface">{sourceName}</span>
      </div>

      <span className="text-outline-variant">•</span>
      <span className="text-on-surface-variant">{timestamp}</span>

      {isSimulated && (
        <span className="px-1.5 py-0.2 rounded text-[10px] uppercase font-bold tracking-wider bg-secondary-container/20 text-secondary">
          Simulated Demo
        </span>
      )}
    </div>
  );
}

export function DemonstrationNoticeBanner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg bg-surface-container-high/80 border border-outline-variant/50 backdrop-blur-md shadow-sm text-sm',
        className
      )}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <AlertCircle className="w-4 h-4 text-secondary shrink-0" />
        <p className="text-xs md:text-sm text-on-surface-variant truncate">
          <span className="font-bold text-secondary uppercase tracking-wider font-heading mr-1.5">
            Illustrative Data Mode:
          </span>
          All numerical metrics and telemetry shown below are simulated placeholder values designed for interface demonstrations. Not certified statutory data.
        </p>
      </div>
      <div className="shrink-0 flex items-center gap-1.5">
        <span className="font-mono text-[11px] text-outline px-2 py-0.5 rounded bg-surface-container-lowest/80 border border-outline-variant/30">
          SYN-STAGE-1
        </span>
      </div>
    </div>
  );
}

