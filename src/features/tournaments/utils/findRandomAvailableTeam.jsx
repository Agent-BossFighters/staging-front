/**
 * Trouve une équipe aléatoire avec des places disponibles
 * @param {Array} teams - Liste des équipes
 * @param {Object} tournament - Le tournoi
 * @returns {Object|null} L'équipe sélectionnée ou null si aucune équipe disponible
 */
export const findRandomAvailableTeam = (teams, tournament) => {
  // Filtrer les équipes qui ont des places disponibles
  const availableTeams = teams.filter(team => {
    const currentPlayers = team.players?.length || 0;
    return currentPlayers < tournament.players_per_team;
  });

  // Si aucune équipe n'a de place disponible, retourner null
  if (availableTeams.length === 0) {
    return null;
  }

  // Sélectionner une équipe au hasard parmi celles disponibles
  const randomIndex = Math.floor(Math.random() * availableTeams.length);
  return availableTeams[randomIndex];
}; 