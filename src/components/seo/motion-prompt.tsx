import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Wand2 } from 'lucide-react';

import { useSession } from '@/core/auth/client';
import { GENERATION_UNIT_COPY } from '@/config/seo-site';
import { QuickAuthModal } from '@/components/sites/creation/QuickAuthModal';
import { DEFAULT_VIDEO_MODEL_ID } from '@/components/sites/shared/models';
import { Button } from '@/components/ui/button';

const DRAFT_KEY = 'joyflix_pending_generation_draft';

/**
 * Compact homepage prompt. The draft shape matches HeroInput so a signed-in
 * return to the studio can replay the same generation request.
 */
export function MotionPrompt() {
  const navigate = useNavigate();
  const { data: session } = useSession();
  const [prompt, setPrompt] = useState('');
  const [showAuth, setShowAuth] = useState(false);
  const [error, setError] = useState('');

  function saveDraft(generationRequested: boolean) {
    const draft = {
      action_intent: 'generate',
      generationRequested,
      prompt: prompt.trim(),
      modelId: DEFAULT_VIDEO_MODEL_ID,
      duration: '5s',
      resolution: '720P',
      aspectRatio: '16:9',
      startImageUrl: '',
      imagePreview: '',
      imageUrls: [] as string[],
      mode: 'text-to-video',
      createdAt: Date.now(),
    };
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }

  function onGenerate() {
    const trimmed = prompt.trim();
    if (!trimmed) {
      setError('Describe the animation before generating.');
      return;
    }
    setError('');
    if (!session?.user) {
      saveDraft(true);
      setShowAuth(true);
      return;
    }
    saveDraft(true);
    navigate({ to: '/ai-video-generator', search: {} });
  }

  return (
    <div id="hero-input" className="w-full">
      <label htmlFor="motion-prompt" className="sr-only">
        Describe the animation
      </label>
      <textarea
        id="motion-prompt"
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        rows={3}
        placeholder="A vertical ad: the price 19, a blue button that says Start, calm motion"
        className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring w-full resize-y rounded-xl border px-3 py-3 text-base leading-relaxed shadow-sm outline-none focus-visible:ring-2"
      />
      {error ? (
        <p className="text-destructive mt-2 text-sm" role="alert">
          {error}
        </p>
      ) : null}
      <Button
        type="button"
        onClick={onGenerate}
        className="mt-3 h-11 w-full px-6 text-sm font-semibold sm:w-auto"
      >
        <Wand2 className="size-4" />
        Generate motion graphics
      </Button>
      <p className="text-muted-foreground mt-3 text-sm leading-6">
        {GENERATION_UNIT_COPY}
      </p>
      <QuickAuthModal
        open={showAuth}
        onOpenChange={setShowAuth}
        onSuccess={() => {
          navigate({ to: '/ai-video-generator', search: {} });
        }}
        callbackUrl="/ai-video-generator"
      />
    </div>
  );
}
