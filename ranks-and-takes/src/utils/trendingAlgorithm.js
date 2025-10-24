/**
 * Trending Algorithm for Ranks & Takes
 *
 * This algorithm calculates a trending score for takes based on:
 * - Recency (time decay)
 * - Engagement (likes, comments, ratings)
 * - Quality (rating score, ball knowledge)
 * - Momentum (rate of change in engagement)
 */

/**
 * Calculate the trending score for a single take
 *
 * @param {Object} take - The take object containing metrics
 * @param {number} take.likes - Number of likes
 * @param {number} take.comments - Number of comments
 * @param {number} take.numRatings - Number of ratings received
 * @param {number} take.rank - Average rating score (0-10)
 * @param {number} take.ballKnowledge - Ball knowledge score of author (0-100)
 * @param {string} take.timestamp - Time since post (e.g., "2 hours ago", "1 day ago")
 * @param {Object} options - Optional configuration for weights
 * @returns {number} The trending score
 */
export const calculateTrendingScore = (take, options = {}) => {
  // Default weights for different factors
  const weights = {
    engagement: options.engagementWeight || 0.40,      // 40% - Likes, comments, ratings
    quality: options.qualityWeight || 0.35,            // 35% - Rating score and author credibility
    recency: options.recencyWeight || 0.20,            // 20% - Time decay
    momentum: options.momentumWeight || 0.05           // 5% - Rate of change
  };

  // Calculate individual scores (0-100 scale)
  const engagementScore = calculateEngagementScore(take);
  const qualityScore = calculateQualityScore(take);
  const recencyScore = calculateRecencyScore(take.timestamp);
  const momentumScore = calculateMomentumScore(take);

  // Weighted combination
  const trendingScore =
    (engagementScore * weights.engagement) +
    (qualityScore * weights.quality) +
    (recencyScore * weights.recency) +
    (momentumScore * weights.momentum);

  // Scale to 0-10000 range for easier reading
  return Math.round(trendingScore * 100);
};

/**
 * Calculate engagement score (0-100)
 * Based on: likes, comments, number of ratings
 */
const calculateEngagementScore = (take) => {
  // Normalize engagement metrics using logarithmic scale
  // This prevents a few outliers from dominating

  const likeScore = Math.min(Math.log10(Math.max(take.likes, 1)) * 20, 40);
  const commentScore = Math.min(Math.log10(Math.max(take.comments, 1)) * 15, 30);
  const ratingScore = Math.min(Math.log10(Math.max(take.numRatings, 1)) * 15, 30);

  return Math.min(likeScore + commentScore + ratingScore, 100);
};

/**
 * Calculate quality score (0-100)
 * Based on: rating score (0-10) and author's ball knowledge (0-100)
 */
const calculateQualityScore = (take) => {
  // Rating score: 0-10 scale → 0-60 points
  const ratingComponent = (take.rank / 10) * 60;

  // Ball knowledge: 0-100 scale → 0-40 points
  const ballKnowledgeComponent = (take.ballKnowledge / 100) * 40;

  return Math.min(ratingComponent + ballKnowledgeComponent, 100);
};

/**
 * Calculate recency score (0-100)
 * Uses exponential decay - newer posts score higher
 * Half-life: 24 hours (post loses 50% score value after 24 hours)
 */
const calculateRecencyScore = (timestamp) => {
  const now = new Date();
  const postTime = parseTimestampToDate(timestamp);

  // Time difference in hours
  const hoursDiff = (now - postTime) / (1000 * 60 * 60);

  // Exponential decay with 24-hour half-life
  // formula: 100 * (0.5 ^ (hours / 24))
  const decayFactor = Math.pow(0.5, hoursDiff / 24);

  return Math.max(decayFactor * 100, 5); // Minimum 5 points for very old posts
};

/**
 * Calculate momentum score (0-100)
 * Measures rate of engagement change
 * This requires historical data, so we estimate based on likes/comments ratio
 */
