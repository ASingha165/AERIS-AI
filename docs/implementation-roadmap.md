# AERIS-AI Implementation Roadmap

## Stage Overview

| Stage | Focus Area | Status | Target Delivery |
|---|---|---|---|
| **Stage 1** | **Engineering Foundation & Frontend Implementation** | **Completed** | **November 2026** |
| **Stage 2** | Environmental API Integration & Station Ingestion | Pending | November 2026 |
| **Stage 3** | Google Gemini API AI Copilot Integration | Pending | November 2026 |
| **Stage 4** | Supabase Database & User Personalization | Pending | November 2026 |
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

## Stage 2: Environmental API Integration (Next Step)
- [ ] Connect OpenAQ API v3 client with regional bounding box for Kolkata and Mumbai.
- [ ] Implement Open-Meteo Air Quality client for boundary layer height and hourly forecasts.
- [ ] Create Next.js API route `/api/telemetry` with 15-minute SWR caching.
- [ ] Implement fallback to historical benchmarks during station downtime.

---

## Stage 3: Google Gemini API Copilot Integration
- [ ] Implement Next.js API route `/api/copilot` using `@google/genai` SDK.
- [ ] System prompt injection with CPCB NAQI guidelines, WHO targets, and household profile context.
- [ ] Structured JSON output for strategic recommendations and projected inhalation curves.

---

## Stage 4: Supabase PostgreSQL & Auth
- [ ] Setup Supabase client for Next.js.
- [ ] PostgreSQL schema for `households`, `family_members`, and `saved_schedules`.
- [ ] Row Level Security (RLS) policies.

---

## Stage 5: Verification & Production Deployment
- [ ] Full automated test suite (Jest / Playwright).
- [ ] Accessibility audit (WCAG 2.1 AA).
- [ ] Production deployment to Vercel with custom domain.

