const levels = Array.from({ length: 30 }, (_, i) => i + 1);

const calculateSpMarks = (level) => {
  return Number((1.8433 * Math.pow(level, 2) + 192.9014 * level + 0.5702).toFixed(2));
};

export const useLevelCalculator = () => {
  const levelData = {
    spMarksNb: levels.map(level => calculateSpMarks(level)),
    spMarksCost: levels.map(level => `$${calculateSpMarks(level).toFixed(2)}`),
    totalCost: levels.reduce((acc, level) => {
      const cost = calculateSpMarks(level);
      const previousTotal = acc.length > 0 ? parseFloat(acc[acc.length - 1].slice(1)) : 0;
      acc.push(`$${(previousTotal + cost).toFixed(2)}`);
      return acc;
    }, [])
  };

  return { levels, levelData };
};