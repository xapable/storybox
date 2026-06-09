import { useUIStore } from '../../store';
import type { Content } from '../../types';

interface ContentCardProps {
  item: Content;
  variant?: 'list' | 'grid';
}

function formatRatingCount(count: number): string {
  if (count >= 1_000_000_000) return `${(count / 1_000_000_000).toFixed(1)}B`;
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toString();
}

export default function ContentCard({ item, variant = 'list' }: ContentCardProps) {
  const { setCardOpen } = useUIStore();

  const handleClick = () => {
    setCardOpen(item.id, true);
  };

  if (variant === 'grid') {
    return (
      <button type="button" className="content-card content-card--grid" onClick={handleClick}>
        <div className="content-card__icon-wrap">
          <img src={item.iconUrl} alt={item.title} className="content-card__icon" />
        </div>
        <div className="content-card__info">
          <span className="content-card__title">{item.title}</span>
          <span className="content-card__subtitle">{item.subtitle}</span>
          <span className="content-card__rating">
            {item.rating != null ? `${item.rating} ★` : null}
          </span>
        </div>
      </button>
    );
  }

  return (
    <button type="button" className="content-card content-card--list" onClick={handleClick}>
      <img src={item.iconUrl} alt={item.title} className="content-card__icon content-card__icon--large" />
      <div className="content-card__body">
        <span className="content-card__title">{item.title}</span>
        <span className="content-card__subtitle">{item.subtitle}</span>
        <span className="content-card__meta">
          {item.rating != null && (
            <>
              <span className="content-card__stars">{item.rating}</span>
              <span className="content-card__star-icon">★</span>
              {item.ratingCount != null && (
                <span className="content-card__count">{formatRatingCount(item.ratingCount)}</span>
              )}
            </>
          )}
          {item.size && <span className="content-card__size">{item.size}</span>}
        </span>
      </div>
      {item.action && (
        <span className="content-card__action">{item.action.label}</span>
      )}
    </button>
  );
}
