  import { kyInstance } from "@utils/api/ky-config";
  import toast from "react-hot-toast";
  import { parseTimeToSeconds } from "./timeFormatters";
  
  /**
  * @param {Object} editingMatch - Match à mettre à jour
  * @param {Object} tournament - Tournoi parent
  * @param {Object} scores - Scores à enregistrer
  * @param {boolean} isShowtimeSurvival -Si c'est un tournoi de type survival
  * @param {Function} onMatchUpdated - Fonction appelée en cas de succès
  * @param {Function} setEditingMatch - Fonction pour réinitialiser le match en édition
  * @param {Function} setSaving - Fonction pour gérer l'état de sauvegarde
  * @returns {Promise<void>}
  */
  export async function saveMatchScores (
    editingMatch, 
    tournament, 
    scores, 
    isShowtimeSurvival, 
    onMatchUpdated,
    setEditingMatch,
    setSaving
  ) {
    if (!editingMatch) return;
    
    // Vérifier si le tournoi est complété
    if (tournament.status === 3) {
      toast.error("Impossible de modifier les scores d'un tournoi complété");
      setEditingMatch(null);
      return;
    }
    
    setSaving(true);
    try {
      // Si c'est un tournoi Survival et que l'entrée est au format minutes:secondes
      let finalScores = { ...scores };
      
      if (isShowtimeSurvival && typeof scores.team_a_time === 'string') {
        // Convertir le temps en secondes
        const totalSeconds = parseTimeToSeconds(scores.team_a_time);
        finalScores.team_a_points = totalSeconds;
      }
      
      // Déterminer le vainqueur en fonction des scores
      let winner_id = null;
      if (finalScores.team_a_points > finalScores.team_b_points) {
        winner_id = editingMatch.team_a_id;
      }
      
      const updatedMatch = {
        team_a_points: finalScores.team_a_points,
        team_b_points: finalScores.team_b_points,
        winner_id,
        status: 'completed'
      };
      
      await kyInstance.put(`v1/tournaments/${tournament.id}/tournament_matches/${editingMatch.id}`, {
        json: {
          match: updatedMatch
        }
      }).json();
      
      toast.success('Résultats du match enregistrés avec succès!');
      setEditingMatch(null);
      
      // Mettre à jour les données
      if (onMatchUpdated) {
        onMatchUpdated();
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des scores:', error);
      toast.error('Erreur lors de l\'enregistrement des scores. Veuillez réessayer.');
    } finally {
      setSaving(false);
    }
  };

  /**
    * Prépare l'édition des scores d'un match
    * @param {Object} match - Match à éditer
    * @param {Object} tournament - Tournoi parent
    * @param {boolean} isShowtimeSurvival - Si c'est un tournoi de type survival
    * @param {Function} formatTimeOrScore - Fonction pour formater les temps/scores
    * @param {Function} setEditingMatch - Fonction pour définir le match en édition
    * @param {Function} setScores - Fonction pour définir les scores initiaux
    * @returns {void}
    */
   export function editMatchScores(
     match,
     tournament,
     isShowtimeSurvival,
     formatTimeOrScore,
     setEditingMatch,
     setScores
   ) {
     // Ne pas permettre l'édition si le tournoi est complété
     if (tournament.status === "completed") {
       toast.error("Impossible de modifier les scores d'un tournoi complété");
       return;
     }
     
     setEditingMatch(match);
     
     const initialScores = {
       team_a_points: match.team_a_points || 0,
       team_b_points: match.team_b_points || 0
     };
     
     // Pour le mode Survival, ajouter un champ pour la saisie du temps en format MM:SS
     if (isShowtimeSurvival) {
       initialScores.team_a_time = formatTimeOrScore(match.team_a_points, "time");
     }
     
     setScores(initialScores);
   }

   /**
 * Met à jour la valeur d'un score pendant l'édition
 * @param {string} team - Identifiant du champ (team_a_points, team_b_points, team_a_time)
 * @param {string|number} value - Nouvelle valeur saisie
 * @param {Function} setScores - Fonction pour mettre à jour l'état des scores
 * @returns {void}
 */
export function updateScoreValue(team, value, setScores) {
  // S'assurer que la valeur est un nombre valide pour les points normaux
  // ou conserver la chaîne pour le format temps
  const updatedValue = team === 'team_a_time' ? value : (parseInt(value) || 0);
  
  setScores(prev => ({
    ...prev,
    [team]: updatedValue
  }));
}