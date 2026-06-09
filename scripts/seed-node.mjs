/**
 * Node.js seed script — uses Firebase Admin SDK to seed Firestore.
 * Run: node scripts/seed-node.mjs
 */
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Admin SDK
const serviceAccount = {
  projectId: 'storybox-af3b7',
};

const app = initializeApp({ projectId: 'storybox-af3b7' });
const db = getFirestore(app);

// Parse the .env file for Firebase config
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '..', '.env');
const envContent = readFileSync(envPath, 'utf-8');
const envVars = {};
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^=]+)=(.+)$/);
  if (match) envVars[match[1]] = match[2].trim();
}

// Import the data from the existing file
// We need to read the ts file — let's inline the data
const appsData = [
  // play-c1
  { id: 'play-c1', title: '地球小幫手', description: '學習隨手關燈、節約用水，用簡單行動保護地球', appType: 'story', rating: 4.8, ratingCount: 15200, category: '環保', isPublic: true, createdBy: 'system', downloads: '15.2K+', contentRating: '全年齡', version: '2.1.0', size: '32 MB', storyContent: '大家好，我是地球小幫手！\n今天我們要學習怎麼愛護地球。\n你知道嗎？隨手關燈可以省下很多電喔！\n離開房間的時候，記得把燈關掉。\n洗手的時候，水不要開太大。\n搓肥皂的時候，先把水龍頭關起來。\n垃圾要記得分類。\n寶特瓶和紙張可以回收再利用。\n廚餘可以做成堆肥，讓植物長得更好。\n少用塑膠袋，帶自己的購物袋出門。\n每一個小小的行動，都能讓地球更健康！\n你也是地球小幫手喔！', createdAt: new Date('2024-11-01'), reviews: [{ id: 'r1', author: '小明的媽媽', rating: 5, title: '孩子學會主動關燈了！', content: '自從用了這個app，孩子每天睡前都會檢查有沒有關燈，還會提醒我們要省水，真的很棒！', date: '2024-11-20' }, { id: 'r2', author: '王老師', rating: 5, title: '課堂上很好用', content: '我用在國小三年級的環保課，學生們都很喜歡互動遊戲的部分，學習效果很好。', date: '2024-10-15' }] },
  // play-c2
  { id: 'play-c2', title: '北極熊的家', description: '認識全球暖化對北極和北極熊的影響', appType: 'story', rating: 4.9, ratingCount: 8900, category: '自然', isPublic: true, createdBy: 'system', downloads: '8.9K+', contentRating: '全年齡', version: '1.8.0', size: '45 MB', storyContent: '在遙遠的北極，住著北極熊小白和牠的家人。\n北極好冷好冷，到處都是白色的冰雪。\n小白最喜歡在冰上玩耍了。\n但是最近，小白發現一件奇怪的事。\n冰塊變得越來越薄了！\n有些地方的冰甚至不見了，變成了海水。\n媽媽說，因為地球越來越熱，冰才會融化。\n小白好擔心：沒有冰，我們要住在哪裡呢？\n北極熊需要冰才能抓海豹吃。\n沒有冰，就沒有食物了。\n小朋友，我們可以幫忙小白！\n隨手關燈、少開冷氣、多種樹木。\n讓我們一起保護北極熊的家！', createdAt: new Date('2024-10-15'), reviews: [{ id: 'r3', author: '阿嬤學員', rating: 5, title: '畫面很美，故事感人', content: '跟孫子一起看，看到北極熊沒有家可以住的時候，孫子都哭了。很好的教育app。', date: '2024-09-30' }, { id: 'r4', author: '林爸爸', rating: 4, title: '內容很棒但稍短', content: '動畫品質很高，孩子很喜歡，但希望可以有更多章節。', date: '2024-08-22' }] },
  // play-c6
  { id: 'play-c6', title: '小蜜蜂工作囉', description: '為什麼蜜蜂很重要？認識花朵與食物的關係', appType: 'story', rating: 4.8, ratingCount: 11800, category: '生態', isPublic: true, createdBy: 'system', downloads: '11.8K+', contentRating: '全年齡', version: '1.5.0', size: '42 MB', storyContent: '嗡嗡嗡～我是小蜜蜂，今天好忙喔！\n我要去拜訪好多花朵朋友。\n首先飛到紅色的玫瑰花那裡。\n玫瑰姐姐好香喔，我幫她傳花粉！\n然後飛到黃色的向日葵那裡。\n向日葵長得好高，像太陽一樣。\n你知道嗎？蜜蜂幫忙傳花粉，植物才能結果實。\n我們吃的蘋果、草莓、番茄，都要謝謝蜜蜂！\n如果沒有蜜蜂，很多水果和蔬菜就長不出來了。\n所以蜜蜂真的很重要喔！\n可是現在蜜蜂越來越少了。\n農藥會傷害蜜蜂，花朵也變少了。\n我們可以在陽台種一些小花。\n不使用農藥，給蜜蜂一個安全的家。\n嗡嗡嗡～謝謝你愛護蜜蜂！', createdAt: new Date('2024-12-01'), reviews: [{ id: 'r5', author: '花園小園丁', rating: 5, title: '蜜蜂真的好重要', content: '原來我們吃的食物都要感謝蜜蜂！學到好多。', date: '2024-11-30' }] },
];

async function seed() {
  let count = 0;
  for (const app of appsData) {
    const { id, ...data } = app;
    await db.collection('apps').doc(id).set({
      ...data,
      createdAt: data.createdAt,
      createdAtTimestamp: data.createdAt,
    });
    count++;
    console.log(`✅ ${id}`);
  }
  console.log(`\n✅ ${count} apps seeded`);
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
