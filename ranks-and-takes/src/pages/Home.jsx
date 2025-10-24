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
  const [showDMs, setShowDMs] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedTakeToShare, setSelectedTakeToShare] = useState(null);
  const [profilePicture] = useState(localStorage.getItem('userProfilePicture'));
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'like',
      user: 'Sports Analyst',
      action: 'liked your take',
      message: '"The Celtics are the most complete team..."',
      time: '2 minutes ago',
      read: false,
      avatar: '👨‍💼'
    },
    {
      id: 2,
      type: 'comment',
      user: 'Hoops Lover',
      action: 'replied to your take',
      message: '"Great analysis! I totally agree."',
      time: '15 minutes ago',
      read: false,
      avatar: '👩‍🦱'
    },
    {
      id: 3,
      type: 'follow',
      user: 'Basketball Eyes',
      action: 'started following you',
      message: '',
      time: '1 hour ago',
      read: false,
      avatar: '👨‍🦨'
    },
    {
      id: 4,
      type: 'rating',
      user: 'Stats Nerd',
      action: 'rated your take',
      message: '8.5/10',
      time: '3 hours ago',
      read: true,
      avatar: '👩‍💻'
    },
    {
      id: 5,
      type: 'mention',
      user: 'NBA Analyst',
      action: 'mentioned you in a take',
      message: '"@user thoughts on MVP race?"',
      time: '5 hours ago',
      read: true,
      avatar: '👨‍💼'
    }
  ]);
  const [conversations, setConversations] = useState([
    {
      id: 1,
      name: 'Sports Analyst',
      handle: '@sportsanalyst',
      avatar: '👨‍💼',
      lastMessage: 'Great take on the Celtics!',
      lastMessageTime: '2 hours ago',
      unread: 2,
      messages: [
        { id: 1, sender: 'Sports Analyst', text: 'Hey! Loved your recent take', timestamp: '1 hour ago', isOwn: false },
        { id: 2, sender: 'You', text: 'Thanks! Appreciate the feedback', timestamp: '58 minutes ago', isOwn: true },
        { id: 3, sender: 'Sports Analyst', text: 'Great take on the Celtics!', timestamp: '2 minutes ago', isOwn: false }
      ]
    },
    {
      id: 2,
      name: 'Hoops Lover',
      handle: '@hoopslover',
      avatar: '👩‍🦱',
      lastMessage: 'Want to collab on a video?',
      lastMessageTime: '5 hours ago',
      unread: 0,
      messages: [
        { id: 1, sender: 'Hoops Lover', text: 'Want to collab on a video?', timestamp: '5 hours ago', isOwn: false }
      ]
    },
    {
      id: 3,
      name: 'Basketball Eyes',
      handle: '@basketballeyes',
      avatar: '👨‍🦨',
      lastMessage: 'Check out my latest analysis',
      lastMessageTime: '1 day ago',
      unread: 0,
      messages: [
        { id: 1, sender: 'Basketball Eyes', text: 'Check out my latest analysis', timestamp: '1 day ago', isOwn: false }
      ]
    }
  ]);
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

  const handleSendMessage = () => {
    if (messageText.trim() && selectedConversation !== null) {
      const newMessage = {
        id: Date.now(),
        sender: 'You',
        text: messageText,
        timestamp: 'now',
        isOwn: true
      };

      setConversations(prevConversations =>
        prevConversations.map(conv =>
          conv.id === selectedConversation
            ? { ...conv, messages: [...conv.messages, newMessage], lastMessage: messageText, lastMessageTime: 'now' }
            : conv
        )
      );

      setMessageText('');
    }
  };

  const handleMarkNotificationAsRead = (notificationId) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const handleDismissNotification = (notificationId) => {
    setNotifications(prevNotifications =>
      prevNotifications.filter(notif => notif.id !== notificationId)
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notif => ({ ...notif, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleShareTake = (take) => {
    setSelectedTakeToShare(take);
    setShowShareModal(true);
  };

  const handleSendTakeMessage = (conversationId) => {
    if (selectedTakeToShare) {
      const newMessage = {
        id: Date.now(),
        sender: 'You',
        text: `Check out this take: "${selectedTakeToShare.take}" - Score: ${selectedTakeToShare.rank}/10`,
        timestamp: 'now',
        isOwn: true
      };

      setConversations(prevConversations =>
        prevConversations.map(conv =>
          conv.id === conversationId
            ? { ...conv, messages: [...conv.messages, newMessage], lastMessage: newMessage.text, lastMessageTime: 'now' }
            : conv
        )
      );

      setShowShareModal(false);
      setSelectedTakeToShare(null);
    }
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
          <button className="btn btn-icon" onClick={() => setShowDMs(!showDMs)}>💬</button>
          <div className="notification-button-wrapper">
            <button className="btn btn-icon notification-btn" onClick={() => setShowNotifications(!showNotifications)}>
              🔔
            </button>
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </div>
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
                {profilePicture ? (
                  <img src={profilePicture} alt="Avatar" className="avatar-image" />
                ) : (
                  <span className="avatar">👤</span>
                )}
                <div className="create-input-wrapper">
                  <input
                    type="text"
                    placeholder="What's your take on basketball?"
                    className="create-input"
                    onClick={() => {
                      // TODO: Open take creation modal
                      console.log('Open create take modal');
                    }}
                  />
                  <span className="input-arrow">→</span>
                </div>
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
                    <button className="action-btn" onClick={() => handleShareTake(take)}>
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
              <h3>NBA News</h3>
              <div className="news-sidebar-list">
                <div className="news-sidebar-item">
                  <p className="news-sidebar-title">Celtics Extend Win Streak to 12 Games</p>
                  <p className="news-sidebar-source">NBA.com • 2 hours ago</p>
                </div>
                <div className="news-sidebar-item">
                  <p className="news-sidebar-title">Luka Doncic Breaks Career Scoring Record</p>
                  <p className="news-sidebar-source">ESPN • 4 hours ago</p>
                </div>
                <div className="news-sidebar-item">
                  <p className="news-sidebar-title">Lakers Trade Rumors Heating Up</p>
                  <p className="news-sidebar-source">The Athletic • 6 hours ago</p>
                </div>
                <div className="news-sidebar-item">
                  <p className="news-sidebar-title">Jayson Tatum Named All-Star Starter</p>
                  <p className="news-sidebar-source">NBA.com • 8 hours ago</p>
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

      {/* Share Take Modal */}
      {showShareModal && selectedTakeToShare && (
        <div className="dm-modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="dm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dm-header">
              <h2>Share Take</h2>
              <button className="close-btn" onClick={() => setShowShareModal(false)}>✕</button>
            </div>

            <div className="share-modal-content">
              <div className="share-take-preview">
                <p className="share-take-text">{selectedTakeToShare.take}</p>
                <div className="share-take-stats">
                  <span className="stat">⭐ {selectedTakeToShare.rank}/10</span>
                  <span className="stat">❤️ {selectedTakeToShare.likes}</span>
                  <span className="stat">💬 {selectedTakeToShare.comments}</span>
                </div>
              </div>

              <p style={{ padding: '16px 20px 8px', margin: '0', fontSize: '14px', fontWeight: '600', color: '#666' }}>Send to:</p>

              <div className="conversations-list-share">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    className="share-conversation-item"
                    onClick={() => handleSendTakeMessage(conv.id)}
                  >
                    <span className="avatar">{conv.avatar}</span>
                    <div className="share-conv-info">
                      <p className="conv-name">{conv.name}</p>
                      <p className="conv-handle">{conv.handle}</p>
                    </div>
                    <span style={{ fontSize: '16px' }}>→</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DM Modal */}
      {showDMs && (
        <div className="dm-modal-overlay" onClick={() => setShowDMs(false)}>
          <div className="dm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dm-header">
              <h2>Messages</h2>
              <button className="close-btn" onClick={() => setShowDMs(false)}>✕</button>
            </div>

            <div className="dm-container">
              {/* Conversations List */}
              <div className="conversations-list">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`conversation-item ${selectedConversation === conv.id ? 'active' : ''} ${conv.unread > 0 ? 'unread' : ''}`}
                    onClick={() => setSelectedConversation(conv.id)}
                  >
                    <div className="conversation-avatar">{conv.avatar}</div>
                    <div className="conversation-info">
                      <p className="conversation-name">{conv.name}</p>
                      <p className="conversation-preview">{conv.lastMessage}</p>
                    </div>
                    <div className="conversation-meta">
                      <p className="conversation-time">{conv.lastMessageTime}</p>
                      {conv.unread > 0 && <span className="unread-badge">{conv.unread}</span>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat View */}
              {selectedConversation !== null && (
                <div className="dm-chat">
                  {(() => {
                    const activeConv = conversations.find(c => c.id === selectedConversation);
                    return (
                      <>
                        <div className="chat-header">
                          <div className="chat-user">
                            <span className="avatar">{activeConv.avatar}</span>
                            <div>
                              <p className="user-name">{activeConv.name}</p>
                              <p className="user-handle">{activeConv.handle}</p>
                            </div>
                          </div>
                        </div>

                        <div className="messages-container">
                          {activeConv.messages.map((msg) => (
                            <div key={msg.id} className={`message ${msg.isOwn ? 'own' : 'other'}`}>
                              <div className="message-content">{msg.text}</div>
                              <div className="message-time">{msg.timestamp}</div>
                            </div>
                          ))}
                        </div>

                        <div className="message-input-box">
                          <input
                            type="text"
                            placeholder="Type a message..."
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            className="message-input"
                          />
                          <button className="send-btn" onClick={handleSendMessage}>Send</button>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              {selectedConversation === null && (
                <div className="dm-empty">
                  <p>Select a conversation to start chatting</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Notifications Modal */}
      {showNotifications && (
        <div className="notifications-modal-overlay" onClick={() => setShowNotifications(false)}>
          <div className="notifications-modal" onClick={(e) => e.stopPropagation()}>
            <div className="notifications-header">
              <h2>Notifications</h2>
              <div className="notifications-actions">
                {unreadCount > 0 && (
                  <button className="mark-all-btn" onClick={handleMarkAllAsRead}>
                    Mark all as read
                  </button>
                )}
                <button className="close-btn" onClick={() => setShowNotifications(false)}>✕</button>
              </div>
            </div>

            <div className="notifications-list">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div key={notif.id} className={`notification-item ${notif.read ? 'read' : 'unread'}`}>
                    <div className="notification-avatar">{notif.avatar}</div>
                    <div className="notification-content">
                      <div className="notification-header-text">
                        <p className="notification-user">{notif.user}</p>
                        <span className="notification-time">{notif.time}</span>
                      </div>
                      <p className="notification-action">{notif.action}</p>
                      {notif.message && (
                        <p className="notification-message">{notif.message}</p>
                      )}
                    </div>
                    <button
                      className="notification-dismiss"
                      onClick={() => handleDismissNotification(notif.id)}
                      title="Dismiss"
                    >
                      ✕
                    </button>
                  </div>
                ))
              ) : (
                <div className="notifications-empty">
                  <p>🔔 No notifications yet</p>
                  <small>You're all caught up!</small>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
