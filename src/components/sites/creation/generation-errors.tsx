'use client';

import React from 'react';

import { sanitizeUserErrorMessage } from '@/core/ai/types';
import { Link } from '@/core/i18n/navigation';
import { m } from '@/paraglide/messages.js';

export function formatLocalizedErrorMessage(errMsg?: string): React.ReactNode {
  if (!errMsg) return m['stp.common.generation_failed']();
  const errorCodeMap: Record<string, string> = {
    copyright_restricted: 'stp.common.copyright_restricted',
    content_safety_rejected: 'stp.common.content_safety_rejected',
    reference_media_duration_invalid:
      'stp.multimodal.reference_media_duration_invalid',
    too_many_images: 'stp.common.too_many_images',
    too_many_videos: 'stp.common.too_many_videos',
    too_many_audios: 'stp.common.too_many_audios',
    prompt_too_long: 'stp.common.prompt_too_long',
    service_busy: 'stp.common.service_busy',
    reference_media_invalid: 'stp.common.reference_media_invalid',
    task_canceled: 'stp.common.task_canceled',
    generation_failed: 'stp.common.generation_failed',
  };
  if (errorCodeMap[errMsg]) {
    return ((m as any)[errorCodeMap[errMsg]] as () => React.ReactNode)();
  }
  const creditMatch = errMsg.match(
    /insufficient\s+credits\s*\(requires\s*(\d+)[^,]*,\s*current\s*balance:?\s*(\d+)\)/i
  );
  if (creditMatch)
    return (
      <span>
        {m['stp.common.insufficient_credits_prefix']({
          cost: creditMatch[1],
          balance: creditMatch[2],
        })}
        <Link
          href="/pricing"
          className="font-medium underline transition-opacity hover:opacity-80"
        >
          {m['stp.common.purchase_credits_action']()}
        </Link>
        {m['stp.common.insufficient_credits_suffix']()}
      </span>
    );
  if (/insufficient\s+credits/i.test(errMsg))
    return (
      <span>
        {m['stp.common.insufficient_credits_simple_prefix']()}
        <Link
          href="/pricing"
          className="font-medium underline transition-opacity hover:opacity-80"
        >
          {m['stp.common.purchase_credits_action']()}
        </Link>
        {m['stp.common.insufficient_credits_suffix']()}
      </span>
    );
  const map: Array<[RegExp, string]> = [
    [/copyright|copyright restrictions/i, 'stp.common.copyright_restricted'],
    [
      /content safety|sensitive content|flagged as sensitive|policy\s*violation|moderation|safety system|content policy/i,
      'stp.common.content_safety_rejected',
    ],
    [/too\s+many\s+input\s+images/i, 'stp.common.too_many_images'],
    [/prompt\s+is\s+too\s+long/i, 'stp.common.prompt_too_long'],
    [/too\s+many\s+input\s+videos/i, 'stp.common.too_many_videos'],
    [/too\s+many\s+input\s+audio/i, 'stp.common.too_many_audios'],
    [
      /duration\s+must\s+be\s+between|total\s+duration.*(?:exceed|maximum)/i,
      'stp.multimodal.reference_media_duration_invalid',
    ],
    [
      /minimax\s+h3\s+requires.*reference\s+audio/i,
      'stp.reference_to_video.minimax_audio_requires_media',
    ],
    [
      /does\s+not\s+support\s+image\s+input|image\s+input\s+not\s+supported/i,
      'stp.common.model_no_image_support',
    ],
    [/no\s+ai\s+provider\s+configured/i, 'stp.common.no_ai_provider'],
    [/failed\s+to\s+deduct\s+credits/i, 'stp.common.failed_deduct_credits'],
    [/active\s+generation\s+tasks/i, 'stp.common.too_many_active_tasks'],
    [
      /unsupported\s+model|model\s+is\s+required/i,
      'stp.common.unsupported_model',
    ],
    [
      /reference.*image.*required|first.*frame/i,
      'stp.common.first_frame_required',
    ],
  ];
  for (const [pattern, key] of map) {
    if (pattern.test(errMsg)) {
      return ((m as any)[key] as () => React.ReactNode)();
    }
  }
  if (
    /ECONNREFUSED|ETIMEDOUT|fetch\s+failed|temporarily\s+busy|please\s+wait|try\s+again|rate\s*limit|too\s+many\s+requests|queue\s+is\s+full|service\s+unavailable|overloaded/i.test(
      errMsg
    )
  )
    return m['stp.common.service_busy']();
  if (
    /prompt.*(?:required|provide|empty|missing)|enter\s+prompt|sound_prompt|lyrics/i.test(
      errMsg
    )
  )
    return m['stp.common.alert_enter_text_prompt']();
  const cleaned = sanitizeUserErrorMessage(errMsg);
  if (
    !cleaned ||
    /failed|error|unavailable|busy|timeout|please\s+wait|parameter|required|invalid|unsupported/i.test(
      cleaned
    ) ||
    /^[A-Za-z0-9\s.,'"`!?:;_\-()]+$/.test(cleaned)
  )
    return m['stp.common.service_busy']();
  return cleaned;
}
