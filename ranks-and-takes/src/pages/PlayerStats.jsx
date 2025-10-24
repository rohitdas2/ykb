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
import '../styles/Pages.css';

const PlayerStats = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [sortBy, setSortBy] = useState('ppg');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showDMs, setShowDMs] = useState(false);
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

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      // Fetch player totals from NBA Stats API (https://api.server.nbaapi.com/)
      // Licensed under MIT License
      const response = await fetch('https://api.server.nbaapi.com/api/playertotals?pageSize=100');
      const data = await response.json();

      if (data.data && data.data.length > 0) {
        // Filter current season players and calculate per-game stats
        const playersWithStats = data.data
          .map(player => ({
            ...player,
            // Calculate per-game averages (ensure values are numbers for sorting)
            ppg: player.games > 0 ? parseFloat((player.points / player.games).toFixed(1)) : 0,
            rpg: player.games > 0 ? parseFloat((player.totalRb / player.games).toFixed(1)) : 0,
            apg: player.games > 0 ? parseFloat((player.assists / player.games).toFixed(1)) : 0,
            spg: player.games > 0 ? parseFloat((player.steals / player.games).toFixed(1)) : 0,
            bpg: player.games > 0 ? parseFloat((player.blocks / player.games).toFixed(1)) : 0,
            // Format shooting percentages
            fgPercent: (player.fieldPercent * 100).toFixed(1),
            ftPercent: (player.ftPercent * 100).toFixed(1),
            threePercent: (player.threePercent * 100).toFixed(1),
          }));

        setPlayers(playersWithStats);
      }
    } catch (error) {
      console.error('Error fetching player stats:', error);
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

  const teams = [...new Set(players.map(p => p.team).filter(Boolean))].sort();

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
            <a href="/trending" className="nav-item">Search</a>
            <a href="/profile" className="nav-item">Profile</a>
          </nav>
        </div>
        <div className="header-right">
          <button className="btn btn-icon" onClick={() => setShowDMs(!showDMs)}>💬</button>
          <button className="btn btn-icon">🔔</button>
        </div>
      </header>

      <main className="main-content">
        <div className="content-wrapper">
          <div className="feed-section">
            <div className="page-title">
              <h2>NBA Player Stats</h2>
              <p>Real-time player statistics and performance data</p>
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
                  {teams.map(team => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </select>
              </div>
            </div>

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
          </div>

          {/* Sidebar */}
          <aside className="sidebar">
            <div className="sidebar-card">
              <h3>Top Performers</h3>
              <div className="top-performers">
                {filteredPlayers.slice(0, 5).map((player, idx) => (
                  <div
                    key={`top-performer-${player.playerName}-${idx}`}
                    className="performer-item"
                    onClick={() => navigate(`/player/${encodeURIComponent(player.playerName)}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="rank-circle">{idx + 1}</div>
                    <div className="performer-info">
                      <p className="name">{player.playerName}</p>
                      <p className="team">{player.team}</p>
                    </div>
                    <div className="ppg-badge">{player.ppg} PPG</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="sidebar-card">
              <h3>Stats Overview</h3>
              <div className="overview-stats">
                <div className="overview-item">
                  <p className="label">Total Players</p>
                  <p className="value">{filteredPlayers.length}</p>
                </div>
                <div className="overview-item">
                  <p className="label">Avg PPG</p>
                  <p className="value">
                    {filteredPlayers.length > 0
                      ? (filteredPlayers.reduce((sum, p) => sum + parseFloat(p.ppg), 0) / filteredPlayers.length).toFixed(1)
                      : 0}
                  </p>
                </div>
                <div className="overview-item">
                  <p className="label">Avg RPG</p>
                  <p className="value">
                    {filteredPlayers.length > 0
                      ? (filteredPlayers.reduce((sum, p) => sum + parseFloat(p.rpg), 0) / filteredPlayers.length).toFixed(1)
                      : 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="sidebar-card">
              <h3>About These Stats</h3>
              <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>
                Statistics are calculated from the latest available game data. Averages are computed per player from their recent games.
              </p>
            </div>
          </aside>
        </div>
      </main>

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
