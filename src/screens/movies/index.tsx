import { movies } from '../../data/content';
import ContentCard from '../../components/content-card';

export default function MoviesScreen() {
  return (
    <div className="screen screen--movies">
      <div className="screen-header">
        <h1 className="screen-header__title">Movies</h1>
      </div>

      <div className="content-list">
        {movies.map((movie) => (
          <ContentCard key={movie.id} item={movie} variant="list" />
        ))}
      </div>

      <div className="screen-spacer" />
    </div>
  );
}
