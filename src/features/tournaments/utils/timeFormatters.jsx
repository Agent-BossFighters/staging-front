
/**
 * Convertit une chaîne de temps en secondes
 * @param {string} timeString - Chaîne de temps au format "MM:SS" ou "SS"
 * @returns {number} Nombre de secondes
 */
export function parseTimeToSeconds (timeString) {
  // Format attendu: "MM:SS"
  if (!timeString || typeof timeString !== 'string') return 0;
  
  // Support pour différents formats d'entrée
  let parts;
  
  // Format avec deux-points (MM:SS)
  if (timeString.includes(':')) {
    parts = timeString.split(':');
    if (parts.length !== 2) return 0;
  } 
  // Format avec juste des chiffres (traité comme des secondes)
  else if (/^\d+$/.test(timeString)) {
    return parseInt(timeString, 10);
  } 
  // Format invalide
  else {
    return 0;
  }
  
  const minutes = parseInt(parts[0], 10) || 0;
  const seconds = parseInt(parts[1], 10) || 0;
  
  return (minutes * 60) + seconds;
};

/**
 * Formate un nombre de secondes ou de points selon le type demandé
 * @param {number} points - Nombre de secondes ou points à formater
 * @param {string} type - Type de formatage ("time" ou "score")
 * @returns {string} - Valeur formatée
 */
export function formatTimeOrScore(points, type = "score") {
  if (type === "time" && points) {
    // Convertir les points en format minutes:secondes pour le Survival
    const minutes = Math.floor(points / 60);
    const seconds = points % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  } else {
    // Pour le Score Counter, afficher simplement le nombre
    return points || '0';
  }
};