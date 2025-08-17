/**
 * Constantes UI et fonctions d'aide pour l'interface des tournois
 */

/**
 * Couleurs utilisées pour les équipes
 */
export const TEAM_COLORS = [
  '#C0392B', // rouge
  '#2980B9', // bleu
  '#27AE60', // vert
  '#9A85FF', // violet
  '#DD6B20', // orange
  '#D53F8C'  // rose
];

/**
 * Icône utilisée pour indiquer le gagnant
 */
export const WINNER_ICON = '👑';

/**
 * Correspondance des couleurs pour les différents statuts de tournoi
 */
export const STATUS_COLORS = {
  draft: "bg-gray-500/70 font-bold text-[#F1F1F1]",
  open: "bg-primary font-bold text-[#000000]",
  pending: "bg-primary/70 font-bold text-[#000000]",
  in_progress: "bg-blue-500/70 font-bold text-[#F1F1F1]",
  completed: "bg-green-500/70 font-bold text-[#F1F1F1]",
  cancelled: "bg-red-500/70 font-bold text-[#F1F1F1]",
  0: "bg-gray-500 text-[#F1F1F1]", // draft
  1: "bg-primary70 text-[#F1F1F1]", // open
  2: "bg-blue-500 text-[#F1F1F1]", // in_progress
  3: "bg-green-500 text-[#F1F1F1]", // completed
  4: "bg-red-500 text-[#F1F1F1]", // cancelled
};

/**
 * Libellés pour les différents statuts de tournoi
 */
export const STATUS_LABELS = {
  0: "DRAFT",
  1: "OPEN",
  2: "IN PROGRESS",
  3: "COMPLETED",
  4: "CANCELLED",
  draft: "DRAFT",
  open: "OPEN",
  pending: "PENDING",
  in_progress: "IN PROGRESS",
  completed: "COMPLETED",
  cancelled: "CANCELLED",
};

/**
 * Libellés pour les différents types de tournoi
 */
export const TYPE_LABELS = {
  "0": "Showtime (Survival)",
  "1": "Showtime (Score Counter)",
  "2": "Arena",
  "showtime_survival": "Showtime (Survival)",
  "showtime_score": "Showtime (Score Counter)",
  "arena": "Arena"
};

/**
 * Classes CSS pour les différents éléments d'interface
 */
export const UI_CLASSES = {
  buttons: {
    primary: 'bg-yellow-500 hover:bg-yellow-600 text-black',
    success: 'bg-green-500 hover:bg-green-600 text-white',
    info: 'bg-blue-600 hover:bg-blue-700 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    outline: 'bg-transparent border border-gray-300 hover:bg-gray-100 text-gray-800'
  },
  containers: {
    card: 'bg-gray-800 rounded-md overflow-hidden',
    cardHeader: 'bg-gray-700 px-3 py-2 flex justify-between items-center',
    cardBody: 'p-4'
  }
};

/**
 * Classes CSS pour les différents statuts de match
 */
export const STATUS_CLASSES = {
  completed: 'bg-green-600',
  in_progress: 'bg-blue-600',
  scheduled: 'bg-yellow-600',
  pending: 'bg-gray-600'
};

/**
 * Renvoie la couleur d'équipe en fonction de l'index
 * @param {number} index - Index de l'équipe
 * @returns {string} Classe CSS pour la couleur d'équipe
 */
export const getTeamColor = (index) => {
  return TEAM_COLORS[index % TEAM_COLORS.length];
}; 