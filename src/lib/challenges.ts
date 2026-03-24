// Community challenges demo data

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: "city" | "school" | "seasonal";
  startDate: string;
  endDate: string;
  status: "active" | "upcoming" | "completed";
  participants: number;
  teams: ChallengeTeam[];
}

export interface ChallengeTeam {
  name: string;
  credits: number;
  members: number;
  avatar: string;
}

export const DEMO_CHALLENGES: Challenge[] = [
  {
    id: "1",
    title: "Abuja vs Lagos",
    description: "Which city recycles more? Two weeks of eco-action!",
    type: "city",
    startDate: "2026-03-10",
    endDate: "2026-03-24",
    status: "active",
    participants: 1240,
    teams: [
      { name: "Abuja", credits: 18500, members: 620, avatar: "🏛️" },
      { name: "Lagos", credits: 16800, members: 620, avatar: "🌊" },
    ],
  },
  {
    id: "2",
    title: "Zero Plastic Week",
    description: "Collect the most plastic waste in 7 days!",
    type: "seasonal",
    startDate: "2026-03-25",
    endDate: "2026-04-01",
    status: "upcoming",
    participants: 0,
    teams: [],
  },
  {
    id: "3",
    title: "University Challenge",
    description: "UNILAG vs UNIBEN — campus eco-warriors compete!",
    type: "school",
    startDate: "2026-03-01",
    endDate: "2026-03-15",
    status: "completed",
    participants: 890,
    teams: [
      { name: "UNILAG", credits: 12400, members: 450, avatar: "🎓" },
      { name: "UNIBEN", credits: 11200, members: 440, avatar: "📚" },
    ],
  },
  {
    id: "4",
    title: "Clean Nigeria Month",
    description: "A nationwide push for cleaner communities across all states.",
    type: "seasonal",
    startDate: "2026-04-01",
    endDate: "2026-04-30",
    status: "upcoming",
    participants: 0,
    teams: [],
  },
  {
    id: "5",
    title: "Nairobi vs Accra",
    description: "East meets West Africa in the ultimate eco showdown!",
    type: "city",
    startDate: "2026-02-15",
    endDate: "2026-03-01",
    status: "completed",
    participants: 960,
    teams: [
      { name: "Nairobi", credits: 14200, members: 510, avatar: "🦁" },
      { name: "Accra", credits: 13800, members: 450, avatar: "⭐" },
    ],
  },
];
