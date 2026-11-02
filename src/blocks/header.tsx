'use client';

import React, { useEffect, useState } from 'react';
import {
  Clapperboard,
  CreditCard,
  Menu,
  Sparkles,
  Wand2,
  X,
} from 'lucide-react';

import { useSession } from '@/core/auth/client';
import { Link, usePathname } from '@/core/i18n/navigation';
import { m } from '@/paraglide/messages.js';
import { useAppName } from '@/hooks/use-public-config';
import { LocaleSelector } from '@/components/locale-selector';
import { SiteUserMenu } from '@/components/site-user-menu';
import { Logo } from '@/components/sites/root/Logo';
import { ThemeToggle } from '@/components/theme-toggle';

/**
 * 全站前台顶部导航栏
 * 包含 Joyflix AI Logo 与名称、AI视频创作、提示词库、作品展厅、定价方案、多语言选择、主题切换与用户登录态
 */
export function Header() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;
  const pathname = usePathname();
  const signInHref =
    pathname && pathname !== '/sign-in' && pathname !== '/sign-up'
      ? `/sign-in?callbackUrl=${encodeURIComponent(pathname)}`
      : '/sign-in';

  // 挂载守卫：保证 SSR 与客户端初次水合 DOM 结构一致
  useEffect(() => {
    setMounted(true);
  }, []);

  // 锁定移动端菜单打开时的页面滚动
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const appName = useAppName() || 'Joyflix AI';

  return (
    <header
      suppressHydrationWarning
      style={{ top: 'var(--top-banner-height, 0px)' }}
      className={`fixed right-0 left-0 z-50 transition-[top] duration-200 ${
        mobileMenuOpen
          ? 'bg-background inset-0 flex flex-col overflow-hidden dark:bg-[#0d0f14]'
          : 'bg-background/70 border-border/40 flex h-[65px] items-center border-b backdrop-blur-xl'
      }`}
    >
      <div className="mx-auto flex h-[65px] w-full max-w-7xl shrink-0 items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 transition-transform hover:scale-102"
          onClick={() => setMobileMenuOpen(false)}
        >
          <Logo className="size-7 shrink-0 rounded-lg sm:size-8" size={32} />
          <span className="text-foreground text-sm font-extrabold tracking-tight whitespace-nowrap sm:text-lg md:text-xl">
            {appName}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-7 lg:flex xl:gap-8">
          {/* AI 视频创作 (Direct Link with stylish badge/icon) */}
          <Link
            href="/ai-video-generator"
            onClick={() => {
              sessionStorage.removeItem('joyflix_pending_generation_draft');
              window.dispatchEvent(new Event('joyflix_reset_video_generator'));
            }}
            className={`flex items-center gap-1.5 py-2 text-sm font-semibold transition-colors ${
              pathname === '/ai-video-generator'
                ? 'text-primary'
                : 'text-foreground/90 hover:text-primary'
            }`}
          >
            <Clapperboard className="text-primary size-4" />
            <span>
              {mounted ? m['landing.nav.create_ai_video']() : 'AI Video'}
            </span>
          </Link>

          {/* 提示词库 (Prompt Library) */}
          <Link
            href="/prompts"
            className={`flex items-center gap-1.5 py-2 text-sm font-semibold transition-colors ${
              pathname === '/prompts'
                ? 'text-primary'
                : 'text-foreground/90 hover:text-primary'
            }`}
          >
            <Wand2 className="text-primary size-4" />
            <span>
              {mounted ? m['landing.nav.prompts']() : 'Prompt Library'}
            </span>
          </Link>

          {/* 作品展厅 (Showcases) */}
          <Link
            href="/showcases"
            className={`flex items-center gap-1.5 py-2 text-sm font-semibold transition-colors ${
              pathname === '/showcases'
                ? 'text-primary'
                : 'text-foreground/90 hover:text-primary'
            }`}
          >
            <Sparkles className="text-primary size-4" />
            <span>{mounted ? m['landing.nav.showcases']() : 'Showcases'}</span>
          </Link>

          {/* 定价方案 (Pricing) */}
          <Link
            href="/pricing"
            className={`flex items-center gap-1.5 py-2 text-sm font-semibold transition-colors ${
              pathname === '/pricing'
                ? 'text-primary'
                : 'text-foreground/90 hover:text-primary'
            }`}
          >
            <CreditCard className="text-primary size-4" />
            <span>{mounted ? m['landing.nav.pricing']() : 'Pricing'}</span>
          </Link>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          <div className="hidden items-center gap-1.5 sm:gap-3 lg:flex">
            <LocaleSelector />
            <ThemeToggle />
            {!mounted ? (
              <div className="h-8 w-20" />
            ) : user ? (
              <SiteUserMenu
                name={user.name || 'User'}
                email={user.email}
                image={user.image}
              />
            ) : (
              <Link
                href={signInHref}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-4 py-2 text-xs font-bold shadow-sm transition-all hover:scale-102"
              >
                {m['stp.nav.sign_in']()}
              </Link>
            )}
          </div>

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-foreground hover:text-primary cursor-pointer p-2 lg:hidden"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? (
              <X className="size-6" />
            ) : (
              <Menu className="size-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="flex flex-1 flex-col overflow-hidden lg:hidden">
          <div className="text-foreground flex flex-1 flex-col gap-4 overflow-y-auto p-6">
            {/* AI 视频创作 */}
            <div className="border-border/60 border-b py-2">
              <Link
                href="/ai-video-generator"
                onClick={() => {
                  sessionStorage.removeItem('joyflix_pending_generation_draft');
                  window.dispatchEvent(
                    new Event('joyflix_reset_video_generator')
                  );
                  setMobileMenuOpen(false);
                }}
                className="text-foreground hover:text-primary flex items-center gap-2 py-2 text-base font-bold"
              >
                <Clapperboard className="text-primary size-4" />
                <span>
                  {mounted ? m['landing.nav.create_ai_video']() : 'AI Video'}
                </span>
              </Link>
            </div>

            {/* 提示词库 */}
            <div className="border-border/60 border-b py-2">
              <Link
                href="/prompts"
                className="text-foreground hover:text-primary flex items-center gap-2 py-2 text-base font-bold"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Wand2 className="text-primary size-4" />
                <span>
                  {mounted ? m['landing.nav.prompts']() : 'Prompt Library'}
                </span>
              </Link>
            </div>

            {/* 作品展厅 */}
            <div className="border-border/60 border-b py-2">
              <Link
                href="/showcases"
                className="text-foreground hover:text-primary flex items-center gap-2 py-2 text-base font-bold"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Sparkles className="text-primary size-4" />
                <span>
                  {mounted ? m['landing.nav.showcases']() : 'Showcases'}
                </span>
              </Link>
            </div>

            {/* 定价方案 */}
            <div className="border-border/60 border-b py-2">
              <Link
                href="/pricing"
                className="text-foreground hover:text-primary flex items-center gap-2 py-2 text-base font-bold"
                onClick={() => setMobileMenuOpen(false)}
              >
                <CreditCard className="text-primary size-4" />
                <span>{mounted ? m['landing.nav.pricing']() : 'Pricing'}</span>
              </Link>
            </div>
          </div>

          <div className="border-border/60 bg-background/95 shrink-0 border-t px-6 py-3.5 pb-[calc(0.875rem+env(safe-area-inset-bottom))] backdrop-blur-md dark:bg-[#0d0f14]/95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LocaleSelector />
                <ThemeToggle />
              </div>
              {!mounted ? (
                <div className="h-8 w-20" />
              ) : user ? (
                <SiteUserMenu
                  name={user.name || 'User'}
                  email={user.email}
                  image={user.image}
                />
              ) : (
                <Link
                  href={signInHref}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-bold shadow-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {m['stp.nav.sign_in']()}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
