import { useState } from 'react';
import Heading from '../../components/heading';
import ContentRow from '../../components/content-row';
import { mockContents } from '../mockData';
import './Movies.css';

export default function Movies() {
  const [movies] = useState(mockContents.filter((c) => c.contentType === 'MOVIE'));

  return (
    <div className="movies-screen">
      <div className="movies-screen__header">
        <Heading level={1}>Movies</Heading>
      </div>
      <div className="movies-screen__list">
        {movies.map((movie) => (
          <ContentRow
            key={movie.id}
            id={movie.id}
            title={movie.title}
            subtitle={movie.subtitle}
            iconUrl={movie.iconUrl}
            action={{
              label: movie.price ? `$${movie.price}` : 'RENT',
            }}
            rating={movie.rating}
            ratingCount={movie.ratingCount}
            divider
          />
        ))}
      </div>
    </div>
  );
}
