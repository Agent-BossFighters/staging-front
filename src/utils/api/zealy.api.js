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
  async checkCommunityStatus() {
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
      console.error("Error checking Zealy community status:", error);
      return { joined: false };
    }
  },

  // Synchroniser les quêtes Zealy
  async syncQuests() {
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
      console.error("Error syncing Zealy quests:", error);
      toast.error("Erreur lors de la synchronisation des quêtes Zealy");
      throw error;
    }
  },

  // Vérifier le statut d'une quête Zealy
  async checkQuestStatus(questId) {
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
      console.error("Error checking Zealy quest status:", error);
      throw error;
    }
  },
};

// Exporter les constantes
export { ZEALY_URL, ZEALY_COMMUNITY };
