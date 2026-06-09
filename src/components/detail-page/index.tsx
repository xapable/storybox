import { useMemo, useState } from 'react';
import { useUIStore } from '../../store';
import { useLanguage, tKey, tReplace } from '../../i18n';
import { useContent } from '../../data/useContent';
import type { Review } from '../../types';

function formatRatingCount(count: number): string {
  if (count >= 1_000_000_000) return `${(count / 1_000_000_000).toFixed(1)}B`;
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toString();
}

function StarRating({ rating, size }: { rating: number; size?: 'sm' | 'md' }) {
  const s = size === 'sm' ? 12 : 16;
  return (
    <span className="detail__stars" style={{ fontSize: s }}>
      {Array.from({ length: 5 }, (_, i) => {
        const fill = i < Math.floor(rating) ? '★' : '☆';
        return <span key={i} className={i < Math.floor(rating) ? 'detail__star--fill' : 'detail__star--empty'}>{fill}</span>;
      })}
    </span>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="review-card">
      <div className="review-card__header">
        <div className="review-card__avatar">
          {review.author.charAt(0).toUpperCase()}
        </div>
        <div className="review-card__meta">
          <span className="review-card__author">{review.author}</span>
          <span className="review-card__date">{review.date}</span>
        </div>
        <div className="review-card__rating">
          <StarRating rating={review.rating} size="sm" />
        </div>
      </div>
      <h4 className="review-card__title">{review.title}</h4>
      <p className="review-card__body">{review.content}</p>
    </div>
  );
}

function RatingBar({ star, count, total }: { star: number; count: number; total: number }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="rating-bar">
      <span className="rating-bar__label">{star} ★</span>
      <div className="rating-bar__track">
        <div className="rating-bar__fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="rating-bar__count">{count}</span>
    </div>
  );
}

