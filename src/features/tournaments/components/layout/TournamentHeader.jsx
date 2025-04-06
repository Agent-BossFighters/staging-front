import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@shared/ui/button";
import { Badge } from "@shared/ui/badge";
import { Edit3, PlayCircle, Trash2, Check } from "lucide-react";
import { getStatusColor, getStatusLabel } from "../../utils/tournamentStatus";
import { TYPE_LABELS } from "../../constants/uiConfigs";

/**
 * En-tête de la page de détails d'un tournoi
 */
const TournamentHeader = ({
  tournament,
  isCreator,
  canStartTournament,
  canCompleteTournament,
  onEditClick,
  onStartClick,
  onCompleteClick,
  onDeleteClick,
  startingTournament,
  deletingTournament
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <Link to="/dashboard/tournaments" className="text-yellow-400 hover:underline mb-2 inline-block">
          &larr; Back to Tournaments
        </Link>
        <h1 className="text-2xl font-bold text-white">{tournament.name}</h1>
      </div>
      <div className="flex gap-2 items-center">
        {/* Actions d'administration (visibles uniquement pour le créateur) */}
        {isCreator && (
          <div className="flex gap-2 mr-4">
            <Button
              variant="outline"
              className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/20"
              onClick={onEditClick}
            >
              <Edit3 size={16} className="mr-1" />
              Edit
            </Button>
            
            {canStartTournament && (
              <Button 
                className="bg-green-500 hover:bg-green-600 text-black"
                onClick={onStartClick}
                disabled={startingTournament}
              >
                <PlayCircle size={16} className="mr-1" />
                {startingTournament ? "Starting..." : "Start"}
              </Button>
            )}
            
            {canCompleteTournament && (
              <Button 
                className="bg-blue-500 hover:bg-blue-600 text-white"
                onClick={onCompleteClick}
              >
                <Check size={16} className="mr-1" />
                Terminer
              </Button>
            )}
            
            <Button
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-500/20"
              onClick={onDeleteClick}
              disabled={deletingTournament}
            >
              <Trash2 size={16} className="mr-1" />
              {deletingTournament ? "Deleting..." : "Delete"}
            </Button>
          </div>
        )}
        
        <Badge className={getStatusColor(tournament)}>
          {getStatusLabel(tournament)}
        </Badge>
        <Badge variant="outline" className="border-gray-600 text-gray-300">
          {TYPE_LABELS[tournament.tournament_type?.toString()] || "Unknown Type"}
        </Badge>
      </div>
    </div>
  );
};

export default TournamentHeader; 