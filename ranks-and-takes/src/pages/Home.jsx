import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import '../styles/Pages.css';

const Home = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('feed');
  const [nbaGames, setNbaGames] = useState([]);
  const [loadingGames, setLoadingGames] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 9, 23)); // Oct 23, 2025
  const [takes, setTakes] = useState([
    {
      id: 1,
      author: 'SportsNerd23',
      displayName: 'James Chen',
      avatar: '👨‍🦱',
      take: 'Jayson Tatum is the most underrated two-way player in the NBA right now',
      rank: 8.5,
      numRatings: 1203,
      timestamp: '2 hours ago',
      likes: 523,
      comments: 148,
      tags: ['NBA', 'Celtics', 'Analysis']
    },
    {
      id: 2,
      author: 'KnicksFan92',
      displayName: 'Maria Rodriguez',
      avatar: '👩‍🦱',
      take: 'The Knicks will make the Finals within 2 years',
      rank: 7.2,
      numRatings: 856,
      timestamp: '4 hours ago',
      likes: 412,
      comments: 98,
      tags: ['NBA', 'Knicks', 'Prediction']
    },
    {
      id: 3,
      author: 'AnalyticsBro',
      displayName: 'Alex Kim',
      avatar: '👨‍💼',
      take: 'Advanced metrics show LeBron is still elite on defense',
      rank: 9.1,
      numRatings: 2103,
      timestamp: '6 hours ago',
      likes: 892,
      comments: 234,
      tags: ['NBA', 'Lakers', 'Stats']
    }
  ]);

  const handleRateTake = (id, rating) => {
    console.log(`Rated take ${id} with score ${rating}`);
    // TODO: Send rating to backend
  };

  const handleLikeTake = (id) => {
    console.log(`Liked take ${id}`);
    // TODO: Send like to backend
  };

  const userScores = [
    { category: 'Accuracy', score: 7.8, description: 'How accurate your takes are', icon: '🎯' },
    { category: 'Popularity', score: 8.2, description: 'Community engagement', icon: '🌟' },
    { category: 'Consistency', score: 7.5, description: 'Regular posting', icon: '📈' },
    { category: 'Analysis', score: 8.0, description: 'Quality of takes', icon: '📊' },
  ];

  // Fetch NBA games from Balldontlie API for selected date
  useEffect(() => {
    const fetchNBAGames = async () => {
      setLoadingGames(true);
      try {
        // Format date as YYYY-MM-DD for API
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        const response = await fetch(`https://api.balldontlie.io/v1/games?dates[]=${dateStr}&per_page=50`);
        const data = await response.json();
        setNbaGames(data.data || []);
      } catch (error) {
        console.error('Error fetching NBA games:', error);
        setNbaGames([]);
      } finally {
        setLoadingGames(false);
      }
    };

    fetchNBAGames();
    // Refresh every 30 seconds for live updates
    const interval = setInterval(fetchNBAGames, 30000);
    return () => clearInterval(interval);
  }, [selectedDate]);

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
            <a href="/home" className="nav-item active">Home</a>
            <a href="/trending" className="nav-item">Search</a>
            <a href="/profile" className="nav-item">Profile</a>
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
            {/* Tabs */}
            <div className="home-tabs">
              <button
                className={`tab ${activeTab === 'feed' ? 'active' : ''}`}
                onClick={() => setActiveTab('feed')}
              >
                Feed
              </button>
              <button
                className={`tab ${activeTab === 'nba-scores' ? 'active' : ''}`}
                onClick={() => setActiveTab('nba-scores')}
              >
                🏀 NBA Scores
              </button>
            </div>

            {/* Feed Tab */}
            {activeTab === 'feed' && (
              <>
                <div className="create-take-box">
              <div className="create-header">
                <span className="avatar">👤</span>
                <input
                  type="text"
                  placeholder="What's your take on basketball?"
                  className="create-input"
                  onClick={() => {
                    // TODO: Open take creation modal
                    console.log('Open create take modal');
                  }}
                />
              </div>
            </div>

            {/* Takes Feed */}
            <div className="takes-list">
              {takes.map((take) => (
                <div key={take.id} className="take-card">
                  <div className="take-header">
                    <div className="author-info">
                      <span className="avatar">{take.avatar}</span>
                      <div className="author-details">
                        <p className="display-name">{take.displayName}</p>
                        <p className="username">@{take.author}</p>
                      </div>
                    </div>
                    <span className="timestamp">{take.timestamp}</span>
                  </div>

                  <div className="take-content">
                    <p className="take-text">{take.take}</p>
                    <div className="take-tags">
                      {take.tags.map((tag, idx) => (
                        <span key={idx} className="tag">#{tag}</span>
                      ))}
                    </div>
                  </div>

                  <div className="take-rating">
                    <div className="rating-display">
                      <div className="rating-score">
                        <span className="score">{take.rank}</span>
                        <span className="label">Score</span>
                      </div>
                      <div className="rating-stats">
                        <p>{take.numRatings.toLocaleString()} ratings</p>
                      </div>
                    </div>
                  </div>

                  <div className="rating-buttons">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                      <button
                        key={rating}
                        className="rating-btn"
                        onClick={() => handleRateTake(take.id, rating)}
                        title={`Rate ${rating}/10`}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>

                  <div className="take-actions">
                    <button className="action-btn">
                      💬 {take.comments}
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => handleLikeTake(take.id)}
                    >
                      ❤️ {take.likes}
                    </button>
                    <button className="action-btn">
                      ⤴️ Share
                    </button>
                  </div>
                </div>
              ))}
            </div>
              </>
            )}

            {/* NBA Scores Tab */}
            {activeTab === 'nba-scores' && (
              <div className="nba-scores-section">
                <div className="nba-header">
                  <h2>NBA Games</h2>
                  <p>Real-time scores and game updates</p>
                </div>

                {/* Scrollable Calendar */}
                <div className="games-calendar-scroll">
                  <div className="calendar-dates">
                    {Array.from({ length: 14 }, (_, i) => {
                      const date = new Date(selectedDate);
                      date.setDate(date.getDate() - 7 + i);
                      const isSelected = date.toDateString() === selectedDate.toDateString();
                      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                      const dayStr = date.toLocaleDateString('en-US', { weekday: 'short' });

                      return (
                        <button
                          key={i}
                          className={`calendar-date ${isSelected ? 'active' : ''}`}
                          onClick={() => setSelectedDate(date)}
                        >
                          <span className="date-day">{dayStr}</span>
                          <span className="date-number">{dateStr}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {loadingGames ? (
                  <div className="loading-state">
                    <p>Loading games...</p>
                  </div>
                ) : nbaGames.length > 0 ? (
                  <div className="nba-games-list">
                    {nbaGames.map((game) => (
                      <div key={game.id} className="nba-game-card">
                        <div className="game-status">
                          {game.status === 'Final' ? (
                            <span className="status-badge final">Final</span>
                          ) : game.status === 'In Progress' ? (
                            <span className="status-badge live">Live</span>
                          ) : (
                            <span className="status-badge scheduled">Scheduled</span>
                          )}
                        </div>

                        <div className="game-matchup">
                          <div className="team home-team">
                            <div className="team-name">{game.home_team?.full_name}</div>
                            <div className="team-score">{game.home_team_score || 0}</div>
                          </div>

                          <div className="game-vs">
                            <span className="vs-text">VS</span>
                          </div>

                          <div className="team away-team">
                            <div className="team-name">{game.visitor_team?.full_name}</div>
                            <div className="team-score">{game.visitor_team_score || 0}</div>
                          </div>
                        </div>

                        <div className="game-details">
                          <p className="game-date">
                            {new Date(game.date).toLocaleDateString()} {' '}
                            {new Date(game.date).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          {game.period > 0 && game.status !== 'Final' && (
                            <p className="game-period">Q{game.period}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>😴 No games available right now</p>
                    <small>Check back later for upcoming games</small>
                  </div>
                )}

                <div className="api-credit">
                  <small>Data provided by BallDontLie API</small>
                </div>
              </div>
            )}

          </div>

          {/* Sidebar */}
          <aside className="sidebar">
            <div className="sidebar-card">
              <h3>Trending Topics</h3>
              <div className="trending-list">
                <div className="trending-item">
                  <p className="trending-tag">#MVP Race</p>
                  <p className="trending-stats">45K takes</p>
                </div>
                <div className="trending-item">
                  <p className="trending-tag">#Draft 2024</p>
                  <p className="trending-stats">32K takes</p>
                </div>
                <div className="trending-item">
                  <p className="trending-tag">#Playoffs</p>
                  <p className="trending-stats">28K takes</p>
                </div>
                <div className="trending-item">
                  <p className="trending-tag">#TradeRumors</p>
                  <p className="trending-stats">19K takes</p>
                </div>
              </div>
            </div>

            <div className="sidebar-card">
              <h3>Who to Follow</h3>
              <div className="follow-list">
                <div className="follow-item">
                  <span className="avatar">🏀</span>
                  <div className="follow-info">
                    <p className="name">NBA Stats Daily</p>
                    <p className="handle">@nbastatsdaily</p>
                  </div>
                  <button className="btn btn-small">Follow</button>
                </div>
                <div className="follow-item">
                  <span className="avatar">📊</span>
                  <div className="follow-info">
                    <p className="name">Hoops Analysis</p>
                    <p className="handle">@hoopsanalysis</p>
                  </div>
                  <button className="btn btn-small">Follow</button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Home;
