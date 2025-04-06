import React from 'react';
import MatchCard from './matchCard';
import { Button } from "@shared/ui/button";
import { PlayCircle } from 'lucide-react';

const RoundsList = ({
  tournament,
  teams,
  numberOfRounds,
  groupedMatches,
  isCreator,
  generatingMatches,
  editingMatch,
  isShowtimeSurvival,
  scores,
  saving,
  onGenerateMatches,
  onEditScores,
  onStartMatch,
  onCompleteMatch,
  onScoreChange,
  onSaveScores,
  onCancelEdit
}) => {
  // Utiliser le nombre de rounds configuré (avec fallback sur le nombre détecté)
  const configuredRounds = parseInt(tournament?.rounds) || 1;
  const actualRounds = Math.max(configuredRounds, numberOfRounds);
  
  return (
    <div className="rounds-list">
      {Array.from({ length: actualRounds }).map((_, roundIndex) => {
        const round = roundIndex + 1;
        const roundMatches = groupedMatches[round] || [];
        
        return (
          <div key={round} className="mb-8">
            <div className="flex mb-4 items-center">
              <div className="bg-primary text-black font-bold p-3 w-32 text-center rounded-l-md">
                ROUND {round}
              </div>
              <div className="h-1 bg-primary flex-grow"></div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-4">
              {roundMatches.length > 0 ? (
                teams?.map((team, index) => {
                  const match = roundMatches.find(m => m.team_a_id === team.id);
                  if (!match) return null;
                  
                  return (
                    <MatchCard
                      key={`${round}-${team.id}`}
                      match={match}
                      team={team}
                      teamIndex={index}
                      tournament={tournament}
                      isCreator={isCreator}
                      isShowtimeSurvival={isShowtimeSurvival}
                      editingMatch={editingMatch}
                      scores={scores}
                      saving={saving}
                      onEditScores={onEditScores}
                      onStartMatch={onStartMatch}
                      onCompleteMatch={onCompleteMatch}
                      onScoreChange={onScoreChange}
                      onSaveScores={onSaveScores}
                      onCancelEdit={onCancelEdit}
                    />
                  );
                })
              ) : (
                <div className="md:col-span-4 p-4 bg-gray-800 rounded text-center">
                  <p className="text-gray-400">Aucun match pour ce round</p>
                  {isCreator && tournament.status !== 3 && (
                    <Button 
                      onClick={onGenerateMatches}
                      className="mt-2 bg-primary hover:bg-primary/80 text-black"
                      disabled={generatingMatches}
                    >
                      <PlayCircle size={16} className="mr-2" />
                      {generatingMatches ? "Génération..." : "GÉNÉRER LES MATCHS MANQUANTS"}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RoundsList;
