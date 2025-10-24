/*
  TeamDetail Component

  Displays comprehensive statistics for an NBA team
  Data is aggregated from player statistics
  Licensed under MIT License
*/

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/Pages.css';

const TeamDetail = () => {
  const { teamCode } = useParams();
  const navigate = useNavigate();
  const [teamStats, setTeamStats] = useState(null);
  const [players, setPlayers] = useState([]);
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
      type: 'team_update',
      user: 'Team News',
      action: 'roster update',
      message: 'Team added new player to active roster',
      time: '1 hour ago',
      read: false,
      avatar: '🏀'
    },
    {
      id: 2,
      type: 'game_result',
      user: 'Game Alert',
      action: 'game completed',
      message: 'Team won 120-105 in last night\'s game',
      time: '3 hours ago',
      read: false,
      avatar: '🏆'
    },
    {
      id: 3,
      type: 'standings',
      user: 'League Update',
      action: 'standings changed',
      message: 'Team moved up to 2nd place in conference',
      time: '1 day ago',
      read: true,
      avatar: '📊'
    }
  ]);

  const teamNames = {
    'LAL': 'Los Angeles Lakers',
    'BOS': 'Boston Celtics',
    'GSW': 'Golden State Warriors',
    'MIA': 'Miami Heat',
    'DEN': 'Denver Nuggets',
    'PHX': 'Phoenix Suns',
    'DAL': 'Dallas Mavericks',
    'NYK': 'New York Knicks',
    'LAC': 'Los Angeles Clippers',
    'MIL': 'Milwaukee Bucks',
    'BRK': 'Brooklyn Nets',
    'PHI': '76ers',
    'ATL': 'Atlanta Hawks',
    'CHI': 'Chicago Bulls',
    'TOR': 'Toronto Raptors',
    'CLE': 'Cleveland Cavaliers',
    'ORL': 'Orlando Magic',
    'WAS': 'Washington Wizards',
    'IND': 'Indiana Pacers',
    'DET': 'Detroit Pistons',
    'CHO': 'Charlotte Hornets',
    'NOP': 'New Orleans Pelicans',
    'SAS': 'San Antonio Spurs',
    'MEM': 'Memphis Grizzlies',
    'UTA': 'Utah Jazz',
    'OKC': 'Oklahoma City Thunder',
    'POR': 'Portland Trail Blazers',
    'MIN': 'Minnesota Timberwolves',
    'SAC': 'Sacramento Kings',
    'HOU': 'Houston Rockets',
  };

  useEffect(() => {
    fetchTeamData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamCode]);

  const fetchTeamData = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch all player totals
      const response = await fetch('https://api.server.nbaapi.com/api/playertotals?pageSize=500');
      const data = await response.json();

      // Filter players by team
      const teamPlayers = data.data.filter(p => p.team === teamCode);

      if (teamPlayers.length === 0) {
        setError('Team not found');
        setLoading(false);
        return;
      }

      // Calculate team stats
      const stats = {
        team: teamCode,
        teamName: teamNames[teamCode] || teamCode,
        players: teamPlayers.length,
        totalGames: teamPlayers.length > 0 ? teamPlayers[0].games : 0,
        totalPoints: 0,
        totalRebounds: 0,
        totalAssists: 0,
        totalSteals: 0,
        totalBlocks: 0,
      };

      // Aggregate stats
      teamPlayers.forEach(player => {
        stats.totalPoints += player.points;
        stats.totalRebounds += player.totalRb;
        stats.totalAssists += player.assists;
        stats.totalSteals += player.steals;
        stats.totalBlocks += player.blocks;
      });

      // Calculate per-game averages
      const gameGames = teamPlayers[0]?.games || 1;
      stats.ppgTeam = gameGames > 0 ? (stats.totalPoints / gameGames).toFixed(1) : 0;
      stats.rpgTeam = gameGames > 0 ? (stats.totalRebounds / gameGames).toFixed(1) : 0;
      stats.apgTeam = gameGames > 0 ? (stats.totalAssists / gameGames).toFixed(1) : 0;
      stats.spgTeam = gameGames > 0 ? (stats.totalSteals / gameGames).toFixed(1) : 0;
      stats.bpgTeam = gameGames > 0 ? (stats.totalBlocks / gameGames).toFixed(1) : 0;

      setTeamStats(stats);

      // Sort players by PPG
      const sortedPlayers = teamPlayers
        .map(p => ({
          ...p,
          ppg: p.games > 0 ? (p.points / p.games).toFixed(1) : 0,
          rpg: p.games > 0 ? (p.totalRb / p.games).toFixed(1) : 0,
          apg: p.games > 0 ? (p.assists / p.games).toFixed(1) : 0,
        }))
        .sort((a, b) => parseFloat(b.ppg) - parseFloat(a.ppg));

      setPlayers(sortedPlayers);
    } catch (err) {
      console.error('Error fetching team data:', err);
      setError('Failed to load team data');
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
          <div className="loading">Loading team data...</div>
        </main>
      </div>
    );
  }

  if (error || !teamStats) {
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

            <div className="team-detail-header">
              <div className="team-info">
                <h1>🏀 {teamStats.teamName}</h1>
                <p className="team-meta">{teamStats.team} • {teamStats.players} Players • Season 2025</p>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stats-section">
                <h2>Team Statistics</h2>
                <div className="stat-cards">
                  <div className="stat-card">
                    <div className="stat-value">{teamStats.ppgTeam}</div>
                    <div className="stat-label">Points Per Game</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{teamStats.rpgTeam}</div>
                    <div className="stat-label">Rebounds Per Game</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{teamStats.apgTeam}</div>
                    <div className="stat-label">Assists Per Game</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{teamStats.spgTeam}</div>
                    <div className="stat-label">Steals Per Game</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{teamStats.bpgTeam}</div>
                    <div className="stat-label">Blocks Per Game</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{teamStats.totalGames}</div>
                    <div className="stat-label">Games Played</div>
                  </div>
                </div>

                <div className="detailed-stats">
                  <h3>Season Totals</h3>
                  <table className="stats-table">
                    <tbody>
                      <tr>
                        <td><strong>Total Points</strong></td>
                        <td colspan="2">{teamStats.totalPoints.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td><strong>Total Rebounds</strong></td>
                        <td colspan="2">{teamStats.totalRebounds.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td><strong>Total Assists</strong></td>
                        <td colspan="2">{teamStats.totalAssists.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td><strong>Total Steals</strong></td>
                        <td colspan="2">{teamStats.totalSteals.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td><strong>Total Blocks</strong></td>
                        <td colspan="2">{teamStats.totalBlocks.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="stats-section">
                <h2>Key Players</h2>
                <div className="players-list">
                  {players.slice(0, 10).map((player, idx) => (
                    <div key={player.playerId} className="player-item">
                      <div className="rank">{idx + 1}</div>
                      <div className="player-details">
                        <p className="player-name">{player.playerName}</p>
                        <p className="player-pos">{player.position}</p>
                      </div>
                      <div className="player-stats">
                        <span className="ppg">{player.ppg} PPG</span>
                        <span className="rpg">{player.rpg} RPG</span>
                        <span className="apg">{player.apg} APG</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Trending Takes Section */}
            <div className="trending-takes-section">
              <h2>Trending Takes About {teamStats.teamName}</h2>
              <div className="takes-list">
                {[
                  {
                    id: 1,
                    author: 'TeamAnalyst',
                    displayName: 'Team Analyst',
                    avatar: '👨‍💼',
                    take: `${teamStats.teamName} is the most complete team in the league this season`,
                    rank: 9.1,
                    numRatings: 2156,
                    likes: 1087,
                    comments: 245
                  },
                  {
                    id: 2,
                    author: 'CoachsTake',
                    displayName: 'Coach\'s Take',
                    avatar: '🏀',
                    take: `${teamStats.teamName}'s depth at every position is unmatched in 2025`,
                    rank: 8.8,
                    numRatings: 1943,
                    likes: 921,
                    comments: 178
                  },
                  {
                    id: 3,
                    author: 'StrengthCoach',
                    displayName: 'Strength Coach',
                    avatar: '💪',
                    take: `${teamStats.teamName}'s defensive intensity sets them apart from the rest`,
                    rank: 9.0,
                    numRatings: 2034,
                    likes: 1023,
                    comments: 189
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
              <h4>About Team Statistics</h4>
              <p>Team statistics are aggregated from individual player seasonal data. Per-game averages are calculated based on games played by key team members.</p>
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

export default TeamDetail;
