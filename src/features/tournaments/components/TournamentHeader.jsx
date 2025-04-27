import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@shared/ui/button";
import {
  UserPlus,
  Shuffle,
  Play,
  CheckCircle,
  Edit,
  Trash2,
  X,
  ArrowLeft
} from "lucide-react";
import toast from "react-hot-toast";
import { formatRemainingSlots, calculatePlayerSlots, getBossName } from "../utils/tournamentUtils";
import { rulesBubble } from "@img";
import { WINNER_ICON } from "../constants/uiConfigs";

const TournamentHeader = ({
  tournament,
  isCreator,
  canJoinThisTournament,
  user,
  onJoinClick,
  onJoinRandomTeam,
  startingTournament,
  canStartTournament,
  startTournament,
  canCompleteTournament,
  completeTournament,
  handleEditTournament,
  deletingTournament,
  deleteTournament,
  cancelingTournament,
  cancelTournament,
  teams,
  onBackToList
}) => {
  const navigate = useNavigate();
  const [showEntryCode, setShowEntryCode] = useState(false);
  const [revealCode, setRevealCode] = useState(false);
  const [entryCodeCopied, setEntryCodeCopied] = useState(false);

  const handleCopyEntryCode = () => {
    if (!tournament?.entry_code) return;
    
    navigator.clipboard.writeText(tournament.entry_code)
      .then(() => {
        setEntryCodeCopied(true);
        toast.success("Entry code copied to clipboard!");
        setTimeout(() => setEntryCodeCopied(false), 2000);
      })
      .catch(err => {
        console.error('Error copying entry code:', err);
        toast.error("Failed to copy entry code");
      });
  };

  if (!tournament) {
    return <div>No tournament data available</div>;
  }

  // Déterminer le type et le mode du tournoi
  const getTournamentType = () => {
    return tournament.tournament_type === "showtime_survival" || tournament.tournament_type === "showtime_score" 
      ? "Showtime"
      : "Arena";
  }

  const getTournamentMode = () => {
    return tournament.tournament_type === "showtime_survival" 
      ? "Survival" 
      : tournament.tournament_type === "showtime_score" 
        ? "Score Counter" 
        : "Team VS Team";
  }

  // Calculer les slots restants
  const slots = calculatePlayerSlots(tournament);
  const remainingSlots = formatRemainingSlots(tournament, teams);

  return (
    <div className="mb-6">
      {/* Title and Back button */}
      <div className="flex justify-between items-center">
        {/* Bloc titre + code */}
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-primary ">
            {tournament.name}
          </h1>
          {isCreator && tournament.entry_code && (
            <div className="flex items-center gap-2 mb-1">
              <Button 
                variant="default" 
                onClick={() => setShowEntryCode(!showEntryCode)}
              >
                {showEntryCode ? "HIDE" : "SHOW ENTRY CODE"}
              </Button>
              {showEntryCode && (
                <div className="flex items-center gap-2 bg-gray-700 rounded pl-1">
                  <span className="font-mono text-white">
                    {revealCode ? tournament.entry_code : "•".repeat(tournament.entry_code.length)}
                  </span>
                  <Button
                    variant="ghost"
                    className="text-xs h-auto px-1"
                    onClick={() => setRevealCode(!revealCode)}
                  >
                    {revealCode ? "HIDE" : "REVEAL"}
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-xs h-auto px-1"
                    onClick={handleCopyEntryCode}
                  >
                    {entryCodeCopied ? "COPIED!" : "COPY"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bloc bouton back */}
        <Button
          onClick={onBackToList}
          variant="default"
          className="mb-1"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          BACK TO LIST
        </Button>
      </div>

      {/* Tournament Info Banner */}
      <div className="bg-gray-800 px-6 py-4 rounded">
        <div className="grid grid-cols-12 gap-4">
          {/* Left section - Tournament Info */}
          <div className="col-span-4">
            {/* First row */}
            <div className="grid grid-cols-4 mb-4">
              <div>
                <span className="text-gray-400 block mb-1 uppercase text-sm">Type</span>
                <span className="text-white">
                  {getTournamentType()}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block mb-1 uppercase text-sm">Mode</span>
                <span className="text-white">
                  {getTournamentMode()}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block mb-1 uppercase text-sm">Boss</span>
                <span className="text-primary">
                  {tournament.creator?.username}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block mb-1 uppercase text-sm">Round(s)</span>
                <span className="text-white">
                  {tournament.rounds}
                </span>
              </div>
            </div>
            {/* Second row */}
            <div className="grid grid-cols-4">
              <div>
                <span className="text-gray-400 block mb-1 uppercase text-sm">Entry <br /> Code</span>
                <span className="text-white">
                  {tournament.entry_code ? "Yes" : "No"}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block mb-1 uppercase text-sm">Agent Lvl <br /> Required</span>
                <span className="text-white">
                  {tournament.agent_level_required}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block mb-1 uppercase text-sm">Estimated <br /> Time</span>
                <span className="text-primary">
                  {(() => {
                    const totalMinutes = (tournament.rounds) * (tournament.max_teams) * 10;
                    const hours = Math.floor(totalMinutes / 60);
                    const minutes = totalMinutes % 60;
                    if (hours > 0) {
                      return `${hours}h${minutes > 0 ? ` ${minutes}min` : ""}`;
                    }
                    return `${totalMinutes}min`;
                  })()}
                </span>
              </div>
            </div>
          </div>


          {/* Center section - Rules */}
          <div className="col-span-5">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <img src={rulesBubble} alt="rules" className="w-12 h-12" />
              </div>
              <div className="flex-grow">
                <span className="text-gray-400 block mb-1 uppercase text-sm">Rules</span>
                <span className="text-white block">
                  {tournament.rules}
                </span>
              </div>
            </div>
          </div>

          <div className="col-span-1"></div>

          {/* Right section - Actions */}
          <div className="col-span-2">
            <div className="flex flex-col gap-3">
              {/* Join buttons for regular users */}
              {user && canJoinThisTournament && !remainingSlots.startsWith('0') && (
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={onJoinClick}
                    className="bg-primary hover:bg-primary/90 text-black w-full"
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    JOIN TOURNAMENT
                  </Button>
                  <Button
                    onClick={onJoinRandomTeam}
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                  >
                    <Shuffle className="mr-2 h-4 w-4" />
                    JOIN RANDOM TEAM
                  </Button>
                </div>
              )}

              {/* Admin buttons for creator */}
              {isCreator && tournament.status !== "completed" && tournament.status !== "cancelled" && (
                <>
                  <div className="flex gap-2">
                    {canStartTournament && (tournament.status === "draft" || tournament.status === "open") && (
                      <Button
                        onClick={startTournament}
                        className="bg-green-600 hover:bg-green-700 text-white flex-1"
                        disabled={startingTournament}
                      >
                        <Play className="mr-2 h-4 w-4" />
                        {startingTournament ? "STARTING..." : "START TOURNAMENT"}
                      </Button>
                    )}

                    {canCompleteTournament && tournament.status === "in_progress" && (
                      <Button
                        onClick={completeTournament}
                        className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        END TOURNAMENT
                      </Button>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {(tournament.status === "draft" || tournament.status === "open") && (
                      <>
                        <Button
                          onClick={handleEditTournament}
                          className="bg-amber-600 hover:bg-amber-700 text-white flex-1"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          EDIT
                        </Button>

                        <Button
                          onClick={deleteTournament}
                          className="bg-red-600 hover:bg-red-700 text-white flex-1"
                          disabled={deletingTournament}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {deletingTournament ? "DELETING..." : "DELETE"}
                        </Button>
                      </>
                    )}

                    {tournament.status === "in_progress" && (
                      <Button
                        onClick={cancelTournament}
                        className="bg-red-600 hover:bg-red-700 text-white flex-1"
                        disabled={cancelingTournament}
                      >
                        {cancelingTournament ? "CANCELING..." : "CANCEL"}
                      </Button>
                    )}
                  </div>
                </>
              )}

              {/* Affichage du statut CANCELLED */}
              {tournament.status === "cancelled" && (
                <div className="flex items-center justify-center bg-red-600/20 text-red-500 font-bold py-3 rounded">
                  CANCELLED
                </div>
              )}

              {/* Affichage de l'équipe gagnante */}
              {tournament.status === "completed" && teams?.length > 0 && (
                <div className="flex items-center justify-center bg-yellow-600/20 text-yellow-500 font-bold py-3 rounded gap-2">
                  <span>{WINNER_ICON}</span>
                  <span>WINNER: {teams[0].name}</span>
                </div>
              )}

              {/* Tournament stats */}
              <div className="flex justify-between text-sm text-gray-400">
                <div>REMAINING <br /> SLOTS : {remainingSlots}</div>
                <div>PLAYER(S) <br /> PER TEAM : {tournament.players_per_team}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentHeader; 