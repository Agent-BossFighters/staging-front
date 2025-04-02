import * as React from "react";
import { cn } from "@/utils/lib/utils";
import { Progress } from "@ui/progress";
import { BackgroundUser, chevronQuest } from "@img/index";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { getUserXP } from "@utils/api/quests.api";
import { useAuth } from "@context/auth.context";
import { AuthUtils } from "@utils/api/auth.utils";

// Créer un contexte pour gérer les mises à jour d'XP
export const XPUpdateContext = React.createContext({
  refreshXP: () => {},
});

export function XPProgress() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentExperience, setCurrentExperience] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [nextLevelXP, setNextLevelXP] = useState(1000);
  const [isLoading, setIsLoading] = useState(true);
  const [updateCounter, setUpdateCounter] = useState(0);

  // Fonction pour charger les données XP depuis l'API
  const loadUserXP = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      console.log('Chargement des données XP...');
      
      // Récupérer les données utilisateur du localStorage d'abord (pour une mise à jour immédiate)
      const localUserData = AuthUtils.getUserData();
      if (localUserData && localUserData.experience !== undefined && localUserData.level !== undefined) {
        setCurrentExperience(localUserData.experience || 0);
        setCurrentLevel(localUserData.level || 1);
        const calculatedNextLevelXP = (localUserData.level || 1) * 1000;
        setNextLevelXP(calculatedNextLevelXP);
        console.log('Données chargées depuis localStorage:', {
          level: localUserData.level || 1,
          experience: localUserData.experience || 0,
          nextLevelXP: calculatedNextLevelXP
        });
      }
      
      // Puis récupérer les données XP de l'utilisateur depuis l'API (pour s'assurer qu'elles sont à jour)
      const xpData = await getUserXP();
      console.log('Données XP reçues de l\'API:', xpData);
      
      if (xpData && xpData.user) {
        setCurrentExperience(xpData.user.experience || 0);
        setCurrentLevel(xpData.user.level || 1);
        
        // Utiliser next_level_experience s'il est disponible, sinon calculer
        const serverNextLevelXP = xpData.level_stats?.next_level_experience || (xpData.user.level || 1) * 1000;
        setNextLevelXP(serverNextLevelXP);
        
        console.log('Données mises à jour depuis l\'API:', {
          level: xpData.user.level || 1,
          experience: xpData.user.experience || 0,
          nextLevelXP: serverNextLevelXP
        });
        
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
          console.log('Données localStorage mises à jour avec les valeurs du serveur');
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données XP:', error);
      
      // En cas d'erreur, essayer d'utiliser les données du localStorage
      const localData = AuthUtils.getUserData();
      if (localData) {
        setCurrentExperience(localData.experience || 0);
        setCurrentLevel(localData.level || 1);
        setNextLevelXP((localData.level || 1) * 1000);
        console.log('Fallback aux données localStorage en cas d\'erreur');
      }
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Fonction pour forcer le rechargement des données XP
  const refreshXP = useCallback(() => {
    console.log('Demande de rafraîchissement XP reçue');
    
    // Forcer le rechargement depuis le localStorage d'abord (pour une réponse immédiate)
    const userData = AuthUtils.getUserData();
    if (userData) {
      setCurrentExperience(userData.experience || 0);
      setCurrentLevel(userData.level || 1);
      setNextLevelXP((userData.level || 1) * 1000);
      console.log('Rafraîchissement immédiat depuis localStorage:', {
        level: userData.level || 1,
        experience: userData.experience || 0,
        nextLevelXP: (userData.level || 1) * 1000
      });
    }
    
    // Puis déclencher le chargement depuis l'API
    setUpdateCounter(prev => prev + 1);
  }, []);

  // Charger les données XP depuis l'API
  useEffect(() => {
    loadUserXP();
  }, [loadUserXP, user, updateCounter]);

  const handleClick = () => {
    navigate("/dashboard/mission");
  };

  // Calculer le pourcentage de progression vers le niveau suivant
  const xpProgressPercentage = () => {
    // Si on est au niveau 1, on commence à 0 XP
    if (currentLevel === 1) {
      return (currentExperience / nextLevelXP) * 100;
    }
    
    // Pour les niveaux supérieurs, calculer la progression depuis le dernier niveau
    const previousLevelXP = (currentLevel - 1) * 1000;
    const xpSinceLastLevel = currentExperience - previousLevelXP;
    const xpRequiredForNextLevel = nextLevelXP - previousLevelXP;
    
    return (xpSinceLastLevel / xpRequiredForNextLevel) * 100;
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
              <span className="text-white font-bold text-3xl relative z-10">
                {isLoading ? "..." : currentLevel}
              </span>
            </div>
          </div>

          {/* Colonne centrale - Progress et texte */}
          <div className="flex-1 flex flex-col justify-center py-2 pr-4">
            <div className="flex justify-between items-center gap-3">
              {isLoading ? (
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div className="bg-gray-600 h-3 rounded-full animate-pulse" style={{ width: '50%' }} />
                </div>
              ) : (
                <Progress value={xpProgressPercentage()} title={`${currentExperience} / ${nextLevelXP} XP`} className="h-3" /> 
              )}
              <span className="text-[#FFD32A] whitespace-nowrap font-bold text-lg">
                LVL {Math.min(currentLevel + 1, 10)}
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
