import { useState, useEffect, useCallback } from 'react';
import { useUIStore } from '../../store';
import { useLanguage, tKey } from '../../i18n';
import { fetchAppById, submitReview } from '../../firebase/apps';
import { getCurrentUser, signInWithGoogle } from '../../firebase/auth';
import type { User } from 'firebase/auth';
import './StoryPlayer.css';

interface StoryPlayerProps {
  appId: string;
  previewContent?: string;
}

export default function StoryPlayer({ appId, previewContent }: StoryPlayerProps) {
  const { lang } = useLanguage();
  const { playApp } = useUIStore();
  const [lines, setLines] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [lineIdx, setLineIdx] = useState(0);
  const [loading, setLoading] = useState(!previewContent);
  const [error, setError] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  // Review state
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewBody, setReviewBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reviewMsg, setReviewMsg] = useState('');
  const [reviewStep, setReviewStep] = useState<'rate' | 'write'>('rate');
  const user: User | null = getCurrentUser();

  useEffect(() => {
    if (previewContent) {
      const parsed = previewContent
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.length > 0);
      setLines(parsed);
      setTitle('Preview');
      setLoading(false);
      return;
    }

    let cancelled = false;
    fetchAppById(appId)
      .then((doc) => {
        if (cancelled) return;
        if (!doc || !doc.storyContent) {
          setError('Story not found.');
          setLoading(false);
          return;
        }
        setTitle(doc.title);
        const parsed = doc.storyContent
          .split('\n')
          .map((l) => l.trim())
          .filter((l) => l.length > 0);
        setLines(parsed);
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load story.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [appId, previewContent]);

  const advance = useCallback(() => {
    if (lineIdx + 1 < lines.length) {
      setLineIdx((i) => i + 1);
    } else {
      setFinished(true);
    }
  }, [lineIdx, lines.length]);

  const restart = useCallback(() => {
    setLineIdx(0);
    setFinished(false);
  }, []);

  if (loading) {
    return (
      <div className="story-player">
        <div className="story-player__loading">{tKey('player_loading', lang)}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="story-player">
        <div className="story-player__error">{error}</div>
        <button type="button" className="story-btn story-btn--back" onClick={() => playApp(null)}>
          ← Back
        </button>
      </div>
    );
  }

  if (finished) {
    return (
      <>
      <div className="story-player story-player--finished">
        <div className="story-finish-card">
          <div className="story-finish__emoji">📖</div>
          <h2 className="story-finish__title">{tKey('player_finish_title', lang)}</h2>
          <p className="story-finish__subtitle">{title}</p>
          <div className="story-finish__actions">
            <button type="button" className="story-btn story-btn--primary" onClick={restart}>
              {tKey('player_read_again', lang)}
            </button>
            <button type="button" className="story-btn story-btn--back" onClick={() => playApp(null)}>
              ← {tKey('player_back', lang)}
            </button>
          </div>
        </div>

        {/* Inline review form */}
        <div className="story-review">
          {reviewMsg && <p className="review-form__msg">{reviewMsg}</p>}

          {!user ? (
            <button type="button" className="review-form__sign-in-box" onClick={() => signInWithGoogle().catch(() => {})}>
              <span className="review-form__sign-in-icon">🔒</span>
              <p className="review-form__sign-in">{tKey('review_sign_in', lang)}</p>
            </button>
          ) : (
            /* Step 1: Rate with stars */
            <div className="review-form__step">
              <div className="review-form__rating-area">
                <div className="review-form__stars">
                  {[1,2,3,4,5].map((s) => (
                    <span key={s}
                      className={`review-form__star ${s <= (reviewHover || reviewRating) ? 'review-form__star--fill' : 'review-form__star--empty'}`}
                      onClick={() => { setReviewRating(s); setReviewHover(0); }}
                      onMouseEnter={() => setReviewHover(s)}
                      onMouseLeave={() => setReviewHover(0)}
                    >★</span>
                  ))}
                </div>
                {reviewRating > 0 && (
                  <div className="review-form__rating-label">
                    {['', '😞 Terrible', '🙁 Bad', '🙂 Good', '😊 Great', '🤩 Excellent!'][reviewRating]}
                  </div>
                )}
              </div>
              <button className="review-form__submit review-form__submit--next"
                type="button"
                disabled={reviewRating === 0}
                onClick={() => setReviewStep('write')}
              >
                {tKey('review_next', lang)}
              </button>
            </div>
          )}
        </div>
      </div>

        {/* Popup modal for write step */}
        {reviewStep === 'write' && (
          <div className="review-popup-overlay" onClick={() => setReviewStep('rate')}>
            <div className="review-popup" onClick={(e) => e.stopPropagation()}>
              <div className="review-popup__handle" />
              <div className="review-popup__header">
                <span className="review-popup__title">{tKey('review_write_title', lang)}</span>
                <button type="button" className="review-popup__close" onClick={() => setReviewStep('rate')}>✕</button>
              </div>

              <form onSubmit={async (e) => {
                e.preventDefault();
                if (reviewRating === 0) return;
                setSubmitting(true);
                setReviewMsg('');
                try {
                  await submitReview(appId, {
                    author: user!.displayName ?? user!.email ?? 'Anonymous',
                    rating: reviewRating,
                    title: reviewTitle,
                    content: reviewBody,
                  });
                  setReviewMsg(tKey('review_thanks', lang));
                  setReviewRating(0);
                  setReviewTitle('');
                  setReviewBody('');
                  setReviewStep('rate');
                } catch {
                  setReviewMsg('Error submitting review');
                } finally {
                  setSubmitting(false);
                }
              }}>
                {/* Selected rating */}
                <div className="review-form__selected-rating">
                  <span className="review-form__selected-stars">
                    {[1,2,3,4,5].map((s) => (
                      <span key={s} className={s <= reviewRating ? 'review-form__star--fill' : 'review-form__star--empty'}>★</span>
                    ))}
                  </span>
                  <span className="review-form__selected-label">
                    {['', '😞 Terrible', '🙁 Bad', '🙂 Good', '😊 Great', '🤩 Excellent!'][reviewRating]}
                  </span>
                  <button type="button" className="review-form__change-rating" onClick={() => setReviewStep('rate')}>
                    {tKey('review_change', lang) || 'Change'}
                  </button>
                </div>

                <div className="review-form__fields">
                  <input className="review-form__input" type="text"
                    placeholder={tKey('review_placeholder_title', lang)}
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)} />
                  <textarea className="review-form__textarea"
                    placeholder={tKey('review_placeholder_body', lang)}
                    value={reviewBody}
                    onChange={(e) => setReviewBody(e.target.value)} rows={4} />
                </div>

                <button className="review-form__submit" type="submit" disabled={submitting}>
                  {submitting ? '⏳ Submitting…' : '📨 ' + tKey('review_submit', lang)}
                </button>
              </form>
            </div>
          </div>
        )}
      </>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="story-player">
        <div className="story-player__error">No content to display.</div>
        <button type="button" className="story-btn story-btn--back" onClick={() => playApp(null)}>
          ← Back
        </button>
      </div>
    );
  }

  return (
    <div className="story-player">
      {/* Header */}
      <div className="story-header">
        <button type="button" className="story-header__back" onClick={() => playApp(null)}>
          ← Back
        </button>
        <span className="story-header__title">{title}</span>
        <span className="story-header__progress">
          {lineIdx + 1}/{lines.length}
        </span>
      </div>

      {/* Line content */}
      <button
        type="button"
        className="story-line"
        onClick={advance}
        style={{ touchAction: 'manipulation' }}
      >
        <p className="story-line__text">{lines[lineIdx]}</p>
        <span className="story-line__hint">
          {lineIdx + 1 < lines.length ? tKey('player_tap_continue', lang) : tKey('player_tap_finish', lang)}
        </span>
      </button>

      {/* Progress dots */}
      <div className="story-progress">
        {lines.map((_, i) => (
          <span
            key={i}
            className={`story-dot ${i === lineIdx ? 'story-dot--active' : i < lineIdx ? 'story-dot--done' : ''}`}
          />
        ))}
      </div>
    </div>
  );
}
