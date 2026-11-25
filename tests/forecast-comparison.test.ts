import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import type { HourlyForecastPoint } from '@/types/air-quality';
import { compareForecastHours, lowestComparableHour } from '@/lib/air-quality/calculations/forecast-comparison';

function point(time: string, pm25: number | null): HourlyForecastPoint {
  return {time, hour:Number(time.slice(11,13)), pm25, pm10:null, no2:null, o3:null, so2:null, co:null};
}
describe('forecast comparison: source integrity', () => {
  test('selects only the requested local day, never fabricating an AQI', () => {
    const rows=[
      point('2026-11-25T06:00',44),
      point('2026-11-25T09:00',22),
      point('2026-11-25T12:00',36),
      point('2026-11-26T08:00',1),
    ];
    assert.deepEqual(lowestComparableHour(rows,'2026-11-25'),{time:'2026-11-25T09:00',hour:9,pm25:22});
    assert.equal(Object.keys(lowestComparableHour(rows,'2026-11-25') ?? {}).includes('aqi'),false);
  });
  test('removes missing, negative, non-finite, and outside-daytime values', () => {
    const rows=[point('2026-11-25T03:00',2),point('2026-11-25T06:00',null),point('2026-11-25T07:00',-1),point('2026-11-25T08:00',Infinity),point('2026-11-25T10:00',15)];
    assert.equal(compareForecastHours(rows,'2026-11-25').length,1);
  });
  test('reports no preferred hour for incomplete/empty forecasts', () => {
    assert.equal(lowestComparableHour([], '2026-11-25'),null);
    assert.equal(lowestComparableHour([point('2026-11-25T10:00',10)], '2026-11-25'),null);
  });
  test('uses chronological order for equal concentrations', () => {
    const rows=[point('2026-11-25T10:00',20),point('2026-11-25T08:00',20),point('2026-11-25T11:00',30)];
    assert.equal(lowestComparableHour(rows,'2026-11-25')?.hour,8);
  });
});
