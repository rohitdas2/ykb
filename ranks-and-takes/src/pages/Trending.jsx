import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotificationStore } from '../store/notificationStore';
import '../styles/Pages.css';

const Trending = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [showDMs, setShowDMs] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState('');
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

  const notifications = useNotificationStore((state) => state.notifications);
  const markNotificationAsRead = useNotificationStore((state) => state.markNotificationAsRead);
  const dismissNotification = useNotificationStore((state) => state.dismissNotification);
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);

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

  const unreadCount = notifications.filter(n => !n.read).length;


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
          <button className="btn btn-icon" onClick={() => setShowDMs(!showDMs)}>💬</button>
          <div className="notification-button-wrapper">
            <button className="btn btn-icon notification-btn" onClick={() => setShowNotifications(!showNotifications)}>🔔</button>
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </div>
          <button className="btn btn-icon" title="Settings" style={{ fontSize: '20px', fontWeight: 'bold', padding: '8px 12px', minWidth: 'auto' }}>
            ⋮
          </button>
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
                  <h3>Trending Topics</h3>
                  <div className="search-list">
                    <button className="search-item">
                      <span>📈</span>
                      <span>#MVPRace</span>
                    </button>
                    <button className="search-item">
                      <span>📈</span>
                      <span>#Draft2025</span>
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
              <h3>Trending Topics</h3>
              <div className="trending-list">
                <div className="trending-item">
                  <p className="trending-tag">#MVP Race</p>
                  <p className="trending-stats">125K takes</p>
                </div>
                <div className="trending-item">
                  <p className="trending-tag">#Draft 2025</p>
                  <p className="trending-stats">89K takes</p>
                </div>
                <div className="trending-item">
                  <p className="trending-tag">#Playoffs</p>
                  <p className="trending-stats">76K takes</p>
                </div>
                <div className="trending-item">
                  <p className="trending-tag">#Trade Rumors</p>
                  <p className="trending-stats">54K takes</p>
                </div>
              </div>
            </div>

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
                <a href="/home" className="link">🔥 Home Feed</a>
                <a href="/profile" className="link">👤 Your Profile</a>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Notifications Modal */}
      {showNotifications && (
        <div className="notifications-modal-overlay" onClick={() => setShowNotifications(false)}>
          <div className="notifications-modal" onClick={(e) => e.stopPropagation()}>
            <div className="notifications-header">
              <h2>Notifications</h2>
              {unreadCount > 0 && (
                <button className="mark-all-read-btn" onClick={markAllAsRead}>Mark all as read</button>
              )}
            </div>

            <div className="notifications-list">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div key={notif.id} className={`notification-item ${notif.read ? '' : 'unread'}`}>
                    <div className="notification-avatar">{notif.avatar}</div>
                    <div className="notification-content">
                      <p className="notification-text">
                        <strong>{notif.user}</strong> {notif.action}
                      </p>
                      <p className="notification-message">{notif.message}</p>
                      <span className="notification-time">{notif.time}</span>
                    </div>
                    <button
                      className="dismiss-btn"
                      onClick={() => dismissNotification(notif.id)}
                    >
                      ✕
                    </button>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>🔔 No notifications yet</p>
                  <small>Check back soon for updates</small>
                </div>
              )}
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
    </div>
  );
};

export default Trending;
