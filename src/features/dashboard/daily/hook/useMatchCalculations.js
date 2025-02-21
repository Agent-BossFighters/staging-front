import { CURRENCY_RATES, LUCK_RATES, ENERGY_CONSUMPTION } from '@constants/gameConstants';

export const useMatchCalculations = () => {
  const calculateEnergyUsed = (timeInMinutes) => {
    if (!timeInMinutes) return 0;
    // ~0.083 énergie par minute (0.83 pour 10 minutes)
    return (timeInMinutes * ENERGY_CONSUMPTION.RATE_PER_MINUTE).toFixed(2);
  };

  const calculateEnergyCost = (energyUsed) => {
    return (energyUsed * CURRENCY_RATES.ENERGY).toFixed(2);
  };

  const calculateTokenValue = (totalToken) => {
    return (totalToken * CURRENCY_RATES.BFT).toFixed(2);
  };

  const calculatePremiumValue = (totalPremium) => {
    return (totalPremium * CURRENCY_RATES.FLEX).toFixed(2);
  };

  const calculateFeeCost = (totalFee, feeCost) => {
    if (!totalFee || !feeCost) return 0;
    return (totalFee * feeCost).toFixed(2);
  };

  const calculateLuckrate = (badges) => {
    if (!badges || !Array.isArray(badges)) return 0;
    
    return badges.reduce((total, badge) => {
      // Si badge est un objet avec une propriété rarity, utiliser celle-ci
      // Sinon, utiliser directement la chaîne de caractères
      const rarity = typeof badge === 'object' ? badge.rarity : badge;
      
      // Utiliser les valeurs de LUCK_RATES pour le calcul
      return total + (LUCK_RATES[rarity?.toLowerCase()] || 0);
    }, 0);
  };

  const calculateProfit = (match) => {
    if (!match) return "0.00";

    // Calcul des gains
    const bftValue = parseFloat(calculateTokenValue(match.totalToken));
    const flexValue = parseFloat(calculatePremiumValue(match.totalPremiumCurrency));
    const totalEarnings = bftValue + flexValue;

    // Calcul des coûts
    const energyUsed = calculateEnergyUsed(match.time);
    const energyCost = parseFloat(calculateEnergyCost(energyUsed));

    // Profit de base
    const baseProfit = totalEarnings - energyCost;

    // Application des multiplicateurs
    const bonusMultiplier = match.build?.bonusMultiplier || 1.0;
    const perksMultiplier = match.build?.perksMultiplier || 1.0;
    const totalMultiplier = bonusMultiplier * perksMultiplier;

    return (baseProfit * totalMultiplier).toFixed(2);
  };

  const calculateMatchMetrics = (matchData) => {
    if (!matchData) return matchData;

    const energyUsed = calculateEnergyUsed(matchData.time);
    const luckrate = calculateLuckrate(matchData.badges);
    
    return {
      ...matchData,
      energyUsed,
      luckrate,
      calculated: {
        luckrate,
        energyCost: calculateEnergyCost(energyUsed),
        tokenValue: calculateTokenValue(matchData.totalToken),
        premiumValue: calculatePremiumValue(matchData.totalPremiumCurrency),
        feeCost: calculateFeeCost(matchData.totalFee, matchData.feeCost),
        profit: calculateProfit({
          ...matchData,
          energyUsed
        })
      }
    };
  };

  return {
    calculateEnergyUsed,
    calculateEnergyCost,
    calculateTokenValue,
    calculatePremiumValue,
    calculateFeeCost,
    calculateLuckrate,
    calculateProfit,
    calculateMatchMetrics
  };
}; 