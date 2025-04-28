import React from "react";

/**
 * Composant Quest générique pour afficher une quête
 * @param {Object} props - Les propriétés du composant
 * @param {React.ReactNode} props.icon - L'icône de la quête
 * @param {string} props.status - Le statut de la quête ('FINISHED' pour complétée, 'LOCKED' pour verrouillée)
 * @param {string} props.progress - L'état d'avancement (ex: '2/5')
 * @param {number} props.xp - Les points d'expérience gagnés
 * @param {string} props.title - Le titre de la quête
 * @param {React.ReactNode} props.description - La description de la quête avec liens
 * @returns {React.ReactElement} Le composant Quest
 */
const Quest = ({ icon, status, progress, xp, title, description }) => {
  // Déterminer si la quête est terminée, verrouillée, en cours ou à faire
  const isFinished = status === "FINISHED";
  const isLocked = status === "LOCKED";

  // Styles en fonction du statut
  const statusStyles = {
    badge: isFinished
      ? "bg-white text-black bg-opacity-50"
      : isLocked
        ? "bg-white text-black bg-opacity-50"
        : "bg-primary text-black",
    icon: isFinished
      ? "bg-none text-white"
      : isLocked
        ? "bg-none text-white/50"
        : "bg-none text-white",
    container: isFinished
      ? "bg-[rgba(231,230,251,0.2)] border-2 border-solid border-[rgba(231,230,251,0.3)] shadow-[4px_4px_4px_2px_rgba(0,0,0,0.4)]"
      : isLocked
        ? "bg-[rgba(231,230,200,0.1)] border-2 border-solid border-[rgba(231,230,200,0.2)] shadow-[4px_4px_4px_2px_rgba(0,0,0,0.4)]"
        : "bg-[rgba(231,230,251,0.2)] border-2 border-solid border-[rgba(231,230,251,0.3)] shadow-[4px_4px_4px_2px_rgba(0,0,0,0.4)]",
  };

  return (
    <div
      className={`bg-[#737578] py-5 px-6 flex items-center justify-between mb-3 rounded-2xl ${statusStyles.container}`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`${statusStyles.icon} rounded-full p-2 flex items-center justify-center w-12 h-12`}
        >
          <div className="w-10 h-10 flex items-center justify-center">
            {icon}
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-white text-xl font-semibold">{title}</span>
          {description && (
            <span className="text-white/70 text-sm mt-1">{description}</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`${statusStyles.badge} py-2 text-xl min-w-[120px] text-center font-semibold px-4 rounded-2xl mr-4`}
        >
          {isFinished ? "CLAIMED" : progress ? progress : "CLAIM"}
        </span>
        <span className="text-primary text-xl min-w-[85px] font-medium">
          +{xp} XP
        </span>
      </div>
    </div>
  );
};

export default Quest;
