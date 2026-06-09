export type Lang = 'zh-Hant' | 'zh-Hans' | 'en';

export const langLabels: Record<Lang, string> = {
  'zh-Hant': '繁體中文',
  'zh-Hans': '简体中文',
  en: 'English',
};

type TranslationMap = Record<string, Record<Lang, string>>;

const t: TranslationMap = {
  // Tab bar
  tab_home:        { 'zh-Hant': '首頁',     'zh-Hans': '首页',     en: 'Home' },
  tab_search:      { 'zh-Hant': '搜尋',     'zh-Hans': '搜索',     en: 'Search' },
  tab_explore:     { 'zh-Hant': '探索',     'zh-Hans': '探索',     en: 'Explore' },
  tab_apps:        { 'zh-Hant': '應用',     'zh-Hans': '应用',     en: 'Apps' },
  tab_setting:     { 'zh-Hant': '設定',     'zh-Hans': '设置',     en: 'Setting' },

  // Home screen
  home_search_placeholder: { 'zh-Hant': '搜尋知識內容⋯', 'zh-Hans': '搜索知识内容⋯', en: 'Search knowledge content…' },

  // Search screen
  search_placeholder: { 'zh-Hant': '搜尋知識內容⋯', 'zh-Hans': '搜索知识内容⋯', en: 'Search knowledge content…' },
  search_empty:       { 'zh-Hant': '搜尋你最喜歡的知識內容', 'zh-Hans': '搜索你最喜欢的知识内容', en: 'Search your favorite knowledge content' },
  search_no_results:  { 'zh-Hant': '找不到「{query}」的相關內容', 'zh-Hans': '找不到"{query}"的相关内容', en: 'No results for "{query}"' },

  // Explore / Apps screen titles
  screen_explore: { 'zh-Hant': '探索', 'zh-Hans': '探索', en: 'Explore' },
  screen_apps:    { 'zh-Hant': '應用', 'zh-Hans': '应用', en: 'Apps' },
  screen_setting: { 'zh-Hant': '設定', 'zh-Hans': '设置', en: 'Setting' },

  // Detail page
  detail_badge:         { 'zh-Hant': '知識', 'zh-Hans': '知识', en: 'Knowledge' },
  detail_wishlist:      { 'zh-Hant': '加入收藏', 'zh-Hans': '加入收藏', en: 'Add to favorites' },
  detail_whats_new:     { 'zh-Hant': '最新更新', 'zh-Hans': '最新更新', en: "What's new" },
  detail_about:         { 'zh-Hant': '關於這個知識內容', 'zh-Hans': '关于这个知识内容', en: 'About this knowledge' },
  detail_app_info:      { 'zh-Hant': '應用資訊', 'zh-Hans': '应用信息', en: 'App info' },
  detail_ratings:       { 'zh-Hant': '評分與評論', 'zh-Hans': '评分与评论', en: 'Ratings & reviews' },
  detail_version:       { 'zh-Hant': '版本', 'zh-Hans': '版本', en: 'Version' },
  detail_size:          { 'zh-Hant': '大小', 'zh-Hans': '大小', en: 'Size' },
  detail_downloads:     { 'zh-Hant': '下載次數', 'zh-Hans': '下载次数', en: 'Downloads' },
  detail_rating:        { 'zh-Hant': '內容分級', 'zh-Hans': '内容分级', en: 'Content rating' },
  detail_everyone:      { 'zh-Hant': '全年齡', 'zh-Hans': '全年龄', en: 'Everyone' },
  detail_ratings_count: { 'zh-Hant': '{count} 則評分', 'zh-Hans': '{count} 则评分', en: '{count} ratings' },
  detail_reviews_count: { 'zh-Hant': '{count} 則評論', 'zh-Hans': '{count} 则评论', en: '{count} reviews' },
  detail_show_all:      { 'zh-Hant': '查看全部 {count} 則評論', 'zh-Hans': '查看全部 {count} 则评论', en: 'See all {count} reviews' },
  detail_show_less:     { 'zh-Hant': '收起評論', 'zh-Hans': '收起评论', en: 'Show fewer reviews' },

  // Content card
  card_free:    { 'zh-Hant': '免費下載', 'zh-Hans': '免费下载', en: 'Free' },
  card_install: { 'zh-Hant': '免費下載', 'zh-Hans': '免费下载', en: 'Free' },

  // App
  app_name: { 'zh-Hant': 'StoryBox 知識盒子', 'zh-Hans': 'StoryBox 知识盒子', en: 'StoryBox Knowledge Box' },

  // Settings
  setting_general:     { 'zh-Hant': '一般', 'zh-Hans': '一般', en: 'General' },
  setting_language:    { 'zh-Hant': '語言', 'zh-Hans': '语言', en: 'Language' },
  setting_notif:       { 'zh-Hant': '通知', 'zh-Hans': '通知', en: 'Notifications' },
  setting_appearance:  { 'zh-Hant': '外觀', 'zh-Hans': '外观', en: 'Appearance' },
  setting_google_acct: { 'zh-Hant': 'Google 帳戶', 'zh-Hans': 'Google 账户', en: 'Google Account' },
  setting_payment:     { 'zh-Hant': '付款方式', 'zh-Hans': '付款方式', en: 'Payment methods' },
  setting_account:     { 'zh-Hant': '帳戶', 'zh-Hans': '账户', en: 'Account' },
  setting_about:       { 'zh-Hant': '關於', 'zh-Hans': '关于', en: 'About' },
  setting_privacy:     { 'zh-Hant': '隱私政策', 'zh-Hans': '隐私政策', en: 'Privacy Policy' },
  setting_terms:       { 'zh-Hant': '服務條款', 'zh-Hans': '服务条款', en: 'Terms of Service' },
  setting_version:     { 'zh-Hant': '版本', 'zh-Hans': '版本', en: 'Version' },

  // Collections
  col_topsell:     { 'zh-Hant': '暢銷排行榜', 'zh-Hans': '畅销排行榜', en: 'Top Selling' },
  col_topsell_sub: { 'zh-Hant': '本週最受歡迎的知識內容', 'zh-Hans': '本周最受欢迎的知识内容', en: 'Most popular this week' },
  col_hot:       { 'zh-Hant': '熱門推薦', 'zh-Hans': '热门推荐', en: 'Popular' },
  col_hot_sub:   { 'zh-Hant': '最多人下載的知識App', 'zh-Hans': '最多人下载的知识App', en: 'Most downloaded knowledge apps' },
  col_climate:   { 'zh-Hant': '氣候變遷與環保', 'zh-Hans': '气候变化与环保', en: 'Climate & Environment' },
  col_climate_sub: { 'zh-Hant': '學習保護地球的十堂課', 'zh-Hans': '学习保护地球的十堂课', en: 'Ten lessons to protect our planet' },
  col_ai:        { 'zh-Hant': '人工智慧與科技', 'zh-Hans': '人工智能与科技', en: 'AI & Technology' },
  col_ai_sub:    { 'zh-Hant': '認識AI和未來科技', 'zh-Hans': '认识AI和未来科技', en: 'Learn AI & future tech' },
  col_life:      { 'zh-Hant': '綜合知識與生活', 'zh-Hans': '综合知识与生活', en: 'Knowledge & Life' },
  col_life_sub:  { 'zh-Hant': '生活必備的小知識', 'zh-Hans': '生活必备的小知识', en: 'Essential life knowledge' },
  col_see_all:   { 'zh-Hant': '查看全部', 'zh-Hans': '查看全部', en: 'See all' },

  // Stories
  story_hot:    { 'zh-Hant': '熱門主題', 'zh-Hans': '热门主题', en: 'Hot Topic' },
  story_tech:   { 'zh-Hant': '科技入門', 'zh-Hans': '科技入门', en: 'Tech Intro' },
  story_family: { 'zh-Hant': '家庭推薦', 'zh-Hans': '家庭推荐', en: 'Family Pick' },
};

export function tKey(key: string, lang: Lang): string {
  const entry = t[key];
  if (!entry) return key;
  return entry[lang] ?? entry['zh-Hant'] ?? key;
}

export function tReplace(key: string, lang: Lang, vars: Record<string, string | number>): string {
  let str = tKey(key, lang);
  for (const [k, v] of Object.entries(vars)) {
    str = str.replace(`{${k}}`, String(v));
  }
  return str;
}
