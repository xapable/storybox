/**
 * StoryBox batch importer — paste into browser console at https://storybox.work/
 * 
 * Steps:
 * 1. Sign in on the site
 * 2. Open DevTools (F12) → Console
 * 3. Paste this entire script and press Enter
 * 4. Call: await importBatch(data)
 *    (where data is your JSON array)
 */

async function importBatch(data) {
  const { initializeApp } = await import('https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js');
  const { getFirestore, doc, setDoc } = await import('https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js');
  const { getAuth } = await import('https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js');

  const config = {
    apiKey: "AIzaSyA4PJHlHJLNLcMAlTt3CMFNsFRYTlhWzgA",
    authDomain: "storybox-af3b7.firebaseapp.com",
    projectId: "storybox-af3b7",
    storageBucket: "storybox-af3b7.firebasestorage.app",
    messagingSenderId: "585520712722",
    appId: "1:585520712722:web:7fb37ef88e46cd97c4d03c"
  };

  const app = initializeApp(config, 'importer');
  const db = getFirestore(app);
  const auth = getAuth(app);

  // Wait for auth state
  const user = await new Promise((resolve) => {
    const unsub = auth.onAuthStateChanged((u) => { unsub(); resolve(u); });
    setTimeout(() => resolve(null), 5000);
  });

  if (!user) {
    // Try to use the existing app's auth by signing in anonymously
    const { signInAnonymously } = await import('https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js');
    try {
      await signInAnonymously(auth);
      console.log('✅ Signed in anonymously');
    } catch(e) {
      console.log('⚠️ Please sign in first on the site, then run again.');
      console.log('   Or paste this data directly into the importBatch() call.');
      return;
    }
  } else {
    console.log(`✅ Signed in as: ${user.email || 'anonymous'}`);
  }

  if (!Array.isArray(data)) {
    console.error('❌ data must be an array');
    return;
  }

  let total = 0, success = 0, fail = 0;

  for (let i = 0; i < data.length; i++) {
    const group = data[i];

    // Import story
    if (group.story) {
      const s = group.story;
      try {
        await setDoc(doc(db, 'apps', s.id), {
          title: s.title,
          description: s.description,
          category: s.category || '綜合',
          appType: 'story',
          storyContent: s.storyContent,
          createdBy: s.createdBy || '生活教育',
          creatorAvatar: s.creatorAvatar || '💰',
          tags: s.tags || [],
          isPublic: true,
          rating: 0, ratingCount: 0,
          views: '0', contentRating: '全年齡',
          reviews: [],
          version: '1.0.0', size: '10 MB',
          createdAt: new Date(),
        });
        total++; success++;
      } catch(e) { console.error(`❌ ${s.id}: ${e.message}`); fail++; }
    }

    // Import quizzes
    if (group.quizzes) {
      for (const q of group.quizzes) {
        try {
          await setDoc(doc(db, 'apps', q.id), {
            title: q.title,
            description: q.description,
            category: q.category || '綜合',
            appType: 't2q_quiz',
            t2qContent: q.t2qContent,
            createdBy: q.createdBy || '生活教育',
            creatorAvatar: q.creatorAvatar || '💰',
            tags: [],
            isPublic: true,
            rating: 0, ratingCount: 0,
            views: '0', contentRating: '全年齡',
            reviews: [],
            version: '1.0.0', size: '10 MB',
            createdAt: new Date(),
          });
          total++; success++;
        } catch(e) { console.error(`❌ ${q.id}: ${e.message}`); fail++; }
      }
    }

    if ((i + 1) % 10 === 0) {
      console.log(`📊 ${i + 1}/${data.length} groups processed (${success} ok, ${fail} fail)`);
      await new Promise(r => setTimeout(r, 200));
    }
  }

  console.log(`\n🎉 Done! ${success} imported, ${fail} failed`);
}
