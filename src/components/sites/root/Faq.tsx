'use client';

import React from 'react';
import { HelpCircle } from 'lucide-react';

import { getLocale } from '@/paraglide/runtime.js';
import { Badge } from '@/components/ui/badge';

interface FaqItem {
  title: string;
  titleZh: string;
  desc: string;
  descZh: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    title: 'How to make ai video from text with the best results?',
    titleZh: '如何通过文本生成效果最佳的 AI 视频？',
    desc: "For the best output with our text to video ai, be specific in your prompts. Include details about the subject, setting, art style (e.g., 'cinematic', 'anime'), and mood. The more detail you provide, the better our AI can match your vision.",
    descZh:
      '若要获得理想的视频成片，建议在提示词中详细说明主体特征、环境场景、光影风格（如电影级、胶片感、赛博朋克）以及运镜视角。描述越细致，AI 越能准确还原您的创意。',
  },
  {
    title: 'What makes you the best ai video generator?',
    titleZh: 'JoyFlix AI 有哪些核心优势？',
    desc: 'Our ai video generator stands out due to its focus on visual quality and user control. Unlike other tools, we offer advanced style customizations and render high-definition videos, even in our free tier, ensuring a professional result every time.',
    descZh:
      '我们聚合了全球顶尖的视频生成模型，提供高清渲染与精细化参数控制。结合人物一致性与动作连贯度算法，让每一段生成短片都具备专业级品质。',
  },
  {
    title: 'How do I create video from images with ai free?',
    titleZh: '如何使用图生视频 (Image to Video) 功能？',
    desc: 'Simply sign up for a free JoyFlix AI account, click the paperclip icon in the generator to upload your picture, and describe the desired motion. You can generate and download videos up to a certain length completely free of charge.',
    descZh:
      '登录 JoyFlix AI 后，在首页生成器中点击回形针图标上传您的图片，输入运镜或动作描述，并选择支持图生视频的模型，即可一键将静态图片转化为鲜活视频。',
  },
  {
    title: 'Does the ai video generator from image work with any photo?',
    titleZh: '图生视频支持哪些类型的图片？',
    desc: 'For optimal results, use clear, high-resolution images. Our photo to video maker with ai works best when the subject is well-defined. It supports various formats like JPG, PNG, and WebP, giving you flexibility in your creative projects.',
    descZh:
      '支持人物肖像、商品白底图、风景摄影、建筑空间与动漫插画等各类素材。推荐使用主体轮廓清晰的高清 PNG、JPG 或 WebP 格式图片。',
  },
  {
    title: 'How long does it take to generate a video?',
    titleZh: '生成一段视频通常需要多长时间？',
    desc: "Most videos are generated within 60 seconds. Complex or longer videos may take up to 2-3 minutes. Our AI processes your request in real-time, and you'll see a progress indicator during generation.",
    descZh:
      '绝大多数 5-10 秒的视频在 30 到 60 秒内即可渲染完成。期间您可以在生成框中实时查看进度百分比，完成后将直接弹窗播放。',
  },
  {
    title: 'Can I use the generated videos commercially?',
    titleZh: '生成的视频可以用于商业变现或推广吗？',
    desc: "Yes! All videos generated with JoyFlix AI can be used for commercial purposes. You retain full rights to your created content, whether it's for marketing, social media, or any business application.",
    descZh:
      '是的！通过 JoyFlix AI 生成的内容完全支持商业化用途。您可以放心地将视频应用于社媒运营、短视频带货、产品广告或影视提案。',
  },
];

export function Faq() {
  const isZh = getLocale() === 'zh';

  return (
    <section
      id="faq"
      className="border-border/60 bg-muted/20 border-t py-20 sm:py-28 dark:bg-black/40"
    >
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <Badge
            variant="outline"
            className="mb-3.5 gap-1.5 px-3 py-1 text-xs font-semibold"
          >
            <HelpCircle className="text-primary size-3.5" />
            <span>{isZh ? '常见问答' : 'FAQ'}</span>
          </Badge>
          <h2 className="text-foreground text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            {isZh ? '常见问题解答' : 'Frequently Asked Questions'}
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-sm leading-relaxed sm:text-base">
            {isZh
              ? '还有其他疑问？欢迎随时联系我们的客服团队。'
              : 'Have another question? Contact us anytime by email or community.'}
          </p>
        </div>

        {/* 2-Column Numbered Q&A Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {FAQ_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className="hover:border-primary/40 flex gap-4 rounded-3xl border border-slate-200/90 bg-white/90 p-6 shadow-sm transition-all hover:shadow-md sm:p-7 dark:border-white/10 dark:bg-zinc-900/60"
            >
              <span className="border-primary/40 bg-primary/10 text-primary flex size-7 shrink-0 items-center justify-center rounded-full border font-mono text-xs font-bold">
                {idx + 1}
              </span>
              <div>
                <h3 className="text-foreground text-base font-bold sm:text-lg">
                  {isZh ? item.titleZh : item.title}
                </h3>
                <p className="text-muted-foreground mt-2 text-xs leading-relaxed sm:text-sm">
                  {isZh ? item.descZh : item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
