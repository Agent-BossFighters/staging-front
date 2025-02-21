import { CURRENCY_RATES, LUCK_RATES, ENERGY_CONSUMPTION } from '@constants/gameConstants';

export const useMatchCalculations = () => {
  const calculateEnergyUsed = (timeInMinutes) => {
    return (timeInMinutes * ENERGY_CONSUMPTION.RATE_PER_MINUTE).toFixed(2);
  };

  const calculateEnergyCost = (energyUsed, energyCost = CURRENCY_RATES.ENERGY) => {
    return (energyUsed * energyCost).toFixed(2);
  };

  const calculateTokenValue = (totalToken, tokenValue = CURRENCY_RATES.BFT) => {
    return (totalToken * tokenValue).toFixed(2);
  };

  const calculatePremiumValue = (totalPremium, premiumValue = CURRENCY_RATES.FLEX) => {
    return (totalPremium * premiumValue).toFixed(2);
  };

  const calculateFeeCost = (totalFee, feeCost) => {
    if (!totalFee || !feeCost) return 0;
    return (totalFee * feeCost).toFixed(2);
  };

  const calculateLuckRate = (badges) => {
    if (!badges || !badges.length) return 0;
    
    return badges.reduce((total, badge) => {
      const rarity = badge.rarity?.toLowerCase();
      return total + (LUCK_RATES[rarity] || 0);
    }, 0);
  };

  const calculateProfit = (match) => {
    // Calcul des gains totaux
    const tokenEarnings = parseFloat(calculateTokenValue(match.totalToken, match.tokenValue));
    const flexEarnings = parseFloat(calculatePremiumValue(match.totalPremiumCurrency, match.premiumCurrencyValue));
    const totalEarnings = tokenEarnings + flexEarnings;

    // Calcul des coûts totaux
    const energyCost = parseFloat(calculateEnergyCost(match.energyUsed, match.energyCost));
    const feeCost = parseFloat(calculateFeeCost(match.totalFee, match.feeCost));
    const totalCosts = energyCost + feeCost;

    // Calcul du profit de base
    const baseProfit = totalEarnings - totalCosts;

    // Application des multiplicateurs du build
    const bonusMultiplier = match.build?.bonusMultiplier || 1.0;
    const perksMultiplier = match.build?.perksMultiplier || 1.0;
    const totalMultiplier = bonusMultiplier * perksMultiplier;

    return (baseProfit * totalMultiplier).toFixed(2);
  };

  const calculateMatchMetrics = (matchData) => {
    // Calcul de l'énergie utilisée si on a le temps mais pas l'énergie
    const energyUsed = matchData.energyUsed || 
      (matchData.time ? calculateEnergyUsed(matchData.time) : 0);

    const calculated = {
      luckRate: calculateLuckRate(matchData.badges),
      energyUsed: energyUsed,
      energyCost: calculateEnergyCost(energyUsed, matchData.energyCost),
      tokenValue: calculateTokenValue(matchData.totalToken, matchData.tokenValue),
      premiumValue: calculatePremiumValue(matchData.totalPremiumCurrency, matchData.premiumCurrencyValue),
      feeCost: calculateFeeCost(matchData.totalFee, matchData.feeCost),
      profit: calculateProfit({
        ...matchData,
        energyUsed: energyUsed
      })
    };

    return {
      ...matchData,
      calculated
    };
  };

  return {
    calculateEnergyUsed,
    calculateEnergyCost,
    calculateTokenValue,
    calculatePremiumValue,
    calculateFeeCost,
    calculateLuckRate,
    calculateProfit,
    calculateMatchMetrics
  };
}; 