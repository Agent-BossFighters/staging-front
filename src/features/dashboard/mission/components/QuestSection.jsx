import React, { useState, useEffect, useContext } from "react";
import Quest from "./Quest";
import { loginQuest, matchesQuest, xQuest } from "@img/index";
import { getQuests, updateQuestProgress } from "@utils/api/quests.api";
import { useAuth } from "@context/auth.context";
import toast from "react-hot-toast";
import { AuthUtils } from "@utils/api/auth.utils";
import { XPUpdateContext } from "@/features/dashboard/main/xp/xp-progress";
import { ZealyService } from "@utils/api/zealy.api";

const QuestSection = () => {
  const { user } = useAuth();
  const [quests, setQuests] = useState([]);
  const [isLoadingQuests, setIsLoadingQuests] = useState(true);
  const [isUpdating, setUpdating] = useState(false);
  const [isSyncingZealy, setIsSyncingZealy] = useState(false);
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
      console.error("Error fetching quests:", error);
      setQuests([]);
      toast.error(
        "Impossible de charger vos quêtes. Veuillez réessayer plus tard."
      );
    } finally {
      setIsLoadingQuests(false);
    }
  };

  // Fonction pour synchroniser les quêtes Zealy
  const syncZealyQuests = async () => {
    if (isSyncingZealy) return;

    try {
      setIsSyncingZealy(true);
      await ZealyService.syncQuests();
      await fetchQuests(); // Recharger toutes les quêtes
      toast.success("Quêtes Zealy synchronisées avec succès");
    } catch (error) {
      toast.error("Erreur lors de la synchronisation des quêtes Zealy");
    } finally {
      setIsSyncingZealy(false);
    }
  };

  // Fonction pour se connecter à Zealy
  const connectToZealy = async () => {
    try {
      await ZealyService.connect();
    } catch (error) {
      toast.error("Erreur lors de la connexion à Zealy");
    }
  };

  // Charger les quêtes depuis l'API
  useEffect(() => {
    fetchQuests();
  }, [user]);

  // Vérifier périodiquement le statut des quêtes Zealy
  useEffect(() => {
    const interval = setInterval(() => {
      quests.forEach((quest) => {
        if (quest.source === "zealy" && !quest.completed) {
          ZealyService.checkQuestStatus(quest.id)
            .then((status) => {
              if (status.completed) {
                fetchQuests(); // Recharger les quêtes si une quête est complétée
              }
            })
            .catch(console.error);
        }
      });
    }, 30000); // Vérifier toutes les 30 secondes

    return () => clearInterval(interval);
  }, [quests]);

  // Gérer la progression d'une quête
  const handleQuestProgress = async (questId, newProgress) => {
    if (isUpdating) return; // Éviter les clics multiples

    try {
      setUpdating(true);

      // S'assurer que la progression est un nombre valide
      if (newProgress === null || newProgress === undefined) {
        console.error("Progression invalide:", newProgress);
        toast.error("Valeur de progression invalide");
        return;
      }

      const response = await updateQuestProgress(questId, newProgress);

      // Si la requête a réussi, mettre à jour les quêtes
      await fetchQuests();

      // Si de l'XP a été gagnée
      if (
        response &&
        response.experience_gained &&
        response.experience_gained > 0
      ) {
        // Récupérer les données utilisateur actuelles
        const userData = AuthUtils.getUserData();

        if (userData) {
          // Créer un nouvel objet utilisateur avec les données mises à jour
          const updatedUserData = {
            ...userData,
            level: response.user_level || userData.level || 1,
            experience: response.user_experience || userData.experience || 0,
          };

          // Mettre à jour les données utilisateur dans le localStorage
          AuthUtils.setUserData(updatedUserData);

          // Afficher un message de succès pour l'XP
          toast.success(`+${response.experience_gained} XP!`);

          // Si le niveau a augmenté
          if (response.user_level > (userData.level || 1)) {
            toast.success(
              `Vous avez atteint le niveau ${response.user_level}!`,
              {
                icon: "🎉",
                duration: 5000,
              }
            );
          }

          // Demander à la barre d'XP de se rafraîchir
          refreshXP();

          // Forcer une actualisation de la page après un court délai si l'XP a été gagnée
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
      }
    } catch (error) {
      toast.error("Impossible de mettre à jour la progression de la quête");
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
  const socialQuests = quests.filter(
    (quest) => quest.quest_type === "social" || quest.id.includes("social")
  );

  return (
    <div className="w-full">
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

      {/* Quêtes sociales */}
      <div>
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold text-white uppercase">
            Social Quests
          </h2>
          <div className="flex gap-2">
            {!user.zealy_user_id ? (
              <button
                onClick={connectToZealy}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Connecter Zealy
              </button>
            ) : (
              <button
                onClick={syncZealyQuests}
                disabled={isSyncingZealy}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {isSyncingZealy ? "Synchronisation..." : "Synchroniser Zealy"}
              </button>
            )}
          </div>
        </div>
        <div>
          {socialQuests.map((quest) => (
            <div
              key={quest.id}
              onClick={() => {
                if (quest.source === "zealy" && quest.zealy_link) {
                  window.open(quest.zealy_link, "_blank");
                } else if (quest.completable) {
                  handleQuestProgress(quest.id, quest.progress_required);
                }
              }}
              className={`
                ${quest.source === "zealy" ? "cursor-pointer hover:bg-gray-700" : ""}
                ${quest.completable && !quest.completed ? "cursor-pointer" : quest.completed ? "opacity-50" : "opacity-50 cursor-not-allowed"}
              `}
            >
              <Quest
                icon={
                  <img
                    src={quest.icon || xQuest}
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestSection;
