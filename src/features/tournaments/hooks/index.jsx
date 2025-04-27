/**
 * Point d'entrée pour tous les hooks liés aux tournois.
 * Facilite l'importation en permettant d'importer depuis le dossier hooks directement.
 */

// Hooks pour l'accès aux données
export { useTournamentsList } from './useTournamentsList';
export { useTournament } from './useTournament';
export { useTournamentTeams } from './useTournamentTeams';
export { useTournamentMatches } from './useTournamentMatches';
export { useMatch } from './useMatch';
export { useMyTournaments } from './useMyTournaments';
export { useJoinTournament } from './useJoinTournament';
export { useTournamentTeamsData } from './useTournamentTeamsData';
export { useTeamSelection } from './useTeamSelection';

// Hooks pour les contrôles de tournoi
export { default as useTournamentControls } from './useTournamentControls';

// Réexporter automatiquement tout hook supplémentaire ajouté ultérieurement
// au format useXXXX.jsx dans ce dossier 

// Pour compatibilité avec les imports existants
export * from './useTournaments'; 