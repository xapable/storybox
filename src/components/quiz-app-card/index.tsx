import { useLanguage, tKey } from '../../i18n';
import type { AppDocument } from '../../types/t2q';

interface QuizAppCardProps {
  app: AppDocument;
  onPlay: () => void;
}

export default function QuizAppCard({ app, onPlay }: QuizAppCardProps) {
  const { lang } = useLanguage();
  const badge = app.appType === 't2q_quiz' ? tKey('card_type_quiz', lang) : tKey('card_type_story', lang);
  const actionLabel = app.appType === 't2q_quiz' ? tKey('card_play', lang) : tKey('card_read', lang);

  return (
    <button
      type="button"
      className="content-card content-card--list"
      onClick={onPlay}
      style={{ touchAction: 'manipulation' }}
    >
      {app.thumbnail ? (
        <img
          src={app.thumbnail}
          alt={app.title}
          className="content-card__icon content-card__icon--large"
        />
      ) : (
        <div className="content-card__icon content-card__icon--large content-card__icon--placeholder">
          📦
        </div>
      )}
      <div className="content-card__body">
        <span className="content-card__title">{app.title}</span>
        <span className="content-card__subtitle">{app.description}</span>
        <span className="content-card__meta">
          <span className="content-card__badge">{badge}</span>
        </span>
      </div>
      <span className="content-card__action">{actionLabel}</span>
    </button>
  );
}
