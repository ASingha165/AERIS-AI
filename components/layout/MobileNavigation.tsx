'use client';

import React from 'react';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';

const MOBILE_NAV_ITEMS = [
  { label: 'Overview', href: '/dashboard', icon: LayoutGrid },
  { label: 'Copilot', href: '/copilot', icon: Bot },
  { label: 'Planner', href: '/planner', icon: Calendar },
  { label: 'Household', href: '/household', icon: Users },
  { label: 'Indoor', href: '/indoor', icon: Shield },
  { label: 'Impact', href: '/impact', icon: Leaf },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export function MobileNavigation() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#101C2B]/95 backdrop-blur-xl border-t border-[#1F334E] z-50 px-2 flex items-center justify-around shadow-2xl">
      {MOBILE_NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors min-w-[50px]',
              isActive
                ? 'text-primary-container font-bold'
                : 'text-on-surface-variant hover:text-on-surface'
            )}
          >
            <Icon className={cn('w-5 h-5 mb-0.5', isActive && 'text-primary-container')} />
            <span className="font-heading text-[9px] uppercase tracking-wider">
              {item.label}
            </span>
            {isActive && (
              <span className="h-1 w-4 rounded-full bg-primary-container mt-0.5" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

