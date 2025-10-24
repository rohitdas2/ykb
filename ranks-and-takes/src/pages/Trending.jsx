import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { trendingTopics, trendingPlayers, trendingTeams, isTrending, getTrendingInfo } from '../utils/trendingData';
import '../styles/Pages.css';

const Trending = () => {
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState('today');
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      performSearch(searchQuery, searchType);
    }
  };

  const performSearch = (query, type = searchType) => {
    if (!query.trim()) return;

    const queryLower = query.toLowerCase().trim();
    console.log('Searching for:', query, 'Type:', type);

    // Create all possible results
    const allResults = [
      // Players
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
        id: 6,
        type: 'player',
        name: 'Luka Doncic',
        team: 'Dallas Mavericks',
        icon: '🏀'
      },
      {
        id: 7,
        type: 'player',
        name: 'Giannis Antetokounmpo',
        team: 'Milwaukee Bucks',
        icon: '🏀'
      },
      {
        id: 8,
        type: 'player',
        name: 'Damian Lillard',
        team: 'Portland Trail Blazers',
        icon: '🏀'
      },
      {
        id: 15,
        type: 'player',
        name: 'Kevin Durant',
        team: 'Phoenix Suns',
        icon: '🏀'
      },
      // Teams
      {
        id: 3,
        type: 'team',
        name: 'Boston Celtics',
        record: '64-18',
        icon: '🟢'
      },
      {
        id: 9,
        type: 'team',
        name: 'Los Angeles Lakers',
        record: '56-26',
        icon: '🟣'
      },
      {
        id: 10,
        type: 'team',
        name: 'Denver Nuggets',
        record: '57-25',
        icon: '🟠'
      },
      {
        id: 11,
        type: 'team',
        name: 'Phoenix Suns',
        record: '62-20',
        icon: '☀️'
      },
      // Topics
      {
        id: 12,
        type: 'topic',
        tag: '#MVPRace',
        description: 'Who deserves MVP this season?',
        icon: '🏆'
      },
      {
        id: 13,
        type: 'topic',
        tag: '#Draft2024',
        description: 'Upcoming draft picks and prospects',
        icon: '🎯'
      },
      {
        id: 14,
        type: 'topic',
        tag: '#Playoffs',
        description: 'Playoff seeding and matchups',
        icon: '🏅'
      },
      {
        id: 16,
        type: 'topic',
        tag: '#TradeDeadline',
        description: 'Team upgrades and rumors',
        icon: '🔄'
      },
      // Users
      {
        id: 4,
        type: 'user',
        name: 'Basketball Analysis',
        handle: '@basketballanalysis',
        icon: '👤'
      }
    ];

    // Filter results based on search query and type
    let filtered = allResults.filter(result => {
      const matchesQuery =
        result.name?.toLowerCase().includes(queryLower) ||
        result.tag?.toLowerCase().includes(queryLower) ||
        result.handle?.toLowerCase().includes(queryLower) ||
        result.description?.toLowerCase().includes(queryLower) ||
        result.team?.toLowerCase().includes(queryLower);

      const matchesType = type === 'all' || result.type === type;

      return matchesQuery && matchesType;
    });

    // Add trending information to results
    filtered = filtered.map(result => ({
      ...result,
      isTrending: isTrending(result.name || result.tag, result.type),
      trendingInfo: getTrendingInfo(result.name || result.tag, result.type)
    }));

    // Sort trending results first
    filtered.sort((a, b) => b.isTrending - a.isTrending);

    setSearchResults(filtered);
    setHasSearched(true);
  };

  return (
    <div className="page-container">
      <header className="app-header">
        <div className="header-left">
          <h1>Ranks & Takes</h1>
        </div>
        <div className="header-center">
          <nav className="main-nav">
            <a href="/rankings" className="nav-item">Rankings</a>
            <a href="/player-stats" className="nav-item">Player Stats</a>
            <a href="/home" className="nav-item">Home</a>
            <a href="/trending" className="nav-item active">Search</a>
            <a href="/profile" className="nav-item">Profile</a>
          </nav>
        </div>
        <div className="header-right">
          <button className="btn btn-icon">🔔</button>
        </div>
      </header>

      <main className="main-content">
        <div className="content-wrapper">
          <div className="feed-section">
            <div className="page-title">
              <h2>Search & Trending</h2>
              <p>Find players, teams, or explore what's trending</p>
            </div>

            {/* Search Bar */}
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
              </div>
            </form>

            {/* Search Results or Trending Content */}
            {hasSearched ? (
              <div className="search-results">
                {searchResults.length > 0 ? (
                  <>
                    <p className="results-count">
                      Found {searchResults.length} results for "{searchQuery}"
                    </p>
                    <div className="results-list">
                      {searchResults.map((result) => {
                        const handleClick = () => {
                          if (result.type === 'player') {
                            navigate(`/player/${encodeURIComponent(result.name)}`);
                          } else if (result.type === 'team') {
                            navigate(`/team/${result.name}`);
                          }
                        };

                        return (
                          <div
                            key={result.id}
                            className={`result-item ${result.isTrending ? 'trending-result' : ''} ${(result.type === 'player' || result.type === 'team') ? 'clickable' : ''}`}
                            onClick={handleClick}
                            style={(result.type === 'player' || result.type === 'team') ? { cursor: 'pointer' } : {}}
                          >
                            <span className="result-icon">{result.icon}</span>
                            <div className="result-info">
                              <div className="result-header">
                                <p className="result-name">
                                  {result.name || result.tag}
                                  {result.isTrending && <span className="trending-badge">🔥 Trending</span>}
                                </p>
                              </div>
                              {result.type === 'player' && (
                                <p className="result-detail">{result.team}</p>
                              )}
                              {result.type === 'team' && (
                                <p className="result-detail">{result.record}</p>
                              )}
                              {result.type === 'topic' && (
                                <p className="result-detail">{result.description}</p>
                              )}
                              {result.type === 'user' && (
                                <p className="result-detail">{result.handle}</p>
                              )}
                              {result.isTrending && result.trendingInfo && (
                                <div className="trending-details">
                                  {result.type === 'player' && (
                                    <span className="trend-stat">{result.trendingInfo.mentions?.toLocaleString()} mentions</span>
                                  )}
                                  {result.type === 'team' && (
                                    <span className="trend-stat">{result.trendingInfo.mentions?.toLocaleString()} mentions</span>
                                  )}
                                  {result.type === 'topic' && (
                                    <span className="trend-stat">{result.trendingInfo.takes?.toLocaleString()} takes</span>
                                  )}
                                  <span className={`trend-indicator ${result.trendingInfo.trend.includes('↑') ? 'up' : result.trendingInfo.trend.includes('↓') ? 'down' : 'neutral'}`}>
                                    {result.trendingInfo.trend}
                                  </span>
                                </div>
                              )}
                            </div>
                            {(result.type === 'player' || result.type === 'team') && (
                              <button className="btn btn-small">View →</button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="empty-state">
                    <p>😕 No results found</p>
                    <small>Try searching for something else</small>
                  </div>
                )}
              </div>
            ) : (
              <>
                {(true) && (
              <div className="trending-section">
                <h3>Trending Topics</h3>
                <div className="trending-list">
                  {trendingTopics.map((topic, idx) => (
                    <div key={topic.id} className="trending-card">
                      <div className="trending-rank">{idx + 1}</div>
                      <div className="trending-icon">{topic.icon}</div>
                      <div className="trending-content">
                        <p className="trending-tag">{topic.tag}</p>
                        <p className="trending-description">{topic.description}</p>
                      </div>
                      <div className="trending-stats">
                        <p className="stat-value">{topic.takes.toLocaleString()}</p>
                        <p className="stat-label">Takes</p>
                      </div>
                      <div className={`trending-change ${topic.trend.includes('↑') ? 'up' : topic.trend.includes('↓') ? 'down' : 'neutral'}`}>
                        {topic.trend}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(true) && (
              <div className="trending-section">
                <h3>Trending Players</h3>
                <div className="trending-list">
                  {trendingPlayers.map((player, idx) => (
                    <div key={player.id} className="trending-card">
                      <div className="trending-rank">{idx + 1}</div>
                      <div className="trending-icon">{player.icon}</div>
                      <div className="trending-content">
                        <p className="trending-tag">{player.name}</p>
                        <p className="trending-description">{player.team}</p>
                      </div>
                      <div className="trending-stats">
                        <p className="stat-value">{player.mentions.toLocaleString()}</p>
                        <p className="stat-label">Mentions</p>
                      </div>
                      <div className={`trending-change ${player.trend.includes('↑') ? 'up' : player.trend.includes('↓') ? 'down' : 'neutral'}`}>
                        {player.trend}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(true) && (
              <div className="trending-section">
                <h3>Trending Teams</h3>
                <div className="trending-list">
                  {[
                    { id: 1, name: 'Boston Celtics', logo: '🟢', mentions: 15200, trend: '↑ 14%' },
                    { id: 2, name: 'Los Angeles Lakers', logo: '🟣', mentions: 12800, trend: '↑ 9%' },
                    { id: 3, name: 'Denver Nuggets', logo: '🟠', mentions: 9400, trend: '↑ 6%' },
                    { id: 4, name: 'Phoenix Suns', logo: '☀️', mentions: 8200, trend: '↓ 2%' },
                  ].map((team, idx) => (
                    <div key={team.id} className="trending-card">
                      <div className="trending-rank">{idx + 1}</div>
                      <div className="trending-icon">{team.logo}</div>
                      <div className="trending-content">
                        <p className="trending-tag">{team.name}</p>
                        <p className="trending-description">NBA Team</p>
                      </div>
                      <div className="trending-stats">
                        <p className="stat-value">{team.mentions.toLocaleString()}</p>
                        <p className="stat-label">Mentions</p>
                      </div>
                      <div className={`trending-change ${team.trend.includes('↑') ? 'up' : team.trend.includes('↓') ? 'down' : 'neutral'}`}>
                        {team.trend}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <aside className="sidebar">
            <div className="sidebar-card">
              <h3>What's Trending?</h3>
              <div className="info-box">
                <p>Our trending algorithm combines:</p>
                <ul>
                  <li>Volume of takes posted</li>
                  <li>Growth rate (% change)</li>
                  <li>Engagement (likes, ratings)</li>
                  <li>User influence scores</li>
                </ul>
              </div>
            </div>

            <div className="sidebar-card">
              <h3>Featured Matches</h3>
              <div className="matches-list">
                <div className="match-item">
                  <div className="match-teams">
                    <span>🟢 Celtics</span>
                    <span className="vs">vs</span>
                    <span>🟣 Lakers</span>
                  </div>
                  <p className="match-time">Tomorrow, 8:00 PM</p>
                </div>
                <div className="match-item">
                  <div className="match-teams">
                    <span>☀️ Suns</span>
                    <span className="vs">vs</span>
                    <span>⚡ Nuggets</span>
                  </div>
                  <p className="match-time">Tomorrow, 10:00 PM</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Trending;
