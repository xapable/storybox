import { useMemo } from 'react';
import { apps, movies, books, collections, stories } from './content';

/** Single source of truth for all static content (movies, books, collections, stories) */
export function useContent() {
  return useMemo(() => ({
    apps, movies, books, collections, stories,
  }), []);
}
