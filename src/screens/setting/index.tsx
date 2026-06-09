import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLanguage, tKey, langLabels } from '../../i18n';
import { useUIStore } from '../../store';
import { getCurrentUser, signInWithGoogle, signOut as firebaseSignOut, onAuthChange } from '../../firebase/auth';
import { fetchUserApps } from '../../firebase/apps';
import { playableApps } from '../../data/playableApps';
import type { Lang } from '../../i18n';
import type { AppDocument } from '../../types/t2q';
import type { User } from 'firebase/auth';

export default function SettingScreen() {
  const { lang, setLang } = useLanguage();
  const { toggleCreator, previewApp, state } = useUIStore();
  const [user, setUser] = useState<User | null>(getCurrentUser());
  const [myApps, setMyApps] = useState<AppDocument[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);

  const favoriteApps = useMemo(() => {
    const favIds = state.favorites;
    if (favIds.length === 0) return [];
    return playableApps.filter((app) => favIds.includes(app.id));
  }, [state.favorites]);

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

          {myApps.length > 0 ? (
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
                    <span className="setting-myapps__icon setting-myapps__icon--placeholder">�</span>
                  )}
                  <div className="setting-myapps__info">
                    <span className="setting-myapps__name">{app.title}</span>
                    <span className="setting-myapps__type">
                      {app.appType === 't2q_quiz' ? 'T2Q Quiz' : 'Story'}
                    </span>
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              ))}
            </div>
          ) : (
            <p className="setting-myapps__empty">{tKey('setting_no_apps', lang)}</p>
          )}

          <button
            type="button"
            className="setting-create-btn"
            onClick={() => {
              if (!user) {
                handleGoogleSignIn();
              } else {
                toggleCreator(true);
              }
            }}
            style={{ touchAction: 'manipulation' }}
          >
            {user ? tKey('setting_create_app', lang) : tKey('setting_sign_in_to_create', lang)}
          </button>
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

          <button type="button" className="setting-item">
            <span>{tKey('setting_notif', lang)}</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
          <button type="button" className="setting-item">
            <span>{tKey('setting_appearance', lang)}</span>
            <span className="setting-item__value">Dark</span>
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
                        {app.appType === 't2q_quiz' ? 'T2Q Quiz' : 'Story'}
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

          <button type="button" className="setting-item">
            <span>{tKey('setting_payment', lang)}</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        <div className="setting-group">
          <span className="setting-group__label">{tKey('setting_about', lang)}</span>
          <div className="setting-app-brand">
            <span className="setting-app-brand__icon">�</span>
            <span className="setting-app-brand__name">StoryBox 知識盒子</span>
          </div>
          <button type="button" className="setting-item">
            <span>{tKey('setting_privacy', lang)}</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
          <button type="button" className="setting-item">
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
      </div>

      <div className="screen-spacer" />
    </div>
  );
}
