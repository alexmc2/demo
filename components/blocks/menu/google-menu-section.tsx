// components/blocks/menu/google-menu-section.tsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { stegaClean } from "next-sanity";
import { MenuIcon, MoreHorizontal } from "lucide-react";

import SectionContainer from "@/components/ui/section-container";
import { cn } from "@/lib/utils";
import type { ColorVariant, SectionPadding } from "@/sanity.types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type RawDietary = string | null | undefined;

type MenuGoogleItem = {
  _key?: string;
  name?: string | null;
  price?: string | null;
  description?: string | null;
  dietary?: RawDietary[] | null;
};

type MenuGoogleCategory = {
  _key?: string;
  title?: string | null;
  tagline?: string | null;
  itemEntryMode?: "structured" | "text" | null;
  items?: MenuGoogleItem[] | null;
  rawItems?: string | null;
};

export type MenuGoogleSectionProps = {
  _type: "menu-google-section";
  _key: string;
  padding?: SectionPadding | null;
  sectionId?: string | null;
  eyebrow?: string | null;
  title?: string | null;
  intro?: string | null;
  accordionBehaviour?: "expanded" | "first-open" | null;
  appearance?: {
    backgroundColor?: ColorVariant | null;
    panelColor?: ColorVariant | null;
    accentColor?: ColorVariant | null;
  } | null;
  categories?: MenuGoogleCategory[] | null;
};

type ParsedMenuItem = {
  key: string;
  name: string;
  price?: string;
  description?: string;
  dietary: string[];
};

type ParsedCategory = {
  key: string;
  slug: string;
  title: string;
  tagline?: string;
  items: ParsedMenuItem[];
};

const MAX_VISIBLE_TABS = 5;
const COLOR_VARIANT_VALUES = [
  "background",
  "primary",
  "secondary",
  "card",
  "accent",
  "destructive",
  "muted",
  "white",
  "light-gray",
  "cool-gray",
  "soft-blue",
  "sky-blue",
  "mint",
  "sand",
  "peach",
  "slate",
  "navy",
  "charcoal",
] as const satisfies readonly ColorVariant[];

const COLOR_FALLBACKS: Record<
  ColorVariant,
  { base: string; foreground: string }
> = {
  background: {
    base: "var(--background)",
    foreground: "var(--foreground)",
  },
  primary: {
    base: "var(--primary)",
    foreground: "var(--primary-foreground)",
  },
  secondary: {
    base: "var(--secondary)",
    foreground: "var(--secondary-foreground)",
  },
  card: {
    base: "var(--card)",
    foreground: "var(--card-foreground)",
  },
  accent: {
    base: "var(--accent)",
    foreground: "var(--accent-foreground)",
  },
  destructive: {
    base: "var(--destructive)",
    foreground: "var(--destructive-foreground)",
  },
  muted: {
    base: "var(--muted)",
    foreground: "var(--muted-foreground)",
  },
  white: {
    base: "var(--white)",
    foreground: "var(--white-foreground)",
  },
  "light-gray": {
    base: "var(--light-gray)",
    foreground: "var(--light-gray-foreground)",
  },
  "cool-gray": {
    base: "var(--cool-gray)",
    foreground: "var(--cool-gray-foreground)",
  },
  "soft-blue": {
    base: "var(--soft-blue)",
    foreground: "var(--soft-blue-foreground)",
  },
  "sky-blue": {
    base: "var(--sky-blue)",
    foreground: "var(--sky-blue-foreground)",
  },
  mint: {
    base: "var(--mint)",
    foreground: "var(--mint-foreground)",
  },
  sand: {
    base: "var(--sand)",
    foreground: "var(--sand-foreground)",
  },
  peach: {
    base: "var(--peach)",
    foreground: "var(--peach-foreground)",
  },
  slate: {
    base: "var(--slate)",
    foreground: "var(--slate-foreground)",
  },
  navy: {
    base: "var(--navy)",
    foreground: "var(--navy-foreground)",
  },
  charcoal: {
    base: "var(--charcoal)",
    foreground: "var(--charcoal-foreground)",
  },
};

