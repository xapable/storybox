import { useState, useEffect } from 'react';
import { useUIStore } from '../../store';
import { useLanguage, tKey } from '../../i18n';
import { fetchAppById, submitReview } from '../../firebase/apps';
import { getCurrentUser } from '../../firebase/auth';
import type { AppDocument } from '../../types/t2q';

export default function AppDetail() {
  const { lang } = useLanguage();
  const { state, closePreview, playApp, toggleFavorite } = useUIStore();
  const [app, setApp] = useState<AppDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewBody, setReviewBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reviewMsg, setReviewMsg] = useState('');

  const { previewAppId, previewAppType } = state;
  const user = getCurrentUser();

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
          <div className="detail__actions-row">
            <button
              type="button"
              className={`detail__action-secondary${state.favorites.includes(app.id) ? ' detail__action-secondary--active' : ''}`}
              onClick={() => toggleFavorite(app.id)}
              style={{ touchAction: 'manipulation' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill={state.favorites.includes(app.id) ? 'currentColor' : 'none'}>
                <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" stroke="currentColor" strokeWidth="1.5" fill={state.favorites.includes(app.id) ? 'currentColor' : 'none'} />
              </svg>
              {state.favorites.includes(app.id) ? tKey('detail_favorited', lang) : tKey('detail_wishlist', lang)}
            </button>
            <button
              type="button"
              className="detail__action-secondary detail__action-rate"
              onClick={() => {
                const el = document.querySelector('.detail__review-form');
                el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              style={{ touchAction: 'manipulation' }}
            >
              ⭐ {tKey('review_title', lang)}
            </button>
          </div>
        </div>

        {/* === ABOUT === */}
        <div className="detail__section">
          <p className="detail__text">{app.description}</p>
        </div>

        {/* === RATING + REVIEWS SECTION (combined card) === */}
        {app.rating != null && (
          <div className="detail__rating-card">
            <div className="detail__rating-card-header">
              <h3 className="detail__section-title" style={{ margin: 0 }}>
                ⭐ {tKey('detail_ratings', lang)}
              </h3>
              {app.ratingCount != null && (
                <span className="detail__rating-card-count">{app.ratingCount.toLocaleString()}</span>
              )}
            </div>
            <div className="detail__rating-dist">
              <div className="detail__rating-big">
                <span className="detail__rating-big-num">{app.rating}</span>
                <span className="detail__stars">
                  {[1,2,3,4,5].map((s) => (
                    <span key={s} className={s <= Math.floor(app.rating!) ? 'detail__star--fill' : 'detail__star--empty'}>★</span>
                  ))}
                </span>
              </div>
              <div className="detail__rating-bars">
                {[5,4,3,2,1].map((star) => {
                  const count = app.reviews?.filter((r) => Math.round(r.rating) === star).length ?? 0;
                  const total = app.reviews?.length ?? 0;
                  const pct = total > 0 ? (count / total) * 100 : 0;
                  return (
                    <div key={star} className="rating-bar">
                      <span className="rating-bar__label">{star}</span>
                      <span className="rating-bar__icon">★</span>
                      <div className="rating-bar__track">
                        <div className="rating-bar__fill" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="rating-bar__count">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* === REVIEW CARDS === */}
            {app.reviews && app.reviews.length > 0 && (
              <div className="detail__reviews">
                {app.reviews.slice(0, 5).map((review) => (
                  <div key={review.id} className="review-card">
                    <div className="review-card__header">
                      <div className="review-card__avatar">{review.author.charAt(0).toUpperCase()}</div>
                      <div className="review-card__author-info">
                        <span className="review-card__author">{review.author}</span>
                        <span className="review-card__date">{review.date}</span>
                      </div>
                      <span className="review-card__rating">
                        {[1,2,3,4,5].map((s) => (
                          <span key={s} className={s <= review.rating ? 'review-card__star--fill' : 'review-card__star--empty'}>★</span>
                        ))}
                      </span>
                    </div>
                    {review.title && <span className="review-card__title">{review.title}</span>}
                    {review.content && <p className="review-card__content">{review.content}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

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

        {/* Review Form */}
        <div className="detail__review-form">
          <h3 className="detail__section-title" style={{ textAlign: 'center', fontSize: 18, marginBottom: 16 }}>✍️ {tKey('review_title', lang)}</h3>

          {reviewMsg && <p className="review-form__msg">{reviewMsg}</p>}

          {!user ? (
            <div className="review-form__sign-in-box">
              <span className="review-form__sign-in-icon">🔒</span>
              <p className="review-form__sign-in">{tKey('review_sign_in', lang)}</p>
            </div>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (reviewRating === 0) return;
                setSubmitting(true);
                setReviewMsg('');
                try {
                  await submitReview(previewAppId!, {
                    author: user.displayName ?? user.email ?? 'Anonymous',
                    rating: reviewRating,
                    title: reviewTitle,
                    content: reviewBody,
                  });
                  setReviewMsg(tKey('review_thanks', lang));
                  setReviewRating(0);
                  setReviewTitle('');
                  setReviewBody('');
                  // refresh app data
                  const updated = await fetchAppById(previewAppId!);
                  if (updated) setApp(updated);
                } catch (err) {
                  setReviewMsg('Error submitting review');
                } finally {
                  setSubmitting(false);
                }}
              }
            >
              <label className="review-form__label">{tKey('review_rate', lang)}</label>
              <div className="review-form__stars">
                {[1,2,3,4,5].map((s) => (
                  <span
                    key={s}
                    className={`review-form__star ${s <= (reviewHover || reviewRating) ? 'review-form__star--fill' : 'review-form__star--empty'}`}
                    onClick={() => setReviewRating(s)}
                    onMouseEnter={() => setReviewHover(s)}
                    onMouseLeave={() => setReviewHover(0)}
                  >★</span>
                ))}
              </div>
              {reviewRating > 0 && (
                <div className="review-form__rating-label">
                  {['', '😞 很差', '🙁 較差', '🙂 不錯', '😊 很好', '🤩 超讚!'][reviewRating]}
                </div>
              )}
              <input
                className="review-form__input"
                type="text"
                placeholder={tKey('review_placeholder_title', lang)}
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                required
              />
              <textarea
                className="review-form__textarea"
                placeholder={tKey('review_placeholder_body', lang)}
                value={reviewBody}
                onChange={(e) => setReviewBody(e.target.value)}
                rows={3}
              />
              <button
                className="review-form__submit"
                type="submit"
                disabled={submitting || reviewRating === 0}
              >
                {submitting ? '⏳ 提交中…' : '📨 ' + tKey('review_submit', lang)}
              </button>
            </form>
          )}
        </div>

        <div className="detail__spacer" />
      </div>
    </div>
  );
}
