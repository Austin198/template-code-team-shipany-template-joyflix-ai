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

  it('bills 2K as the higher resolution unit', () => {
    expect(
      calculateCredits('minimax-h3', 'video', {
        resolution: '768P',
        duration: '5s',
      })
    ).toBe(1);
    expect(
      calculateCredits('minimax-h3', 'video', {
        resolution: '2K',
        duration: '5s',
      })
    ).toBe(2);
  });
});

describe('Seedance 1.0 Lite resolutions', () => {
  it('does not offer 480P on the default model', () => {
    expect(AI_MODELS['seedance-1-0-lite'].supportedResolutions).toEqual([
      '720P',
      '1080P',
    ]);
    expect(getModelSupportedResolutions('seedance-1-0-lite', 'kie')).toEqual([
      '720P',
      '1080P',
    ]);
    expect(getModelSupportedResolutions('seedance-1-0-lite')).toEqual([
      '720P',
      '1080P',
    ]);
  });

  it('still counts a 480P string as the existing non-1080P unit', () => {
    expect(
      calculateCredits('seedance-1-0-lite', 'video', {
        duration: '5s',
        resolution: '480P',
      })
    ).toBe(1);
    expect(
      calculateCredits('seedance-1-0-lite', 'video', {
        duration: '10s',
        resolution: '1080P',
      })
    ).toBe(4);
  });
});

describe('video generation units', () => {
  it('charges 5s 720P as 1, and stacks duration with 1080P', () => {
    expect(
      calculateCredits('seedance-1-0-lite', 'video', {
        duration: '5s',
        resolution: '720P',
      })
    ).toBe(1);
    expect(
      calculateCredits('seedance-1-0-lite', 'video', {
        duration: '10s',
        resolution: '720P',
      })
    ).toBe(2);
    expect(
      calculateCredits('seedance-1-0-lite', 'video', {
        duration: '5s',
        resolution: '1080P',
      })
    ).toBe(2);
    expect(
      calculateCredits('seedance-1-0-lite', 'video', {
        duration: '10s',
        resolution: '1080P',
        hasImageInput: true,
      })
    ).toBe(4);
    expect(
      calculateCredits('seedance-2-5', 'video', {
        duration: '10s',
        resolution: '1080P',
        hasImageInput: true,
      })
    ).toBe(4);
  });
});
