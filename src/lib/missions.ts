export interface Mission {
  id: string;
  title: string;
  description: string;
  type: "cleanup" | "collection" | "awareness";
  target: number;      // kg or units
  targetUnit: string;
  reward: {
    impactPoints: number;
    ecoScoreBoost: number;
    badge?: string;
  };
  difficulty: "easy" | "medium" | "hard";
  status: "available" | "in_progress" | "completed";
  progress: number;
  location?: string;
  deadline: string;
}

export const DEMO_MISSIONS: Mission[] = [
  {
    id: "m1",
    title: "Gutter Cleanup Champion",
    description: "Clean 5kg of gutter waste in your area. Prevent flooding and earn recognition.",
    type: "cleanup",
    target: 5,
    targetUnit: "kg",
    reward: { impactPoints: 50, ecoScoreBoost: 5, badge: "🏆 Flood Preventer" },
    difficulty: "medium",
    status: "available",
    progress: 0,
    location: "Your neighborhood",
    deadline: "2026-04-02",
  },
  {
    id: "m2",
    title: "Nylon Rescue Mission",
    description: "Collect 20 sachet water bags. These have no resale value but huge environmental impact.",
    type: "collection",
    target: 20,
    targetUnit: "bags",
    reward: { impactPoints: 75, ecoScoreBoost: 8, badge: "🛡️ Nylon Guardian" },
    difficulty: "easy",
    status: "in_progress",
    progress: 12,
    deadline: "2026-04-05",
  },
  {
    id: "m3",
    title: "Market Waste Warrior",
    description: "Partner with a local market to collect 10kg of mixed waste. Document the before & after.",
    type: "cleanup",
    target: 10,
    targetUnit: "kg",
    reward: { impactPoints: 120, ecoScoreBoost: 12, badge: "⚔️ Market Warrior" },
    difficulty: "hard",
    status: "available",
    progress: 0,
    location: "Nearest market",
    deadline: "2026-04-10",
  },
  {
    id: "m4",
    title: "Zero Burn Week",
    description: "Prevent waste burning by collecting 3kg of non-recyclable waste and logging it for processing.",
    type: "collection",
    target: 3,
    targetUnit: "kg",
    reward: { impactPoints: 40, ecoScoreBoost: 4, badge: "🔥 Burn Stopper" },
    difficulty: "easy",
    status: "completed",
    progress: 3,
    deadline: "2026-03-20",
  },
  {
    id: "m5",
    title: "School Eco Ambassador",
    description: "Organize a waste awareness session at a school and collect waste from students.",
    type: "awareness",
    target: 1,
    targetUnit: "session",
    reward: { impactPoints: 100, ecoScoreBoost: 10, badge: "📚 Eco Ambassador" },
    difficulty: "medium",
    status: "available",
    progress: 0,
    deadline: "2026-04-15",
  },
];
