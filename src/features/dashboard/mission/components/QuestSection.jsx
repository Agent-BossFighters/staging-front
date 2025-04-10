import React, { useState, useEffect, useContext } from 'react';
import Quest from './Quest';
import { loginQuest, matchesQuest, xQuest } from '@img/index';
import { getQuests, updateQuestProgress } from '@utils/api/quests.api';
import { useAuth } from '@context/auth.context';
import toast from 'react-hot-toast';
import { AuthUtils } from '@utils/api/auth.utils';
import { XPUpdateContext } from '@/features/dashboard/main/xp/xp-progress';

const QuestSection = () => {
  const { user } = useAuth();
  const [quests, setQuests] = useState([]);
  const [isLoadingQuests, setIsLoadingQuests] = useState(true);
  const [isUpdating, setUpdating] = useState(false);
  const { refreshXP } = useContext(XPUpdateContext);
  
  // Fonction pour charger les quêtes
  const fetchQuests = async () => {
    if (!user) return;
    
    setIsLoadingQuests(true);
    try {
      const response = await getQuests();
      setQuests(response.quests || []);
    } catch (error) {
      console.error("Erreur lors du chargement des quêtes:", error);
      // Ne pas afficher de toast d'erreur
    } finally {
      setIsLoadingQuests(false);
    }
  };
  
  // Charger les quêtes depuis l'API
  useEffect(() => {
    fetchQuests();
  }, [user]);

  // Gérer la progression d'une quête
  const handleQuestProgress = async (questId, newProgress) => {
    if (isUpdating) return; // Éviter les clics multiples
    
    try {
      setUpdating(true);
      
      // S'assurer que la progression est un nombre valide
      if (newProgress === null || newProgress === undefined) {
        console.error("Progression invalide:", newProgress);
        return;
      }
      
      // Obtenir la quête concernée et sa récompense XP (avant mise à jour)
      const targetQuest = quests.find(q => q.id === questId);
      const xpReward = targetQuest ? (targetQuest.xp_reward || targetQuest.reward_xp || 0) : 0;
      
      // Mettre à jour l'UI immédiatement (optimistic update)
      setQuests(prevQuests => prevQuests.map(quest => {
        if (quest.id === questId) {
          return {
            ...quest,
            current_progress: newProgress,
            completed: true,
            completable: false
          };
        }
        return quest;
      }));
      
      // Envoyer la mise à jour au serveur en arrière-plan
      updateQuestProgress(questId, newProgress)
        .then(response => {
          // Afficher le gain d'XP si disponible
          if (response && response.experience_gained > 0) {
            toast.success(`+${response.experience_gained} XP!`);
            
            // Vérifier si le niveau a augmenté
            const userData = AuthUtils.getUserData();
            if (userData && response.user_level > userData.level) {
              toast.success(`Vous avez atteint le niveau ${response.user_level}!`, {
                icon: '🎉',
                duration: 5000
              });
            }
          }
          
          // Mise à jour réussie, rafraîchir l'affichage de l'XP
          refreshXP();
        })
        .catch(error => {
          console.error("Erreur ignorée:", error);
          
          // Même en cas d'erreur, on sait que l'XP a été mise à jour sur le serveur
          // On affiche donc quand même un message de succès avec l'XP estimée
          if (xpReward > 0) {
            toast.success(`+${xpReward} XP!`);
          }
          
          // Rafraîchir la barre d'XP pour qu'elle reflète les changements dans le localStorage
          refreshXP();
        });
    } catch (error) {
      console.error("Erreur inattendue:", error);
    } finally {
      setUpdating(false);
    }
  };

  if (isLoadingQuests) {
    return (
      <div className="w-full">
        <div className="animate-pulse bg-gray-800 h-6 w-48 mb-6 rounded"></div>
        <div className="animate-pulse bg-gray-800 h-32 w-full mb-8 rounded-md"></div>
        <div className="animate-pulse bg-gray-800 h-6 w-48 mb-6 rounded"></div>
        <div className="animate-pulse bg-gray-800 h-20 w-full mb-4 rounded-md"></div>
        <div className="animate-pulse bg-gray-800 h-20 w-full mb-8 rounded-md"></div>
      </div>
    );
  }

  // Filtrer les quêtes par type
  const dailyQuests = quests.filter(quest => quest.quest_type === 'daily' || quest.id.includes('daily'));
  const socialQuests = quests.filter(quest => quest.quest_type === 'social' || quest.id.includes('social'));

  return (
    <div className="w-full">
      {/* Quêtes quotidiennes */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-5 uppercase">Daily Quests</h2>
        <div>
          {dailyQuests.map((quest) => (
            <div 
              key={quest.id}
              onClick={() => quest.completable ? handleQuestProgress(quest.id, quest.progress_required) : null}
              className={quest.completable && !quest.completed ? "cursor-pointer" : quest.completed ? "opacity-50" : "opacity-50 cursor-not-allowed"}
              title={!quest.completable && !quest.completed ? "Complétez d'abord 5 matchs aujourd'hui" : ""}
            >
              {quest.title === "Daily Login" ? (
                <Quest 
                  icon={<img src={quest.icon_url || loginQuest} alt={quest.title} className="w-full h-full object-contain" />}
                  title={quest.title}
                  status={quest.completed ? "FINISHED" : ""}
                  progress={quest.progress_required > 1 ? `${quest.current_progress}/${quest.progress_required}` : undefined}
                  xp={quest.xp_reward}
                />
              ) : quest.id === "daily_matches" ? (
                <Quest 
                  icon={<img src={quest.icon || matchesQuest} alt={quest.title} className="w-full h-full object-contain" />}
                  title={quest.title}
                  status={quest.completed ? "FINISHED" : (quest.current_progress >= quest.progress_required && !quest.completed) ? "" : ""}
                  progress={quest.current_progress < quest.progress_required ? `${quest.current_progress}/${quest.progress_required}` : null}
                  xp={quest.xp_reward}
                />
              ) : (
                <Quest 
                  icon={<img src={quest.icon || matchesQuest} alt={quest.title} className="w-full h-full object-contain" />}
                  title={quest.title}
                  status={quest.completed ? "FINISHED" : (quest.current_progress >= quest.progress_required && !quest.completed) ? "" : ""}
                  progress={quest.progress_required > 1 && quest.current_progress < quest.progress_required ? `${quest.current_progress}/${quest.progress_required}` : null}
                  xp={quest.xp_reward}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Quêtes sociales */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-5 uppercase">Social Quests</h2>
        <div>
          {socialQuests.map((quest) => (
            <div 
              key={quest.id}
              onClick={() => quest.completable ? handleQuestProgress(quest.id, quest.progress_required) : null}
              className={quest.completable && !quest.completed ? "cursor-pointer" : quest.completed ? "opacity-50" : "opacity-50 cursor-not-allowed"}
            >
              <Quest 
                icon={<img src={quest.icon || xQuest} alt={quest.name} className="w-full h-full object-contain" />}
                title={quest.name}
                status={quest.completed ? "FINISHED" : ""}
                progress={quest.progress_required > 1 ? `${quest.current_progress}/${quest.progress_required}` : undefined}
                xp={quest.reward_xp}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestSection; 