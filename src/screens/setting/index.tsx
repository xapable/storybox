import { useState, useEffect } from 'react';
import { useLanguage, tKey, langLabels } from '../../i18n';
import { useUIStore } from '../../store';
import { getCurrentUser } from '../../firebase/auth';
import { fetchUserApps } from '../../firebase/apps';
import type { Lang } from '../../i18n';
import type { AppDocument } from '../../types/t2q';

export default function SettingScreen() {
  const { lang, setLang } = useLanguage();
  const { toggleCreator, previewApp } = useUIStore();
  const [myApps, setMyApps] = useState<AppDocument[]>([]);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      fetchUserApps(user.uid).then(setMyApps).catch(() => {});
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
                    <span className="setting-myapps__icon setting-myapps__icon--placeholder">📦</span>
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
            onClick={() => toggleCreator(true)}
            style={{ touchAction: 'manipulation' }}
          >
            {tKey('setting_create_app', lang)}
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

        <div className="setting-group">
          <span className="setting-group__label">{tKey('setting_account', lang)}</span>
          <button type="button" className="setting-item">
            <span>{tKey('setting_google_acct', lang)}</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
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
            <span className="setting-app-brand__icon">📦</span>
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