const MENU_PALETTE_PRESETS: Record<ColorVariant, { panel: ColorVariant; accent: ColorVariant }> = {
  background: { panel: "card", accent: "primary" },
  primary: { panel: "soft-blue", accent: "white" },
  secondary: { panel: "white", accent: "primary" },
  card: { panel: "white", accent: "primary" },
  accent: { panel: "white", accent: "primary" },
  destructive: { panel: "white", accent: "light-gray" },
  muted: { panel: "white", accent: "primary" },
  white: { panel: "light-gray", accent: "primary" },
  "light-gray": { panel: "white", accent: "primary" },
  "cool-gray": { panel: "white", accent: "primary" },
  "soft-blue": { panel: "white", accent: "primary" },
  "sky-blue": { panel: "white", accent: "primary" },
  mint: { panel: "white", accent: "primary" },
  sand: { panel: "white", accent: "primary" },
  peach: { panel: "white", accent: "primary" },
  slate: { panel: "white", accent: "primary" },
  navy: { panel: "soft-blue", accent: "white" },
  charcoal: { panel: "navy", accent: "white" },
};

function isColorVariant(value: string): value is ColorVariant {
  return (COLOR_VARIANT_VALUES as readonly string[]).includes(value);
}

function toColorVariant(value?: string | null): ColorVariant | null {
  if (!value) {
    return null;
  }
  const cleaned = stegaClean(value);
  return isColorVariant(cleaned) ? (cleaned as ColorVariant) : null;
}

function colorVar(variant: ColorVariant, { foreground = false } = {}) {
  const fallback = COLOR_FALLBACKS[variant];
  const fallbackValue = foreground ? fallback.foreground : fallback.base;
  const suffix = foreground ? "-foreground" : "";
  return `var(--color-${variant}${suffix}, ${fallbackValue})`;
}

function slugify(input: string, fallback: string) {
  const slug = input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .trim();
  return slug || fallback;
}

function parsePlainTextItems(rawItems: string, categoryKey: string): ParsedMenuItem[] {
  const lines = rawItems
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  const items: ParsedMenuItem[] = [];

  lines.forEach((line, index) => {
    const partsByPipe = line.split("|").map((part) => part.trim()).filter(Boolean);
    const parts = partsByPipe.length > 1
      ? partsByPipe
      : line.split("\t").map((part) => part.trim()).filter(Boolean);

    if (parts.length === 0) {
      return;
    }

    if (parts.length === 1) {
      const priceMatch = parts[0].match(/(£?\d[\d.,]*)$/);
      if (priceMatch) {
        const priceStart = priceMatch.index ?? parts[0].length;
        const name = parts[0].slice(0, priceStart).trim();
        const price = priceMatch[0];
        items.push({
          key: `${categoryKey}-raw-${index}`,
          name: name || parts[0],
          price,
          dietary: [],
        });
        return;
      }

      items.push({
        key: `${categoryKey}-raw-${index}`,
        name: parts[0],
        dietary: [],
      });
      return;
    }

    const [name, price, ...rest] = parts;
    const description = rest.length > 0 ? rest.join(" | ") : undefined;

    items.push({
      key: `${categoryKey}-raw-${index}`,
      name,
      price,
      description,
      dietary: [],
    });
  });

  return items;
}

function normalizeDietary(dietary?: RawDietary[] | null): string[] {
  if (!dietary?.length) {
    return [];
  }
  return dietary
    .map((tag) => (typeof tag === "string" ? stegaClean(tag) : undefined))
    .map((tag) => (tag ? tag.trim() : ""))
    .filter((tag): tag is string => Boolean(tag));
}

function normalizeCategories(rawCategories: MenuGoogleCategory[]): ParsedCategory[] {
  const categories: ParsedCategory[] = [];

  rawCategories.forEach((category, index) => {
    const title = stegaClean(category?.title) || `Category ${index + 1}`;
    const tagline = category?.tagline ? stegaClean(category.tagline) : undefined;
    const entryMode = (stegaClean(category?.itemEntryMode) || "structured") as
      | "structured"
      | "text";
    const key = category?._key || `menu-category-${index}`;
    const slug = slugify(title, key);

    if (entryMode === "text") {
      const raw = category?.rawItems ? stegaClean(category.rawItems) : "";
      const items = parsePlainTextItems(raw, key);
      if (items.length === 0) {
        return;
      }
      categories.push({
        key,
        slug,
        title,
        tagline,
        items,
      });
      return;
    }

    const structuredItems: ParsedMenuItem[] = [];
    (category?.items || []).forEach((item, itemIndex) => {
      if (!item) {
        return;
      }
      const name = item?.name ? stegaClean(item.name) : "";
      if (!name) {
        return;
      }
      structuredItems.push({
        key: item?._key || `${key}-item-${itemIndex}`,
        name,
        price: item?.price ? stegaClean(item.price) : undefined,
        description: item?.description ? stegaClean(item.description) : undefined,
        dietary: normalizeDietary(item?.dietary),
      });
    });

    if (!structuredItems.length) {
      return;
    }

    categories.push({
      key,
      slug,
      title,
      tagline,
      items: structuredItems,
    });
  });

  return categories;
}

