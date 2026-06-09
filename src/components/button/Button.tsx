import { useState, useEffect, useCallback, type ReactNode } from 'react';
import './Button.css';

interface ButtonProps {
  children: ReactNode;
  onPress?: () => void;
  subtitle?: string;
  loading?: boolean;
  blue?: boolean;
  white?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: number;
  circle?: boolean;
}

export default function Button({
  children,
  onPress,
  subtitle,
  loading: externalLoading = false,
  blue = false,
  white = false,
  align = 'center',
  width = 72,
  circle = false,
}: ButtonProps) {
  const [internalLoading, setInternalLoading] = useState(false);

  useEffect(() => {
    if (externalLoading !== internalLoading) {
      setInternalLoading(externalLoading);
    }
  }, [externalLoading]);

  const handlePress = useCallback(() => {
    if (internalLoading) return;

    if (!externalLoading) {
      setInternalLoading(true);
      setTimeout(() => setInternalLoading(false), 2500);
    }

    onPress?.();
  }, [internalLoading, externalLoading, onPress]);

  const isLoading = internalLoading;

  const bgClass = [
    'btn__bg',
    blue && 'btn__bg--blue',
    white && 'btn__bg--white',
  ]
    .filter(Boolean)
    .join(' ');

  const textClass = ['btn__text', blue && 'btn__text--white']
    .filter(Boolean)
    .join(' ');

  const hostStyle: React.CSSProperties = {
    width: circle ? 28 : width,
    height: 28,
  };

  return (
    <button
      type="button"
      className={`btn ${isLoading ? 'btn--loading' : ''}`}
      style={hostStyle}
      onClick={handlePress}
      disabled={isLoading}
    >
      {isLoading && (
        <span className="btn__spinner">
          <span className="btn__spinner-ring" />
        </span>
      )}
      <span
        className={[
          'btn__content',
          align === 'left' && 'btn__content--left',
          align === 'right' && 'btn__content--right',
          !isLoading && bgClass,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <span className={textClass}>{children}</span>
        {subtitle && (
          <span className="btn__subtitle">{subtitle}</span>
        )}
      </span>
    </button>
  );
}
