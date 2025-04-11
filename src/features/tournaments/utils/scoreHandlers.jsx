import { kyInstance } from "@utils/api/ky-config";
import toast from "react-hot-toast";
import { parseTimeToSeconds } from "./timeFormatters";

/**
 * Initialise les scores pour l'édition de tous les scores
 * @param {Object} groupedMatches - Matchs regroupés par round
 * @param {boolean} isShowtimeSurvival - Si c'est un tournoi de type survival
 * @param {Function} formatTimeOrScore - Fonction pour formater les temps
 * @returns {Object} Scores initialisés
 */
export function initializeAllScores(groupedMatches, isShowtimeSurvival, formatTimeOrScore) {
  const initialScores = {};
  
  Object.values(groupedMatches).forEach(roundMatches => {
    roundMatches.forEach(match => {
      if (isShowtimeSurvival) {
        const formattedTime = formatTimeOrScore(match.team_a_points || 0, "time") || "00:00";
        initialScores[match.id] = {
          team_a_time: formattedTime,
          team_a_points: match.team_a_points || 0,
          boss_damage: match.team_b_points || 0
        };
      } else {
        initialScores[match.id] = {
          team_a_points: match.team_a_points || 0,
          lives_left: match.team_b_points || 0
        };
      }
    });
  });
  
  return initialScores;
}

/**
 * Met à jour une valeur dans l'état des scores groupés
 * @param {string|number} matchId - ID du match
 * @param {string} team - Identifiant du champ
 * @param {string|number} value - Nouvelle valeur
 * @param {Function} setAllScores - Fonction pour mettre à jour l'état
 */
export function updateAllScoreValue(matchId, team, value, setAllScores) {
  setAllScores(prev => {
    const newScores = {
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [team]: team === 'team_a_time' ? value : (parseInt(value) || 0)
      }
    };
    return newScores;
  });
}

/**
 * Enregistre tous les scores modifiés
 * @param {Object} allScores - Tous les scores à enregistrer
 * @param {Array} matches - Liste des matchs
 * @param {Object} tournament - Tournoi parent
 * @param {boolean} isShowtimeSurvival - Si c'est un tournoi de type survival
 * @param {Function} onMatchUpdated - Fonction appelée en cas de succès
 * @param {Function} setIsEditingAllScores - Fonction pour réinitialiser l'état d'édition
 * @param {Function} setSaving - Fonction pour gérer l'état de sauvegarde
 * @returns {Promise<void>}
 */
export async function saveAllScores(
  allScores,
  matches,
  tournament,
  isShowtimeSurvival,
  onMatchUpdated,
  setIsEditingAllScores,
  setSaving
) {
  setSaving(true);
  
  try {
    // Sauvegarder tous les scores modifiés
    const savePromises = Object.entries(allScores).map(async ([matchId, matchScores]) => {
      const match = matches.find(m => m.id === parseInt(matchId));
      if (!match) return;
      
      // Créer l'objet pour la mise à jour selon le type de tournoi
      const updateData = {};
      
      if (isShowtimeSurvival) {
        // Pour le mode Survival
        // Convertir le temps en points (secondes)
        if (matchScores.team_a_time) {
          updateData.team_a_points = parseTimeToSeconds(matchScores.team_a_time);
        } else {
          updateData.team_a_points = matchScores.team_a_points;
        }
        // Ajouter les dégâts du boss pour le départage
        updateData.boss_damage = matchScores.boss_damage || 0;
      } else {
        // Pour le mode Score Counter
        updateData.team_a_points = matchScores.team_a_points;
        // Ajouter les vies restantes pour le départage
        updateData.lives_left = matchScores.lives_left || 0;
      }
      
      // Déterminer le vainqueur
      let winner_id = null;
      if (updateData.team_a_points > 0) {
        winner_id = match.team_a_id;
      }
      
      const updatedMatch = {
        ...updateData,
        winner_id,
        status: 'completed'
      };
      
      await kyInstance.put(`v1/tournaments/${tournament.id}/tournament_matches/${matchId}`, {
        json: {
          match: updatedMatch
        }
      }).json();
    });
    
    await Promise.all(savePromises);
    
    // Mettre à jour la vue avec les nouveaux matchs
    if (onMatchUpdated) {
      onMatchUpdated();
    }
    
    toast.success('Tous les scores ont été enregistrés avec succès!');
    setIsEditingAllScores(false);
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des scores:", error);
    toast.error('Erreur lors de l\'enregistrement des scores. Veuillez réessayer.');
  } finally {
    setSaving(false);
  }
}