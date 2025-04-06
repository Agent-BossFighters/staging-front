import React, { useState } from 'react';
import { useAuth } from "@context/auth.context";
import generateTournamentMatches from "../utils/generateMatchesTournament";
import calculateTeamScores from "../utils/teamScoring";
import { formatTimeOrScore } from "../utils/timeFormatters";
import { initializeAllScores, updateAllScoreValue, saveAllScores } from "../utils/scoreHandlers";
import { groupMatchesByRound, updateMatchStatus } from "../utils/matchUtils";
import { isCreatorOfTournament } from "../utils/tournamentUtils";
import TeamsList from './bracket/teamsList';
import TeamRanking from './bracket/teamRanking';
import RoundsList from './bracket/roundsList';
import EmptyTournamentMessage from './bracket/emptyTournamentMessage';
import { Button } from "@shared/ui/button";
import { Share, Save, X } from 'lucide-react';

const TournamentBracketShowtime = ({ tournament, teams, matches, onMatchUpdated }) => {
  const { user } = useAuth();
  const [generatingMatches, setGeneratingMatches] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);
  const [scores, setScores] = useState({ team_a_points: 0, team_b_points: 0, team_a_time: "00:00" });
  const [saving, setSaving] = useState(false);
  const [isEditingAllScores, setIsEditingAllScores] = useState(false);
  const [allScores, setAllScores] = useState({});
  
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

  const handleStartMatch = async (match) => {
    await updateMatchStatus(match, tournament, 'in_progress', onMatchUpdated);
  };

  const handleUpdateResult = () => {
    const initialScores = initializeAllScores(groupedMatches, isShowtimeSurvival, formatTimeOrScore);
    setAllScores(initialScores);
    setIsEditingAllScores(true);
  };
  
  const handleAllScoreChange = (matchId, team, value) => {
    updateAllScoreValue(matchId, team, value, setAllScores);
  };
  
  const handleSaveAllScores = async () => {
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
    console.log('Partage des résultats');
  };
  
  const handleValidate = () => {
    console.log('Validation des résultats');
  };

  return (
    <div className="tournament-bracket">
      {/* En-tête du tournoi */}
      <div className="bg-gray-800 p-4 mb-4 rounded flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">{tournament?.name}</h1>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <div className="text-gray-400 mr-2">TYPE</div>
            <div className="text-white">{isShowtimeSurvival ? "SURVIVAL" : "SCORE"}</div>
          </div>
          
          <div className="flex items-center">
            <div className="text-gray-400 mr-2">MODE</div>
            <div className="text-white">SHOWTIME</div>
          </div>
          
          <div className="flex items-center">
            <div className="text-gray-400 mr-2">RÈGLES</div>
            <div className="text-white">
              Obtenez le meilleur {isShowtimeSurvival ? "temps" : "score"} possible
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Teams and Rounds in the same column */}
        <div className="col-span-9">
          {/* Teams list first */}
          <div className="mb-4">
            <TeamsList teams={teams} />
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
        <div className="col-span-3">
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
        ) : (
          <Button 
            onClick={handleUpdateResult}
            className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3"
          >
            UPDATE RESULT
          </Button>
        )}
        
        <div className="flex gap-3">
          <Button 
            onClick={handleShare} 
            className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3"
            disabled={isEditingAllScores}
          >
            <Share size={16} className="mr-2" />
            SHARE
          </Button>
          
          {isCreator && (
            <Button 
              onClick={handleValidate} 
              className="bg-primary text-black px-6 py-3"
              disabled={isEditingAllScores}
            >
              VALIDATE RESULTS
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TournamentBracketShowtime; 