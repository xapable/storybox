import type { Content, Story, Collection } from '../types';

// Helper to generate placeholder icon URLs with a colored background
function icon(name: string, bg: string): string {
  const text = encodeURIComponent(name.slice(0, 2));
  return `https://placehold.co/128x128/${bg}/white?text=${text}&font=noto-sans`;
}

// ===== 氣候變遷與環保 (1–10) =====
const climate: Content[] = [
  {
    id: 'c1', title: '地球小幫手', subtitle: '學習隨手關燈、節約用水，用簡單行動保護地球', iconUrl: icon('地球', '4CAF50'),
    contentType: 'APP', category: '氣候變遷與環保', genre: ['環保', '生活'], rating: 4.8, ratingCount: 15200,
    description: '跟著地球小幫手一起學習日常生活中的環保小動作！從隨手關燈、節約用水到減少垃圾，每個小小的行動都能讓地球更健康。適合親子共學，用遊戲化的方式培養孩子的好習慣。',
    version: '2.1.0', size: '32 MB', action: { label: '免費下載' },
    reviews: [
      { id: 'c1r1', author: '小明的媽媽', rating: 5, title: '孩子學會主動關燈了！', content: '自從用了這個app，孩子每天睡前都會檢查有沒有關燈，還會提醒我們要省水，真的很棒！', date: '2024-11-20' },
      { id: 'c1r2', author: '王老師', rating: 5, title: '課堂上很好用', content: '我用在國小三年級的環保課，學生們都很喜歡互動遊戲的部分，學習效果很好。', date: '2024-10-15' },
    ],
  },
  {
    id: 'c2', title: '北極熊的家', subtitle: '認識全球暖化對北極和北極熊的影響', iconUrl: icon('北極', '2196F3'),
    contentType: 'APP', category: '氣候變遷與環保', genre: ['自然', '動物'], rating: 4.9, ratingCount: 8900,
    description: '跟著可愛的北極熊小白，認識全球暖化如何改變北極的生態環境。透過互動故事和動畫，了解冰層融化對北極熊家族的影響，啟發孩子關心地球的未來。',
    version: '1.8.0', size: '45 MB', action: { label: '免費下載' },
    reviews: [
      { id: 'c2r1', author: '阿嬤學員', rating: 5, title: '畫面很美，故事感人', content: '跟孫子一起看，看到北極熊沒有家可以住的時候，孫子都哭了。很好的教育app。', date: '2024-09-30' },
      { id: 'c2r2', author: '林爸爸', rating: 4, title: '內容很棒但稍短', content: '動畫品質很高，孩子很喜歡，但希望可以有更多章節和互動小遊戲。', date: '2024-08-22' },
    ],
  },
  {
    id: 'c3', title: '垃圾分類小教室', subtitle: '透過簡單遊戲，學習丟垃圾、回收和堆肥', iconUrl: icon('分類', 'FF9800'),
    contentType: 'APP', category: '氣候變遷與環保', genre: ['環保', '遊戲'], rating: 4.7, ratingCount: 21300,
    description: '把垃圾分類變成好玩的遊戲！拖曳不同的垃圾到正確的垃圾桶中，學習一般垃圾、資源回收、廚餘堆肥的分類方法。內建台灣各縣市的垃圾分類規則，實用又有趣。',
    version: '3.0.1', size: '28 MB', action: { label: '免費下載' },
    reviews: [
      { id: 'c3r1', author: '張媽媽', rating: 5, title: '現在分類都不會錯了', content: '以前常常搞不清楚什麼該回收，玩了這個app之後，連小孩都會教我了！', date: '2024-12-01' },
    ],
  },
  {
    id: 'c4', title: '水滴的旅行', subtitle: '跟著小水滴認識水循環，學會珍惜每一滴水', iconUrl: icon('水滴', '03A9F4'),
    contentType: 'APP', category: '氣候變遷與環保', genre: ['自然', '科學'], rating: 4.6, ratingCount: 6700,
    description: '可愛的小水滴帶你從天空到海洋，從河流到雲端，認識水的循環旅程。透過互動動畫了解蒸發、凝結、降水的過程，學習為什麼要珍惜水資源。',
    version: '1.5.0', size: '38 MB', action: { label: '免費下載' },
    reviews: [
      { id: 'c4r1', author: '科學小老師', rating: 5, title: '自然課的好幫手', content: '搭配國小自然課使用，學生對水循環的理解更深刻了。動畫做得很生動。', date: '2024-10-08' },
    ],
  },
  {
    id: 'c5', title: '風車與太陽', subtitle: '認識風力發電與太陽能，了解乾淨的能源', iconUrl: icon('能源', 'FFC107'),
    contentType: 'APP', category: '氣候變遷與環保', genre: ['科學', '能源'], rating: 4.5, ratingCount: 5400,
    description: '風怎麼變成電？太陽能板怎麼工作？透過簡單的實驗模擬和動畫，認識再生能源的原理。了解為什麼我們要從燒煤、燒油轉向使用乾淨的風力和太陽能。',
    version: '2.0.0', size: '35 MB', action: { label: '免費下載' },
    reviews: [
      { id: 'c5r1', author: '能源小博士', rating: 4, title: '概念清楚易懂', content: '對小朋友來說，能源是很抽象的概念，但這個app用很簡單的方式解釋清楚了。', date: '2024-09-12' },
    ],
  },
  {
    id: 'c6', title: '小蜜蜂工作囉', subtitle: '為什麼蜜蜂很重要？認識花朵與食物的關係', iconUrl: icon('蜜蜂', 'FFEB3B'),
    contentType: 'APP', category: '氣候變遷與環保', genre: ['自然', '生態'], rating: 4.8, ratingCount: 11800,
    description: '小蜜蜂嗡嗡嗡，你知道我們吃的食物有三分之一要靠蜜蜂授粉嗎？跟著小蜜蜂一起飛舞在花叢間，認識蜜蜂對生態和食物鏈的重要性，以及蜜蜂減少的危機。',
    version: '1.3.0', size: '42 MB', action: { label: '免費下載' },
    reviews: [
      { id: 'c6r1', author: '花園阿姨', rating: 5, title: '蜜蜂真的很重要！', content: '看了這個app才知道蜜蜂這麼重要，我現在都在陽台種花，希望可以幫助蜜蜂。', date: '2024-11-05' },
    ],
  },
  {
    id: 'c7', title: '減塑生活好簡單', subtitle: '學習少用塑膠袋、自備水壺，讓海洋更乾淨', iconUrl: icon('減塑', '8BC34A'),
    contentType: 'APP', category: '氣候變遷與環保', genre: ['環保', '生活'], rating: 4.7, ratingCount: 9800,
    description: '每天我們用掉多少塑膠？這些塑膠去哪裡了？透過互動地圖看到塑膠垃圾對海洋的影響，學習簡單的減塑方法：自備購物袋、使用環保杯、拒用一次性餐具。',
    version: '2.3.0', size: '25 MB', action: { label: '免費下載' },
    reviews: [
      { id: 'c7r1', author: '海洋守護者', rating: 5, title: '看完立刻行動', content: '裡面的海洋塑膠照片讓我很震撼，現在出門一定自備環保袋和水壺。', date: '2024-10-20' },
    ],
  },
  {
    id: 'c8', title: '樹爺爺的呼吸', subtitle: '認識森林如何製造新鮮空氣', iconUrl: icon('樹木', '388E3C'),
    contentType: 'APP', category: '氣候變遷與環保', genre: ['自然', '生態'], rating: 4.6, ratingCount: 7200,
    description: '樹爺爺每天都在做什麼？原來樹木是地球的肺，吸收二氧化碳、吐出氧氣，還幫我們調節氣候。透過加速攝影看到一棵樹的成長過程，認識森林的重要性。',
    version: '1.2.0', size: '48 MB', action: { label: '免費下載' },
    reviews: [
      { id: 'c8r1', author: '森林系女孩', rating: 5, title: '好感動的內容', content: '樹木默默做了這麼多事情，我們真的要好好保護森林。孩子看完說要種一棵樹！', date: '2024-08-30' },
    ],
  },
  {
    id: 'c9', title: '熱熱的地球', subtitle: '認識溫室效應，就像地球穿了一件太厚的衣服', iconUrl: icon('溫室', 'F44336'),
    contentType: 'APP', category: '氣候變遷與環保', genre: ['科學', '氣候'], rating: 4.4, ratingCount: 6100,
    description: '為什麼地球越來越熱？用被子太厚的比喻，讓孩子輕鬆理解溫室效應的原理。認識二氧化碳從哪裡來，以及我們可以做什麼來幫助地球「降溫」。',
    version: '1.0.0', size: '30 MB', action: { label: '免費下載' },
    reviews: [
      { id: 'c9r1', author: '好奇寶寶', rating: 4, title: '比喻很生動', content: '用穿衣服來解釋溫室效應真的很聰明，連我阿嬤都聽懂了！', date: '2024-07-18' },
    ],
  },
  {
    id: 'c10', title: '小小農夫', subtitle: '認識食物從哪裡來，鼓勵多吃蔬菜、減少浪費', iconUrl: icon('農夫', '795548'),
    contentType: 'APP', category: '氣候變遷與環保', genre: ['生活', '飲食'], rating: 4.9, ratingCount: 13500,
    description: '你知道桌上的飯菜是怎麼來的嗎？從播種、澆水到收成，體驗農夫的辛苦。認識當季蔬菜水果，了解食物里程的概念，學會珍惜食物不浪費。',
    version: '2.5.0', size: '55 MB', action: { label: '免費下載' },
    reviews: [
      { id: 'c10r1', author: '陳奶奶', rating: 5, title: '孫子現在不挑食了', content: '以前孫子都不吃青菜，玩了這個app後，他說要像農夫一樣勇敢嘗試各種蔬菜。', date: '2024-11-28' },
      { id: 'c10r2', author: '小學老師', rating: 5, title: '食農教育好教材', content: '配合學校的食農教育課程使用，孩子對食物的來源有了更深的認識。', date: '2024-10-10' },
    ],
  },
];

