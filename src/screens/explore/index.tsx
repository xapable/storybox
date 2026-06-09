import { useLanguage, tKey } from '../../i18n';
import { useContent } from '../../data/useContent';
import ContentCard from '../../components/content-card';

export default function ExploreScreen() {
  const { lang } = useLanguage();
  const { apps, movies, books } = useContent();
  const allContent = [...apps, ...movies, ...books];

  return (
    <div className="screen screen--explore">
      <div className="screen-header">
        <h1 className="screen-header__title">{tKey('screen_explore', lang)}</h1>
      </div>
      <div className="content-list">
        {allContent.map((item) => <ContentCard key={item.id} item={item} variant="list" />)}
      </div>
      <div className="screen-spacer" />
    </div>
  );
}
