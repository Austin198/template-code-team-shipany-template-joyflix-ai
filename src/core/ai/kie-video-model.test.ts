import { describe, expect, it } from 'vitest';

import {
  KIE_SEEDANCE_LITE_IMAGE_MODEL,
  KIE_SEEDANCE_LITE_TEXT_MODEL,
  normalizeKieVideoModel,
} from './kie';

describe('Kie Seedance 1.0 Lite model ids', () => {
  it('maps text-to-video to the Lite market id', () => {
    expect(KIE_SEEDANCE_LITE_TEXT_MODEL).toBe(
      'bytedance/v1-lite-text-to-video'
    );
    expect(normalizeKieVideoModel('seedance-1-0-lite', false)).toBe(
      'bytedance/v1-lite-text-to-video'
    );
  });

  it('maps image-to-video to the Lite image market id', () => {
    expect(KIE_SEEDANCE_LITE_IMAGE_MODEL).toBe(
      'bytedance/v1-lite-image-to-video'
    );
    expect(normalizeKieVideoModel('seedance-1-0-lite', true)).toBe(
      'bytedance/v1-lite-image-to-video'
    );
  });
});
