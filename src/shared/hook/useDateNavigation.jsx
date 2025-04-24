import { useState, useCallback } from "react";

export const useDateNavigation = (initialDate = new Date()) => {
  const [selectedDate, setSelectedDate] = useState(initialDate);

  // Fonction utilitaire qui retourne les fonctions de manipulation de dates
  const createDateHandlers = useCallback((maxDaysBack = 7) => {
    const handlePreviousDay = () => {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() - 1);
      
      // Calculer la limite de jours dans le passé
      const currentDate = new Date();
      const limitDate = new Date(currentDate);
      limitDate.setDate(currentDate.getDate() - maxDaysBack);
      
      // Vérifier si la nouvelle date est dans la plage permise
      if (newDate >= limitDate) {
        setSelectedDate(newDate);
      }
    };

    const handleNextDay = () => {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() + 1);
      
      // Empêcher de naviguer vers des dates futures
      const today = new Date();
      
      if (newDate <= today) {
        setSelectedDate(newDate);
      }
    };
    
    const handleToday = () => {
      const today = new Date();
      setSelectedDate(today);
    };

    return {
      handlePreviousDay,
      handleNextDay,
      handleToday
    };
  }, [selectedDate]);

  return {
    selectedDate,
    setSelectedDate,
    createDateHandlers
  };
}; 