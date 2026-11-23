export type PollutantType = 'PM2.5' | 'PM10' | 'NO2' | 'O3' | 'SO2' | 'CO';

/**
 * Official Indian CPCB NAQI Categories + US compatibility union
 */
export type AQICategory = 
  | 'Good' 
  | 'Satisfactory' 
  | 'Moderately Polluted' 
  | 'Poor' 
  | 'Very Poor' 
  | 'Severe'
  | 'Moderate' 
  | 'Unhealthy for Sensitive Groups' 
  | 'Unhealthy' 
  | 'Hazardous';

export type DataFreshness = 'LIVE' | 'RECENT' | 'STALE' | 'UNAVAILABLE';

export type ObservationType = 'MEASURED_STATION' | 'MODELED_FORECAST';

export interface ObservationMetric {
  pollutant: PollutantType;
  fullName: string;
  value: number;
  unit: string;
  observationType: ObservationType;
  provider: 'OpenAQ' | 'Open-Meteo' | 'CPCB';
  sourceName: string;
  timestamp: string;
  freshness: DataFreshness;
  averagingHoursExpected?: number;
  subIndex?: number | null;
  subIndexCategory?: AQICategory | null;
  historySparkline?: number[];
  station?: {
    id: string;
    name: string;
    distanceKm?: number;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
}

export interface AQISubIndex {
  pollutant: PollutantType;
  value: number;
  concentration: number;
  unit: string;
  category: AQICategory;
  averagingPeriodHours: number;
}

export interface CPCB_AQI_Result {
  value: number | null;
  category: AQICategory | null;
  standard: 'INDIA_CPCB_NAQI';
  status: 'CALCULATED' | 'INSUFFICIENT_DATA' | 'UNAVAILABLE';
  dominantPollutant: PollutantType | null;
  statusReason: string;
  subIndices: Partial<Record<PollutantType, AQISubIndex>>;
  qualifyingPollutantsCount: number;
  hasParticulateMatter: boolean;
}

export interface HourlyForecastPoint {
  time: string;
  hour: number;
  isCurrentHour?: boolean;
  pm25: number | null;
  pm10: number | null;
  no2: number | null;
  o3: number | null;
  so2: number | null;
  co: number | null;
  indicativeAqi?: number | null;
  indicativeCategory?: AQICategory | null;
}

export interface SourceAttribution {
  provider: 'OpenAQ' | 'Open-Meteo' | 'CPCB';
  datasetName: string;
  attributionText: string;
  url: string;
  modelResolution?: string;
  isStationObservation: boolean;
  stationCount?: number;
}

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface LocationMetadata {
  name: string;
  state?: string;
  country: string;
  latitude: number;
  longitude: number;
  distanceKm?: number;
}

export interface AirQualityResponse {
  location: LocationMetadata;
  observations: Partial<Record<PollutantType, ObservationMetric>>;
  forecast: HourlyForecastPoint[];
  aqi: CPCB_AQI_Result;
  sources: SourceAttribution[];
  updatedAt: string | null;
  status: 'LIVE_OBSERVATION' | 'PARTIAL_OBSERVATION' | 'FORECAST_ONLY' | 'UNAVAILABLE';
  freshness: DataFreshness;
}

export interface ActivityWindowRecommendation {
  id: string;
  title: string;
  timeRange: string;
  startHour: number;
  endHour: number;
  aqiEstimated?: number;
  estimatedAqi?: number | null;
  status: 'optimal' | 'caution' | 'not-advised';
  badgeLabel: 'Optimal Slot' | 'Mask (N95)' | 'Not Advised' | 'Seal Windows';
  explanation: string;
  pollutantFocus: string;
}

export interface MonitoringStation {
  id: string;
  name: string;
  provider: string;
  distanceKm: number;
  coordinates: LocationCoordinates;
  lastUpdated: string;
  availableSensors: PollutantType[];
  status: 'active' | 'stale' | 'offline';
}

/**
 * Stage 1 Isolated Demonstration & Prototyping Types
 */
export interface PollutantMetric {
  pollutant: PollutantType;
  fullName: string;
  value: number;
  unit: 'µg/m³' | 'ppb' | 'ppm' | string;
  standardComparison: string;
  changeVsYesterdayPercent: number;
  trend: 'up' | 'down' | 'steady' | 'neutral';
  category: AQICategory;
  source: string;
  timestamp: string;
  isForecast: boolean;
  historySparkline: number[];
}

export interface AirQualityReading {
  aqi: number;
  category: AQICategory;
  dominantPollutant: PollutantType;
  primaryHazardDriver: string;
  location: {
    stationId: string;
    name: string;
    ward: string;
    city: string;
    state: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    gridZone: string;
  };
  metrics: Record<PollutantType, PollutantMetric>;
  syncRecency: string;
  syncTimestamp: string;
  dataSource: {
    name: string;
    provider: string;
    protocol: string;
    isCertifiedGovt: boolean;
  };
  aiModelTrustPercent: number;
  weatherAmbient: {
    temperatureC: number;
    relativeHumidityPercent: number;
    windSpeedKmh: number;
    windDirection: string;
    boundaryLayerHeightM: number;
    surfaceInversionActive: boolean;
    inversionIntensity: 'None' | 'Moderate' | 'Strong';
  };
  sensorTelemetry: {
    nodesOnline: number;
    latencyMs: number;
    status: 'optimal' | 'degraded' | 'offline';
  };
}

export interface DiurnalForecastPoint {
  time: string;
  hour: number;
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
  isHistorical: boolean;
  confidenceLower?: number;
  confidenceUpper?: number;
  annotation?: string;
}

export interface SensorNodeStatus {
  id: string;
  name: string;
  sensorType: string;
  coordinates: string;
  uptimePercent: number;
  status: 'online' | 'standby' | 'calibrating';
}
