import { kyInstance } from "./ky-config";
import toast from "react-hot-toast";

const ZEALY_COMMUNITY = "agentbossfighterstest";
const ZEALY_URL = "https://zealy.io/cw/agentbossfighterstest";

export const ZealyService = {
  // Se connecter à Zealy
  async connect() {
    try {
      window.location.href = ZEALY_URL;
    } catch (error) {
      console.error("Error connecting to Zealy:", error);
      toast.error("Erreur lors de la connexion à Zealy");
      throw error;
    }
  },

  // Vérifier si l'utilisateur a rejoint la communauté
  async checkCommunityStatus(retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await kyInstance
          .get("v1/zealy/community_status", {
            searchParams: {
              community: ZEALY_COMMUNITY,
            },
          })
          .json();
        return response;
      } catch (error) {
        console.error(
          `Error checking Zealy community status (attempt ${i + 1}/${retries}):`,
          error
        );
        if (i === retries - 1) {
          toast.error(
            "Impossible de vérifier le statut de la communauté Zealy"
          );
          return { joined: false, error: true };
        }
        // Attendre avant de réessayer
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
    return { joined: false, error: true };
  },

  // Synchroniser les quêtes Zealy
  async syncQuests(retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await kyInstance
          .post("v1/zealy/sync_quests", {
            json: {
              community: ZEALY_COMMUNITY,
            },
          })
          .json();
        toast.success("Quêtes Zealy synchronisées avec succès");
        return response;
      } catch (error) {
        console.error(
          `Error syncing Zealy quests (attempt ${i + 1}/${retries}):`,
          error
        );
        if (i === retries - 1) {
          toast.error("Erreur lors de la synchronisation des quêtes Zealy");
          throw error;
        }
        // Attendre avant de réessayer
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  },

  // Vérifier le statut d'une quête Zealy
  async checkQuestStatus(questId, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await kyInstance
          .get(`v1/quests/${questId}/zealy/status`, {
            searchParams: {
              community: ZEALY_COMMUNITY,
            },
          })
          .json();
        return response;
      } catch (error) {
        console.error(
          `Error checking Zealy quest status (attempt ${i + 1}/${retries}):`,
          error
        );
        if (i === retries - 1) {
          throw error;
        }
        // Attendre avant de réessayer
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  },
};

// Exporter les constantes
export { ZEALY_URL, ZEALY_COMMUNITY };
