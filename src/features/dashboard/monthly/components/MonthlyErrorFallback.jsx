import React from 'react';

/**
 * Composant de fallback pour les erreurs lors du chargement des données mensuelles
 */
export const MonthlyErrorFallback = ({ error, onRetry, selectedDate }) => {
  // Déterminer si l'erreur est un timeout
  const isTimeout = error?.includes('timeout') || error?.includes('timed out') || error?.includes('pris trop de temps');
  
  return (
    <div className="p-4 w-full">
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold mb-2">
              Erreur de chargement des données
            </h3>
            <div className="text-base">
              {isTimeout ? (
                <>
                  Le chargement des données mensuelles a pris trop de temps. Cela peut être dû à un volume important de données pour la période sélectionnée.
                  <ul className="mt-2 ml-6 list-disc">
                    <li>Vérifiez que le serveur API est accessible</li>
                    <li>Essayez de sélectionner une période plus courte</li>
                    <li>Réessayez dans quelques instants</li>
                  </ul>
                </>
              ) : (
                error || "Une erreur s'est produite lors du chargement des données"
              )}
            </div>
          </div>
          <button 
            onClick={onRetry}
            className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Réessayer
          </button>
        </div>
      </div>
    </div>
  );
};

export default MonthlyErrorFallback;
