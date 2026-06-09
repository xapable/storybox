import { useState, useEffect, useMemo } from 'react';
import { useLanguage, tKey } from '../../i18n';
import { useUIStore } from '../../store';
import { playableApps } from '../../data/playableApps';
import { fetchPublicApps } from '../../firebase/apps';
import QuizAppCard from '../../components/quiz-app-card';
import type { AppDocument } from '../../types/t2q';

export default function AppsScreen() {
  const { lang } = useLanguage();
  const { previewApp, state, setAppFilter } = useUIStore();
  const [allApps, setAllApps] = useState<AppDocument[]>(playableApps);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPublicApps().then((fetched) => {
      if (fetched.length > 0) {
        const firebaseIds = new Set(fetched.map((a) => a.id));
        const merged = [...fetched, ...playableApps.filter((a) => !firebaseIds.has(a.id))];
        setAllApps(merged);
      }
    }).catch(() => {});
  }, []);

  const filteredApps = useMemo(() => {
    let list = state.appFilter
      ? allApps.filter((a) =>
          a.id.startsWith(state.appFilter!) ||
          (state.appFilter === 'play-l' && (a.id === 'play-ai1' || a.id === 'play-auto')) ||
          (state.appFilter === 'play-c' && a.category === '環保') ||
          (state.appFilter === 'play-t' && a.category === '科技') ||
          (state.appFilter === 'play-l' && a.category === '生活')
        )
      : allApps;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.category?.toLowerCase().includes(q),
      );
    }

    return list;
  }, [allApps, state.appFilter, searchQuery]);

  return (
    <div className="screen screen--apps">
      <div className="screen-header">
        <h1 className="screen-header__title">
          {state.appFilter
            ? state.appFilter === 'play-c' ? '氣候變遷與環保' : state.appFilter === 'play-t' ? '人工智慧與科技' : '綜合知識與生活'
            : tKey('screen_apps', lang)}
        </h1>
        {state.appFilter && (
          <button type="button" className="apps-create-btn" onClick={() => setAppFilter(null)} style={{ touchAction: 'manipulation' }}>
            ✕ 清除
          </button>
        )}
      </div>

      {/* Search bar */}
      <div className="apps-search">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2">
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          className="apps-search__input"
          type="search"
          placeholder={tKey('apps_search_placeholder', lang)}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button type="button" className="apps-search__clear" onClick={() => setSearchQuery('')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="content-list">
        {filteredApps.length === 0 ? (
          <div className="apps-empty">
            <span className="apps-empty__text">{tKey('apps_search_no_results', lang)}</span>
          </div>
        ) : (
          filteredApps.map((app) => (
            <QuizAppCard key={app.id} app={app} onPlay={() => previewApp(app.id, app.appType)} />
          ))
        )}
      </div>
      <div className="screen-spacer" />
    </div>
  );
}
