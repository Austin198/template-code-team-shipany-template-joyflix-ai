'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Coins, Loader2, Wand2 } from 'lucide-react';
import { toast } from 'sonner';

import { ensureClientUser, useSession } from '@/core/auth/client';
import {
  isUploadUnauthorized,
  resolveUploadImageErrorMessage,
} from '@/lib/upload-image-error';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';
import { usePublicConfig } from '@/hooks/use-public-config';
import {
  GenerationUploadArea,
  type UploadingItem,
} from '@/components/sites/creation/GenerationUploadArea';
import { QuickAuthModal } from '@/components/sites/creation/QuickAuthModal';
import {
  calculateCredits,
  getModelMaxImages,
  getModelSupportedDurations,
  getModelSupportedResolutions,
  getVideoModelsList,
  supportsModelAspectRatio,
} from '@/components/sites/shared/models';
import { ModelSelect } from '@/components/sites/shared/ModelSelect';
import { Button } from '@/components/ui/button';

import { ParametersSelect } from './ParametersSelect';
import { PreviewVideoData, VideoPreviewDialog } from './VideoPreviewDialog';

export function HeroInput() {
  const navigate = useNavigate();
  const { data: session } = useSession();
  const { data: publicConfig } = usePublicConfig();

  const [mounted, setMounted] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const quickPrompts = [
    m['landing.hero.quick_prompt_1'](),
    m['landing.hero.quick_prompt_2'](),
    m['landing.hero.quick_prompt_3'](),
    m['landing.hero.quick_prompt_4'](),
  ];

  const activeModels = useMemo(() => {
    return getVideoModelsList(publicConfig?.active_ai_provider);
  }, [publicConfig?.active_ai_provider]);

  const [prompt, setPrompt] = useState('');
  const [selectedModelId, setSelectedModelId] =
    useState<string>('seedance-2-5');

  useEffect(() => {
    if (
      activeModels.length > 0 &&
      !activeModels.some((m) => m.id === selectedModelId)
    ) {
      setSelectedModelId(activeModels[0].id);
    }
  }, [activeModels, selectedModelId]);

  // Model-dependent resolutions
  const availableResolutions = useMemo(() => {
    return getModelSupportedResolutions(
      selectedModelId,
      publicConfig?.active_ai_provider
    );
  }, [selectedModelId, publicConfig?.active_ai_provider]);

  const [resolution, setResolution] = useState<string>('720P');

  useEffect(() => {
    if (
      availableResolutions.length > 0 &&
      !availableResolutions.includes(resolution)
    ) {
      setResolution(availableResolutions[0]);
    }
  }, [availableResolutions, resolution]);

  // Model-dependent durations
  const availableDurations = useMemo(() => {
    return getModelSupportedDurations(
      selectedModelId,
      publicConfig?.active_ai_provider,
      resolution
    );
  }, [selectedModelId, publicConfig?.active_ai_provider, resolution]);

  const [duration, setDuration] = useState<string>('5s');

  useEffect(() => {
    if (
      availableDurations.length > 0 &&
      !availableDurations.includes(duration)
    ) {
      setDuration(availableDurations[0]);
    }
  }, [availableDurations, duration]);

  // Aspect ratio
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploadingItems, setUploadingItems] = useState<UploadingItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressText, setProgressText] = useState('');

  // Video preview dialog
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<PreviewVideoData | null>(
    null
  );

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(true);

  const selectedModelConfig = useMemo(() => {
    return activeModels.find((m) => m.id === selectedModelId);
  }, [activeModels, selectedModelId]);

  const isFirstLastFrameMode = Boolean(
    selectedModelConfig?.supportsFirstLastFrame
  );
  const maxImages = getModelMaxImages(selectedModelId, 'video');
  const isUploading = uploadingItems.length > 0;
  const firstFrame = imageUrls[0]?.trim() || '';
  const lastFrame = imageUrls[1]?.trim() || '';

  const restoreDraft = React.useCallback(() => {
    try {
      const raw = sessionStorage.getItem('joyflix_pending_generation_draft');
      if (raw) {
        const draft = JSON.parse(raw);
        if (Date.now() - (draft.createdAt || 0) < 30 * 60 * 1000) {
          if (draft.prompt) setPrompt(draft.prompt);
          if (
            draft.modelId &&
            activeModels.some((m) => m.id === draft.modelId)
          ) {
            setSelectedModelId(draft.modelId);
          }
          if (draft.duration) setDuration(draft.duration);
          if (draft.resolution) setResolution(draft.resolution);
          if (draft.aspectRatio) setAspectRatio(draft.aspectRatio);
          if (draft.imageUrls && Array.isArray(draft.imageUrls)) {
            setImageUrls(draft.imageUrls);
          } else if (draft.startImageUrl || draft.imagePreview) {
            setImageUrls([draft.startImageUrl || draft.imagePreview]);
          }
        }
      }
    } catch {}
  }, [activeModels]);

  useEffect(() => {
    restoreDraft();
  }, [restoreDraft, session?.user]);

  const showAspectRatio = supportsModelAspectRatio(
    selectedModelId,
    publicConfig?.active_ai_provider,
    Boolean(firstFrame)
  );

  const costCredits = calculateCredits(selectedModelId, 'video', {
    duration,
    resolution,
  });

  const handleModelChange = (modelId: string) => {
    const nextResolutions = getModelSupportedResolutions(
      modelId,
      publicConfig?.active_ai_provider
    );
    const nextResolution = nextResolutions[0] || resolution;
    const nextDurations = getModelSupportedDurations(
      modelId,
      publicConfig?.active_ai_provider,
      nextResolution
    );
    setSelectedModelId(modelId);
    setResolution(nextResolution);
    setDuration(nextDurations[0] || duration);

    const newConfig = activeModels.find((m) => m.id === modelId);
    const newMax = getModelMaxImages(modelId, 'video');
    if (!newConfig?.supportsFirstLastFrame && imageUrls.length > 1) {
      setImageUrls((prev) => prev.slice(0, 1));
    } else if (imageUrls.length > newMax) {
      setImageUrls((prev) => prev.slice(0, newMax));
    }
  };

  const handleResolutionChange = (nextResolution: string) => {
    const nextDurations = getModelSupportedDurations(
      selectedModelId,
      publicConfig?.active_ai_provider,
      nextResolution
    );
    setResolution(nextResolution);
    if (nextDurations.length > 0 && !nextDurations.includes(duration)) {
      setDuration(nextDurations[0]);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(Math.max(textarea.scrollHeight, 80), 240)}px`;
  }, [prompt]);

  // External prompt events (from showcases)
  useEffect(() => {
    isMountedRef.current = true;
    const handleSelectPrompt = (e: any) => {
      if (e?.detail) {
        setPrompt(e.detail);
        const heroEl = document.getElementById('hero-input');
        if (heroEl) {
          heroEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        setTimeout(() => textareaRef.current?.focus(), 300);
      }
    };

    window.addEventListener('joyflix_select_prompt', handleSelectPrompt);

    return () => {
      isMountedRef.current = false;
      window.removeEventListener('joyflix_select_prompt', handleSelectPrompt);
    };
  }, []);

  const handleFilesSelected = async (files: File[]) => {
    if (!files.length) return;
    const user = await ensureClientUser(session?.user);
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    const oversizedFiles = files.filter((f) => f.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      toast.error(m['stp.common.image_size_limit_exceeded']());
    }
    const validFiles = files.filter((f) => f.size <= MAX_FILE_SIZE);
    if (!validFiles.length) return;

    const currentTotal = imageUrls.length + uploadingItems.length;
    const availableSlots = Math.max(0, maxImages - currentTotal);
    const filesToProcess = validFiles.slice(0, availableSlots);
    if (filesToProcess.length < validFiles.length) {
      toast.info(m['stp.common.image_limit_reached']({ max: maxImages }));
    }
    if (!filesToProcess.length) return;

    const newUploading: UploadingItem[] = filesToProcess.map((file, i) => ({
      id: `hero-upload-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      localUrl: URL.createObjectURL(file),
      slotIndex: imageUrls.length + i,
    }));

    setUploadingItems((prev) => [...prev, ...newUploading]);

    try {
      const formData = new FormData();
      filesToProcess.forEach((file) => formData.append('files', file));
      const response = await fetch('/api/storage/upload-image', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      const data = await response.json();
      const urls = data?.data?.urls || data?.urls;
      if (!response.ok || data?.code === -1 || !Array.isArray(urls)) {
        if (isUploadUnauthorized(data?.message, response.status)) {
          setShowAuthModal(true);
          return;
        }
        throw new Error(resolveUploadImageErrorMessage(data?.message));
      }
      setImageUrls((prev) => [...prev, ...urls].slice(0, maxImages));
    } catch (error: any) {
      toast.error(
        resolveUploadImageErrorMessage(error.message) ||
          m['stp.common.image_upload_failed']()
      );
    } finally {
      newUploading.forEach((item) => URL.revokeObjectURL(item.localUrl));
      setUploadingItems((prev) =>
        prev.filter((item) => !newUploading.some((next) => next.id === item.id))
      );
    }
  };

  const handleReplaceFile = async (index: number, file: File) => {
    if (!file) return;
    const user = await ensureClientUser(session?.user);
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      toast.error(m['stp.common.image_size_limit_exceeded']());
      return;
    }

    const replaceId = `hero-rep-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const localUrl = URL.createObjectURL(file);
    const item: UploadingItem = { id: replaceId, localUrl, slotIndex: index };

    setUploadingItems((prev) => [...prev, item]);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/storage/upload-image', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      const data = await response.json();
      const uploadedUrl =
        data?.data?.urls?.[0] || data?.urls?.[0] || data?.data?.url;
      if (response.ok && data?.code !== -1 && uploadedUrl) {
        setImageUrls((prev) => {
          const next = [...prev];
          while (next.length <= index) {
            next.push('');
          }
          next[index] = uploadedUrl;
          return next;
        });
      } else if (isUploadUnauthorized(data?.message, response.status)) {
        setShowAuthModal(true);
      } else {
        toast.error(resolveUploadImageErrorMessage(data?.message));
      }
    } catch (error: any) {
      toast.error(
        resolveUploadImageErrorMessage(error?.message) ||
          m['stp.common.image_replace_failed']()
      );
    } finally {
      if (localUrl.startsWith('blob:')) {
        URL.revokeObjectURL(localUrl);
      }
      setUploadingItems((prev) => prev.filter((it) => it.id !== replaceId));
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls((prev) => {
      const next = [...prev];
      if (index < next.length) {
        next[index] = '';
      }
      if (next.every((item) => !item)) {
        return [];
      }
      return next;
    });
  };

  const handleGenerate = async () => {
    const trimmedPrompt = prompt.trim();

    if (!session?.user) {
      try {
        const validImages = imageUrls.filter(Boolean);
        const effectiveMode = firstFrame ? 'image-to-video' : 'text-to-video';

        const draft = {
          generationRequested: Boolean(trimmedPrompt || firstFrame),
          prompt: trimmedPrompt,
          modelId: selectedModelId,
          duration,
          resolution,
          aspectRatio: showAspectRatio && aspectRatio ? aspectRatio : undefined,
          startImageUrl: firstFrame || '',
          imagePreview: firstFrame || '',
          imageUrls: validImages,
          mode: effectiveMode,
          createdAt: Date.now(),
        };

        sessionStorage.setItem(
          'joyflix_pending_generation_draft',
          JSON.stringify(draft)
        );
      } catch (err) {
        console.warn('Failed to save generation draft:', err);
      }

      setShowAuthModal(true);
      return;
    }

    if (isFirstLastFrameMode && lastFrame && !firstFrame) {
      toast.error(m['stp.common.first_frame_required']());
      return;
    }
    if (!trimmedPrompt && !firstFrame) {
      toast.error(m['app.generator.prompt_required']());
      return;
    }
    if (isUploading) {
      toast.error(m['stp.common.image_uploading_wait']());
      return;
    }

    try {
      setIsGenerating(true);
      setProgressText(m['app.generator.generating']());

      const validImages = imageUrls.filter(Boolean);
      const effectiveMode = firstFrame ? 'image-to-video' : 'text-to-video';

      const draft = {
        generationRequested: true,
        prompt: trimmedPrompt,
        modelId: selectedModelId,
        duration,
        resolution,
        aspectRatio: showAspectRatio && aspectRatio ? aspectRatio : undefined,
        startImageUrl: firstFrame || '',
        imagePreview: firstFrame || '',
        imageUrls: validImages,
        mode: effectiveMode,
        createdAt: Date.now(),
      };

      try {
        sessionStorage.setItem(
          'joyflix_pending_generation_draft',
          JSON.stringify(draft)
        );
      } catch (err) {
        console.warn('Failed to save generation draft:', err);
      }

      navigate({
        to: '/ai-video-generator',
        search: {},
      });
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.message || m['video.hero_input.submit_generation_failed']()
      );
      setIsGenerating(false);
      setProgressText('');
    }
  };

  return (
    <div id="hero-input" className="mx-auto w-full max-w-4xl pt-8 sm:pt-10">
      {/* Glassmorphic Generator Card */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white/90 p-4 shadow-2xl shadow-slate-200/50 backdrop-blur-2xl transition-all sm:rounded-3xl sm:p-6 dark:border-white/15 dark:bg-zinc-900/60 dark:shadow-[0_20px_60px_rgba(0,0,0,0.7)]">
        <div className="flex flex-col gap-3">
          {/* GenerationUploadArea */}
          <div className="w-full">
            <GenerationUploadArea
              images={imageUrls}
              uploadingItems={uploadingItems}
              maxImages={maxImages}
              isFirstLastFrameMode={isFirstLastFrameMode}
              onUploadClick={(e) => {
                if (!session?.user) {
                  e.preventDefault();
                  setShowAuthModal(true);
                }
              }}
              onFilesSelected={handleFilesSelected}
              onReplaceFile={handleReplaceFile}
              onRemoveImage={handleRemoveImage}
            />
          </div>

          {/* Textarea Input */}
          <div className="overflow-y-auto">
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={m['video.hero_input.placeholder']()}
              rows={2}
              className="w-full resize-none border-none bg-transparent px-2 py-2 text-sm leading-relaxed text-slate-900 outline-none placeholder:text-slate-400 sm:px-3 sm:text-base dark:text-white dark:placeholder:text-white/40"
            />
          </div>

          {/* Bottom Controls Bar */}
          <div className="mt-3 flex flex-col gap-3 border-t border-slate-200/80 pt-3 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
            {/* Left Tools: Model Select + Parameters Select */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              {/* Model Select */}
              <ModelSelect
                models={activeModels}
                value={selectedModelId}
                onChange={handleModelChange}
                duration={duration}
                resolution={resolution}
                provider={publicConfig?.active_ai_provider}
                className="h-9 sm:h-10"
              />

              {/* Dynamic Parameters Select (Duration, Resolution, Aspect Ratio) */}
              <ParametersSelect
                duration={duration}
                setDuration={setDuration}
                availableDurations={availableDurations}
                resolution={resolution}
                setResolution={handleResolutionChange}
                availableResolutions={availableResolutions}
                aspectRatio={aspectRatio}
                setAspectRatio={setAspectRatio}
                showAspectRatio={showAspectRatio}
              />
            </div>

            {/* Right Action: Credits + Generate Button */}
            <div className="flex items-center justify-end gap-3 pt-1 sm:pt-0">
              {!mounted ? (
                <Button
                  disabled
                  className="h-10 rounded-xl px-6 text-xs font-semibold shadow-md sm:h-11 sm:px-8 sm:text-sm"
                >
                  <Wand2 className="mr-2 size-4" />
                  <span>{m['video.hero_input.generate_button']()}</span>
                </Button>
              ) : (
                <Button
                  type="button"
                  disabled={isGenerating || isUploading}
                  onClick={handleGenerate}
                  className="bg-primary text-primary-foreground shadow-primary/25 hover:bg-primary/90 h-10 rounded-xl px-6 text-xs font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] sm:h-11 sm:px-8 sm:text-sm"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      <span>
                        {progressText ||
                          m['video.hero_input.generating_button']()}
                      </span>
                    </>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Wand2 className="size-4" />
                      <span>{m['video.hero_input.generate_button']()}</span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-black/20 px-2 py-0.5 text-[11px] font-semibold dark:bg-white/20">
                        <Coins className="size-3 text-amber-400" />
                        <span>{costCredits}</span>
                      </span>
                    </span>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Prompts Suggestions */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
        {quickPrompts.map((pText, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setPrompt(pText);
              textareaRef.current?.focus();
            }}
            className={cn(
              'rounded-full border px-3.5 py-1.5 text-xs font-medium backdrop-blur-md transition-all duration-200',
              // Light mode
              'hover:border-primary/40 hover:text-primary border-slate-200/90 bg-white/80 text-slate-700 shadow-xs hover:bg-white',
              // Dark mode
              'dark:border-white/10 dark:bg-white/[0.05] dark:text-white/80 dark:hover:border-white/25 dark:hover:bg-white/[0.1] dark:hover:text-white'
            )}
          >
            {pText}
          </button>
        ))}
      </div>

      {/* Result Video Preview Modal */}
      <VideoPreviewDialog
        video={previewVideo}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
      />

      <QuickAuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        onSuccess={restoreDraft}
        callbackUrl="/ai-video-generator"
      />
    </div>
  );
}
