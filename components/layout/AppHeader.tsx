'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  ChevronDown,
  RefreshCw,
  Search,
  Bell,
  Check,
  Radio,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const CITIES = [
  { id: 'kolkata-park', name: 'Kolkata, WB — Park Street Ward 63', primary: true },
  { id: 'kolkata-saltlake', name: 'Kolkata, WB — Salt Lake Sector V', primary: false },
  { id: 'mumbai-bandra', name: 'Mumbai, MH — Bandra Kurla Complex', primary: false },
  { id: 'delhi-anand', name: 'Delhi, DL — Anand Vihar', primary: false },
];

export function AppHeader() {
  const [selectedLocation, setSelectedLocation] = useState(CITIES[0]);
  const [locationOpen, setLocationOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshedTime, setLastRefreshedTime] = useState('4m ago');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshedTime('Just now');
    }, 900);
  };

  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-[#101C2B]/85 backdrop-blur-xl border-b border-[#1F334E] shadow-[0_1px_8px_rgba(0,0,0,0.25)] z-40">
      <div className="h-16 w-full px-4 lg:px-6 flex items-center justify-between gap-4">
        {/* Left Side: Brand on mobile + Location Selector + Telemetry sync */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Mobile Brand Mark */}
          <Link href="/" className="flex lg:hidden items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary-container flex items-center justify-center text-background font-heading font-black text-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#080F1C]" />
            </div>
            <span className="font-heading font-bold text-base text-on-surface">
              AERIS<span className="text-primary-container">-AI</span>
            </span>
          </Link>

          {/* Location Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLocationOpen(!locationOpen)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#142235]/90 hover:bg-[#19202D] border border-[#1F334E] transition-colors cursor-pointer text-left text-xs md:text-sm font-medium text-on-surface"
              aria-label="Select monitoring location"
            >
              <MapPin className="w-4 h-4 text-primary-container shrink-0" />
              <span className="truncate max-w-[140px] sm:max-w-[220px] md:max-w-none">
                {selectedLocation.name}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-on-surface-variant shrink-0" />
            </button>

            {locationOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 rounded-xl bg-[#142235] border border-[#1F334E] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2 py-1.5 text-[10px] font-heading uppercase tracking-wider text-outline">
                  Select Monitoring Grid
                </div>
                {CITIES.map((city) => (
                  <button
                    key={city.id}
                    type="button"
                    onClick={() => {
                      setSelectedLocation(city);
                      setLocationOpen(false);
                    }}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors text-left',
                      city.id === selectedLocation.id
                        ? 'bg-primary-container/20 text-primary-container font-semibold'
                        : 'text-on-surface hover:bg-[#19202D]'
                    )}
                  >
                    <span>{city.name}</span>
                    {city.id === selectedLocation.id && (
                      <Check className="w-3.5 h-3.5 text-primary-container" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sensor Telemetry Indicator (Hidden on small mobile) */}
          <div className="hidden xl:flex items-center gap-2 font-mono text-xs text-outline">
            <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" />
            <span>Illustrative Sensor Telemetry • Real-time Sync</span>
          </div>
        </div>

        {/* Center: Update source recency badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#142235]/70 border border-[#1F334E] shadow-inner text-xs font-mono">
          <Radio className="w-3.5 h-3.5 text-secondary" />
          <span className="text-on-surface-variant">Updated {lastRefreshedTime} • CPCB/OpenAQ Source</span>
          <button
            type="button"
            onClick={handleRefresh}
            className="p-1 rounded-full hover:bg-[#1F334E] text-on-surface-variant hover:text-on-surface transition-colors"
            title="Refresh Environmental Telemetry"
          >
            <RefreshCw className={cn('w-3.5 h-3.5', isRefreshing && 'animate-spin text-primary')} />
          </button>
        </div>

        {/* Right Controls: Search, Notifications, Profile */}
        <div className="flex items-center gap-3">
          {/* Quick Search */}
          <div className="relative hidden lg:block w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input
              type="text"
              placeholder="Search pollutants, wards..."
              className="w-full pl-9 pr-3 py-1.5 rounded-full bg-[#142235] text-on-surface placeholder:text-outline text-xs border border-[#1F334E] focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
            />
          </div>

          {/* Notifications Button */}
          <button
            type="button"
            className="relative p-2 rounded-full bg-[#142235]/80 hover:bg-[#19202D] border border-[#1F334E] text-on-surface-variant hover:text-on-surface transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full bg-danger text-[9px] font-heading font-bold text-white flex items-center justify-center">
              1
            </span>
          </button>

          {/* User Profile Control */}
          <div className="flex items-center gap-2.5 pl-1 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-[#080F1C] font-bold text-xs ring-1 ring-primary/40 shadow-sm">
              PS
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="font-heading text-xs text-on-surface font-semibold leading-tight">
                Dr. Priya Sen
              </span>
              <span className="font-heading text-[10px] text-primary-container">
                Household Admin
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

