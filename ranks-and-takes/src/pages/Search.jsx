import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Pages.css';

const Search = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setHasSearched(true);
      // TODO: Call backend API with search query
      console.log('Searching for:', searchQuery, 'Type:', searchType);

      // Mock results
      setResults([
        {
          id: 1,
          type: 'player',
          name: 'Jayson Tatum',
          team: 'Boston Celtics',
          icon: '🏀'
        },
        {
          id: 2,
          type: 'player',
          name: 'LeBron James',
          team: 'Los Angeles Lakers',
          icon: '🏀'
        },
        {
          id: 3,
          type: 'team',
          name: 'Boston Celtics',
          record: '64-18',
          icon: '🏆'
        },
        {
          id: 4,
          type: 'user',
          name: 'Basketball Analysis',
          handle: '@basketballanalysis',
          icon: '👤'
        }
      ]);
    }
  };

  const recentSearches = [
    'Luka Doncic',
    'Celtics vs Lakers',
    '#MVPRace',
    'Draft 2024',
    'Giannis'
  ];

  return (
    <div className="page-container">
      <header className="app-header">
        <div className="header-left">
          <h1>Ranks & Takes</h1>
        </div>
        <div className="header-center">
          <nav className="main-nav">
            <a href="/home" className="nav-item">Home</a>
            <a href="/rankings" className="nav-item">Rankings</a>
            <a href="/trending" className="nav-item">Search</a>
            <a href="/search" className="nav-item active">Search</a>
          </nav>
        </div>
        <div className="header-right">
          <button className="btn btn-icon">💬</button>
          <button className="btn btn-icon">🔔</button>
        </div>
      </header>

      <main className="main-content">
        <div className="content-wrapper">
          <div className="feed-section">
            <div className="page-title">
              <h2>Search</h2>
              <p>Find players, teams, users, and takes</p>
            </div>

            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder="Search players, teams, users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                  autoFocus
                />
                <button type="submit" className="btn btn-icon">🔍</button>
              </div>

              <div className="search-filters">
                <button
                  type="button"
                  className={`filter-btn ${searchType === 'all' ? 'active' : ''}`}
                  onClick={() => setSearchType('all')}
                >
                  All
                </button>
                <button
                  type="button"
                  className={`filter-btn ${searchType === 'players' ? 'active' : ''}`}
                  onClick={() => setSearchType('players')}
                >
                  Players
                </button>
                <button
                  type="button"
                  className={`filter-btn ${searchType === 'teams' ? 'active' : ''}`}
                  onClick={() => setSearchType('teams')}
                >
                  Teams
                </button>
                <button
                  type="button"
                  className={`filter-btn ${searchType === 'users' ? 'active' : ''}`}
                  onClick={() => setSearchType('users')}
                >
                  Users
                </button>
                <button
                  type="button"
                  className={`filter-btn ${searchType === 'takes' ? 'active' : ''}`}
                  onClick={() => setSearchType('takes')}
                >
                  Takes
                </button>
              </div>
            </form>

            {!hasSearched ? (
              <div className="search-suggestions">
                <div className="suggestions-section">
                  <h3>Recent Searches</h3>
                  <div className="search-list">
                    {recentSearches.map((search, idx) => (
                      <button
                        key={idx}
                        className="search-item"
                        onClick={() => {
                          setSearchQuery(search);
                          setHasSearched(true);
                        }}
                      >
                        <span>🕐</span>
                        <span>{search}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="suggestions-section">
                  <h3>Trending Topics</h3>
                  <div className="search-list">
                    <button className="search-item">
                      <span>📈</span>
                      <span>#MVPRace</span>
                    </button>
                    <button className="search-item">
                      <span>📈</span>
                      <span>#Draft2024</span>
                    </button>
                    <button className="search-item">
                      <span>📈</span>
                      <span>#Playoffs</span>
                    </button>
                    <button className="search-item">
                      <span>📈</span>
                      <span>#TradeRumors</span>
                    </button>
                  </div>
                </div>

                <div className="suggestions-section">
                  <h3>Popular Players</h3>
                  <div className="search-list">
                    <button className="search-item">
                      <span>🏀</span>
                      <span>Luka Doncic</span>
                    </button>
                    <button className="search-item">
                      <span>🏀</span>
                      <span>Giannis Antetokounmpo</span>
                    </button>
                    <button className="search-item">
                      <span>🏀</span>
                      <span>Jayson Tatum</span>
                    </button>
                    <button className="search-item">
                      <span>🏀</span>
                      <span>Kevin Durant</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="search-results">
                {results.length > 0 ? (
                  <>
                    <p className="results-count">
                      Found {results.length} results for "{searchQuery}"
                    </p>
                    <div className="results-list">
                      {results.map((result) => (
                        <div key={result.id} className="result-item">
                          <span className="result-icon">{result.icon}</span>
                          <div className="result-info">
                            <p className="result-name">{result.name}</p>
                            {result.type === 'player' && (
                              <p className="result-detail">{result.team}</p>
                            )}
                            {result.type === 'team' && (
                              <p className="result-detail">{result.record}</p>
                            )}
                            {result.type === 'user' && (
                              <p className="result-detail">{result.handle}</p>
                            )}
                          </div>
                          <button className="btn btn-small">View</button>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="empty-state">
                    <p>😕 No results found</p>
                    <small>Try searching for something else</small>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="sidebar">
            <div className="sidebar-card">
              <h3>Search Tips</h3>
              <div className="info-box">
                <ul>
                  <li>Search for player names, teams, or usernames</li>
                  <li>Use # to search for hashtags</li>
                  <li>Filter by type to narrow results</li>
                  <li>Your searches are saved for quick access</li>
                </ul>
              </div>
            </div>

            <div className="sidebar-card">
              <h3>Quick Links</h3>
              <div className="quick-links">
                <a href="/rankings" className="link">📊 View All Rankings</a>
                <a href="/trending" className="link">🔥 Trending Now</a>
                <a href="/home" className="link">🏠 Home Feed</a>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Search;
