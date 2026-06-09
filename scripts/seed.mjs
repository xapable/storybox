/**
 * Seed script — pushes all demo data to Firestore using the Firebase client SDK.
 * Run: node scripts/seed.mjs
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyA4umClbTE22yHIuRcQY43YE8dW5nDrSp4',
  authDomain: 'storybox-af3b7.firebaseapp.com',
  projectId: 'storybox-af3b7',
  storageBucket: 'storybox-af3b7.firebasestorage.app',
  messagingSenderId: '585520712722',
  appId: '1:585520712722:web:9b60619694632281d75ccb',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ── Playable Apps (stories & quizzes) ──
const apps = [
  {
    id: 'play-c1', title: '地球小幫手', description: '學習隨手關燈、節約用水，用簡單行動保護地球',
    thumbnail: '', appType: 'story', category: '環保',
    rating: 4.8, ratingCount: 15200, version: '2.1.0', size: '32 MB', downloads: '15.2K+', contentRating: '全年齡',
    reviews: [
      { id: 'r1', author: '小明的媽媽', rating: 5, title: '孩子學會主動關燈了！', content: '自從用了這個app，孩子每天睡前都會檢查有沒有關燈，還會提醒我們要省水，真的很棒！', date: '2024-11-20' },
      { id: 'r2', author: '王老師', rating: 5, title: '課堂上很好用', content: '我用在國小三年級的環保課，學生們都很喜歡互動遊戲的部分，學習效果很好。', date: '2024-10-15' },
    ],
    storyContent: '大家好，我是地球小幫手！\n今天我們要學習怎麼愛護地球。\n你知道嗎？隨手關燈可以省下很多電喔！\n離開房間的時候，記得把燈關掉。\n洗手的時候，水不要開太大。\n搓肥皂的時候，先把水龍頭關起來。\n垃圾要記得分類。\n寶特瓶和紙張可以回收再利用。\n廚餘可以做成堆肥，讓植物長得更好。\n少用塑膠袋，帶自己的購物袋出門。\n每一個小小的行動，都能讓地球更健康！\n你也是地球小幫手喔！',
    createdAt: new Date('2024-11-01'), createdBy: 'system', isPublic: true,
  },
  {
    id: 'play-c2', title: '北極熊的家', description: '認識全球暖化對北極和北極熊的影響',
    thumbnail: '', appType: 'story', category: '自然',
    rating: 4.9, ratingCount: 8900, version: '1.8.0', size: '45 MB', downloads: '8.9K+', contentRating: '全年齡',
    reviews: [
      { id: 'r3', author: '阿嬤學員', rating: 5, title: '畫面很美，故事感人', content: '跟孫子一起看，看到北極熊沒有家可以住的時候，孫子都哭了。很好的教育app。', date: '2024-09-30' },
      { id: 'r4', author: '林爸爸', rating: 4, title: '內容很棒但稍短', content: '動畫品質很高，孩子很喜歡，但希望可以有更多章節。', date: '2024-08-22' },
    ],
    storyContent: '在遙遠的北極，住著北極熊小白和牠的家人。\n北極好冷好冷，到處都是白色的冰雪。\n小白最喜歡在冰上玩耍了。\n但是最近，小白發現一件奇怪的事。\n冰塊變得越來越薄了！\n有些地方的冰甚至不見了，變成了海水。\n媽媽說，因為地球越來越熱，冰才會融化。\n小白好擔心：沒有冰，我們要住在哪裡呢？\n北極熊需要冰才能抓海豹吃。\n沒有冰，就沒有食物了。\n小朋友，我們可以幫忙小白！\n隨手關燈、少開冷氣、多種樹木。\n讓我們一起保護北極熊的家！',
    createdAt: new Date('2024-10-15'), createdBy: 'system', isPublic: true,
  },
  {
    id: 'play-c6', title: '小蜜蜂工作囉', description: '為什麼蜜蜂很重要？認識花朵與食物的關係',
    thumbnail: '', appType: 'story', category: '生態',
    rating: 4.8, ratingCount: 11800, version: '1.5.0', size: '42 MB', downloads: '11.8K+', contentRating: '全年齡',
    reviews: [{ id: 'r5', author: '花園小園丁', rating: 5, title: '蜜蜂真的好重要', content: '原來我們吃的食物都要感謝蜜蜂！學到好多。', date: '2024-11-30' }],
    storyContent: '嗡嗡嗡～我是小蜜蜂，今天好忙喔！\n我要去拜訪好多花朵朋友。\n首先飛到紅色的玫瑰花那裡。\n玫瑰姐姐好香喔，我幫她傳花粉！\n然後飛到黃色的向日葵那裡。\n向日葵長得好高，像太陽一樣。\n你知道嗎？蜜蜂幫忙傳花粉，植物才能結果實。\n我們吃的蘋果、草莓、番茄，都要謝謝蜜蜂！\n如果沒有蜜蜂，很多水果和蔬菜就長不出來了。\n所以蜜蜂真的很重要喔！\n可是現在蜜蜂越來越少了。\n農藥會傷害蜜蜂，花朵也變少了。\n我們可以在陽台種一些小花。\n不使用農藥，給蜜蜂一個安全的家。\n嗡嗡嗡～謝謝你愛護蜜蜂！',
    createdAt: new Date('2024-12-01'), createdBy: 'system', isPublic: true,
  },
  {
    id: 'play-c3', title: '垃圾分類小教室', description: '透過簡單遊戲，學習丟垃圾、回收和堆肥',
    thumbnail: '', appType: 't2q_quiz', category: '環保',
    rating: 4.7, ratingCount: 21300, version: '3.0.1', size: '28 MB', downloads: '21.3K+', contentRating: '全年齡',
    reviews: [{ id: 'r6', author: '張媽媽', rating: 5, title: '現在分類都不會錯了', content: '以前常常搞不清楚什麼該回收，玩了這個app之後，連小孩都會教我了！', date: '2024-12-01' }],
    t2qContent: '> 老師: 同學們，今天我們來學習垃圾分類！\n> 老師: 你知道垃圾可以分成幾類嗎？\n\n? 垃圾主要可以分成幾大類？\n1) 2 類\n2) 3 類\n3) 4 類\n4) 5 類\n= 3\n\n> 老師: 沒錯！一般垃圾、資源回收、廚餘堆肥。\n> 老師: 我們來看看各種垃圾怎麼分類。\n\n? 寶特瓶應該丟到哪一類？\n1) 一般垃圾\n2) 資源回收\n3) 廚餘堆肥\n= 2\n\n> 老師: 很好！寶特瓶可以回收做成新瓶子。\n\n? 吃剩的蘋果核應該丟到哪一類？\n1) 一般垃圾\n2) 資源回收\n3) 廚餘堆肥\n= 3\n\n> 老師: 對！廚餘可以變成肥料。\n\n? 用過的衛生紙應該丟到哪一類？\n1) 一般垃圾\n2) 資源回收\n3) 廚餘堆肥\n= 1\n\n> 老師: 衛生紙不能回收喔！\n> 老師: 大家都學會了嗎？一起愛護地球吧！',
    createdAt: new Date('2024-11-20'), createdBy: 'system', isPublic: true,
  },
  {
    id: 'play-c4', title: '水滴的旅行', description: '跟著小水滴認識水循環，學會珍惜每一滴水',
    thumbnail: '', appType: 't2q_quiz', category: '科學',
    rating: 4.6, ratingCount: 6700, version: '1.5.0', size: '38 MB', downloads: '6.7K+', contentRating: '全年齡',
    reviews: [{ id: 'rc4', author: '科學小老師', rating: 5, title: '自然課的好幫手', content: '搭配國小自然課使用，學生對水循環的理解更深刻了。動畫做得很生動。', date: '2024-10-08' }],
    t2qContent: '> 水滴: 大家好！我是一顆小水滴。\n> 水滴: 想跟我一起去旅行嗎？\n\n? 水變成水蒸氣升到天空的過程叫做什麼？\n1) 凝結\n2) 蒸發\n3) 降水\n= 2\n\n> 水滴: 太陽照在我身上，我就變成水蒸氣飛上天了！\n\n? 天上的水蒸氣變成雲的過程叫做什麼？\n1) 蒸發\n2) 凝結\n3) 融化\n= 2\n\n> 水滴: 我們好多小水滴聚在一起就變成雲了。\n\n? 雲裡的水滴變成雨落下來的過程叫做什麼？\n1) 降水\n2) 蒸發\n3) 凝結\n= 1\n\n> 水滴: 然後我又回到地面，開始新的旅行！\n\n? 我們應該如何珍惜水資源？\n1) 洗手時水開很大\n2) 刷牙時讓水一直流\n3) 洗澡用蓮蓬頭不要泡澡\n= 3\n\n> 水滴: 謝謝你珍惜我，我們下次見！',
    createdAt: new Date('2024-10-08'), createdBy: 'system', isPublic: true,
  },
  {
    id: 'play-ai1', title: 'AI 是什麼？', description: '用最簡單的方式認識人工智慧',
    thumbnail: '', appType: 't2q_quiz', category: '科技',
    rating: 4.8, ratingCount: 16200, version: '2.2.0', size: '42 MB', downloads: '16.2K+', contentRating: '全年齡',
    reviews: [{ id: 'rai1', author: 'AI小達人', rating: 5, title: '原來AI不難', content: '用最簡單的方式解釋AI，連我都懂了！', date: '2025-01-15' }],
    t2qContent: '> 機器人: 大家好！我是 AI 助教！\n> 機器人: 你聽過人工智慧嗎？\n\n? AI 是什麼的縮寫？\n1) Automatic Intelligence\n2) Artificial Intelligence\n3) Advanced Internet\n= 2\n\n> 機器人: 沒錯！AI 就是 Artificial Intelligence。\n\n? AI 可以做以下哪些事情？\n1) 認出照片裡的貓\n2) 跟人下圍棋\n3) 幫忙翻譯語言\n4) 以上皆是\n= 4\n\n> 機器人: AI 超厲害的！它需要學習才會變聰明。\n\n? AI 是怎麼學習的？\n1) 從大量資料中找規律\n2) 天生就會\n3) 有人直接告訴它所有答案\n= 1\n\n> 機器人: AI 看過很多張貓的照片，就知道貓長什麼樣子。\n\n? AI 可以做什麼幫助人類？\n1) 幫忙診斷疾病\n2) 自動駕駛汽車\n3) 寫功課\n4) 1 和 2\n= 4\n\n> 機器人: AI 是很棒的工具，但也要好好使用喔！',
    createdAt: new Date('2025-01-15'), createdBy: 'system', isPublic: true,
  },
  {
    id: 'play-c5', title: '風車與太陽', description: '認識風力發電與太陽能，了解乾淨的能源',
    thumbnail: '', appType: 't2q_quiz', category: '能源',
    rating: 4.5, ratingCount: 5400, version: '2.0.0', size: '35 MB', downloads: '5.4K+', contentRating: '全年齡',
    reviews: [{ id: 'rc5', author: '能源小博士', rating: 4, title: '概念清楚易懂', content: '對小朋友來說，能源是很抽象的概念，但這個app用很簡單的方式解釋清楚了。', date: '2024-09-12' }],
    t2qContent: '> 能源博士: 小朋友，你知道電從哪裡來嗎？\n\n? 傳統的發電方式主要燒什麼來發電？\n1) 木頭\n2) 煤炭\n3) 水\n= 2\n\n> 能源博士: 燒煤炭會排放二氧化碳，讓地球變熱。\n\n? 以下哪一種是乾淨的再生能源？\n1) 風力發電\n2) 太陽能發電\n3) 以上皆是\n= 3\n\n> 能源博士: 風可以把大風車吹動來發電！\n\n? 太陽能板可以將太陽光轉換成什麼？\n1) 熱水\n2) 電力\n3) 風力\n= 2\n\n> 能源博士: 再生能源用完還會再生，不會傷害地球。\n\n? 為什麼要多用再生能源？\n1) 減少空氣污染\n2) 減緩全球暖化\n3) 保護地球\n4) 以上皆是\n= 4\n\n> 能源博士: 地球的未來就靠我們了！',
    createdAt: new Date('2024-09-12'), createdBy: 'system', isPublic: true,
  },
  {
    id: 'play-auto', title: '自動駕駛小車', description: '認識AI如何讓車子自動駕駛',
    thumbnail: '', appType: 't2q_quiz', category: '科技',
    rating: 4.6, ratingCount: 9200, version: '2.2.0', size: '52 MB', downloads: '9.2K+', contentRating: '全年齡',
    reviews: [{ id: 'rauto', author: '未來工程師', rating: 5, title: '超酷的科技', content: '原來自動駕駛需要這麼多感應器和AI！', date: '2025-02-20' }],
    t2qContent: '> 工程師: 你有想過車子可以自己開嗎？\n\n? 自動駕駛汽車用什麼來「看」路？\n1) 攝影機和感應器\n2) 望遠鏡\n3) 放大鏡\n= 1\n\n> 工程師: 車上有好多攝影機，像眼睛一樣！\n\n? 自動駕駛需要用到什麼技術？\n1) 人工智慧\n2) GPS 定位\n3) 感應器\n4) 以上皆是\n= 4\n\n> 工程師: AI 會判斷紅綠燈、行人和其他車子。\n\n? 自動駕駛最重要的目標是什麼？\n1) 開得最快\n2) 安全第一\n3) 省油\n= 2\n\n> 工程師: 安全永遠是最重要的！\n\n? 目前大部分自動駕駛車可以做到什麼？\n1) 完全不用人\n2) 輔助駕駛\n3) 飛上天\n= 2\n\n> 工程師: 未來也許真的可以完全自動駕駛喔！',
    createdAt: new Date('2025-02-20'), createdBy: 'system', isPublic: true,
  },
  {
    id: 'play-c7', title: '減塑生活好簡單', description: '學習少用塑膠袋、自備水壺，讓海洋更乾淨',
    thumbnail: '', appType: 't2q_quiz', category: '環保',
    rating: 4.7, ratingCount: 9800, version: '2.0.0', size: '25 MB', downloads: '9.8K+', contentRating: '全年齡',
    reviews: [{ id: 'r7', author: '海洋守護者', rating: 5, title: '孩子不再用塑膠袋', content: '現在去超市都會提醒我要帶購物袋！', date: '2024-11-10' }],
    t2qContent: '> 海龜: 大家好，我是一隻海龜！\n> 海龜: 你知道嗎？海洋裡有好多塑膠垃圾。\n\n? 為什麼塑膠對海洋生物很危險？\n1) 動物會誤食\n2) 動物會被纏住\n3) 以上皆是\n= 3\n\n> 海龜: 我差點把塑膠袋當成水母吃下去！\n\n? 我們可以做什麼來減少塑膠？\n1) 自備購物袋\n2) 帶自己的水壺\n3) 不用塑膠吸管\n4) 以上皆是\n= 4\n\n> 海龜: 小小的改變，大大的幫助！\n\n? 一個塑膠袋在海洋裡多久才會分解？\n1) 1 年\n2) 10 年\n3) 超過 100 年\n= 3\n\n> 海龜: 讓我們一起保護海洋吧！',
    createdAt: new Date('2024-11-10'), createdBy: 'system', isPublic: true,
  },
  {
    id: 'play-c8', title: '樹爺爺的呼吸', description: '認識森林如何製造新鮮空氣',
    thumbnail: '', appType: 'story', category: '自然',
    rating: 4.6, ratingCount: 7200, version: '1.3.0', size: '48 MB', downloads: '7.2K+', contentRating: '全年齡',
    reviews: [{ id: 'r8', author: '森林系女孩', rating: 5, title: '好感動的內容', content: '樹木默默做了這麼多事情，我們真的要好好保護森林。孩子看完說要種一棵樹！', date: '2024-08-30' }],
    storyContent: '大家好，我是一棵老樹，大家都叫我樹爺爺。\n我住在森林裡已經一百年了。\n你們知道嗎？我每天都在幫忙製造新鮮的空氣喔！\n我吸收二氧化碳，吐出氧氣。\n人類和動物都需要氧氣才能呼吸。\n沒有樹木，空氣會變得很糟糕。\n我還可以讓天氣變涼爽。\n樹蔭下的溫度比馬路上低好幾度呢！\n下雨的時候，我的根會抓住泥土。\n這樣才不會有土石流。\n很多小動物也住在森林裡。\n小鳥在樹上築巢，松鼠在樹洞裡睡覺。\n但是現在森林越來越少了。\n人們砍掉樹木，蓋房子和馬路。\n請你們多多種樹，保護森林！\n讓我們一起讓地球更美麗。',
    createdAt: new Date('2024-08-30'), createdBy: 'system', isPublic: true,
  },
  {
    id: 'play-c9', title: '熱熱的地球', description: '認識溫室效應，就像地球穿了一件太厚的衣服',
    thumbnail: '', appType: 'story', category: '氣候',
    rating: 4.4, ratingCount: 6100, version: '1.2.0', size: '30 MB', downloads: '6.1K+', contentRating: '全年齡',
    reviews: [{ id: 'r9', author: '地球小尖兵', rating: 4, title: '比喻很生動', content: '用穿衣服來解釋溫室效應，孩子一下就懂了。', date: '2024-07-15' }],
    storyContent: '小朋友，你有沒有覺得夏天越來越熱了？\n不只是台灣變熱，整個地球都在發燒！\n為什麼呢？因為溫室效應變嚴重了。\n想像地球穿了一件外套。\n這件外套叫做大氣層。\n大氣層裡的溫室氣體像外套一樣。\n幫地球保暖，讓地球不會太冷。\n可是人類燃燒太多煤炭和石油。\n排放太多二氧化碳到空氣中。\n就像讓地球穿了太多件外套！\n地球太熱了，就開始發燒。\n北極的冰塊融化，海平面上升。\n天氣也變得很奇怪。\n有時候大旱災，有時候大洪水。\n我們可以怎麼幫忙呢？\n多走路、騎腳踏車，少開車。\n節約用電，隨手關燈。\n多吃蔬菜，少吃肉。\n讓我們一起幫地球退燒吧！',
    createdAt: new Date('2024-07-15'), createdBy: 'system', isPublic: true,
  },
  {
    id: 'play-c10', title: '小小農夫', description: '認識食物從哪裡來，鼓勵多吃蔬菜、減少浪費',
    thumbnail: '', appType: 't2q_quiz', category: '生活',
    rating: 4.9, ratingCount: 13500, version: '2.5.0', size: '55 MB', downloads: '13.5K+', contentRating: '全年齡',
    reviews: [{ id: 'r10', author: '開心農場', rating: 5, title: '孩子開始吃青菜了', content: '認識食物來源後，孩子對蔬菜更有興趣了！', date: '2024-11-25' }],
    t2qContent: '> 農夫: 歡迎來到我的菜園！\n> 農夫: 你知道你吃的食物從哪裡來嗎？\n\n? 番茄是長在樹上還是地上？\n1) 樹上\n2) 藤蔓上\n3) 地下\n= 2\n\n> 農夫: 番茄是爬藤植物，需要架子支撐！\n\n? 紅蘿蔔吃的部分是什麼？\n1) 葉子\n2) 根\n3) 果實\n= 2\n\n> 農夫: 對！我們吃的是紅蘿蔔的根。\n\n? 為什麼不要浪費食物？\n1) 種食物很辛苦\n2) 浪費會產生垃圾\n3) 很多人沒有足夠食物\n4) 以上皆是\n= 4\n\n> 農夫: 珍惜食物就是珍惜地球！',
    createdAt: new Date('2024-11-25'), createdBy: 'system', isPublic: true,
  },
];

// ── Stories (hero banners & circles) ──
const stories = [
  { id: 'story-1', title: '認識氣候變遷', subtitle: '十個好玩又重要的環保知識', legend: '🌍 環保', backgroundColor: '#4CAF50', hero: true, date: '2024-12-01', appId: 'play-c1', appType: 'story' },
  { id: 'story-2', title: 'AI 是什麼？', subtitle: '用最簡單的方式認識人工智慧', legend: '🤖 科技', backgroundColor: '#7C4DFF', hero: true, date: '2024-12-03', appId: 'play-ai1', appType: 't2q_quiz' },
  { id: 'story-3', title: '祖孫共學最好玩', subtitle: '跨世代一起學習的新方式', legend: '👨‍👩‍👧‍👦 家庭', backgroundColor: '#E91E63', hero: true, date: '2024-12-05', appId: 'play-l5', appType: 't2q_quiz' },
  { id: 'story-4', title: '機器人學畫畫', subtitle: 'AI可以畫圖，但你是真正的藝術家', legend: '🎨 創意', backgroundColor: '#9C27B0', hero: true, date: '2025-01-10', appId: 'play-t5', appType: 'story' },
  { id: 'story-5', title: '動物好朋友', subtitle: '認識台灣的瀕危動物', legend: '🐾 自然', backgroundColor: '#8D6E63', hero: true, date: '2025-02-15', appId: 'play-l7', appType: 'story' },
  { id: 'story-6', title: '小蜜蜂工作囉', subtitle: '蜜蜂對地球有多重要？', legend: '🐝 生態', backgroundColor: '#FFEB3B', hero: true, date: '2024-12-02', appId: 'play-c6', appType: 'story' },
  { id: 'story-7', title: '自動駕駛小車', subtitle: '未來交通大解密', legend: '🚗 未來', backgroundColor: '#1E88E5', hero: true, date: '2024-12-04', appId: 'play-auto', appType: 't2q_quiz' },
];

async function seed() {
  console.log('🌱 Seeding Firestore...\n');

  let count = 0;
  for (const app of apps) {
    const { id, ...data } = app;
    await setDoc(doc(db, 'apps', id), {
      ...data,
      createdAt: app.createdAt,
      isPublic: true,
      createdBy: 'system',
    });
    count++;
    console.log(`  ✓ apps/${id} — ${app.title}`);
  }

  for (const story of stories) {
    await setDoc(doc(db, 'stories', story.id), story);
    count++;
    console.log(`  ✓ stories/${story.id} — ${story.title}`);
  }

  console.log(`\n✅  Done! Seeded ${count} documents.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
