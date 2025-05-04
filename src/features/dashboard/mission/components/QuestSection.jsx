import React, { useState, useEffect, useContext } from "react";
import Quest from "./Quest";
import { loginQuest, matchesQuest } from "@img/index";
import { getQuests, updateQuestProgress } from "@utils/api/quests.api";
import { useAuth } from "@context/auth.context";
import toast from "react-hot-toast";
import { AuthUtils } from "@utils/api/auth.utils";
import { XPUpdateContext } from "@/features/dashboard/main/xp/xp-progress";
import XPDisplay from "./XPDisplay";

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
      if (response && response.quests) {
        setQuests(response.quests);
      } else {
        setQuests([]);
        toast.error("Format de réponse invalide");
      }
    } catch (error) {
      console.error("Erreur lors du chargement des quêtes:", error);
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

      // S'assurer que la progression est valide
      if (newProgress === null || newProgress === undefined) {
        console.error("Progression invalide:", newProgress);
        return;
      }

      // Obtenir la quête concernée et sa récompense XP (avant mise à jour)
      const targetQuest = quests.find((q) => q.id === questId);
      const xpReward = targetQuest
        ? targetQuest.xp_reward || targetQuest.reward_xp || 0
        : 0;

      // Vérifier si la quête est déjà complétée
      if (targetQuest && targetQuest.completed) {
        toast.error("Cette quête est déjà complétée");
        return;
      }

      // Mettre à jour l'UI immédiatement (optimistic update)
      setQuests((prevQuests) =>
        prevQuests.map((quest) => {
          if (quest.id === questId) {
            return {
              ...quest,
              current_progress: newProgress,
              completed: true,
              completable: false,
            };
          }
          return quest;
        })
      );

      // Envoyer la mise à jour au serveur en arrière-plan
      const response = await updateQuestProgress(questId, newProgress);

      // Afficher le gain d'XP si disponible
      if (response && response.experience_gained > 0) {
        toast.success(`+${response.experience_gained} XP!`);

        // Vérifier si le niveau a augmenté
        const userData = AuthUtils.getUserData();
        if (userData && response.user_level > userData.level) {
          toast.success(`Vous avez atteint le niveau ${response.user_level}!`, {
            icon: "🎉",
            duration: 5000,
          });
        }
      }

      // Mise à jour réussie, rafraîchir l'affichage de l'XP
      refreshXP();
      // Déclencher un événement pour mettre à jour l'affichage XP
      document.dispatchEvent(new Event("xp-updated"));
    } catch (error) {
      console.error("Erreur inattendue:", error);
      toast.error("Erreur lors de la mise à jour de la progression");
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
  const dailyQuests = quests.filter(
    (quest) => quest.quest_type === "daily" || quest.id.includes("daily")
  );

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Colonne gauche - XP et niveau */}
      <div className="col-span-3">
        <XPDisplay />
      </div>

      {/* Colonne centrale - contenu principal */}
      <div className="col-span-6">
        {/* Quêtes quotidiennes */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-5 uppercase">
            Daily Quests
          </h2>
          <div>
            {dailyQuests.map((quest) => (
              <div
                key={quest.id}
                onClick={() =>
                  quest.completable
                    ? handleQuestProgress(quest.id, quest.progress_required)
                    : null
                }
                className={
                  quest.completable && !quest.completed
                    ? "cursor-pointer"
                    : quest.completed
                      ? "opacity-50"
                      : "opacity-50 cursor-not-allowed"
                }
                title={
                  !quest.completable && !quest.completed
                    ? "Complétez d'abord 5 matchs aujourd'hui"
                    : ""
                }
              >
                {quest.title === "Daily Login" ? (
                  <Quest
                    icon={
                      <img
                        src={quest.icon_url || loginQuest}
                        alt={quest.title}
                        className="w-full h-full object-contain"
                      />
                    }
                    title={quest.title}
                    status={quest.completed ? "FINISHED" : ""}
                    progress={
                      quest.progress_required > 1
                        ? `${quest.current_progress}/${quest.progress_required}`
                        : undefined
                    }
                    xp={quest.xp_reward}
                  />
                ) : quest.id === "daily_matches" ? (
                  <Quest
                    icon={
                      <img
                        src={quest.icon || matchesQuest}
                        alt={quest.title}
                        className="w-full h-full object-contain"
                      />
                    }
                    title={quest.title}
                    status={
                      quest.completed
                        ? "FINISHED"
                        : quest.current_progress >= quest.progress_required &&
                            !quest.completed
                          ? ""
                          : ""
                    }
                    progress={
                      quest.current_progress < quest.progress_required
                        ? `${quest.current_progress}/${quest.progress_required}`
                        : null
                    }
                    xp={quest.xp_reward}
                  />
                ) : (
                  <Quest
                    icon={
                      <img
                        src={quest.icon || matchesQuest}
                        alt={quest.title}
                        className="w-full h-full object-contain"
                      />
                    }
                    title={quest.title}
                    status={
                      quest.completed
                        ? "FINISHED"
                        : quest.current_progress >= quest.progress_required &&
                            !quest.completed
                          ? ""
                          : ""
                    }
                    progress={
                      quest.progress_required > 1 &&
                      quest.current_progress < quest.progress_required
                        ? `${quest.current_progress}/${quest.progress_required}`
                        : null
                    }
                    xp={quest.xp_reward}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Colonne droite (vide pour l'équilibre) */}
      <div className="col-span-3">{/* Espace réservé à droite */}</div>
    </div>
  );
};

export default QuestSection;
