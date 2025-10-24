/*
  PlayerStats Component

  Data provided by NBA Stats API (https://api.server.nbaapi.com/)
  Licensed under MIT License

  This component fetches and displays NBA player statistics including:
  - Player Totals: Traditional season stats (points, rebounds, assists, etc.)
  - Advanced Stats: Advanced metrics (PER, TS%, Usage%, Win Shares, VORP, etc.)
*/

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotificationStore } from '../store/notificationStore';
import '../styles/Pages.css';

const PlayerStats = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [teams, setTeamsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [sortBy, setSortBy] = useState('ppg');
  const [sortDirection, setSortDirection] = useState('desc');
  const [activeTab, setActiveTab] = useState('players');
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

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      // Fetch all players from our backend API
      const playersResponse = await fetch('http://localhost:5000/api/players');
      const playersData = await playersResponse.json();

      if (playersData && playersData.length > 0) {
        // Format players data for consistent display
        const playersWithStats = playersData.map(player => ({
          ...player,
          // Ensure stats are numbers for sorting
          ppg: Number(player.ppg) || 0,
          rpg: Number(player.rpg) || 0,
          apg: Number(player.apg) || 0,
          spg: Number(player.spg) || 0,
          bpg: Number(player.bpg) || 0,
          fgPercent: Number(player.fgPercent) || 0,
          threePercent: Number(player.threePercent) || 0,
          ftPercent: Number(player.ftPercent) || 0,
        }));

        setPlayers(playersWithStats);
      }

      // Fetch teams data
      const teamsResponse = await fetch('http://localhost:5000/api/teams');
      const teamsData = await teamsResponse.json();
      if (teamsData && teamsData.length > 0) {
        setTeamsData(teamsData);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSortClick = (stat) => {
    console.log('handleSortClick called with:', stat, 'current sortBy:', sortBy);
    if (sortBy === stat) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
      console.log('toggling direction');
    } else {
      setSortBy(stat);
      setSortDirection('desc');
      console.log('setting new sort stat to:', stat);
    }
  };

  const filteredPlayers = players
    .filter(player => {
      const matchesSearch = player.playerName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTeam = selectedTeam === 'all' || (player.team === selectedTeam);
      return matchesSearch && matchesTeam;
    })
    .sort((a, b) => {
      const aValue = Number(a[sortBy]) || 0;
      const bValue = Number(b[sortBy]) || 0;
      const result = sortDirection === 'desc' ? bValue - aValue : aValue - bValue;
      return result;
    });

  console.log('RENDER: sortBy=', sortBy, 'direction=', sortDirection);
  if (filteredPlayers.length > 0) {
    const first = filteredPlayers[0];
    const second = filteredPlayers[1];
    console.log('First player:', first.playerName, 'all props:', Object.keys(first).slice(0, 15));
    console.log('PPG value:', first.ppg, 'RPG value:', first.rpg, 'APG value:', first.apg);
    console.log('Comparing:', first.playerName, 'value:', first[sortBy], 'vs', second?.playerName, 'value:', second?.[sortBy]);
  }

  const uniqueTeams = [...new Set(players.map(p => p.team).filter(Boolean))].sort();

  // Top performances from the last week (mock data)
  const topPerformances = [
    { id: 1, playerName: 'Luka Doncic', team: 'Dallas Mavericks', points: 42, rebounds: 11, assists: 9, date: '2 days ago' },
    { id: 2, playerName: 'Jayson Tatum', team: 'Boston Celtics', points: 39, rebounds: 10, assists: 6, date: '3 days ago' },
    { id: 3, playerName: 'Giannis Antetokounmpo', team: 'Milwaukee Bucks', points: 38, rebounds: 14, assists: 5, date: '4 days ago' },
    { id: 4, playerName: 'Kevin Durant', team: 'Phoenix Suns', points: 36, rebounds: 8, assists: 4, date: '5 days ago' },
    { id: 5, playerName: 'Stephen Curry', team: 'Golden State Warriors', points: 40, rebounds: 5, assists: 10, date: '6 days ago' },
  ];

  // Sort teams by wins for display
  const sortedTeams = teams.slice().sort((a, b) => {
    const teamA = teams.find(t => t.teamName === a);
    const teamB = teams.find(t => t.teamName === b);
    return (teamB?.wins || 0) - (teamA?.wins || 0);
  });

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
            <a href="/player-stats" className="nav-item active">Player Stats</a>
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
              <h2>NBA Stats</h2>
              <p>Player and team statistics</p>
            </div>

            {/* Stats Tabs */}
            <div className="stats-tabs">
              <button
                className={`stats-tab ${activeTab === 'players' ? 'active' : ''}`}
                onClick={() => setActiveTab('players')}
              >
                Player Stats
              </button>
              <button
                className={`stats-tab ${activeTab === 'teams' ? 'active' : ''}`}
                onClick={() => setActiveTab('teams')}
              >
                Team Stats
              </button>
            </div>

            <div className="stats-filters">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search player..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="team-filter">
                <label>Filter by team:</label>
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Teams</option>
                  {uniqueTeams.map(team => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Player Stats Tab */}
            {activeTab === 'players' && (
              <>
            {loading ? (
              <div className="loading-state">
                <p>Loading player stats...</p>
              </div>
            ) : filteredPlayers.length > 0 ? (
              <div className="stats-container">
                <div className="stats-table-wrapper">
                  <table className="stats-table">
                    <thead>
                      <tr>
                        <th>Player</th>
                        <th>Team</th>
                        <th>Position</th>
                        <th
                          className={`sortable-header ${sortBy === 'ppg' ? 'active' : ''}`}
                          onClick={() => handleSortClick('ppg')}
                          title="Click to sort by PPG"
                        >
                          PPG {sortBy === 'ppg' && (sortDirection === 'desc' ? '↓' : '↑')}
                        </th>
                        <th
                          className={`sortable-header ${sortBy === 'rpg' ? 'active' : ''}`}
                          onClick={() => handleSortClick('rpg')}
                          title="Click to sort by RPG"
                        >
                          RPG {sortBy === 'rpg' && (sortDirection === 'desc' ? '↓' : '↑')}
                        </th>
                        <th
                          className={`sortable-header ${sortBy === 'apg' ? 'active' : ''}`}
                          onClick={() => handleSortClick('apg')}
                          title="Click to sort by APG"
                        >
                          APG {sortBy === 'apg' && (sortDirection === 'desc' ? '↓' : '↑')}
                        </th>
                        <th
                          className={`sortable-header ${sortBy === 'spg' ? 'active' : ''}`}
                          onClick={() => handleSortClick('spg')}
                          title="Click to sort by SPG"
                        >
                          SPG {sortBy === 'spg' && (sortDirection === 'desc' ? '↓' : '↑')}
                        </th>
                        <th
                          className={`sortable-header ${sortBy === 'bpg' ? 'active' : ''}`}
                          onClick={() => handleSortClick('bpg')}
                          title="Click to sort by BPG"
                        >
                          BPG {sortBy === 'bpg' && (sortDirection === 'desc' ? '↓' : '↑')}
                        </th>
                        <th
                          className={`sortable-header ${sortBy === 'games' ? 'active' : ''}`}
                          onClick={() => handleSortClick('games')}
                          title="Click to sort by Games"
                        >
                          Games {sortBy === 'games' && (sortDirection === 'desc' ? '↓' : '↑')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPlayers.map((player, idx) => (
                        <tr
                          key={`${player.playerName}-${idx}`}
                          className={`${idx % 2 === 0 ? 'even' : 'odd'} clickable-row`}
                          onClick={() => navigate(`/player/${encodeURIComponent(player.playerName)}`)}
                          style={{ cursor: 'pointer' }}
                        >
                          <td className="player-name">
                            <span className="rank-badge">{idx + 1}</span>
                            {player.playerName}
                          </td>
                          <td className="team-abbr">{player.team || 'N/A'}</td>
                          <td className="position">{player.position || 'N/A'}</td>
                          <td className="stat-cell highlight">
                            <strong>{player.ppg}</strong>
                          </td>
                          <td className="stat-cell">{player.rpg}</td>
                          <td className="stat-cell">{player.apg}</td>
                          <td className="stat-cell">{player.spg}</td>
                          <td className="stat-cell">{player.bpg}</td>
                          <td className="stat-cell games">{player.games}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <p>No players found</p>
                <small>Try adjusting your search or filters</small>
              </div>
            )}

            <div className="stats-legend">
              <h4>Legend:</h4>
              <p><strong>PPG</strong> = Points Per Game | <strong>RPG</strong> = Rebounds Per Game | <strong>APG</strong> = Assists Per Game</p>
              <p><strong>SPG</strong> = Steals Per Game | <strong>BPG</strong> = Blocks Per Game | <strong>Games</strong> = Games Played</p>
              <small>Data provided by NBA Stats API (https://api.server.nbaapi.com/) - Licensed under MIT</small>
            </div>
              </>
            )}

            {/* Team Stats Tab */}
            {activeTab === 'teams' && (
              <>
                {loading ? (
                  <div className="loading-state">
                    <p>Loading team stats...</p>
                  </div>
                ) : teams.length > 0 ? (
                  <div className="stats-container">
                    <div className="stats-table-wrapper">
                      <table className="stats-table">
                        <thead>
                          <tr>
                            <th>Team</th>
                            <th>City</th>
                            <th>Wins</th>
                            <th>Losses</th>
                            <th>Win %</th>
                            <th>PPG</th>
                            <th>Conference</th>
                            <th>Division</th>
                          </tr>
                        </thead>
                        <tbody>
                          {teams.map((team, idx) => (
                            <tr
                              key={`${team.teamName}-${idx}`}
                              className={`${idx % 2 === 0 ? 'even' : 'odd'} clickable-row`}
                              onClick={() => navigate(`/team/${team.abbreviation}`)}
                              style={{ cursor: 'pointer' }}
                            >
                              <td className="player-name">
                                <span className="rank-badge">{idx + 1}</span>
                                {team.teamName}
                              </td>
                              <td>{team.city}</td>
                              <td className="stat-cell"><strong>{team.wins || 0}</strong></td>
                              <td className="stat-cell">{team.losses || 0}</td>
                              <td className="stat-cell">{((team.winPercent || 0) * 100).toFixed(1)}%</td>
                              <td className="stat-cell highlight">{(team.pointsPerGame || 0).toFixed(1)}</td>
                              <td>{team.conference || 'N/A'}</td>
                              <td>{team.division || 'N/A'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>No teams available</p>
                  </div>
                )}
                <div className="stats-legend">
                  <h4>Legend:</h4>
                  <p><strong>PPG</strong> = Points Per Game | <strong>Win %</strong> = Winning Percentage</p>
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <aside className="sidebar">
            <div className="sidebar-card">
              <h3>Top Performances (Last Week)</h3>
              <div className="top-performers">
                {topPerformances.map((performance, idx) => (
                  <div
                    key={`top-performance-${performance.id}`}
                    className="performer-item"
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="rank-circle">{idx + 1}</div>
                    <div className="performer-info">
                      <p className="name">{performance.playerName}</p>
                      <p className="team">{performance.team}</p>
                      <p className="performance-stats" style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>
                        {performance.points}pts {performance.rebounds}reb {performance.assists}ast
                      </p>
                      <p className="performance-date" style={{ fontSize: '10px', color: '#bbb', marginTop: '2px' }}>
                        {performance.date}
                      </p>
                    </div>
                    <div className="ppg-badge">{performance.points}</div>
                  </div>
                ))}
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

export default PlayerStats;
