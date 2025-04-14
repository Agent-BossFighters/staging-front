/**
 * Vérifie si un utilisateur peut rejoindre une équipe spécifique
 * @param {Object} team - L'équipe à vérifier
 * @param {Object} tournament - Le tournoi concerné
 * @param {Array} teams - Liste de toutes les équipes du tournoi
 * @param {Array} userTeams - Équipes de l'utilisateur dans ce tournoi
 * @returns {Boolean} - True si l'utilisateur peut rejoindre l'équipe
 */
export function canJoinTeam(team, tournament, teams, userTeams) {
  // Si l'utilisateur est déjà dans une équipe du tournoi, il ne peut pas en rejoindre une autre
  if (userTeams.length > 0) {
    return false;
  }
  
  // Vérifier si c'est un placeholder ou une vraie équipe
  const isPlaceholder = team.id && String(team.id).startsWith('empty-');
  
  // Si c'est un placeholder, autoriser la jointure si la lettre correspond à une équipe réelle
  // ou s'il n'y a pas d'équipe réelle pour cette lettre
  if (isPlaceholder) {
    // Pour les tournois qui viennent d'être créés, on peut autoriser de rejoindre n'importe quelle équipe
    if (teams.length === 0) {
      return true;
    }
    
    const letter = team.letter || String.fromCharCode(65 + (team.team_index || 0));
    const realTeam = teams.find(t => 
      t.id && !String(t.id).startsWith('empty-') && 
      (t.letter === letter || t.team_index === team.team_index)
    );
    
    // Si aucune équipe réelle n'est trouvée pour cette lettre, autoriser de créer la première équipe
    if (!realTeam) {
      return true;
    }
    
    const playersPerTeam = tournament.players_per_team || 4;
    const existingPlayers = realTeam.players || realTeam.team_members || [];
    
    const canJoin = existingPlayers.length < playersPerTeam;
    return canJoin;
  }
  
  // Pour une équipe réelle, vérifier si elle a de la place
  const playersPerTeam = tournament.players_per_team || 4;
  const existingPlayers = team.players || team.team_members || [];
  
  // Vérifier si l'équipe est privée (a un code d'invitation)
  const isPrivate = team.invitation_code !== undefined && team.invitation_code !== null;
  
  // Si l'équipe est privée, l'utilisateur peut la rejoindre seulement s'il a un code
  // Cela sera vérifié plus tard lors de la validation du formulaire
  
  const canJoin = existingPlayers.length < playersPerTeam;
  return canJoin;
} 