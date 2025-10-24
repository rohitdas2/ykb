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
              <a href="/trending" className="nav-item">Trending</a>
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
              <a href="/trending" className="nav-item">Trending</a>
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
            <a href="/trending" className="nav-item">Trending</a>
            <a href="/profile" className="nav-item">Profile</a>
          </nav>
        </div>
        <div className="header-right">
          <button className="btn btn-icon">🔔</button>
        </div>
      </header>

      <main className="main-content">
        <div className="content-wrapper">
          <div className="feed-section">
            <button className="btn btn-secondary" onClick={() => navigate('/trending')}>← Back to Search</button>

            <div className="player-detail-header">
              <div className="player-info">
                <h1>🏀 {playerData.playerName}</h1>
                <p className="player-meta">{playerData.position} • {playerData.team} • Season {playerData.season}</p>
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
    </div>
  );
};

export default PlayerDetail;
