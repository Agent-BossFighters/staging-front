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

/**
 * Calcule les informations sur les slots de joueurs dans un tournoi
 * @param {Object} tournament - Tournoi contenant les informations de slots
 * @returns {Object} Objet contenant occupiedSlots, maxSlots, availableSlots et formatted
 */
export const calculatePlayerSlots = (tournament) => {
  if (!tournament) return { occupiedSlots: 0, maxSlots: 0, availableSlots: 0, formatted: '0/0' };
  
  // Dans le tournoi, les données suivantes sont pertinentes:
  // - players_per_team: nombre de joueurs par équipe
  // - max_teams: nombre maximum d'équipes
  const playersPerTeam = tournament.players_per_team || 0;
  const maxTeams = tournament.max_teams || 0;
  
  // Calcul du nombre total de slots possibles
  const maxSlots = playersPerTeam * maxTeams;
  
  // Récupérer le nombre de joueurs inscrits depuis le backend
  // Cette valeur est maintenant fournie par la méthode players_count du modèle Tournament
  const occupiedSlots = tournament.players_count || 0;
  
  // Calculer les slots disponibles
  const availableSlots = Math.max(0, maxSlots - occupiedSlots);
  
  return {
    occupiedSlots,
    maxSlots,
    availableSlots,
    formatted: `${occupiedSlots}/${maxSlots}`
  };
};

/**
 * Calcule et formate les slots restants pour l'affichage "REMAINING SLOTS"
 * @param {Object} tournament - Tournoi contenant les informations de slots
 * @param {Array} teams - Les équipes du tournoi (optionnel)
 * @returns {string} Chaîne formatée pour afficher les slots restants
 */
export const formatRemainingSlots = (tournament, teams) => {
  const slots = calculatePlayerSlots(tournament);
  
  // Si teams est fourni, on compte manuellement les joueurs inscrits
  if (teams && Array.isArray(teams)) {
    let manualOccupiedSlots = 0;
    
    // Parcourir les équipes
    teams.forEach(team => {
      // Compter les membres selon leur disponibilité
      if (team.team_members && Array.isArray(team.team_members)) {
        manualOccupiedSlots += team.team_members.length;
      } 
      else if (team.players && Array.isArray(team.players)) {
        manualOccupiedSlots += team.players.length;
      }
      // Si on ne peut pas compter les membres, vérifier si l'équipe n'est pas vide
      else if (team.is_empty === false && team.captain_id) {
        manualOccupiedSlots += 1; // Ajouter au moins le capitaine
      }
    });
    
    // Recalculer les slots disponibles
    const manualAvailableSlots = Math.max(0, slots.maxSlots - manualOccupiedSlots);
    
    return `${manualAvailableSlots}/${slots.maxSlots}`;
  }
  
  // Utiliser le calcul par défaut si teams n'est pas fourni
  return `${slots.availableSlots}/${slots.maxSlots}`;
}; 