// ===== 人工智慧與科技 (11–20) =====
const tech: Content[] = [
  {
    id: 't1', title: 'AI 好朋友', subtitle: '什麼是 AI？把它當成一個會學習的好幫手', iconUrl: icon('AI', '7C4DFF'),
    contentType: 'APP', category: '人工智慧與科技', genre: ['科技', 'AI'], rating: 4.7, ratingCount: 10200,
    description: 'AI 不是神祕的魔法，而是一個會學習、會幫忙的好朋友！用簡單的比喻和互動遊戲，讓孩子認識什麼是人工智慧，AI 怎麼學習新事物，以及 AI 在我們生活中的應用。',
    version: '1.4.0', size: '40 MB', action: { label: '免費下載' },
    reviews: [
      { id: 't1r1', author: '科技媽媽', rating: 5, title: '連我都學到很多', content: '本來想教孩子認識AI，結果我自己也學到很多。用很簡單的方式解釋複雜的概念。', date: '2024-11-10' },
      { id: 't1r2', author: '國中老師', rating: 5, title: '資訊課的入門教材', content: '拿來當國中資訊課的補充教材，學生反應很好，對AI不再感到害怕。', date: '2024-09-25' },
    ],
  },
  {
    id: 't2', title: '小幫手語音助理', subtitle: '認識手機裡的語音助理怎麼聽懂我們說的話', iconUrl: icon('語音', 'E040FB'),
    contentType: 'APP', category: '人工智慧與科技', genre: ['科技', '生活'], rating: 4.5, ratingCount: 7800,
    description: '嘿！手機怎麼聽得懂我們說話？透過互動示範，認識語音辨識的原理：聲音變成文字，文字變成指令。了解語音助理可以做什麼，以及使用上的安全小提醒。',
    version: '2.0.0', size: '28 MB', action: { label: '免費下載' },
    reviews: [
      { id: 't2r1', author: '聽障朋友', rating: 5, title: '語音辨識幫助很大', content: '這個app不只教孩子認識語音科技，也讓我更了解這些工具怎麼幫助像我這樣的聽障者。', date: '2024-10-05' },
    ],
  },
  {
    id: 't3', title: '照片裡的人是誰', subtitle: 'AI 怎麼認出人臉？認識圖像辨識', iconUrl: icon('辨識', '00BCD4'),
    contentType: 'APP', category: '人工智慧與科技', genre: ['科技', 'AI'], rating: 4.6, ratingCount: 6500,
    description: '手機為什麼可以認出你的臉？相簿怎麼知道哪張照片是你？用拼圖和找不同等遊戲，認識AI圖像辨識的基本原理，以及這項技術在日常生活中（解鎖手機、安檢、醫療）的應用。',
    version: '1.1.0', size: '35 MB', action: { label: '免費下載' },
    reviews: [
      { id: 't3r1', author: '攝影愛好者', rating: 4, title: '有趣但希望更多範例', content: '圖像辨識的遊戲很有趣，但希望能有更多真實世界的應用案例可以參考。', date: '2024-08-14' },
    ],
  },
  {
    id: 't4', title: '會推薦書的電腦', subtitle: '為什麼電腦知道你喜歡什麼？認識推薦系統', iconUrl: icon('推薦', 'FF6D00'),
    contentType: 'APP', category: '人工智慧與科技', genre: ['科技', '生活'], rating: 4.3, ratingCount: 4900,
    description: '網購的時候，為什麼網站總是推薦你喜歡的東西？影片平台怎麼知道你想看什麼？用簡單的配對遊戲，認識推薦系統如何根據你的喜好來推薦內容。',
    version: '1.0.0', size: '22 MB', action: { label: '免費下載' },
    reviews: [
      { id: 't4r1', author: '網購達人', rating: 4, title: '原來是這樣運作的', content: '一直很好奇為什麼推薦這麼準，原來背後是這樣的邏輯。小朋友也能理解的解釋。', date: '2024-07-20' },
    ],
  },
  {
    id: 't5', title: '機器人學畫畫', subtitle: 'AI 也可以畫圖，但你才是真正的藝術家', iconUrl: icon('畫畫', '9C27B0'),
    contentType: 'APP', category: '人工智慧與科技', genre: ['科技', '藝術'], rating: 4.8, ratingCount: 14100,
    description: 'AI可以畫出梵谷風格的星空？可以生成從未見過的奇幻生物？來玩玩AI繪圖工具，同時也拿起畫筆自己創作！認識AI繪圖的原理，以及為什麼真正的創意還是來自人類。',
    version: '3.0.0', size: '60 MB', action: { label: '免費下載' },
    reviews: [
      { id: 't5r1', author: '美術老師', rating: 5, title: 'AI與藝術的完美結合', content: '用這個app讓學生先玩AI繪圖再自己創作，效果超好！孩子們更懂得欣賞創作過程了。', date: '2024-12-03' },
      { id: 't5r2', author: '小小藝術家', rating: 5, title: '超好玩！', content: '我畫了一隻彩虹獨角獸，AI幫我把它變成了3D的！好好玩喔！', date: '2024-11-15' },
    ],
  },
  {
    id: 't6', title: '聰明打字機', subtitle: '打字時電腦怎麼幫你選下一個字？認識預測輸入', iconUrl: icon('打字', '607D8B'),
    contentType: 'APP', category: '人工智慧與科技', genre: ['科技', '語言'], rating: 4.2, ratingCount: 3800,
    description: '你有沒有發現打字的時候，手機會猜你接下來要打什麼字？這就是預測輸入！了解電腦如何根據你之前打的字來預測下一個字，以及這個技術如何幫助打字困難的人。',
    version: '1.0.0', size: '18 MB', action: { label: '免費下載' },
    reviews: [
      { id: 't6r1', author: '文字工作者', rating: 4, title: '很實用的知識', content: '每天打字都沒想過背後的原理，這個app讓我對日常科技有了新的認識。', date: '2024-06-30' },
    ],
  },
  {
    id: 't7', title: '自動駕駛小車', subtitle: '認識不用人開的車怎麼看到紅燈和行人', iconUrl: icon('自駕', '1E88E5'),
    contentType: 'APP', category: '人工智慧與科技', genre: ['科技', '交通'], rating: 4.9, ratingCount: 16500,
    description: '未來的車子可以自己開？自駕車怎麼看到紅綠燈、行人和其他車子？透過模擬駕駛遊戲，認識光達、攝影機和AI如何一起合作，讓車子安全地在路上行駛。',
    version: '2.2.0', size: '52 MB', action: { label: '免費下載' },
    reviews: [
      { id: 't7r1', author: '小車迷', rating: 5, title: '最喜歡的app！', content: '我每天都在玩模擬駕駛，學到好多關於自駕車的知識。以後我要當自駕車工程師！', date: '2024-12-05' },
      { id: 't7r2', author: '工程師爸爸', rating: 5, title: '內容很專業又不難懂', content: '我自己在自駕車產業工作，這個app的內容出乎意料地準確，但又讓小孩聽得懂。', date: '2024-10-18' },
    ],
  },
  {
    id: 't8', title: 'AI 醫生助手', subtitle: 'AI 怎麼幫助醫生看X光片？認識醫療科技', iconUrl: icon('醫療', 'E91E63'),
    contentType: 'APP', category: '人工智慧與科技', genre: ['科技', '醫療'], rating: 4.7, ratingCount: 9200,
    description: 'AI 可以幫助醫生更快、更準確地發現問題！了解AI如何分析X光片、心電圖和各種醫學影像，幫助醫生做出更好的診斷。認識科技如何讓醫療變得更進步。',
    version: '1.6.0', size: '38 MB', action: { label: '免費下載' },
    reviews: [
      { id: 't8r1', author: '護理師媽媽', rating: 5, title: '用孩子懂的語言介紹醫療科技', content: '我在醫院工作，這個app讓我可以跟孩子分享我的工作內容，他很感動。', date: '2024-09-08' },
    ],
  },
  {
    id: 't9', title: '機器人下棋', subtitle: '認識電腦怎麼學會下棋，但你還是可以贏它', iconUrl: icon('下棋', '5D4037'),
    contentType: 'APP', category: '人工智慧與科技', genre: ['科技', '遊戲'], rating: 4.4, ratingCount: 5600,
    description: '電腦是怎麼學會下棋的？從井字遊戲到象棋，認識AI如何透過「嘗試與錯誤」來學習策略。內建簡單的下棋遊戲，可以跟AI對戰，試試看你能不能打敗電腦！',
    version: '1.3.0', size: '30 MB', action: { label: '免費下載' },
    reviews: [
      { id: 't9r1', author: '圍棋小將', rating: 4, title: '很好玩但AI有點強', content: '學到很多關於AI下棋的知識，但初級的AI也太強了吧！希望可以有更簡單的模式。', date: '2024-08-05' },
    ],
  },
  {
    id: 't10', title: '說話翻譯機', subtitle: '為什麼手機可以把中文變成英文？認識機器翻譯', iconUrl: icon('翻譯', '26A69A'),
    contentType: 'APP', category: '人工智慧與科技', genre: ['科技', '語言'], rating: 4.6, ratingCount: 8100,
    description: '對著手機說中文，它就能翻譯成英文？機器翻譯是怎麼辦到的？透過簡單的示範和遊戲，認識AI翻譯的基本原理，以及為什麼有時候翻譯會出錯（很好笑的錯誤範例等你來發現）。',
    version: '2.1.0', size: '33 MB', action: { label: '免費下載' },
    reviews: [
      { id: 't10r1', author: '語言學習者', rating: 5, title: '翻譯失敗範例超好笑', content: '裡面的翻譯失敗案例讓我笑到不行，但也學到為什麼翻譯這麼難。很棒的app！', date: '2024-11-01' },
    ],
  },
];

