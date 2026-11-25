import { NextRequest, NextResponse } from 'next/server';
import { CopilotRequestSchema } from '@/lib/copilot/schema';
import { AirQualityService } from '@/lib/air-quality/services/air-quality-service';
import { buildGroundingContext } from '@/lib/copilot/grounding';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MODEL = 'gemini-3.5-flash-lite';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;


export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'The AERIS reasoning service is not configured. Add GEMINI_API_KEY to the server environment.' }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  const parsed = CopilotRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid Copilot request.', details: parsed.error.flatten() }, { status: 400 });
  }

  const { message, history, location } = parsed.data;

  try {
    const environmentalData = await AirQualityService.getAirQualityData(
      location.latitude,
      location.longitude,
      25000,
      location.name,
    );
    const grounding = buildGroundingContext(environmentalData);

    const contents = [
      ...history.map((item) => ({
        role: item.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: item.content }],
      })),
      {
        role: 'user',
        parts: [{
          text: [
            'CURRENT VERIFIED ENVIRONMENTAL CONTEXT:',
            grounding,
            '',
            'USER QUESTION:',
            message,
          ].join('\n'),
        }],
      },
    ];

    const systemInstruction = [
      'You are AERIS, an environmental decision-support assistant for urban households.',
      'Use only the environmental context supplied in this request for claims about current conditions. Do not invent AQI values, station names, sensor counts, timestamps, weather variables, satellite observations, exposure reductions, or forecast certainty.',
      'Strictly distinguish OpenAQ MEASURED_STATION observations from Open-Meteo CAMS MODELED_FORECAST values. Never describe modeled values as measured station data.',
      'If the CPCB-methodology AQI status is INSUFFICIENT_DATA or UNAVAILABLE, say that an official overall index cannot be established from the supplied data. Individual sub-indices are not an official overall AQI.',
      'Explain that AERIS calculates using CPCB methodology and is not a CPCB-issued certification.',
      'Give practical, proportionate environmental exposure-reduction suggestions. Do not diagnose, prescribe, or advise changing medication. For urgent symptoms, recommend contacting local emergency services or a qualified clinician.',
      'For children, older adults, pregnant people, or people with heart/lung conditions, use cautious language and recommend following their clinician and local public-health guidance.',
      'If context is missing or stale, state the limitation clearly and ask one useful follow-up only if needed.',
      'Answer clearly in plain language. Use concise headings and bullets when useful.',
    ].join(' ');

    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemInstruction }] },
        contents,
        generationConfig: {
          maxOutputTokens: 900,
        },
      }),
      signal: AbortSignal.timeout(20000),
      cache: 'no-store',
    });

    if (!response.ok) {
      const providerError = await response.json().catch(() => null);
      const messageText = providerError?.error?.message || 'Gemini provider request failed.';
      return NextResponse.json({ error: messageText }, { status: response.status === 429 ? 429 : 502 });
    }

    const result = await response.json();
    const answer = result?.candidates?.[0]?.content?.parts
      ?.map((part: { text?: string }) => part.text ?? '')
      .join('\n')
      .trim();

    if (!answer) {
      return NextResponse.json({ error: 'The reasoning service returned an empty response. Please retry.' }, { status: 502 });
    }

    return NextResponse.json({
      answer,
      model: MODEL,
      grounding: {
        location: environmentalData.location.name,
        dataStatus: environmentalData.status,
        freshness: environmentalData.freshness,
        aqiStatus: environmentalData.aqi.status,
        sources: environmentalData.sources.map((source) => ({
          provider: source.provider,
          datasetName: source.datasetName,
          isStationObservation: source.isStationObservation,
          modelResolution: source.modelResolution ?? null,
        })),
      },
      generatedAt: new Date().toISOString(),
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error: unknown) {
    const timedOut = error instanceof Error && error.name === 'TimeoutError';
    return NextResponse.json({
      error: timedOut ? 'The reasoning request timed out. Please retry.' : 'Unable to generate an environmental recommendation right now.',
    }, { status: timedOut ? 504 : 502 });
  }
}
