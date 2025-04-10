/**
 * Utilitaires pour la gestion des statuts de tournoi
 */
import { STATUS_COLORS, STATUS_LABELS, TYPE_LABELS } from "../constants/uiConfigs";

/**
 * Vérifie si un tournoi est complété
 * @param {Object} tournament - Tournoi à vérifier
 * @returns {boolean} Vrai si le tournoi est complété
 */
export const isTournamentCompleted = (tournament) => {
  if (!tournament) return false;
  return tournament.status === "completed" || tournament.status === 3;
};

/**
 * Vérifie si un tournoi est en cours
 * @param {Object} tournament - Tournoi à vérifier
 * @returns {boolean} Vrai si le tournoi est en cours
 */
export const isTournamentInProgress = (tournament) => {
  if (!tournament) return false;
  return tournament.status === "in_progress" || tournament.status === 2;
};

/**
 * Vérifie si un tournoi est en brouillon
 * @param {Object} tournament - Tournoi à vérifier
 * @returns {boolean} Vrai si le tournoi est en brouillon
 */
export const isTournamentDraft = (tournament) => {
  if (!tournament) return false;
  return tournament.status === "draft" || tournament.status === 0;
};

/**
 * Vérifie si un tournoi est ouvert aux inscriptions
 * @param {Object} tournament - Tournoi à vérifier
 * @returns {boolean} Vrai si le tournoi est ouvert
 */
export const isTournamentOpen = (tournament) => {
  if (!tournament) return false;
  return tournament.status === "open" || tournament.status === 1;
};

/**
 * Vérifie si un tournoi est en attente
 * @param {Object} tournament - Tournoi à vérifier
 * @returns {boolean} Vrai si le tournoi est en attente
 */
export const isTournamentPending = (tournament) => {
  if (!tournament) return false;
  return tournament.status === "pending";
};

/**
 * Détermine si un tournoi est de type Survival
 * @param {Object} tournament - Tournoi à vérifier
 * @returns {boolean} Vrai si le tournoi est de type Survival
 */
export const isShowtimeSurvival = (tournament) => {
  if (!tournament) return false;
  const tournamentType = parseInt(tournament?.tournament_type);
  return tournamentType === 0 || tournament?.tournament_type === 'showtime_survival';
};

/**
 * Détermine si un tournoi est de type Score Counter
 * @param {Object} tournament - Tournoi à vérifier
 * @returns {boolean} Vrai si le tournoi est de type Score Counter
 */
export const isShowtimeScore = (tournament) => {
  if (!tournament) return false;
  const tournamentType = parseInt(tournament?.tournament_type);
  return tournamentType === 1 || tournament?.tournament_type === 'showtime_score';
};

/**
 * Détermine si un tournoi est de type Arena
 * @param {Object} tournament - Tournoi à vérifier
 * @returns {boolean} Vrai si le tournoi est de type Arena
 */
export const isArena = (tournament) => {
  if (!tournament) return false;
  const tournamentType = parseInt(tournament?.tournament_type);
  return tournamentType === 2 || tournament?.tournament_type === 'arena';
};

/**
 * Vérifie si l'inscription à un tournoi est ouverte en fonction des dates
 * @param {Object} tournament - Tournoi à vérifier
 * @returns {boolean} Vrai si l'inscription est ouverte
 */
export const isRegistrationOpen = (tournament) => {
  if (!tournament) return false;
  const now = new Date();
  const startTime = tournament.scheduled_start_time ? new Date(tournament.scheduled_start_time) : null;
  
  // Le tournoi est ouvert à l'inscription si:
  // 1. Il n'a pas de date de début définie, OU
  // 2. La date de début est dans le futur
  return !startTime || now < startTime;
};

/**
 * Vérifie si un tournoi est actuellement actif en fonction des dates
 * @param {Object} tournament - Tournoi à vérifier
 * @returns {boolean} Vrai si le tournoi est actif
 */
