import React, { useState } from 'react';
import { useParams, Link, useNavigate } from "react-router-dom";
import { useTournament, useTournamentTeams, useTournamentMatches } from "@features/tournaments/hooks/useTournaments";
import { useAuth } from "@context/auth.context";
import { Button } from "@shared/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shared/ui/tabs";
import TeamsList from "@features/tournaments/components/TeamsList";
import MatchesList from "@features/tournaments/components/MatchesList";
import JoinTournamentModal from "@features/tournaments/components/JoinTournamentModal";
import TournamentBracketArena from "@features/tournaments/components/TournamentBracketArena";
import TournamentBracketShowtime from "@features/tournaments/components/TournamentBracketShowtime";
import TournamentRules from '@features/tournaments/components/TournamentRules';

// Composants layout
import TournamentHeader from '@features/tournaments/components/layout/TournamentHeader';
import TournamentDetails from '@features/tournaments/components/layout/TournamentDetails';
import TournamentRulesSummary from '@features/tournaments/components/layout/TournamentRulesSummary';

// Utilitaires
import { isCreatorOfTournament } from "@features/tournaments/utils/tournamentUtils";
import { findUserTeam, isTeamsFull } from "@features/tournaments/utils/teamUtils";
import { 
  isTournamentInProgress, 
  isArena,
  canJoinTournament as canJoinTournamentCheck,
  canStartTournament as canStartTournamentCheck,
  canCompleteTournament as canCompleteTournamentCheck
} from "@features/tournaments/utils/tournamentStatus";

// Hook personnalisé pour les contrôles du tournoi
import useTournamentControls from "@features/tournaments/hooks/useTournamentControls";

