# AGENTS.md — Authoritative Engineering Instruction File

> **Project:** AERIS-AI  
> **Tagline:** "Breathe Smarter. Live Better."  
> **Competition:** Hack2Skill PromptWars Virtual — Challenge 6: Urban Air Quality Assistant  
> **Target Deadline:** November 29, 2026  
> **Repository Root:** `D:\Aeris`  
> **Status:** Stage 1 Completed — Engineering Foundation & Frontend Implementation

---

## 1. Product Overview

AERIS-AI is an environmental intelligence platform that synthesizes outdoor air-quality telemetry, residential household context, meteorological dispersion science, and generative AI reasoning to help individuals and families make better everyday decisions.

### Core Proposition
AI-powered household-level pollution decision intelligence.

### What AERIS-AI Is NOT:
- **Not a generic chatbot** providing unverified medical statements.
- **Not a conventional weather application** displaying static numbers without actionable schedules.
- **Not a dashboard filled with meaningless metrics** that leaves users without guidance.
- **Not a system that invents or halluncinates environmental measurements** or indoor hardware readings.

---

## 2. Challenge Requirements (Challenge 6 — Urban Air Quality Assistant)

AERIS-AI satisfies Challenge 6 by providing:
1. **Hyper-local air quality indexing:** Tracking PM2.5, PM10, NO2, and O3 with national and international standard benchmarks (CPCB & WHO).
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
└────────────────────────────────────────────────────────┘
        │                                  ▲
        ▼                                  │
┌────────────────────────────────────────────────────────┐
│             Next.js Server API Routes                  │
│             (TypeScript • Zod Validation)              │
└────────────────────────────────────────────────────────┘
        │                                  │
   ┌────┴──────────────┬───────────────────┴────┐
   ▼                   ▼                        ▼
┌───────────────┐ ┌────────────────┐ ┌───────────────────┐
│ Gemini API    │ │ Supabase Postg.│ │ Environmental APIS│
│ (GenAI Engine)│ │ (User Profiles)│ │ CPCB / OpenAQ v3  │
│ [Stage 3]     │ │ [Stage 4]      │ │ Open-Meteo Air    │
│               │ │                │ │ [Stage 2]         │
└───────────────┘ └────────────────┘ └───────────────────┘
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
- **AI Orchestration (Stage 3):** Google Gemini API
- **Data Persistence (Stage 4):** Supabase PostgreSQL
- **Environmental Data (Stage 2):** CPCB Reference, OpenAQ API v3, Open-Meteo Air Quality

---

## 5. Project Directory Structure

