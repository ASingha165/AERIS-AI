'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  Bot,
  Calendar,
  Users,
  Shield,
  Leaf,
  Settings,
  Sparkles,
  Radio,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  {
    label: 'Overview',
    href: '/dashboard',
    icon: LayoutGrid,
    tag: 'HUD',
  },
  {
    label: 'AI Copilot',
    href: '/copilot',
    icon: Bot,
    badge: 'GenAI',
  },
  {
    label: 'Daily Planner',
    href: '/planner',
    icon: Calendar,
  },
  {
    label: 'My Household',
    href: '/household',
    icon: Users,
  },
  {
    label: 'Indoor Guardian',
    href: '/indoor',
    icon: Shield,
    dot: true,
  },
  {
    label: 'Impact Explorer',
    href: '/impact',
    icon: Leaf,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [selectedCity, setSelectedCity] = useState<'Kolkata' | 'Mumbai'>('Kolkata');

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-full w-72 bg-[#101C2B]/95 backdrop-blur-xl z-50 flex-col justify-between border-r border-[#1F334E] shadow-[0_8px_32px_0_rgba(4,8,16,0.45)]">
      <div className="flex flex-col">
        {/* Brand Mark Header */}
        <div className="h-16 px-5 flex items-center justify-between gap-3 bg-[#070E1B]/60 border-b border-[#1F334E]">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-container to-secondary flex items-center justify-center text-background font-heading font-black text-sm shadow-glow-primary">
              <Sparkles className="w-4 h-4 text-[#080F1C]" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-lg font-bold tracking-tight text-on-surface leading-none">
                AERIS<span className="text-primary-container">-AI</span>
              </span>
              <span className="font-heading text-[10px] text-on-surface-variant uppercase tracking-widest mt-0.5">
                Atmospheric Intel
              </span>
            </div>
          </Link>
          <span className="font-heading text-[10px] px-2 py-0.5 rounded-full bg-primary-container/20 text-primary-container font-bold border border-primary-container/30">
            v2.4 Live
          </span>
        </div>

        {/* Telemetry Status Line */}
        <div className="px-5 py-3">
          <div className="px-3 py-1.5 rounded-md bg-[#151C29] border border-[#1F334E] flex items-center justify-between font-heading text-[10px] text-outline uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-primary-container animate-pulse" />
              Command Telemetry
            </span>
            <span className="flex h-1.5 w-1.5 rounded-full bg-primary-container animate-ping" />
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex flex-col gap-1 px-4 mt-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all text-sm font-medium',
                  isActive
                    ? 'bg-primary-container text-[#003829] font-bold shadow-[0_0_20px_rgba(55,230,181,0.25)]'
                    : 'text-on-surface-variant hover:bg-[#142235] hover:text-on-surface'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      'w-5 h-5 transition-transform group-hover:scale-105',
                      isActive ? 'text-[#003829]' : 'text-on-surface-variant group-hover:text-primary'
                    )}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={cn(
                        'font-heading text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider',
                        isActive
                          ? 'bg-[#003829] text-primary'
                          : 'bg-secondary-container/30 text-secondary border border-secondary/30'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.tag && (
                    <span
                      className={cn(
                        'font-mono text-[10px]',
                        isActive ? 'text-[#003829]/80' : 'text-outline group-hover:text-on-surface-variant'
                      )}
                    >
                      {item.tag}
                    </span>
                  )}
                  {item.dot && (
                    <span className="h-2 w-2 rounded-full bg-primary-container" />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Command Switch & Sensor Health */}
      <div className="p-4 flex flex-col gap-2.5 bg-[#070E1B]/60 m-4 rounded-xl border border-[#1F334E] shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
        <div className="flex items-center justify-between bg-[#142235] p-1 rounded-lg border border-[#1F334E]">
          <button
            type="button"
            onClick={() => setSelectedCity('Kolkata')}
            className={cn(
              'flex-1 py-1 text-center font-heading text-[10px] rounded font-bold transition-all',
              selectedCity === 'Kolkata'
                ? 'bg-primary-container text-[#003829] shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            )}
          >
            Kolkata (Primary)
          </button>
          <button
            type="button"
            onClick={() => setSelectedCity('Mumbai')}
            className={cn(
              'flex-1 py-1 text-center font-heading text-[10px] rounded font-bold transition-all',
              selectedCity === 'Mumbai'
                ? 'bg-primary-container text-[#003829] shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            )}
          >
            Mumbai
          </button>
        </div>

        <div className="flex items-center justify-between px-1 pt-1">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="font-mono text-[11px] text-on-surface-variant">142 Nodes Online</span>
          </div>
          <span className="font-mono text-[11px] text-secondary px-1.5 py-0.5 rounded bg-[#19202D] border border-[#1F334E]">
            18ms
          </span>
        </div>
      </div>
    </aside>
  );
}

