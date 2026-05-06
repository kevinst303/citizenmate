'use client';

import { useParams } from 'next/navigation';

export function useLocalizedPath() {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';

  const getUrl = (path: string) => {
    if (path.startsWith('/#')) return `/${lang}${path.substring(1)}`;
    if (path.startsWith('http')) return path;
    if (path.startsWith('/') && !path.startsWith(`/${lang}/`) && path !== `/${lang}`) {
      return `/${lang}${path === '/' ? '' : path}`;
    }
    return path;
  };

  return { lang, getUrl };
}
