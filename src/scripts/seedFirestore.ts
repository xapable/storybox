/**
 * Seed all data into Firestore — apps, stories, collections, and localized content.
 *
 * Usage: import and render <SeedButton /> in Settings (dev mode),
 *        or run in browser console:
 *          import('/src/scripts/seedFirestore.ts').then(m => m.seedFirestore())
 */

import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { playableApps, stories, collections } from '../data/playableApps';
import { appsEn } from '../data/content-en';
import { appsZhHans } from '../data/content-zhHans';
import { apps } from '../data/content';

/**
 * Seed all data into Firestore. Idempotent — safe to call repeatedly.
 */
export async function seedFirestore(): Promise<string> {
  if (!db) throw new Error('Firestore not available — check your .env');

  const logs: string[] = [];

  // ── 1. Apps (playable stories & quizzes) ──
  let appCount = 0;
  for (const app of playableApps) {
    const { id, reviews, ...data } = app;
    await setDoc(doc(db, 'apps', id), {
      ...data,
      createdAt: app.createdAt,
      isPublic: true,
      reviews: reviews ?? [],
    });
    appCount++;
  }
  logs.push(`✅ ${appCount} apps`);

  // ── 2. Stories (hero banners & circle items) ──
  let storyCount = 0;
  for (const story of stories) {
    await setDoc(doc(db, 'stories', story.id), story);
    storyCount++;
  }
  logs.push(`✅ ${storyCount} stories`);

  // ── 3. Collections ──
  let collCount = 0;
  for (const coll of collections) {
    await setDoc(doc(db, 'collections', coll.id), {
      ...coll,
      items: coll.items.map((item) => ({ id: item.id, title: item.title, appType: item.appType })),
    });
    collCount++;
  }
  logs.push(`✅ ${collCount} collections`);

  // ── 4. Firestore-localized content for multi-language ──
  // Write each locale's app list as a single document to keep reads simple
  const contentData = apps.map((a: any) => ({
    id: a.id, title: a.title, subtitle: a.subtitle, iconUrl: a.iconUrl,
    category: a.category, contentType: a.contentType, genre: a.genre,
    rating: a.rating, ratingCount: a.ratingCount, description: a.description,
    version: a.version, size: a.size, reviews: a.reviews,
  }));
  await setDoc(doc(db, 'content', 'apps_zhHant'), { apps: contentData });
  logs.push(`✅ content/apps_zhHant`);

  await setDoc(doc(db, 'content', 'apps_en'), {
    apps: appsEn.map((a: any) => ({
      id: a.id, title: a.title, subtitle: a.subtitle, iconUrl: a.iconUrl,
      category: a.category, contentType: a.contentType, genre: a.genre,
      rating: a.rating, ratingCount: a.ratingCount, description: a.description,
      version: a.version, size: a.size, reviews: a.reviews,
    })),
  });
  logs.push(`✅ content/apps_en`);

  await setDoc(doc(db, 'content', 'apps_zhHans'), {
    apps: appsZhHans.map((a: any) => ({
      id: a.id, title: a.title, subtitle: a.subtitle, iconUrl: a.iconUrl,
      category: a.category, contentType: a.contentType, genre: a.genre,
      rating: a.rating, ratingCount: a.ratingCount, description: a.description,
      version: a.version, size: a.size, reviews: a.reviews,
    })),
  });
  logs.push(`✅ content/apps_zhHans`);

  const msg = `✅  Seeded Firestore:\n${logs.join('\n')}`;
  console.log(msg);
  return msg;
}