export const isTournamentActive = (tournament) => {
  if (!tournament) return false;
  const now = new Date();
  const startTime = tournament.scheduled_start_time ? new Date(tournament.scheduled_start_time) : null;
  const endTime = tournament.scheduled_end_time ? new Date(tournament.scheduled_end_time) : null;
  
  // Le tournoi est en cours si:
  // 1. La date actuelle est après la date de début ET
  // 2. La date actuelle est avant la date de fin OU il n'y a pas de date de fin
  return startTime && now >= startTime && (!endTime || now < endTime);
};

/**
 * Vérifie si un tournoi est terminé en fonction des dates
 * @param {Object} tournament - Tournoi à vérifier
 * @returns {boolean} Vrai si le tournoi est terminé
 */
export const isTournamentEnded = (tournament) => {
  if (!tournament) return false;
  const now = new Date();
  const endTime = tournament.scheduled_end_time ? new Date(tournament.scheduled_end_time) : null;
  
  // Le tournoi est terminé si:
  // La date actuelle est après la date de fin
  return endTime && now >= endTime;
};

/**
 * Génère un message d'état basé sur les dates du tournoi
 * @param {Object} tournament - Tournoi à vérifier
 * @returns {string} Message d'état
 */
export const getTournamentTimeStatus = (tournament) => {
  if (!tournament) return "";
  if (isTournamentEnded(tournament)) {
    return "This tournament has ended.";
  } else if (isTournamentActive(tournament)) {
    return "This tournament is currently active.";
  } else if (tournament.scheduled_start_time) {
    const startTime = new Date(tournament.scheduled_start_time);
    return `Registration open until ${startTime.toLocaleString()}`;
  }
  return "";
};

/**
 * Obtient le libellé du statut d'un tournoi
 * @param {Object} tournament - Tournoi à obtenir le statut
 * @returns {string} Libellé du statut
 */
export const getStatusLabel = (tournament) => {
  if (!tournament) return "UNKNOWN";
  return STATUS_LABELS[tournament.status] || "UNKNOWN";
};

/**
 * Obtient la classe CSS pour la couleur du statut d'un tournoi
 * @param {Object} tournament - Tournoi à obtenir la couleur
 * @returns {string} Classe CSS pour la couleur
 */
export const getStatusColor = (tournament) => {
  if (!tournament) return "bg-gray-500";
  return STATUS_COLORS[tournament.status] || "bg-gray-500";
};

/**
 * Détermine si un utilisateur peut rejoindre un tournoi
 * @param {Object} tournament - Tournoi à vérifier
 * @param {Object} userTeam - Équipe de l'utilisateur
 * @param {boolean} isTeamsFull - Si le tournoi est complet
 * @param {boolean} isCreator - Si l'utilisateur est le créateur
 * @returns {boolean} Vrai si l'utilisateur peut rejoindre le tournoi
 */
export const canJoinTournament = (tournament, userTeam, isTeamsFull, isCreator) => {
  if (!tournament) return false;
  return isTournamentOpen(tournament) && 
         isRegistrationOpen(tournament) &&
         !userTeam && 
         !isTeamsFull &&
         !isCreator;
};

/**
 * Détermine si un utilisateur peut démarrer un tournoi
 * @param {Object} tournament - Tournoi à vérifier
 * @param {boolean} isCreator - Si l'utilisateur est le créateur
 * @returns {boolean} Vrai si l'utilisateur peut démarrer le tournoi
 */
export const canStartTournament = (tournament, isCreator) => {
  if (!tournament) return false;
  return isCreator && (
    isTournamentPending(tournament) || 
    isTournamentOpen(tournament) || 
    isTournamentDraft(tournament)
  );
};

/**
 * Détermine si un utilisateur peut terminer un tournoi
 * @param {Object} tournament - Tournoi à vérifier
 * @param {boolean} isCreator - Si l'utilisateur est le créateur
 * @returns {boolean} Vrai si l'utilisateur peut terminer le tournoi
 */
export const canCompleteTournament = (tournament, isCreator) => {
  if (!tournament) return false;
  return isCreator && isTournamentInProgress(tournament);
}; 