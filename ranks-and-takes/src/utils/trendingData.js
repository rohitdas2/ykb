// Shared trending data used across Search and Trending pages
export const trendingTopics = [
  {
    id: 1,
    tag: '#MVPRace',
    takes: 45230,
    trend: '↑ 12%',
    description: 'Who deserves MVP this season?',
    icon: '🏆'
  },
  {
    id: 2,
    tag: '#CelticsRevolution',
    takes: 38920,
    trend: '↑ 8%',
    description: 'Best team in the league discussion',
    icon: '🟢'
  },
  {
    id: 3,
    tag: '#LakeShow',
    takes: 32150,
    trend: '↑ 5%',
    description: 'Lakers championship contention',
    icon: '🟣'
  },
  {
    id: 4,
    tag: '#TradeDeadline',
    takes: 28940,
    trend: '↑ 15%',
    description: 'Team upgrades and rumors',
    icon: '🔄'
  },
  {
    id: 5,
    tag: '#PlayoffRun',
    takes: 25100,
    trend: '→ 2%',
    description: 'Playoff seeding and matchups',
    icon: '🏅'
  },
  {
    id: 6,
    tag: '#Draft2024',
    takes: 19230,
    trend: '↑ 22%',
    description: 'Upcoming draft picks and prospects',
    icon: '🎯'
  },
];

export const trendingPlayers = [
  {
    id: 1,
    name: 'Jayson Tatum',
    team: 'Celtics',
    mentions: 12340,
    trend: '↑ 18%',
    icon: '🏀',
    type: 'player'
  },
  {
    id: 2,
    name: 'Luka Doncic',
    team: 'Mavericks',
    mentions: 11200,
    trend: '↑ 10%',
    icon: '🏀',
    type: 'player'
  },
  {
    id: 3,
    name: 'Giannis Antetokounmpo',
    team: 'Bucks',
    mentions: 9800,
    trend: '↑ 7%',
    icon: '🏀',
    type: 'player'
  },
  {
    id: 4,
    name: 'LeBron James',
    team: 'Lakers',
    mentions: 8900,
    trend: '↓ 3%',
    icon: '🏀',
    type: 'player'
  },
  {
    id: 5,
    name: 'Damian Lillard',
    team: 'Trail Blazers',
    mentions: 7650,
    trend: '↑ 25%',
    icon: '🏀',
    type: 'player'
  },
];

export const trendingTeams = [
  {
    id: 1,
    name: 'Boston Celtics',
    logo: '🟢',
    mentions: 15200,
    trend: '↑ 14%',
    type: 'team'
  },
  {
    id: 2,
    name: 'Los Angeles Lakers',
    logo: '🟣',
    mentions: 12800,
    trend: '↑ 9%',
    type: 'team'
  },
  {
    id: 3,
    name: 'Denver Nuggets',
    logo: '🟠',
    mentions: 9400,
    trend: '↑ 6%',
    type: 'team'
  },
  {
    id: 4,
    name: 'Phoenix Suns',
    logo: '☀️',
    mentions: 8200,
    trend: '↓ 2%',
    type: 'team'
  },
];

// Helper function to check if an item is trending
export const isTrending = (name, type) => {
  const trendingNames = {
    player: trendingPlayers.map(p => p.name.toLowerCase()),
    team: trendingTeams.map(t => t.name.toLowerCase()),
    topic: trendingTopics.map(t => t.tag.toLowerCase())
  };

  return trendingNames[type]?.includes(name.toLowerCase()) || false;
};

// Helper function to get trending data for an item
export const getTrendingInfo = (name, type) => {
  const allTrending = {
    player: trendingPlayers,
    team: trendingTeams,
    topic: trendingTopics
  };

  return allTrending[type]?.find(item =>
    item.name?.toLowerCase() === name.toLowerCase() ||
    item.tag?.toLowerCase() === name.toLowerCase()
  );
};
