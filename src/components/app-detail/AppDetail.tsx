import { useState, useEffect } from 'react';
import { useUIStore } from '../../store';
import { fetchAppById } from '../../firebase/apps';
import type { AppDocument } from '../../types/t2q';

export default function AppDetail() {
  const { state, closePreview, playApp } = useUIStore();
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
  const reviews = app.reviews ?? [];
  const starDist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.floor(r.rating) === star).length,
  }));
  const totalReviews = reviews.length;

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
            <div className="detail__icon detail__icon--placeholder">📦</div>
          )}
          <div className="detail__names">
            <h1 className="detail__title">{app.title}</h1>
            <span className="detail__subtitle">{app.description}</span>
          </div>
        </div>

        {/* === RATING ROW === */}
        {app.rating != null && (
          <div className="detail__rating-row">
            <span className="detail__rating-big-num">{app.rating}</span>
            <div className="detail__rating-score">
              <span className="detail__stars">
                {[1,2,3,4,5].map((s) => (
                  <span key={s} className={s <= Math.floor(app.rating!) ? 'detail__star--fill' : 'detail__star--empty'}>
                    {s <= Math.floor(app.rating!) ? '★' : '☆'}
                  </span>
                ))}
              </span>
              {app.ratingCount != null && (
                <span className="detail__rating-total">{app.ratingCount.toLocaleString()} ratings</span>
              )}
            </div>
          </div>
        )}

        {/* === TAGS === */}
        <div className="detail__genres">
          <span className="detail__chip detail__chip--accent">
            {isQuiz ? 'T2Q Quiz' : 'Story'}
          </span>
          {app.category && <span className="detail__chip">{app.category}</span>}
          <span className="detail__chip">Education</span>
        </div>

        {/* === ACTION BUTTONS === */}
        <div className="detail__actions">
          <button
            type="button"
            className="detail__action-primary"
            onClick={() => playApp(app.id, app.appType)}
            style={{ touchAction: 'manipulation' }}
          >
            {isQuiz ? 'Play Quiz' : 'Read Story'}
          </button>
          <button type="button" className="detail__action-secondary" style={{ touchAction: 'manipulation' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" fill="currentColor" />
            </svg>
            加入收藏
          </button>
        </div>

        {/* === SCREENSHOTS === */}
        <div className="detail__section">
          <div className="detail__screenshots">
            <div className="detail__screenshot detail__screenshot--placeholder">{isQuiz ? '❓' : '📖'}</div>
            <div className="detail__screenshot detail__screenshot--placeholder">{isQuiz ? '🎯' : '📄'}</div>
            <div className="detail__screenshot detail__screenshot--placeholder">{isQuiz ? '✅' : '🔤'}</div>
          </div>
        </div>

        {/* === ABOUT === */}
        <div className="detail__section">
          <h3 className="detail__section-title">關於這個知識內容</h3>
          <p className="detail__text">{app.description}</p>
        </div>

        {/* === APP INFO === */}
        <div className="detail__section">
          <h3 className="detail__section-title">應用資訊</h3>
          <div className="detail__meta-grid">
            {app.version && (
              <div className="detail__meta-item">
                <span className="detail__meta-label">版本</span>
                <span className="detail__meta-value">{app.version}</span>
              </div>
            )}
            {app.size && (
              <div className="detail__meta-item">
                <span className="detail__meta-label">大小</span>
                <span className="detail__meta-value">{app.size}</span>
              </div>
            )}
            {app.downloads && (
              <div className="detail__meta-item">
                <span className="detail__meta-label">下載次數</span>
                <span className="detail__meta-value">{app.downloads}</span>
              </div>
            )}
            {app.contentRating && (
              <div className="detail__meta-item">
                <span className="detail__meta-label">內容分級</span>
                <span className="detail__meta-value">{app.contentRating}</span>
              </div>
            )}
          </div>
        </div>

        {/* === RATINGS & REVIEWS === */}
        {totalReviews > 0 && (
          <div className="detail__section">
            <h3 className="detail__section-title">評分與評論</h3>

            <div className="detail__rating-dist">
              <div className="detail__rating-big">
                <span className="detail__rating-big-num">{app.rating}</span>
                <span className="detail__stars">
                  {[1,2,3,4,5].map((s) => (
                    <span key={s} className={s <= Math.floor(app.rating!) ? 'detail__star--fill' : 'detail__star--empty'}>
                      {s <= Math.floor(app.rating!) ? '★' : '☆'}
                    </span>
                  ))}
                </span>
                <span className="detail__rating-total">{totalReviews} 則評論</span>
              </div>
              <div className="detail__rating-bars">
                {starDist.map(({ star, count }) => (
                  <div key={star} className="rating-bar">
                    <span className="rating-bar__label">{star} ★</span>
                    <div className="rating-bar__track">
                      <div className="rating-bar__fill" style={{ width: `${totalReviews > 0 ? (count / totalReviews) * 100 : 0}%` }} />
                    </div>
                    <span className="rating-bar__count">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {reviews.map((r) => (
              <div key={r.id} className="review-card">
                <div className="review-card__header">
                  <div className="review-card__avatar">{r.author.charAt(0)}</div>
                  <div className="review-card__meta">
                    <span className="review-card__author">{r.author}</span>
                    <span className="review-card__date">{r.date}</span>
                  </div>
                  <div className="review-card__rating">
                    <span className="detail__stars">
                      {[1,2,3,4,5].map((s) => (
                        <span key={s} className={s <= r.rating ? 'detail__star--fill' : 'detail__star--empty'} style={{ fontSize: 12 }}>
                          {s <= r.rating ? '★' : '☆'}
                        </span>
                      ))}
                    </span>
                  </div>
                </div>
                <h4 className="review-card__title">{r.title}</h4>
                <p className="review-card__body">{r.content}</p>
              </div>
            ))}
          </div>
        )}

        <div className="detail__spacer" />
      </div>
    </div>
  );
}