// ===== 綜合知識與生活應用 (21–30) =====
const life: Content[] = [
  {
    id: 'l1', title: '手指點一點', subtitle: '學習怎麼用手指滑平板、點按鈕', iconUrl: icon('手指', 'FF5722'),
    contentType: 'APP', category: '綜合知識與生活應用', genre: ['生活', '長輩'], rating: 4.9, ratingCount: 23100,
    description: '專為長輩設計的平板操作入門課程！從開機、滑動、點選到放大縮小，一步一步帶著做。字體大、按鈕清楚，還有語音引導，讓不熟悉科技的長輩也能輕鬆上手。',
    version: '4.0.0', size: '20 MB', action: { label: '免費下載' },
    reviews: [
      { id: 'l1r1', author: '阿公學員', rating: 5, title: '我終於會用平板了！', content: '以前都不敢碰平板，怕弄壞。這個app一步一步教我，現在我會跟孫子視訊了，好開心！', date: '2024-12-06' },
      { id: 'l1r2', author: '社工小陳', rating: 5, title: '長輩數位教學必備', content: '在社區關懷據點用這個app教學，長輩們學得又快又好。語音引導的功能特別貼心。', date: '2024-10-22' },
    ],
  },
  {
    id: 'l2', title: '網路禮貌小學堂', subtitle: '在網路上保持禮貌與安全', iconUrl: icon('禮貌', '3F51B5'),
    contentType: 'APP', category: '綜合知識與生活應用', genre: ['生活', '安全'], rating: 4.5, ratingCount: 11400,
    description: '網路世界也要有禮貌！學習什麼是網路霸凌、為什麼不要隨便罵人、如何保護自己的個人資料。透過情境模擬，做出正確的選擇，成為一個有禮貌的網路公民。',
    version: '2.4.0', size: '27 MB', action: { label: '免費下載' },
    reviews: [
      { id: 'l2r1', author: '陳爸爸', rating: 5, title: '每個孩子都應該學', content: '網路禮貌比想像中重要。這個app用情境故事的方式教導，孩子很容易理解和記住。', date: '2024-11-12' },
      { id: 'l2r2', author: '中學生', rating: 4, title: '學到很多', content: '以前不知道在網路上罵人這麼嚴重，現在我會多想一下再發文。', date: '2024-09-20' },
    ],
  },
  {
    id: 'l3', title: '真假消息辨識器', subtitle: '判斷網路上哪些是真的、哪些是騙人的', iconUrl: icon('真假', 'FFC107'),
    contentType: 'APP', category: '綜合知識與生活應用', genre: ['生活', '媒體'], rating: 4.8, ratingCount: 18700,
    description: '網路上的消息都是真的嗎？學會用簡單的方法分辨假消息：檢查來源、比對其他報導、看看是不是在開玩笑。透過實際案例練習，成為厲害的假消息偵探！',
    version: '3.1.0', size: '24 MB', action: { label: '免費下載' },
    reviews: [
      { id: 'l3r1', author: '退休教師', rating: 5, title: '對抗假消息的利器', content: '我常在LINE收到奇怪的訊息，用了這個app之後，學會先查證再轉傳，不會再被騙了。', date: '2024-12-02' },
      { id: 'l3r2', author: '新聞系學生', rating: 5, title: '媒體識讀的入門好工具', content: '雖然是設計給一般大眾的，但新聞系的學生也學到很多。推薦給所有年齡層。', date: '2024-10-30' },
    ],
  },
  {
    id: 'l4', title: '我的第一本電子書', subtitle: '學會打開、翻頁、放大文字看書', iconUrl: icon('電子', '795548'),
    contentType: 'APP', category: '綜合知識與生活應用', genre: ['生活', '閱讀'], rating: 4.6, ratingCount: 9500,
    description: '電子書怎麼用？從下載、打開、翻頁到調整字體大小，一步一步帶你熟悉電子書的操作。內建幾本免費的童話故事和知識繪本，讓你邊學邊看！',
    version: '2.0.0', size: '42 MB', action: { label: '免費下載' },
    reviews: [
      { id: 'l4r1', author: '愛看書的阿嬤', rating: 5, title: '放大字體真的很好用', content: '眼睛不好，但電子書可以放大字體，我現在每天都會用手機看書，太方便了！', date: '2024-08-18' },
    ],
  },
  {
    id: 'l5', title: '祖孫一起學', subtitle: '兒童和長者可以一起玩的知識小測驗', iconUrl: icon('祖孫', 'E91E63'),
    contentType: 'APP', category: '綜合知識與生活應用', genre: ['生活', '家庭'], rating: 4.9, ratingCount: 25600,
    description: '跨世代共學的最佳工具！內建涵蓋環保、科技、生活常識的趣味問答題庫。阿公阿嬤分享人生智慧，孫子孫女教科技新知，一起學習、一起成長、一起歡笑。',
    version: '3.5.0', size: '35 MB', action: { label: '免費下載' },
    reviews: [
      { id: 'l5r1', author: '三代同堂', rating: 5, title: '我們家每週都玩', content: '週末的家庭時間，阿公、爸媽、小孩一起比賽回答問題，笑聲不斷，感情也變好了。', date: '2024-11-25' },
      { id: 'l5r2', author: '樂齡中心', rating: 5, title: '社區活動的最佳選擇', content: '在社區樂齡中心使用，長輩和志工一起玩，互動效果超好，長輩們都很期待每週的問答時間。', date: '2024-10-12' },
    ],
  },
  {
    id: 'l6', title: '氣象小學堂', subtitle: '認識晴天、雨天、颱風以及氣候變化', iconUrl: icon('氣象', '29B6F6'),
    contentType: 'APP', category: '綜合知識與生活應用', genre: ['自然', '科學'], rating: 4.4, ratingCount: 7200,
    description: '為什麼會下雨？颱風怎麼形成的？冷鋒和暖鋒是什麼？用簡單的動畫和互動實驗，認識天氣現象背後的科學原理，學會看懂氣象預報，成為家裡的氣象小專家。',
    version: '1.7.0', size: '40 MB', action: { label: '免費下載' },
    reviews: [
      { id: 'l6r1', author: '自然老師', rating: 4, title: '天氣單元的好教材', content: '在國小自然課使用，學生對高低氣壓和鋒面的理解明顯提升。希望能增加地震相關內容。', date: '2024-07-15' },
    ],
  },
  {
    id: 'l7', title: '動物好朋友', subtitle: '認識瀕危動物，知道為什麼要保護牠們', iconUrl: icon('動物', '8D6E63'),
    contentType: 'APP', category: '綜合知識與生活應用', genre: ['自然', '動物'], rating: 4.8, ratingCount: 19800,
    description: '認識世界各地的瀕危動物：台灣黑熊、石虎、櫻花鉤吻鮭，還有非洲大象、北極熊、海龜。了解牠們為什麼需要保護，以及我們可以怎麼幫忙。每隻動物都有可愛的動畫和叫聲喔！',
    version: '2.8.0', size: '65 MB', action: { label: '免費下載' },
    reviews: [
      { id: 'l7r1', author: '動物園志工', rating: 5, title: '內容詳實又可愛', content: '裡面的動物資訊很準確，插畫也很可愛。我用來跟參觀動物園的小朋友互動，效果很好。', date: '2024-11-08' },
      { id: 'l7r2', author: '小動物迷', rating: 5, title: '認識好多台灣特有種', content: '原來台灣有這麼多特別的動物！我最喜歡石虎，牠好可愛，我一定要好好保護牠。', date: '2024-09-15' },
    ],
  },
  {
    id: 'l8', title: '樹木的年齡', subtitle: '怎麼看樹的年輪？認識自然時間的概念', iconUrl: icon('年輪', '6D4C41'),
    contentType: 'APP', category: '綜合知識與生活應用', genre: ['自然', '科學'], rating: 4.3, ratingCount: 4100,
    description: '砍下來的樹幹上有一圈一圈的紋路，那就是年輪！每一圈代表一歲，寬窄還透露了當年的氣候狀況。用放大鏡工具探索年輪的祕密，了解樹木如何記錄時間和歷史。',
    version: '1.0.0', size: '28 MB', action: { label: '免費下載' },
    reviews: [
      { id: 'l8r1', author: '森林學系學生', rating: 4, title: '簡單但專業', content: '年輪學的入門好工具，如果能有更多不同樹種的年輪照片就更好了。', date: '2024-06-25' },
    ],
  },
  {
    id: 'l9', title: '聲音博物館', subtitle: '認識不同的聲音：鳥叫、風、雨、機器聲', iconUrl: icon('聲音', 'FF7043'),
    contentType: 'APP', category: '綜合知識與生活應用', genre: ['自然', '藝術'], rating: 4.6, ratingCount: 8500,
    description: '閉上眼睛，用耳朵來探索世界！收錄上百種聲音：森林的鳥鳴、海浪拍打、城市車聲、廚房炒菜聲。玩聲音猜謎遊戲，還可以錄下自己身邊的聲音，建立屬於你的聲音博物館。',
    version: '2.0.0', size: '58 MB', action: { label: '免費下載' },
    reviews: [
      { id: 'l9r1', author: '視障朋友', rating: 5, title: '用聲音認識世界', content: '這個app讓我可以用另一種方式跟孩子分享聲音的美好。錄音功能特別棒！', date: '2024-10-05' },
      { id: 'l9r2', author: '音樂老師', rating: 5, title: '聽覺訓練好工具', content: '用來訓練學生的聽覺辨識能力，聲音猜謎的遊戲讓他們玩得欲罷不能。', date: '2024-08-28' },
    ],
  },
  {
    id: 'l10', title: '快樂記憶卡', subtitle: '用翻牌配對遊戲複習氣候與AI小知識', iconUrl: icon('記憶', 'AB47BC'),
    contentType: 'APP', category: '綜合知識與生活應用', genre: ['遊戲', '學習'], rating: 4.7, ratingCount: 16200,
    description: '翻牌配對遊戲加上知識複習！翻開兩張卡片，看看是不是同一組。配對成功後會跳出相關的小知識。涵蓋氣候變遷、AI科技、生活常識等主題，邊玩邊學，記憶更深刻。',
    version: '3.2.0', size: '30 MB', action: { label: '免費下載' },
    reviews: [
      { id: 'l10r1', author: '遊戲達人', rating: 5, title: '學習跟遊戲完美結合', content: '本來只是玩遊戲，不知不覺就記住了好多環保和AI的知識。關卡設計很有挑戰性。', date: '2024-11-30' },
      { id: 'l10r2', author: '補習班老師', rating: 5, title: '課堂複習用超棒', content: '當作課堂複習的小遊戲，學生們都搶著要玩，學習效果比考試還好！', date: '2024-10-15' },
    ],
  },
];

