import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLanguage, tKey, langLabels } from '../../i18n';
import { useUIStore } from '../../store';
import { getCurrentUser, signInWithGoogle, signOut as firebaseSignOut, onAuthChange } from '../../firebase/auth';
import { fetchUserApps, fetchPublicApps } from '../../firebase/apps';
import type { Lang } from '../../i18n';
import type { AppDocument } from '../../types/t2q';
import type { User } from 'firebase/auth';

function SeedButton() {
  const [status, setStatus] = useState<'idle' | 'seeding' | 'done' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  const handleSeed = useCallback(async () => {
    setStatus('seeding');
    try {
      const { seedFirestore } = await import('../../scripts/seedFirestore');
      const result = await seedFirestore();
      setMsg(result);
      setStatus('done');
    } catch (e: any) {
      setMsg(e?.message ?? 'Seed failed');
      setStatus('error');
    }
  }, []);

  return (
    <div style={{ marginTop: 24, padding: '0 18px' }}>
      <button type="button" className="setting-create-btn" onClick={handleSeed} disabled={status === 'seeding'} style={{ opacity: status === 'seeding' ? 0.6 : 1 }}>
        {status === 'idle' && '📦 Seed Firestore'}
        {status === 'seeding' && '⏳ Seeding…'}
        {status === 'done' && '✅ Seeded!'}
        {status === 'error' && '❌ Failed'}
      </button>
      {msg && <p style={{ fontSize: 12, color: 'var(--text-tertiary)', margin: '6px 0 0' }}>{msg}</p>}
    </div>
  );
}

type InfoSheet = 'privacy' | 'terms' | null;

const PRIVACY_CONTENT: Record<Lang, string> = {
  'zh-Hant': `隱私政策

最後更新日期：2026 年 6 月 10 日

StoryBox 知識盒子（以下稱「本應用程式」）尊重並保護您的隱私。本隱私政策說明我們如何收集、使用及保護您的資訊。

1. 我們收集的資訊
   • Google 帳戶資訊：當您使用 Google 登入時，我們會取得您的姓名、電子郵件地址及個人資料照片。
   • 使用資料：我們會記錄您建立的應用內容，以便在您的帳戶中提供服務。

2. 資訊的使用
   • 提供、維護及改善本應用程式的服務。
   • 讓您建立、儲存及分享知識內容。
   • 透過 Firebase Authentication 驗證您的身份。

3. 第三方服務
   本應用程式使用 Firebase（Google）作為後端服務，包括 Authentication、Firestore 資料庫及 Hosting。Firebase 的資料處理遵循 Google 隱私權政策。

4. 資料安全
   我們採用合理的技術措施保護您的資料。但請理解，沒有任何網路傳輸或電子儲存方法是完全安全的。

5. 您的權利
   您可以隨時登出，或透過 Google 帳戶設定管理您的個人資料。如需刪除帳戶資料，請聯絡我們。

6. 聯絡我們
   如有任何疑問，請寄送至：xapableteam@gmail.com`,

  'zh-Hans': `隐私政策

最后更新日期：2026 年 6 月 10 日

StoryBox 知识盒子（以下称「本应用程序」）尊重并保护您的隐私。本隐私政策说明我们如何收集、使用及保护您的信息。

1. 我们收集的信息
   • Google 账户信息：当您使用 Google 登录时，我们会取得您的姓名、电子邮件地址及个人资料照片。
   • 使用数据：我们会记录您创建的应用内容，以便在您的账户中提供服务。

2. 信息的使用
   • 提供、维护及改善本应用程序的服务。
   • 让您创建、存储及分享知识内容。
   • 通过 Firebase Authentication 验证您的身份。

3. 第三方服务
   本应用程序使用 Firebase（Google）作为后端服务，包括 Authentication、Firestore 数据库及 Hosting。Firebase 的数据处理遵循 Google 隐私政策。

4. 数据安全
   我们采用合理的技术措施保护您的数据。但请理解，没有任何网络传输或电子存储方法是完全安全的。

5. 您的权利
   您可以随时登出，或通过 Google 账户设置管理您的个人资料。如需删除账户数据，请联系我们。

6. 联系我们
   如有任何疑问，请寄送至：xapableteam@gmail.com`,

  en: `Privacy Policy

Last updated: June 10, 2026

StoryBox Knowledge Box (the "App") respects and protects your privacy. This Privacy Policy explains how we collect, use, and protect your information.

1. Information We Collect
   • Google Account Info: When you sign in with Google, we access your name, email address, and profile photo.
   • Usage Data: We store the app content you create to provide services within your account.

2. How We Use Information
   • To provide, maintain, and improve the App's services.
   • To enable you to create, save, and share knowledge content.
   • To authenticate your identity via Firebase Authentication.

3. Third-Party Services
   This App uses Firebase (Google) for backend services, including Authentication, Firestore database, and Hosting. Firebase's data handling is governed by Google's Privacy Policy.

4. Data Security
   We implement reasonable technical measures to protect your data. However, no method of transmission or storage is completely secure.

5. Your Rights
   You may sign out at any time or manage your personal data through your Google Account settings. To request data deletion, please contact us.

6. Contact Us
   For any questions, email: xapableteam@gmail.com`,
};

