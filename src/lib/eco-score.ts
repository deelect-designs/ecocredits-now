// Eco Score calculation — a dynamic reputation index
// Factors: consistency (streak), total impact, verification rate, community standing

export interface EcoScoreBreakdown {
  overall: number; // 0-100
  consistency: number; // 0-25 — how regularly they submit
  impact: number; // 0-30 — total waste collected weighted
  authenticity: number; // 0-25 — avg confidence score from AI
  community: number; // 0-20 — leaderboard standing
  tier: "Seedling" | "Sapling" | "Tree" | "Forest" | "Guardian";
  tierColor: string;
}

export function calculateEcoScore(params: {
  totalSubmissions: number;
  totalCredits: number;
  avgConfidence: number;
  leaderboardRank: number;
  totalUsers: number;
  daysSinceFirst: number;
  activeDays: number;
}): EcoScoreBreakdown {
  const { totalSubmissions, totalCredits, avgConfidence, leaderboardRank, totalUsers, daysSinceFirst, activeDays } = params;

  // Consistency: ratio of active days to total days (max 25)
  const consistencyRatio = daysSinceFirst > 0 ? Math.min(activeDays / daysSinceFirst, 1) : 0;
  const consistency = Math.round(consistencyRatio * 25);

  // Impact: logarithmic scale based on credits (max 30)
  const impact = Math.min(30, Math.round(Math.log10(Math.max(totalCredits, 1)) * 10));

  // Authenticity: average AI confidence mapped to 0-25
  const authenticity = Math.round((avgConfidence / 100) * 25);

  // Community: inverse rank percentile (max 20)
  const rankPercentile = totalUsers > 0 ? 1 - (leaderboardRank / totalUsers) : 0;
  const community = Math.round(Math.max(rankPercentile, 0) * 20);

  const overall = Math.min(100, consistency + impact + authenticity + community);

  const tier = overall >= 85 ? "Guardian" : overall >= 65 ? "Forest" : overall >= 45 ? "Tree" : overall >= 25 ? "Sapling" : "Seedling";

  const tierColor = {
    Seedling: "text-muted-foreground",
    Sapling: "text-eco-green",
    Tree: "text-primary",
    Forest: "text-secondary",
    Guardian: "text-eco-yellow",
  }[tier];

  return { overall, consistency, impact, authenticity, community, tier, tierColor };
}

export const TIER_DESCRIPTIONS: Record<string, string> = {
  Seedling: "Just getting started on your eco journey",
  Sapling: "Growing your environmental impact",
  Tree: "A reliable environmental contributor",
  Forest: "A major force for environmental good",
  Guardian: "An elite environmental champion",
};

// Demo eco score for unauthenticated view
export const DEMO_ECO_SCORE: EcoScoreBreakdown = {
  overall: 72,
  consistency: 18,
  impact: 22,
  authenticity: 20,
  community: 12,
  tier: "Forest",
  tierColor: "text-secondary",
};
