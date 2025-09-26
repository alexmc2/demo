'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import DesktopNav from '@/components/header/desktop-nav';
import MobileNav from '@/components/header/mobile-nav';
import { ModeToggle } from '@/components/menu-toggle';
import { cn } from '@/lib/utils';
import { NAVIGATION_QUERYResult, SETTINGS_QUERYResult } from '@/sanity.types';

type HeaderClientProps = {
  navigation: NAVIGATION_QUERYResult;
  settings: SETTINGS_QUERYResult;
};

export default function HeaderClient({
  navigation,
  settings,
}: HeaderClientProps) {
  const pathname = usePathname();

  const [overHero, setOverHero] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Avoid forcing theme on first paint to keep main thread idle

  const onHome = pathname === '/';
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!onHome) {
      setOverHero(false);
      setScrolled(true);
      return;
    }

    const heroEl =
      document.getElementById('hero') ||
      (document.querySelector('[data-hero]') as HTMLElement | null);

    const BUFFER = 64; // flip solid slightly before hero ends
    let raf = 0;

    const update = () => {
      raf = 0;
      setScrolled(window.scrollY > 8); // tiny scroll → frosted

      if (heroEl) {
        const rect = heroEl.getBoundingClientRect();
        const headerH = headerRef.current?.offsetHeight ?? 96;
        const isOver =
          rect.bottom > headerH + BUFFER && rect.top < window.innerHeight;
        setOverHero(isOver);
      } else {
        setOverHero(false);
      }
    };

    const onScrollOrResize = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    const ro = heroEl ? new ResizeObserver(onScrollOrResize) : null;
    if (heroEl) ro!.observe(heroEl);
    if (headerRef.current) ro?.observe(headerRef.current);

    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      ro?.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [onHome]);

  // Transparent at top, frosted when scrolling over hero, solid elsewhere
  const headerClass =
    onHome && overHero
      ? scrolled
        ? 'border-transparent bg-background/10 supports-[backdrop-filter]:backdrop-blur-md'
        : 'border-transparent bg-transparent'
      : 'border-white/10 bg-background shadow-xs supports-[backdrop-filter]:backdrop-blur';

  // Force white text when over hero
  const textClass = onHome && overHero ? 'text-white' : 'text-foreground';

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          'fixed inset-x-0 top-0 z-50 w-full border-b transition-all duration-500',
          headerClass
        )}
      >
        <div
          className={cn(
            'container flex h-16 items-center justify-between gap-6 transition-colors duration-500',
            textClass
          )}
        >
          <Link
            href="/"
            prefetch={false}
            aria-label="Home page"
            className="flex items-center gap-3 transition-transform duration-300 hover:scale-[1.01]"
          >
            <span className="relative h-8 w-8 sm:h-10 sm:w-10">
              <Image
                src="/demo-logo.svg"
                alt=""
                fill
                sizes="(min-width: 640px) 40px, 32px"
                className="pointer-events-none"
              />
            </span>
            <span className="sr-only">Sanity Next.js Website home</span>
          </Link>

          <div className="hidden items-center gap-6 xl:flex">
            <DesktopNav
              navigation={navigation}
              isSolid={!(onHome && overHero)}
            />
            {/* Theme toggle temporarily disabled */}
            
            <ModeToggle
              className={cn(
                'transition-colors duration-300',
                onHome && overHero
                  ? 'text-white/90 hover:text-white'
                  : 'text-foreground hover:text-foreground'
              )}
            />
           
          </div>

          <div
            className={cn(
              'flex items-center gap-2 xl:hidden',
              onHome && overHero ? 'text-white' : 'text-foreground'
            )}
          >
            {/* Theme toggle temporarily disabled */}
            {/*
            <ModeToggle
              className={cn(
                'transition-colors duration-300',
                onHome && overHero
                  ? 'text-white/90 hover:text-white'
                  : 'text-foreground hover:text-foreground'
              )}
            />
            */}
            <MobileNav
              navigation={navigation}
              settings={settings}
              isSolid={!(onHome && overHero)}
            />
          </div>
        </div>
      </header>

      {/* Spacer so content doesn’t jump under fixed header */}
      <div aria-hidden className="h-14 w-full" />
    </>
  );
}
