import { z } from 'zod';

export const CopilotRequestSchema = z.object({
  message: z.string().trim().min(2).max(2000),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().min(1).max(4000),
  })).max(12).default([]),
  location: z.object({
    name: z.string().trim().min(1).max(120),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
});
