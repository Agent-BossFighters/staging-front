/**
 * Fichier d'archives pour les fonctions temporairement inutilisées
 * Ces fonctions ont été extraites de TournamentBracketShowtime.jsx lors de la refactorisation
 * Elles sont conservées ici pour référence future en cas de besoin
 */

import toast from "react-hot-toast";
import { kyInstance } from "@utils/api/ky-config";

/**
 * Trouve une équipe par son ID
 * @param {Array} teams - Liste de toutes les équipes
 * @param {number|string} teamId - ID de l'équipe à trouver
 * @returns {Object} L'équipe trouvée ou un objet par défaut
 */
export const getTeamById = (teams, teamId) => {
  return teams?.find(team => team.id === teamId) || { name: '?', id: null };
};




/**
 * Met à jour le score total d'une équipe
 * Cette fonction peut soit mettre à jour un seul match, soit répartir un score total entre plusieurs matchs
 * @param {number|string} teamId - ID de l'équipe
 * @param {number|string} newScore - Nouveau score à appliquer
 * @param {Array} matches - Liste des matchs
 * @param {Object} tournament - Tournoi parent
 * @param {boolean} isCreator - Si l'utilisateur est le créateur du tournoi
 * @param {Function} onMatchUpdated - Fonction appelée en cas de succès
 * @returns {Promise<void>}
 */
export const updateTeamScore = async (teamId, newScore, matches, tournament, isCreator, onMatchUpdated) => {
  if (!isCreator || !teamId) return;
  
  // Vérifier si l'équipe a des matchs (en tant que team_a ou team_b)
  const teamMatches = matches?.filter(match => match.team_a_id === teamId || match.team_b_id === teamId) || [];
  
  if (teamMatches.length === 0) {
    toast.error("Cette équipe n'a pas de match à mettre à jour");
    return;
  }
  
  try {
    // Détermine si on a un seul match ou plusieurs
    if (teamMatches.length === 1) {
      // Si un seul match, on met simplement à jour son score
      const match = teamMatches[0];
      // Déterminer si l'équipe est A ou B
      const isTeamA = match.team_a_id === teamId;
      
      await kyInstance.put(`v1/tournaments/${tournament.id}/tournament_matches/${match.id}`, {
        json: {
          match: {
            // Mettre à jour le score de l'équipe A ou B selon sa position
            ...(isTeamA ? { team_a_points: parseInt(newScore) } : { team_b_points: parseInt(newScore) }),
            status: 'completed',
            winner_id: isTeamA 
              ? (parseInt(newScore) > (match.team_b_points || 0) ? teamId : null)
              : ((match.team_a_points || 0) > parseInt(newScore) ? match.team_a_id : teamId)
          }
        }
      }).json();
      
      toast.success("Score mis à jour avec succès!");
      
      // Rafraîchir les données
      if (onMatchUpdated) {
        onMatchUpdated();
      } else {
        console.warn("onMatchUpdated n'est pas défini");
      }
    } else {
      // Si plusieurs matchs, on distribue le score équitablement entre eux
      const scorePerMatch = Math.floor(parseInt(newScore) / teamMatches.length);
      const remainder = parseInt(newScore) % teamMatches.length;
      
      const updatePromises = teamMatches.map((match, index) => {
        // Ajouter le reste au premier match pour ne pas perdre de points
        const pointsForThisMatch = index === 0 ? scorePerMatch + remainder : scorePerMatch;
        // Déterminer si l'équipe est A ou B
        const isTeamA = match.team_a_id === teamId;
        
        return kyInstance.put(`v1/tournaments/${tournament.id}/tournament_matches/${match.id}`, {
          json: {
            match: {
              // Mettre à jour le score de l'équipe A ou B selon sa position
              ...(isTeamA ? { team_a_points: pointsForThisMatch } : { team_b_points: pointsForThisMatch }),
              status: 'completed',
              winner_id: isTeamA 
                ? (pointsForThisMatch > (match.team_b_points || 0) ? teamId : null)
                : ((match.team_a_points || 0) > pointsForThisMatch ? match.team_a_id : teamId)
            }
          }
        });
      });
      
      await Promise.all(updatePromises);
      toast.success(`Score total de ${newScore} réparti entre ${teamMatches.length} matchs`);
      
      // Rafraîchir les données
      if (onMatchUpdated) {
        onMatchUpdated();
      } else {
        console.warn("onMatchUpdated n'est pas défini");
      }
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour du score:", error);
    toast.error("Échec de la mise à jour du score. Veuillez réessayer.");
  }
};




/**
 * Marque un tournoi comme terminé
 * @param {Object} tournament - Tournoi à terminer
 * @param {Function} onMatchUpdated - Fonction appelée en cas de succès pour rafraîchir les données
 * @returns {Promise<void>}
 */
export const completeTournament = async (tournament, onMatchUpdated) => {
  try {
    await kyInstance.put(`v1/tournaments/${tournament.id}`, {
      json: {
        tournament: { status: 3 } // completed
      }
    }).json();
    
    toast.success('Tournoi terminé avec succès!');
    
    // Rafraîchir les données
    if (onMatchUpdated) {
      onMatchUpdated();
    }
  } catch (error) {
    console.error('Erreur lors de la terminaison du tournoi:', error);
    toast.error('Erreur lors de la terminaison du tournoi. Veuillez réessayer.');
  }
};