const calculateMomentumScore = (take) => {
  // If engagement is recent and concentrated, it shows momentum
  // High comments-to-likes ratio suggests active discussion

  const engagementRatio = take.comments > 0
    ? Math.min((take.comments / Math.max(take.likes, 1)) * 30, 100)
    : 0;

  // Bonus for high engagement overall
  const totalEngagement = take.likes + take.comments;
  const engagementBonus = Math.min(Math.log10(Math.max(totalEngagement, 1)) * 10, 30);

  return Math.min(engagementRatio + engagementBonus, 100);
};

/**
 * Parse timestamp strings like "2 hours ago", "1 day ago" to Date objects
 */
const parseTimestampToDate = (timestamp) => {
  const now = new Date();
  const parts = timestamp.toLowerCase().match(/(\d+)\s+(\w+)\s+ago/);

  if (!parts) return now; // Default to now if parsing fails

  const [, value, unit] = parts;
  const num = parseInt(value, 10);

  let timeMs = 0;
  switch (unit) {
    case 'second':
    case 'seconds':
      timeMs = num * 1000;
      break;
    case 'minute':
    case 'minutes':
      timeMs = num * 60 * 1000;
      break;
    case 'hour':
    case 'hours':
      timeMs = num * 60 * 60 * 1000;
      break;
    case 'day':
    case 'days':
      timeMs = num * 24 * 60 * 60 * 1000;
      break;
    case 'week':
    case 'weeks':
      timeMs = num * 7 * 24 * 60 * 60 * 1000;
      break;
    case 'month':
    case 'months':
      timeMs = num * 30 * 24 * 60 * 60 * 1000;
      break;
    default:
      return now;
  }

  return new Date(now.getTime() - timeMs);
};

/**
 * Sort takes by trending score
 */
export const sortByTrending = (takes, options = {}) => {
  return takes
    .map(take => ({
      ...take,
      trendingScore: calculateTrendingScore(take, options)
    }))
    .sort((a, b) => b.trendingScore - a.trendingScore);
};

/**
 * Get top N trending takes
 */
export const getTopTrendingTakes = (takes, limit = 10, options = {}) => {
  return sortByTrending(takes, options).slice(0, limit);
};

/**
 * Calculate individual component scores for a take
 * Useful for debugging and understanding the breakdown
 */
export const getScoreBreakdown = (take, options = {}) => {
  const weights = {
    engagement: options.engagementWeight || 0.40,
    quality: options.qualityWeight || 0.35,
    recency: options.recencyWeight || 0.20,
    momentum: options.momentumWeight || 0.05
  };

  const engagement = calculateEngagementScore(take);
  const quality = calculateQualityScore(take);
  const recency = calculateRecencyScore(take.timestamp);
  const momentum = calculateMomentumScore(take);

  return {
    engagement: {
      score: engagement,
      weight: weights.engagement,
      contribution: engagement * weights.engagement
    },
    quality: {
      score: quality,
      weight: weights.quality,
      contribution: quality * weights.quality
    },
    recency: {
      score: recency,
      weight: weights.recency,
      contribution: recency * weights.recency
    },
    momentum: {
      score: momentum,
      weight: weights.momentum,
      contribution: momentum * weights.momentum
    },
    final: Math.round(
      (engagement * weights.engagement) +
      (quality * weights.quality) +
      (recency * weights.recency) +
      (momentum * weights.momentum)
    ) * 100
  };
};

/**
 * Example usage with default options:
 *
 * const take = {
 *   likes: 523,
 *   comments: 148,
 *   numRatings: 1203,
 *   rank: 8.5,
 *   ballKnowledge: 78,
 *   timestamp: '2 hours ago'
 * };
 *
 * const score = calculateTrendingScore(take);
 * console.log(score); // e.g., 8942
 *
 * // Custom weights
 * const customScore = calculateTrendingScore(take, {
 *   engagementWeight: 0.50,
 *   qualityWeight: 0.30,
 *   recencyWeight: 0.15,
 *   momentumWeight: 0.05
 * });
 *
 * // Get score breakdown
 * const breakdown = getScoreBreakdown(take);
 * console.log(breakdown);
 */
