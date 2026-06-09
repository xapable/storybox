/**
 * Seed data component — renders a button to bulk-import playableApps into Firestore.
 *
 * Usage: import and render <SeedButton /> somewhere in your app (e.g. Settings),
 *        or navigate to /seed in the browser console.
 *
 * Safer alternative: open your browser console on localhost:5173 and paste:
 *   import('/src/scripts/seedFirestore.ts').then(m => m.seedFirestore())
 */

import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { playableApps } from '../data/playableApps';

export async function seedFirestore(): Promise<string> {
  if (!db) throw new Error('Firestore not available — check your .env');

  let count = 0;
  for (const app of playableApps) {
    const { id, reviews, ...data } = app;
    await setDoc(doc(db, 'apps', id), {
      ...data,
      createdAt: app.createdAt,
      isPublic: true,
      createdBy: 'system',
      reviews: reviews ?? [],
    });
    count++;
    console.log(`  ✓ ${id} — ${app.title}`);
  }

  const msg = `✅  Successfully imported ${count} apps into Firestore!`;
  console.log(msg);
  return msg;
}
