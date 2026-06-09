import { useState } from 'react';
import { useUIStore } from '../../store';
import { useLanguage, tKey } from '../../i18n';
import { useContent } from '../../data/useContent';
import ContentCard from '../../components/content-card';
import type { Story } from '../../types';

function HeroStory({ story }: { story: Story }) {
  const { setCardOpen } = useUIStore();
  return (
    <button type="button" className="hero-story" onClick={() => { if (story.content) setCardOpen(story.content.id, true); }} style={{ backgroundColor: story.backgroundColor ?? 'var(--bg-secondary)' }}>
      <div className="hero-story__content">
        <span className="hero-story__legend">{story.legend}</span>
        <h2 className="hero-story__title">{story.title}</h2>
        <span className="hero-story__subtitle">{story.subtitle}</span>
      </div>
      {story.imageUrl && <img src={story.imageUrl} alt="" className="hero-story__image" />}
    </button>
  );
}

function StoryCircle({ story }: { story: Story }) {
  const { setCardOpen } = useUIStore();
  return (
    <button type="button" className="story-circle" onClick={() => { if (story.content) setCardOpen(story.content.id, true); }}>
      <div className="story-circle__ring" style={{ borderColor: story.backgroundColor ?? 'var(--play-blue)' }}>
        <img src={story.imageUrl} alt={story.title} className="story-circle__img" />
      </div>
      <span className="story-circle__label">{story.title}</span>
    </button>
  );
}

function CollectionRow({ collection }: { collection: ReturnType<typeof useContent>['collections'][number] }) {
  const { lang } = useLanguage();
  return (
    <section className="collection-row">
      <div className="collection-row__header">
        <div>
          <h3 className="collection-row__title">{collection.title}</h3>
          {collection.subtitle && <span className="collection-row__subtitle">{collection.subtitle}</span>}
        </div>
        <button type="button" className="collection-row__more">
          {tKey('col_see_all', lang)}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
        </button>
      </div>
      <div className="collection-row__items">
        {collection.items.slice(0, 4).map((item) => <ContentCard key={item.id} item={item} variant="grid" />)}
      </div>
    </section>
  );
}

export default function HomeScreen() {
  const [heroIdx, setHeroIdx] = useState(0);
  const { lang } = useLanguage();
  const { stories, collections } = useContent();
  const heroStories = stories.filter((s) => s.hero);
  const circleStories = stories.filter((s) => !s.hero);

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
      {collections.map((col) => <CollectionRow key={col.id} collection={col} />)}
      <div className="screen-spacer" />
    </div>
  );
}
