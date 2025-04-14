/**
 * Retourne les slots disponibles pour une équipe donnée
 * @param {Object} team - L'équipe pour laquelle vérifier les slots disponibles
 * @param {Object} tournament - Le tournoi auquel appartient l'équipe
 * @returns {Array<number>} - Liste des numéros de slots disponibles
 */
export function getAvailableSlots(team, tournament) {
  if (!team) return [];
  
  const playersPerTeam = tournament.players_per_team || 4;
  const existingPlayers = team.players || team.team_members || [];
  
  // Créer un ensemble des slots déjà occupés
  const occupiedSlots = new Set();
  existingPlayers.forEach(player => {
    if (player.slot_number) {
      occupiedSlots.add(player.slot_number);
    }
  });
  
  // Générer tous les slots disponibles
  const availableSlots = [];
  for (let i = 1; i <= playersPerTeam; i++) {
    if (!occupiedSlots.has(i)) {
      availableSlots.push(i);
    }
  }
  
  return availableSlots;
} 