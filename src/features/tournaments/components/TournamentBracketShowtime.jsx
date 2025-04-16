import React, { useState } from "react";
import { useAuth } from "@context/auth.context";
import { useNavigate } from "react-router-dom";
import generateTournamentMatches from "../utils/generateMatchesTournament";
import calculateTeamScores from "../utils/teamScoring";
import { formatTimeOrScore } from "../utils/timeFormatters";
import {
  initializeAllScores,
  updateAllScoreValue,
  saveAllScores,
} from "../utils/scoreHandlers";
import { groupMatchesByRound, updateMatchStatus } from "../utils/matchUtils";
import { isCreatorOfTournament, calculatePlayerSlots, formatRemainingSlots } from "../utils/tournamentUtils";
import { findUserTeam, isTeamsFull } from "../utils/teamUtils";
import {
  canJoinTournament,
  isTournamentInProgress,
  isTournamentOpen,
  isRegistrationOpen,
  canStartTournament as canStartTournamentCheck,
  canCompleteTournament as canCompleteTournamentCheck,
} from "../utils/tournamentStatus";
import useTournamentControls from "../hooks/useTournamentControls";
import { useTournamentActions } from "../hooks/useTournamentActions";
import TeamsList from "./bracket/teamsList";
import TeamRanking from "./bracket/teamRanking";
import RoundsList from "./bracket/roundsList";
import EmptyTournamentMessage from "./bracket/emptyTournamentMessage";
import JoinTournamentModal from "./JoinTournamentModal";
import TournamentHeader from "./TournamentHeader";
import { Button } from "@shared/ui/button";
import { updateArrow } from "@img";
import {
  Share,
  Save,
  X,
  UserPlus,
  Play,
  CheckCircle,
  Edit,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import TournamentEditModal from "../../../pages/dashboard/tournaments/tournament-edit.page";
import { Badge } from "@shared/ui/badge";

const TournamentBracketShowtime = ({
  tournament,
  teams,
  matches,
  onMatchUpdated,
  onTournamentDeleted,
  onBackToList
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [generatingMatches, setGeneratingMatches] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);
  const [scores, setScores] = useState({
    team_a_points: 0,
    team_b_points: 0,
    team_a_time: "00:00",
  });
  const [saving, setSaving] = useState(false);
  const [isEditingAllScores, setIsEditingAllScores] = useState(false);
  const [allScores, setAllScores] = useState({});
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showEntryCode, setShowEntryCode] = useState(false);
  const [revealCode, setRevealCode] = useState(false);
  const [entryCodeCopied, setEntryCodeCopied] = useState(false);
  const { joinRandomTeam, isJoining } = useTournamentActions();

  const isCreator = user && tournament?.creator_id === user.id;
  const userTeam = findUserTeam(teams, user);
  const actualTeams =
    teams?.filter((team) => {
      const hasMembers = (team.team_members || team.players || []).length > 0;
      const notEmptySlot = !team.is_empty_slot && !team.is_empty;
      return hasMembers || notEmptySlot;
    }) || [];
  const tournamentIsFull = isTeamsFull(actualTeams, tournament);

  // Calcul des slots disponibles
  const { availableSlots } = calculatePlayerSlots(tournament, teams);
  const hasAvailableSlots = availableSlots > 0;
  
  // Vérification si l'utilisateur peut rejoindre le tournoi
  const canJoinThisTournament = canJoinTournament(tournament, userTeam, tournamentIsFull, isCreator) && hasAvailableSlots;
  
  // Vérifier si le tournoi est en cours (status in_progress)
  const isTournamentActive = isTournamentInProgress(tournament);

  // Vérifier si l'utilisateur peut démarrer ou terminer le tournoi
  const canStartTournament =
    isCreator && canStartTournamentCheck(tournament, isCreator);
  const canCompleteTournament =
    isCreator && canCompleteTournamentCheck(tournament, isCreator);

  // Utiliser le hook de contrôle de tournoi uniquement si l'utilisateur est le créateur
  const {
    startingTournament,
    deletingTournament,
    cancelingTournament,
    startTournament,
    completeTournament,
    deleteTournament,
    cancelTournament,
    editTournament,
  } = useTournamentControls(
    tournament,
    teams,
    matches,
    () => {
      onMatchUpdated();
      toast.success("Tournament updated successfully!");
    },
    () => {},
    onMatchUpdated,
    isCreator,
    onTournamentDeleted
  );

  const groupedMatches = groupMatchesByRound(matches);

  // Obtenir le nombre de rounds
  const roundNumbers = Object.keys(groupedMatches).map((r) => parseInt(r));
  const numberOfRounds =
    roundNumbers.length > 0 ? Math.max(...roundNumbers) : 1;

  // Déterminer le type de tournoi Showtime (0 = Survival, 1 = Score Counter)
  const tournamentType = parseInt(tournament?.tournament_type);
  const isShowtimeSurvival =
    tournamentType === 0 || tournament?.tournament_type === "showtime_survival";
  const isShowtimeScore =
    tournamentType === 1 || tournament?.tournament_type === "showtime_score";

  const teamScores = calculateTeamScores(teams, matches, isShowtimeSurvival);

  const handleGenerateMatches = async () => {
    await generateTournamentMatches(
      tournament,
      teams,
      matches,
      onMatchUpdated,
      isCreator,
      setGeneratingMatches
    );
  };

  const handleCompleteMatch = async (match) => {
    await updateMatchStatus(match, tournament, "completed", onMatchUpdated);
  };

  const handleStartMatch = async (match) => {
    await updateMatchStatus(match, tournament, "in_progress", onMatchUpdated);
  };

  const handleUpdateResult = () => {
    const initialScores = initializeAllScores(
      groupedMatches,
      isShowtimeSurvival,
      formatTimeOrScore
    );
    setAllScores(initialScores);
    setIsEditingAllScores(true);
  };

  const handleAllScoreChange = (matchId, team, value) => {
    updateAllScoreValue(matchId, team, value, setAllScores);
  };

  const handleSaveAllScores = async () => {
    // Utiliser la fonction utilitaire pour sauvegarder tous les scores
    await saveAllScores(
      allScores,
      matches,
      tournament,
      isShowtimeSurvival,
      onMatchUpdated,
      setIsEditingAllScores,
      setSaving
    );
  };

  const handleCancelAllScoresEdit = () => {
    setIsEditingAllScores(false);
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

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

  const handleEditTournament = () => {
    if (!isCreator) {
      toast.error("You are not authorized to modify this tournament.");
      return;
    }
    setIsEditModalOpen(true);
  };

  const handleTournamentUpdated = (updatedTournament) => {
    onMatchUpdated();
  };

  const handleJoinRandomTeam = async () => {
    const result = await joinRandomTeam(tournament, teams, user);
    if (result) {
      // Rafraîchir les données du tournoi après avoir rejoint une équipe
      onMatchUpdated?.();
    }
  };

  return (
    <div className="tournament-bracket">
      {/* Nouveau header */}
      <TournamentHeader
        tournament={tournament}
        isCreator={isCreator}
        canJoinThisTournament={canJoinThisTournament}
        user={user}
        onJoinClick={() => setJoinModalOpen(true)}
        onJoinRandomTeam={handleJoinRandomTeam}
        startingTournament={startingTournament}
        canStartTournament={canStartTournament}
        startTournament={startTournament}
        canCompleteTournament={canCompleteTournament}
        completeTournament={completeTournament}
        handleEditTournament={handleEditTournament}
        deletingTournament={deletingTournament}
        deleteTournament={deleteTournament}
        cancelingTournament={cancelingTournament}
        cancelTournament={cancelTournament}
        teams={teams}
        onBackToList={onBackToList}
      />

      {/* Ancien header (à supprimer manuellement plus tard) */}


      <div className="grid grid-cols-12 gap-4">
        {/* Teams and Rounds in the same column */}
        <div className="col-span-9">
          {/* Teams list first */}
          <div className="mb-4">
            <TeamsList teams={teams} user={user} tournament={tournament} />
          </div>

          {/* Rounds list below */}
          <div>
            {matches?.length > 0 ? (
              <RoundsList
                tournament={tournament}
                teams={teams}
                numberOfRounds={numberOfRounds}
                groupedMatches={groupedMatches}
                isCreator={isCreator}
                generatingMatches={generatingMatches}
                editingMatch={editingMatch}
                isShowtimeSurvival={isShowtimeSurvival}
                scores={scores}
                saving={saving}
                isEditingAllScores={isEditingAllScores}
                allScores={allScores}
                onGenerateMatches={handleGenerateMatches}
                onStartMatch={handleStartMatch}
                onCompleteMatch={handleCompleteMatch}
                onAllScoreChange={handleAllScoreChange}
              />
            ) : (
              <EmptyTournamentMessage
                isCreator={isCreator}
                tournament={tournament}
                generatingMatches={generatingMatches}
                onGenerateMatches={handleGenerateMatches}
              />
            )}
          </div>
        </div>

        {/* Ranking */}
        <div className="col-span-3 mt-4 ml-4">
          <TeamRanking
            tournament={tournament}
            teamScores={teamScores}
            isShowtimeSurvival={isShowtimeSurvival}
          />
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex justify-between mt-6">
        {isEditingAllScores ? (
          <div className="flex gap-3">
            <Button
              onClick={handleCancelAllScoresEdit}
              className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3"
              disabled={saving}
            >
              <X size={16} className="mr-2" />
              CANCEL
            </Button>
            <Button
              onClick={handleSaveAllScores}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3"
              disabled={saving}
            >
              <Save size={16} className="mr-2" />
              {saving ? "SAVING..." : "SAVE ALL SCORES"}
            </Button>
          </div>
        ) : isCreator && isTournamentActive ? (
          <Button
            onClick={handleUpdateResult}
            className="bg-primary hover:bg-primary/90 text-black px-6 py-3"
          >
            <img src={updateArrow} alt="updateArrow" className="w-8 h-8 mr-2" />
            UPDATE RESULT
          </Button>
        ) : isCreator && !isTournamentActive ? (
          <div className="text-gray-400 flex items-center">
            {isTournamentOpen(tournament) ? 
              "Results can be updated once the tournament is in progress" : 
              "Results can no longer be updated"}
          </div>
        ) : (
          <div></div> /* Espace vide pour maintenir la mise en page lorsque le bouton n'est pas affiché */
        )}

        <div className="flex gap-3">
          <Button
            onClick={handleShare}
            className="bg-primary hover:bg-primary/90 text-black px-6 py-3"
            disabled={isEditingAllScores}
          >
            <Share size={16} className="mr-2" />
            SHARE
          </Button>
        </div>
      </div>

      {/* Modal pour rejoindre le tournoi */}
      {joinModalOpen && (
        <JoinTournamentModal
          tournament={tournament}
          isOpen={joinModalOpen}
          onClose={() => setJoinModalOpen(false)}
        />
      )}

      {isCreator && isEditModalOpen && (
        <TournamentEditModal
          tournament={tournament}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onTournamentUpdated={handleTournamentUpdated}
        />
      )}
    </div>
  );
};

export default TournamentBracketShowtime;