// ===== Exports =====
export const apps: Content[] = [...climate, ...tech, ...life];

export const movies: Content[] = [];
export const books: Content[] = [];

// ===== Collections =====
const allSorted = [...climate, ...tech, ...life].sort((a, b) => (b.ratingCount ?? 0) - (a.ratingCount ?? 0));

export const collections: Collection[] = [
  { id: 'col-topsell', title: '暢銷排行榜', subtitle: '本週最受歡迎的知識內容', type: 'APP', items: allSorted.slice(0, 6) },
  { id: 'col-1', title: '熱門推薦', subtitle: '最多人下載的知識App', type: 'APP', items: [climate[0], tech[6], life[4], life[0], climate[5], tech[4]] },
  { id: 'col-2', title: '氣候變遷與環保', subtitle: '學習保護地球的十堂課', type: 'APP', items: climate.slice(0, 5) },
  { id: 'col-3', title: '人工智慧與科技', subtitle: '認識AI和未來科技', type: 'APP', items: tech.slice(0, 5) },
  { id: 'col-4', title: '綜合知識與生活', subtitle: '生活必備的小知識', type: 'APP', items: life.slice(0, 5) },
];

// ===== Stories =====
export const stories: Story[] = [
  {
    id: 'story-1', title: '認識氣候變遷', subtitle: '十個好玩又重要的環保知識', legend: '熱門主題',
    imageUrl: 'https://placehold.co/600x300/4CAF50/white?text=🌍+氣候變遷',
    backgroundColor: '#4CAF50', hero: true, date: '2024-12-01', content: climate[0],
  },
  {
    id: 'story-2', title: 'AI 是什麼？', subtitle: '用最簡單的方式認識人工智慧', legend: '科技入門',
    imageUrl: 'https://placehold.co/600x300/7C4DFF/white?text=🤖+AI+入門',
    backgroundColor: '#7C4DFF', hero: true, date: '2024-12-03', content: tech[0],
  },
  {
    id: 'story-3', title: '祖孫共學最好玩', subtitle: '跨世代一起學習的新方式', legend: '家庭推薦',
    imageUrl: 'https://placehold.co/600x300/E91E63/white?text=👨‍👩‍👧‍👦+祖孫共學',
    backgroundColor: '#E91E63', hero: true, date: '2024-12-05', content: life[4],
  },
  {
    id: 'story-4', title: '小蜜蜂工作囉', subtitle: '蜜蜂對地球有多重要？', imageUrl: 'https://placehold.co/128x128/FFEB3B/white?text=🐝', backgroundColor: '#FFEB3B', date: '2024-12-02', content: climate[5] },
  {
    id: 'story-5', title: '自動駕駛小車', subtitle: '未來交通大解密', imageUrl: 'https://placehold.co/128x128/1E88E5/white?text=🚗', backgroundColor: '#1E88E5', date: '2024-12-04', content: tech[6] },
  {
    id: 'story-6', title: '手指點一點', subtitle: '長輩平板入門課', imageUrl: 'https://placehold.co/128x128/FF5722/white?text=👆', backgroundColor: '#FF5722', date: '2024-12-06', content: life[0] },
];
