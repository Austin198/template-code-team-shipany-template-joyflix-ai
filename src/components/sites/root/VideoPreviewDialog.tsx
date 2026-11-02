'use client';

import React from 'react';
import { Download, ExternalLink, Sparkles, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export interface PreviewVideoData {
  id: string;
  prompt: string;
  model: string;
  videoUrl?: string;
  status: string;
  createdAt: Date;
}

interface VideoPreviewDialogProps {
  video: PreviewVideoData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VideoPreviewDialog({
  video,
  open,
  onOpenChange,
}: VideoPreviewDialogProps) {
  if (!video) return null;

  const handleDownload = async () => {
    if (!video.videoUrl) return;
    try {
      const res = await fetch(video.videoUrl);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      const timestamp = new Date(video.createdAt).toISOString().slice(0, 10);
      a.download = `joyflix-${video.model}-${timestamp}-${video.id.slice(0, 6)}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(video.videoUrl, '_blank');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border/80 bg-background/95 max-w-3xl overflow-hidden border p-0 shadow-2xl backdrop-blur-2xl dark:border-white/15 dark:bg-zinc-950/95">
        <DialogHeader className="border-border/60 border-b p-4 sm:p-5 dark:border-white/10">
          <div className="flex items-center justify-between gap-3 pr-8">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="bg-primary/10 text-primary inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold">
                  <Sparkles className="size-3" />
                  <span>{video.model}</span>
                </span>
                <DialogTitle className="text-foreground text-sm font-bold sm:text-base">
                  Generated AI Video
                </DialogTitle>
              </div>
              <DialogDescription className="text-muted-foreground mt-1 line-clamp-2 text-xs">
                {video.prompt}
              </DialogDescription>
            </div>

            {video.videoUrl && (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDownload}
                  className="h-8 gap-1.5 rounded-lg px-2.5 text-xs font-medium"
                >
                  <Download className="size-3.5" />
                  <span className="hidden sm:inline">Download</span>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => window.open(video.videoUrl, '_blank')}
                  className="text-muted-foreground hover:text-foreground h-8 gap-1.5 rounded-lg px-2 text-xs font-medium"
                >
                  <ExternalLink className="size-3.5" />
                </Button>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="relative flex aspect-video w-full items-center justify-center bg-black">
          {video.videoUrl ? (
            <video
              key={video.videoUrl}
              src={video.videoUrl}
              controls
              autoPlay
              loop
              playsInline
              className="h-full w-full object-contain"
            />
          ) : (
            <p className="text-muted-foreground text-xs">
              Video is processing...
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
