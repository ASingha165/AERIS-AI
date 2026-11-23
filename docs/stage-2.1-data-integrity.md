# Stage 2.1 — Data Integrity Hardening

**Date:** 2026-11-23  
**Base:** `0903c1891a96a3ee480ce64a70808985fac500e6`  
**Branch:** `fix/stage-2-data-integrity`

## Findings from the Stage 2 source audit

1. OpenAQ location discovery did not request or post-filter reference monitors and stationary locations, and it selected the first API result rather than the nearest eligible monitor.
2. The OpenAQ request timeout was cleared after location discovery, leaving the subsequent latest-measurements request without the same timeout.
3. The Open-Meteo provider described CAMS Global but left `domains` at the API default (`auto`), which can combine domains. AERIS now pins `cams_global` for consistent model provenance.
4. Freshness classification allowed timestamps more than one hour in the future to fall through to the `LIVE` threshold.
5. The in-memory response cache rounded coordinates to two decimal places, allowing distinct nearby neighborhoods to collide.
6. The API accepted station radii above OpenAQ v3's documented 25 km maximum.
7. The CPCB result wording could be read as an official CPCB certification. AERIS can calculate using CPCB methodology, but it is not a CPCB-issued certification.

## Changes in this branch

- Filter OpenAQ discovery to `monitor=true` and `mobile=false`, validate station coordinates, and sort by reported distance.
- Keep one abort timeout active across both OpenAQ network requests; reject missing timestamps rather than substituting a fabricated current timestamp.
- Pin Open-Meteo requests to `domains=cams_global` and disclose the documented ~45 km / 3-hourly global grid.
- Treat timestamps more than one hour ahead of server time as unavailable; retain tolerance for minor clock skew.
- Increase cache-key coordinate precision to four decimal places.
- Restrict the station radius to the OpenAQ v3 25 km maximum.
- Clarify that CPCB-methodology output is not a CPCB-issued certification.
- Add regression tests for future timestamps and a GitHub Actions workflow for type checks, tests, lint, and production build.

## Known limitation retained intentionally

OpenAQ's `/locations/{id}/latest` endpoint supplies latest sensor values, not a validated statutory averaging history. The service continues to mark overall NAQI as `INSUFFICIENT_DATA` for instantaneous snapshots. Do not change this to `CALCULATED` until a complete pollutant-specific averaging window is actually ingested and validated.
