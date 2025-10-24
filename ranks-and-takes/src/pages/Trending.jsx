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

  const trendingTopics = [
    {
      id: 1,
      tag: '#MVPRace',
      takes: 45230,
      trend: '↑ 12%',
      description: 'Who deserves MVP this season?',
      icon: '🏆'
    },
    {
      id: 2,
      tag: '#CelticsRevolution',
      takes: 38920,
      trend: '↑ 8%',
      description: 'Best team in the league discussion',
      icon: '🟢'
    },
    {
      id: 3,
      tag: '#LakeShow',
      takes: 32150,
      trend: '↑ 5%',
      description: 'Lakers championship contention',
      icon: '🟣'
    },
    {
      id: 4,
      tag: '#TradeDeadline',
      takes: 28940,
      trend: '↑ 15%',
      description: 'Team upgrades and rumors',
      icon: '🔄'
    },
    {
      id: 5,
      tag: '#PlayoffRun',
      takes: 25100,
      trend: '→ 2%',
      description: 'Playoff seeding and matchups',
      icon: '🏅'
    },
    {
      id: 6,
      tag: '#Draft2024',
      takes: 19230,
      trend: '↑ 22%',
      description: 'Upcoming draft picks and prospects',
      icon: '🎯'
    },
  ];

  const trendingPlayers = [
    {
      id: 1,
      name: 'Jayson Tatum',
      team: 'Celtics',
      mentions: 12340,
      trend: '↑ 18%',
      icon: '🏀'
    },
    {
      id: 2,
      name: 'Luka Doncic',
      team: 'Mavericks',
      mentions: 11200,
      trend: '↑ 10%',
      icon: '🏀'
    },
    {
      id: 3,
      name: 'Giannis Antetokounmpo',
      team: 'Bucks',
      mentions: 9800,
      trend: '↑ 7%',
      icon: '🏀'
    },
    {
      id: 4,
      name: 'LeBron James',
      team: 'Lakers',
      mentions: 8900,
      trend: '↓ 3%',
      icon: '🏀'
    },
    {
      id: 5,
      name: 'Damian Lillard',
      team: 'Trail Blazers',
      mentions: 7650,
      trend: '↑ 25%',
      icon: '🏀'
    },
  ];

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
            <a href="/trending" className="nav-item active">Trending</a>
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
              <h2>Trending Now</h2>
              <p>What's hot in basketball takes</p>
            </div>

            <div className="trending-filters">
              <div className="filter-group">
                <label>Timeframe:</label>
                <button
                  className={`filter-btn ${timeframe === 'hour' ? 'active' : ''}`}
                  onClick={() => setTimeframe('hour')}
                >
                  Last Hour
                </button>
                <button
                  className={`filter-btn ${timeframe === 'today' ? 'active' : ''}`}
                  onClick={() => setTimeframe('today')}
                >
                  Today
                </button>
                <button
                  className={`filter-btn ${timeframe === 'week' ? 'active' : ''}`}
                  onClick={() => setTimeframe('week')}
                >
                  This Week
                </button>
                <button
                  className={`filter-btn ${timeframe === 'month' ? 'active' : ''}`}
                  onClick={() => setTimeframe('month')}
                >
                  This Month
                </button>
              </div>

              <div className="filter-group">
                <label>Category:</label>
                <button
                  className={`filter-btn ${category === 'all' ? 'active' : ''}`}
                  onClick={() => setCategory('all')}
                >
                  All
                </button>
                <button
                  className={`filter-btn ${category === 'topics' ? 'active' : ''}`}
                  onClick={() => setCategory('topics')}
                >
                  Topics
                </button>
                <button
                  className={`filter-btn ${category === 'players' ? 'active' : ''}`}
                  onClick={() => setCategory('players')}
                >
                  Players
                </button>
                <button
                  className={`filter-btn ${category === 'teams' ? 'active' : ''}`}
                  onClick={() => setCategory('teams')}
                >
                  Teams
                </button>
              </div>
            </div>

            {(category === 'all' || category === 'topics') && (
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

            {(category === 'all' || category === 'players') && (
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

            {(category === 'all' || category === 'teams') && (
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
