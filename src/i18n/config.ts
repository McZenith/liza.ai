export const locales = ['en', 'es', 'pt', 'fr', 'de', 'ja'] as const;
export const defaultLocale = 'en';
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  pt: 'Português',
  fr: 'Français',
  de: 'Deutsch',
  ja: '日本語'
};
