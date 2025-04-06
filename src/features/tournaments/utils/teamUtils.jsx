/**
 * Utilitaires pour la gestion des équipes de tournoi
 */

/**
 * Recherche l'équipe de l'utilisateur courant dans une liste d'équipes
 * @param {Array} teams - Liste des équipes à examiner
 * @returns {Object|null} L'équipe de l'utilisateur ou null si non trouvée
 */
export const findUserTeam = (teams) => {
  if (!teams || !Array.isArray(teams)) return null;
  
  // Option 1: Marquage explicite is_user_team
  const explicitUserTeam = teams.find(team => team.is_user_team === true);
  if (explicitUserTeam) return explicitUserTeam;
  
  // Option 2: En vérifiant is_captain
  return teams.find(team => team.is_captain === true);
};

/**
 * Vérifie si le tournoi a atteint sa capacité maximale d'équipes
 * @param {Array} teams - Liste des équipes du tournoi
 * @param {Object} tournament - Tournoi à vérifier
 * @returns {boolean} Vrai si le tournoi est plein
 */
export const isTeamsFull = (teams, tournament) => {
  // Vérifier que tournament existe et a la propriété max_teams
  if (!tournament || typeof tournament.max_teams === 'undefined') return false;
  
  return Array.isArray(teams) && teams.length >= tournament.max_teams;
};

/**
 * Trie les équipes selon différents critères (nom, nombre de joueurs, etc.)
 * @param {Array} teams - Liste des équipes à trier
 * @param {string} sortBy - Critère de tri ('name', 'players', 'date', etc.)
 * @param {boolean} ascending - Si le tri est ascendant ou descendant
 * @returns {Array} Liste des équipes triées
 */
export const sortTeams = (teams, sortBy = 'name', ascending = true) => {
  if (!teams || !Array.isArray(teams)) return [];
  
  const sortedTeams = [...teams];
  
  const sortFunctions = {
    name: (a, b) => a.name.localeCompare(b.name),
    players: (a, b) => (a.players?.length || 0) - (b.players?.length || 0),
    date: (a, b) => new Date(a.created_at) - new Date(b.created_at)
  };
  
  const sortFunction = sortFunctions[sortBy] || sortFunctions.name;
  
  sortedTeams.sort((a, b) => {
    return ascending ? sortFunction(a, b) : -sortFunction(a, b);
  });
  
  return sortedTeams;
}; 