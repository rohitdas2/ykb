/*
  PlayerDetail Component

  Displays comprehensive statistics for a single NBA player
  Data provided by NBA Stats API (https://api.server.nbaapi.com/)
  Licensed under MIT License
*/

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/Pages.css';

const PlayerDetail = () => {
  const { playerName } = useParams();
  const navigate = useNavigate();
  const [playerData, setPlayerData] = useState(null);
  const [advancedStats, setAdvancedStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'player_update',
      user: 'Player Stats',
      action: 'updated stats',
      message: 'Latest game stats added for this player',
      time: '20 minutes ago',
      read: false,
      avatar: '📊'
    },
    {
      id: 2,
      type: 'performance',
      user: 'Game Alert',
      action: 'milestone achieved',
      message: 'Player scored 30+ points in last game',
      time: '2 hours ago',
      read: false,
      avatar: '🔥'
    },
    {
      id: 3,
      type: 'comment',
      user: 'Hoops Fan',
      action: 'commented on player',
      message: 'This player is underrated!',
      time: '4 hours ago',
      read: true,
      avatar: '💬'
    }
  ]);

  useEffect(() => {
    fetchPlayerData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerName]);

  const fetchPlayerData = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch player totals
      const totalsResponse = await fetch('https://api.server.nbaapi.com/api/playertotals?pageSize=500');
      const totalsData = await totalsResponse.json();

      // Find the player
      const player = totalsData.data.find(
        p => p.playerName.toLowerCase() === playerName.toLowerCase()
      );

      if (!player) {
        setError('Player not found');
        setLoading(false);
        return;
      }

      setPlayerData({
        ...player,
        ppg: player.games > 0 ? (player.points / player.games).toFixed(1) : 0,
        rpg: player.games > 0 ? (player.totalRb / player.games).toFixed(1) : 0,
        apg: player.games > 0 ? (player.assists / player.games).toFixed(1) : 0,
        spg: player.games > 0 ? (player.steals / player.games).toFixed(1) : 0,
        bpg: player.games > 0 ? (player.blocks / player.games).toFixed(1) : 0,
      });

      // Fetch advanced stats
      const advancedResponse = await fetch('https://api.server.nbaapi.com/api/playeradvancedstats?pageSize=500');
      const advancedData = await advancedResponse.json();

      const advanced = advancedData.data.find(
        a => a.playerName.toLowerCase() === playerName.toLowerCase()
      );

      if (advanced) {
        setAdvancedStats(advanced);
      }
    } catch (err) {
      console.error('Error fetching player data:', err);
      setError('Failed to load player data');
    } finally {
      setLoading(false);
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

  if (loading) {
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
              <a href="/trending" className="nav-item">Search</a>
              <a href="/profile" className="nav-item">Profile</a>
            </nav>
          </div>
          <div className="header-right">
            <button className="btn btn-icon">🔔</button>
          </div>
        </header>
        <main className="main-content">
          <div className="loading">Loading player data...</div>
        </main>
      </div>
    );
  }

  if (error || !playerData) {
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
              <a href="/trending" className="nav-item">Search</a>
              <a href="/profile" className="nav-item">Profile</a>
            </nav>
          </div>
          <div className="header-right">
            <button className="btn btn-icon">🔔</button>
          </div>
        </header>
        <main className="main-content">
          <div className="error-message">{error}</div>
          <button className="btn btn-primary" onClick={() => navigate('/trending')}>Back to Search</button>
        </main>
      </div>
    );
  }

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
            <a href="/trending" className="nav-item">Search</a>
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
        </div>
      </header>

      <main className="main-content">
        <div className="content-wrapper">
          <div className="feed-section">
            <button className="btn btn-secondary" onClick={() => navigate('/trending')}>← Back to Search</button>

            <div className="player-detail-header">
              <div className="player-info">
                <h1>🏀 {playerData.playerName}</h1>
                <p className="player-meta">{playerData.position} • {playerData.team} • Season 2025</p>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stats-section">
                <h2>Traditional Stats</h2>
                <div className="stat-cards">
                  <div className="stat-card">
                    <div className="stat-value">{playerData.ppg}</div>
                    <div className="stat-label">Points Per Game</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{playerData.rpg}</div>
                    <div className="stat-label">Rebounds Per Game</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{playerData.apg}</div>
                    <div className="stat-label">Assists Per Game</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{playerData.spg}</div>
                    <div className="stat-label">Steals Per Game</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{playerData.bpg}</div>
                    <div className="stat-label">Blocks Per Game</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{playerData.games}</div>
                    <div className="stat-label">Games Played</div>
                  </div>
                </div>

                <div className="detailed-stats">
                  <h3>Advanced Stats</h3>
                  <table className="stats-table">
                    <tbody>
                      <tr>
                        <td><strong>Field Goals</strong></td>
                        <td>{playerData.fieldGoals} / {playerData.fieldAttempts}</td>
                        <td className="stat-percent">{(playerData.fieldPercent * 100).toFixed(1)}%</td>
                      </tr>
                      <tr>
                        <td><strong>Three Pointers</strong></td>
                        <td>{playerData.threeFg} / {playerData.threeAttempts}</td>
                        <td className="stat-percent">{(playerData.threePercent * 100).toFixed(1)}%</td>
                      </tr>
                      <tr>
                        <td><strong>Free Throws</strong></td>
                        <td>{playerData.ft} / {playerData.ftAttempts}</td>
                        <td className="stat-percent">{(playerData.ftPercent * 100).toFixed(1)}%</td>
                      </tr>
                      <tr>
                        <td><strong>Total Points</strong></td>
                        <td colspan="2">{playerData.points.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td><strong>Total Rebounds</strong></td>
                        <td colspan="2">{playerData.totalRb}</td>
                      </tr>
                      <tr>
                        <td><strong>Total Assists</strong></td>
                        <td colspan="2">{playerData.assists}</td>
                      </tr>
                      <tr>
                        <td><strong>Turnovers</strong></td>
                        <td colspan="2">{playerData.turnovers}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {advancedStats && (
                <div className="stats-section">
                  <h2>Advanced Metrics</h2>
                  <div className="stat-cards">
                    <div className="stat-card">
                      <div className="stat-value">{advancedStats.per}</div>
                      <div className="stat-label">Player Efficiency Rating (PER)</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-value">{(advancedStats.tsPercent * 100).toFixed(1)}%</div>
                      <div className="stat-label">True Shooting %</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-value">{advancedStats.usagePercent}%</div>
                      <div className="stat-label">Usage Percentage</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-value">{advancedStats.winShares}</div>
                      <div className="stat-label">Win Shares</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-value">{advancedStats.vorp}</div>
                      <div className="stat-label">VORP</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-value">{advancedStats.box}</div>
                      <div className="stat-label">Box Plus/Minus</div>
                    </div>
                  </div>

                  <div className="detailed-stats">
                    <h3>Additional Advanced Stats</h3>
                    <table className="stats-table">
                      <tbody>
                        <tr>
                          <td><strong>Offensive Box Plus/Minus</strong></td>
                          <td colspan="2">{advancedStats.offensiveBox}</td>
                        </tr>
                        <tr>
                          <td><strong>Defensive Box Plus/Minus</strong></td>
                          <td colspan="2">{advancedStats.defensiveBox}</td>
                        </tr>
                        <tr>
                          <td><strong>Offensive Rebound %</strong></td>
                          <td colspan="2">{advancedStats.offensiveRBPercent}%</td>
                        </tr>
                        <tr>
                          <td><strong>Defensive Rebound %</strong></td>
                          <td colspan="2">{advancedStats.defensiveRBPercent}%</td>
                        </tr>
                        <tr>
                          <td><strong>Total Rebound %</strong></td>
                          <td colspan="2">{advancedStats.totalRBPercent}%</td>
                        </tr>
                        <tr>
                          <td><strong>Assist %</strong></td>
                          <td colspan="2">{advancedStats.assistPercent}%</td>
                        </tr>
                        <tr>
                          <td><strong>Steal %</strong></td>
                          <td colspan="2">{advancedStats.stealPercent}%</td>
                        </tr>
                        <tr>
                          <td><strong>Block %</strong></td>
                          <td colspan="2">{advancedStats.blockPercent}%</td>
                        </tr>
                        <tr>
                          <td><strong>Turnover %</strong></td>
                          <td colspan="2">{advancedStats.turnoverPercent}%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Trending Takes Section */}
            <div className="trending-takes-section">
              <h2>Trending Takes About {playerData.playerName}</h2>
              <div className="takes-list">
                {[
                  {
                    id: 1,
                    author: 'NBAAnalyst',
                    displayName: 'NBA Analyst',
                    avatar: '👨‍💼',
                    take: `${playerData.playerName} is having an MVP-caliber season with incredible efficiency`,
                    rank: 9.2,
                    numRatings: 2341,
                    likes: 1203,
                    comments: 287
                  },
                  {
                    id: 2,
                    author: 'HoopsJunkie',
                    displayName: 'Hoops Junkie',
                    avatar: '🏀',
                    take: `${playerData.playerName}'s defensive improvements this season are underrated`,
                    rank: 8.7,
                    numRatings: 1876,
                    likes: 892,
                    comments: 154
                  },
                  {
                    id: 3,
                    author: 'StatsNerd',
                    displayName: 'Stats Nerd',
                    avatar: '📊',
                    take: `${playerData.playerName} leads the league in net rating when on court`,
                    rank: 8.9,
                    numRatings: 2103,
                    likes: 1045,
                    comments: 203
                  }
                ].map((take) => (
                  <div key={take.id} className="take-card">
                    <div className="take-header">
                      <div className="take-author">
                        <span className="avatar">{take.avatar}</span>
                        <div>
                          <p className="author-name">{take.displayName}</p>
                          <p className="author-handle">@{take.author}</p>
                        </div>
                      </div>
                      <div className="take-rank">
                        <span className="rank-badge">{take.rank}</span>
                      </div>
                    </div>
                    <p className="take-content">{take.take}</p>
                    <div className="take-stats">
                      <span className="stat">❤️ {take.likes}</span>
                      <span className="stat">💬 {take.comments}</span>
                      <span className="stat">⭐ {take.numRatings} ratings</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="stats-legend">
              <h4>Stat Definitions</h4>
              <p><strong>PER:</strong> Player Efficiency Rating - Measure of per-minute productivity</p>
              <p><strong>TS%:</strong> True Shooting Percentage - Shooting efficiency accounting for 2-pointers, 3-pointers, and free throws</p>
              <p><strong>VORP:</strong> Value Over Replacement Player - Estimate of points contributed above a replacement player</p>
              <p><strong>BPM:</strong> Box Plus/Minus - Estimate of point differential when player is on court</p>
              <small>Data provided by NBA Stats API (https://api.server.nbaapi.com/) - Licensed under MIT</small>
            </div>
          </div>
        </div>
      </main>

      {/* Notifications Modal */}
      {showNotifications && (
        <div className="notifications-modal-overlay" onClick={() => setShowNotifications(false)}>
          <div className="notifications-modal" onClick={(e) => e.stopPropagation()}>
            <div className="notifications-header">
              <h2>Notifications</h2>
              {unreadCount > 0 && (
                <button className="mark-all-read-btn" onClick={handleMarkAllAsRead}>Mark all as read</button>
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
                      onClick={() => handleDismissNotification(notif.id)}
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

export default PlayerDetail;
