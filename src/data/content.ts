// All app data lives in playableApps.ts — this file re-exports
export { movies, books, collections, stories } from './playableApps';
export const apps: never[] = []; // apps now served from playableApps directly
