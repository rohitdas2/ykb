import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Pages.css';

const Rankings = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState('players');
  const [players, setPlayers] = useState([
    { id: 1, rank: 1, name: 'Luka Doncic', team: 'Mavericks', score: 9.2, change: '↑ 1' },
    { id: 2, rank: 2, name: 'Giannis Antetokounmpo', team: 'Bucks', score: 9.0, change: '↓ 1' },
    { id: 3, rank: 3, name: 'Jayson Tatum', team: 'Celtics', score: 8.9, change: '→' },
    { id: 4, rank: 4, name: 'Kevin Durant', team: 'Suns', score: 8.7, change: '↑ 2' },
    { id: 5, rank: 5, name: 'LeBron James', team: 'Lakers', score: 8.5, change: '↓ 1' },
    { id: 6, rank: 6, name: 'Stephen Curry', team: 'Warriors', score: 8.3, change: '→' },
    { id: 7, rank: 7, name: 'Joel Embiid', team: '76ers', score: 8.2, change: '↑ 3' },
    { id: 8, rank: 8, name: 'Damian Lillard', team: 'Trail Blazers', score: 8.0, change: '↓ 2' },
  ]);

  const [teams, setTeams] = useState([
    { id: 1, rank: 1, name: 'Boston Celtics', wins: 64, score: 9.1, change: '↑ 2' },
    { id: 2, rank: 2, name: 'Denver Nuggets', wins: 57, score: 8.9, change: '→' },
    { id: 3, rank: 3, name: 'Phoenix Suns', wins: 62, score: 8.8, change: '↑ 1' },
    { id: 4, rank: 4, name: 'Los Angeles Lakers', wins: 56, score: 8.4, change: '↓ 1' },
    { id: 5, rank: 5, name: 'Golden State Warriors', wins: 46, score: 7.9, change: '→' },
  ]);

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
          <button className="btn btn-icon">💬</button>
          <button className="btn btn-icon">🔔</button>
        </div>
      </header>

      <main className="main-content">
        <div className="content-wrapper">
          <div className="feed-section">
            <div className="page-title">
              <h2>Rankings</h2>
              <p>Subjective + Objective Rankings</p>
            </div>

            <div className="category-tabs">
              <button
                className={`tab ${category === 'players' ? 'active' : ''}`}
                onClick={() => setCategory('players')}
              >
                Players
              </button>
              <button
                className={`tab ${category === 'teams' ? 'active' : ''}`}
                onClick={() => setCategory('teams')}
              >
                Teams
              </button>
              <button
                className={`tab ${category === 'plays' ? 'active' : ''}`}
                onClick={() => setCategory('plays')}
              >
                Best Plays
              </button>
              <button
                className={`tab ${category === 'prospects' ? 'active' : ''}`}
                onClick={() => setCategory('prospects')}
              >
                Draft Prospects
              </button>
            </div>

            {category === 'players' && (
              <div className="rankings-list">
                <div className="rankings-header">
                  <div className="rank-col">Rank</div>
                  <div className="name-col">Player</div>
                  <div className="team-col">Team</div>
                  <div className="score-col">Score</div>
                  <div className="change-col">Change</div>
                </div>
                {players.map((player) => (
                  <div
                    key={player.id}
                    className="ranking-item clickable"
                    onClick={() => navigate(`/player/${encodeURIComponent(player.name)}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="rank-col">{player.rank}</div>
                    <div className="name-col">
                      <span className="emoji">🏀</span>
                      <span>{player.name}</span>
                    </div>
                    <div className="team-col">{player.team}</div>
                    <div className="score-col">{player.score}/10</div>
                    <div className="change-col">{player.change}</div>
                  </div>
                ))}
              </div>
            )}

            {category === 'teams' && (
              <div className="rankings-list">
                <div className="rankings-header">
                  <div className="rank-col">Rank</div>
                  <div className="name-col">Team</div>
                  <div className="team-col">Wins</div>
                  <div className="score-col">Score</div>
                  <div className="change-col">Change</div>
                </div>
                {teams.map((team) => {
                  // Map team name to team code
                  const teamCodeMap = {
                    'Boston Celtics': 'BOS',
                    'Denver Nuggets': 'DEN',
                    'Phoenix Suns': 'PHX',
                    'Los Angeles Lakers': 'LAL',
                    'Golden State Warriors': 'GSW',
                    'Milwaukee Bucks': 'MIL',
                    'Dallas Mavericks': 'DAL',
                    'New York Knicks': 'NYK',
                    'Los Angeles Clippers': 'LAC',
                    'Miami Heat': 'MIA',
                    'Brooklyn Nets': 'BRK',
                    '76ers': 'PHI',
                    'Philadelphia 76ers': 'PHI',
                    'Atlanta Hawks': 'ATL',
                    'Chicago Bulls': 'CHI',
                    'Toronto Raptors': 'TOR',
                    'Cleveland Cavaliers': 'CLE',
                    'Orlando Magic': 'ORL',
                    'Washington Wizards': 'WAS',
                    'Indiana Pacers': 'IND',
                    'Detroit Pistons': 'DET',
                    'Charlotte Hornets': 'CHO',
                    'New Orleans Pelicans': 'NOP',
                    'San Antonio Spurs': 'SAS',
                    'Memphis Grizzlies': 'MEM',
                    'Utah Jazz': 'UTA',
                    'Oklahoma City Thunder': 'OKC',
                    'Portland Trail Blazers': 'POR',
                    'Minnesota Timberwolves': 'MIN',
                    'Sacramento Kings': 'SAC',
                    'Houston Rockets': 'HOU'
                  };
                  const teamCode = teamCodeMap[team.name];

                  return (
                    <div
                      key={team.id}
                      className="ranking-item clickable"
                      onClick={() => teamCode && navigate(`/team/${teamCode}`)}
                      style={{ cursor: teamCode ? 'pointer' : 'default' }}
                    >
                      <div className="rank-col">{team.rank}</div>
                      <div className="name-col">
                        <span className="emoji">🏆</span>
                        <span>{team.name}</span>
                      </div>
                      <div className="team-col">{team.wins}W</div>
                      <div className="score-col">{team.score}/10</div>
                      <div className="change-col">{team.change}</div>
                    </div>
                  );
                })}
              </div>
            )}

            {category === 'plays' && (
              <div className="empty-state">
                <p>📹 Best Plays Rankings Coming Soon</p>
                <small>Rate and rank the best highlights and plays</small>
              </div>
            )}

            {category === 'prospects' && (
              <div className="empty-state">
                <p>🎯 Draft Prospects Rankings Coming Soon</p>
                <small>Rate upcoming draft picks</small>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="sidebar">
            <div className="sidebar-card">
              <h3>How Rankings Work</h3>
              <div className="info-box">
                <p>Rankings combine:</p>
                <ul>
                  <li><strong>Subjective Scores</strong> - Your ratings (1-10)</li>
                  <li><strong>Hard Stats</strong> - NBA data & metrics</li>
                  <li><strong>Community Input</strong> - Crowdsourced opinions</li>
                </ul>
                <p>More transparent & accurate than traditional rankings.</p>
              </div>
            </div>

            <div className="sidebar-card">
              <h3>Top Contributors</h3>
              <div className="contributor-list">
                <div className="contributor-item">
                  <span className="rank">1</span>
                  <div className="info">
                    <p className="name">Analytics Pro</p>
                    <p className="count">1,203 ratings</p>
                  </div>
                </div>
                <div className="contributor-item">
                  <span className="rank">2</span>
                  <div className="info">
                    <p className="name">Basketball Eyes</p>
                    <p className="count">987 ratings</p>
                  </div>
                </div>
                <div className="contributor-item">
                  <span className="rank">3</span>
                  <div className="info">
                    <p className="name">Stat Nerd</p>
                    <p className="count">856 ratings</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Rankings;
