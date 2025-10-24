import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import '../styles/Pages.css';

const Profile = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [activeTab, setActiveTab] = useState('takes');
  const [isEditing, setIsEditing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userScores = [
    { category: 'Accuracy', score: 7.8, description: 'How accurate your takes are', icon: '🎯' },
    { category: 'Popularity', score: 8.2, description: 'Community engagement', icon: '🌟' },
    { category: 'Consistency', score: 7.5, description: 'Regular posting', icon: '📈' },
    { category: 'Analysis', score: 8.0, description: 'Quality of takes', icon: '📊' },
  ];

  const followers = [
    { id: 1, name: 'Sports Analyst', handle: '@sportsanalyst', avatar: '👨‍💼' },
    { id: 2, name: 'Hoops Lover', handle: '@hoopslover', avatar: '👩‍🦱' },
    { id: 3, name: 'Basketball Eyes', handle: '@basketballeyes', avatar: '👨‍🦨' },
    { id: 4, name: 'Stats Nerd', handle: '@statsnerd', avatar: '👩‍💻' },
  ];

  const userTakes = [
    {
      id: 1,
      take: 'The Celtics are the most complete team in the NBA this season',
      rank: 8.2,
      numRatings: 523,
      likes: 234,
      timestamp: '2 days ago'
    },
    {
      id: 2,
      take: 'Jayson Tatum is a top-5 player in the league',
      rank: 8.7,
      numRatings: 812,
      likes: 456,
      timestamp: '5 days ago'
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
            <a href="/trending" className="nav-item">Trending</a>
            <a href="/profile" className="nav-item">Profile</a>
          </nav>
        </div>
        <div className="header-right">
          <button className="btn btn-icon">🔔</button>
        </div>
      </header>

      <main className="main-content profile-page">
        <div className="profile-header">
          <div className="profile-cover">
          </div>

          <div className="profile-info">
            <div className="profile-avatar">👤</div>
            <div className="profile-details">
              <h2>{user?.displayName || 'Your Name'}</h2>
              <p className="profile-username">@{user?.username || 'username'}</p>
              <p className="profile-bio">Basketball enthusiast & takes connoisseur</p>
              <div className="profile-stats">
                <div className="stat">
                  <span className="stat-value">34</span>
                  <span className="stat-label">Takes</span>
                </div>
                <div className="stat" style={{ cursor: 'pointer' }} onClick={() => setShowFollowers(true)}>
                  <span className="stat-value" style={{ color: '#00274C' }}>2.4K</span>
                  <span className="stat-label">Followers</span>
                </div>
                <div className="stat">
                  <span className="stat-value">856</span>
                  <span className="stat-label">Following</span>
                </div>
                <div className="stat">
                  <span className="stat-value">7.8</span>
                  <span className="stat-label">Avg Rating</span>
                </div>
              </div>
            </div>

            {!isEditing && (
              <div className="profile-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowSettings(true)}
                >
                  ⚙️ Settings
                </button>
              </div>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="edit-profile-section">
            <h3>Edit Profile</h3>
            <form className="edit-form">
              <div className="form-group">
                <label>Display Name</label>
                <input type="text" defaultValue={user?.displayName} />
              </div>
              <div className="form-group">
                <label>Bio</label>
                <textarea rows="3" placeholder="Tell us about yourself"></textarea>
              </div>
              <div className="form-group">
                <label>Favorite Team</label>
                <select>
                  <option>Select a team...</option>
                  <option>Boston Celtics</option>
                  <option>Los Angeles Lakers</option>
                  <option>Golden State Warriors</option>
                  <option>Denver Nuggets</option>
                  <option>Phoenix Suns</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-primary" onClick={() => setIsEditing(false)}>
                  Save Changes
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="content-wrapper">
          <div className="feed-section">
            <div className="profile-tabs">
              <button
                className={`tab ${activeTab === 'takes' ? 'active' : ''}`}
                onClick={() => setActiveTab('takes')}
              >
                Takes ({userTakes.length})
              </button>
              <button
                className={`tab ${activeTab === 'scores' ? 'active' : ''}`}
                onClick={() => setActiveTab('scores')}
              >
                My Scores
              </button>
              <button
                className={`tab ${activeTab === 'ratings' ? 'active' : ''}`}
                onClick={() => setActiveTab('ratings')}
              >
                Ratings (124)
              </button>
              <button
                className={`tab ${activeTab === 'likes' ? 'active' : ''}`}
                onClick={() => setActiveTab('likes')}
              >
                Likes (89)
              </button>
            </div>

            {activeTab === 'takes' && (
              <div className="takes-list">
                {userTakes.map((take) => (
                  <div key={take.id} className="take-card">
                    <div className="take-content">
                      <p className="take-text">{take.take}</p>
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

                    <div className="take-actions">
                      <button className="action-btn">
                        💬
                      </button>
                      <button className="action-btn">
                        ❤️ {take.likes}
                      </button>
                      <button className="action-btn">
                        ⤴️
                      </button>
                      <button className="action-btn delete">
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'ratings' && (
              <div className="empty-state">
                <p>📊 View all your ratings here</p>
                <small>You've rated 124 takes so far</small>
              </div>
            )}

            {activeTab === 'likes' && (
              <div className="empty-state">
                <p>❤️ Liked takes will appear here</p>
                <small>You've liked 89 takes</small>
              </div>
            )}

            {activeTab === 'scores' && (
              <div className="scores-section">
                <div className="scores-header">
                  <h2>Your Stats & Scores</h2>
                  <p>Track your performance and community reputation</p>
                </div>

                <div className="scores-grid">
                  {userScores.map((score, idx) => (
                    <div key={idx} className="score-card">
                      <div className="score-icon">{score.icon}</div>
                      <div className="score-content">
                        <h3>{score.category}</h3>
                        <p className="score-description">{score.description}</p>
                      </div>
                      <div className="score-value">
                        <span className="score-number">{score.score}</span>
                        <span className="score-max">/10</span>
                      </div>
                      <div className="score-bar">
                        <div className="score-progress" style={{ width: `${score.score * 10}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="scores-summary">
                  <div className="summary-stat">
                    <p className="summary-label">Average Score</p>
                    <p className="summary-value">7.9</p>
                  </div>
                  <div className="summary-stat">
                    <p className="summary-label">Total Takes</p>
                    <p className="summary-value">34</p>
                  </div>
                  <div className="summary-stat">
                    <p className="summary-label">Community Rank</p>
                    <p className="summary-value">#247</p>
                  </div>
                  <div className="summary-stat">
                    <p className="summary-label">Followers</p>
                    <p className="summary-value">2.4K</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="sidebar">
            <div className="sidebar-card">
              <h3>Achievements</h3>
              <div className="achievements-list">
                <div className="achievement">
                  <span className="icon">🏆</span>
                  <p>Verified User</p>
                </div>
                <div className="achievement">
                  <span className="icon">💬</span>
                  <p>20+ Takes</p>
                </div>
                <div className="achievement">
                  <span className="icon">⭐</span>
                  <p>Avg 7.5+ Rating</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Settings Modal */}
      {showSettings && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Settings</h2>
              <button className="modal-close" onClick={() => setShowSettings(false)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="settings-section">
                <h3>Account Details</h3>
                <div className="account-info">
                  <p><strong>Email:</strong> {user?.email || 'user@example.com'}</p>
                  <p><strong>Phone:</strong> {user?.phoneNumber || '+1 (555) 000-0000'}</p>
                  <p><strong>Username:</strong> @{user?.username || 'username'}</p>
                  <p><strong>Joined:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}</p>
                  <p><strong>Verified:</strong> ✓ Phone</p>
                </div>
              </div>

              <div className="settings-section">
                <h3>Preferences</h3>
                <div className="preference-item">
                  <label>
                    <input type="checkbox" defaultChecked />
                    <span>Email notifications</span>
                  </label>
                </div>
                <div className="preference-item">
                  <label>
                    <input type="checkbox" defaultChecked />
                    <span>Game updates</span>
                  </label>
                </div>
              </div>

              <div className="settings-section">
                <h3>Danger Zone</h3>
                <button className="btn btn-danger" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Followers Modal */}
      {showFollowers && (
        <div className="modal-overlay" onClick={() => setShowFollowers(false)}>
          <div className="modal-content modal-followers" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Followers (2.4K)</h2>
              <button className="modal-close" onClick={() => setShowFollowers(false)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="followers-list">
                {followers.map((follower) => (
                  <div key={follower.id} className="follower-item">
                    <span className="avatar">{follower.avatar}</span>
                    <div className="follower-info">
                      <p className="name">{follower.name}</p>
                      <p className="handle">{follower.handle}</p>
                    </div>
                    <button className="btn btn-small">Following</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