```
D:\Aeris\
├── app/                                # Next.js 15 App Router
│   ├── layout.tsx                      # Root layout (Space Grotesk + Geist/Inter)
│   ├── globals.css                     # Global styles, dark scrollbar, glow utilities
│   ├── page.tsx                        # Public landing page
│   ├── dashboard/page.tsx              # Air Intelligence Dashboard
│   ├── copilot/page.tsx                # Conversational AI Copilot
│   ├── planner/page.tsx                # Pollution-aware Daily Planner
│   ├── household/page.tsx              # Household Personalization
│   ├── indoor/page.tsx                 # Indoor Air Guardian
│   ├── impact/page.tsx                 # Sustainable Impact Explorer
│   └── settings/page.tsx               # Application Settings
├── components/
│   ├── layout/
│   │   ├── AppSidebar.tsx              # Desktop command sidebar (72rem, 288px)
│   │   ├── AppHeader.tsx               # Top command bar, location selector, sync badge
│   │   ├── MobileNavigation.tsx        # Mobile bottom navigation bar
│   │   └── DashboardLayout.tsx         # Unified dashboard shell wrapper
│   ├── dashboard/
│   │   ├── AQIGauge.tsx                # Segmented 270° radial SVG gauge
│   │   ├── AQIOverview.tsx             # Hero command card
│   │   ├── PollutantCard.tsx           # Bento pollutant cards (PM2.5, PM10, NO2, O3)
│   │   ├── AirQualityChart.tsx         # 24h diurnal trajectory with Recharts
│   │   └── RecommendationPreview.tsx   # Activity windows + sensor node health
│   ├── copilot/
│   │   ├── ChatInterface.tsx           # Full conversation manager
│   │   ├── ChatMessage.tsx             # User & assistant diagnostic bubble
│   │   ├── ChatInput.tsx               # Streamlined command prompt input
│   │   └── SuggestionPrompts.tsx       # Quick decision inquiries
│   ├── planner/
│   │   ├── ActivitySelector.tsx        # Routine, date, and duration selector
│   │   ├── PollutionTimeline.tsx       # Hourly exposure cards
│   │   └── ActivityRecommendation.tsx  # Inversion-safe schedule decision
│   ├── household/
│   │   └── HouseholdForm.tsx           # Multi-tab residential & member manager
│   ├── indoor/
│   │   └── RoomSelector.tsx            # Sub-zone tabs, specs, and checklists
│   ├── impact/
│   │   └── SustainableComparison.tsx   # Commute transit comparisons & carbon offset
│   └── ui/
│       ├── DataSourceBadge.tsx         # Telemetry badges & simulation notices
│       ├── LoadingSkeleton.tsx         # Crystal shimmer skeletons
│       ├── EmptyState.tsx              # Semantic empty state
│       └── ErrorState.tsx              # Graceful error state with re-sync
├── types/
│   ├── air-quality.ts                  # Pollutant, reading, diurnal forecast types
│   ├── copilot.ts                      # Copilot message & exposure point types
│   ├── household.ts                    # Household & family member sensitivity types
│   ├── planner.ts                      # Routine activity & schedule types
│   ├── indoor.ts                       # Room zone & strategy types
│   └── impact.ts                       # Transport comparison & impact types
├── lib/
│   ├── utils.ts                        # Tailwind merge & AQI category theme helpers
│   └── demo-data.ts                    # Isolated illustrative demonstration datasets
├── docs/
│   ├── architecture.md                 # Full system architecture documentation
│   ├── requirements.md                 # Challenge 6 specification matrix
│   ├── data-sources.md                 # CPCB, OpenAQ, and Open-Meteo data protocols
│   └── implementation-roadmap.md       # Multi-stage engineering roadmap
├── stitch_aeris_environmental_intelligence_platform/ # Design source of truth
├── .env.example                        # Environment variable documentation
├── tailwind.config.ts                  # Stitch design token configurations
├── tsconfig.json                       # Strict TypeScript configuration
└── AGENTS.md                           # This authoritative instruction file
```

---

## 6. Design System & Stitch Conformance

Visual identity strictly implements **Atmospheric Command** defined in `stitch_aeris_environmental_intelligence_platform/atmospheric_intelligence/DESIGN.md`:

### Approved Color Palette:
- **Canvas Base (`background`):** `#080F1C`
- **Secondary Background (`surface-container-low`):** `#101C2B`
- **Standard Card Container (`surface-container`):** `#142235`
- **Surface Border:** `#1F334E`
- **Primary Signal (`primary-container`):** `#37E6B5`
- **Secondary Stream (`secondary`):** `#53C7F5`
- **Primary Readout (`on-surface`):** `#F5FAFF`
- **Secondary Readout (`outline` / `on-surface-variant`):** `#A5B7C8`
- **Nominal / Cleared (`success`):** `#43D9A3`
- **Caution / Moderate (`warning`):** `#F6C453`
- **Severe / Critical (`danger`):** `#F16B77`

### Typography:
- **Space Grotesk:** Prominent headlines, AQI numerals, badge pills, telemetry labels (`font-heading`).
- **Inter / Geist:** Body text, explanatory copy, and tabular numbers (`font-sans` / `font-mono`).

---

## 7. Coding Conventions

