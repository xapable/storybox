import { useLanguage, tKey, langLabels } from '../../i18n';
import type { Lang } from '../../i18n';

export default function SettingScreen() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="screen screen--setting">
      <div className="screen-header">
        <h1 className="screen-header__title">{tKey('screen_setting', lang)}</h1>
      </div>

      <div className="setting-list">
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
