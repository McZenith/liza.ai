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
  
  return {
    title: t('title'),
    description: t('description'),
    keywords: ["YouTube SEO", "keyword research", "YouTube analytics", "video optimization", "AI tools"],
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: "website",
    },
    alternates: {
      languages: {
        'en': '/en',
        'es': '/es',
        'pt': '/pt',
        'fr': '/fr',
        'de': '/de',
        'ja': '/ja',
        'x-default': '/en'
      }
    }
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
        <link rel="alternate" hrefLang="en" href="https://liza.ai/en" />
        <link rel="alternate" hrefLang="es" href="https://liza.ai/es" />
        <link rel="alternate" hrefLang="pt" href="https://liza.ai/pt" />
        <link rel="alternate" hrefLang="fr" href="https://liza.ai/fr" />
        <link rel="alternate" hrefLang="de" href="https://liza.ai/de" />
        <link rel="alternate" hrefLang="ja" href="https://liza.ai/ja" />
        <link rel="alternate" hrefLang="x-default" href="https://liza.ai/en" />
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
