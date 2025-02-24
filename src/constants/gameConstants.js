export const CURRENCY_RATES = {
  BFT: 0.01, // Prix du BFT en USD ($0.01)
  FLEX: 0.00744, // Prix du FLEX en USD ($0.00744)
  ENERGY: 1.49, // Prix de l'énergie en USD ($1.49)
};

export const RARITY_MULTIPLIERS = {
  common: 1,
  uncommon: 1.5,
  rare: 2,
  epic: 2.5,
  legendary: 3,
  mythic: 3.5,
};

// Consommation d'énergie par minute
export const ENERGY_CONSUMPTION = {
  RATE_PER_MINUTE: 0.083, // ~0.83 pour 10 minutes
};

// Multiplicateurs de rareté pour le luck rate (pourcentages)
export const LUCK_RATES = {
  common: 100, // 100%
  uncommon: 205, // 205%
  rare: 420, // 420%
  epic: 1292, // 1292%
  legendary: 3974, // 3974%
  mythic: 12219, // 12219%
  exalted: 37574, // 37574%
  exotic: 154054, // 154054%
  transcendant: 631620, // 631620%
  unique: 2589642, // 2589642%
};