export default function DetailPage() {
  const { state, setCardOpen } = useUIStore();
  const [showAllReviews, setShowAllReviews] = useState(false);
  const { lang } = useLanguage();
  const { apps, movies, books } = useContent();

  const allContent = useMemo(() => [...apps, ...movies, ...books], [apps, movies, books]);

  const item = useMemo(
    () => allContent.find((c) => c.id === state.activeCardId) ?? null,
    [allContent, state.activeCardId],
  );

  if (!state.isCardOpen || !item) return null;

  const handleClose = () => setCardOpen('', false);
  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const reviews = item.reviews ?? [];
  const visibleReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  // Compute star distribution
  const starDist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r: Review) => r.rating >= star && r.rating < star + 1).length,
  }));
  const totalReviews = reviews.length;

  return (
    <div className="detail-overlay" onClick={handleBackdrop}>
      <div className="detail-page">
        {/* === HEADER === */}
        <div className="detail__header">
          <button type="button" className="detail__back" onClick={handleClose} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="currentColor" />
            </svg>
          </button>
          <span className={`detail__badge detail__badge--${item.contentType.toLowerCase()}`}>
            {tKey('detail_badge', lang)}
          </span>
        </div>

        {/* === IDENTITY === */}
        <div className="detail__identity">
          <img src={item.iconUrl} alt={item.title} className="detail__icon" />
          <div className="detail__names">
            <h1 className="detail__title">{item.title}</h1>
            <span className="detail__subtitle">{item.subtitle}</span>
            {item.publisher && (
              <span className="detail__subtitle detail__subtitle--dim">{item.publisher}</span>
            )}
          </div>
        </div>

        {/* === RATING ROW === */}
        {item.rating != null && (
          <div className="detail__rating-row">
            <span className="detail__rating-num">{item.rating}</span>
            <div className="detail__rating-score">
              <StarRating rating={item.rating} />
              {item.ratingCount != null && (
                <span className="detail__rating-count">
                  {tReplace('detail_ratings_count', lang, { count: formatRatingCount(item.ratingCount) })}
                </span>
              )}
            </div>
          </div>
        )}

        {/* === GENRES === */}
        {item.genre && item.genre.length > 0 && (
          <div className="detail__genres">
            {item.genre.map((g: string) => (
              <span key={g} className="detail__chip">{g}</span>
            ))}
            {item.category && <span className="detail__chip detail__chip--accent">{item.category}</span>}
          </div>
        )}

        {/* === ACTION BUTTONS === */}
        <div className="detail__actions">
          {item.action && (
            <button type="button" className="detail__action-primary">
              {item.action.label}
              {item.action.subtitle && (
                <span className="detail__action-sub">{item.action.subtitle}</span>
              )}
            </button>
          )}
          <button type="button" className="detail__action-secondary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" fill="currentColor" />
            </svg>
            {tKey('detail_wishlist', lang)}
          </button>
        </div>

        {/* === WHAT'S NEW === */}
        {item.whatsNew && (
          <div className="detail__section">
            <h3 className="detail__section-title">{tKey('detail_whats_new', lang)}</h3>
            <div className="detail__whatsnew">
              {item.whatsNew.split('\n').map((line: string, i: number) => (
                <p key={i} className="detail__text">{line}</p>
              ))}
            </div>
          </div>
        )}

        {/* === ABOUT === */}
        {item.description && (
          <div className="detail__section">
            <h3 className="detail__section-title">
              {tKey('detail_about', lang)}
            </h3>
            {item.description.split('\n\n').map((para: string, i: number) => (
              <p key={i} className="detail__text">{para}</p>
            ))}
          </div>
        )}

        {/* === BOOK INFO (for books) === */}
        {item.contentType === 'BOOK' && (
          <div className="detail__section">
            <h3 className="detail__section-title">Book details</h3>
            <div className="detail__meta-grid">
              {item.publisher && (
                <div className="detail__meta-item">
                  <span className="detail__meta-label">Publisher</span>
                  <span className="detail__meta-value">{item.publisher}</span>
                </div>
              )}
              {item.pages && (
                <div className="detail__meta-item">
                  <span className="detail__meta-label">Pages</span>
                  <span className="detail__meta-value">{item.pages}</span>
                </div>
              )}
              {item.language && (
                <div className="detail__meta-item">
                  <span className="detail__meta-label">Language</span>
                  <span className="detail__meta-value">{item.language}</span>
                </div>
              )}
              {item.isbn && (
                <div className="detail__meta-item">
                  <span className="detail__meta-label">ISBN</span>
                  <span className="detail__meta-value">{item.isbn}</span>
                </div>
              )}
              {item.publishedDate && (
                <div className="detail__meta-item">
                  <span className="detail__meta-label">Published</span>
                  <span className="detail__meta-value">{item.publishedDate}</span>
                </div>
              )}
              {item.price != null && (
                <div className="detail__meta-item">
                  <span className="detail__meta-label">Price</span>
                  <span className="detail__meta-value">${item.price}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* === APP INFO (for apps) === */}
        {item.contentType === 'APP' && (
          <div className="detail__section">
            <h3 className="detail__section-title">{tKey('detail_app_info', lang)}</h3>
            <div className="detail__meta-grid">
              {item.version && (
                <div className="detail__meta-item">
                  <span className="detail__meta-label">版本</span>
                  <span className="detail__meta-value">{item.version}</span>
                </div>
              )}
              {item.size && (
                <div className="detail__meta-item">
                  <span className="detail__meta-label">大小</span>
                  <span className="detail__meta-value">{item.size}</span>
                </div>
              )}
              <div className="detail__meta-item">
                <span className="detail__meta-label">下載次數</span>
                <span className="detail__meta-value">
                  {item.ratingCount ? `${formatRatingCount(item.ratingCount)}+` : 'N/A'}
                </span>
              </div>
              <div className="detail__meta-item">
                <span className="detail__meta-label">內容分級</span>
                <span className="detail__meta-value">全年齡</span>
              </div>
            </div>
          </div>
        )}

        {/* === RATINGS & REVIEWS === */}
        {reviews.length > 0 && (
          <div className="detail__section">
            <h3 className="detail__section-title">{tKey('detail_ratings', lang)}</h3>

            {/* Star distribution */}
            <div className="detail__rating-dist">
              <div className="detail__rating-big">
                <span className="detail__rating-big-num">{item.rating}</span>
                <StarRating rating={item.rating ?? 0} />
                <span className="detail__rating-total">{tReplace('detail_reviews_count', lang, { count: formatRatingCount(totalReviews) })}</span>
              </div>
              <div className="detail__rating-bars">
                {starDist.map(({ star, count }) => (
                  <RatingBar key={star} star={star} count={count} total={totalReviews} />
                ))}
              </div>
            </div>

            {/* Review cards */}
            <div className="detail__reviews">
              {visibleReviews.map((review: Review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>

            {reviews.length > 3 && (
              <button
                type="button"
                className="detail__show-more"
                onClick={() => setShowAllReviews(!showAllReviews)}
              >
                {showAllReviews ? tKey('detail_show_less', lang) : tReplace('detail_show_all', lang, { count: reviews.length })}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d={showAllReviews ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'}
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        <div className="detail__spacer" />
      </div>
    </div>
  );
}
