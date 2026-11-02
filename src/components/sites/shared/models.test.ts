import { describe, expect, it } from 'vitest';

import {
  AI_MODELS,
  calculateCredits,
  getModelSupportedResolutions,
} from './models';

describe('KIE MiniMax H3 resolution', () => {
  it('offers only the tiers KIE accepts (768P / 2K)', () => {
    expect(getModelSupportedResolutions('minimax-h3', 'kie')).toEqual([
      '768P',
      '2K',
    ]);
  });

  it('offers the same tiers the server validates against', () => {
    expect(getModelSupportedResolutions('minimax-h3', 'kie')).toEqual(
      AI_MODELS['minimax-h3'].supportedResolutions
    );
  });

  it('bills 2K above the 768P base tier', () => {
    expect(
      calculateCredits('minimax-h3', 'video', {
        resolution: '768P',
        duration: '5s',
      })
    ).toBe(30);
    expect(
      calculateCredits('minimax-h3', 'video', {
        resolution: '2K',
        duration: '5s',
      })
    ).toBe(51);
  });
});
