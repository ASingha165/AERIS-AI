import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { CopilotRequestSchema } from '@/lib/copilot/schema';

describe('CopilotRequestSchema', () => {
  const valid = {
    message: 'Is it a good time to go for a walk?',
    history: [{ role: 'user' as const, content: 'Hello' }],
    location: { name: 'Kolkata', latitude: 22.5726, longitude: 88.3639 },
  };

  test('accepts a valid request', () => {
    assert.equal(CopilotRequestSchema.safeParse(valid).success, true);
  });

  test('rejects invalid coordinates', () => {
    const result = CopilotRequestSchema.safeParse({
      ...valid,
      location: { ...valid.location, latitude: 120 },
    });
    assert.equal(result.success, false);
  });

  test('rejects oversized messages and history', () => {
    assert.equal(CopilotRequestSchema.safeParse({ ...valid, message: 'x'.repeat(2001) }).success, false);
    assert.equal(CopilotRequestSchema.safeParse({ ...valid, history: Array.from({ length: 13 }, () => ({ role: 'user', content: 'x' })) }).success, false);
  });

  test('defaults conversation history to an empty list', () => {
    const result = CopilotRequestSchema.safeParse({ message: valid.message, location: valid.location });
    assert.equal(result.success, true);
    if (result.success) assert.deepEqual(result.data.history, []);
  });
});
