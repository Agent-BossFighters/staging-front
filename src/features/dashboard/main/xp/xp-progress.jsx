import * as React from "react";
import { cn } from "@/utils/lib/utils";
import { Progress } from "@ui/progress";
import { BackgroundUser, chevronQuest } from "@img/index";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { getUserXP, setUserXP } from "@utils/api/quests.api";
import { useAuth } from "@context/auth.context";
import { AuthUtils } from "@utils/api/auth.utils";
import toast from "react-hot-toast";

// Créer un contexte pour gérer les mises à jour d'XP
export const XPUpdateContext = React.createContext({
  refreshXP: () => {},
});

// Niveau maximum
const MAX_LEVEL = 10;
const XP_PER_LEVEL = 1000;

export function XPProgress() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentExperience, setCurrentExperience] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [nextLevelXP, setNextLevelXP] = useState(1000);
  const [isLoading, setIsLoading] = useState(true);
  const [updateCounter, setUpdateCounter] = useState(0);

  const refreshXP = useCallback(() => {
    const userData = AuthUtils.getUserData();
    if (userData) {
      setCurrentExperience(userData.experience || 0);
      setCurrentLevel(Math.min(userData.level || 1, MAX_LEVEL));
      setNextLevelXP((userData.level || 1) * XP_PER_LEVEL);
    }
    
    // Puis déclencher le chargement depuis l'API
    setUpdateCounter(prev => prev + 1);
  }, []);

  // Vérifier si l'utilisateur doit level up
  useEffect(() => {
    const checkLevelUp = async () => {
      if (isLoading || !user || currentLevel >= MAX_LEVEL) return;

      // Calculer le XP requis pour le niveau suivant
      const requiredXP = currentLevel * XP_PER_LEVEL;

      // Si l'expérience actuelle est suffisante pour level up
      if (currentExperience >= requiredXP) {
        // Ne pas dépasser le niveau maximum
        const newLevel = Math.min(currentLevel + 1, MAX_LEVEL);
        
        try {
          // Mettre à jour le niveau en BDD (on garde l'expérience actuelle)
          await setUserXP(newLevel, currentExperience);
          
          
          // Mettre à jour l'état local
          setCurrentLevel(newLevel);
          
          // Forcer le rechargement des données
          refreshXP();
        } catch (error) {
          console.error("Erreur lors de la mise à jour du niveau:", error);
        }
      }
    };

    checkLevelUp();
  }, [currentExperience, currentLevel, isLoading, user, refreshXP]);

  // Fonction pour charger les données XP depuis l'API
  const loadUserXP = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Récupérer les données utilisateur du localStorage d'abord (pour une mise à jour immédiate)
      const localUserData = AuthUtils.getUserData();
      if (localUserData && localUserData.experience !== undefined && localUserData.level !== undefined) {
        setCurrentExperience(localUserData.experience || 0);
        setCurrentLevel(Math.min(localUserData.level || 1, MAX_LEVEL));
        const calculatedNextLevelXP = (localUserData.level || 1) * XP_PER_LEVEL;
        setNextLevelXP(calculatedNextLevelXP);
      }
      
      // Puis récupérer les données XP de l'utilisateur depuis l'API (pour s'assurer qu'elles sont à jour)
      const xpData = await getUserXP();
      
      if (xpData && xpData.user) {
        setCurrentExperience(xpData.user.experience || 0);
        setCurrentLevel(Math.min(xpData.user.level || 1, MAX_LEVEL));
        
        // Utiliser next_level_experience s'il est disponible, sinon calculer
        const serverNextLevelXP = xpData.level_stats?.next_level_experience || (xpData.user.level || 1) * XP_PER_LEVEL;
        setNextLevelXP(serverNextLevelXP);
        
        // Mettre à jour les données dans le localStorage si elles diffèrent
        const storedData = AuthUtils.getUserData();
        if (storedData && 
            (storedData.level !== xpData.user.level || 
             storedData.experience !== xpData.user.experience)) {
          const updatedData = {
            ...storedData,
            level: xpData.user.level,
            experience: xpData.user.experience
          };
          AuthUtils.setUserData(updatedData);
        }
      }
    } catch (error) {
      
      // En cas d'erreur, essayer d'utiliser les données du localStorage
      const localData = AuthUtils.getUserData();
      if (localData) {
        setCurrentExperience(localData.experience || 0);
        setCurrentLevel(Math.min(localData.level || 1, MAX_LEVEL));
        setNextLevelXP((localData.level || 1) * XP_PER_LEVEL);
      }
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Charger les données XP depuis l'API
  useEffect(() => {
    loadUserXP();
  }, [loadUserXP, user, updateCounter]);

  const handleClick = () => {
    navigate("/dashboard/missions");
  };

  // Calculer le pourcentage de progression vers le niveau suivant
  const xpProgressPercentage = () => {
    // Si on est au niveau maximum (10), calculer différemment
    if (currentLevel >= MAX_LEVEL) {
      return 100; // Toujours 100% au niveau maximum
    }
    
    // Calculer le XP de départ pour le niveau actuel
    const baseXP = (currentLevel - 1) * XP_PER_LEVEL;
    
    // Calculer le XP acquis depuis le dernier niveau
    const earnedXP = currentExperience - baseXP;
    
    // Calculer le XP total nécessaire pour passer du niveau actuel au suivant
    const totalXPForLevel = XP_PER_LEVEL;
    
    // Calculer le pourcentage (en s'assurant qu'il ne dépasse pas 100%)
    const percentage = Math.min((earnedXP / totalXPForLevel) * 100, 100);
    
    return percentage;
  };

  // Calculer le XP restant depuis le dernier niveau
  const getDisplayXP = () => {
    if (currentLevel >= MAX_LEVEL) {
      return `MAX`; // Au niveau maximum
    }
    
    const baseXP = (currentLevel - 1) * XP_PER_LEVEL;
    const earnedXP = currentExperience - baseXP;
    
    return `${earnedXP} / ${XP_PER_LEVEL} XP`;
  };

  return (
    <XPUpdateContext.Provider value={{ refreshXP }}>
      <div 
        className="bg-[#1A1B1E] rounded-2xl border-2 border-gray-800/50 cursor-pointer hover:scale-[1.01] hover:border-gray-700/50 transition-all duration-300 h-full p-2"
        onClick={handleClick}
      >
        <div className="flex h-full">
          {/* Colonne de gauche - Level */}
          <div className="flex items-center justify-center w-24 pr-2">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div
                className="absolute inset-0 bg-contain bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${BackgroundUser})` }}
              />
              <span className="text-white font-bold text-3xl relative z-10 pb-1">
                {isLoading ? "..." : currentLevel}
              </span>
            </div>
          </div>

          {/* Colonne centrale - Progress et texte */}
          <div className="flex-1 flex flex-col justify-center py-2 pr-4">
            <div className="flex justify-between items-center gap-3">
              {isLoading ? (
                <div className="w-full bg-gray-700 rounded-full h-">
                  <div className="bg-gray-600 h-3 rounded-full animate-pulse" style={{ width: '50%' }} />
                </div>
              ) : (
                <Progress 
                  value={xpProgressPercentage()} 
                  title={getDisplayXP()} 
                  className="h-5" 
                /> 
              )}
              <span className="text-[#FFD32A] whitespace-nowrap font-bold text-lg">
                LVL {currentLevel >= MAX_LEVEL ? "MAX" : currentLevel + 1}
              </span>
            </div>

            <p className="text-[#FFD32A] text-[14px]">
              Level up to take part in the Boss Fighters NFT raffle !
            </p>
          </div>

          {/* Colonne de droite - Vide pour l'instant */}
          <div className="w-12 pl-3 pr-2">
            <img src={chevronQuest} alt={"chevron right"} className="w-full h-full object-contain" />
          </div>
        </div>
      </div>
    </XPUpdateContext.Provider>
  );
}
