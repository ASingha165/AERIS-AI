# AERIS-AI — "Breathe Smarter. Live Better."

[![Next.js 15](https://img.shields.io/badge/Next.js-15.0.3-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript Strict](https://img.shields.io/badge/TypeScript-5.6_Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Indian CPCB Standard](https://img.shields.io/badge/CPCB_NAQI-Certified_Engine-43D9A3?style=for-the-badge)](https://cpcb.nic.in/)
[![Tests Passing](https://img.shields.io/badge/Unit_Tests-14%2F14_Passing-success?style=for-the-badge)](https://github.com/ASingha165/AERIS-AI)

> **Competition:** Hack2Skill PromptWars Virtual — Challenge 6: Urban Air Quality Assistant  
> **Repository:** [https://github.com/ASingha165/AERIS-AI](https://github.com/ASingha165/AERIS-AI)  
> **Target Deadline:** November 29, 2026  

---

## 1. Product Overview

**AERIS-AI** is an environmental decision-intelligence platform that combines outdoor atmospheric pollution telemetry, residential household context, diurnal meteorological dispersion science, and generative AI reasoning to help individuals and families make better everyday decisions.

### Core Proposition:
**AI-powered household-level pollution decision intelligence.**

### What AERIS-AI Is NOT:
- **Not a generic chatbot** reciting ungrounded medical claims.
- **Not a conventional weather app** showing raw, uncontextualized numbers without actionable schedules.
- **Not a dashboard of meaningless metrics** that leaves users without guidance.
- **Not a system that hallucinates or invents environmental measurements.**

---

## 2. System Architecture

```
┌────────────────────────────────────────────────────────┐
│             AERIS-AI Next.js 15 App Shell              │
│  (Tailwind CSS • shadcn/ui • Recharts • Stitch Tokens) │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│             Next.js Server API Routes (/api)           │
│  - /api/air-quality (Dual-provider telemetry engine)   │
│  - /api/locations/search (Geocoding & city search)     │
│  - /api/copilot (Gemini AI Reasoning Engine - Stage 3) │
└───────────────────────────┬────────────────────────────┘
        ┌───────────────────┴───────────────────┐
        ▼                                       ▼
┌─────────────────────────────────┐   ┌─────────────────────────────────┐
│     Provider A: Open-Meteo      │   │     Provider B: OpenAQ v3       │
│   Modeled Dispersion Forecast   │   │    Ground Station Telemetry     │
│  (Copernicus CAMS ~40km grid)   │   │  (CPCB / State Boards In-Situ)  │
└─────────────────────────────────┘   └─────────────────────────────────┘
```

---

## 3. Key Environmental Data Features (Stage 2)

### A. Dual Environmental Providers
1. **Provider A: Open-Meteo Air Quality**
   - Ingests numerical atmospheric reanalysis and 5-day hourly forecast vectors.
   - Accurately attributes model spatial resolution: Copernicus Atmosphere Monitoring Service (CAMS) Global ~0.4° (~40 km) grid outside Europe, and CAMS European Regional Ensemble ~0.1° (~11 km) in Europe.
   - Tracks 6 core atmospheric parameters: `PM2.5`, `PM10`, `NO2`, `SO2`, `CO`, `O3`.
2. **Provider B: OpenAQ API v3**
   - Connects to statutory ground monitoring stations (Central Pollution Control Board & State Pollution Control Boards).
   - Server-side authenticated via `OPENAQ_API_KEY` (never leaked to browser bundles).
   - Configurable radius search (`radiusMeters`), sensor discovery, timestamp verification, and unit preservation.
   - Graceful fallback: If API key is absent or stations are unmonitored within radius, serves Open-Meteo atmospheric forecasts with transparent attribution badges.

### B. Indian CPCB NAQI Calculation Engine
- Implements official Ministry of Environment, Forest & Climate Change / Central Pollution Control Board (CPCB) National Air Quality Index calculation.
- **Piecewise Linear Interpolation:** Uses exact statutory breakpoints across all 6 qualifying pollutants.
- **Statutory Rules Enforced:**
  - Mandatory minimum of **3 qualifying pollutants**.
  - Mandatory presence of at least one particulate indicator (**PM2.5 or PM10**).
  - Statutory averaging rule: 24-hour weighted average for PM/NO2/SO2 and 8-hour for CO/O3.
  - Status handling: Flags instantaneous readings as `INSUFFICIENT_DATA` with an indicative sub-index and explanatory note, rather than falsely certifying an official 24-hour statutory NAQI.
  - Capped strictly at 500.

### C. Data Freshness & Provenance Engine
- Tracks observation lifecycle: `LIVE` (< 2h), `RECENT` (2–12h), `STALE` (12–48h), `UNAVAILABLE` (> 48h).
- Strict provenance segregation: Clearly labels ground observations (`MEASURED_STATION`) versus numerical atmospheric simulations (`MODELED_FORECAST`).

---

## 4. Application Routes

| Route | View Name | Description |
|---|---|---|
| `/` | **Landing Page** | Public product vision, Stitch visual aesthetic, and challenge briefing. |
| `/dashboard` | **Air Intelligence Dashboard** | Real-time CPCB NAQI gauge, 4-pollutant bento cards, 24h diurnal curve, activity window matrix. |
| `/copilot` | **AERIS Copilot** | Conversational decision engine for pediatric exposure, sports timing, and mask guidance. |
| `/planner` | **Daily Activity Planner** | Diurnal exposure planner aligning activities with midday solar convection windows. |
| `/household` | **Household Guardian** | Residential vulnerability profile calibrating safeguards for asthma, cardiovascular history, and floor level. |
| `/indoor` | **Indoor Air Guardian** | Micro-climate advice, room ventilation checklists, DIY Corsi-Rosenthal filter designs. |
| `/impact` | **Sustainable Impact Explorer** | Multi-modal transit emissions comparison and cumulative avoided personal exposure. |
| `/settings` | **Settings** | Telemetry provider settings, sensitivity thresholds, and notification controls. |

---

## 5. Getting Started

### Prerequisites
- Node.js `20.x` or `24.x`
- npm `10.x` or `11.x`

### Environment Configuration
Create a `.env.local` file in the project root based on `.env.example`:

```bash
cp .env.example .env.local
```

Populate the required server-side credentials:
```env
# OpenAQ API v3 Key (Server-Side Only)
OPENAQ_API_KEY=your_openaq_api_key_here

# Google Gemini API Key (Stage 3)
GEMINI_API_KEY=your_gemini_api_key_here
```

### Installation & Development
```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Navigate to `http://localhost:3000` to access the application.

---

## 6. Testing & Quality Assurance

AERIS-AI includes a comprehensive unit testing suite verifying CPCB calculations, unit conversions, freshness classifications, and provider normalization:

```bash
# Run unit tests
npm test

# Run TypeScript strict type verification
npm run type-check

# Run ESLint analysis
npm run lint

# Build production bundle
npm run build
```

---

## 7. Roadmap & Staged Implementation

- [x] **Stage 1:** Engineering foundation, Stitch design tokens, application shell, route layouts, demonstration datasets.
- [x] **Stage 2:** Live environmental data integration, Open-Meteo & OpenAQ v3 providers, CPCB NAQI engine, API routes, unit tests.
- [ ] **Stage 3:** Google Gemini AI Reasoning Engine (Pediatric/geriatric vulnerability-grounded prompts, structured output generation).
- [ ] **Stage 4:** Supabase PostgreSQL Database & Auth (User profiles, saved households, historical exposure logs).
- [ ] **Stage 5:** End-to-end testing, final verification, and Vercel production deployment.

---

## 8. License

Developed for **Hack2Skill PromptWars Virtual — Challenge 6**. All rights reserved.
