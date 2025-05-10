import { useState, useEffect, useRef, useCallback } from 'react';
import { useScrollOnHold } from '@shared/hook/useScrollOnHold';

export const useTableScroll = ({
  items,
  visibleRowsCount = 8,
  onMouseEnterTable = () => {},
  onMouseLeaveTable = () => {}
}) => {
  const [startIndex, setStartIndex] = useState(0);
  const [isMouseOverTable, setIsMouseOverTable] = useState(false);
  const [showScrollMessage, setShowScrollMessage] = useState(false);
  const tableRef = useRef(null);

  // Mettre à jour le message de défilement quand le nombre d'éléments change
  useEffect(() => {
    setShowScrollMessage(items.length > visibleRowsCount);
  }, [items.length, visibleRowsCount]);

  // Gestionnaire de défilement vers le bas
  const scrollDown = useCallback(() => {
    if (items.length <= visibleRowsCount) return;
    setStartIndex(prev => {
      const newIndex = Math.min(prev + 1, items.length - visibleRowsCount);
      return newIndex;
    });
  }, [items.length, visibleRowsCount]);

  // Gestionnaire de défilement vers le haut
  const scrollUp = useCallback(() => {
    setStartIndex(prev => {
      const newIndex = Math.max(prev - 1, 0);
      if (newIndex === prev) {
        document.activeElement?.blur();
        stopScrollingUp();
      }
      return newIndex;
    });
  }, []);

  // Hooks de défilement continu
  const { startScrolling: startScrollingDown, stopScrolling: stopScrollingDown } = useScrollOnHold(scrollDown);
  const { startScrolling: startScrollingUp, stopScrolling: stopScrollingUp } = useScrollOnHold(scrollUp);

  // Gestionnaires de la souris sur le tableau
  const handleMouseEnter = useCallback(() => {
    setIsMouseOverTable(true);
    onMouseEnterTable();
  }, [onMouseEnterTable]);

  const handleMouseLeave = useCallback(() => {
    setIsMouseOverTable(false);
    onMouseLeaveTable();
  }, [onMouseLeaveTable]);

  // Gestionnaire de la molette de la souris
  useEffect(() => {
    const wheelHandler = (e) => {
      if (!isMouseOverTable) return;
      
      e.preventDefault();
      e.stopPropagation();
      
      if (items.length <= visibleRowsCount) return;
      
      const newIndex = e.deltaY > 0
        ? Math.min(startIndex + 1, items.length - visibleRowsCount)
        : Math.max(startIndex - 1, 0);
      
      if (newIndex !== startIndex) {
        setStartIndex(newIndex);
      }
    };

    const tableElement = tableRef.current;
    if (tableElement) {
      tableElement.addEventListener('wheel', wheelHandler, { passive: false });
    }
    
    return () => {
      if (tableElement) {
        tableElement.removeEventListener('wheel', wheelHandler);
      }
    };
  }, [isMouseOverTable, items.length, visibleRowsCount, startIndex]);

  // Calculer les éléments visibles
  const visibleItems = items.slice(startIndex, startIndex + visibleRowsCount);

  return {
    tableRef,
    visibleItems,
    startIndex,
    showScrollMessage,
    isAtStart: startIndex === 0,
    isAtEnd: startIndex >= items.length - visibleRowsCount,
    handleMouseEnter,
    handleMouseLeave,
    startScrollingUp,
    stopScrollingUp,
    startScrollingDown,
    stopScrollingDown
  };
}; 