# AERIS-AI Architecture Specification

## 1. System Overview

AERIS-AI is engineered as a modern full-stack web application on Next.js 15 with App Router. The platform decouples client-side presentation from backend telemetry processing and AI reasoning engines.

```
┌────────────────────────────────────────────────────────┐
│                   Next.js App Router                   │
│        Desktop Sidebar • Mobile Nav • Page Views       │
└────────────────────────────────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│            Modular Next.js API Layer (/api)            │
│  - /api/telemetry (OpenAQ / CPCB ingestion)            │
│  - /api/copilot (Gemini API LLM reasoning)             │
│  - /api/household (Supabase CRUD)                      │
│  - /api/planner (Dispersion calculations)              │
└────────────────────────────────────────────────────────┘
        │                  │                   │
        ▼                  ▼                   ▼
┌──────────────┐   ┌──────────────┐    ┌───────────────┐
│ Google       │   │ Supabase     │    │ Environmental │
│ Gemini 1.5   │   │ PostgreSQL   │    │ APIs (OpenAQ, │
│ Flash / Pro  │   │ Auth & Data  │    │ Open-Meteo)   │
└──────────────┘   └──────────────┘    └───────────────┘
```

## 2. Component Hierarchy

### Global Layout Shell:
- `app/layout.tsx`: Root HTML, Space Grotesk and Inter fonts, dark theme provider.
- `components/layout/AppSidebar.tsx`: Fixed 288px desktop sidebar with telemetry node status and route links.
- `components/layout/AppHeader.tsx`: Fixed top bar with location selector, live sync badge, search input, and profile trigger.
- `components/layout/MobileNavigation.tsx`: Fixed bottom navigation for mobile screen widths (<1024px).
- `components/layout/DashboardLayout.tsx`: Shell coordinator wrapping authenticated views.

### Domain Modules:
1. **Air Quality HUD (`/dashboard`):**
   - `AQIOverview`: High-level category, primary driver callout, ambient parameters.
   - `AQIGauge`: 270-degree SVG radial gauge with dynamic color styling.
   - `PollutantCard`: 4-column bento grid for PM2.5, PM10, NO2, O3 with historical sparklines.
   - `AirQualityChart`: 24-hour diurnal curve with measured vs generative forecast envelope.
   - `RecommendationPreview`: Daily scheduling windows & node telemetry table.

2. **Copilot Interface (`/copilot`):**
   - `ChatInterface`: Conversation orchestrator with advisory notices.
   - `ChatMessage`: Dual-role message bubble with confidence metrics, exposure curves, and action chips.
   - `ChatInput`: Controlled prompt input.
   - `SuggestionPrompts`: Quick-inquiry discovery chips.

3. **Daily Planner (`/planner`):**
   - `ActivitySelector`: Routine selection with duration range scrubber.
   - `PollutionTimeline`: Hourly micro-inversion exposure matrix.
   - `ActivityRecommendation`: Inversion-safe schedule decision.

4. **Household Guardian (`/household`):**
   - `HouseholdForm`: Multi-tab profile configurator with vulnerability index scoring.

5. **Indoor Guardian (`/indoor`):**
   - `RoomSelector`: Spatial geometry breakdown, fenestration specs, and DIY budget filtration.

6. **Impact Explorer (`/impact`):**
   - `SustainableComparison`: Multi-modal commute transit evaluation & carbon offset quantification.

## 3. Styling & Token Specifications

Tailwind CSS tokens are calibrated directly to `DESIGN.md` in `stitch_aeris_environmental_intelligence_platform`:
- Background Base: `#080F1C`
- Container Surface: `#142235`
- Primary Signal: `#37E6B5`
- Secondary Signal: `#53C7F5`
- Warning: `#F6C453`
- Danger: `#F16B77`
- Hairline Border: `#1F334E`

