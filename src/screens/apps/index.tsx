import { useState, useEffect } from 'react';
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

  useEffect(() => {
    fetchPublicApps().then((fetched) => {
      if (fetched.length > 0) {
        const firebaseIds = new Set(fetched.map((a) => a.id));
        const merged = [...fetched, ...playableApps.filter((a) => !firebaseIds.has(a.id))];
        setAllApps(merged);
      }
    }).catch(() => {});
  }, []);

  const filteredApps = state.appFilter
    ? allApps.filter((a) => a.id.startsWith(state.appFilter!) || (state.appFilter === 'play-l' && (a.id === 'play-ai1' || a.id === 'play-auto')))
    : allApps;

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
      <div className="content-list">
        {filteredApps.map((app) => (
          <QuizAppCard key={app.id} app={app} onPlay={() => previewApp(app.id, app.appType)} />
        ))}
      </div>
      <div className="screen-spacer" />
    </div>
  );
}
