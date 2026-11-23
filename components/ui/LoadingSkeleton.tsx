import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'card' | 'text' | 'circular' | 'chart';
}

export function LoadingSkeleton({ className, variant = 'card' }: LoadingSkeletonProps) {
  if (variant === 'circular') {
    return (
      <div
        className={cn(
          'rounded-full bg-surface-container-high animate-pulse border border-outline-variant/40',
          className
        )}
      />
    );
  }

  if (variant === 'text') {
    return (
      <div
        className={cn(
          'h-4 w-full rounded bg-surface-container-high animate-pulse border border-outline-variant/20',
          className
        )}
      />
    );
  }

  if (variant === 'chart') {
    return (
      <div
        className={cn(
          'w-full h-64 rounded-xl bg-surface-container p-4 flex flex-col justify-between border border-outline-variant/50 animate-pulse',
          className
        )}
      >
        <div className="flex justify-between items-center">
          <div className="h-5 w-48 rounded bg-surface-container-high" />
          <div className="h-8 w-32 rounded bg-surface-container-high" />
        </div>
        <div className="space-y-3 py-6">
          <div className="h-2 w-full rounded bg-surface-container-high/60" />
          <div className="h-2 w-5/6 rounded bg-surface-container-high/40" />
          <div className="h-2 w-4/6 rounded bg-surface-container-high/60" />
        </div>
        <div className="flex justify-between">
          <div className="h-3 w-12 rounded bg-surface-container-high" />
          <div className="h-3 w-12 rounded bg-surface-container-high" />
          <div className="h-3 w-12 rounded bg-surface-container-high" />
          <div className="h-3 w-12 rounded bg-surface-container-high" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-xl bg-surface-container p-5 border border-outline-variant/50 shadow-surface-card animate-pulse flex flex-col gap-3',
        className
      )}
    >
      <div className="flex justify-between items-center">
        <div className="h-4 w-28 rounded bg-surface-container-high" />
        <div className="h-4 w-12 rounded bg-surface-container-high" />
      </div>
      <div className="h-10 w-36 rounded bg-surface-container-highest my-2" />
      <div className="h-3 w-full rounded bg-surface-container-high/60" />
    </div>
  );
}

