# AGENTS.md — Authoritative Engineering Instruction File

> **Project:** AERIS-AI  
> **Tagline:** "Breathe Smarter. Live Better."  
> **Competition:** Hack2Skill PromptWars Virtual — Challenge 6: Urban Air Quality Assistant  
> **Target Deadline:** November 29, 2026  
> **Repository Root:** `D:\Aeris`  
> **Status:** Stage 2.1 and Stage 3 implementation merged; live Gemini runtime verification pending.

---

## 1. Product Overview

AERIS-AI is an environmental intelligence platform that synthesizes outdoor air-quality telemetry, residential household context, meteorological dispersion science, and generative AI reasoning to help individuals and families make better everyday decisions.

### Core Proposition
AI-powered household-level pollution decision intelligence.

### What AERIS-AI Is NOT:
- **Not a generic chatbot** providing unverified medical statements.
- **Not a conventional weather application** displaying static numbers without actionable schedules.
- **Not a dashboard filled with meaningless metrics** that leaves users without guidance.
- **Not a system that invents or hallucinates environmental measurements** or indoor hardware readings.

---

## 2. Challenge Requirements (Challenge 6 — Urban Air Quality Assistant)

AERIS-AI satisfies Challenge 6 by providing:
1. **Hyper-local air quality indexing:** Tracking PM2.5, PM10, NO2, SO2, CO, and O3 with national and international standard benchmarks (CPCB & WHO).
2. **Context-aware activity planning:** Identifying diurnal meteorological dispersion windows (e.g., peak solar convection vs nocturnal inversion).
3. **Household-level vulnerability personalization:** Calibrating health safeguards based on pediatric asthma, geriatric cardiovascular history, and residential elevation.
4. **Indoor micro-climate guidance:** Actionable room-by-room interventions, window ventilation schedules, and budget DIY Corsi-Rosenthal filter designs.
5. **Sustainable transit intelligence:** Direct quantification of avoided tailpipe emissions (CO2 & PM) and personal exposure mitigation across transit modes.

---

## 3. Approved Architecture

AERIS-AI is structured into a modular, decoupled architecture:

```
┌────────────────────────────────────────────────────────┐
│             AERIS-AI Next.js 15 App Shell              │
│  (Tailwind CSS • shadcn/ui • Recharts • Lucide React)  │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│             Next.js Server API Routes                  │
│             (TypeScript • Zod Validation)              │
│   - /api/air-quality                                   │
│   - /api/locations/search                              │
│   - /api/copilot (Gemini reasoning)                    │
└───────────────────────────┬────────────────────────────┘
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌───────────────┐   ┌────────────────┐   ┌───────────────────┐
│ Gemini API    │   │ Supabase Postg.│   │ Environmental APIS│
│ (GenAI Engine)│   │ (User Profiles)│   │ OpenAQ API v3     │
│ [Stage 3]     │   │ [Stage 4]      │   │ Open-Meteo Air    │
│               │   │                │   │ [Stage 2 Complete]│
└───────────────┘   └────────────────┘   └───────────────────┘
```

---

## 4. Technology Stack

- **Framework:** Next.js 15 (App Router)
- **UI Runtime:** React 18 / 19
- **Type Safety:** TypeScript (Strict mode enabled)
- **Styling & Design System:** Tailwind CSS (configured with Google Stitch tokens)
- **Icons:** Lucide React
- **Data Visualization:** Recharts & custom responsive SVGs
- **Validation:** Zod
- **Testing:** Node.js native test runner with `tsx` (`npm test`)
- **Environmental Data (Stage 2):** OpenAQ API v3 (station telemetry), Open-Meteo Air Quality (CAMS dispersion ensemble), Indian CPCB NAQI calculation engine
- **AI Orchestration (Stage 3):** Google Gemini API
- **Data Persistence (Stage 4):** Supabase PostgreSQL

---

## 5. Environmental Data Engine Specifications (Stage 2)

- **Provider A (Open-Meteo):** Modeled atmospheric pollution forecasts. Global Copernicus Atmospheric Monitoring Service (CAMS) ~40km resolution outside Europe.
- **Provider B (OpenAQ v3):** Ground monitoring stations (CPCB & State Boards). Authorized via server-side `OPENAQ_API_KEY`. Graceful fallback if key is absent.
- **CPCB NAQI Rules:**
  - Piecewise linear interpolation across 6 official pollutants.
  - Mandatory requirement: At least 3 qualifying pollutants, one of which must be PM2.5 or PM10.
  - Statutory averaging: 24-hr for PM/NO2/SO2, 8-hr for CO/O3.
  - Status flags: `CALCULATED` only when statutory averaging and qualifying-pollutant requirements are met; otherwise `INSUFFICIENT_DATA`. AERIS is not a CPCB-issued certification.
  - Maximum AQI cap: 500.
- **Freshness Classification:**
  - `LIVE`: < 2 hours
  - `RECENT`: 2 – 12 hours
  - `STALE`: 12 – 48 hours
  - `UNAVAILABLE`: > 48 hours or missing

---

## 6. Current Development Status

- **Stage 1 (Complete):** Engineering foundation, Stitch design implementation, route layouts, isolated demonstration datasets.
- **Stage 2 (Complete):** Live environmental data integration, Open-Meteo CAMS provider, OpenAQ v3 provider, CPCB calculation engine, freshness classifier, `/api/air-quality`, `/api/locations/search`, full unit test suite, and production build verification.
- **Stage 2.1 (Complete):** Data-integrity hardening merged into `main`; regression and CI checks pass.
- **Stage 3 (Merged; runtime verification pending):** Gemini 2.5 Flash Copilot route and UI merged into `main`; CI passes. Live API smoke test and browser QA remain.
- **Stage 4 (Pending):** Supabase PostgreSQL Database & Auth.
- **Stage 5 (Pending):** End-to-End Testing & Production Deployment on Vercel.


## Stage 3 — Gemini Copilot implementation guardrails

- Keep `GEMINI_API_KEY` server-side only; never expose it through a `NEXT_PUBLIC_` variable or log its value.
- Validate every request with the Zod schema and retain bounded message/history lengths and geographic coordinate ranges.
- Ground current-condition statements only in the selected-location data retrieved by `AirQualityService`.
- Preserve provenance: `MEASURED_STATION` is distinct from `MODELED_FORECAST`; never describe CAMS model output as a ground-station measurement.
- Do not invent current AQI values, station names, sensor counts, timestamps, weather variables, satellite observations, or quantified exposure reductions.
- When the CPCB-methodology result is `INSUFFICIENT_DATA` or `UNAVAILABLE`, state that an official overall index cannot be established. AERIS is not CPCB-certified.
- Do not diagnose, prescribe, or advise medication changes. Recommend qualified clinical or emergency support for urgent symptoms.
- Do not infer or transmit household medical profiles. Such profile integration requires a separately reviewed consent, privacy, and data-minimization design.
- Stage 3 is not complete until CI, live Gemini API smoke testing, and browser-level functional checks are recorded.
