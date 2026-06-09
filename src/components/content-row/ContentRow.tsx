import Button from '../button';
import Divider from '../divider';
import StarRating from '../star-rating';
import type { ContentAction } from '../../types';
import './ContentRow.css';

interface ContentRowProps {
  id: string;
  title: string;
  subtitle: string;
  iconUrl: string;
  action?: ContentAction;
  rating?: number;
  ratingCount?: number;
  divider?: boolean;
  onPress?: () => void;
}

export default function ContentRow({
  title,
  subtitle,
  iconUrl,
  action,
  rating,
  ratingCount,
  divider = false,
  onPress,
}: ContentRowProps) {
  return (
    <>
      <div className="content-row" onClick={onPress} role="button" tabIndex={0}>
        <img src={iconUrl} alt={title} className="content-row__icon" />
        <div className="content-row__info">
          <span className="content-row__title">{title}</span>
          <span className="content-row__subtitle">{subtitle}</span>
          {rating !== undefined && (
            <StarRating rating={rating} count={ratingCount} />
          )}
        </div>
        {action && (
          <div className="content-row__action">
            <Button
              onPress={action.onPress}
              loading={action.loading}
              blue
            >
              {action.label}
            </Button>
            {action.subtitle && (
              <span className="content-row__action-sub">{action.subtitle}</span>
            )}
          </div>
        )}
      </div>
      {divider && <Divider />}
    </>
  );
}
