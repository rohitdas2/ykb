import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotificationStore } from '../store/notificationStore';
import '../styles/Pages.css';

const Search = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [showDMs, setShowDMs] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [trendingTakes, setTrendingTakes] = useState([]);
  const [loadingTrending, setLoadingTrending] = useState(false);
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

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setHasSearched(true);
      try {
        // Fetch all players and teams from backend
        const playersResponse = await fetch('http://localhost:5000/api/players');
        const teamsResponse = await fetch('http://localhost:5000/api/teams');

        const playersData = await playersResponse.json();
        const teamsData = await teamsResponse.json();

        const query = searchQuery.toLowerCase();
        const results = [];

        // Filter and add matching players
        playersData.forEach((player, idx) => {
          if (player.playerName.toLowerCase().includes(query)) {
            results.push({
              id: `player-${idx}`,
              type: 'player',
              name: player.playerName,
              team: player.team,
              icon: '🏀',
              data: player
            });
          }
        });

        // Filter and add matching teams
        teamsData.forEach((team, idx) => {
          if (team.teamName.toLowerCase().includes(query)) {
            const record = `${team.wins}-${team.losses}`;
            results.push({
              id: `team-${idx}`,
              type: 'team',
              name: team.teamName,
              record: record,
              icon: '🏆',
              data: team
            });
          }
        });

        setResults(results);
        console.log('Search results:', results);
      } catch (error) {
        console.error('Error searching:', error);
        setResults([]);
      }
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

  // Fetch trending takes on component mount
  React.useEffect(() => {
    const fetchTrendingTakes = async () => {
      setLoadingTrending(true);
      try {
        const response = await fetch('http://localhost:5000/api/trending-takes');
        const data = await response.json();
        setTrendingTakes(data.slice(0, 5)); // Get top 5 trending
      } catch (error) {
        console.error('Error fetching trending takes:', error);
        setTrendingTakes([]);
      } finally {
        setLoadingTrending(false);
      }
    };

    fetchTrendingTakes();
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;


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
            </form>

            {!hasSearched ? (
              <div className="search-suggestions">
                <div className="suggestions-section">
                  <h3>🔥 Trending Takes</h3>
                  {loadingTrending ? (
                    <p style={{ padding: '16px', color: '#999' }}>Loading trending takes...</p>
                  ) : trendingTakes.length > 0 ? (
                    <div className="trending-takes-list">
                      {trendingTakes.map((take) => (
                        <div key={take.id} className="trending-take-item">
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontSize: '20px' }}>{take.avatar}</span>
                            <div style={{ flex: 1 }}>
                              <p style={{ margin: 0, fontWeight: '600', fontSize: '14px' }}>{take.displayName}</p>
                              <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>@{take.author}</p>
                            </div>
                            <span style={{ fontSize: '18px', color: '#ff6b35' }}>🔥 {take.trendingScore}</span>
                          </div>
                          <p style={{ margin: '8px 0', fontSize: '13px', color: '#333', lineHeight: '1.4' }}>
                            {take.take}
                          </p>
                          <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#999' }}>
                            <span>❤️ {take.likes}</span>
                            <span>💬 {take.comments}</span>
                            <span>👁️ {take.views}</span>
                            <span style={{ marginLeft: 'auto' }}>{take.ballKnowledge}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ padding: '16px', color: '#999' }}>No trending takes available</p>
                  )}
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

export default Search;
