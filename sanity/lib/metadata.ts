// sanity/lib/metadata.ts
import { urlFor } from "@/sanity/lib/image";
import { PAGE_QUERYResult, POST_QUERYResult } from "@/sanity.types";

const isProduction = process.env.NEXT_PUBLIC_SITE_ENV === "production";
const fallbackSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const siteDescription =
  "Schema UI Starter is a Sanity-powered marketing experience built with Next.js.";
const siteTitle = "Sanity Next.js Website | Schema UI Starter";

export function generatePageMetadata({
  page,
  slug,
}: {
  page: PAGE_QUERYResult | POST_QUERYResult;
  slug: string;
}) {
  const rawMetaTitle = page?.meta_title?.trim();
  const rawTitle = typeof page?.title === "string" ? page.title.trim() : null;
  const title = rawMetaTitle?.length ? rawMetaTitle : rawTitle ?? siteTitle;

  const rawDescription = page?.meta_description?.trim();
  const description = rawDescription?.length ? rawDescription : siteDescription;

  const ogImageUrl = page?.ogImage
    ? urlFor(page.ogImage).quality(100).url()
    : `${fallbackSiteUrl}/images/og-image.jpg`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: page?.ogImage?.asset?.metadata?.dimensions?.width || 1200,
          height: page?.ogImage?.asset?.metadata?.dimensions?.height || 630,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    robots: !isProduction
      ? "noindex, nofollow"
      : page?.noindex
        ? "noindex"
        : "index, follow",
    alternates: {
      canonical: `/${slug === "index" ? "" : slug}`,
    },
  };
}
