import toast from "react-hot-toast";
import { kyInstance } from "@utils/api/ky-config";

/**
 * Regroupe les matchs par numéro de round
 * @param {Array} matches - Liste des matchs à regrouper
 * @returns {Object} Objet avec les matchs regroupés par numéro de round
 */
export function groupMatchesByRound(matches) {
  if (!matches || !Array.isArray(matches)) {
    return {};
  }
  
  return matches.reduce((acc, match) => {
    const round = match.round_number || 1;
    if (!acc[round]) acc[round] = [];
    acc[round].push(match);
    return acc;
  }, {});
}

/**
 * Change le statut d'un match
 * @param {Object} match - Match à modifier
 * @param {Object} tournament - Tournoi parent
 * @param {string} newStatus - Nouveau statut ('in_progress', 'completed', etc.)
 * @param {Function} onMatchUpdated - Fonction appelée en cas de succès
 * @returns {Promise<void>}
 */
export async function updateMatchStatus(match, tournament, newStatus, onMatchUpdated) {
  // Vérifier si le tournoi est complété
  if (tournament.status === 3) {
    toast.error("Impossible de modifier un tournoi déjà complété");
    return;
  }
  
  try {
    await kyInstance.put(`v1/tournaments/${tournament.id}/tournament_matches/${match.id}`, {
      json: {
        match: { status: newStatus }
      }
    }).json();
    
    const actionName = newStatus === 'in_progress' ? 'démarré' : 
                       newStatus === 'completed' ? 'terminé' : 'mis à jour';
    
    toast.success(`Match ${actionName}!`);
    
    // Mettre à jour les données
    if (onMatchUpdated) {
      onMatchUpdated();
    }
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du match:`, error);
    toast.error(`Erreur lors de la mise à jour du match. Veuillez réessayer.`);
  }
}
