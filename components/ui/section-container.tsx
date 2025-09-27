// components/ui/section-container.tsx
import { cn } from "@/lib/utils";
import { SectionPadding, ColorVariant } from "@/sanity.types";

const BACKGROUND_CLASS_MAP: Partial<Record<ColorVariant, string>> = {
  background: "bg-background",
  foreground: "bg-foreground",
  primary: "bg-primary",
  "primary-foreground": "bg-primary-foreground",
  secondary: "bg-secondary",
  "secondary-foreground": "bg-secondary-foreground",
  card: "bg-card",
  "card-foreground": "bg-card-foreground",
  popover: "bg-popover",
  "popover-foreground": "bg-popover-foreground",
  accent: "bg-accent",
  "accent-foreground": "bg-accent-foreground",
  destructive: "bg-destructive",
  "destructive-foreground": "bg-destructive-foreground",
  muted: "bg-muted",
  "muted-foreground": "bg-muted-foreground",
  white: "bg-white",
  "white-foreground": "bg-white-foreground",
  black: "bg-black",
  "black-foreground": "bg-black-foreground",
  "light-gray": "bg-light-gray",
  "light-gray-foreground": "bg-light-gray-foreground",
  "cool-gray": "bg-cool-gray",
  "cool-gray-foreground": "bg-cool-gray-foreground",
  "soft-blue": "bg-soft-blue",
  "soft-blue-foreground": "bg-soft-blue-foreground",
  "sky-blue": "bg-sky-blue",
  "sky-blue-foreground": "bg-sky-blue-foreground",
  mint: "bg-mint",
  "mint-foreground": "bg-mint-foreground",
  sand: "bg-sand",
  "sand-foreground": "bg-sand-foreground",
  peach: "bg-peach",
  "peach-foreground": "bg-peach-foreground",
  slate: "bg-slate",
  "slate-foreground": "bg-slate-foreground",
  navy: "bg-navy",
  "navy-foreground": "bg-navy-foreground",
  charcoal: "bg-charcoal",
  "charcoal-foreground": "bg-charcoal-foreground",
};

interface SectionContainerProps {
  color?: ColorVariant | null;
  padding?: SectionPadding | null;
  children: React.ReactNode;
  className?: string;
  id?: string | null;
  style?: React.CSSProperties;
}

export default function SectionContainer({
  color = "background",
  padding,
  children,
  className,
  id,
  style,
}: SectionContainerProps) {
  const backgroundClass = BACKGROUND_CLASS_MAP[color ?? "background"] ?? "bg-background";

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
      style={style}
    >
      <div className="container">{children}</div>
    </div>
  );
}
