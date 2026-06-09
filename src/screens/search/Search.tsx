import { useState } from 'react';
import ContentRow from '../../components/content-row';
import { mockContents } from '../mockData';
import './Search.css';

const trends = [
  'meditation',
  'sci-fi',
  'business',
  'photography',
  'cooking',
  'racing',
];

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof mockContents>([]);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.trim()) {
      const filtered = mockContents.filter(
        (item) =>
          item.title.toLowerCase().includes(value.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(value.toLowerCase()) ||
          item.category?.toLowerCase().includes(value.toLowerCase()) ||
          item.genre?.some((g) => g.toLowerCase().includes(value.toLowerCase())),
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  };

  return (
    <div className="search-screen">
      <div className="search-screen__bar">
        <input
          type="search"
          className="search-screen__input"
          placeholder="Search movies, books & apps"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {query ? (
        <div className="search-screen__results">
          {results.length > 0 ? (
            results.map((item) => (
              <ContentRow
                key={item.id}
                id={item.id}
                title={item.title}
                subtitle={item.subtitle}
                iconUrl={item.iconUrl}
                rating={item.rating}
                ratingCount={item.ratingCount}
                divider
              />
            ))
          ) : (
            <p className="search-screen__empty">No results for "{query}"</p>
          )}
        </div>
      ) : (
        <div className="search-screen__trending">
          <h2 className="search-screen__trending-title">Trending searches</h2>
          <div className="search-screen__trending-list">
            {trends.map((term) => (
              <button
                key={term}
                type="button"
                className="search-screen__trend"
                onClick={() => handleSearch(term)}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
