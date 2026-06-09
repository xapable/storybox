import './StarRating.css';

interface StarRatingProps {
  rating: number; // 0-5
  count?: number;
}

export default function StarRating({ rating, count }: StarRatingProps) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const fill = Math.min(1, Math.max(0, rating - i));
    return fill;
  });

  return (
    <span className="star-rating" aria-label={`${rating} out of 5 stars`}>
      <span className="star-rating__stars">
        {stars.map((fill, i) => (
          <span key={i} className="star-rating__star">
            <span
              className="star-rating__fill"
              style={{ width: `${fill * 100}%` }}
            />
          </span>
        ))}
      </span>
      {count !== undefined && (
        <span className="star-rating__count">
          ({count.toLocaleString()})
        </span>
      )}
    </span>
  );
}
