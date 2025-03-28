/**
 * Formate un nombre avec séparateurs de milliers
 * @param {number|string} value - Le nombre à formater
 * @param {number} decimals - Le nombre de décimales à afficher (défaut: 0)
 * @returns {string} Le nombre formaté avec des séparateurs de milliers
 */
export const formatNumber = (value, decimals = 0) => {
  if (value === undefined || value === null) return '';
  
  // Si la valeur est déjà une chaîne, tenter de la convertir en nombre
  if (typeof value === 'string') {
    // Enlever les symboles $ et % s'ils existent
    const cleanValue = value.replace(/[$%,]/g, '');
    // Convertir en nombre si possible
    const numValue = parseFloat(cleanValue);
    if (isNaN(numValue)) return value; // Si impossible à convertir, retourner tel quel
    value = numValue;
  }

  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

/**
 * Formate un prix avec symbole $ et séparateurs de milliers
 * @param {number|string} value - Le prix à formater
 * @param {number} decimals - Le nombre de décimales à afficher (défaut: 2)
 * @returns {string} Le prix formaté avec $ et séparateurs de milliers
 */
export const formatPrice = (value, decimals = 2) => {
  if (value === undefined || value === null) return '';
  
  // Si la valeur est déjà une chaîne et commence par $, extraire la valeur numérique
  if (typeof value === 'string') {
    if (value.startsWith('$')) {
      const numericValue = parseFloat(value.substring(1).replace(/,/g, ''));
      if (!isNaN(numericValue)) {
        value = numericValue;
      } else {
        return value; // Si impossible à convertir, retourner tel quel
      }
    } else {
      const numericValue = parseFloat(value.replace(/,/g, ''));
      if (!isNaN(numericValue)) {
        value = numericValue;
      } else {
        return value; // Si impossible à convertir, retourner tel quel
      }
    }
  }

  return `$${value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })}`;
};

/**
 * Formate un pourcentage avec symbole % et séparateurs de milliers
 * @param {number|string} value - Le pourcentage à formater
 * @param {number} decimals - Le nombre de décimales à afficher (défaut: 1)
 * @returns {string} Le pourcentage formaté avec % et séparateurs de milliers
 */
export const formatPercent = (value, decimals = 1) => {
  if (value === undefined || value === null) return '';
  
  // Si la valeur est déjà une chaîne et se termine par %, extraire la valeur numérique
  if (typeof value === 'string') {
    if (value.endsWith('%')) {
      const numericValue = parseFloat(value.substring(0, value.length - 1).replace(/,/g, ''));
      if (!isNaN(numericValue)) {
        value = numericValue;
      } else {
        return value; // Si impossible à convertir, retourner tel quel
      }
    } else {
      const numericValue = parseFloat(value.replace(/,/g, ''));
      if (!isNaN(numericValue)) {
        value = numericValue;
      } else {
        return value; // Si impossible à convertir, retourner tel quel
      }
    }
  }

  return `${value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })}%`;
}; 