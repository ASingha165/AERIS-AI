# Challenge 6 Requirements Specification

## Challenge Title
**Challenge 6 — Urban Air Quality Assistant**  
**Competition:** Hack2Skill PromptWars Virtual  
**Target Deadline:** November 29, 2026

## Core Challenge Objectives & AERIS-AI Implementation Matrix

| Requirement | Challenge Directive | AERIS-AI Implementation | Verification Route | Status |
|---|---|---|---|---|
| **R1: Air Quality Telemetry** | Present actionable air quality indices for urban centers | Dual-source live telemetry via OpenAQ API v3 (ground stations) and Open-Meteo (CAMS ~40km model) with Indian CPCB NAQI calculation engine. | `/dashboard`, `/api/air-quality` | **Verified (Stage 2)** |
| **R2: Conversational Assistant** | AI conversational reasoning for everyday environmental decisions | GenAI Copilot answering nuanced queries on pediatric exposure, sports timing, and masks. | `/copilot` | Pending Stage 3 (Gemini Engine) |
| **R3: Daily Routine Scheduling** | Identify safer windows for outdoor activities | Diurnal planner comparing boundary layer inversion vs midday solar convection windows. | `/planner` | Layout verified, awaiting live link |
| **R4: Household Personalization** | Tailor advice based on vulnerable family members | Vulnerability index scoring for pediatric asthma, geriatric cardiovascular history, and floor level. | `/household` | Layout verified, awaiting DB |
| **R5: Indoor Air Quality** | Practical guidance for home micro-climates | Room-by-room interventions, window sealing rules, and low-cost DIY Corsi-Rosenthal box fan filtration. | `/indoor` | Complete |
| **R6: Sustainable Action** | Incentivize eco-friendly choices | Multi-modal transit emission comparison (Metro vs Car) with cumulative avoided CO2 & PM tracking. | `/impact` | Complete |

## Non-Negotiable Standards
1. **Zero Hallucination Standard:** Never invent synthetic indoor AQI values without hardware probes.
2. **Medical Advisory Protocol:** Clearly delineate between environmental exposure mitigation guidance and clinical medical treatment.
3. **Data Integrity Standard:** Explicitly differentiate observed ground sensor telemetry from numerical atmospheric model forecasts.
4. **CPCB NAQI Standard:** Enforce strict statutory averaging (24-hr for PM/NO2/SO2; 8-hr for CO/O3), minimum 3 qualifying pollutants, and mandatory particulate matter indicator before certifying official AQI.
