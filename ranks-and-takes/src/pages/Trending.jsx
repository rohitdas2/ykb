import React, { useState } from 'react';
import { useNotificationStore } from '../store/notificationStore';
import { sortByTrending } from '../utils/trendingAlgorithm';
import '../styles/Pages.css';

const Trending = () => {
  const [showDMs, setShowDMs] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [likedTakes, setLikedTakes] = useState(new Set());
  const [selectedRatings, setSelectedRatings] = useState({});

  const initialTakes = [
    {
      id: 1,
      author: 'SportsNerd23',
      displayName: 'James Chen',
      avatar: '👨‍🦱',
      take: 'Jayson Tatum is the most underrated two-way player in the NBA right now',
      rank: 8.5,
      ballKnowledge: 78,
      numRatings: 1203,
      timestamp: '2 hours ago',
      likes: 523,
      comments: 148,
      tags: ['NBA', 'Celtics', 'Analysis'],
      commentsList: [
        { id: 1, author: 'HoopsLover', avatar: '👩‍🦱', text: 'Completely agree, his defense is underrated', timestamp: '1 hour ago' },
        { id: 2, author: 'NBAAnalyst', avatar: '👨‍💼', text: 'Great take! The stats back this up', timestamp: '45 minutes ago' }
      ]
    },
    {
      id: 2,
      author: 'KnicksFan92',
      displayName: 'Maria Rodriguez',
      avatar: '👩‍🦱',
      take: 'The Knicks will make the Finals within 2 years',
      rank: 7.2,
      ballKnowledge: 72,
      numRatings: 856,
      timestamp: '4 hours ago',
      likes: 412,
      comments: 98,
      tags: ['NBA', 'Knicks', 'Prediction'],
      commentsList: [
        { id: 1, author: 'CelticsFan', avatar: '☘️', text: 'Bold prediction! Excited to see if this happens', timestamp: '3 hours ago' }
      ]
    },
    {
      id: 3,
      author: 'AnalyticsBro',
      displayName: 'Alex Kim',
      avatar: '👨‍💼',
      take: 'Advanced metrics show LeBron is still elite on defense',
      rank: 9.1,
      ballKnowledge: 89,
      numRatings: 2103,
      timestamp: '6 hours ago',
      likes: 892,
      comments: 234,
      tags: ['NBA', 'Lakers', 'Stats'],
      commentsList: [
        { id: 1, author: 'StatsNerd', avatar: '📊', text: 'The advanced metrics really back this up', timestamp: '5 hours ago' },
        { id: 2, author: 'BasketballEyes', avatar: '👀', text: 'VORP numbers are insane', timestamp: '4 hours ago' }
      ]
    },
    {
      id: 4,
      author: 'HoopsVibes',
      displayName: 'Dakota Smith',
      avatar: '🏀',
      take: 'Steph Curry has the highest basketball IQ in the league',
      rank: 8.8,
      ballKnowledge: 85,
      numRatings: 1876,
      timestamp: '3 hours ago',
      likes: 756,
      comments: 165,
      tags: ['NBA', 'Warriors', 'Guards'],
      commentsList: [
        { id: 1, author: 'CurryFan', avatar: '⭐', text: 'His off-ball movement is incredible', timestamp: '2 hours ago' }
      ]
    },
    {
      id: 5,
      author: 'DefenseMatters',
      displayName: 'Jordan Williams',
      avatar: '🛡️',
      take: 'Defense wins championships, not pure scoring',
      rank: 7.9,
      ballKnowledge: 82,
      numRatings: 1445,
      timestamp: '5 hours ago',
      likes: 634,
      comments: 201,
      tags: ['NBA', 'Strategy', 'Defense'],
      commentsList: [
        { id: 1, author: 'CoachTalk', avatar: '🏆', text: 'This is facts. Look at recent champions', timestamp: '4 hours ago' }
      ]
    }
  ];

  // Sort takes by trending score on mount
  const [trendingTakes, setTrendingTakes] = useState(sortByTrending(initialTakes));

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

  const formatBK = (value) => {
    if (value === 0) return '0.000';
    const formatted = parseFloat(value.toPrecision(4));
    return formatted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleLikeTake = (id) => {
    setTrendingTakes(prevTakes =>
      prevTakes.map(take =>
        take.id === id
          ? {
              ...take,
              likes: likedTakes.has(id) ? take.likes - 1 : take.likes + 1
            }
          : take
      )
    );

    setLikedTakes(prevLiked => {
      const newLiked = new Set(prevLiked);
      if (newLiked.has(id)) {
        newLiked.delete(id);
      } else {
        newLiked.add(id);
      }
      return newLiked;
    });
  };

  const handleRateTake = (id, rating) => {
    setSelectedRatings(prev => ({
      ...prev,
      [id]: rating
    }));
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
            <a href="/search" className="nav-item">Search</a>
            <a href="/scores" className="nav-item">Scores</a>
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
              <h2>🔥 Trending Takes</h2>
              <p>The hottest takes right now</p>
            </div>

            {/* Trending Takes Feed */}
            <div className="takes-list">
              {trendingTakes.map((take) => (
                <div key={take.id} className="take-card">
                  <div className="take-header">
                    <div className="author-info">
                      <span className="avatar">{take.avatar}</span>
                      <div className="author-details">
                        <p className="display-name">{take.displayName}</p>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <p className="username">@{take.author}</p>
                          <span style={{ fontSize: '12px', color: '#999', fontWeight: '500' }}>BK {formatBK(take.ballKnowledge)}</span>
                        </div>
                      </div>
                    </div>
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
                        className={`rating-btn ${selectedRatings[take.id] === rating ? 'selected' : ''}`}
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
                      className={`action-btn ${likedTakes.has(take.id) ? 'liked' : ''}`}
                      onClick={() => handleLikeTake(take.id)}
                    >
                      {likedTakes.has(take.id) ? '❤️' : '🤍'} {take.likes}
                    </button>
                    <button className="action-btn">
                      ⤴️ Share
                    </button>
                    <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#999' }}>{take.timestamp}</span>
                  </div>

                  {/* Top Comment Display */}
                  {take.commentsList && take.commentsList.length > 0 && (
                    <div className="top-comment-section">
                      <div className="comment-divider"></div>
                      <div className="top-comment">
                        <div className="comment-header">
                          <span className="comment-avatar">{take.commentsList[0].avatar}</span>
                          <div className="comment-author-info">
                            <p className="comment-author">{take.commentsList[0].author}</p>
                            <p className="comment-time">{take.commentsList[0].timestamp}</p>
                          </div>
                        </div>
                        <p className="comment-text">{take.commentsList[0].text}</p>
                        {take.commentsList.length > 1 && (
                          <button className="view-more-comments-btn">
                            View {take.commentsList.length - 1} more comment{take.commentsList.length - 1 > 1 ? 's' : ''}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="sidebar">
            <div className="sidebar-card">
              <h3>Top Trending</h3>
              <div className="trending-list">
                {trendingTakes.map((take) => (
                  <div key={take.id} className="trending-item">
                    <p className="trending-tag" style={{ fontSize: '13px', fontWeight: '600' }}>{take.displayName}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                      <p className="trending-stats" style={{ margin: 0, fontSize: '12px' }}>{take.likes.toLocaleString()} likes</p>
                      <span style={{ fontSize: '16px' }}>🔥 {take.trendingScore}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

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
