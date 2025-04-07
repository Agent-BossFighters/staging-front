import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTournament, useMatch } from "@features/tournaments/hooks/useTournaments";
import { Button } from "@shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { Badge } from "@shared/ui/badge";
import { Progress } from "@shared/ui/progress";

const statusColors = {
  pending: "bg-yellow-400 text-black",
  in_progress: "bg-green-500 text-black",
  completed: "bg-blue-500 text-black",
};

export default function MatchDetailsPage() {
  const { tournamentId, matchId } = useParams();
  const { tournament } = useTournament(tournamentId);
  const { match, isLoading, error } = useMatch(tournamentId, matchId);
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex justify-center">
        <div className="loader">Loading match details...</div>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="text-red-500 mb-4">Error: {error?.message || "Match not found"}</div>
        <Link to={`/dashboard/tournaments/${tournamentId}`}>
          <Button variant="outline">Back to Tournament</Button>
        </Link>
      </div>
    );
  }

  const {
    team_a,
    team_b,
    team_a_points,
    team_b_points,
    scheduled_time,
    status,
    winner_id,
    boss_a,
    boss_b,
    rounds,
    match_type
  } = match;

  const formattedDate = scheduled_time ? new Date(scheduled_time).toLocaleString() : "TBD";
  const isArena = match_type === "arena";
  const isCompleted = status === "completed";
  const isUserMatch = team_a?.is_user_team || team_b?.is_user_team;
  
  // Get team names or placeholder
  const teamAName = team_a?.name || "TBD";
  const teamBName = team_b?.name || "TBD";
  
  // Calculate total points
  const totalPoints = team_a_points + team_b_points;
  const teamAPercentage = totalPoints > 0 ? Math.round((team_a_points / totalPoints) * 100) : 50;
  const teamBPercentage = totalPoints > 0 ? Math.round((team_b_points / totalPoints) * 100) : 50;

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link to={`/dashboard/tournaments/${tournamentId}`} className="text-yellow-400 hover:underline mb-2 inline-block">
          &larr; Back to Tournament
        </Link>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Match #{matchId}</h1>
          <Badge className={statusColors[status] || "bg-gray-500"}>
            {status?.replace("_", " ").toUpperCase()}
          </Badge>
        </div>
        <div className="text-gray-400 mt-1">{formattedDate}</div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gray-800 border border-gray-700 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl text-yellow-400">Match Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-6">
              <div className="text-center w-full md:w-auto">
                <div className="text-xl font-bold text-white mb-1">{teamAName}</div>
                {boss_a && <div className="text-sm text-gray-400 mb-3">Boss: {boss_a.name}</div>}
                <div className="text-4xl font-bold text-yellow-400">{team_a_points || 0}</div>
                {isCompleted && winner_id === team_a?.id && (
                  <Badge className="mt-2 bg-green-500 text-black">Winner</Badge>
                )}
              </div>
              
              <div className="text-center text-gray-400 text-xl font-bold">VS</div>
              
              <div className="text-center w-full md:w-auto">
                <div className="text-xl font-bold text-white mb-1">{teamBName}</div>
                {boss_b && <div className="text-sm text-gray-400 mb-3">Boss: {boss_b.name}</div>}
                <div className="text-4xl font-bold text-yellow-400">{team_b_points || 0}</div>
                {isCompleted && winner_id === team_b?.id && (
                  <Badge className="mt-2 bg-green-500 text-black">Winner</Badge>
                )}
              </div>
            </div>
            
            {status !== 'pending' && (
              <div className="mt-8">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Score Distribution:</span>
                </div>
                <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 float-left rounded-l-full"
                    style={{ width: `${teamAPercentage}%` }}
                  ></div>
                  <div 
                    className="h-full bg-purple-500 float-left rounded-r-full"
                    style={{ width: `${teamBPercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-blue-400">{teamAPercentage}%</span>
                  <span className="text-purple-400">{teamBPercentage}%</span>
                </div>
              </div>
            )}
            
            {isArena && rounds && rounds.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-bold text-white mb-4">Rounds</h3>
                <div className="space-y-4">
                  {rounds.map((round) => (
                    <div key={round.id} className="bg-gray-700 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <div className="font-medium text-white">Round {round.round_number}</div>
                        <div className="flex gap-4">
                          <div className="text-center">
                            <div className="text-sm text-gray-400">Team A</div>
                            <div className="font-bold text-yellow-400">{round.team_a_points}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-gray-400">Team B</div>
                            <div className="font-bold text-yellow-400">{round.team_b_points}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-400 mb-1">Damage Dealt</div>
                          <Progress 
                            value={round.team_a_damage} 
                            max={Math.max(round.team_a_damage, round.team_b_damage)} 
                            className="h-2 bg-gray-600"
                            indicatorClassName="bg-blue-500"
                          />
                          <div className="text-right text-xs text-gray-400 mt-1">{round.team_a_damage}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400 mb-1">Damage Dealt</div>
                          <Progress 
                            value={round.team_b_damage} 
                            max={Math.max(round.team_a_damage, round.team_b_damage)} 
                            className="h-2 bg-gray-600"
                            indicatorClassName="bg-purple-500"
                          />
                          <div className="text-right text-xs text-gray-400 mt-1">{round.team_b_damage}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl text-yellow-400">Match Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm text-gray-400 mb-1">Match Type</div>
              <div className="text-white">{isArena ? "Arena" : "Survival"}</div>
            </div>
            
            <div>
              <div className="text-sm text-gray-400 mb-1">Tournament</div>
              <div className="text-white">{tournament?.name || "Unknown"}</div>
            </div>
            
            <div>
              <div className="text-sm text-gray-400 mb-1">Round</div>
              <div className="text-white">
                {match.round_number === 0 
                  ? "Qualifying Round" 
                  : `Round ${match.round_number}`}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-400 mb-1">Scheduled Time</div>
              <div className="text-white">{formattedDate}</div>
            </div>
            
            {status === 'pending' && isUserMatch && (
              <div className="mt-6 p-4 bg-yellow-500/20 border border-yellow-400 rounded-lg">
                <h3 className="text-white font-medium mb-2">Upcoming Match</h3>
                <p className="text-sm text-gray-300">
                  Your team is participating in this match. Be ready at the scheduled time!
                </p>
              </div>
            )}
            
            {status === 'in_progress' && isUserMatch && (
              <div className="mt-6 p-4 bg-green-500/20 border border-green-400 rounded-lg">
                <h3 className="text-white font-medium mb-2">Match In Progress</h3>
                <p className="text-sm text-gray-300">
                  Your team's match is currently in progress!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 