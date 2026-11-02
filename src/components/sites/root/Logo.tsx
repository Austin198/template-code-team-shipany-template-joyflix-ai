import { PRODUCT_NAME } from '@/config/seo-site';

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className = 'size-8', size = 32 }: LogoProps) {
  return (
    <img
      src="/logo.png"
      alt={PRODUCT_NAME}
      width={size}
      height={size}
      className={`rounded-lg object-contain ${className}`}
    />
  );
}
