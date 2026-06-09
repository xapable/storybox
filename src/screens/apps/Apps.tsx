import { useState } from 'react';
import Heading from '../../components/heading';
import ContentRow from '../../components/content-row';
import { mockContents } from '../mockData';
import '../movies/Movies.css';

export default function Apps() {
  const [apps] = useState(mockContents.filter((c) => c.contentType === 'APP'));

  return (
    <div className="movies-screen">
      <div className="movies-screen__header">
        <Heading level={1}>Apps & Games</Heading>
      </div>
      <div className="movies-screen__list">
        {apps.map((app) => (
          <ContentRow
            key={app.id}
            id={app.id}
            title={app.title}
            subtitle={app.subtitle}
            iconUrl={app.iconUrl}
            action={{
              label: app.price ? `$${app.price}` : 'INSTALL',
            }}
            rating={app.rating}
            ratingCount={app.ratingCount}
            divider
          />
        ))}
      </div>
    </div>
  );
}