const TERMS_CONTENT: Record<Lang, string> = {
  'zh-Hant': `服務條款

最後更新日期：2026 年 6 月 10 日

歡迎使用 StoryBox 知識盒子。使用本應用程式即表示您同意以下條款。

1. 接受條款
   使用本應用程式即表示您同意這些服務條款。如果您不同意，請勿使用本應用程式。

2. 使用者帳戶
   • 您必須使用 Google 帳戶登入才能建立及儲存內容。
   • 您對您的帳戶活動負全部責任。

3. 使用者內容
   • 您保留您建立的內容的所有權利。
   • 您同意不對本應用程式上傳任何違法、侵權或不當的內容。

4. 智慧財產權
   本應用程式的名稱、標誌及介面設計歸 StoryBox 所有。未經許可不得複製或修改。

5. 免責聲明
   本應用程式依「現狀」提供，不提供任何明示或暗示的保證。

6. 條款變更
   我們可能隨時更新這些條款。重大變更時會在應用程式內通知。

7. 聯絡我們
   xapableteam@gmail.com`,

  'zh-Hans': `服务条款

最后更新日期：2026 年 6 月 10 日

欢迎使用 StoryBox 知识盒子。使用本应用程序即表示您同意以下条款。

1. 接受条款
   使用本应用程序即表示您同意这些服务条款。如果您不同意，请勿使用本应用程序。

2. 用户账户
   • 您必须使用 Google 账户登录才能创建及存储内容。
   • 您对您的账户活动负全部责任。

3. 用户内容
   • 您保留您创建的内容的所有权利。
   • 您同意不对本应用程序上传任何违法、侵权或不当的内容。

4. 知识产权
   本应用程序的名称、标志及界面设计归 StoryBox 所有。未经许可不得复制或修改。

5. 免责声明
   本应用程序依「现状」提供，不提供任何明示或暗示的保证。

6. 条款变更
   我们可能随时更新这些条款。重大变更时会在应用程序内通知。

7. 联系我们
   xapableteam@gmail.com`,

  en: `Terms of Service

Last updated: June 10, 2026

Welcome to StoryBox Knowledge Box. By using this App, you agree to these Terms.

1. Acceptance of Terms
   By using the App, you agree to these Terms of Service. If you do not agree, do not use the App.

2. User Accounts
   • You must sign in with Google to create and save content.
   • You are fully responsible for all activity on your account.

3. User Content
   • You retain all rights to the content you create.
   • You agree not to upload any illegal, infringing, or inappropriate content.

4. Intellectual Property
   The App's name, logo, and interface design are owned by StoryBox. You may not copy or modify them without permission.

5. Disclaimer
   The App is provided "as is" without any warranties, express or implied.

6. Changes to Terms
   We may update these Terms at any time. Material changes will be notified within the App.

7. Contact
   xapableteam@gmail.com`,
};

