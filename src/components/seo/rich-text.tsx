import { Link } from '@/core/i18n/navigation';
import type { RichParagraph, SeoFigure } from '@/config/seo-landings';

export function RichText({
  paragraph,
  className,
}: {
  paragraph: RichParagraph;
  className?: string;
}) {
  if (typeof paragraph === 'string') {
    return <p className={className}>{paragraph}</p>;
  }

  return (
    <p className={className}>
      {paragraph.map((part, index) =>
        typeof part === 'string' ? (
          <span key={index}>{part}</span>
        ) : (
          <Link
            key={index}
            href={part.href}
            className="font-medium underline underline-offset-4"
          >
            {part.anchor}
          </Link>
        )
      )}
    </p>
  );
}

export function SeoImage({
  figure,
  priority = false,
  className,
}: {
  figure: SeoFigure;
  priority?: boolean;
  className?: string;
}) {
  return (
    <img
      src={figure.src}
      alt={figure.alt}
      width={figure.width}
      height={figure.height}
      decoding="async"
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      {...(priority ? { fetchpriority: 'high' } : {})}
    />
  );
}
