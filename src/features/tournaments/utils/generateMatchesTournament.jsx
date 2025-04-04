import { kyInstance } from "@utils/api/ky-config";
import toast from "react-hot-toast";

/**
 * Génère des matchs pour un tournoi
 * @param {Object} tournament - Tournoi pour lequel générer des matchs
 * @param {Array} teams - Équipes participant au tournoi
 * @param {Array} matches - Matchs existants (pour vérification)
 * @param {Function} onMatchUpdated - Callback appelé après génération
 * @param {boolean} isCreator - Si l'utilisateur est le créateur du tournoi
 * @param {Function} setGeneratingMatches - Fonction pour mettre à jour l'état
 */
export default async function generateTournamentMatches(
  tournament, 
  teams, 
  matches, 
  onMatchUpdated,
  isCreator,
  setGeneratingMatches
) {
  if (!isCreator || !teams || teams.length < 2) return;
  
  // Vérifier si des matchs existent déjà
  if (matches && matches.length > 0) {
    toast("Des matchs existent déjà pour ce tournoi. Rafraîchissez la page pour les voir.");
    if (onMatchUpdated) {
      onMatchUpdated();
    }
    return;
  }
  
  if (setGeneratingMatches) {
    setGeneratingMatches(true);
  }
  
  try {
    const teamIds = teams.map(team => team.id);
    
    // Récupérer le nombre de rounds défini pour le tournoi (par défaut 1)
    const rawRounds = tournament.rounds;
    
    // Convertir en nombre et appliquer une valeur par défaut si nécessaire
    let configuredRounds = parseInt(rawRounds) || 1;
    
    // Forcer au moins 1 round
    if (configuredRounds < 1) configuredRounds = 1;
    
    // Si on a configuré 3 rounds, on en génère 3, peu importe le type de tournoi
    let numberOfRounds = configuredRounds;
    
    // Message simple indiquant le nombre de rounds à générer
    toast(`${numberOfRounds} round(s) sera/seront généré(s) pour chaque équipe`);
    
    // Créer un tableau de promesses pour toutes les créations de matchs
    const matchPromises = [];
    
    // Générer les matchs pour chaque round et chaque équipe
    for (let round = 1; round <= numberOfRounds; round++) {
      for (const teamId of teamIds) {
        
        // Données du match
        const matchData = {
          match: {
            team_a_id: teamId,
            boss_id: tournament.boss_id,
            round_number: round,
            status: 'pending'
          }
        };
        
        // Créer le match
        const matchPromise = kyInstance.post(`v1/tournaments/${tournament.id}/tournament_matches`, {
          json: matchData
        });
        
        matchPromises.push(matchPromise);
      }
    }
    
    // Attendre que tous les matchs soient créés
    await Promise.all(matchPromises);
    
    const nbEquipes = teamIds.length;
    const nbMatchsParRound = nbEquipes;
    const nbTotalMatchs = nbMatchsParRound * numberOfRounds;
    
    toast.success(`${nbTotalMatchs} matchs ont été générés avec succès (${numberOfRounds} round(s) × ${nbEquipes} équipes)!`);
    toast("Veuillez rafraîchir la page si les matchs n'apparaissent pas");
    
    // Rafraîchir les données
    if (onMatchUpdated) {
      onMatchUpdated();
    }
  } catch (error) {
    console.error("Erreur lors de la génération des matchs:", error);
    toast.error("Échec de la génération des matchs. Veuillez réessayer.");
  } finally {
    if (setGeneratingMatches) {
      setGeneratingMatches(false);
    }
  }
}