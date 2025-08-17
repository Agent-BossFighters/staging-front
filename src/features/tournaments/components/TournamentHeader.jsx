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
  teamScores = [],
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
          className="inline-flex items-center justify-center gap-4 whitespace-nowrap rounded-md text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-transparent text-primary shadow hover:bg-transparent font-bold uppercase px-4 py-2 transition-transform duration-200 hover:scale-105"
        >
          <ArrowLeft className="!h-8 !w-8" />
          <span className="hidden md:inline">BACK TO LIST</span>
        </Button>
      </div>

      {/* Tournament Info Banner */}
      <div className="bg-gray-800 px-6 py-4 rounded">
        <div className="flex flex-wrap">
          {/* Left section - Tournament Info */}
          <div className="w-full md:w-3/6 xl:w-2/6">
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
          <div className="w-full md:w-3/6 xl:w-3/6 pr-6 my-4 md:my-0">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <img src={rulesBubble} alt="rules" className="w-8 h-8" />
              </div>
              <div className="flex-grow">
                <span className="text-gray-400 block mb-1 uppercase text-sm">Rules</span>
                <span className="text-white block">
                  {tournament.rules}
                </span>
              </div>
            </div>
          </div>

          {/* Right section - Actions */}
          <div className="flex w-full xl:w-1/6">
            <div className="flex flex-wrap xl:flex-col w-full justify-center items-center gap-4 mt-4 xl:mt-0">
              {/* Join buttons for regular users */}
              {user && canJoinThisTournament && !remainingSlots.startsWith('0') && (
                <div className="flex flex-row xl:flex-col gap-4 w-full sm:w-full">
                  <Button
                    onClick={onJoinClick}
                    className="bg-primary hover:bg-primary/90 text-black w-full"
                  >
                    <UserPlus className="h-4 w-4" />
                    JOIN
                  </Button>
                  <Button
                    onClick={onJoinRandomTeam}
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                  >
                    <Shuffle className="h-4 w-4" />
                    JOIN RANDOM
                  </Button>
                </div>
              )}

              {/* Admin buttons for creator */}
              {isCreator && tournament.status !== "completed" && tournament.status !== "cancelled" && (
                <>
                  <div className="flex flex-row xl:flex-col gap-4 w-full md:w-2/6 xl:w-full">
                    {canStartTournament && (tournament.status === "draft" || tournament.status === "open") && (
                      <Button
                        onClick={startTournament}
                        className="flex bg-green-600 hover:bg-green-700 text-white flex-1 transition-transform duration-200 hover:scale-105"
                        disabled={startingTournament}
                      >
                        <Play className="h-4 w-4" />
                        {startingTournament ? "STARTING..." : "START"}
                      </Button>
                    )}

                    {canCompleteTournament && tournament.status === "in_progress" && (
                      <Button
                        onClick={completeTournament}
                        className="bg-blue-600 hover:bg-blue-700 text-white flex-1 transition-transform duration-200 hover:scale-105"
                      >
                        <CheckCircle className="h-4 w-4" />
                        END
                      </Button>
                    )}
                  </div>

                  <div className="flex flex-row xl:flex-col gap-4 w-full md:w-3/6 xl:w-full">
                    {(tournament.status === "draft" || tournament.status === "open") && (
                      <>
                        <Button
                          onClick={handleEditTournament}
                          className="items-center justify-center bg-blue-600 hover:bg-blue-700 text-white flex-1 h-9 px-4 py-2 transition-transform duration-200 hover:scale-105"
                        >
                          <Edit className="h-6 w-6" />
                          EDIT
                        </Button>

                        <Button
                          onClick={deleteTournament}
                          className="bg-red-600 hover:bg-red-700 text-white flex-1 transition-transform duration-200 hover:scale-105"
                          disabled={deletingTournament}
                        >
                          <Trash2 className="h-4 w-4" />
                          {deletingTournament ? "DELETING..." : "DELETE"}
                        </Button>
                      </>
                    )}

                    {tournament.status === "in_progress" && (
                      <Button
                        onClick={cancelTournament}
                        className="bg-red-600 hover:bg-red-700 text-white flex-1 transition-transform duration-200 hover:scale-105"
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
                <div className="flex items-center justify-center bg-red-600/20 text-red-500 font-bold py-3 px-4 rounded">
                  CANCELLED
                </div>
              )}

              {/* Affichage de l'équipe gagnante */}
              {tournament.status === "completed" && teamScores?.length > 0 && (
                <div className="flex flex-wrap items-center justify-center border-2 border-primary text-primary px-4 font-bold py-3 rounded gap-2">
                  <span className="flex items-center justify-center w-full">{WINNER_ICON} WINNER :</span>
                  <span className="flex items-center justify-center w-full">{teamScores[0].team.name}</span>
                </div>
              )}

              {/* Tournament stats */}
              <div className="flex justify-center gap-1 text-sm text-gray-400 xl:w-full">
                <div>REMAINING SLOTS : {remainingSlots}</div>
                <div>PLAYER(S) PER TEAM : {tournament.players_per_team}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentHeader; 