import React, { useState, useEffect, useContext } from 'react';
import { BackgroundUser } from '@img/index';
import { useAuth } from '@context/auth.context';
import { AuthUtils } from '@utils/api/auth.utils';
import { XPUpdateContext } from '@/features/dashboard/main/xp/xp-progress';
import { Progress } from "@ui/progress";

// Composant d'affichage XP simple qui utilise les données du contexte
const XPDisplay = () => {
  const { user } = useAuth();
  const { refreshXP } = useContext(XPUpdateContext);
  const [xpData, setXPData] = useState({
    level: 1,
    experience: 0,
    nextLevelXP: 1000,
    isLoading: true
  });
  
  const MAX_LEVEL = 10;
  const XP_PER_LEVEL = 1000;
  
  // Charger les données XP depuis le localStorage
  useEffect(() => {
    const userData = AuthUtils.getUserData();
    if (userData) {
      setXPData({
        level: Math.min(userData.level || 1, MAX_LEVEL),
        experience: userData.experience || 0,
        nextLevelXP: (userData.level || 1) * XP_PER_LEVEL,
        isLoading: false
      });
    }
  }, [user]);
  
  // S'assurer que les données sont à jour après chaque refreshXP
  useEffect(() => {
    const updateLocalXP = () => {
      const userData = AuthUtils.getUserData();
      if (userData) {
        setXPData({
          level: Math.min(userData.level || 1, MAX_LEVEL),
          experience: userData.experience || 0,
          nextLevelXP: (userData.level || 1) * XP_PER_LEVEL,
          isLoading: false
        });
      }
    };
    
    // Ajouter un listener pour les mises à jour XP
    document.addEventListener('xp-updated', updateLocalXP);
    
    // Nettoyer l'event listener
    return () => {
      document.removeEventListener('xp-updated', updateLocalXP);
    };
  }, []);
  
  // Calculer la progression et gestion du level-up
  const getUserProgressData = () => {
    if (xpData.isLoading) {
      return { percentage: 0, displayXP: '0 / 1000 XP', displayLevel: 1, nextLevel: 2 };
    }
    
    if (xpData.level >= MAX_LEVEL) {
      return { 
        percentage: 100, 
        displayXP: 'MAX', 
        displayLevel: MAX_LEVEL, 
        nextLevel: 'MAX' 
      };
    }
    
    // Calculer le XP requis pour le niveau actuel
    const baseXP = (xpData.level - 1) * XP_PER_LEVEL;
    const currentLevelXP = xpData.experience - baseXP;
    
    // Vérifier si l'utilisateur a assez d'XP pour passer au niveau suivant
    if (currentLevelXP >= XP_PER_LEVEL) {
      // Calcul pour le niveau suivant
      const nextLevel = Math.min(xpData.level + 1, MAX_LEVEL);
      const remainingXP = currentLevelXP - XP_PER_LEVEL;
      const percentage = Math.min((remainingXP / XP_PER_LEVEL) * 100, 100);
      const displayXP = nextLevel >= MAX_LEVEL ? 'MAX' : `${remainingXP} / ${XP_PER_LEVEL} XP`;
      
      return {
        percentage,
        displayXP,
        displayLevel: nextLevel,
        nextLevel: nextLevel >= MAX_LEVEL ? 'MAX' : nextLevel + 1
      };
    } else {
      // Calcul normal pour le niveau actuel
      const percentage = Math.min((currentLevelXP / XP_PER_LEVEL) * 100, 100);
      return {
        percentage,
        displayXP: `${currentLevelXP} / ${XP_PER_LEVEL} XP`,
        displayLevel: xpData.level,
        nextLevel: xpData.level + 1
      };
    }
  };
  
  // Récupérer les données calculées
  const { percentage, displayXP, displayLevel, nextLevel } = getUserProgressData();
  
  return (
    <div className="flex flex-col items-center gap-4 md:gap-8 p-2 md:p-4">
      {/* Badge de niveau avec fond - à gauche */}
      <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-contain bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${BackgroundUser})` }}
        />
        <span className="text-white font-bold text-5xl md:text-7xl relative z-10 pb-2">
          {xpData.isLoading ? "..." : displayLevel}
        </span>
      </div>
      
      {/* Section avec pseudo et barre de progression */}
      <div className="flex-1 w-full">
        {/* Pseudo de l'utilisateur */}
        <h2 className="text-white text-2xl md:text-3xl flex justify-center font-bold mb-2 md:mb-4">
          {user?.username || "User"}
        </h2>
        
        {/* Barre de progression XP */}
        <div className="w-full">
          <div className="flex justify-between items-center gap-3 mb-2">
            {xpData.isLoading ? (
              <div className="w-full bg-gray-700 rounded-full h-4 md:h-5">
                <div className="bg-gray-600 h-4 md:h-5 rounded-full animate-pulse" style={{ width: '50%' }} />
              </div>
            ) : (
              <Progress 
                value={percentage} 
                className="h-4 md:h-5" 
              /> 
            )}
          </div>
          <p className="text-white text-sm md:text-base flex justify-center">
            {displayXP}
          </p>
        </div>
      </div>
    </div>
  );
};

export default XPDisplay; 