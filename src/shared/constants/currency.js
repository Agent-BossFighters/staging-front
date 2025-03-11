export const CURRENCY_RATES = {
  FLEX: 490 / 480, 
  BFT: 19.07 / 1000, // BFT to USD (19.07/1000 = 0.01907)
  SM: 2.95 / 100, // Sponsor Marks to USD (2.95/100 = 0.0295)
  ENERGY: 1.49, // Energy cost in USD
};

export const FLEX_PACKS = [
  { amount: 480, price: 4.99, bonus: 0 }, // 0.0104/FLEX
  { amount: 1_730, price: 14.99, bonus: 20 }, // 0.00867/FLEX
  { amount: 3_610, price: 29.99, bonus: 25 }, // 0.00831/FLEX
  { amount: 6_250, price: 49.99, bonus: 30 }, // 0.00800/FLEX
  { amount: 12_990, price: 99.99, bonus: 35 }, // 0.00770/FLEX
  { amount: 67_330, price: 499.99, bonus: 40 }, // 0.00743/FLEX
];
