import { useState, useEffect } from "react";
import { kyInstance } from "@utils/api/ky-config";


// Hook for fetching a list of tournaments
export function useTournamentsList(filters = {}) {
  const [tournaments, setTournaments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTournaments = async () => {
    setIsLoading(true);
    
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (filters.type && filters.type !== "all") {
        queryParams.append("tournament_type", filters.type);
      }
      if (filters.status && filters.status !== "all") {
        queryParams.append("status", filters.status);
      }
      if (filters.search) {
        queryParams.append("search", filters.search);
      }
      // Note: Nous n'envoyons pas le filtre d'inscription au serveur,
      // car nous le gérerons côté client pour une meilleure flexibilité
      
      const response = await kyInstance.get('v1/tournaments', {
        searchParams: queryParams
      }).json();
      
      // Handle different response formats
      let tournamentList = [];
      if (response.tournaments && Array.isArray(response.tournaments)) {
        tournamentList = response.tournaments;
      } 
      
      
      // Appliquer le filtrage côté client pour l'état d'inscription basé sur les dates
      if (filters.registration && filters.registration !== "all") {
        console.log("Applying client-side registration filtering:", filters.registration);
        const now = new Date();
        
        tournamentList = tournamentList.filter(tournament => {
          const startTime = tournament.scheduled_start_time ? new Date(tournament.scheduled_start_time) : null;
          const endTime = tournament.scheduled_end_time ? new Date(tournament.scheduled_end_time) : null;
          
          // Déterminer les différents états
          const isRegistrationOpen = !startTime || now < startTime;
          const isTournamentActive = startTime && now >= startTime && (!endTime || now < endTime);
          const isTournamentEnded = endTime && now >= endTime;
          
          switch (filters.registration) {
            case "open":
              return (tournament.status === "pending" || tournament.status === "draft") && isRegistrationOpen;
            case "closed":
              return (tournament.status === "pending" || tournament.status === "draft") && !isRegistrationOpen;
            case "active":
              return tournament.status === "in_progress" || isTournamentActive;
            case "ended":
              return tournament.status === "completed" || isTournamentEnded;
            default:
              return true;
          }
        });
      }

      setTournaments(tournamentList);
      setError(null);
    } catch (err) {
      console.error("Error fetching tournaments:", err);
      setTournaments([]);
      setError("Failed to load tournaments: " + (err.message || "Unknown error"));
    } finally {
      // Important: ensure isLoading is set to false in all cases
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, [filters]);

  return { tournaments, isLoading, error, refetch: fetchTournaments };
}

// Hook for fetching a single tournament
export function useTournament(tournamentId) {
  const [tournament, setTournament] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tournamentId) return;

    const fetchTournament = async () => {
      setIsLoading(true);
      
      try {
        const response = await kyInstance.get(`v1/tournaments/${tournamentId}`).json();
        
        // Log details for team management
        if (response && response.tournament) {
          setTournament(response.tournament);
        } else if (response && response.data) {
          setTournament(response.data);
        } else if (response && !response.data && !response.tournament) {
          // If response itself contains the tournament data
          setTournament(response);
        } else {
          setTournament(null);
          setError(new Error("Invalid tournament data format"));
        }
      } catch (err) {
        setError(err);
        setTournament(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTournament();
  }, [tournamentId]);

  return { tournament, isLoading, error };
}

// Hook for fetching teams in a tournament
export function useTournamentTeams(tournamentId) {
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tournamentId) return;

    const fetchTeams = async () => {
      setIsLoading(true);
      
      try {
        const response = await kyInstance.get(`v1/tournaments/${tournamentId}/teams`).json();
        setTeams(response.teams);
        setError(null);
      } catch (err) {
        setError(err);
        setTeams([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeams();
  }, [tournamentId]);

  return { teams, isLoading, error };
}

// Hook for fetching matches in a tournament
export function useTournamentMatches(tournamentId) {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMatches = async () => {
    setIsLoading(true);
    
    try {
      const response = await kyInstance.get(`v1/tournaments/${tournamentId}/tournament_matches`).json();
      setMatches(response.matches);
      setError(null);
    } catch (err) {
      setError(err);
      setMatches([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!tournamentId) return;
    fetchMatches();
  }, [tournamentId]);

  return { matches, isLoading, error, refetch: fetchMatches };
}

// Hook for fetching a single match
export function useMatch(tournamentId, matchId) {
  const [match, setMatch] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tournamentId || !matchId) return;

    const fetchMatch = async () => {
      setIsLoading(true);
      
      try {
        const response = await kyInstance.get(`v1/tournaments/${tournamentId}/tournament_matches/${matchId}`).json();
        setMatch(response.data || null);
        setError(null);
      } catch (err) {
        console.error(`Error fetching match ${matchId}:`, err);
        setError(err);
        setMatch(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatch();
  }, [tournamentId, matchId]);

  return { match, isLoading, error };
}

// Hook for fetching a specific team in a tournament
export function useTeam(tournamentId, teamId) {
  const [team, setTeam] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tournamentId || !teamId) return;

    const fetchTeam = async () => {
      console.log(`[useTeam] Fetching team ID: ${teamId} in tournament: ${tournamentId}`);
      setIsLoading(true);
      
      try {
        console.log(`[useTeam] Making API call to: v1/tournaments/${tournamentId}/teams/${teamId}`);
        const response = await kyInstance.get(`v1/tournaments/${tournamentId}/teams/${teamId}`).json();
        console.log(`[useTeam] Raw API response:`, response);
        console.log(`[useTeam] Response type:`, typeof response);
        console.log(`[useTeam] Response structure:`, JSON.stringify(response, null, 2));
        
        let teamData = null;
        
        // Handle different response formats
        if (response && response.team) {
          console.log(`[useTeam] Team from response.team:`, response.team);
          teamData = response.team;
        } else if (response && response.data) {
          console.log(`[useTeam] Team from response.data:`, response.data);
          teamData = response.data;
        } else if (response && !response.data && !response.team) {
          // If response itself contains the team data
          console.log(`[useTeam] Team from direct response:`, response);
          teamData = response;
        } else {
          console.warn("[useTeam] Unexpected team response format:", response);
          teamData = null;
        }
        
        // Log team members and captain information for debugging
        if (teamData) {
          console.log(`[useTeam] Team members:`, teamData.team_members);
          console.log(`[useTeam] Captain ID:`, teamData.captain_id);
          console.log(`[useTeam] Is current user captain:`, teamData.is_captain);
          
          // Log each team member structure
          if (teamData.team_members && teamData.team_members.length > 0) {
            teamData.team_members.forEach((member, index) => {
              console.log(`[useTeam] Member ${index + 1} structure:`, JSON.stringify(member, null, 2));
              console.log(`[useTeam] Member ${index + 1} user:`, member.user);
              console.log(`[useTeam] Member ${index + 1} slot number:`, member.slot_number);
              console.log(`[useTeam] Is member ${index + 1} captain:`, member.user?.id === teamData.captain_id);
            });
          }
        }
        
        setTeam(teamData);
        setError(null);
      } catch (err) {
        console.error(`[useTeam] Error fetching team ${teamId} for tournament ${tournamentId}:`, err);
        console.error(`[useTeam] Error details:`, err.message, err.stack);
        setError(err);
        setTeam(null);
      } finally {
        setIsLoading(false);
        console.log(`[useTeam] Finished loading team`);
      }
    };

    fetchTeam();
  }, [tournamentId, teamId]);

  return { team, isLoading, error };
} 