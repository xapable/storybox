import { useMemo } from 'react';
import { useLanguage, tKey } from '../../i18n';
import { useUIStore } from '../../store';
import { playableApps } from '../../data/playableApps';
import QuizAppCard from '../../components/quiz-app-card';

export default function ExploreScreen() {
  const { lang } = useLanguage();
  const { previewApp } = useUIStore();

  const sorted = useMemo(() =>
    [...playableApps].sort((a, b) => (b.ratingCount ?? 0) - (a.ratingCount ?? 0)),
  []);

  return (
    <div className="screen screen--explore">
      <div className="screen-header">
        <h1 className="screen-header__title">{tKey('screen_explore', lang)}</h1>
      </div>
      <div className="content-list">
        {sorted.map((app) => (
          <QuizAppCard key={app.id} app={app} onPlay={() => previewApp(app.id, app.appType)} />
        ))}
      </div>
      <div className="screen-spacer" />
    </div>
  );
}
