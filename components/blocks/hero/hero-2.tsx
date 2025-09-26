// components/blocks/hero/hero-2.tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { stegaClean } from "next-sanity";
import PortableTextRenderer from "@/components/portable-text-renderer";
import { FadeIn } from "@/components/ui/fade.in";
import { PAGE_QUERYResult } from "@/sanity.types";

type Hero2Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "hero-2" }
>;

export default function Hero2({ tagLine, title, body, links }: Hero2Props) {
  return (
    <div className="container dark:bg-background py-20 lg:pt-40 text-center">
      {tagLine && (
        <FadeIn as="h1" delay={120} className="leading-[0] font-sans">
          <span className="text-base font-semibold">{tagLine}</span>
        </FadeIn>
      )}
      {title && (
        <FadeIn
          as="h2"
          delay={220}
          className="mt-6 text-4xl font-bold leading-[1.1] md:text-5xl lg:text-6xl"
        >
          {title}
        </FadeIn>
      )}
      {body && (
        <FadeIn as="div" delay={320} className="mx-auto mt-6 max-w-2xl text-lg">
          <PortableTextRenderer value={body} />
        </FadeIn>
      )}
      {links && links.length > 0 && (
        <FadeIn as="div" delay={420} className="mt-10 flex flex-wrap justify-center gap-4">
          {links.map((link) => (
            <Button
              key={link.title}
              variant={stegaClean(link?.buttonVariant)}
              asChild
            >
              <Link
                href={link.href || "#"}
                target={link.target ? "_blank" : undefined}
                rel={link.target ? "noopener" : undefined}
              >
                {link.title}
              </Link>
            </Button>
          ))}
        </FadeIn>
      )}
    </div>
  );
}
