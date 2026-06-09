import { useState, useEffect, useCallback } from 'react';
import { useUIStore } from '../../store';
import { useLanguage, tKey } from '../../i18n';
import { fetchAppById } from '../../firebase/apps';
import './StoryPlayer.css';

interface StoryPlayerProps {
  appId: string;
  previewContent?: string;
}

export default function StoryPlayer({ appId, previewContent }: StoryPlayerProps) {
  const { lang } = useLanguage();
  const { playApp, previewApp } = useUIStore();
  const [lines, setLines] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [lineIdx, setLineIdx] = useState(0);
  const [loading, setLoading] = useState(!previewContent);
  const [error, setError] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);

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
      <div className="story-player story-player--finished">
        <div className="story-finish-card">
          <div className="story-finish__emoji">📖</div>
          <h2 className="story-finish__title">{tKey('player_finish_title', lang)}</h2>
          <p className="story-finish__subtitle">{title}</p>
          <div className="story-finish__actions">
            <button type="button" className="story-btn story-btn--primary" onClick={restart}>
              {tKey('player_read_again', lang)}
            </button>
            <button type="button" className="story-btn story-btn--rate" onClick={() => {
              playApp(null);
              // Re-open app detail page with review form
              setTimeout(() => previewApp(appId, 'story'), 300);
            }}>
              ⭐ {tKey('player_rate', lang)}
            </button>
            <button type="button" className="story-btn story-btn--back" onClick={() => playApp(null)}>
              ← {tKey('player_back', lang)}
            </button>
          </div>
        </div>
      </div>
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
