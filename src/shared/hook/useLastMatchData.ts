import { useState, useEffect } from 'react';

interface LastMatchData {
  buildId: string;
  rarities: string[];
}

export const useLastMatchData = () => {
  const [lastMatchData, setLastMatchData] = useState<LastMatchData | null>(() => {
    const saved = localStorage.getItem('lastMatchData');
    if (saved) {
      const parsed = JSON.parse(saved);
      const savedDate = new Date(parsed.date);
      const today = new Date();
      
      // Only use saved data if it's from today
      if (savedDate.toDateString() === today.toDateString()) {
        return {
          buildId: parsed.buildId,
          rarities: parsed.rarities,
        };
      }
    }
    return null;
  });

  const saveLastMatchData = (data: LastMatchData) => {
    const toSave = {
      ...data,
      date: new Date().toISOString(),
    };
    localStorage.setItem('lastMatchData', JSON.stringify(toSave));
    setLastMatchData(data);
  };

  return {
    lastMatchData,
    saveLastMatchData,
  };
}; 