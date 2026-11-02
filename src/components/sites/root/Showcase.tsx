'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Clapperboard,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { getLocale } from '@/paraglide/runtime.js';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TextToVideoItem {
  prompt: string;
  promptZh: string;
  videoSrc: string;
}

const TEXT_TO_VIDEO_ITEMS: TextToVideoItem[] = [
  {
    prompt: 'A dog speed climbs up a climbing wall at the olympics',
    promptZh: '一只小狗在奥运会攀岩墙上飞速向上攀爬',
    videoSrc:
      'https://img-template-ai-video.16781678.xyz/uploads/video/dog-olympics.mp4',
  },
  {
    prompt:
      'The sun rises slowly between tall buildings. Ground-level follow shot of bicycle tires',
    promptZh: '清晨太阳从高楼大厦间缓缓升起，跟拍自行车车轮的地平线特写',
    videoSrc:
      'https://img-template-ai-video.16781678.xyz/uploads/video/sun-rises-bicycle.mp4',
  },
  {
    prompt: 'Pirate ship sailing into a storm with lightning and high waves',
    promptZh: '海盗船在狂风巨浪与闪电交加的暴风雨中乘风破浪',
    videoSrc:
      'https://img-template-ai-video.16781678.xyz/uploads/video/pirate-ship.mp4',
  },
  {
    prompt: 'A snow leopard walking through a snowy forest, cinematic 8k',
    promptZh: '一只雪豹在静谧的雪林中漫步，电影级 8K 质感',
    videoSrc:
      'https://img-template-ai-video.16781678.xyz/uploads/video/snow-leopard.mp4',
  },
];

interface ImageToVideoItem {
  title: string;
  titleZh: string;
  prompt: string;
  promptZh: string;
  originalImage: string;
  videoSrc: string;
}

const IMAGE_TO_VIDEO_ITEMS: ImageToVideoItem[] = [
  {
    title: 'Dynamic Product Motion',
    titleZh: '商业产品动态运镜',
    prompt: 'Rotate the shoe, keep everything else still',
    promptZh: '平滑旋转该球鞋，保持其他背景与光影稳定',
    originalImage:
      'https://img-template-ai-video.16781678.xyz/uploads/video/macpaint.png',
    videoSrc:
      'https://img-template-ai-video.16781678.xyz/uploads/video/macpaint.mp4',
  },
  {
    title: 'Cinematic Atmosphere',
    titleZh: '电影级氛围运镜',
    prompt:
      'Sunset over Venetian ruins with a weathered gondolier rowing through quiet waters.',
    promptZh: '落日余晖洒在威尼斯水城遗迹上，老船夫摇橹划过静谧的水面',
    originalImage:
      'https://img-template-ai-video.16781678.xyz/uploads/video/gondola.jpg',
    videoSrc:
      'https://img-template-ai-video.16781678.xyz/uploads/video/gondola.mp4',
  },
  {
    title: 'Surreal Transformation',
    titleZh: '超现实艺术演变',
    prompt: 'Make the changes happen instantly.',
    promptZh: '定格插画演变为绚丽多彩流体动效的奇幻过程',
    originalImage:
      'https://img-template-ai-video.16781678.xyz/uploads/video/woman-city-doodle.jpg',
    videoSrc:
      'https://img-template-ai-video.16781678.xyz/uploads/video/woman-city-doodle.mp4',
  },
];