- **Server vs Client Components:** Server components are the default in Next.js. Any component using hooks (`useState`, `useEffect`, `usePathname`) or event listeners must declare `'use client'` at the very top.
- **Strict Typing:** No `any` types in domain models. All props, API outputs, and states must use interfaces in `types/`.
- **Styling:** Use Tailwind utility classes matching the design tokens. Avoid ad-hoc arbitrary hex colors when theme classes (`bg-primary-container`, `text-secondary`, `bg-surface-container`) exist.
- **Paths:** Always use `@/` alias for root-relative imports.

---

## 8. Security Requirements

1. **Zero Secret Leaks:** No API keys, database credentials, or service role secrets may ever be written into frontend code or client-side bundles.
2. **Environment Variable Segregation:**
   - Private keys: `GEMINI_API_KEY`, `OPENAQ_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY` must remain strictly server-side.
   - Public keys: Only prefixed with `NEXT_PUBLIC_` if explicitly required for public client reads.
3. **Input Sanitization:** User messages in Copilot and inputs in the Household and Planner forms must be validated using Zod before submission to backend routes.

---

## 9. Data-Integrity Requirements

- **Never Fabricate Live Sensor Data:** Do not manufacture random numbers and claim they are official government readings.
- **Demonstration Data Isolation:** During Stage 1, all illustrative values are strictly isolated in `lib/demo-data.ts` and accompanied by a visible `DemonstrationNoticeBanner` ("Illustrative Data Mode").
- **Future Data Standard:** Every observation must capture: `value`, `unit`, `pollutant`, `dataSource`, `timestamp`, `isForecast`, and `status`.

---

## 10. Testing Strategy

- **Static Analysis:** `npm run lint` (ESLint) and `npm run type-check` (`tsc --noEmit`).
- **Production Compilation:** `npm run build` must succeed without warnings or errors.
- **Responsive Verification:** Verified across mobile (<768px), tablet (768px-1024px), and desktop (1024px+).

---

## 11. Current Development Stage: Stage 1 (Complete)

- **Completed Milestones:**
  1. Workspace inspection & Stitch design asset integration.
  2. Next.js 15 TypeScript strict foundation with Tailwind CSS and custom theme tokens.
  3. Domain models and types defined (`types/`).
  4. Illustrative telemetry dataset isolated in `lib/demo-data.ts`.
  5. Application shell with desktop sidebar, header, location picker, and mobile nav.
  6. Landing page (`/`), Dashboard (`/dashboard`), Copilot (`/copilot`), Planner (`/planner`), Household (`/household`), Indoor (`/indoor`), Impact (`/impact`), Settings (`/settings`).
  7. Architectural documentation in `AGENTS.md` and `docs/`.

---

## 12. Known Limitations (Stage 1)

- Live API integration with CPCB / OpenAQ v3 is not yet connected (reserved for Stage 2).
- Gemini API live generative reasoning is simulated on the client (reserved for Stage 3).
- Supabase PostgreSQL persistence is pending authentication setup (reserved for Stage 4).

---

## 13. Pending Work (Next Stages)

- **Stage 2:** Environmental API Integration (OpenAQ API v3 client, Open-Meteo Air Quality reanalysis, CPCB station mapping, caching & fallback service).
- **Stage 3:** Gemini AI Reasoning Engine (Household-grounded prompts, structured output generation, pediatric & geriatric safeguards).
- **Stage 4:** Supabase Database & Auth (User profiles, saved household configs, historical exposure logs).
- **Stage 5:** End-to-End Testing & Production Deployment on Vercel.

---

## 14. Rules for Future Coding Agents

1. **Follow this AGENTS.md strictly.** Do not deviate from the approved directory structure or color palette.
2. **Preserve Stitch Conformance:** Always reference `stitch_aeris_environmental_intelligence_platform` for visual fidelity.
3. **Do not remove the Demonstration Notice** until actual live APIs are verified and certified in Stage 2.
4. **Never commit `.env.local`** or raw credentials.
5. **Always verify builds** before marking tasks complete (`npm run type-check && npm run build`).

