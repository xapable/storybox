import { books } from '../../data/content';
import ContentCard from '../../components/content-card';

export default function BooksScreen() {
  return (
    <div className="screen screen--books">
      <div className="screen-header">
        <h1 className="screen-header__title">Books</h1>
      </div>

      <div className="content-list">
        {books.map((book) => (
          <ContentCard key={book.id} item={book} variant="list" />
        ))}
      </div>

      <div className="screen-spacer" />
    </div>
  );
}
