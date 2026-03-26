// Waste classification: recyclable vs non-recyclable
export interface WasteInfo {
  name: string;
  category: "recyclable" | "non-recyclable";
  credits: number;        // EcoCredits (cash-convertible for recyclable)
  impactPoints: number;   // Impact Score boost
  description: string;
}

export const WASTE_CATALOG: Record<string, WasteInfo> = {
  "Plastic Bottle": {
    name: "Plastic Bottle",
    category: "recyclable",
    credits: 10,
    impactPoints: 5,
    description: "Clean PET bottles — high resale value",
  },
  "Aluminium Can": {
    name: "Aluminium Can",
    category: "recyclable",
    credits: 12,
    impactPoints: 6,
    description: "Aluminium cans — easily recycled",
  },
  "Cardboard": {
    name: "Cardboard",
    category: "recyclable",
    credits: 8,
    impactPoints: 4,
    description: "Clean cardboard boxes and packaging",
  },
  "Metal": {
    name: "Metal",
    category: "recyclable",
    credits: 15,
    impactPoints: 7,
    description: "Scrap metal — high market value",
  },
  "Mixed Plastic": {
    name: "Mixed Plastic",
    category: "non-recyclable",
    credits: 2,
    impactPoints: 12,
    description: "Dirty or mixed plastics — waste-to-energy",
  },
  "Nylon/Sachet": {
    name: "Nylon/Sachet",
    category: "non-recyclable",
    credits: 1,
    impactPoints: 15,
    description: "Pure water bags and thin nylons — high environmental impact",
  },
  "Food-Contaminated Waste": {
    name: "Food-Contaminated Waste",
    category: "non-recyclable",
    credits: 1,
    impactPoints: 10,
    description: "Food-soiled packaging — diverted from open burning",
  },
  "Rubber/Composite": {
    name: "Rubber/Composite",
    category: "non-recyclable",
    credits: 2,
    impactPoints: 8,
    description: "Rubber and composite materials — processed industrially",
  },
  "Other": {
    name: "Other",
    category: "non-recyclable",
    credits: 1,
    impactPoints: 5,
    description: "Unclassified waste",
  },
};

// Legacy compat
export const CREDIT_VALUES: Record<string, number> = Object.fromEntries(
  Object.entries(WASTE_CATALOG).map(([k, v]) => [k, v.credits])
);
export const WASTE_TYPES = Object.keys(WASTE_CATALOG);

export function simulateAIDetection(): { wasteType: string; confidence: number; category: "recyclable" | "non-recyclable" } {
  const types = [
    "Plastic Bottle", "Aluminium Can", "Cardboard", "Metal",
    "Mixed Plastic", "Nylon/Sachet", "Food-Contaminated Waste", "Rubber/Composite",
  ];
  const wasteType = types[Math.floor(Math.random() * types.length)];
  const confidence = Math.floor(Math.random() * 13) + 85;
  const category = WASTE_CATALOG[wasteType].category;
  return { wasteType, confidence, category };
}

export function calculateCredits(wasteType: string, quantity: number): number {
  const info = WASTE_CATALOG[wasteType] ?? WASTE_CATALOG["Other"];
  return info.credits * quantity;
}

export function calculateImpactPoints(wasteType: string, quantity: number): number {
  const info = WASTE_CATALOG[wasteType] ?? WASTE_CATALOG["Other"];
  return info.impactPoints * quantity;
}

export function getWasteCategory(wasteType: string): "recyclable" | "non-recyclable" {
  return WASTE_CATALOG[wasteType]?.category ?? "non-recyclable";
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

// Processing destinations for non-recyclable waste
export const PROCESSING_DESTINATIONS = [
  { name: "Waste-to-Energy Plant", description: "Converted to electricity through controlled incineration" },
  { name: "Cement Factory", description: "Used as alternative fuel in cement kilns" },
  { name: "Government Disposal Hub", description: "Responsibly managed through subsidized programs" },
];