const TournamentDetailsPage = () => {
  const navigate = useNavigate();
  const { tournamentId } = useParams();
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const { user } = useAuth();
  
  const { 
    tournament, 
    isLoading: tournamentLoading, 
    error: tournamentError,
    refetch: refetchTournament 
  } = useTournament(tournamentId);
  
  const { 
    teams = [], 
    isLoading: teamsLoading,
    refetch: refetchTeams 
  } = useTournamentTeams(tournamentId);
  
  const { 
    matches, 
    isLoading: matchesLoading,
    refetch: refetchMatches
  } = useTournamentMatches(tournamentId);
  
  const userTeam = findUserTeam(teams);
  
  // Vérifier si l'utilisateur est le créateur du tournoi
  const isCreator = isCreatorOfTournament(user, tournament);
  
  // Vérifier si le tournoi a atteint sa capacité maximale d'équipes
  const tournamentIsFull = isTeamsFull(teams, tournament);
  
  // Vérifier si l'utilisateur peut rejoindre le tournoi
  const canJoinTournament = canJoinTournamentCheck(tournament, userTeam, tournamentIsFull, isCreator);
  
  // Vérifier si l'utilisateur peut démarrer le tournoi
  const canStartTournament = canStartTournamentCheck(tournament, isCreator);
  
  // Vérifier si l'utilisateur peut terminer le tournoi
  const canCompleteTournament = canCompleteTournamentCheck(tournament, isCreator);
  
  // Utiliser le hook de contrôle de tournoi
  const {
    startingTournament,
    deletingTournament,
    generatingMatches,
    startTournament,
    completeTournament,
    deleteTournament,
    editTournament,
    generateMatches
  } = useTournamentControls(
    tournament,
    teams,
    matches,
    refetchTournament,
    refetchTeams,
    refetchMatches,
    isCreator
  );

  if (tournamentLoading) {
    return (
      <div className="container mx-auto py-8 flex justify-center">
        <div className="loader">Loading tournament details...</div>
      </div>
    );
  }

  if (tournamentError || !tournament) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="text-red-500 mb-4">Error loading tournament: {tournamentError?.message || "Tournament not found"}</div>
        <Link to="/dashboard/tournaments">
          <Button variant="outline">Back to Tournaments</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <TournamentHeader 
        tournament={tournament}
        isCreator={isCreator}
        canStartTournament={canStartTournament}
        canCompleteTournament={canCompleteTournament}
        onEditClick={editTournament}
        onStartClick={startTournament}
        onCompleteClick={completeTournament}
        onDeleteClick={deleteTournament}
        startingTournament={startingTournament}
        deletingTournament={deletingTournament}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <TournamentRulesSummary
          tournament={tournament}
          canStartTournament={canStartTournament}
          canJoinTournament={canJoinTournament}
          userTeam={userTeam}
          isTeamsFull={tournamentIsFull}
          onStartClick={startTournament}
          onJoinClick={() => setJoinModalOpen(true)}
          startingTournament={startingTournament}
        />
        
        <TournamentDetails 
          tournament={tournament}
          isCreator={isCreator}
        />
      </div>
      
      <Tabs defaultValue="info" className="mt-6" onValueChange={(value) => {
        setActiveTab(value);
        // Rafraîchir les données des matchs lorsque l'onglet "bracket" ou "matches" est sélectionné
        if (value === "bracket" || value === "matches") {
          refetchMatches();
        }
      }}>
        <TabsList className="bg-gray-800">
          <TabsTrigger value="info" className="data-[state=active]:bg-gray-700">Informations</TabsTrigger>
          <TabsTrigger value="teams" className="data-[state=active]:bg-gray-700">Équipes</TabsTrigger>
          {tournament?.status !== 'pending' && (
            <>
              <TabsTrigger value="bracket" className="data-[state=active]:bg-gray-700">Bracket</TabsTrigger>
              <TabsTrigger value="matches" className="data-[state=active]:bg-gray-700">Matchs</TabsTrigger>
            </>
          )}
          <TabsTrigger value="rules" className="data-[state=active]:bg-gray-700">Règles</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="bg-gray-800 rounded-md p-6">
          {/* ... existing code ... */}
        </TabsContent>

        <TabsContent value="teams" className="bg-gray-800 rounded-md p-6">
          <TeamsList 
            teams={teams} 
            tournament={tournament} 
            isLoading={teamsLoading} 
            userTeam={userTeam}
            onJoinClick={() => setJoinModalOpen(true)}
            isAdmin={isCreator}
          />
        </TabsContent>

        <TabsContent value="bracket" className="bg-gray-800 rounded-md p-6">
          {tournament?.status === 'pending' ? (
            <div className="text-center py-10 text-gray-400">
              Le tournoi n'a pas encore commencé. Le bracket sera disponible lorsque le tournoi sera lancé.
            </div>
          ) : (
            <>
              {activeTab === "bracket" && matches?.length === 0 && (
                <div className="text-center py-10 text-gray-400">
                  <p>Aucun match n'a encore été créé pour ce tournoi.</p>
                  {isCreator && (
                    <Button 
                      onClick={() => {
                        refetchMatches();
                      }}
                      className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black"
                    >
                      Rafraîchir les matchs
                    </Button>
                  )}
                </div>
              )}
              {isArena(tournament) ? (
                <TournamentBracketArena 
                  tournament={tournament} 
                  teams={teams} 
                  matches={matches}
                  onMatchUpdated={() => {
                    refetchMatches();
                  }}
                />
              ) : (
                <TournamentBracketShowtime 
                  tournament={tournament} 
                  teams={teams} 
                  matches={matches}
                  onMatchUpdated={() => {
                    refetchMatches();
                  }}
                />
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="matches" className="bg-gray-800 rounded-md p-6">
          {tournament?.status === 'pending' ? (
            <div className="text-center py-10 text-gray-400">
              Le tournoi n'a pas encore commencé. Les matchs seront disponibles lorsque le tournoi sera lancé.
            </div>
          ) : (
            <MatchesList 
              tournament={tournament}
              teams={teams}
              matches={matches}
              onMatchUpdated={() => {
                refetchMatches();
              }}
            />
          )}
        </TabsContent>

        <TabsContent value="rules" className="bg-gray-800 rounded-md p-6">
          <TournamentRules type={tournament?.tournament_type} />
        </TabsContent>
      </Tabs>
      
      {/* Modal pour rejoindre le tournoi */}
      {joinModalOpen && (
        <JoinTournamentModal
          tournament={tournament}
          isOpen={joinModalOpen}
          onClose={() => setJoinModalOpen(false)}
        />
      )}
    </div>
  );
}

export default TournamentDetailsPage; 