export default function SettingScreen() {
  const { lang, setLang } = useLanguage();
  const { toggleCreator, previewApp, setTheme, state } = useUIStore();
  const [user, setUser] = useState<User | null>(getCurrentUser());
  const [myApps, setMyApps] = useState<AppDocument[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [infoSheet, setInfoSheet] = useState<InfoSheet>(null);
  const [allApps, setAllApps] = useState<AppDocument[]>([]);

  useEffect(() => {
    fetchPublicApps().then(setAllApps).catch(() => {});
  }, []);

  const favoriteApps = useMemo(() => {
    const favIds = state.favorites;
    if (favIds.length === 0) return [];
    return allApps.filter((app) => favIds.includes(app.id));
  }, [state.favorites, allApps]);

  useEffect(() => {
    return onAuthChange((u) => {
      setUser(u);
      if (u) {
        fetchUserApps(u.uid).then(setMyApps).catch(() => {});
      } else {
        setMyApps([]);
      }
    });
  }, []);

  const handleGoogleSignIn = useCallback(async () => {
    try {
      await signInWithGoogle();
    } catch (e) {
      console.error('Sign in failed', e);
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      await firebaseSignOut();
    } catch (e) {
      console.error('Sign out failed', e);
    }
  }, []);

  return (
    <div className="screen screen--setting">
      <div className="screen-header">
        <h1 className="screen-header__title">{tKey('screen_setting', lang)}</h1>
      </div>

      <div className="setting-list">
        {/* My Apps */}
        <div className="setting-group">
          <span className="setting-group__label">{tKey('setting_myapps', lang)}</span>

          {!user ? (
            <div className="setting-myapps-empty-state">
              <span className="setting-myapps-empty-state__icon">📱</span>
              <p className="setting-myapps-empty-state__text">{tKey('setting_sign_in_to_create', lang)}</p>
              <button
                type="button"
                className="setting-create-btn"
                onClick={handleGoogleSignIn}
                style={{ touchAction: 'manipulation' }}
              >
                {tKey('setting_sign_in', lang)}
              </button>
            </div>
          ) : myApps.length === 0 ? (
            <div className="setting-myapps-empty-state">
              <span className="setting-myapps-empty-state__icon">✨</span>
              <p className="setting-myapps-empty-state__text">{tKey('setting_no_apps', lang)}</p>
              <button
                type="button"
                className="setting-create-btn"
                onClick={() => toggleCreator(true)}
                style={{ touchAction: 'manipulation' }}
              >
                {tKey('setting_create_app', lang)}
              </button>
            </div>
          ) : (
            <>
              <div className="setting-myapps-list">
                {myApps.map((app) => (
                  <button
                    key={app.id}
                    type="button"
                    className="setting-item setting-item--app"
                    onClick={() => previewApp(app.id, app.appType)}
                  >
                    {app.thumbnail ? (
                      <img
                        src={app.thumbnail}
                        alt=""
                        className="setting-myapps__icon"
                      />
                    ) : (
                      <span className="setting-myapps__icon setting-myapps__icon--placeholder">📦</span>
                    )}
                    <div className="setting-myapps__info">
                      <span className="setting-myapps__name">{app.title}</span>
                      <span className="setting-myapps__type">
                        {app.appType === 't2q_quiz' ? tKey('card_type_quiz', lang) : tKey('card_type_story', lang)}
                      </span>
                    </div>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="setting-create-btn"
                onClick={() => toggleCreator(true)}
                style={{ touchAction: 'manipulation' }}
              >
                {tKey('setting_create_app', lang)}
              </button>
            </>
          )}
        </div>

        <div className="setting-group">
          <span className="setting-group__label">{tKey('setting_general', lang)}</span>

          <button type="button" className="setting-item">
            <span>{tKey('setting_language', lang)}</span>
            <span className="setting-item__value">{langLabels[lang]}</span>
          </button>

          {/* Language options */}
          <div className="setting-lang-options">
            {(['zh-Hant', 'zh-Hans', 'en'] as Lang[]).map((l) => (
              <button
                key={l}
                type="button"
                className={`setting-lang-btn ${lang === l ? 'setting-lang-btn--active' : ''}`}
                onClick={() => setLang(l)}
              >
                {langLabels[l]}
                {lang === l && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" fill="var(--play-green)" />
                  </svg>
                )}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="setting-item"
            onClick={() => setTheme(state.theme === 'dark' ? 'light' : 'dark')}
          >
            <span>{tKey('setting_appearance', lang)}</span>
            <span className="setting-item__value">
              {state.theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
            </span>
          </button>
        </div>

        {/* Favorites */}
        <div className="setting-group">
          <span className="setting-group__label">{tKey('setting_favorites', lang)}</span>

          <button
            type="button"
            className="setting-item"
            onClick={() => setShowFavorites((v) => !v)}
          >
            <span>
              {tKey('setting_favorites', lang)}
              {favoriteApps.length > 0 && (
                <span className="setting-item__badge">{favoriteApps.length}</span>
              )}
            </span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" style={{ transform: showFavorites ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }}>
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {showFavorites && (
            favoriteApps.length > 0 ? (
              <div className="setting-myapps-list">
                {favoriteApps.map((app) => (
                  <button
                    key={app.id}
                    type="button"
                    className="setting-item setting-item--app"
                    onClick={() => previewApp(app.id, app.appType)}
                  >
                    <span className="setting-myapps__icon setting-myapps__icon--placeholder">
                      {app.appType === 't2q_quiz' ? '🎯' : '📖'}
                    </span>
                    <div className="setting-myapps__info">
                      <span className="setting-myapps__name">{app.title}</span>
                      <span className="setting-myapps__type">
                        {app.appType === 't2q_quiz' ? tKey('card_type_quiz', lang) : tKey('card_type_story', lang)}
                      </span>
                    </div>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF6B6B" strokeWidth="2">
                      <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" fill="#FF6B6B" />
                    </svg>
                  </button>
                ))}
              </div>
            ) : (
              <p className="setting-myapps__empty">{tKey('setting_no_favorites', lang)}</p>
            )
          )}
        </div>

        <div className="setting-group">
          <span className="setting-group__label">{tKey('setting_account', lang)}</span>

          {user ? (
            <>
              <div className="setting-item setting-item--static">
                <div className="setting-user-info">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="" className="setting-user-avatar" />
                  ) : (
                    <span className="setting-user-avatar setting-user-avatar--placeholder">
                      {user.displayName?.charAt(0) ?? '?'}
                    </span>
                  )}
                  <div className="setting-user-details">
                    <span className="setting-user-name">{user.displayName ?? 'User'}</span>
                    <span className="setting-user-email">{user.email}</span>
                  </div>
                </div>
              </div>
              <button type="button" className="setting-item" onClick={handleSignOut}>
                <span style={{ color: 'var(--play-red, #FF6B6B)' }}>{tKey('setting_sign_out', lang)}</span>
              </button>
            </>
          ) : (
            <button type="button" className="setting-item" onClick={handleGoogleSignIn}>
              <span>{tKey('setting_sign_in', lang)}</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          )}

        </div>

        <div className="setting-group">
          <span className="setting-group__label">{tKey('setting_about', lang)}</span>
          <div className="setting-app-brand">
            <div className="setting-app-brand__logo">📦</div>
            <div className="setting-app-brand__info">
              <span className="setting-app-brand__name">StoryBox</span>
              <span className="setting-app-brand__sub">{tKey('app_name', lang)}</span>
            </div>
          </div>
          <button type="button" className="setting-item" onClick={() => setInfoSheet('privacy')}>
            <span>{tKey('setting_privacy', lang)}</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
          <button type="button" className="setting-item" onClick={() => setInfoSheet('terms')}>
            <span>{tKey('setting_terms', lang)}</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
          <button type="button" className="setting-item">
            <span>{tKey('setting_version', lang)}</span>
            <span className="setting-item__value">1.0.0</span>
          </button>
        </div>

        {user && <SeedButton />}
      </div>

      <div className="screen-spacer" />

      {/* Info sheet modal */}
      {infoSheet && (
        <div className="info-sheet-overlay" onClick={() => setInfoSheet(null)}>
          <div className="info-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="info-sheet__header">
              <h2 className="info-sheet__title">
                {infoSheet === 'privacy' ? tKey('setting_privacy', lang) : tKey('setting_terms', lang)}
              </h2>
              <button type="button" className="info-sheet__close" onClick={() => setInfoSheet(null)}>
                ✕
              </button>
            </div>
            <div className="info-sheet__body">
              {(infoSheet === 'privacy' ? PRIVACY_CONTENT : TERMS_CONTENT)[lang].split('\n').map((line, i) => {
                if (line.trim() === '') return <br key={i} />;
                if (line.startsWith('  ')) {
                  return <p key={i} className="info-sheet__item">{line.trim()}</p>;
                }
                if (line.match(/^\d+\./)) {
                  return <h3 key={i} className="info-sheet__heading">{line}</h3>;
                }
                return <p key={i} className="info-sheet__text">{line}</p>;
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
