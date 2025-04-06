/**
 * Utilitaires liés à la gestion des tournois
 */

/**
 * Vérifie si l'utilisateur est le créateur du tournoi
 * @param {Object} user - Utilisateur courant
 * @param {Object} tournament - Tournoi à vérifier
 * @returns {boolean} Vrai si l'utilisateur est le créateur du tournoi
 */
export const isCreatorOfTournament = (user, tournament) => {
  return Boolean(user && tournament && user.id === tournament.creator_id);
};

/**
 * Obtient le nom du boss d'un tournoi
 * @param {Object} tournament - Tournoi contenant les infos du boss
 * @returns {string} Nom du boss ou 'Boss' par défaut
 */
export const getBossName = (tournament) => {
  if (tournament?.boss?.name) {
    return tournament.boss.name;
  }
  return 'Boss';
}; 