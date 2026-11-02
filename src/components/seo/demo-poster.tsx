import { useState } from 'react';
import { Play } from 'lucide-react';

import { DEMO_POSTER, DEMO_VIDEO_SRC } from '@/config/seo-landings';

import { SeoImage } from './rich-text';

/** Poster first. The video file is requested only after a click. */
export function DemoPoster() {
  const [play, setPlay] = useState(false);

  if (play) {
    return (
      <video
        className="aspect-video w-full rounded-xl bg-black"
        controls
        autoPlay
        playsInline
        poster={DEMO_POSTER.src}
        src={DEMO_VIDEO_SRC}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlay(true)}
      className="group relative block w-full cursor-pointer overflow-hidden rounded-xl text-left"
      aria-label="Play demo video"
    >
      <SeoImage
        figure={DEMO_POSTER}
        priority
        className="aspect-video w-full object-cover"
      />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="bg-background/90 text-foreground flex size-14 items-center justify-center rounded-full shadow-lg">
          <Play className="size-6 translate-x-0.5" aria-hidden="true" />
        </span>
      </span>
    </button>
  );
}
