import { useState, useMemo } from 'react';
import { useUIStore } from '../../store';
import { useLanguage, tKey } from '../../i18n';
import { stories } from '../../data/content';
import { playableApps } from '../../data/playableApps';

function HeroStory({ story }: { story: typeof stories[number] & { appId?: string; appType?: 'story' | 't2q_quiz' } }) {
  const { previewApp } = useUIStore();
  return (
    <button type="button" className="hero-story" onClick={() => {
      if (story.appId) previewApp(story.appId, story.appType ?? 'story');
    }} style={{ backgroundColor: story.backgroundColor ?? 'var(--bg-secondary)' }}>
      <div className="hero-story__content">
        <span className="hero-story__legend">{story.legend}</span>
        <h2 className="hero-story__title">{story.title}</h2>
        <span className="hero-story__subtitle">{story.subtitle}</span>
      </div>
      <div className="hero-story__logo">📦</div>
    </button>
  );
}

function StoryCircle({ story }: { story: typeof stories[number] & { appId?: string; appType?: 'story' | 't2q_quiz' } }) {
  const { previewApp } = useUIStore();
  return (
    <button type="button" className="story-circle" onClick={() => {
      if (story.appId) previewApp(story.appId, story.appType ?? 'story');
    }}>
      <div className="story-circle__ring" style={{ borderColor: story.backgroundColor ?? 'var(--play-blue)' }}>
        <span className="story-circle__logo">📦</span>
      </div>
      <span className="story-circle__label">{story.title}</span>
    </button>
  );
}

function PlayableRow({ title, subtitle, apps, filter }: { title: string; subtitle?: string; apps: typeof playableApps; filter: string }) {
  const { lang } = useLanguage();
  const { previewApp, setTab, setAppFilter } = useUIStore();
  return (
    <section className="collection-row">
      <div className="collection-row__header">
        <div>
          <h3 className="collection-row__title">{title}</h3>
          {subtitle && <span className="collection-row__subtitle">{subtitle}</span>}
        </div>
        <button type="button" className="collection-row__more" onClick={() => { setAppFilter(filter); setTab('apps'); }}>
          {tKey('col_see_all', lang)}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
        </button>
      </div>
      <div className="collection-row__items collection-row__items--playable">
        {apps.slice(0, 4).map((app) => (
          <button
            key={app.id}
            type="button"
            className="content-card content-card--grid"
            onClick={() => previewApp(app.id, app.appType)}
            style={{ touchAction: 'manipulation' }}
          >
            <div className="content-card__icon-wrap">
              <div className="content-card__icon content-card__icon--placeholder-sm">📦</div>
            </div>
            <div className="content-card__info">
              <span className="content-card__title">{app.title}</span>
              <span className="content-card__subtitle">{app.rating} ★</span>
              <span className="content-card__badge-home">
                {app.appType === 't2q_quiz' ? 'Quiz' : 'Story'}
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

export default function HomeScreen() {
  const [heroIdx, setHeroIdx] = useState(0);
  const { lang } = useLanguage();
  const heroStories = stories.filter((s) => s.hero);
  const circleStories = stories.filter((s) => !s.hero);

  const climateApps = useMemo(() => playableApps.filter((a) => a.id.startsWith('play-c')), []);
  const techApps = useMemo(() => playableApps.filter((a) => a.id.startsWith('play-t')), []);
  const lifeApps = useMemo(() => playableApps.filter((a) => a.id.startsWith('play-l') || a.id === 'play-ai1'), []);

  return (
    <div className="screen screen--home">
      <header className="home-brand">
        <span className="home-brand__icon">📦</span>
        <h1 className="home-brand__title">StoryBox <span className="home-brand__sub">知識盒子</span></h1>
      </header>
      <div className="home-search">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <span className="home-search__text">{tKey('home_search_placeholder', lang)}</span>
      </div>
      {heroStories.length > 0 && (
        <div className="hero-slider">
          <div className="hero-slider__track" style={{ transform: `translateX(-${heroIdx * 100}%)` }}>
            {heroStories.map((s) => <div key={s.id} className="hero-slider__slide"><HeroStory story={s} /></div>)}
          </div>
          <div className="hero-slider__nav">
            {heroStories.map((_, i) => <button key={i} type="button" className={`hero-slider__dot ${i === heroIdx ? 'hero-slider__dot--active' : ''}`} onClick={() => setHeroIdx(i)} />)}
          </div>
          <button type="button" className="hero-slider__arrow hero-slider__arrow--left" onClick={() => setHeroIdx((i) => (i === 0 ? heroStories.length - 1 : i - 1))}><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="#fff" strokeWidth="2" fill="none" /></svg></button>
          <button type="button" className="hero-slider__arrow hero-slider__arrow--right" onClick={() => setHeroIdx((i) => (i + 1) % heroStories.length)}><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#fff" strokeWidth="2" fill="none" /></svg></button>
        </div>
      )}
      {circleStories.length > 0 && <div className="story-row">{circleStories.map((s) => <StoryCircle key={s.id} story={s} />)}</div>}
      <PlayableRow title={tKey('col_climate', lang)} subtitle={tKey('col_climate_sub', lang)} apps={climateApps} filter="play-c" />
      <PlayableRow title={tKey('col_ai', lang)} subtitle={tKey('col_ai_sub', lang)} apps={techApps} filter="play-t" />
      <PlayableRow title={tKey('col_life', lang)} subtitle={tKey('col_life_sub', lang)} apps={lifeApps} filter="play-l" />
      <div className="screen-spacer" />
    </div>
  );
}
