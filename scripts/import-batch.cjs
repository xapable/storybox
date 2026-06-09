/**
 * Firestore bulk import using firebase-admin (CJS)
 * Run from the functions/ directory.
 * 
 * Usage: node scripts/import-batch.cjs <path-to-json>
 */
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize with explicit project ID
admin.initializeApp({
  projectId: 'storybox-af3b7',
  // If GOOGLE_APPLICATION_CREDENTIALS is not set, try firebase login
});

// Try to get credentials from firebase CLI
async function getDb() {
  // Check if we can use application default
  try {
    return admin.firestore();
  } catch(e) {
    // Fallback: try to get token from firebase CLI
    const { execSync } = require('child_process');
    try {
      const token = execSync('npx firebase-tools@latest login:ci --no-localhost 2>&1 | grep -o "FIREBASE_TOKEN=[a-zA-Z0-9_-]*" || npx firebase-tools@latest login --no-localhost 2>&1', { timeout: 10000 }).toString();
      console.log('Got token');
    } catch(e2) {
      console.error('Cannot authenticate. Set GOOGLE_APPLICATION_CREDENTIALS or run firebase login');
      process.exit(1);
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: node scripts/import-batch.cjs <path-to-json>');
    process.exit(1);
  }
  
  const filePath = path.resolve(process.cwd(), args[0]);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(raw);
  if (!Array.isArray(data)) throw new Error('Root must be an array');
  
  const db = admin.firestore();
  
  // Detect format
  const hasStoryWrapper = data.length > 0 && data[0].story;
  const apps = [];
  if (hasStoryWrapper) {
    for (const group of data) {
      if (group.story) apps.push(group.story);
      if (group.quizzes) {
        for (const q of group.quizzes) apps.push(q);
      }
    }
  } else {
    apps.push(...data);
  }
  
  console.log(`📦 ${apps.length} apps to import`);
  
  let success = 0, fail = 0;
  const batch = db.batch();
  let opCount = 0;
  
  for (const app of apps) {
    const appId = app.id;
    if (!appId) { fail++; continue; }
    
    const docData = {
      title: app.title,
      description: app.description,
      category: app.category || '綜合',
      appType: app.appType,
      createdBy: app.createdBy || '生活教育',
      creatorAvatar: app.creatorAvatar || '💰',
      tags: app.tags || [],
      isPublic: true,
      rating: 0, ratingCount: 0,
      views: '0', contentRating: '全年齡',
      reviews: [],
      version: '1.0.0', size: '10 MB',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    
    if (app.appType === 'story') docData.storyContent = app.storyContent;
    else docData.t2qContent = app.t2qContent;
    
    batch.set(db.collection('apps').doc(appId), docData);
    opCount++;
    
    // Firestore batch limit is 500
    if (opCount >= 500) {
      await batch.commit();
      success += opCount;
      console.log(`✅ Committed ${success} docs`);
      opCount = 0;
    }
  }
  
  if (opCount > 0) {
    await batch.commit();
    success += opCount;
  }
  
  console.log(`\n🎉 Done! ${success} imported, ${fail} failed`);
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });
