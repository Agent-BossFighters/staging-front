import { kyInstance } from "./ky-config";
import toast from "react-hot-toast";
import { AuthUtils } from "./auth.utils";

// Récupérer toutes les quêtes disponibles
export async function getQuests() {
  try {
    const response = await kyInstance.get('v1/quests').json();
    return response;
  } catch (error) {
    console.error("Error fetching quests:", error);
    toast.error("Impossible de charger les quêtes");
    throw error;
  }
}

// Récupérer les détails d'une quête spécifique
export async function getQuest(questId) {
  try {
    const response = await kyInstance.get(`v1/quests/${questId}`).json();
    return response;
  } catch (error) {
    console.error("Error fetching quest details:", error);
    toast.error("Impossible de charger les détails de la quête");
    throw error;
  }
}

// Mettre à jour la progression d'une quête
export async function updateQuestProgress(questId, progress) {
  try {
    const response = await kyInstance.patch(`v1/quests/${questId}/progress`, {
      json: {
        progress: progress
      }
    }).json();
    
    // Mettre à jour les données utilisateur dans le localStorage si l'XP a été gagnée
    if (response && response.experience_gained > 0) {
      const userData = AuthUtils.getUserData();
      if (userData) {        
        // Mettre à jour le localStorage avec les nouvelles valeurs
        AuthUtils.setUserData({
          ...userData,
          level: response.user_level || userData.level || 1,
          experience: response.user_experience || userData.experience || 0
        });
      }
    }
    
    return response;
  } catch (error) {
    console.error("Error updating quest progress:", error);
    // Récupérer et retourner les détails de l'erreur si disponibles
    if (error.response) {
      try {
        const errorData = await error.response.json();
        console.error("Error details:", errorData);
        toast.error(errorData.error || "Erreur lors de la mise à jour de la progression");
        throw { ...error, responseData: errorData };
      } catch (jsonError) {
        toast.error("Erreur lors de la mise à jour de la progression");
        throw error;
      }
    } else {
      toast.error("Erreur lors de la mise à jour de la progression");
      throw error;
    }
  }
}

// Récupérer les données XP de l'utilisateur (niveau et expérience) depuis le backend
export async function getUserXP() {
  try {
    const userData = AuthUtils.getUserData();
    if (!userData || !userData.id) {
      console.error("User not authenticated or missing ID");
      throw new Error("User not authenticated");
    }
    
    const response = await kyInstance.get(`v1/users/${userData.id}/xp`).json();
    
    return response;
  } catch (error) {
    
    // Essayer d'obtenir des détails d'erreur
    if (error.response) {
      try {
        const errorData = await error.response.json();
        console.error("XP error details:", errorData);
      } catch (jsonError) {
        // Ignorer les erreurs de parsing JSON
      }
    }
    
    // En cas d'erreur, retourner des valeurs par défaut
    return {
      user: {
        id: AuthUtils.getUserData()?.id,
        level: 1,
        experience: 0
      },
      level_stats: {
        current_level: 1,
        experience: 0,
        next_level_experience: 1000
      }
    };
  }
}

// Valider une quête quotidienne et mettre à jour l'XP de l'utilisateur
export async function validateDailyQuest(questId) {
  try {
    const response = await kyInstance.post(`v1/quests/validate`, {
      json: {
        quest_id: questId
      }
    }).json();
    
    if (response.success) {
      toast.success(response.message || "Quête validée avec succès!");
    }
    
    return response;
  } catch (error) {
    console.error("Error validating quest:", error);
    
    // Gérer les erreurs spécifiques de validation de quête
    if (error.responseData?.error) {
      toast.error(error.responseData.error);
    } else {
      toast.error("Erreur lors de la validation de la quête");
    }
    
    throw error;
  }
}

// Vérifier le statut de la quête de connexion quotidienne
export async function checkDailyLoginQuest() {
  try {
    const response = await kyInstance.get(`v1/quests/login/status`).json();
    return response;
  } catch (error) {
    console.error("Error checking login quest status:", error);
    throw error;
  }
}

// Mettre à jour l'XP de l'utilisateur dans le backend
export async function updateUserXP(xpToAdd, newLevel = null, newExperience = null) {
  try {
    const userData = AuthUtils.getUserData();
    if (!userData || !userData.id) {
      throw new Error("User not authenticated");
    }
    
    // Utiliser la nouvelle route pour mettre à jour directement le niveau et l'XP
    if (newLevel !== null && newExperience !== null) {
      const response = await kyInstance.patch(`v1/users/level_exp`, {
        json: {
          user: {
            level: newLevel,
            experience: newExperience
          }
        }
      }).json();
      
      // Mettre à jour les données utilisateur dans le localStorage avec les nouvelles valeurs
      if (response.user) {
        const currentUserData = AuthUtils.getUserData();
        AuthUtils.setUserData({
          ...currentUserData,
          level: response.user.level,
          experience: response.user.experience
        });
      }
      
      return response;
    } 
    // Utiliser l'ancienne route pour ajouter de l'XP
    else {
      const response = await kyInstance.patch(`v1/users/${userData.id}/xp`, {
        json: {
          experience_to_add: xpToAdd
        }
      }).json();
      
      // Mettre à jour les données utilisateur dans le localStorage avec les nouvelles valeurs
      if (response.user) {
        const currentUserData = AuthUtils.getUserData();
        AuthUtils.setUserData({
          ...currentUserData,
          level: response.user.level,
          experience: response.user.experience
        });
      }
      
      return response;
    }
  } catch (error) {
    console.error("Error updating user XP:", error);
    throw error;
  }
}

// Définir directement le niveau et l'XP d'un utilisateur
export async function setUserXP(level, experience) {
  try {
    return await updateUserXP(null, level, experience);
  } catch (error) {
    console.error("Error setting user XP:", error);
    toast.error("Erreur lors de la mise à jour du niveau et de l'XP");
    throw error;
  }
} 