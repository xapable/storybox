import { useState, type ReactNode } from 'react';
import Button from '../button';
import ContentRow from '../content-row';
import type { Content, Story } from '../../types';
import './Card.css';

interface CardProps extends Story {
  children?: ReactNode;
  light?: boolean;
  onOpenChange?: (item: Story, isOpen: boolean) => void;
  onContentPress?: (content: Content) => void;
}

export default function Card({
  id,
  title,
  subtitle,
  legend,
  imageUrl,
  backgroundColor,
  hero,
  content,
  contents = [],
  children,
  light = false,
  onOpenChange,
  onContentPress,
}: CardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dark = !imageUrl || light;

  const handlePress = () => {
    const next = !isOpen;
    setIsOpen(next);
    onOpenChange?.(
      {
        id,
        title,
        subtitle,
        legend,
        imageUrl,
        backgroundColor,
        hero,
        content,
        contents,
        date: '',
      },
      next,
    );
  };

  return (
    <div className={`card ${isOpen ? 'card--open' : ''}`}>
      {isOpen && <div className="card__overlay" onClick={handlePress} />}

      <div className={`card__inner ${isOpen ? 'card__inner--open' : ''}`}>
        {isOpen && (
          <div className="card__scroll">
            <div className="card__body">{children}</div>
          </div>
        )}

        <div className="card__surface" onClick={!isOpen ? handlePress : undefined}>
          <div
            className={`card__image ${isOpen ? 'card__image--open' : ''}`}
            style={{ backgroundColor: backgroundColor || '#303134' }}
          >
            <img
              src={imageUrl}
              alt={title}
              className="card__image-img"
            />

            <div className={`card__image-content ${isOpen ? 'card__image-content--open' : ''}`}>
              {hero && content ? (
                <div className="card__hero">
                  <img src={content.iconUrl} alt={content.title} className="card__hero-icon" />
                  <span className="card__hero-text">
                    {title?.toUpperCase()}
                  </span>
                </div>
              ) : (
                <div>
                  {legend && (
                    <span className={`card__legend ${dark ? 'card__text--dark' : ''}`}>
                      {legend.toUpperCase()}
                    </span>
                  )}
                  {title && (
                    <h3 className={`card__title ${dark ? 'card__text--dark' : ''}`}>
                      {title}
                    </h3>
                  )}
                </div>
              )}

              {contents.length > 0 && (
                <div className="card__contents">
                  {contents.map((item) => (
                    <ContentRow
                      key={item.id}
                      id={item.id}
                      title={item.title}
                      subtitle={item.subtitle}
                      iconUrl={item.iconUrl}
                      action={{
                        label: item.price ? `$${item.price}` : 'GET',
                        subtitle: item.contentType === 'APP' ? undefined : item.contentType,
                      }}
                      divider
                      onPress={() => onContentPress?.(item)}
                    />
                  ))}
                </div>
              )}

              {content && !hero && (
                <div className="card__featured-content">
                  <div className="card__featured-info">
                    <span className={`card__featured-title ${dark ? 'card__text--dark' : ''}`}>
                      {content.title}
                    </span>
                    <span className={`card__featured-subtitle ${dark ? 'card__text--dark' : ''}`}>
                      {content.subtitle}
                    </span>
                  </div>
                  <Button blue align="right">
                    {content.price ? `$${content.price}` : 'GET'}
                  </Button>
                </div>
              )}

              {subtitle && (
                <span className="card__subtitle">{subtitle}</span>
              )}
            </div>
          </div>

          {isOpen && (
            <button
              type="button"
              className="card__close"
              onClick={handlePress}
              aria-label="Close"
            />
          )}
        </div>
      </div>
    </div>
  );
}
