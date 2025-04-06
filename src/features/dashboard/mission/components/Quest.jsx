import React from 'react';

/**
 * Composant Quest générique pour afficher une quête
 * @param {Object} props - Les propriétés du composant
 * @param {React.ReactNode} props.icon - L'icône de la quête
 * @param {string} props.status - Le statut de la quête ('FINISHED' pour complétée, 'LOCKED' pour verrouillée)
 * @param {string} props.progress - L'état d'avancement (ex: '2/5')
 * @param {number} props.xp - Les points d'expérience gagnés
 * @param {string} props.title - Le titre de la quête (optionnel)
 * @returns {React.ReactElement} Le composant Quest
 */
const Quest = ({ icon, status, progress, xp, title }) => {
  // Déterminer si la quête est terminée, verrouillée, en cours ou à faire
  const isFinished = status === 'FINISHED';
  const isLocked = status === 'LOCKED';
  
  // Styles en fonction du statut
  const statusStyles = {
    badge: isFinished 
      ? 'bg-gray-600 text-white' 
      : isLocked
        ? 'bg-red-500/50 text-white'
        : 'bg-yellow-400 text-black',
    icon: isFinished
      ? 'bg-none text-white'
      : isLocked
        ? 'bg-none text-white/50'
        : 'bg-none text-white',
    container: isFinished
      ? 'opacity-50'  // Augmenté de 40% à 70%
      : isLocked
        ? 'opacity-80'  // Augmenté de 30% à 60% 
        : 'opacity-80'  // Augmenté de 60% à 90%
  };
  
  return (
    <div className={`bg-[#737578] py-5 px-6 flex items-center justify-between mb-1 rounded-lg ${statusStyles.container}`}>
      <div className="flex items-center gap-4">
        <div className={`${statusStyles.icon} rounded-full p-2 flex items-center justify-center w-12 h-12`}>
          <div className="w-10 h-10 flex items-center justify-center">
            {icon}
          </div>
        </div>
        {/* Affiche le titre seulement s'il est fourni */}
        <span className="text-white">{title || ''}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className={`${statusStyles.badge} text-xs py-1 px-2 rounded`}>
          {isFinished 
            ? 'CLAIMED' 
            : progress 
              ? progress 
              : 'CLAIM'}
        </span>
        <span className="text-yellow-400 text-sm font-medium">+{xp} XP</span>
      </div>
    </div>
  );
};

export default Quest; 