import { useState } from 'react';
import Heading from '../../components/heading';
import ContentRow from '../../components/content-row';
import { mockContents } from '../mockData';
import '../movies/Movies.css';

export default function Books() {
  const [books] = useState(mockContents.filter((c) => c.contentType === 'BOOK'));

  return (
    <div className="movies-screen">
      <div className="movies-screen__header">
        <Heading level={1}>Books</Heading>
      </div>
      <div className="movies-screen__list">
        {books.map((book) => (
          <ContentRow
            key={book.id}
            id={book.id}
            title={book.title}
            subtitle={book.subtitle}
            iconUrl={book.iconUrl}
            action={{
              label: book.price ? `$${book.price}` : 'FREE',
            }}
            rating={book.rating}
            ratingCount={book.ratingCount}
            divider
          />
        ))}
      </div>
    </div>
  );
}
