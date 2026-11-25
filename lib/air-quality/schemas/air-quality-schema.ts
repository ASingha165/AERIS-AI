import { z } from 'zod';

export const CoordinatesQuerySchema = z.object({
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  radius: z.coerce.number().min(1000).max(25000).optional().default(25000), // OpenAQ v3 maximum radius is 25 km
});

export const AirQualityQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lon: z.coerce.number().min(-180).max(180),
  radius: z.coerce.number().min(1000).max(25000).optional().default(25000),
});

export const LocationSearchQuerySchema = z.object({
  q: z.string().trim().min(1).max(100),
});

export const LocationQuerySchema = LocationSearchQuerySchema;

export const OpenMeteoAirQualityResponseSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  generationtime_ms: z.number().optional(),
  utc_offset_seconds: z.number().optional(),
  timezone: z.string().optional(),
  timezone_abbreviation: z.string().optional(),
  hourly_units: z.record(z.string(), z.string()).optional(),
  hourly: z.object({
    time: z.array(z.string()),
    pm2_5: z.array(z.number().nullable()).optional(),
    pm10: z.array(z.number().nullable()).optional(),
    nitrogen_dioxide: z.array(z.number().nullable()).optional(),
    sulphur_dioxide: z.array(z.number().nullable()).optional(),
    ozone: z.array(z.number().nullable()).optional(),
    carbon_monoxide: z.array(z.number().nullable()).optional(),
  }),
});

export type OpenMeteoAirQualityResponse = z.infer<typeof OpenMeteoAirQualityResponseSchema>;
