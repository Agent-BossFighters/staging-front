import React, { useState, useEffect } from "react";
import Quest from "./Quest";
import { xQuest, zealyQuest } from "@img/index";
import { ZEALY_URL } from "@utils/api/zealy.api";
import { ZealyService } from "@utils/api/zealy.api";
import toast from "react-hot-toast";

const SocialQuests = ({ quests, onQuestProgress, onRefreshQuests }) => {
  const [localQuests, setLocalQuests] = useState([]);
  const [claimingQuests, setClaimingQuests] = useState({}); // Pour gérer l'état de claim

  // Mettre à jour les quêtes locales quand les props changent
  useEffect(() => {
    setLocalQuests(quests);
  }, [quests]);

  // Polling pour les mises à jour des quêtes (en attendant les webhooks)
  useEffect(() => {
    const pollInterval = setInterval(() => {
      onRefreshQuests();
    }, 15000); // Toutes les 15 secondes

    return () => clearInterval(pollInterval);
  }, [onRefreshQuests]);

  // Filtrer les quêtes sociales
  const socialQuests = quests.filter(
    (quest) => quest.quest_type === "social" || quest.id.includes("social")
  );

  // Gérer le clic sur une quête
  const handleQuestClaim = async (quest) => {
    try {
      // Vérifier si la quête est déjà en cours de claim
      if (claimingQuests[quest.id]) {
        toast.error("Cette quête est déjà en cours de traitement");
        return;
      }

      // Marquer la quête comme en cours de claim
      setClaimingQuests((prev) => ({ ...prev, [quest.id]: true }));

      // Vérifier le statut de la communauté
      const communityStatus = await ZealyService.checkCommunityStatus();

      if (!communityStatus.joined) {
        window.open(ZEALY_URL, "_blank");
        toast("Vous devez d'abord rejoindre la communauté Zealy", {
          icon: "ℹ️",
        });
        return;
      }

      if (!communityStatus.user?.id) {
        window.open(ZEALY_URL, "_blank");
        toast.success("Redirection vers Zealy...");
        return;
      }

      // Vérifier si la quête est déjà complétée
      if (quest.completed) {
        toast.error("Cette quête est déjà complétée");
        return;
      }

      // Vérifier si la quête est complétable
      if (!quest.completable) {
        toast.error("Cette quête n'est pas encore complétable");
        return;
      }

      // Vérifier le statut de la quête sur Zealy si c'est une quête sociale
      if (quest.quest_type === "social" || quest.id.includes("social")) {
        try {
          const questStatus = await ZealyService.checkQuestStatus(quest.id);

          if (!questStatus.completed) {
            toast.error(
              "Vous devez d'abord compléter les actions requises sur Twitter"
            );
            return;
          }
        } catch (error) {
          console.error("Error checking quest status:", error);
          toast.error("Erreur lors de la vérification du statut de la quête");
          return;
        }
      }

      // Mettre à jour la progression
      await onQuestProgress(quest.id, quest.progress_required);

      // Attendre un court délai pour laisser le temps au webhook d'être traité
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Rafraîchir les quêtes
      await onRefreshQuests();

      toast.success("Quête validée !");
    } catch (error) {
      console.error("Error claiming quest:", error);
      toast.error("Erreur lors de la validation de la quête");
    } finally {
      // Réinitialiser l'état de claim
      setClaimingQuests((prev) => ({ ...prev, [quest.id]: false }));
    }
  };

  // Fonction pour rendre le texte avec des liens cliquables
  const renderDescriptionWithLinks = (quest) => {
    if (quest.id === "zealy_connect") {
      const text = "Connect to Zealy and follow our community to earn rewards";
      const parts = text.split("Zealy");

      return (
        <span className="text-white/70">
          {parts[0]}
          <a
            href={ZEALY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.open(ZEALY_URL, "_blank");
            }}
          >
            Zealy
          </a>
          {parts[1]}
        </span>
      );
    }

    return quest.description;
  };

  // Gérer le clic sur la quête Zealy
  const handleZealyQuestClick = async () => {
    try {
      const communityStatus = await ZealyService.checkCommunityStatus();
      if (communityStatus.joined && communityStatus.user?.id) {
        const targetQuest = quests.find((q) => q.id === "zealy_connect");
        if (targetQuest && !targetQuest.completed) {
          await onQuestProgress(
            "zealy_connect",
            targetQuest.progress_required || 1
          );
          await onRefreshQuests();
        }
      } else {
        window.open(ZEALY_URL, "_blank");
        toast.success("Redirection vers Zealy...");
      }
    } catch (error) {
      console.error("Error handling Zealy quest click:", error);
      toast.error("Erreur lors de la vérification du statut Zealy");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-5 uppercase">
        Social Quests
      </h2>
      <div>
        {socialQuests.map((quest) => (
          <div key={quest.id} className={quest.completed ? "opacity-50" : ""}>
            <Quest
              icon={
                <img
                  src={quest.icon || xQuest}
                  alt={quest.title}
                  className="w-full h-full object-contain"
                />
              }
              title={quest.name}
              description={renderDescriptionWithLinks(quest)}
              status={quest.completed ? "FINISHED" : ""}
              progress={
                quest.completed ? (
                  "CLAIMED"
                ) : (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuestClaim(quest);
                    }}
                    className="cursor-pointer"
                  >
                    CLAIM
                  </div>
                )
              }
              xp={quest.xp_reward}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialQuests;
