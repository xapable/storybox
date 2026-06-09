import { useState, useEffect } from 'react';
import { useUIStore } from '../../store';
import { useLanguage, tKey } from '../../i18n';
import { fetchAppById } from '../../firebase/apps';
import './AppDetail.css';
import type { AppDocument } from '../../types/t2q';

export default function AppDetail() {
  const { lang } = useLanguage();
  const { state, closePreview, playApp, toggleFavorite } = useUIStore();
  const [app, setApp] = useState<AppDocument | null>(null);
  const [loading, setLoading] = useState(true);

  const { previewAppId, previewAppType } = state;

  useEffect(() => {
    if (!previewAppId) return;
    let cancelled = false;
    setLoading(true);
    fetchAppById(previewAppId).then((doc) => {
      if (!cancelled) {
        setApp(doc);
        setLoading(false);
      }
    }).catch(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [previewAppId]);

  if (!previewAppId || !previewAppType) return null;

  const handleClose = () => closePreview();

  if (loading || !app) {
    return (
      <div className="detail-overlay" onClick={handleClose}>
        <div className="detail-page">
          <div className="detail__header">
            <button type="button" className="detail__back" onClick={handleClose}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="currentColor" />
              </svg>
            </button>
          </div>
          <div className="app-detail__loading">{loading ? 'Loading...' : 'App not found.'}</div>
        </div>
      </div>
    );
  }

  const isQuiz = app.appType === 't2q_quiz';

  return (
    <div className="detail-overlay" onClick={handleClose}>
      <div className="detail-page" onClick={(e) => e.stopPropagation()}>

        {/* === HEADER === */}
        <div className="detail__header">
          <button type="button" className="detail__back" onClick={handleClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="currentColor" />
            </svg>
          </button>
          <span className="detail__badge detail__badge--app">
            {isQuiz ? '🎯 Quiz' : '📖 Story'}
          </span>
        </div>

        {/* === IDENTITY === */}
        <div className="detail__identity">
          {app.thumbnail ? (
            <img src={app.thumbnail} alt={app.title} className="detail__icon" />
          ) : (
            <div className="detail__icon detail__icon--placeholder">
              {isQuiz ? '🎯' : '📖'}
            </div>
          )}
          <div className="detail__names">
            <h1 className="detail__title">{app.title}</h1>
            <span className="detail__subtitle">{app.description}</span>
            <div className="detail__identity-meta">
              <span className="detail__chip detail__chip--sm">
                {isQuiz ? tKey('card_type_quiz', lang) : tKey('card_type_story', lang)}
              </span>
              {app.category && <span className="detail__chip detail__chip--sm">{app.category}</span>}
            </div>
          </div>
        </div>

        {/* === CREATOR === */}
        <div className="detail__creator">
          <div className="detail__creator-avatar">
            {app.creatorAvatar || '📦'}
          </div>
          <div className="detail__creator-info">
            <span className="detail__creator-label">{tKey('detail_creator', lang)}</span>
            <span className="detail__creator-name">{app.createdBy}</span>
          </div>
        </div>

        {/* === ACTION BUTTONS === */}
        <div className="detail__actions">
          <button
            type="button"
            className="detail__action-primary"
            onClick={() => playApp(app.id, app.appType, app.storyContent ?? app.t2qContent)}
            style={{ touchAction: 'manipulation' }}
          >
            {isQuiz ? '▶ ' + tKey('detail_play_quiz', lang) : '📖 ' + tKey('detail_read_story', lang)}
          </button>
          <button
            type="button"
            className="detail__action-secondary"
            onClick={() => toggleFavorite(app.id)}
            style={{ touchAction: 'manipulation' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={state.favorites.includes(app.id) ? 'currentColor' : 'none'}>
              <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" stroke="currentColor" strokeWidth="1.5" fill={state.favorites.includes(app.id) ? 'currentColor' : 'none'} />
            </svg>
            {state.favorites.includes(app.id) ? tKey('detail_favorited', lang) : tKey('detail_wishlist', lang)}
          </button>
        </div>

        {/* === ABOUT === */}
        <div className="detail__section">
          <p className="detail__text">{app.description}</p>
        </div>

        {/* === APP INFO === */}
        <div className="detail__section">
          <h3 className="detail__section-title">📋 {tKey('detail_app_info', lang)}</h3>
          <div className="detail__meta-grid">
            {app.views && (
              <div className="detail__meta-item">
                <span className="detail__meta-label">{tKey('detail_views', lang)}</span>
                <span className="detail__meta-value">{app.views}</span>
              </div>
            )}
            {app.contentRating && (
              <div className="detail__meta-item">
                <span className="detail__meta-label">{tKey('detail_rating', lang)}</span>
                <span className="detail__meta-value">{app.contentRating}</span>
              </div>
            )}
          </div>
        </div>

        <div className="detail__spacer" />
      </div>
    </div>
  );
}
