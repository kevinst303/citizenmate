import "server-only";

export const locales = ['en', 'es', 'hi', 'zh', 'ar'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

const dictionaries = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  es: () => import("./dictionaries/es.json").then((module) => module.default),
  hi: () => import("./dictionaries/hi.json").then((module) => module.default),
  zh: () => import("./dictionaries/zh.json").then((module) => module.default),
  ar: () => import("./dictionaries/ar.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale]?.() ?? dictionaries[defaultLocale]();
};
