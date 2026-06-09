import { useMemo, useState, useEffect } from 'react';
import { useLanguage, tKey } from '../../i18n';
import { useUIStore } from '../../store';
import { fetchPublicApps } from '../../firebase/apps';
import type { AppDocument } from '../../types/t2q';

// ── helpers ──
function Star(size: number) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#FFB300" style={{ verticalAlign: 'middle', marginRight: 1 }}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

/** A single app card used in all sections */
function AppCard({ app, compact }: { app: AppDocument; compact?: boolean }) {
  const { lang } = useLanguage();
  const { previewApp } = useUIStore();
  return (
    <button
      type="button"
      className={`explore-card${compact ? ' explore-card--compact' : ''}`}
      onClick={() => previewApp(app.id, app.appType)}
      style={{ touchAction: 'manipulation' }}
    >
      <div className="explore-card__icon">📦</div>
      <span className="explore-card__title">{app.title}</span>
      {!compact && <span className="explore-card__desc">{app.description}</span>}
      <span className="explore-card__meta">
        {Star(compact ? 10 : 12)}
        {app.rating}
        <span className="explore-card__count">({app.ratingCount?.toLocaleString()})</span>
      </span>
      <span className="explore-card__type">{app.appType === 't2q_quiz' ? tKey('card_quiz', lang) : tKey('card_story', lang)}</span>
    </button>
  );
}

/** A horizontal row of app cards (scrollable) */
function HotRow({ apps }: { apps: AppDocument[] }) {
  return (
    <div className="explore-hot-scroll">
      {apps.map((app) => (
        <AppCard key={app.id} app={app} compact />
      ))}
    </div>
  );
}

/** A grid section */
function AppGrid({ apps }: { apps: AppDocument[] }) {
  if (apps.length === 0) return null;
  return (
    <div className="explore-grid">
      {apps.map((app) => (
        <AppCard key={app.id} app={app} />
      ))}
    </div>
  );
}

// ── screen ──
export default function ExploreScreen() {
  const { lang } = useLanguage();
  const [allApps, setAllApps] = useState<AppDocument[]>([]);

  useEffect(() => {
    fetchPublicApps().then(setAllApps).catch(() => {});
  }, []);

  const sorted = useMemo(() =>
    [...allApps].sort((a, b) => (b.ratingCount ?? 0) - (a.ratingCount ?? 0)),
  [allApps]);

  const hotApps = sorted.slice(0, 6);
  const climateApps = useMemo(() => allApps.filter((a) => a.category === '環保' || a.category === '自然' || a.category === '生態' || a.category === '能源' || a.category === '氣候' || a.category === 'Climate & Environment'), [allApps]);
  const techApps = useMemo(() => allApps.filter((a) => a.category === '科技' || a.category === '醫療' || a.category === '創意' || a.category === '遊戲' || a.category === '語言' || a.category === 'AI & Technology'), [allApps]);
  const lifeApps = useMemo(() => allApps.filter((a) => a.category === '生活' || a.category === '入門' || a.category === '安全' || a.category === '媒體' || a.category === '閱讀' || a.category === '家庭' || a.category === '感官' || a.category === '科學' || a.category === '生態' || a.category === 'Knowledge & Life'), [allApps]);

  return (
    <div className="screen screen--explore">
      <div className="screen-header">
        <h1 className="screen-header__title">{tKey('screen_explore', lang)}</h1>
        <p className="screen-header__subtitle">{tKey('explore_popular', lang)}</p>
      </div>

      {/* 🔥 Hot — trending now */}
      <section className="explore-section">
        <h2 className="explore-section__title">{tKey('explore_hot', lang)}</h2>
        <HotRow apps={hotApps} />
      </section>

      {/* 🌍 Climate & Environment */}
      <section className="explore-section">
        <h2 className="explore-section__title">{tKey('col_climate', lang)}</h2>
        <p className="explore-section__sub">{tKey('col_climate_sub', lang)}</p>
        <AppGrid apps={climateApps} />
      </section>

      {/* 🤖 AI & Technology */}
      <section className="explore-section">
        <h2 className="explore-section__title">{tKey('col_ai', lang)}</h2>
        <p className="explore-section__sub">{tKey('col_ai_sub', lang)}</p>
        <AppGrid apps={techApps} />
      </section>

      {/* 📚 Knowledge & Life */}
      <section className="explore-section">
        <h2 className="explore-section__title">{tKey('col_life', lang)}</h2>
        <p className="explore-section__sub">{tKey('col_life_sub', lang)}</p>
        <AppGrid apps={lifeApps} />
      </section>

      <div className="screen-spacer" />
    </div>
  );
}
