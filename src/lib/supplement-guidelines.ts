export interface DosageGuideline {
  category: string;
  value: string;
}

export const kratomGuidelines: DosageGuideline[] = [
  {
    category: "Grams per day",
    value: "12–16 g"
  },
  {
    category: "Capsules per day",
    value: "17 capsules max"
  },
  {
    category: "Per dose",
    value: "5–6 capsules (2–3x/day)"
  },
  {
    category: "Upper ceiling",
    value: "Don't exceed 17/day"
  }
];

export const supplementGuidelines = {
  kratom: {
    name: "Kratom",
    capsuleSize: 700, // mg per capsule
    guidelines: kratomGuidelines,
    warnings: [
      "Do not exceed 17 capsules (12g) per day",
      "Typical dose: 5–6 capsules (2–3x/day)",
      "Monitor for side effects",
      "Stay hydrated",
      "Take breaks between doses"
    ]
  }
}; 