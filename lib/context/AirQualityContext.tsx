'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AirQualityResponse, LocationMetadata } from '@/types/air-quality';
import { PREDEFINED_LOCATIONS } from '@/lib/air-quality/services/location-service';

interface AirQualityContextType {
  selectedLocation: LocationMetadata;
  setSelectedLocation: (location: LocationMetadata) => void;
  data: AirQualityResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
}

const AirQualityContext = createContext<AirQualityContextType | undefined>(undefined);

export function AirQualityProvider({ children }: { children: React.ReactNode }) {
  const [selectedLocation, setSelectedLocation] = useState<LocationMetadata>(PREDEFINED_LOCATIONS[0]);
  const [data, setData] = useState<AirQualityResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  const fetchData = useCallback(async (location: LocationMetadata) => {
    setIsLoading(true);
    setError(null);

    try {
      const url = new URL('/api/air-quality', window.location.origin);
      url.searchParams.set('lat', location.latitude.toString());
      url.searchParams.set('lon', location.longitude.toString());
      url.searchParams.set('name', location.name);

      const res = await fetch(url.toString(), {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`API returned HTTP ${res.status}: ${res.statusText}`);
      }

      const responseJson: AirQualityResponse = await res.json();
      setData(responseJson);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to retrieve air quality data';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isDemoMode) {
      fetchData(selectedLocation);
    }
  }, [selectedLocation, isDemoMode, fetchData]);

  const refetch = useCallback(async () => {
    await fetchData(selectedLocation);
  }, [fetchData, selectedLocation]);

  return (
    <AirQualityContext.Provider
      value={{
        selectedLocation,
        setSelectedLocation,
        data,
        isLoading,
        error,
        refetch,
        isDemoMode,
        setIsDemoMode,
      }}
    >
      {children}
    </AirQualityContext.Provider>
  );
}

export function useAirQuality() {
  const context = useContext(AirQualityContext);
  if (!context) {
    throw new Error('useAirQuality must be used within an AirQualityProvider');
  }
  return context;
}