function useActiveCategoryObserver(
  categories: ParsedCategory[],
  setActiveCategory: (slug: string) => void
) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const categoryRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    if (!categories.length || typeof window === "undefined") {
      return () => undefined;
    }

    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));

        if (visible.length > 0) {
          const best = visible[0]?.target?.getAttribute("data-category-slug");
          if (best) {
            setActiveCategory(best);
          }
        }
      },
      {
        root: null,
        rootMargin: "-40% 0px -40%",
        threshold: [0.25, 0.5, 0.75],
      }
    );

    const observer = observerRef.current;
    categories.forEach((category) => {
      const node = categoryRefs.current[category.slug];
      if (node) {
        observer.observe(node);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [categories, setActiveCategory]);

  const registerCategoryRef = useCallback((slug: string) => {
    return (node: HTMLElement | null) => {
      categoryRefs.current[slug] = node;
    };
  }, []);

  return registerCategoryRef;
}

export default function MenuGoogleSection(props: MenuGoogleSectionProps) {
  const {
    padding,
    sectionId,
    eyebrow,
    title,
    intro,
    accordionBehaviour,
    appearance,
    categories: rawCategories,
  } = props;

  const backgroundVariant =
    toColorVariant(appearance?.backgroundColor) ?? "background";
  const preset = MENU_PALETTE_PRESETS[backgroundVariant];
  const panelVariant = toColorVariant(appearance?.panelColor) ?? preset.panel;
  const accentVariant = toColorVariant(appearance?.accentColor) ?? preset.accent;

  const backgroundColor = colorVar(backgroundVariant);
  const backgroundForeground = colorVar(backgroundVariant, { foreground: true });
  const panelColor = colorVar(panelVariant);
  const panelForeground = colorVar(panelVariant, { foreground: true });
  const accentColor = colorVar(accentVariant);
  const accentForeground = colorVar(accentVariant, { foreground: true });

  const paletteStyle = useMemo<CSSProperties>(
    () => ({
      color: "var(--menu-headline)",
      "--menu-headline": backgroundForeground,
      "--menu-muted": `color-mix(in srgb, ${panelForeground} 60%, ${backgroundForeground} 40%)`,
      "--menu-border-color": `color-mix(in srgb, ${panelColor} 74%, ${accentColor} 26%)`,
      "--menu-surface": panelColor,
      "--menu-surface-foreground": panelForeground,
      "--menu-surface-hover": `color-mix(in srgb, ${accentColor} 12%, ${panelColor} 88%)`,
      "--menu-shell-bg": `color-mix(in srgb, ${panelColor} 24%, ${backgroundColor} 76%)`,
      "--menu-nav-base": `color-mix(in srgb, ${panelForeground} 65%, ${backgroundForeground} 35%)`,
      "--menu-nav-active": accentColor,
      "--menu-active-bg": `color-mix(in srgb, ${accentColor} 18%, ${panelColor} 82%)`,
      "--menu-badge-bg": `color-mix(in srgb, ${accentColor} 20%, ${panelColor} 80%)`,
      "--menu-badge-text": accentForeground,
      "--menu-price": `color-mix(in srgb, ${accentColor} 45%, ${panelForeground} 55%)`,
      "--menu-background": backgroundColor,
    }),
    [
      accentColor,
      accentForeground,
      backgroundColor,
      backgroundForeground,
      panelColor,
      panelForeground,
    ]
  );

  const parsedCategories = useMemo(() => {
    const safeCategories = rawCategories?.filter((category): category is MenuGoogleCategory => Boolean(category)) ?? [];
    return normalizeCategories(safeCategories);
  }, [rawCategories]);

  const fallbackSlug = parsedCategories[0]?.slug;
  const [activeCategory, setActiveCategory] = useState<string>(fallbackSlug || "");

  useEffect(() => {
    if (fallbackSlug) {
      setActiveCategory(fallbackSlug);
    }
  }, [fallbackSlug]);

  const registerCategoryRef = useActiveCategoryObserver(parsedCategories, setActiveCategory);

  const initialExpanded = useMemo(() => {
    if (!parsedCategories.length) {
      return [] as string[];
    }

    const behaviour = (stegaClean(accordionBehaviour) || "expanded") as
      | "expanded"
      | "first-open";

    if (behaviour === "expanded") {
      return parsedCategories.map((category) => category.slug);
    }

    return [parsedCategories[0]?.slug].filter(Boolean) as string[];
  }, [accordionBehaviour, parsedCategories]);

  const [openCategories, setOpenCategories] = useState<string[]>(initialExpanded);

  useEffect(() => {
    setOpenCategories(initialExpanded);
  }, [initialExpanded]);

  const navButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const hasRanInitialScroll = useRef(false);

  useEffect(() => {
    if (!hasRanInitialScroll.current) {
      hasRanInitialScroll.current = true;
      return;
    }

    const activeButton = activeCategory ? navButtonRefs.current[activeCategory] : null;
    if (activeButton) {
      activeButton.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    }
  }, [activeCategory]);

  const anchorId = sectionId ? stegaClean(sectionId) : undefined;

  const visibleTabs = parsedCategories.slice(0, MAX_VISIBLE_TABS);
  const overflowTabs = parsedCategories.slice(MAX_VISIBLE_TABS);

  const handleNavClick = (slug: string) => {
    hasRanInitialScroll.current = true;
    const element = document?.getElementById(slug);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setActiveCategory(slug);
    setOpenCategories((prev) => {
      if (prev.includes(slug)) {
        return prev;
      }
      return [...prev, slug];
    });
  };

  if (!parsedCategories.length) {
    return null;
  }

  const hasHeadingContent = Boolean(eyebrow || title || intro);

  return (
    <SectionContainer
      id={anchorId}
      padding={padding}
      color={backgroundVariant}
      className="relative overflow-hidden"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 mix-blend-screen"
        aria-hidden
      />
      <div
        className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 text-[color:var(--menu-headline)] sm:px-6 lg:px-8"
        style={paletteStyle}
      >
        {hasHeadingContent ? (
          <header className="flex flex-col gap-4">
            {eyebrow ? (
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--menu-muted)]">
                {stegaClean(eyebrow)}
              </p>
            ) : null}
            {title ? (
              <h2 className="text-3xl font-semibold tracking-tight text-[color:var(--menu-headline)] sm:text-4xl lg:text-5xl">
                {stegaClean(title)}
              </h2>
            ) : null}
            {intro ? (
              <p className="max-w-2xl text-base text-[color:var(--menu-muted)] sm:text-lg">
                {stegaClean(intro)}
              </p>
            ) : null}
          </header>
        ) : null}

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="gap-2 rounded-full border border-[color:var(--menu-border-color)] bg-transparent px-3 py-2 text-sm font-medium text-[color:var(--menu-nav-base)] transition-colors hover:text-[color:var(--menu-nav-active)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--menu-nav-active)] focus-visible:ring-offset-2"
                >
                  <MenuIcon className="size-4" />
                  <span>{title ? stegaClean(title) : "Menu"}</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="backdrop-blur-xl"
                style={{
                  backgroundColor,
                  color: "var(--menu-headline)",
                  borderColor: "var(--menu-border-color)",
                }}
              >
                <SheetHeader
                  className="border-b px-4 pb-4"
                  style={{ borderColor: "var(--menu-border-color)" }}
                >
                  <SheetTitle className="text-lg font-semibold text-[color:var(--menu-headline)]">
                    {title ? stegaClean(title) : "Menu"}
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1 px-4 py-4">
                  {parsedCategories.map((category) => (
                    <SheetClose asChild key={`${category.key}-sheet`}>
                      <button
                        type="button"
                        onClick={() => handleNavClick(category.slug)}
                        className={cn(
                          "rounded-md px-3 py-2 text-left text-sm font-medium transition-colors",
                          "text-[color:var(--menu-nav-base)] hover:bg-[color:var(--menu-active-bg)] hover:text-[color:var(--menu-nav-active)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--menu-nav-active)] focus-visible:ring-offset-2",
                          activeCategory === category.slug &&
                            "bg-[color:var(--menu-active-bg)] text-[color:var(--menu-nav-active)]"
                        )}
                      >
                        {category.title}
                      </button>
                    </SheetClose>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>

            <div className="flex-1 overflow-hidden">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-[color:var(--menu-headline)] to-transparent opacity-40" />
                <nav className="scrollbar-thin flex gap-4 overflow-x-auto pb-1 pr-6" aria-label="Menu categories">
                  {parsedCategories.map((category) => (
                    <button
                      key={`${category.key}-mobile`}
                      type="button"
                      ref={(node) => {
                        navButtonRefs.current[category.slug] = node;
                      }}
                      onClick={() => handleNavClick(category.slug)}
                      className={cn(
                        "relative flex-shrink-0 scroll-mx-4 whitespace-nowrap border-b-2 border-transparent pb-2 text-sm font-medium transition-colors",
                        "text-[color:var(--menu-nav-base)] hover:text-[color:var(--menu-nav-active)]",
                        activeCategory === category.slug &&
                          "border-b-[3px] border-[color:var(--menu-nav-active)] text-[color:var(--menu-nav-active)]"
                      )}
                      data-active={activeCategory === category.slug}
                    >
                      {category.title}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          <div className="hidden items-center justify-between lg:flex">
            <nav className="flex items-center gap-3" aria-label="Menu categories">
              {visibleTabs.map((category) => (
                <button
                  key={`${category.key}-desktop`}
                  type="button"
                  ref={(node) => {
                    navButtonRefs.current[category.slug] = node;
                  }}
                  onClick={() => handleNavClick(category.slug)}
                  className={cn(
                    "relative whitespace-nowrap border-b-2 border-transparent pb-2 text-sm font-medium transition-colors",
                    "text-[color:var(--menu-nav-base)] hover:text-[color:var(--menu-nav-active)]",
                    activeCategory === category.slug &&
                      "border-b-[3px] border-[color:var(--menu-nav-active)] text-[color:var(--menu-nav-active)]"
                  )}
                  data-active={activeCategory === category.slug}
                >
                  {category.title}
                </button>
              ))}
            </nav>

            {overflowTabs.length > 0 ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="gap-2 rounded-full border border-[color:var(--menu-border-color)] bg-transparent px-3 py-2 text-sm font-medium text-[color:var(--menu-nav-base)] transition-colors hover:text-[color:var(--menu-nav-active)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--menu-nav-active)] focus-visible:ring-offset-2"
                  >
                    More
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="min-w-[12rem] border-[color:var(--menu-border-color)] bg-[color:var(--menu-surface)] text-[color:var(--menu-surface-foreground)]"
                >
                  {overflowTabs.map((category) => (
                    <DropdownMenuItem
                      key={`${category.key}-overflow`}
                      className="text-[color:var(--menu-surface-foreground)] focus:bg-[color:var(--menu-active-bg)] focus:text-[color:var(--menu-nav-active)]"
                      onSelect={(event) => {
                        event.preventDefault();
                        handleNavClick(category.slug);
                      }}
                    >
                      {category.title}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>
        </div>

        <Accordion
          type="multiple"
          value={openCategories}
          onValueChange={(value) => setOpenCategories(value as string[])}
          className="rounded-2xl border border-[color:var(--menu-border-color)] bg-[color:var(--menu-shell-bg)] text-[color:var(--menu-surface-foreground)]"
        >
          {parsedCategories.map((category) => (
            <AccordionItem
              key={category.key}
              value={category.slug}
              className="border-b border-[color:var(--menu-border-color)] last:border-b-0"
            >
              <AccordionTrigger
                className={cn(
                  "gap-4 rounded-none border-none px-6 text-left text-base font-semibold transition-colors",
                  "text-[color:var(--menu-headline)] hover:text-[color:var(--menu-nav-active)]",
                  activeCategory === category.slug && "text-[color:var(--menu-nav-active)]"
                )}
                onClick={() => setActiveCategory(category.slug)}
              >
                <div>
                  <div className="text-lg font-semibold tracking-tight">{category.title}</div>
                  {category.tagline ? (
                    <div className="mt-1 text-sm font-normal text-[color:var(--menu-muted)]">
                      {category.tagline}
                    </div>
                  ) : null}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div
                  ref={registerCategoryRef(category.slug)}
                  id={category.slug}
                  data-category-slug={category.slug}
                  className="px-6 pb-6 text-[color:var(--menu-surface-foreground)]"
                >
                  <div className="grid gap-3 lg:grid-cols-2">
                    {category.items.map((item) => (
                      <article
                        key={item.key}
                        className={cn(
                          "rounded-2xl border px-4 py-3 shadow-sm transition hover:shadow-md",
                          "border-[color:var(--menu-border-color)] bg-[color:var(--menu-surface)] text-[color:var(--menu-surface-foreground)] hover:bg-[color:var(--menu-surface-hover)]"
                        )}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-base font-semibold tracking-tight">{item.name}</h3>
                          {item.price ? (
                            <span className="text-sm font-semibold text-[color:var(--menu-price)]">
                              {item.price}
                            </span>
                          ) : null}
                        </div>
                        {item.description ? (
                          <p className="mt-2 text-sm text-[color:var(--menu-muted)]">{item.description}</p>
                        ) : null}
                        {item.dietary.length > 0 ? (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {item.dietary.map((tag) => (
                              <span
                                key={`${item.key}-${tag}`}
                                className="rounded-full px-2 py-1 text-xs font-medium bg-[color:var(--menu-badge-bg)] text-[color:var(--menu-badge-text)]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </article>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </SectionContainer>
  );
}
