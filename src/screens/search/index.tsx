import { useState, useMemo } from 'react';
import { useLanguage, tKey, tReplace } from '../../i18n';
import { movies, books } from '../../data/content';
import type { Content } from '../../types';
import { playableApps } from '../../data/playableApps';
import { useUIStore } from '../../store';

// Convert playable apps to searchable format
const searchableApps = playableApps.map((a) => ({
  id: a.id,
  title: a.title,
  subtitle: a.description,
  category: a.category,
  appType: a.appType,
}));

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const { lang } = useLanguage();
  const { previewApp } = useUIStore();

  const results = useMemo((): { apps: typeof searchableApps; media: Content[] } => {
    if (!query.trim()) return { apps: [], media: [] };
    const q = query.toLowerCase();
    // Search playable apps
    const appResults = searchableApps.filter(
      (item) => item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q) || item.category?.toLowerCase().includes(q),
    );
    // Search movies & books
    const mediaResults = [...movies, ...books].filter(
      (item) => item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q) || item.category?.toLowerCase().includes(q),
    );
    return { apps: appResults, media: mediaResults };
  }, [query]);

  return (
    <div className="screen screen--search">
      <div className="search-header">
        <div className="search-header__bar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input className="search-header__input" type="search" placeholder={tKey('search_placeholder', lang)} value={query} onChange={(e) => setQuery(e.target.value)} autoFocus />
        </div>
      </div>
      {query.trim() === '' ? (
        <div className="search-empty">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="1"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <span className="search-empty__text">{tKey('search_empty', lang)}</span>
        </div>
      ) : results.apps.length === 0 && results.media.length === 0 ? (
        <div className="search-empty">
          <span className="search-empty__text">{tReplace('search_no_results', lang, { query })}</span>
        </div>
      ) : (
        <div className="content-list">
          {results.apps.map((item) => (
            <button
              key={item.id}
              type="button"
              className="content-card content-card--list"
              onClick={() => previewApp(item.id, item.appType)}
              style={{ touchAction: 'manipulation' }}
            >
              <div className="content-card__icon content-card__icon--large content-card__icon--placeholder">📦</div>
              <div className="content-card__body">
                <span className="content-card__title">{item.title}</span>
                <span className="content-card__subtitle">{item.subtitle}</span>
                <span className="content-card__meta">
                  <span className="content-card__badge">
                    {item.appType === 't2q_quiz' ? tKey('card_type_quiz', lang) : tKey('card_type_story', lang)}
                  </span>
                </span>
              </div>
              <span className="content-card__action">
                {item.appType === 't2q_quiz' ? tKey('card_play', lang) : tKey('card_read', lang)}
              </span>
            </button>
          ))}
          {results.media.map((item) => (
            <button key={item.id} type="button" className="content-card content-card--list"
              onClick={() => {}} style={{ touchAction: 'manipulation' }}
            >
              <img src={item.iconUrl} alt={item.title} className="content-card__icon content-card__icon--large" />
              <div className="content-card__body">
                <span className="content-card__title">{item.title}</span>
                <span className="content-card__subtitle">{item.subtitle}</span>
              </div>
            </button>
          ))}
        </div>
      )}
      <div className="screen-spacer" />
    </div>
  );
}
