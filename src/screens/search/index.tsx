import { useState, useMemo } from 'react';
import { useLanguage, tKey, tReplace } from '../../i18n';
import { apps, movies, books } from '../../data/content';
import ContentCard from '../../components/content-card';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const { lang } = useLanguage();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return [...apps, ...movies, ...books].filter(
      (item) => item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q) || item.category?.toLowerCase().includes(q),
    );
  }, [query, apps, movies, books]);

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
      ) : results.length === 0 ? (
        <div className="search-empty">
          <span className="search-empty__text">{tReplace('search_no_results', lang, { query })}</span>
        </div>
      ) : (
        <div className="content-list">{results.map((item) => <ContentCard key={item.id} item={item} variant="list" />)}</div>
      )}
      <div className="screen-spacer" />
    </div>
  );
}
