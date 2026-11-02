import { describe, expect, it } from 'vitest';

import { localizeCreditDescription } from './credit-description';

describe('localizeCreditDescription', () => {
  it('maps the generation description written by /api/ai/generate', () => {
    expect(localizeCreditDescription('AI video generation (minimax-h3)')).toBe(
      'AI video generation (minimax-h3)'
    );
    expect(localizeCreditDescription('AI music generation (suno-v5)')).toBe(
      'AI music generation (suno-v5)'
    );
  });

  it('maps system grant descriptions', () => {
    expect(localizeCreditDescription('Grant credit (admin)')).toBe(
      'Credits granted by admin'
    );
    expect(localizeCreditDescription('Subscription Renewal')).toBe(
      'Subscription renewal'
    );
  });

  it('passes unknown or empty descriptions through', () => {
    expect(localizeCreditDescription('Custom bonus')).toBe('Custom bonus');
    expect(localizeCreditDescription(null)).toBe('');
  });
});
