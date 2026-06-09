/**
 * StoryBox Import CLI
 *
 * Bulk-import stories and quizzes from a JSON file into Firestore
 * using the Firestore REST API (no firebase-admin needed).
 *
 * Usage:
 *   npx tsx scripts/importFirestore.ts <path-to-json-file>
 *
 * Examples:
 *   npx tsx scripts/importFirestore.ts scripts/samples/batch-500.json
 *   npx tsx scripts/importFirestore.ts scripts/import-sample.json
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

const PROJECT_ID = 'storybox-af3b7';

interface ImportApp {
  id?: string;
  title: string;
  description: string;
  appType: 'story' | 't2q_quiz';
  storyContent?: string;
  t2qContent?: string;
  category?: string;
  createdBy?: string;
  creatorAvatar?: string;
  thumbnail?: string;
  version?: string;
  size?: string;
  tags?: string[];
}

// ── Validation ──

function validate(app: ImportApp, index: number): string[] {
  const errors: string[] = [];
  if (!app.title) errors.push(`[${index}] Missing "title"`);
  if (!app.description) errors.push(`[${index}] Missing "description"`);
  if (!app.appType) errors.push(`[${index}] Missing "appType"`);
  if (!['story', 't2q_quiz'].includes(app.appType)) {
    errors.push(`[${index}] "appType" must be "story" or "t2q_quiz", got "${app.appType}"`);
  }
  if (app.appType === 'story' && !app.storyContent) {
    errors.push(`[${index}] Story app missing "storyContent"`);
  }
  if (app.appType === 't2q_quiz' && !app.t2qContent) {
    errors.push(`[${index}] Quiz app missing "t2qContent"`);
  }
  return errors;
}

// ── Firestore REST API ──

async function importDocument(docId: string, data: Record<string, any>): Promise<void> {
  // Use PATCH with the doc ID in the path (Firestore REST API)
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/apps/${docId}`;

  const fields: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    fields[key] = toFirestoreValue(value);
  }

  const body = { fields };

  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => 'unknown');
    throw new Error(`HTTP ${res.status}: ${errText.slice(0, 200)}`);
  }
}

function toFirestoreValue(value: any): any {
  if (value === null || value === undefined) return { nullValue: null };
  if (typeof value === 'string') return { stringValue: value };
  if (typeof value === 'number') {
    if (Number.isInteger(value)) return { integerValue: String(value) };
    return { doubleValue: value };
  }
  if (typeof value === 'boolean') return { booleanValue: value };
  if (value instanceof Date) return { timestampValue: value.toISOString() };
  if (Array.isArray(value)) {
    return { arrayValue: { values: value.map(toFirestoreValue) } };
  }
  if (typeof value === 'object') {
    const fields: Record<string, any> = {};
    for (const [k, v] of Object.entries(value)) {
      fields[k] = toFirestoreValue(v);
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(value) };
}

// ── Main ──

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('❌ Usage: npx tsx scripts/importFirestore.ts <path-to-json>');
    console.error('   Example: npx tsx scripts/importFirestore.ts scripts/samples/batch-500.json');
    process.exit(1);
  }

  const filePath = resolve(process.cwd(), args[0]);
  console.log(`📂 Reading: ${filePath}\n`);

  let rawData: any[];
  try {
    const raw = readFileSync(filePath, 'utf-8');
    rawData = JSON.parse(raw);
    if (!Array.isArray(rawData)) throw new Error('Root must be an array');
  } catch (err: any) {
    console.error(`❌ Failed to parse JSON: ${err.message}`);
    process.exit(1);
  }

  // Detect format: [{story, quizzes}] or flat [{id, title, appType, ...}]
  const hasStoryWrapper = rawData.length > 0 && rawData[0].story;
  const apps: any[] = [];

  if (hasStoryWrapper) {
    for (const group of rawData) {
      if (group.story) apps.push(group.story);
      if (group.quizzes) {
        for (const q of group.quizzes) apps.push(q);
      }
    }
  } else {
    apps.push(...rawData);
  }

  console.log(`📦 Found ${apps.length} app(s) to import (format: ${hasStoryWrapper ? 'story+quiz groups' : 'flat'})\n`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < apps.length; i++) {
    const app = apps[i];
    const errors = validate(app, i);

    if (errors.length > 0) {
      console.error(`❌ [${i}] "${app.title || '(no title)'}" — validation failed:`);
      errors.forEach((e) => console.error(`     ${e}`));
      failCount++;
      continue;
    }

    const appId = app.id || app.title.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-').replace(/^-+|-+$/g, '') + '-' + Date.now();

    const docData: Record<string, any> = {
      title: app.title,
      description: app.description,
      appType: app.appType,
      category: app.category || '綜合',
      createdBy: app.createdBy || 'StoryBox 編輯室',
      creatorAvatar: app.creatorAvatar || '📦',
      thumbnail: app.thumbnail || '',
      version: app.version || '1.0.0',
      size: app.size || '10 MB',
      tags: app.tags || [],
      isPublic: true,
      rating: 0,
      ratingCount: 0,
      views: '0',
      contentRating: '全年齡',
      reviews: [],
      createdAt: new Date(),
    };

    if (app.appType === 'story') {
      docData.storyContent = app.storyContent;
    } else {
      docData.t2qContent = app.t2qContent;
    }

    try {
      await importDocument(appId, docData);
      console.log(`✅ [${i + 1}/${apps.length}] "${app.title}" → ${appId}`);
      successCount++;
    } catch (err: any) {
      console.error(`❌ [${i + 1}/${apps.length}] "${app.title}" — ${err.message}`);
      failCount++;
    }
  }

  console.log(`\n📊 Results: ${successCount} imported, ${failCount} failed`);
}

main().catch((err) => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
