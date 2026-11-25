import type { AirQualityResponse, ObservationMetric } from '@/types/air-quality';

function formatObservation(item: ObservationMetric): string {
  return `- ${item.pollutant}: ${item.value} ${item.unit}; provider=${item.provider}; timestamp=${item.timestamp}; freshness=${item.freshness}`;
}

/**
 * Build an explicitly separated grounding payload so measured station readings
 * can never be presented under a heading that also contains modeled values.
 */
export function buildGroundingContext(data: AirQualityResponse): string {
  const observations = Object.values(data.observations).filter(
    (item): item is ObservationMetric => item !== undefined,
  );
  const measured = observations.filter((item) => item.observationType === 'MEASURED_STATION');
  const modeled = observations.filter((item) => item.observationType === 'MODELED_FORECAST');
  const forecast = data.forecast.slice(0, 8).map((point) =>
    `- ${point.time}: PM2.5=${point.pm25 ?? 'unavailable'} µg/m³; PM10=${point.pm10 ?? 'unavailable'} µg/m³; NO2=${point.no2 ?? 'unavailable'} µg/m³; modeled forecast only`,
  );

  return [
    `Selected location: ${data.location.name} (${data.location.latitude}, ${data.location.longitude})`,
    `Overall data status: ${data.status}; freshness: ${data.freshness}`,
    `CPCB-methodology AQI: ${data.aqi.value ?? 'unavailable'}; category: ${data.aqi.category ?? 'unavailable'}; status: ${data.aqi.status}; reason: ${data.aqi.statusReason}`,
    'Physical ground-station observations (MEASURED_STATION only):',
    measured.length ? measured.map(formatObservation).join('\\n') : 'No eligible physical OpenAQ station observations are currently available.',
    'Modeled current-hour estimates (MODELED_FORECAST only; not station measurements):',
    modeled.length ? modeled.map(formatObservation).join('\\n') : 'No modeled current-hour pollutant estimates are available.',
    'Hourly CAMS/Open-Meteo forecast (modeled only):',
    forecast.length ? forecast.join('\\n') : 'No forecast points are available.',
    'Data sources: ' + (data.sources.map((source) => `${source.provider}: ${source.datasetName} (${source.modelResolution ?? 'station data'})`).join('; ') || 'No source successfully returned data.'),
  ].join('\\n');
}
