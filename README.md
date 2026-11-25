# AERIS-AI — "Breathe Smarter. Live Better."

[![Next.js 15](https://img.shields.io/badge/Next.js-15.0.3-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript Strict](https://img.shields.io/badge/TypeScript-5.6_Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Tests Passing](https://img.shields.io/badge/Tests-Stage_2_Verified-success?style=for-the-badge)](https://github.com/ASingha165/AERIS-AI)

> **Competition:** Hack2Skill PromptWars Virtual — Challenge 6: Urban Air Quality Assistant  
> **Repository:** https://github.com/ASingha165/AERIS-AI  
> **Target Deadline:** November 29, 2026

## Product

AERIS-AI is an environmental decision-support platform combining outdoor air-quality observations, modeled forecasts, household context, activity planning, indoor-air guidance, and AI-assisted explanations.

## Stage 2 — Environmental data layer

- OpenAQ API v3 for station observations, with server-side `OPENAQ_API_KEY`.
- Open-Meteo Air Quality API for CAMS Global modeled forecasts.
- Separate provenance for station observations and atmospheric model estimates.
- CPCB-methodology sub-index calculations and explicit insufficient-data states.
- Location search, freshness metadata, and API-level validation.

## Stage 3 — Gemini Copilot (merged; runtime verification pending)

- Server-side Gemini 3.5 Flash-Lite integration through the Google Generative Language REST API.
- `POST /api/copilot` validates message, bounded conversation history, and selected coordinates.
- The server retrieves current AERIS environmental context and injects provider provenance into the model prompt.
- System instructions prohibit invented measurements, false station claims, unsupported CPCB certification, and medical diagnosis or treatment.
- The Copilot UI sends actual requests to the server route instead of generating simulated answers.
- The Gemini credential is server-only: `GEMINI_API_KEY`. It must never use a `NEXT_PUBLIC_` prefix.

**Verification:** GitHub Actions has passed dependency installation, type-check, unit tests, lint, and production build on the feature branch. A real Gemini response still requires a valid server-side `GEMINI_API_KEY`; live API smoke testing and browser QA remain outstanding.

## Setup

Requirements: Node.js 20+ and npm.

```bash
git clone https://github.com/ASingha165/AERIS-AI.git
cd AERIS-AI
npm ci
```

Create `.env.local` from `.env.example` and set server-side credentials:

```env
OPENAQ_API_KEY=your_openaq_api_key
GEMINI_API_KEY=your_gemini_api_key
```

Run locally:

```bash
npm run dev
```

Open http://localhost:3000.

## Quality checks

```bash
npm run type-check
npm test
npm run lint
npm run build
```

## Product modules

- `/` — product landing page.
- `/dashboard` — environmental intelligence dashboard.
- `/copilot` — Gemini-powered environmental assistant.
- `/planner` — daily activity planning.
- `/household` — household context prototype.
- `/indoor` — indoor-air guidance prototype.
- `/impact` — sustainable mobility prototype.
- `/settings` — settings prototype.

## Safety and data integrity

AERIS provides environmental information, not clinical diagnosis or treatment. The model receives only the environmental context retrieved for the selected location; no household medical profile is assumed or transmitted. Station readings and CAMS modeled estimates remain distinct. A CPCB-methodology calculation is not a CPCB-issued certification. Missing, stale, or insufficient data must be disclosed.

## Roadmap

- [x] Stage 1 — engineering foundation and Stitch-based UI.
- [x] Stage 2 — OpenAQ, Open-Meteo, CPCB-methodology engine.
- [x] Stage 2.1 — data-integrity hardening merged into `main`; regression checks pass.
- [ ] Stage 3 — Gemini Copilot merged into `main`; CI passes. Live Gemini API smoke test and browser QA remain.
- [ ] Stage 4 — Supabase persistence and authentication.
- [ ] Stage 5 — end-to-end QA and production deployment.
