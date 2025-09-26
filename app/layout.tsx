// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { fontBody, fontHeading, fontSans } from '@/lib/fonts';
import { projectId } from '@/sanity/env';

const isProduction = process.env.NEXT_PUBLIC_SITE_ENV === 'production';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
  title: {
    template: '%s | Schema UI Starter',
    default: 'Sanity Next.js Website | Schema UI Starter',
  },
  openGraph: {
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/images/og-image.jpg`,
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  robots: !isProduction ? 'noindex, nofollow' : 'index, follow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sanityCdnOrigin = 'https://cdn.sanity.io';
  const sanityApiOrigin = `https://${projectId}.api.sanity.io`;
  const googleUserContentOrigin = 'https://lh3.googleusercontent.com';

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href={sanityCdnOrigin} crossOrigin="anonymous" />
        <link rel="preconnect" href={sanityApiOrigin} crossOrigin="anonymous" />
        <link
          rel="preconnect"
          href={googleUserContentOrigin}
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href={sanityCdnOrigin} />
        <link rel="dns-prefetch" href={sanityApiOrigin} />
        <link rel="dns-prefetch" href={googleUserContentOrigin} />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased overscroll-none',
          fontHeading.variable,
          fontBody.variable,
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
