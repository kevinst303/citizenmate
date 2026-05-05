'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Locale } from './config';

type TranslationValue = string | Record<string, string>;
type Dictionary = Record<string, TranslationValue>;

const I18nContext = createContext<{
  locale: Locale;
  t: (key: string, fallback?: string) => string;
  loading: boolean;
} | null>(null);

let cachedDicts: Partial<Record<Locale, Dictionary>> = {};

function loadDictionary(locale: Locale): () => void {
  const cleanupFns: Array<() => void> = [];
  if (cachedDicts[locale]) return () => {};

  import(`./dictionaries/${locale}.json`).then((mod) => {
    cachedDicts[locale] = mod.default;
    cleanupFns.forEach((fn) => fn());
  });

  return () => {
    cleanupFns.push(() => {});
  };
}

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
    const timeout = setTimeout(async () => {
      try {
        const mod = await import(`./dictionaries/${locale}.json`);
        cachedDicts[locale] = mod.default;
        forceUpdate((n) => n + 1);
      } catch {
        // Fall back to English if locale dictionary fails
        const mod = await import('./dictionaries/en.json');
        cachedDicts[locale] = mod.default;
        forceUpdate((n) => n + 1);
      }
    }, 0);
    return () => clearTimeout(timeout);
  }, [locale]);

  const dict = cachedDicts[locale];
  const loading = !dict;

  const t = (key: string, fallback?: string): string => {
    if (!dict) return fallback ?? key;
    const value = getNestedValue(dict, key);
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
