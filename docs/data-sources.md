# Environmental Data Sources & Integration Protocols

## 1. Primary Data Sources

AERIS-AI coordinates three tiers of environmental data:

### Tier 1: Ground Station Sensors (In-Situ Observations)
- **Central Pollution Control Board (CPCB) India:**
  - Standard: National Air Quality Index (NAQI) breakpoints.
  - Core pollutants: PM2.5, PM10, NO2, SO2, CO, O3, NH3, Pb.
  - Instrumentation: Beta Attenuation Monitors (BAM), UV Photometric O3 Analyzers, Chemiluminescence NO2 Analyzers.
- **OpenAQ API v3:**
  - Global aggregation platform providing uniform JSON endpoints for statutory station feeds.
  - Endpoint: `https://api.openaq.org/v3/locations`
  - Authentication: `X-API-Key` (Stored server-side in `OPENAQ_API_KEY`).

### Tier 2: Numerical Atmospheric Reanalysis & Dispersion
- **Open-Meteo Air Quality API:**
  - High-resolution atmospheric dispersion modeling combining CAMS (Copernicus Atmosphere Monitoring Service) and European regional forecasts.
  - Provides Planetary Boundary Layer Height (PBLH), Surface Inversion parameters, and 7-day hourly forecast vectors.
  - Endpoint: `https://air-quality-api.open-meteo.com/v1/air-quality`

### Tier 3: Satellite Remote Sensing
- **Sentinel-5P TROPOMI:**
  - Tropospheric Ozone, Nitrogen Dioxide column density, and Aerosol Index overlays for broad regional plume tracking.

## 2. Data Standard Schema

Every environmental observation ingested by AERIS-AI follows this uniform TypeScript interface:

```typescript
export interface PollutantMetric {
  pollutant: 'PM2.5' | 'PM10' | 'NO2' | 'O3' | 'SO2' | 'CO';
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
```

## 3. Demonstration Data Mode (Stage 1)
During Stage 1, all illustrative values are served from `lib/demo-data.ts`. They are clearly identified with the `DemonstrationNoticeBanner` component to prevent user confusion.

