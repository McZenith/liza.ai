import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Inter } from "next/font/google";
import { routing } from '@/i18n/routing';
import { ThemeProvider } from "../ThemeProvider";
import "../globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
    const baseUrl = 'https://liza-ai-nine.vercel.app';
  
  return {
    title: t('title'),
    description: t('description'),
      keywords: t('keywords').split(', '),
      authors: [{ name: "Liza.ai" }],
      creator: "Liza.ai",
      publisher: "Liza.ai",
      metadataBase: new URL(baseUrl),
    alternates: {
        canonical: `${baseUrl}/${locale}`,
      languages: {
        'en': '/en',
        'es': '/es',
        'pt': '/pt',
        'fr': '/fr',
        'de': '/de',
        'ja': '/ja',
        'x-default': '/en'
      }
      },
      openGraph: {
          title: t('title'),
          description: t('description'),
          type: "website",
          url: `${baseUrl}/${locale}`,
          siteName: "Liza.ai",
          locale: locale,
          images: [
              {
                  url: `${baseUrl}/og-image.png`,
                  width: 1200,
                  height: 630,
                  alt: "Liza.ai - AI-Powered Social Media Growth",
              }
          ],
      },
      twitter: {
          card: "summary_large_image",
          title: t('title'),
          description: t('description'),
          images: [`${baseUrl}/og-image.png`],
          creator: "@lizaai",
      },
      robots: {
          index: true,
          follow: true,
          googleBot: {
              index: true,
              follow: true,
              'max-video-preview': -1,
              'max-image-preview': 'large',
              'max-snippet': -1,
          },
      },
      verification: {
          google: 'googlea82cfabf12d8b092',
      },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Validate locale
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Load messages for the current locale
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('liza-theme');
                  var theme = stored || 'system';
                  var resolved = theme;
                  if (theme === 'system') {
                    resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  document.documentElement.classList.add(resolved);
                  document.documentElement.setAttribute('data-theme', resolved);
                } catch (e) {}
              })();
            `,
          }}
        />
        {/* Hreflang tags for SEO */}
              <link rel="alternate" hrefLang="en" href="https://liza-ai-nine.vercel.app/en" />
              <link rel="alternate" hrefLang="es" href="https://liza-ai-nine.vercel.app/es" />
              <link rel="alternate" hrefLang="pt" href="https://liza-ai-nine.vercel.app/pt" />
              <link rel="alternate" hrefLang="fr" href="https://liza-ai-nine.vercel.app/fr" />
              <link rel="alternate" hrefLang="de" href="https://liza-ai-nine.vercel.app/de" />
              <link rel="alternate" hrefLang="ja" href="https://liza-ai-nine.vercel.app/ja" />
              <link rel="alternate" hrefLang="x-default" href="https://liza-ai-nine.vercel.app/en" />

              {/* JSON-LD Structured Data */}
              <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{
                      __html: JSON.stringify({
                          "@context": "https://schema.org",
                          "@graph": [
                              {
                                  "@type": "Organization",
                                  "@id": "https://liza-ai-nine.vercel.app/#organization",
                                  "name": "Liza.ai",
                                  "url": "https://liza-ai-nine.vercel.app",
                                  "logo": {
                                      "@type": "ImageObject",
                                      "url": "https://liza-ai-nine.vercel.app/logo.png",
                                      "width": 200,
                                      "height": 200
                                  },
                                  "sameAs": [
                                      "https://twitter.com/lizaai",
                                      "https://linkedin.com/company/lizaai"
                                  ]
                              },
                              {
                                  "@type": "WebSite",
                                  "@id": "https://liza-ai-nine.vercel.app/#website",
                                  "url": "https://liza-ai-nine.vercel.app",
                                  "name": "Liza.ai",
                                  "description": "AI-powered social media growth platform for content creators",
                                  "publisher": {
                                      "@id": "https://liza.ai/#organization"
                                  },
                                  "inLanguage": ["en", "es", "pt", "fr", "de", "ja"]
                              },
                              {
                                  "@type": "SoftwareApplication",
                                  "name": "Liza.ai",
                                  "applicationCategory": "BusinessApplication",
                                  "operatingSystem": "Web",
                                  "offers": {
                                      "@type": "Offer",
                                      "price": "0",
                                      "priceCurrency": "USD"
                                  },
                                  "aggregateRating": {
                                      "@type": "AggregateRating",
                                      "ratingValue": "4.8",
                                      "ratingCount": "1200"
                                  }
                              }
                          ]
                      })
                  }}
              />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
