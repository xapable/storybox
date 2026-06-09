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
  apps_search_placeholder: { 'zh-Hant': '搜尋應用⋯', 'zh-Hans': '搜索应用⋯', en: 'Search apps…' },
  apps_search_no_results:  { 'zh-Hant': '找不到符合的應用', 'zh-Hans': '找不到符合的应用', en: 'No matching apps found' },
  explore_popular: { 'zh-Hant': '熱門知識應用排行', 'zh-Hans': '热门知识应用排行', en: 'Popular knowledge apps' },
  explore_hot:     { 'zh-Hant': '🔥 熱門', 'zh-Hans': '🔥 热门', en: '🔥 Hot' },
  explore_all_apps: { 'zh-Hant': '所有應用', 'zh-Hans': '所有应用', en: 'All apps' },

  // Detail page
  detail_badge:         { 'zh-Hant': '知識', 'zh-Hans': '知识', en: 'Knowledge' },
  detail_wishlist:      { 'zh-Hant': '加入收藏', 'zh-Hans': '加入收藏', en: 'Add to favorites' },
  detail_favorited:     { 'zh-Hant': '已收藏', 'zh-Hans': '已收藏', en: 'Favorited' },
  detail_whats_new:     { 'zh-Hant': '最新更新', 'zh-Hans': '最新更新', en: "What's new" },
  detail_about:         { 'zh-Hant': '關於這個知識內容', 'zh-Hans': '关于这个知识内容', en: 'About this knowledge' },
  detail_app_info:      { 'zh-Hant': '應用資訊', 'zh-Hans': '应用信息', en: 'App info' },
  detail_ratings:       { 'zh-Hant': '評分與評論', 'zh-Hans': '评分与评论', en: 'Ratings & reviews' },
  detail_version:       { 'zh-Hant': '版本', 'zh-Hans': '版本', en: 'Version' },
  detail_size:          { 'zh-Hant': '大小', 'zh-Hans': '大小', en: 'Size' },
  detail_views:     { 'zh-Hant': '瀏覽次數', 'zh-Hans': '浏览次数', en: 'Views' },
  detail_creator:   { 'zh-Hant': '創作者', 'zh-Hans': '创作者', en: 'Creator' },
  detail_rating:        { 'zh-Hant': '內容分級', 'zh-Hans': '内容分级', en: 'Content rating' },
  detail_everyone:      { 'zh-Hant': '全年齡', 'zh-Hans': '全年龄', en: 'Everyone' },
  detail_ratings_count: { 'zh-Hant': '{count} 則評分', 'zh-Hans': '{count} 则评分', en: '{count} ratings' },
  detail_reviews_count: { 'zh-Hant': '{count} 則評論', 'zh-Hans': '{count} 则评论', en: '{count} reviews' },
  detail_show_all:      { 'zh-Hant': '查看全部 {count} 則評論', 'zh-Hans': '查看全部 {count} 则评论', en: 'See all {count} reviews' },
  detail_show_less:     { 'zh-Hant': '收起評論', 'zh-Hans': '收起评论', en: 'Show fewer reviews' },

  // Content card
  card_free:    { 'zh-Hant': '查看', 'zh-Hans': '查看', en: 'View' },
  card_install: { 'zh-Hant': '查看', 'zh-Hans': '查看', en: 'View' },
  card_play:    { 'zh-Hant': '玩', 'zh-Hans': '玩', en: 'Play' },
  card_read:    { 'zh-Hant': '閱讀', 'zh-Hans': '阅读', en: 'Read' },
  card_quiz:    { 'zh-Hant': '測驗', 'zh-Hans': '测验', en: 'Quiz' },
  card_story:   { 'zh-Hant': '故事', 'zh-Hans': '故事', en: 'Story' },
  card_type_quiz:  { 'zh-Hant': 'T2Q 測驗', 'zh-Hans': 'T2Q 测验', en: 'T2Q Quiz' },
  card_type_story: { 'zh-Hant': '故事', 'zh-Hans': '故事', en: 'Story' },
  // Detail
  detail_play_quiz: { 'zh-Hant': '玩測驗', 'zh-Hans': '玩测验', en: 'Play Quiz' },
  detail_read_story: { 'zh-Hant': '閱讀故事', 'zh-Hans': '阅读故事', en: 'Read Story' },

  // T2Q Player
  player_correct:    { 'zh-Hant': '答對了！', 'zh-Hans': '答对了！', en: 'Correct!' },
  player_wrong:      { 'zh-Hant': '答錯了！正確答案：', 'zh-Hans': '答错了！正确答案：', en: 'Wrong! Correct answer: ' },
  player_continue:   { 'zh-Hant': '繼續', 'zh-Hans': '继续', en: 'Continue' },
  player_prev:       { 'zh-Hant': '上一頁', 'zh-Hans': '上一页', en: 'Prev' },
  player_score_short: { 'zh-Hant': '得分：', 'zh-Hans': '得分：', en: 'Score:' },
  player_finish_title: { 'zh-Hant': '測驗完成！', 'zh-Hans': '测验完成！', en: 'Quiz Complete!' },
  player_score:      { 'zh-Hant': '你答對了 {score} 題，共 {total} 題', 'zh-Hans': '你答对了 {score} 题，共 {total} 题', en: 'You got {score} out of {total} correct' },
  player_loading:     { 'zh-Hant': '載入中⋯', 'zh-Hans': '加载中⋯', en: 'Loading...' },
  player_tap_continue: { 'zh-Hant': '點擊繼續 →', 'zh-Hans': '点击继续 →', en: 'Tap to continue →' },
  player_tap_finish:  { 'zh-Hant': '點擊完成', 'zh-Hans': '点击完成', en: 'Tap to finish' },
  player_no_content: { 'zh-Hant': '沒有內容可顯示', 'zh-Hans': '没有内容可显示', en: 'No content to display' },
  player_play_again: { 'zh-Hant': '再玩一次', 'zh-Hans': '再玩一次', en: 'Play Again' },
  player_read_again: { 'zh-Hant': '再讀一次', 'zh-Hans': '再读一次', en: 'Read Again' },
  player_rate:       { 'zh-Hant': '評分', 'zh-Hans': '评分', en: 'Rate' },
  player_back:       { 'zh-Hant': '← 返回', 'zh-Hans': '← 返回', en: '← Back' },

  // App
  app_name: { 'zh-Hant': 'StoryBox 知識盒子', 'zh-Hans': 'StoryBox 知识盒子', en: 'StoryBox Knowledge Box' },

  // Settings
  setting_general:     { 'zh-Hant': '一般', 'zh-Hans': '一般', en: 'General' },
  setting_language:    { 'zh-Hant': '語言', 'zh-Hans': '语言', en: 'Language' },
  setting_notif:       { 'zh-Hant': '通知', 'zh-Hans': '通知', en: 'Notifications' },
  setting_appearance:  { 'zh-Hant': '外觀', 'zh-Hans': '外观', en: 'Appearance' },
  setting_myapps:      { 'zh-Hant': '我的應用', 'zh-Hans': '我的应用', en: 'My Apps' },
  setting_favorites:   { 'zh-Hant': '已收藏', 'zh-Hans': '已收藏', en: 'Favorites' },
  setting_no_favorites: { 'zh-Hant': '還沒有收藏任何內容', 'zh-Hans': '还没有收藏任何内容', en: 'No favorites yet' },
  setting_create_app:  { 'zh-Hant': '+ 建立新應用', 'zh-Hans': '+ 创建新应用', en: '+ Create App' },
  setting_no_apps:     { 'zh-Hant': '還沒有應用，建立你的第一個吧！', 'zh-Hans': '还没有应用，创建你的第一个吧！', en: 'No apps yet. Create your first one!' },
  setting_google_acct:     { 'zh-Hant': 'Google 帳戶', 'zh-Hans': 'Google 账户', en: 'Google Account' },
  setting_sign_in:         { 'zh-Hant': '登入 Google', 'zh-Hans': '登录 Google', en: 'Sign in with Google' },
  setting_sign_out:        { 'zh-Hant': '登出', 'zh-Hans': '登出', en: 'Sign out' },
  setting_sign_in_to_create: { 'zh-Hant': '登入後即可建立應用', 'zh-Hans': '登录后即可创建应用', en: 'Sign in to create apps' },

  // Creator
  creator_title_new:   { 'zh-Hant': '建立新應用', 'zh-Hans': '创建新应用', en: 'Create New App' },
  creator_title_edit:  { 'zh-Hant': '編輯應用', 'zh-Hans': '编辑应用', en: 'Edit App' },
  creator_field_title: { 'zh-Hant': '標題', 'zh-Hans': '标题', en: 'Title' },
  creator_field_desc:  { 'zh-Hant': '描述', 'zh-Hans': '描述', en: 'Description' },
  creator_field_thumb: { 'zh-Hant': '縮圖上傳 (1:1)', 'zh-Hans': '缩图上传 (1:1)', en: 'Thumbnail (1:1)' },
  creator_field_type:  { 'zh-Hant': '應用類型', 'zh-Hans': '应用类型', en: 'App Type' },
  creator_type_story:  { 'zh-Hant': '故事', 'zh-Hans': '故事', en: 'Story' },
  creator_type_quiz:   { 'zh-Hant': 'T2Q 測驗', 'zh-Hans': 'T2Q 测验', en: 'T2Q Quiz' },
  creator_field_content_story: { 'zh-Hant': '故事內容', 'zh-Hans': '故事内容', en: 'Story Content' },
  creator_field_content_quiz:  { 'zh-Hant': 'T2Q 內容', 'zh-Hans': 'T2Q 内容', en: 'T2Q Content' },
  creator_hint_quiz:   { 'zh-Hant': '格式：> 角色: 對白 | ? 問題 | 1) 選項 | = 正確答案 | 空行分隔場景', 'zh-Hans': '格式：> 角色: 对白 | ? 问题 | 1) 选项 | = 正确答案 | 空行分隔场景', en: 'Format: > Speaker: Text | ? Question | 1) Option | = Answer | blank lines separate scenes' },
  creator_placeholder_quiz:  { 'zh-Hant': '> 小明: 歡迎來到測驗！\n\n? 台灣的首都在哪裡？\n1) 台中\n2) 台北\n3) 高雄\n= 2\n\n> 小明: 太棒了！', 'zh-Hans': '> 小明: 欢迎来到测验！\n\n? 中国的首都在哪里？\n1) 上海\n2) 北京\n3) 广州\n= 2\n\n> 小明: 太棒了！', en: '> Alice: Welcome to the quiz!\n\n? What is the capital of France?\n1) London\n2) Paris\n3) Berlin\n= 2\n\n> Alice: Great job!' },
  creator_placeholder_story: { 'zh-Hant': '從前從前…', 'zh-Hans': '从前从前…', en: 'Once upon a time...' },
  creator_btn_validate: { 'zh-Hant': '✅ 驗證', 'zh-Hans': '✅ 验证', en: '✅ Validate' },
  creator_btn_preview:  { 'zh-Hant': '👁 預覽', 'zh-Hans': '👁 预览', en: '👁 Preview' },
  creator_btn_generate: { 'zh-Hant': '🤖 AI 生成', 'zh-Hans': '🤖 AI 生成', en: '🤖 Generate with AI' },
  creator_btn_save:     { 'zh-Hant': '💾 儲存', 'zh-Hans': '💾 保存', en: '💾 Save' },
  creator_generating:   { 'zh-Hant': '生成中…', 'zh-Hans': '生成中…', en: 'Generating...' },
  creator_saving:       { 'zh-Hant': '儲存中…', 'zh-Hans': '保存中…', en: 'Saving...' },
  creator_gen_topic:    { 'zh-Hant': '測驗主題', 'zh-Hans': '测验主题', en: 'Quiz Topic' },
  creator_gen_btn:      { 'zh-Hant': '生成', 'zh-Hans': '生成', en: 'Generate' },
  creator_valid:        { 'zh-Hant': '✅ T2Q 格式正確！共 {count} 個場景。', 'zh-Hans': '✅ T2Q 格式正确！共 {count} 个场景。', en: '✅ Valid T2Q! {count} scene(s) found.' },
  creator_no_preview:   { 'zh-Hant': '無法預覽 — 解析錯誤：', 'zh-Hans': '无法预览 — 解析错误：', en: 'Cannot preview — parse errors:' },
  creator_back_editor:  { 'zh-Hant': '← 返回編輯器', 'zh-Hans': '← 返回编辑器', en: '← Back to editor' },
  creator_saved:        { 'zh-Hant': '✅ 已發布！', 'zh-Hans': '✅ 已发布！', en: '✅ App published!' },
  creator_updated:      { 'zh-Hant': '✅ 已更新！', 'zh-Hans': '✅ 已更新！', en: '✅ App updated!' },
  creator_no_content:   { 'zh-Hant': '⚠️ 請輸入故事內容。', 'zh-Hans': '⚠️ 请输入故事内容。', en: '⚠️ Please write some story content.' },
  creator_need_signin:  { 'zh-Hant': '⚠️ 請先登入。', 'zh-Hans': '⚠️ 请先登入。', en: '⚠️ You must sign in to save.' },
  creator_ai_no_fn:     { 'zh-Hant': '❌ AI 功能尚未設定。', 'zh-Hans': '❌ AI 功能尚未设置。', en: '❌ Firebase Functions not available.' },
  creator_ai_failed:    { 'zh-Hant': '❌ 生成失敗：{msg}', 'zh-Hans': '❌ 生成失败：{msg}', en: '❌ Generation failed: {msg}' },
  creator_save_error:   { 'zh-Hant': '❌ 錯誤：{msg}', 'zh-Hans': '❌ 错误：{msg}', en: '❌ Error: {msg}' },
  creator_field_category: { 'zh-Hant': '分類', 'zh-Hans': '分类', en: 'Category' },
  creator_field_tags:    { 'zh-Hant': '標籤（選填）', 'zh-Hans': '标签（选填）', en: 'Tags (optional)' },
  creator_placeholder_tags: { 'zh-Hant': '用逗號分隔，例如：環保、動物、氣候', 'zh-Hans': '用逗号分隔，例如：环保、动物、气候', en: 'Separate with commas, e.g. environment, animals, climate' },

  tag_environment:  { 'zh-Hant': '環保', 'zh-Hans': '环保', en: 'Environment' },
  tag_nature:       { 'zh-Hant': '自然', 'zh-Hans': '自然', en: 'Nature' },
  tag_tech:         { 'zh-Hant': '科技', 'zh-Hans': '科技', en: 'Tech' },
  tag_science:      { 'zh-Hant': '科學', 'zh-Hans': '科学', en: 'Science' },
  tag_life:         { 'zh-Hant': '生活', 'zh-Hans': '生活', en: 'Life' },
  tag_family:       { 'zh-Hant': '家庭', 'zh-Hans': '家庭', en: 'Family' },
  tag_game:         { 'zh-Hant': '遊戲', 'zh-Hans': '游戏', en: 'Game' },
  tag_reading:      { 'zh-Hant': '閱讀', 'zh-Hans': '阅读', en: 'Reading' },
  tag_safety:       { 'zh-Hant': '安全', 'zh-Hans': '安全', en: 'Safety' },
  tag_creative:     { 'zh-Hant': '創意', 'zh-Hans': '创意', en: 'Creative' },
  tag_basics:       { 'zh-Hant': '入門', 'zh-Hans': '入门', en: 'Basics' },
  tag_other:        { 'zh-Hant': '其他', 'zh-Hans': '其他', en: 'Other' },

  creator_think_first:  { 'zh-Hant': '請先自己寫一些想法再使用 AI！', 'zh-Hans': '请先自己写一些想法再使用 AI！', en: 'Please type your own quiz ideas first before using AI!' },
  review_title:       { 'zh-Hant': '發表評論', 'zh-Hans': '发表评论', en: 'Write a Review' },
  review_rate:        { 'zh-Hant': '評分', 'zh-Hans': '评分', en: 'Your Rating' },
  review_placeholder_title: { 'zh-Hant': '評論標題', 'zh-Hans': '评论标题', en: 'Review title' },
  review_placeholder_body: { 'zh-Hant': '分享你的想法⋯', 'zh-Hans': '分享你的想法⋯', en: 'Share your thoughts…' },
  review_submit:      { 'zh-Hant': '送出評論', 'zh-Hans': '送出评论', en: 'Submit Review' },
  review_sign_in:     { 'zh-Hant': '登入即可評論', 'zh-Hans': '登录即可评论', en: 'Sign in to review' },
  review_thanks:      { 'zh-Hant': '感謝你的評論！', 'zh-Hans': '感谢你的评论！', en: 'Thanks for your review!' },
  review_write_title: { 'zh-Hant': '寫下你的評論', 'zh-Hans': '写下你的评论', en: 'Write Your Review' },
  review_change:      { 'zh-Hant': '更改', 'zh-Hans': '更改', en: 'Change' },
  review_next:        { 'zh-Hant': '下一步 →', 'zh-Hans': '下一步 →', en: 'Next →' },

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
