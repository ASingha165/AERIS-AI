# AERIS-AI Implementation Roadmap

## Stage Overview

| Stage | Focus Area | Status | Target Delivery |
|---|---|---|---|
| **Stage 1** | **Engineering Foundation & Frontend Implementation** | **Completed** | **November 2026** |
| **Stage 2** | Environmental API Integration & Station Ingestion | **Completed** | November 2026 |
| **Stage 3** | Google Gemini API AI Copilot Integration | **Merged; live API verification pending** | November 2026 |
| **Stage 4** | Supabase Database & User Personalization | **Foundation in review** | November 2026 |
| **Stage 5** | End-to-End Verification & Production Vercel Deploy | Pending | November 2026 |

---

## Stage 1: Engineering Foundation & Frontend Implementation (Done)
- [x] Workspace inspection and Google Stitch design integration.
- [x] Next.js 15 App Router setup with strict TypeScript and Tailwind CSS.
- [x] Stitch atmospheric design token integration (`#080F1C`, `#101C2B`, `#142235`, `#37E6B5`, `#53C7F5`).
- [x] Complete domain types in `types/`.
- [x] Demonstration telemetry datasets in `lib/demo-data.ts`.
- [x] App shell (Sidebar, Header, Mobile Nav, DashboardLayout).
- [x] Public Landing Page (`/`).
- [x] Environmental Intelligence Dashboard (`/dashboard`).
- [x] Conversational AI Copilot (`/copilot`).
- [x] Pollution-aware Daily Planner (`/planner`).
- [x] Household Personalization (`/household`).
- [x] Indoor Air Guardian (`/indoor`).
- [x] Sustainable Impact Explorer (`/impact`).
- [x] Application Settings (`/settings`).
- [x] Comprehensive documentation (`AGENTS.md` & `docs/`).

---

## Stage 2: Environmental API Integration (Complete)
- [x] Integrate OpenAQ API v3 station observations with radius-based discovery and graceful fallback.
- [x] Integrate Open-Meteo Air Quality API with CAMS Global modeled forecasts.
- [x] Create `/api/air-quality` with validated query parameters and cache headers.
- [x] Preserve explicit unavailable/forecast-only states when station observations are unavailable.

---

## Stage 3: Google Gemini API Copilot Integration (Merged; runtime verification pending)
- [x] Implement `/api/copilot` using the Gemini Generative Language REST API and Gemini 3.5 Flash-Lite.
- [x] Ground responses in current environmental context and preserve measured-station versus modeled-forecast provenance.
- [x] Add Zod request validation and environmental/medical safety instructions.
- [ ] Complete live Gemini API-key smoke testing and browser QA.

---

## Stage 4: Supabase PostgreSQL & Auth (Foundation in review)
- [x] Initial migration for profiles, households, saved locations, preferences, and saved schedules.
- [x] Row Level Security policies and owner-scoped foreign keys.
- [x] Browser-local settings persistence with Zod validation.
- [ ] Create/configure a Supabase project and apply the migration.
- [ ] Implement Supabase Auth and secure session handling.
- [ ] Add server/client Supabase data access and sync non-sensitive user preferences.
- [ ] Run cross-user RLS isolation tests.
- [ ] Design explicit consent, retention, and deletion controls before storing sensitive family-member health details.

---

## Stage 5: Verification & Production Deployment
- [ ] Full automated test suite (Jest / Playwright).
- [ ] Accessibility audit (WCAG 2.1 AA).
- [ ] Production deployment to Vercel with custom domain.

