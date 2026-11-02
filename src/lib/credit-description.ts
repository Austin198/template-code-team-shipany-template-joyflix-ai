import { m } from '@/paraglide/messages.js';

/**
 * Credit ledger descriptions are stored in English by the server (they are
 * data, not copy). Map the known system-generated ones to the active locale
 * for display; admin-entered or unknown descriptions pass through unchanged.
 */
export function localizeCreditDescription(description: unknown): string {
  const text = description == null ? '' : String(description).trim();
  if (!text) return '';

  switch (text) {
    case 'Grant credit':
      return m['common.credit_desc.grant']();
    case 'Grant credit (admin)':
      return m['common.credit_desc.grant_admin']();
    case 'Subscription Created':
      return m['common.credit_desc.subscription_created']();
    case 'Subscription Renewal':
      return m['common.credit_desc.subscription_renewal']();
  }

  // Written by /api/ai/generate as `AI ${mediaType} generation (${model})`.
  const generation = text.match(/^AI (image|video|music) generation \((.+)\)$/);
  if (generation) {
    const model = generation[2];
    if (generation[1] === 'image')
      return m['common.credit_desc.ai_image']({ model });
    if (generation[1] === 'video')
      return m['common.credit_desc.ai_video']({ model });
    return m['common.credit_desc.ai_music']({ model });
  }

  return text;
}
