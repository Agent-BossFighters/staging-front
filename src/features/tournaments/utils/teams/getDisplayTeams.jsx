/**
 * Génère les équipes à afficher dans l'interface de jointure d'un tournoi
 * en combinant les équipes existantes et vides
 * @param {Array} teams - Équipes existantes du tournoi
 * @param {Object} tournament - Données du tournoi
 * @returns {Array} - Liste des équipes à afficher
 */
export function getDisplayTeams(teams, tournament) {
  // Si aucune équipe n'est disponible, créer des placeholders
  if (!teams || teams.length === 0) {
    const maxTeams = tournament.max_teams || 8;
    
    return Array.from({ length: maxTeams }, (_, i) => {
      const letter = String.fromCharCode(65 + i);
      return {
        id: `empty-${i}`,
        name: `Team ${letter}`,
        isEmpty: true,
        team_index: i, // S'assurer que l'index est défini correctement
        letter: letter
      };
    });
  }
  
  // Trier les équipes par ID de base de données (ordre croissant)
  // Cela garantit que l'équipe avec l'ID le plus petit est à l'index 0, etc.
  const sortedTeams = [...teams].sort((a, b) => {
    const idA = parseInt(a.id, 10);
    const idB = parseInt(b.id, 10);
    if (!isNaN(idA) && !isNaN(idB)) {
      return idA - idB;
    }
    return 0;
  });
  
  // Assigner les équipes réelles aux positions dans l'ordre croissant de leur ID
  const maxTeams = tournament.max_teams || 8;
  const result = [];
  
  // Placer d'abord les équipes réelles triées par ID
  sortedTeams.forEach((team, index) => {
    if (index < maxTeams) {
      const letter = String.fromCharCode(65 + index);
      result.push({
        ...team,
        team_index: index,  // Assigner l'index en fonction de la position (0, 1, 2, ...)
        letter: letter      // La lettre est basée sur l'index (A, B, C, ...)
      });
    }
  });
  
  // Ajouter des placeholders si nécessaire pour compléter jusqu'à maxTeams
  if (result.length < maxTeams) {
    for (let i = result.length; i < maxTeams; i++) {
      const letter = String.fromCharCode(65 + i);
      result.push({
        id: `empty-${i}`,
        name: `Team ${letter}`,
        isEmpty: true,
        team_index: i,
        letter: letter
      });
    }
  }
  
  return result;
} 