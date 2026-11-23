'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MapPin,
  ChevronDown,
  RefreshCw,
  Search,
  Check,
  Radio,
  Sparkles,
  Crosshair,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAirQuality } from '@/lib/context/AirQualityContext';
import { PREDEFINED_LOCATIONS } from '@/lib/air-quality/services/location-service';
import { LocationMetadata } from '@/types/air-quality';

export function AppHeader() {
  const { selectedLocation, setSelectedLocation, refetch, isLoading, data } = useAirQuality();
  const [locationOpen, setLocationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationMetadata[]>(PREDEFINED_LOCATIONS);
  const [isSearching, setIsSearching] = useState(false);
  const [geoLocating, setGeoLocating] = useState(false);

  // Search locations effect
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(PREDEFINED_LOCATIONS);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/locations/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const results: LocationMetadata[] = await res.json();
          setSearchResults(results);
        }
      } catch {
        // Keep existing
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setGeoLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(4));
        const lon = Number(pos.coords.longitude.toFixed(4));
        setSelectedLocation({
          name: 'Current Location',
          state: 'GPS Telemetry',
          country: 'Local',
          latitude: lat,
          longitude: lon,
        });
        setGeoLocating(false);
        setLocationOpen(false);
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        setGeoLocating(false);
        alert('Could not determine your GPS location. Please select a city.');
      },
      { timeout: 8000 }
    );
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
                {selectedLocation.name}{selectedLocation.state ? `, ${selectedLocation.state}` : ''}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-on-surface-variant shrink-0" />
            </button>

            {locationOpen && (
              <div className="absolute top-full left-0 mt-2 w-80 sm:w-96 rounded-xl bg-[#142235] border border-[#1F334E] shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-3">
                {/* Search input */}
                <div className="relative">
                  <Search className="w-4 h-4 text-outline absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search city, district, or coordinates..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#101C2B] border border-[#1F334E] text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary"
                    autoFocus
                  />
                  {isSearching && (
                    <Loader2 className="w-3.5 h-3.5 text-primary animate-spin absolute right-3 top-2.5" />
                  )}
                </div>

                {/* GPS Location Button */}
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={geoLocating}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-primary-container/10 hover:bg-primary-container/20 text-primary border border-primary/20 text-xs font-heading font-medium transition-colors"
                >
                  {geoLocating ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Crosshair className="w-3.5 h-3.5" />
                  )}
                  <span>{geoLocating ? 'Determining GPS coordinates...' : 'Use My Current Location'}</span>
                </button>

                {/* Results list */}
                <div className="max-h-60 overflow-y-auto space-y-1">
                  <div className="px-2 py-1 text-[10px] font-heading uppercase tracking-wider text-outline">
                    {searchQuery ? 'Search Matches' : 'Major Monitoring Grids'}
                  </div>
                  {searchResults.map((loc) => {
                    const isSelected =
                      Math.abs(loc.latitude - selectedLocation.latitude) < 0.05 &&
                      Math.abs(loc.longitude - selectedLocation.longitude) < 0.05;

                    return (
                      <button
                        key={`${loc.name}-${loc.latitude}-${loc.longitude}`}
                        type="button"
                        onClick={() => {
                          setSelectedLocation(loc);
                          setLocationOpen(false);
                          setSearchQuery('');
                        }}
                        className={cn(
                          'w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors text-left',
                          isSelected
                            ? 'bg-primary-container/20 text-primary-container font-semibold'
                            : 'text-on-surface hover:bg-[#19202D]'
                        )}
                      >
                        <div className="truncate">
                          <span className="font-medium">{loc.name}</span>
                          <span className="text-outline text-[11px] ml-1.5">
                            {loc.state ? `${loc.state}, ` : ''}{loc.country}
                          </span>
                        </div>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-primary-container shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sensor Telemetry Indicator */}
          <div className="hidden xl:flex items-center gap-2 font-mono text-xs text-outline">
            <span
              className={cn(
                'h-1.5 w-1.5 rounded-full',
                isLoading ? 'bg-warning animate-ping' : 'bg-primary animate-pulse'
              )}
            />
            <span>
              {isLoading
                ? 'Syncing telemetry...'
                : data?.status === 'LIVE_OBSERVATION'
                ? 'Live Ground Station'
                : data?.status === 'PARTIAL_OBSERVATION'
                ? 'Hybrid Station Telemetry'
                : 'CAMS Atmospheric Model'}
            </span>
          </div>
        </div>

        {/* Right Side: Re-Sync button & User Info */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#142235] hover:bg-[#19202D] text-on-surface text-xs font-mono border border-[#1F334E] transition-colors disabled:opacity-50"
            title="Force refresh air quality telemetry"
          >
            <RefreshCw className={cn('w-3.5 h-3.5 text-primary', isLoading && 'animate-spin')} />
            <span className="hidden sm:inline">{isLoading ? 'Syncing...' : 'Re-Sync'}</span>
          </button>

          {/* Quick status pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#142235] border border-[#1F334E] text-[11px] font-mono text-outline">
            <Radio className="w-3 h-3 text-secondary" />
            <span>{selectedLocation.latitude.toFixed(2)}°N, {selectedLocation.longitude.toFixed(2)}°E</span>
          </div>
        </div>
      </div>
    </header>
  );
}
