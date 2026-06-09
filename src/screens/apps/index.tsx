import { useLanguage, tKey } from '../../i18n';
import { apps } from '../../data/content';
import ContentCard from '../../components/content-card';

export default function AppsScreen() {
  const { lang } = useLanguage();

  return (
    <div className="screen screen--apps">
      <div className="screen-header">
        <h1 className="screen-header__title">{tKey('screen_apps', lang)}</h1>
      </div>
      <div className="content-list">
        {apps.map((app) => <ContentCard key={app.id} item={app} variant="list" />)}
      </div>
      <div className="screen-spacer" />
    </div>
  );
}
