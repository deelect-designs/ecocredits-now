export const CREDIT_VALUES: Record<string, number> = {
  "Plastic Bottle": 10,
  "Aluminium Can": 12,
  "Cardboard": 8,
  "Metal": 15,
  "Other": 5,
};

export const WASTE_TYPES = Object.keys(CREDIT_VALUES);

export function simulateAIDetection(): { wasteType: string; confidence: number } {
  const types = ["Plastic Bottle", "Aluminium Can", "Cardboard", "Metal"];
  const wasteType = types[Math.floor(Math.random() * types.length)];
  const confidence = Math.floor(Math.random() * 13) + 85; // 85-97
  return { wasteType, confidence };
}

export function calculateCredits(wasteType: string, quantity: number): number {
  const perUnit = CREDIT_VALUES[wasteType] ?? CREDIT_VALUES["Other"];
  return perUnit * quantity;
}

export const DEMO_LEADERBOARD = [
  { name: "Musa", city: "Lagos", credits: 340 },
  { name: "Amina", city: "Nairobi", credits: 285 },
  { name: "Ravi", city: "Mumbai", credits: 220 },
  { name: "Siti", city: "Jakarta", credits: 195 },
  { name: "Kwame", city: "Accra", credits: 170 },
  { name: "Fatima", city: "Dhaka", credits: 155 },
  { name: "Carlos", city: "São Paulo", credits: 140 },
  { name: "Aisha", city: "Cairo", credits: 120 },
];
