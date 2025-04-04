import React, { useState } from 'react';
import { useAuth } from "@context/auth.context";
import generateTournamentMatches from "../utils/generateMatchesTournament";
import calculateTeamScores from "../utils/teamScoring";
import { formatTimeOrScore } from "../utils/timeFormatters";
import { saveMatchScores, editMatchScores, updateScoreValue } from "../utils/scoreHandlers";
import { groupMatchesByRound, updateMatchStatus } from "../utils/matchUtils";
import { isCreatorOfTournament } from "../utils/tournamentUtils";
import TeamsList from './bracket/teamsList';
import TeamRanking from './bracket/teamRanking';
import RoundsList from './bracket/roundsList';
import EmptyTournamentMessage from './bracket/emptyTournamentMessage';

const TournamentBracketShowtime = ({ tournament, teams, matches, onMatchUpdated }) => {
  const { user } = useAuth();
  const [generatingMatches, setGeneratingMatches] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);
  const [scores, setScores] = useState({ team_a_points: 0, team_b_points: 0 });
  const [saving, setSaving] = useState(false);
  
  const isCreator = isCreatorOfTournament(user, tournament);
  
  const groupedMatches = groupMatchesByRound(matches);
  
  // Obtenir le nombre de rounds
  const roundNumbers = Object.keys(groupedMatches).map(r => parseInt(r));
  const numberOfRounds = roundNumbers.length > 0 ? Math.max(...roundNumbers) : 1;
  
  // Déterminer le type de tournoi Showtime (0 = Survival, 1 = Score Counter)
  const tournamentType = parseInt(tournament?.tournament_type);
  const isShowtimeSurvival = tournamentType === 0 || tournament?.tournament_type === 'showtime_survival';
  const isShowtimeScore = tournamentType === 1 || tournament?.tournament_type === 'showtime_score';
  
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
    await updateMatchStatus(match, tournament, 'completed', onMatchUpdated);
  };
  
  const handleSaveScores = async () => {
    await saveMatchScores(
      editingMatch,
      tournament,
      scores,
      isShowtimeSurvival,
      onMatchUpdated,
      setEditingMatch,
      setSaving
    );
  };
  
  const handleScoreChange = (team, value) => {
    updateScoreValue(team, value, setScores);
  };
  
  const handleCancelEdit = () => {
    setEditingMatch(null);
  };
  
  const handleEditScores = (match) => {
    editMatchScores(
      match,
      tournament,
      isShowtimeSurvival,
      formatTimeOrScore,
      setEditingMatch,
      setScores
    );
  };

  const handleStartMatch = async (match) => {
    await updateMatchStatus(match, tournament, 'in_progress', onMatchUpdated);
  };

  return (
    <div className="bracket-container">
      <h2 className="text-xl font-bold text-primary mb-6">
        {isShowtimeSurvival ? "Tournoi Showtime Survival" : "Tournoi Showtime Score Counter"}
      </h2>
      
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <TeamsList teams={teams} />
        <TeamRanking 
          tournament={tournament}
          teamScores={teamScores}
          isShowtimeSurvival={isShowtimeSurvival}
        />
      </div>
      {matches?.length > 0 ? (
        <>
          {/* Info sur les rounds */}
          <div className="mb-4 p-2 bg-gray-800 rounded">
            <p className="text-gray-400 text-sm">
              Ce tournoi est configuré pour se dérouler en {parseInt(tournament?.rounds) || 1} round(s). 
              Nombre total de matchs: {matches?.length}.
            </p>
                </div>
                
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
            onGenerateMatches={handleGenerateMatches}
            onEditScores={handleEditScores}
            onStartMatch={handleStartMatch}
            onCompleteMatch={handleCompleteMatch}
            onScoreChange={handleScoreChange}
            onSaveScores={handleSaveScores}
            onCancelEdit={handleCancelEdit}
          />
        </>
      ) : (
        <EmptyTournamentMessage
          isCreator={isCreator}
          tournament={tournament}
          generatingMatches={generatingMatches}
          onGenerateMatches={handleGenerateMatches}
        />
      )}
    </div>
  );
};

export default TournamentBracketShowtime; 