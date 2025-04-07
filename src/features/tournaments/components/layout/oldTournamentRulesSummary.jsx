import React from 'react';
import { Button } from "@shared/ui/button";
import { Link } from 'react-router-dom';

/**
 * Affiche les règles du tournoi et les boutons d'action 
 * (rejoindre, démarrer, etc.)
 */
const TournamentRulesSummary = ({
  tournament,
  canStartTournament,
  canJoinTournament,
  userTeam,
  isTeamsFull,
  onStartClick,
  onJoinClick,
  startingTournament
}) => {
  return (
    <div className="col-span-2 bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-xl font-bold text-yellow-400 mb-4">Tournament Rules</h2>
      <div className="text-gray-300 whitespace-pre-line">
        {tournament.rules || "No rules specified."}
      </div>
      
      {/* Bouton pour démarrer le tournoi (visible uniquement pour le créateur) */}
      {canStartTournament && (
        <div className="mt-6">
          <Button 
            className="bg-green-500 hover:bg-green-600 text-black px-6 py-2"
            onClick={onStartClick}
            disabled={startingTournament}
          >
            {startingTournament ? "Starting..." : "START TOURNAMENT"}
          </Button>
          <p className="text-sm text-gray-400 mt-2">
            Cela fermera les inscriptions et démarrera le tournoi.
          </p>
        </div>
      )}
      
      {/* Bouton pour rejoindre le tournoi (si l'utilisateur peut le rejoindre) */}
      {canJoinTournament && (
        <div className="mt-6">
          <Button 
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2"
            onClick={onJoinClick}
          >
            JOIN TOURNAMENT
          </Button>
          <p className="text-sm text-gray-400 mt-2">
            Créez une équipe ou rejoignez une équipe existante.
          </p>
        </div>
      )}
      
      {/* Afficher un message si l'utilisateur a déjà une équipe */}
      {userTeam && (
        <div className="mt-6 p-4 border border-yellow-500 bg-yellow-500/10 rounded-md">
          <p className="text-yellow-400 font-medium">
            Vous avez déjà rejoint ce tournoi avec l'équipe "{userTeam.name}"
          </p>
          <Link to={`/dashboard/tournaments/${tournament.id}/teams/${userTeam.id}`} className="block mt-2">
            <Button variant="outline" className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/20">
              Gérer mon équipe
            </Button>
          </Link>
        </div>
      )}
      
      {/* Message si le tournoi est plein */}
      {isTeamsFull && !userTeam && (
        <div className="mt-6 p-4 border border-red-500 bg-red-500/10 rounded-md">
          <p className="text-red-400">
            Ce tournoi est complet. Vous ne pouvez plus y inscrire d'équipe.
          </p>
        </div>
      )}
    </div>
  );
};

export default TournamentRulesSummary; 