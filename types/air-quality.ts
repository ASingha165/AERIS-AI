export type PollutantType = 'PM2.5' | 'PM10' | 'NO2' | 'O3' | 'SO2' | 'CO';

export type AQICategory = 
  | 'Good' 
  | 'Moderate' 
  | 'Unhealthy for Sensitive Groups' 
  | 'Unhealthy' 
  | 'Very Unhealthy' 
  | 'Hazardous';

export interface PollutantMetric {
  pollutant: PollutantType;
  fullName: string;
  value: number;
  unit: 'µg/m³' | 'ppb' | 'ppm';
  standardComparison: string;
  changeVsYesterdayPercent: number;
  trend: 'up' | 'down' | 'steady';
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

export interface ActivityWindowRecommendation {
  id: string;
  title: string;
  timeRange: string;
  startHour: number;
  endHour: number;
  aqiEstimated: number;
  status: 'optimal' | 'caution' | 'not-advised';
  badgeLabel: 'Optimal Slot' | 'Mask (N95)' | 'Not Advised' | 'Seal Windows';
  explanation: string;
  pollutantFocus: string;
}

export interface SensorNodeStatus {
  id: string;
  name: string;
  sensorType: string;
  coordinates: string;
  uptimePercent: number;
  status: 'online' | 'standby' | 'calibrating';
}

