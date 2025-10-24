/**
 * ESPN API Integration for NBA Teams and Players
 */

// Cache to avoid repeated API calls
const cache = {
  teams: null,
  players: null,
  standings: null,
  lastFetch: {}
};

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

/**
 * Check if cache is still valid
 */
function isCacheValid(key) {
  if (!cache.lastFetch[key]) return false;
  return Date.now() - cache.lastFetch[key] < CACHE_DURATION;
}

/**
 * Fetch all NBA teams from ESPN API
 * @returns {Promise<Array>} Array of team objects
 */
export async function fetchESPNTeams() {
  try {
    if (cache.teams && isCacheValid('teams')) {
      return cache.teams;
    }

    const response = await fetch('http://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams');

    if (!response.ok) {
      throw new Error(`ESPN API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform ESPN data to our format
    const teams = data.teams.map(team => ({
      id: team.id,
      teamName: team.name,
      displayName: team.displayName,
      abbreviation: team.abbreviation,
      city: team.location,
      logo: team.logo,
      conference: team.conference?.name || 'Unknown',
      division: team.division?.name || 'Unknown',
      venue: team.venue?.fullName || '',
      color: team.color || '#000000',
      alternateColor: team.alternateColor || '#ffffff',
      links: team.links || [],
      isActive: team.isActive,
      // Default values that can be updated from standings
      wins: team.record?.items?.[0]?.summary?.split('-')[0] || 0,
      losses: team.record?.items?.[0]?.summary?.split('-')[1] || 0,
    }));

    cache.teams = teams;
    cache.lastFetch['teams'] = Date.now();
    return teams;
  } catch (error) {
    console.error('Error fetching ESPN teams:', error);
    throw error;
  }
}

/**
 * Fetch NBA standings (team records and rankings)
 * @returns {Promise<Array>} Array of standings with team records
 */
export async function fetchESPNStandings() {
  try {
    if (cache.standings && isCacheValid('standings')) {
      return cache.standings;
    }

    const response = await fetch('http://site.api.espn.com/apis/site/v2/sports/basketball/nba/standings');

    if (!response.ok) {
      throw new Error(`ESPN API error: ${response.status}`);
    }

    const data = await response.json();
    const standings = [];

    // Parse standings data
    if (data.groups) {
      data.groups.forEach(group => {
        group.teams.forEach(teamData => {
          standings.push({
            id: teamData.id,
            abbreviation: teamData.team.abbreviation,
            teamName: teamData.team.displayName,
            wins: parseInt(teamData.stats.find(s => s.name === 'wins')?.value || 0),
            losses: parseInt(teamData.stats.find(s => s.name === 'losses')?.value || 0),
            winPercent: parseFloat(teamData.stats.find(s => s.name === 'winPercent')?.value || 0),
            pointsPerGame: parseFloat(teamData.stats.find(s => s.name === 'pointsPerGame')?.value || 0),
            pointsAllowedPerGame: parseFloat(teamData.stats.find(s => s.name === 'pointsAllowedPerGame')?.value || 0),
            gamesBack: teamData.stats.find(s => s.name === 'gamesBack')?.value || '—',
            conferenceWins: parseInt(teamData.stats.find(s => s.name === 'conferenceWins')?.value || 0),
            conferenceLosses: parseInt(teamData.stats.find(s => s.name === 'conferenceLosses')?.value || 0),
            homeWins: parseInt(teamData.stats.find(s => s.name === 'homeWins')?.value || 0),
            homeLosses: parseInt(teamData.stats.find(s => s.name === 'homeLosses')?.value || 0),
            awayWins: parseInt(teamData.stats.find(s => s.name === 'awayWins')?.value || 0),
            awayLosses: parseInt(teamData.stats.find(s => s.name === 'awayLosses')?.value || 0),
            lastTen: teamData.stats.find(s => s.name === 'lastTen')?.value || '—',
            streak: teamData.stats.find(s => s.name === 'streak')?.value || '—',
          });
        });
      });
    }

    cache.standings = standings;
    cache.lastFetch['standings'] = Date.now();
    return standings;
  } catch (error) {
    console.error('Error fetching ESPN standings:', error);
    throw error;
  }
}

/**
 * Fetch team details including roster
 * @param {string} teamId - ESPN team ID
 * @returns {Promise<Object>} Team details with roster
 */
export async function fetchESPNTeamDetails(teamId) {
  try {
    const response = await fetch(`http://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${teamId}`);

    if (!response.ok) {
      throw new Error(`ESPN API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      ...data.team,
      players: data.team.athletes || [],
    };
  } catch (error) {
    console.error(`Error fetching ESPN team details for ${teamId}:`, error);
    throw error;
  }
}

/**
 * Fetch player details
 * @param {string} playerId - ESPN player ID
 * @returns {Promise<Object>} Player details
 */
export async function fetchESPNPlayerDetails(playerId) {
  try {
    const response = await fetch(`http://site.api.espn.com/apis/site/v2/sports/basketball/nba/athletes/${playerId}`);

    if (!response.ok) {
      throw new Error(`ESPN API error: ${response.status}`);
    }

    const data = await response.json();
    return data.athlete;
  } catch (error) {
    console.error(`Error fetching ESPN player details for ${playerId}:`, error);
    throw error;
  }
}

/**
 * Get team by abbreviation
 * @param {string} abbreviation - Team abbreviation (e.g., 'BOS')
 * @returns {Promise<Object|null>} Team object or null
 */
export async function getTeamByAbbreviation(abbreviation) {
  try {
    const teams = await fetchESPNTeams();
    return teams.find(team => team.abbreviation === abbreviation.toUpperCase()) || null;
  } catch (error) {
    console.error(`Error getting team ${abbreviation}:`, error);
    return null;
  }
}

/**
 * Get teams by conference
 * @param {string} conference - Conference name (e.g., 'East', 'West')
 * @returns {Promise<Array>} Array of teams in conference
 */
export async function getTeamsByConference(conference) {
  try {
    const teams = await fetchESPNTeams();
    return teams.filter(team => team.conference.includes(conference)) || [];
  } catch (error) {
    console.error(`Error getting teams for conference ${conference}:`, error);
    return [];
  }
}

/**
 * Get all teams sorted by standings
 * @returns {Promise<Array>} Teams sorted by wins/losses
 */
export async function getTeamsWithStandings() {
  try {
    const [teams, standings] = await Promise.all([
      fetchESPNTeams(),
      fetchESPNStandings(),
    ]);

    // Merge teams with standings data
    return teams.map(team => {
      const standing = standings.find(s => s.abbreviation === team.abbreviation);
      return {
        ...team,
        ...(standing && {
          wins: standing.wins,
          losses: standing.losses,
          winPercent: standing.winPercent,
          pointsPerGame: standing.pointsPerGame,
          pointsAllowedPerGame: standing.pointsAllowedPerGame,
          gamesBack: standing.gamesBack,
          streak: standing.streak,
        }),
      };
    });
  } catch (error) {
    console.error('Error getting teams with standings:', error);
    return [];
  }
}

/**
 * Clear cache manually if needed
 */
export function clearCache() {
  cache.teams = null;
  cache.players = null;
  cache.standings = null;
  cache.lastFetch = {};
}
