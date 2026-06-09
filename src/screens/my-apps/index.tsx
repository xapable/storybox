import { useState, useRef } from 'react';
import { useLanguage, tKey } from '../../i18n';
import { useUIStore } from '../../store';
import { getCurrentUser, signInWithGoogle } from '../../firebase/auth';
import type { UserApp } from '../../types';

function icon(name: string): string {
  const text = encodeURIComponent(name.slice(0, 2));
  return `https://placehold.co/128x128/7C4DFF/white?text=${text}&font=noto-sans`;
}

export default function MyAppsScreen() {
  const { lang } = useLanguage();
  const { state, createApp, setTab } = useUIStore();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [t2q, setT2q] = useState('');
  const [selectedApp, setSelectedApp] = useState<UserApp | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result;
      if (typeof text === 'string') {
        setT2q((prev) => (prev ? `${prev}\n\n${text}` : text));
      }
    };
    reader.readAsText(file);
    // Reset so re-selecting the same file triggers again
    e.target.value = '';
  };

  const handleCreate = () => {
    if (!title.trim()) return;
    const newApp: UserApp = {
      id: `user-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      t2q: t2q.trim(),
      iconUrl: icon(title.trim()),
      category: 'User Created',
      createdAt: new Date().toISOString(),
    };
    createApp(newApp);
    setTitle('');
    setDescription('');
    setT2q('');
    setShowForm(false);
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setT2q('');
    setShowForm(false);
  };

  // Detail view for a created app
  if (selectedApp) {
    return (
      <div className="screen screen--my-apps">
        <div className="screen-header screen-header--with-action">
          <button
            type="button"
            className="screen-header__back"
            onClick={() => setSelectedApp(null)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--play-blue)" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <h1 className="screen-header__title">{selectedApp.title}</h1>
        </div>

        <div className="my-apps-detail">
          <div className="my-apps-detail__header">
            <img src={selectedApp.iconUrl} alt={selectedApp.title} className="my-apps-detail__icon" />
            <div>
              <h2 className="my-apps-detail__title">{selectedApp.title}</h2>
              <p className="my-apps-detail__desc">{selectedApp.description}</p>
            </div>
          </div>

          {selectedApp.t2q ? (
            <div className="my-apps-detail__section">
              <h3 className="my-apps-detail__section-title">{tKey('my_apps_detail_t2q', lang)}</h3>
              <pre className="my-apps-detail__t2q">{selectedApp.t2q}</pre>
            </div>
          ) : (
            <div className="my-apps-empty">
              <p className="my-apps-empty__text">{tKey('my_apps_detail_no_t2q', lang)}</p>
            </div>
          )}
        </div>

        <div className="screen-spacer" />
      </div>
    );
  }

  return (
    <div className="screen screen--my-apps">
      <div className="screen-header screen-header--with-action">
        <button
          type="button"
          className="screen-header__back"
          onClick={() => setTab('setting')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--play-blue)" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h1 className="screen-header__title">{tKey('setting_my_apps', lang)}</h1>
        {!showForm && (
          <button
            type="button"
            className="screen-header__add-btn"
            onClick={async () => {
              const user = getCurrentUser();
              if (!user) {
                try {
                  await signInWithGoogle();
                } catch {
                  return; // sign-in failed or cancelled
                }
              }
              setShowForm(true);
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--play-blue)" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span>{tKey('my_apps_add', lang)}</span>
          </button>
        )}
      </div>

      {showForm && (
        <div className="my-apps-form">
          <input
            className="my-apps-form__input"
            type="text"
            placeholder={tKey('my_apps_form_title', lang)}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="my-apps-form__textarea"
            placeholder={tKey('my_apps_form_desc', lang)}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />

          <div className="my-apps-form__section">
            <label className="my-apps-form__label">{tKey('my_apps_form_t2q', lang)}</label>
            <textarea
              className="my-apps-form__textarea my-apps-form__textarea--t2q"
              placeholder={tKey('my_apps_form_t2q_placeholder', lang)}
              value={t2q}
              onChange={(e) => setT2q(e.target.value)}
              rows={5}
            />
            <div className="my-apps-form__t2q-actions">
              <button
                type="button"
                className="my-apps-form__t2q-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <path d="M14 2v6h6" />
                  <path d="M12 18v-6M9 15l3-3 3 3" />
                </svg>
                <span>{tKey('my_apps_form_upload', lang)}</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.md,.csv"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
            </div>
          </div>

          <div className="my-apps-form__actions">
            <button type="button" className="my-apps-form__btn my-apps-form__btn--cancel" onClick={handleCancel}>
              {tKey('my_apps_form_cancel', lang)}
            </button>
            <button type="button" className="my-apps-form__btn my-apps-form__btn--create" onClick={handleCreate}>
              {tKey('my_apps_form_create', lang)}
            </button>
          </div>
        </div>
      )}

      {state.createdApps.length === 0 && !showForm ? (
        <div className="my-apps-empty">
          <span className="my-apps-empty__icon">📱</span>
          <p className="my-apps-empty__text">{tKey('my_apps_empty', lang)}</p>
        </div>
      ) : (
        <div className="my-apps-list">
          {state.createdApps.map((app) => (
            <button
              key={app.id}
              type="button"
              className="my-apps-card"
              onClick={() => setSelectedApp(app)}
            >
              <img src={app.iconUrl} alt={app.title} className="my-apps-card__icon" />
              <div className="my-apps-card__body">
                <span className="my-apps-card__title">{app.title}</span>
                <span className="my-apps-card__desc">{app.description}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="screen-spacer" />
    </div>
  );
}
