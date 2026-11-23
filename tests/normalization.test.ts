import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { NormalizationService } from '@/lib/air-quality/services/normalization-service';
import { LocationMetadata } from '@/types/air-quality';
import { OpenAQResult } from '@/lib/air-quality/providers/openaq';
import { OpenMeteoResult } from '@/lib/air-quality/providers/open-meteo';

describe('NormalizationService Synthesis', () => {
  const mockLocation: LocationMetadata = {
    name: 'Kolkata',
    state: 'West Bengal',
    country: 'India',
    latitude: 22.5726,
    longitude: 88.3639,
  };

  test('Correctly prioritizes station telemetry when OpenAQ observations are available', () => {
    const mockOpenAQ: OpenAQResult = {
      available: true,
      attribution: {
        provider: 'OpenAQ',
        datasetName: 'OpenAQ Station Telemetry',
        attributionText: 'Official Ground Station Telemetry',
        url: 'https://openaq.org',
        isStationObservation: true,
      },
      station: {
        id: 'cpcb-victoria',
        name: 'Victoria Memorial, Kolkata',
        provider: 'CPCB',
        distanceKm: 2.1,
        coordinates: { latitude: 22.5448, longitude: 88.3426 },
        lastUpdated: new Date().toISOString(),
        availableSensors: ['PM2.5', 'PM10', 'NO2'],
        status: 'active',
      },
      measurements: {
        'PM2.5': {
          pollutant: 'PM2.5',
          fullName: 'Particulate Matter < 2.5µm',
          value: 125,
          unit: 'µg/m³',
          observationType: 'MEASURED_STATION',
          provider: 'OpenAQ',
          sourceName: 'Victoria Memorial, Kolkata',
          timestamp: new Date().toISOString(),
          freshness: 'LIVE',
          subIndex: 304,
          subIndexCategory: 'Very Poor',
        },
      },
    };

    const mockOpenMeteo: OpenMeteoResult = {
      success: true,
      attribution: {
        provider: 'Open-Meteo',
        datasetName: 'Open-Meteo CAMS Ensemble',
        attributionText: 'Modeled atmospheric dispersion',
        url: 'https://open-meteo.com',
        modelResolution: 'Copernicus Global Atmospheric Model (CAMS ~40km grid)',
        isStationObservation: false,
      },
      hourlyForecast: [],
      currentHourPoint: {
        time: new Date().toISOString(),
        hour: 12,
        isCurrentHour: true,
        pm25: 95, // Lower modeled value
        pm10: 160,
        no2: 45,
        o3: 30,
        so2: 12,
        co: 0.8,
      },
    };

    const response = NormalizationService.synthesize(mockLocation, mockOpenAQ, mockOpenMeteo);

    // PM2.5 must come from the ground station (125), NOT the model forecast (95)
    assert.equal(response.observations['PM2.5']?.observationType, 'MEASURED_STATION');
    assert.equal(response.observations['PM2.5']?.value, 125);
    assert.equal(response.observations['PM2.5']?.provider, 'OpenAQ');

    // PM10 was absent from station, so it supplements from model forecast (160)
    assert.equal(response.observations['PM10']?.observationType, 'MODELED_FORECAST');
    assert.equal(response.observations['PM10']?.value, 160);
    assert.equal(response.observations['PM10']?.provider, 'Open-Meteo');

    // Overall status must be LIVE_OBSERVATION or PARTIAL_OBSERVATION
    assert.ok(response.status === 'LIVE_OBSERVATION' || response.status === 'PARTIAL_OBSERVATION');

    // Provenance must list both sources
    assert.equal(response.sources.length, 2);
    assert.equal(response.sources[0].provider, 'OpenAQ');
    assert.equal(response.sources[1].provider, 'Open-Meteo');
  });

  test('Properly handles FORECAST_ONLY mode when OpenAQ has no active station', () => {
    const mockOpenAQ: OpenAQResult = {
      available: false,
      attribution: {
        provider: 'OpenAQ',
        datasetName: 'OpenAQ Station Telemetry',
        attributionText: 'Official Ground Station Telemetry',
        url: 'https://openaq.org',
        isStationObservation: true,
      },
      station: null,
      measurements: {},
      reason: 'NO_API_KEY',
    };

    const mockOpenMeteo: OpenMeteoResult = {
      success: true,
      attribution: {
        provider: 'Open-Meteo',
        datasetName: 'Open-Meteo CAMS Ensemble',
        attributionText: 'Modeled atmospheric dispersion',
        url: 'https://open-meteo.com',
        modelResolution: 'Copernicus Global Atmospheric Model (CAMS ~40km grid)',
        isStationObservation: false,
      },
      hourlyForecast: [],
      currentHourPoint: {
        time: new Date().toISOString(),
        hour: 14,
        isCurrentHour: true,
        pm25: 78,
        pm10: 130,
        no2: 40,
        o3: 25,
        so2: 10,
        co: 0.6,
      },
    };

    const response = NormalizationService.synthesize(mockLocation, mockOpenAQ, mockOpenMeteo);

    assert.equal(response.status, 'FORECAST_ONLY');
    assert.equal(response.observations['PM2.5']?.observationType, 'MODELED_FORECAST');
    assert.equal(response.observations['PM2.5']?.value, 78);
    // Never falsely claim ground station observation
    assert.equal(response.sources.length, 1);
    assert.equal(response.sources[0].provider, 'Open-Meteo');
    assert.equal(response.sources[0].isStationObservation, false);
  });
});
