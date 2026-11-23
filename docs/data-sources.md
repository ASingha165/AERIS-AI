# Environmental Data Sources & Integration Protocols

AERIS-AI integrates two independent, verified environmental telemetry tiers without manufacturing or hallucinating sensor measurements.

---

## 1. Provider Architecture

```
                               ┌─────────────────────────────────┐
                               │       AERIS-AI Service Layer     │
                               │  (lib/air-quality/services/)    │
                               └────────────────┬────────────────┘
                                                │
                     ┌──────────────────────────┴──────────────────────────┐
                     ▼                                                     ▼
    ┌─────────────────────────────────┐                   ┌─────────────────────────────────┐
    │     Provider A: Open-Meteo      │                   │     Provider B: OpenAQ v3       │
    │   Atmospheric Forecast Model    │                   │   Physical Ground Station Data  │
    └────────────────┬────────────────┘                   └────────────────┬────────────────┘
                     │                                                     │
     • CAMS Global Model (~40km grid)                      • Physical statutory stations
     • Hourly 5-day predictive vectors                     • X-API-Key server authorization
     • PM2.5, PM10, NO2, O3, SO2, CO                       • Strict geographic radius query
     • Modeled, NOT station telemetry                      • In-situ ground observations
```

---

## 2. Provider A: Open-Meteo Air Quality API

- **Endpoint:** `https://air-quality-api.open-meteo.com/v1/air-quality`
- **Role:** Modeled numerical atmospheric pollution reanalysis & 5-day hourly forecasts.
- **Atmospheric Model Provenance:**
  - **Outside Europe (e.g., India / Kolkata):** Copernicus Atmosphere Monitoring Service (CAMS) Global reanalysis model at approximately **0.4° (~40 km)** grid cell resolution.
  - **Inside Europe:** CAMS Regional Ensemble at approximately **0.1° (~11 km)** grid cell resolution.
- **Hourly Variables Queried:**
  - `pm2_5`: Fine particulate matter (≤ 2.5 µm) [µg/m³]
  - `pm10`: Coarse particulate matter (≤ 10 µm) [µg/m³]
  - `nitrogen_dioxide`: Nitrogen dioxide [µg/m³]
  - `sulphur_dioxide`: Sulphur dioxide [µg/m³]
  - `ozone`: Ground-level ozone [µg/m³]
  - `carbon_monoxide`: Carbon monoxide [µg/m³]
- **Attribution & Transparency Rule:**
  - Forecast points are explicitly labeled as **modeled atmospheric dispersion estimates**, never as ground monitoring stations.
  - Does not invent or simulate physical sensor hardware IDs from numerical grid points.

---

## 3. Provider B: OpenAQ API v3

- **Base URL:** `https://api.openaq.org/v3`
- **Role:** Ground monitoring station telemetry (CPCB, State Pollution Control Boards, national environmental agencies).
- **Authentication:** `X-API-Key: process.env.OPENAQ_API_KEY` (strictly server-side, never exposed to client bundles).
- **Pipeline Operations:**
  1. **Station Discovery:** Queries `/locations?coordinates={lat},{lon}&radius={radiusMeters}&limit=10`.
  2. **Eligible Station Identification:** Identifies nearest physical monitoring station with valid coordinates and active sensor telemetry.
  3. **Measurement Ingestion:** Retrieves latest parameter readings (`/locations/{id}/latest`), validating timestamps and preserving original reporting units.
  4. **Graceful Fallback:** If `OPENAQ_API_KEY` is not configured or no active physical stations exist within the search radius, returns `available: false` with descriptive reason code (`NO_API_KEY` or `NO_STATION_FOUND`), allowing Open-Meteo forecasts to serve transparently without breaking the user experience.

---

## 4. Indian CPCB NAQI Calculation Engine

AERIS-AI calculates the **National Air Quality Index (NAQI)** using the official Central Pollution Control Board (CPCB), Ministry of Environment, Forest & Climate Change standard.

### Piecewise Linear Interpolation Formula:
$$I_p = \frac{I_{Hi} - I_{Lo}}{B_{Hi} - B_{Lo}} \times (C_p - B_{Lo}) + I_{Lo}$$

Where:
- $C_p$: Actual pollutant concentration.
- $B_{Hi}, B_{Lo}$: Breakpoint concentrations enclosing $C_p$.
- $I_{Hi}, I_{Lo}$: Sub-index values corresponding to $B_{Hi}, B_{Lo}$.

### Official CPCB Breakpoints Matrix:

| Category | AQI Range | PM2.5 (24h) [µg/m³] | PM10 (24h) [µg/m³] | NO2 (24h) [µg/m³] | SO2 (24h) [µg/m³] | CO (8h) [mg/m³] | O3 (8h) [µg/m³] |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Good** | 0 – 50 | 0 – 30 | 0 – 50 | 0 – 40 | 0 – 40 | 0.0 – 1.0 | 0 – 50 |
| **Satisfactory** | 51 – 100 | 31 – 60 | 51 – 100 | 41 – 80 | 41 – 80 | 1.1 – 2.0 | 51 – 100 |
| **Moderately Polluted** | 101 – 200 | 61 – 90 | 101 – 250 | 81 – 180 | 81 – 380 | 2.1 – 10.0 | 101 – 168 |
| **Poor** | 201 – 300 | 91 – 120 | 251 – 350 | 181 – 280 | 381 – 800 | 10.1 – 17.0 | 169 – 208 |
| **Very Poor** | 301 – 400 | 121 – 250 | 351 – 430 | 281 – 400 | 801 – 1600 | 17.1 – 34.0 | 209 – 748 |
| **Severe** | 401 – 500 | 251 – 380 | 431 – 510 | 401 – 500 | 1601 – 2000 | 34.1 – 50.0 | 749 – 1000 |

### Mandatory CPCB Statutory Rules:
1. **Minimum Pollutant Criterion:** At least **3 qualifying pollutants** must have valid observations.
2. **Mandatory Particulate Criterion:** At least one of the three must be a particulate matter indicator (**PM2.5 or PM10**).
3. **Statutory Averaging Period:** Official CPCB NAQI requires statutory time-weighted averages (**24-hour** for PM2.5, PM10, NO2, SO2; **8-hour** for CO, O3).
4. **Status Flagging:**
   - When criteria are satisfied with full averaging: `CALCULATED` (Certified official NAQI).
   - When criteria are partially met or instantaneous: `INSUFFICIENT_DATA` (Indicative sub-index displayed with explicit explanatory status reason).
5. **Dominant Pollutant:** The overall index is determined by $\max(I_p)$; the pollutant with the highest sub-index is designated as the dominant driver.
6. **Maximum Index Cap:** Capped at 500.

---

## 5. Freshness Classification Protocol

Every observation metric carries an explicit `DataFreshness` lifecycle state:
- **`LIVE` (< 2 hours):** Real-time measurement synced from active station or recent forecast timestep.
- **`RECENT` (2 – 12 hours):** Recent observation within the current diurnal cycle.
- **`STALE` (12 – 48 hours):** Outdated observation; indicates potential station transmitter delay.
- **`UNAVAILABLE` (> 48 hours or missing):** Sensor offline or telemetry unavailable.
