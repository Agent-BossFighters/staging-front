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
      className={`bg-[#737578] w-full py-3 lg:py-5 px-3 lg:px-3 flex flex-col md:flex-row items-center mb-3 rounded-2xl ${statusStyles.container}`}
    >
      <div className="w-full h-12 flex xs:flex-col lg:flex-row lg:items-center justify-between">
        <div className="flex w-full items-center gap-2 lg:gap-4 mb-2 lg:mb-0 min-w-0">
          <div className={`${statusStyles.icon} rounded-full p-1 lg:p-2 flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 shrink-0`}
          >
            <div className="w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center">
              {icon}
            </div>
          </div>
          <div className="flex flex-col min-w-0">
            <span
              className="text-white text-base lg:text-lg font-semibold truncate block max-w-full"
              style={{ maxWidth: "100%" }}
              title={title} // Infobulle au survol
            >
              {title}
            </span>
            {description && (
              <span className="text-white/70 text-xs lg:text-sm mt-1 truncate block max-w-full" style={{ maxWidth: "100%" }} title={description}>{description}</span>
            )}
          </div>
        </div>
        <div className="flex items-center ml-8 gap-2 w-full lg:w-auto justify-between lg:justify-end">
          <span
            className={`${statusStyles.badge} flex py-1 lg:py-2 text-lg h-full min-w-[120px] justify-center items-center text-center font-semibold px-2 lg:px-4 rounded-2xl mr-2 lg:mr-4 ${
              !isFinished ? "hover:scale-105 duration-200" : ""
            }`}
          >
            {isFinished ? "CLAIMED" : progress ? progress : "CLAIM"}
          </span>
          <span className="text-primary text-black text:sm xl:text-xl min-w-[60px] lg:min-w-[85px] font-medium">
            +{xp} XP
          </span>
        </div>
      </div>
      
    </div>
  );
};

export default Quest;
