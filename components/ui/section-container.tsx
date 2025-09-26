// components/ui/section-container.tsx
import { cn } from "@/lib/utils";
import { SectionPadding, ColorVariant } from "@/sanity.types";

const BACKGROUND_CLASS_MAP = {
  background: "bg-background",
  primary: "bg-primary",
  secondary: "bg-secondary",
  card: "bg-card",
  accent: "bg-accent",
  destructive: "bg-destructive",
  muted: "bg-muted",
  white: "bg-white",
  "light-gray": "bg-light-gray",
  "cool-gray": "bg-cool-gray",
  "soft-blue": "bg-soft-blue",
  "sky-blue": "bg-sky-blue",
  mint: "bg-mint",
  sand: "bg-sand",
  peach: "bg-peach",
  slate: "bg-slate",
  navy: "bg-navy",
  charcoal: "bg-charcoal",
} as const satisfies Record<ColorVariant, string>;

interface SectionContainerProps {
  color?: ColorVariant | null;
  padding?: SectionPadding | null;
  children: React.ReactNode;
  className?: string;
  id?: string | null;
}

export default function SectionContainer({
  color = "background",
  padding,
  children,
  className,
  id,
}: SectionContainerProps) {
  const backgroundClass = BACKGROUND_CLASS_MAP[color ?? "background"];

  return (
    <div
      id={id ?? undefined}
      className={cn(
        "relative",
        id ? "scroll-mt-24 lg:scroll-mt-32" : undefined,
        backgroundClass,
        padding?.top ? "pt-16 xl:pt-20" : undefined,
        padding?.bottom ? "pb-16 xl:pb-20" : undefined,
        className
      )}
    >
      <div className="container">{children}</div>
    </div>
  );
}