export function Showcase() {
  const isZh = getLocale() === 'zh';

  // Text to Video carousel state
  const [t2vIndex, setT2vIndex] = useState(0);
  const t2vVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    t2vVideoRefs.current.forEach((videoEl, idx) => {
      if (!videoEl) return;
      if (idx === t2vIndex) {
        videoEl.currentTime = 0;
        videoEl.play().catch(() => {});
      } else {
        videoEl.pause();
      }
    });
  }, [t2vIndex]);

  // Image to Video state
  const [i2vIndex, setI2vIndex] = useState(0);

  const handlePromptSelect = (promptText: string) => {
    window.dispatchEvent(
      new CustomEvent('joyflix_select_prompt', { detail: promptText })
    );
  };

  const scrollToHero = () => {
    const heroEl =
      document.getElementById('hero-input') || document.getElementById('hero');
    if (heroEl) {
      heroEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const currentT2V = TEXT_TO_VIDEO_ITEMS[t2vIndex];
  const currentI2V = IMAGE_TO_VIDEO_ITEMS[i2vIndex];

  return (
    <section id="showcase" className="relative py-20 sm:py-28">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Showcase Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="border-primary/20 bg-primary/10 text-primary mb-3.5 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold">
            <Sparkles className="size-3" />
            <span>{isZh ? '灵感展厅' : 'AI Inspiration'}</span>
          </div>
          <h2 className="text-foreground text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            {isZh ? '认识 JoyFlix AI' : 'What is JoyFlix AI'}
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-base leading-relaxed sm:text-lg">
            {isZh
              ? 'JoyFlix AI 是一款革命性的视频生成平台，能瞬间将文本提示词和静态图像转换为专业级的电影短片。它是创作者、营销专家和故事讲述者的终极创作利器。'
              : 'JoyFlix AI is the ultimate AI video generator that transforms text prompts and images into stunning, professional-quality videos. Perfect for content creators, marketers, and storytellers.'}
          </p>
        </div>

        {/* Divider */}
        <div className="via-primary/30 my-14 h-px w-full bg-gradient-to-r from-transparent to-transparent" />

        {/* 1. Text to Video AI Showcase */}
        <div className="mb-24">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h3 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
              {isZh ? 'AI 文本转视频 (Text to Video)' : 'Text to Video AI'}
            </h3>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              {isZh
                ? '轻松将文字脚本转化为扣人心弦的视觉盛宴。输入您的创意描述，AI 将为您构建一个栩栩如生的动态世界。'
                : 'Transform written content into captivating videos with ease. Simply input your text prompt, and let the AI generate a fully-realized video that brings your words to life.'}
            </p>
          </div>

          {/* 3D Perspective Video Reel Carousel */}
          <div className="relative mx-auto w-full max-w-4xl">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-slate-200/90 bg-black shadow-2xl dark:border-white/15">
              {TEXT_TO_VIDEO_ITEMS.map((item, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'absolute inset-0 transition-opacity duration-700 ease-in-out',
                    t2vIndex === idx
                      ? 'pointer-events-auto opacity-100'
                      : 'pointer-events-none opacity-0'
                  )}
                >
                  <video
                    ref={(el) => {
                      t2vVideoRefs.current[idx] = el;
                    }}
                    src={item.videoSrc}
                    muted
                    loop
                    playsInline
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Carousel Controls Bar with Clickable Prompt */}
            <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() =>
                    setT2vIndex((prev) =>
                      prev === 0 ? TEXT_TO_VIDEO_ITEMS.length - 1 : prev - 1
                    )
                  }
                  className="size-9 rounded-full border-slate-200 bg-white/90 shadow-sm hover:bg-slate-100 dark:border-white/15 dark:bg-white/[0.08] dark:hover:bg-white/[0.15]"
                >
                  <ArrowLeft className="size-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() =>
                    setT2vIndex((prev) =>
                      prev === TEXT_TO_VIDEO_ITEMS.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="size-9 rounded-full border-slate-200 bg-white/90 shadow-sm hover:bg-slate-100 dark:border-white/15 dark:bg-white/[0.08] dark:hover:bg-white/[0.15]"
                >
                  <ArrowRight className="size-4" />
                </Button>
                <div className="ml-2 flex items-center gap-1.5">
                  {TEXT_TO_VIDEO_ITEMS.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setT2vIndex(i)}
                      className={cn(
                        'h-1.5 rounded-full transition-all duration-300',
                        t2vIndex === i
                          ? 'bg-primary w-6'
                          : 'w-2 bg-slate-300 hover:bg-slate-400 dark:bg-white/20 dark:hover:bg-white/40'
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Prompt Click-to-fill Pill */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <button
                        type="button"
                        onClick={() =>
                          handlePromptSelect(
                            isZh ? currentT2V.promptZh : currentT2V.prompt
                          )
                        }
                        className="group hover:border-primary/50 flex max-w-lg items-center gap-2 rounded-full border border-slate-200/90 bg-white/90 px-4 py-2 text-left text-xs font-medium shadow-sm transition-all hover:bg-white dark:border-white/15 dark:bg-white/[0.08] dark:hover:border-white/30 dark:hover:bg-white/[0.12]"
                      >
                        <Sparkles className="text-primary size-3.5 shrink-0" />
                        <span className="truncate text-slate-700 group-hover:text-slate-900 dark:text-white/80 dark:group-hover:text-white">
                          {isZh ? currentT2V.promptZh : currentT2V.prompt}
                        </span>
                      </button>
                    }
                  />
                  <TooltipContent>
                    <p className="text-xs">
                      {isZh
                        ? '点击将此提示词填入生成器'
                        : 'Click to use this prompt'}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Try Button */}
              <Button
                size="sm"
                onClick={scrollToHero}
                className="h-9 shrink-0 gap-1.5 rounded-full px-5 text-xs font-semibold shadow-sm"
              >
                <span>{isZh ? '立即体验文本生片' : 'Try JoyFlix AI Now'}</span>
                <ChevronRight className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="via-primary/30 my-14 h-px w-full bg-gradient-to-r from-transparent to-transparent" />

        {/* 2. Image to Video AI Showcase */}
        <div>
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h3 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
              {isZh ? 'AI 图像转视频 (Image to Video)' : 'Image to Video AI'}
            </h3>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              {isZh
                ? '赋予静态照片生动逼真的运镜与电影级光影。上传图片，见证 AI 将其转化为鲜活的动态短片。'
                : 'Bring your static photos to life with realistic motion and cinematic effects. Upload an image and watch as AI transforms it into a dynamic video story.'}
            </p>
          </div>

          {/* Interactive Split Comparison Card */}
          <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white/80 shadow-2xl backdrop-blur-xl dark:border-white/15 dark:bg-zinc-900/60">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left Column: Original Still Image & Prompt */}
              <div className="flex flex-col justify-between border-b border-slate-200/80 p-6 sm:p-8 lg:col-span-5 lg:border-r lg:border-b-0 dark:border-white/10">
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase">
                      <ImageIcon className="size-3.5" />
                      <span>{isZh ? '原始图片输入' : 'Original image'}</span>
                    </span>
                    <span className="bg-muted text-muted-foreground rounded-md px-2 py-0.5 text-[11px] font-medium">
                      Input
                    </span>
                  </div>

                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-slate-200 bg-black/5 dark:border-white/15">
                    <img
                      src={currentI2V.originalImage}
                      alt={isZh ? currentI2V.titleZh : currentI2V.title}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>

                  {/* Prompt Card */}
                  <div className="mt-4 rounded-xl border border-slate-200/80 bg-slate-100/60 p-3.5 dark:border-white/10 dark:bg-white/[0.04]">
                    <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                      Prompt
                    </span>
                    <p
                      onClick={() =>
                        handlePromptSelect(
                          isZh ? currentI2V.promptZh : currentI2V.prompt
                        )
                      }
                      className="hover:text-primary dark:hover:text-primary mt-1 cursor-pointer text-xs leading-relaxed font-medium text-slate-800 transition-colors dark:text-white/90"
                    >
                      "{isZh ? currentI2V.promptZh : currentI2V.prompt}"
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-2">
                  {IMAGE_TO_VIDEO_ITEMS.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setI2vIndex(idx)}
                      className={cn(
                        'flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all',
                        i2vIndex === idx
                          ? 'border-primary bg-primary/10 text-primary shadow-xs'
                          : 'border-slate-200/80 bg-white/70 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/70 dark:hover:bg-white/[0.08] dark:hover:text-white'
                      )}
                    >
                      <img
                        src={item.originalImage}
                        alt=""
                        className="size-5 rounded-md object-cover"
                      />
                      <span>{isZh ? item.titleZh : item.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column: Generated Video Output */}
              <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-7">
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-primary flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase">
                      <Clapperboard className="size-3.5" />
                      <span>
                        {isZh ? '生成的 AI 动态视频' : 'Video output'}
                      </span>
                    </span>
                    <span className="bg-primary/10 text-primary rounded-md px-2 py-0.5 text-[11px] font-semibold">
                      HD 60FPS
                    </span>
                  </div>

                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-slate-200 bg-black shadow-lg dark:border-white/15">
                    <video
                      key={currentI2V.videoSrc}
                      src={currentI2V.videoSrc}
                      controls
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>

                <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
                  <p className="text-muted-foreground text-xs">
                    {isZh
                      ? '支持上传您的自拍、风景或插画快速转换'
                      : 'Supports portrait, landscape, or anime illustration inputs'}
                  </p>
                  <Button
                    size="sm"
                    onClick={scrollToHero}
                    className="gap-1.5 rounded-full px-6 text-xs font-semibold shadow-sm"
                  >
                    <span>
                      {isZh ? '立即体验图生视频' : 'Try JoyFlix AI Now'}
                    </span>
                    <ChevronRight className="size-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
