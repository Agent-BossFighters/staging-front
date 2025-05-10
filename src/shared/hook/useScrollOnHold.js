import { useCallback, useRef, useEffect } from 'react';

export const useScrollOnHold = (onScroll, scrollInterval = 125) => {
  const intervalRef = useRef(null);

  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Nettoyer le timer lors du démontage du composant
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const startScrolling = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Nettoyer l'intervalle existant si présent
    cleanup();
    
    // Exécuter immédiatement la première fois
    onScroll();
    
    // Démarrer l'intervalle de défilement continu
    intervalRef.current = setInterval(() => {
      try {
        onScroll();
      } catch (error) {
        cleanup();
      }
    }, scrollInterval);
  }, [onScroll, scrollInterval, cleanup]);

  const stopScrolling = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    cleanup();
  }, [cleanup]);

  return {
    startScrolling,
    stopScrolling
  };
}; 