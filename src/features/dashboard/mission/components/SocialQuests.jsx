import React, { useState, useEffect } from "react";
import Quest from "./Quest";
import { xQuest, zealyQuest } from "@img/index";
import { ZEALY_URL } from "@utils/api/zealy.api";
import { ZealyService } from "@utils/api/zealy.api";
import toast from "react-hot-toast";

const SocialQuests = ({ quests, onQuestProgress, onRefreshQuests }) => {
  const [localQuests, setLocalQuests] = useState([]);

  // Mettre à jour les quêtes locales quand les props changent
  useEffect(() => {
    setLocalQuests(quests);
  }, [quests]);

  // Filtrer les quêtes sociales
  const socialQuests = localQuests.filter(
    (quest) =>
      (quest.quest_type === "social" || quest.id.includes("social")) &&
      quest.id !== "zealy_connect"
  );

  // Ajouter la quête Zealy aux quêtes sociales
  const zealyQuestData = {
    id: "zealy_connect",
    name: "Join the Agent's community on Zealy",
    description: "Connect to Zealy and follow our community to earn rewards",
    reward_xp: 100,
    completed: false,
    completable: true,
    icon: zealyQuest,
    link: {
      text: "Zealy",
      url: ZEALY_URL,
    },
  };

  // Mettre la quête Zealy en première position
  const allSocialQuests = [zealyQuestData, ...socialQuests];

  // Gérer le clic sur la quête Zealy
  const handleZealyQuestClick = async () => {
    try {
      // Vérifier si l'utilisateur a déjà un Zealy ID
      const communityStatus = await ZealyService.checkCommunityStatus();

      if (communityStatus.joined && communityStatus.user?.id) {
        // Si l'utilisateur est déjà inscrit et a un ID Zealy, on peut réclamer les points
        const targetQuest = localQuests.find((q) => q.id === "zealy_connect");
        if (targetQuest && !targetQuest.completed) {
          // Mettre à jour la progression avec la valeur requise
          await onQuestProgress(
            "zealy_connect",
            targetQuest.progress_required || 1
          );

          // Mettre à jour l'état local immédiatement
          setLocalQuests((prevQuests) =>
            prevQuests.map((quest) =>
              quest.id === "zealy_connect"
                ? { ...quest, completed: true, completable: false }
                : quest
            )
          );

          // Rafraîchir les quêtes après la mise à jour
          await onRefreshQuests();
        }
      } else {
        // Sinon, on redirige vers Zealy
        window.open(ZEALY_URL, "_blank");
        toast.success("Redirection vers Zealy...");
      }
    } catch (error) {
      console.error("Error handling Zealy quest click:", error);
      toast.error("Erreur lors de la vérification du statut Zealy");
    }
  };

  // Fonction pour rendre le texte avec des liens cliquables
  const renderDescriptionWithLinks = (quest) => {
    if (!quest.link) return quest.description;

    const parts = quest.description.split(quest.link.text);
    return (
      <>
        {parts[0]}
        <a
          href={quest.link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
          onClick={(e) => {
            e.stopPropagation();
            if (quest.id === "zealy_connect") {
              handleZealyQuestClick();
            }
          }}
        >
          {quest.link.text}
        </a>
        {parts[1]}
      </>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-5 uppercase">
        Social Quests
      </h2>
      <div>
        {allSocialQuests.map((quest) => {
          // Trouver la quête correspondante dans les quêtes locales
          const localQuest =
            localQuests.find((q) => q.id === quest.id) || quest;

          // Déterminer si la quête est cliquable
          const isClickable =
            quest.id === "zealy_connect"
              ? true // La quête Zealy est toujours cliquable
              : localQuest.completable && !localQuest.completed; // Les autres quêtes suivent la logique normale

          return (
            <div
              key={quest.id}
              onClick={() => {
                if (quest.id === "zealy_connect") {
                  handleZealyQuestClick();
                } else if (localQuest.completable) {
                  onQuestProgress(localQuest.id, localQuest.progress_required);
                }
              }}
              className={
                isClickable
                  ? "cursor-pointer"
                  : localQuest.completed
                    ? "opacity-50"
                    : "opacity-50 cursor-not-allowed"
              }
            >
              <Quest
                icon={
                  <img
                    src={localQuest.icon || xQuest}
                    alt={localQuest.name}
                    className="w-full h-full object-contain"
                  />
                }
                title={localQuest.name}
                description={renderDescriptionWithLinks(localQuest)}
                status={localQuest.completed ? "FINISHED" : ""}
                progress={
                  localQuest.progress_required > 1
                    ? `${localQuest.current_progress}/${localQuest.progress_required}`
                    : undefined
                }
                xp={localQuest.reward_xp}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SocialQuests;
