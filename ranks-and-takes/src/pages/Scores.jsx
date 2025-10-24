/*
  Scores Component

  Displays live and scheduled NBA games with scores
  Data provided by Balldontlie API
  Licensed under MIT License
*/

import React, { useState, useEffect } from 'react';
import { useNotificationStore } from '../store/notificationStore';
import '../styles/Pages.css';

const Scores = () => {
  const [nbaGames, setNbaGames] = useState([]);
  const [loadingGames, setLoadingGames] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 9, 23)); // Oct 23, 2025
  const [showDMs, setShowDMs] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
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
  const dismissNotification = useNotificationStore((state) => state.dismissNotification);
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);

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
            <a href="/search" className="nav-item">Search</a>
            <a href="/scores" className="nav-item active">Scores</a>
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
        {/* NBA Scores Full Page Section */}
        <div className="nba-scores-full-section">
          <div className="nba-scores-header">
            <h2>🏀 NBA Games</h2>
          </div>

          {/* Scrollable Calendar */}
          <div className="games-calendar-scroll">
            <div className="calendar-dates">
              {Array.from({ length: 21 }, (_, i) => {
                const date = new Date(selectedDate);
                date.setDate(date.getDate() - 10 + i);
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
            <div className="loading-state" style={{ padding: '16px' }}>
              <p>Loading games...</p>
            </div>
          ) : nbaGames.length > 0 ? (
            <div className="nba-games-grid">
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
                    <div className="team">
                      <div className="team-name">{game.home_team?.full_name}</div>
                      <div className="team-score">{game.home_team_score || 0}</div>
                    </div>

                    <div className="vs">VS</div>

                    <div className="team">
                      <div className="team-name">{game.visitor_team?.full_name}</div>
                      <div className="team-score">{game.visitor_team_score || 0}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '24px', color: '#999', textAlign: 'center' }}>
              <p>No games scheduled for this date</p>
            </div>
          )}
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

export default Scores;
