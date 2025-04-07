import React from 'react';
import { InfoIcon } from 'lucide-react';

const TournamentRules = ({ type = 'arena' }) => {
  const isArena = type === '2' || type === 'arena' || parseInt(type) === 2;

  return (
    <div className="tournament-rules">
      <h2 className="text-xl font-bold text-yellow-400 mb-6">
        Règles du tournoi {isArena ? 'Arena' : 'Survival'}
      </h2>

      <div className="mb-6 bg-gray-900 border border-yellow-400 p-4 rounded-md">
        <div className="flex items-center">
          <InfoIcon className="h-5 w-5 text-yellow-400 mr-2" />
          <div className="text-yellow-400 font-bold">Informations générales</div>
        </div>
        <div className="text-gray-300 mt-2">
          Les tournois sont réservés aux équipes inscrites. Le créateur du tournoi définit le nombre maximum de joueurs par équipe.
        </div>
      </div>

      {isArena ? (
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Format Arena</h3>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-gray-900 p-5 rounded-md">
              <h4 className="text-yellow-400 font-bold mb-2">Structure</h4>
              <ul className="list-disc pl-5 text-gray-300 space-y-2">
                <li>Tournoi à élimination directe</li>
                <li>Les équipes s'affrontent en matchs simples</li>
                <li>Les gagnants avancent au tour suivant</li>
                <li>Le dernier joueur restant est déclaré vainqueur</li>
              </ul>
            </div>
            
            <div className="bg-gray-900 p-5 rounded-md">
              <h4 className="text-yellow-400 font-bold mb-2">Déroulement des matchs</h4>
              <ul className="list-disc pl-5 text-gray-300 space-y-2">
                <li>Chaque match est joué en une seule manche</li>
                <li>Les affrontements sont déterminés par tirage au sort</li>
                <li>En cas d'égalité, une prolongation est jouée</li>
                <li>Les scores sont enregistrés par l'administrateur du tournoi</li>
              </ul>
            </div>
            
            <div className="bg-gray-900 p-5 rounded-md">
              <h4 className="text-yellow-400 font-bold mb-2">Points et classement</h4>
              <ul className="list-disc pl-5 text-gray-300 space-y-2">
                <li>Le vainqueur d'un match avance au tour suivant</li>
                <li>Le perdant est éliminé du tournoi</li>
                <li>Le classement final est basé sur le niveau atteint dans l'arbre du tournoi</li>
              </ul>
            </div>
            
            <div className="bg-gray-900 p-5 rounded-md">
              <h4 className="text-yellow-400 font-bold mb-2">Particularités</h4>
              <ul className="list-disc pl-5 text-gray-300 space-y-2">
                <li>Si le nombre d'équipes n'est pas une puissance de 2, certaines équipes peuvent recevoir un "bye" au premier tour</li>
                <li>Les matchs doivent être joués dans les délais fixés par l'administrateur</li>
                <li>Les résultats sont définitifs une fois validés</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Format Survival</h3>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-gray-900 p-5 rounded-md">
              <h4 className="text-yellow-400 font-bold mb-2">Structure</h4>
              <ul className="list-disc pl-5 text-gray-300 space-y-2">
                <li>Tournoi sous forme de championnat</li>
                <li>Toutes les équipes participent à plusieurs matchs</li>
                <li>Des points sont attribués après chaque match</li>
                <li>Le classement final est basé sur le total des points accumulés</li>
              </ul>
            </div>
            
            <div className="bg-gray-900 p-5 rounded-md">
              <h4 className="text-yellow-400 font-bold mb-2">Déroulement des matchs</h4>
              <ul className="list-disc pl-5 text-gray-300 space-y-2">
                <li>Les équipes jouent plusieurs rounds contre différents adversaires</li>
                <li>Le nombre de rounds est déterminé par l'administrateur du tournoi</li>
                <li>Les affrontements peuvent être aléatoires ou selon un planning prédéfini</li>
                <li>Chaque performance est notée et compte pour le classement général</li>
              </ul>
            </div>
            
            <div className="bg-gray-900 p-5 rounded-md">
              <h4 className="text-yellow-400 font-bold mb-2">Points et classement</h4>
              <ul className="list-disc pl-5 text-gray-300 space-y-2">
                <li>Les points sont attribués en fonction des performances dans chaque match</li>
                <li>Aucune équipe n'est éliminée avant la fin du tournoi</li>
                <li>Le classement est mis à jour après chaque round</li>
                <li>L'équipe avec le plus de points à la fin gagne le tournoi</li>
              </ul>
            </div>
            
            <div className="bg-gray-900 p-5 rounded-md">
              <h4 className="text-yellow-400 font-bold mb-2">Particularités</h4>
              <ul className="list-disc pl-5 text-gray-300 space-y-2">
                <li>En cas d'égalité de points, des critères de départage sont appliqués</li>
                <li>Le nombre de rounds peut varier selon le nombre d'équipes participantes</li>
                <li>Des bonus peuvent être attribués pour des performances exceptionnelles</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TournamentRules; 