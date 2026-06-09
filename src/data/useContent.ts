import { useMemo } from 'react';
import { useLanguage } from '../i18n';
import { apps, movies, books, collections, stories } from './content';
import { appsEn, moviesEn, booksEn, collectionsEn, storiesEn } from './content-en';
import { appsZhHans, moviesZhHans, booksZhHans, collectionsZhHans, storiesZhHans } from './content-zhHans';
import type { Lang } from '../i18n';

export function useContent() {
  const { lang } = useLanguage();

  return useMemo(() => {
    const map: Record<Lang, {
      apps: typeof apps; movies: typeof movies; books: typeof books;
      collections: typeof collections; stories: typeof stories;
    }> = {
      'zh-Hant': { apps, movies, books, collections, stories },
      'zh-Hans': { apps: appsZhHans, movies: moviesZhHans, books: booksZhHans, collections: collectionsZhHans, stories: storiesZhHans },
      en: { apps: appsEn, movies: moviesEn, books: booksEn, collections: collectionsEn, stories: storiesEn },
    };
    return map[lang];
  }, [lang]);
}
