# AERIS-AI Architecture Specification

## 1. System Overview

AERIS-AI is engineered as a modern full-stack environmental decision intelligence platform on Next.js 15 (App Router). The platform strictly decouples client presentation from backend telemetry processing, numerical atmospheric models, and AI reasoning engines.

```
┌────────────────────────────────────────────────────────┐
│                   Next.js App Router                   │
│      Desktop Sidebar • App Header • Page Views         │
│  (Tailwind CSS • shadcn/ui • Recharts • Stitch Design) │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│             Next.js Server API Routes (/api)           │
│  - /api/air-quality (Dual-provider telemetry engine)   │
│  - /api/locations/search (Geocoding & city search)     │
│  - /api/copilot (Gemini AI Reasoning Engine - Stage 3) │
└───────────────────────────┬────────────────────────────┘
                            │
         ┌──────────────────┴──────────────────┐
         ▼                                     ▼
┌─────────────────────────────────┐   ┌─────────────────────────────────┐
│     Provider A: Open-Meteo      │   │     Provider B: OpenAQ v3       │
│   Modeled Dispersion Forecast   │   │    Ground Station Telemetry     │
│  (Copernicus CAMS ~40km grid)   │   │  (CPCB / State Boards In-Situ)  │
└─────────────────────────────────┘   └─────────────────────────────────┘
```

---

## 2. Directory & Service Architecture

```
lib/air-quality/
├── calculations/
│   ├── cpcb-aqi.ts             # Piecewise linear interpolation & CPCB rule engine
│   └── pollutant-utils.ts      # STP unit conversions (ppm, ppb, mg/m³ to standard)
├── constants/
│   ├── cpcb-breakpoints.ts     # Official CPCB breakpoint thresholds & categories
│   └── pollutant-metadata.ts   # Chemical formulas, standard units, health impacts
├── providers/
│   ├── open-meteo.ts           # Open-Meteo 5-day hourly forecast & CAMS attribution
│   └── openaq.ts               # OpenAQ API v3 client with location & sensor discovery
├── schemas/
│   └── air-quality-schema.ts   # Zod runtime schemas for coordinates, search, payloads
└── services/
    ├── air-quality-service.ts  # Orchestrator with 10-minute in-memory response cache
    ├── freshness-service.ts    # Freshness threshold classifier (<2h, 2-12h, 12-48h)
    ├── location-service.ts     # Geocoding resolution & major Indian city presets
    └── normalization-service.ts# Telemetry synthesis without provenance cross-contamination
```

---

## 3. API Contract Specifications

### `GET /api/air-quality`
- **Query Parameters:**
  - `lat` (number, required): -90 to 90
  - `lon` (number, required): -180 to 180
  - `radius` (number, optional): Search radius in meters (default: 25000)
  - `name` (string, optional): Display name for location
- **Cache-Control:** `public, s-maxage=600, stale-while-revalidate=300`
- **Response Structure (`AirQualityResponse`):**
  - `location`: Resolved geographic metadata.
  - `observations`: Map of `ObservationMetric` by pollutant (`PM2.5`, `PM10`, `NO2`, `O3`, `SO2`, `CO`).
  - `forecast`: Array of `HourlyForecastPoint` for 24h/5-day diurnal trajectory.
  - `aqi`: `CPCB_AQI_Result` with certified score, category, dominant pollutant, sub-indices, and statutory status.
  - `sources`: Complete provenance array (`SourceAttribution[]`).
  - `status`: `LIVE_OBSERVATION` | `PARTIAL_OBSERVATION` | `FORECAST_ONLY` | `UNAVAILABLE`.
  - `freshness`: Overall recency (`LIVE` | `RECENT` | `STALE` | `UNAVAILABLE`).

### `GET /api/locations/search`
- **Query Parameters:**
  - `q` (string, required): City name or query string (e.g., "Kolkata", "Anand Vihar")
- **Cache-Control:** `public, s-maxage=3600, stale-while-revalidate=7200`
- **Response:** Array of `LocationMetadata` with latitude, longitude, state, and country.
