'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { defaultLocale, getDictionary, type Locale } from './config';

type Dictionary = Record<string, string | Record<string, string>>;

const I18nContext = createContext<{
  locale: Locale;
  t: (key: string, fallback?: string) => string;
  loading: boolean;
} | null>(null);

const cachedDicts = new Map<Locale, Dictionary>();

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (typeof current !== 'object' || current === null) return '';
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === 'string' ? current : '';
}

export function I18nProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadDict() {
      try {
        const dict = await getDictionary(locale);
        if (cancelled) return;
        cachedDicts.set(locale, dict);
        forceUpdate((n) => n + 1);
      } catch (err) {
        console.error(`[i18n] Failed to load dictionary for locale "${locale}":`, err);
        if (cancelled) return;
        if (locale !== defaultLocale) {
          console.warn(`[i18n] Falling back to "${defaultLocale}" dictionary for locale "${locale}"`);
          try {
            const fallbackDict = await getDictionary(defaultLocale);
            if (cancelled) return;
            cachedDicts.set(locale, fallbackDict);
          } catch (fallbackErr) {
            console.error(`[i18n] Failed to load fallback dictionary:`, fallbackErr);
          }
        }
        forceUpdate((n) => n + 1);
      }
    }

    loadDict();

    return () => {
      cancelled = true;
    };
  }, [locale]);

  const dict = cachedDicts.get(locale);
  const loading = !dict;

  const t = (key: string, fallback?: string): string => {
    if (!dict) return fallback ?? key;
    const value = getNestedValue(dict as Record<string, unknown>, key);
    return value || fallback || key;
  };

  return (
    <I18nContext.Provider value={{ locale, t, loading }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useT() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    return { t: (key: string, fallback?: string) => fallback ?? key, locale: 'en' as Locale, loading: false };
  }
  return ctx;
}
