# Stage 3 — Gemini Copilot implementation

**Branch:** `feat/stage-3-gemini-reasoning`  
**Provider:** Google Gemini 2.5 Flash via Generative Language REST API.

## Request flow

1. The Copilot client submits the user's message, a bounded recent conversation history, and the selected location coordinates to `POST /api/copilot`.
2. The route validates the payload with Zod and rejects malformed or oversized requests.
3. The server retrieves the selected location's environmental context through the existing Stage 2 `AirQualityService`.
4. The route builds a compact grounding context with AQI status, freshness, station/model provenance, pollutant observations, and forecast samples.
5. The route calls Gemini 2.5 Flash using server-side `GEMINI_API_KEY`.
6. The response returns answer text and source metadata. The client renders it as an assistant message.

## Guardrails

- Station measurements and modeled forecasts must never be conflated.
- No unsupported values, station IDs, sensor counts, confidence percentages, or exposure-reduction statistics may be invented.
- An insufficient-data CPCB-methodology result must not be described as an official certified AQI.
- The Copilot provides environmental information, not clinical diagnosis or treatment.
- No household medical profile is assumed or sent to Gemini in this implementation.
- API credentials remain server-side.

## Verification status

Implementation is present on the feature branch. A live model response requires a valid Gemini API key in the deployment/local server environment. CI and production build results must be checked before merging.
