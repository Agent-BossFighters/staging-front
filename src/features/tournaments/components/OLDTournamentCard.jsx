import { Link } from "react-router-dom";
import { Badge } from "@shared/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@shared/ui/card";

const statusColors = {
  pending: "bg-yellow-400 text-black",
  in_progress: "bg-green-500 text-black",
  completed: "bg-blue-500 text-black",
  draft: "bg-purple-400 text-black",
  registration_open: "bg-green-400 text-black",
  registration_closed: "bg-red-400 text-black",
  active: "bg-green-500 text-black",
  ended: "bg-gray-400 text-black",
};

const typeLabels = {
  "0": "Survival (Showtime)",
  "1": "Survival (Score)",
  "2": "Arena",
  "survival_showtime": "Survival (Showtime)",
  "survival_score": "Survival (Score)",
  "arena": "Arena"
};

export default function TournamentCard({ tournament }) {
  
  // Safety check
  if (!tournament || typeof tournament !== 'object') {
    console.error("Invalid tournament object:", tournament);
    return <Card className="bg-gray-800 border border-gray-700">
      <CardHeader><CardTitle>Invalid tournament data</CardTitle></CardHeader>
    </Card>;
  }
  
  const { 
    id, 
    name, 
    tournament_type, 
    status, 
    teams, 
    max_teams, 
    players_per_team, 
    created_at,
    scheduled_start_time,
    scheduled_end_time 
  } = tournament;
  
  // Handle missing properties
  const safeStatus = status || "pending";
  const safeType = tournament_type !== undefined ? tournament_type.toString() : "1";
  const safeTeams = Array.isArray(teams) ? teams : [];
  const safeMaxTeams = max_teams || 0;
  const safeName = name || "Unnamed Tournament";
  const safePlayers = players_per_team || 0;
  const safeCreatedAt = created_at || new Date().toISOString();
  
  // Déterminer l'état du tournoi basé sur les dates
  const now = new Date();
  const startTime = scheduled_start_time ? new Date(scheduled_start_time) : null;
  const endTime = scheduled_end_time ? new Date(scheduled_end_time) : null;
  
  // Déterminer les différents états basés sur les dates
  const isRegistrationOpen = !startTime || now < startTime;
  const isTournamentActive = startTime && now >= startTime && (!endTime || now < endTime);
  const isTournamentEnded = endTime && now >= endTime;
  
  // Déterminer si c'est un type Arena ou Survival
  const isArena = safeType === "2" || safeType === "arena";
  const typeLabel = typeLabels[safeType] || "Unknown Type";
  
  // Fonction pour obtenir le statut affiché, en tenant compte des dates
  const getDisplayStatus = () => {
    if (safeStatus === "completed" || isTournamentEnded) {
      return { text: "COMPLETED", color: statusColors.ended };
    } else if (safeStatus === "in_progress" || isTournamentActive) {
      return { text: "IN PROGRESS", color: statusColors.active };
    } else if ((safeStatus === "pending" || safeStatus === "draft") && !isRegistrationOpen) {
      return { text: "REGISTRATION CLOSED", color: statusColors.registration_closed };
    } else if (safeStatus === "pending" && isRegistrationOpen) {
      return { text: "REGISTRATION OPEN", color: statusColors.registration_open };
    } else if (safeStatus === "draft" && isRegistrationOpen) {
      return { text: "DRAFT", color: statusColors.draft };
    } else {
      return { text: safeStatus.replace("_", " ").toUpperCase(), color: statusColors[safeStatus] || "bg-gray-500" };
    }
  };
  
  const displayStatus = getDisplayStatus();
  const registrationProgress = safeTeams ? Math.round((safeTeams.length / safeMaxTeams) * 100) : 0;
  const formattedDate = new Date(safeCreatedAt).toLocaleDateString();

  return (
    <Card className="bg-gray-800 border border-gray-700 hover:border-yellow-400 transition-all">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <Badge className={displayStatus.color}>
            {displayStatus.text}
          </Badge>
          <Badge variant="outline" className="border-gray-600 text-gray-300">
            {typeLabel}
          </Badge>
        </div>
        <CardTitle className="text-xl text-yellow-400 mt-2">{safeName}</CardTitle>
        <CardDescription className="text-gray-400">
          Created on {formattedDate}
        </CardDescription>
        {startTime && (
          <CardDescription className="text-green-400 mt-1">
            Starts: {startTime.toLocaleString()}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">Team Registration:</span>
          <span className="text-white">{safeTeams?.length || 0}/{safeMaxTeams}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div 
            className="bg-yellow-400 h-2.5 rounded-full" 
            style={{ width: `${registrationProgress}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-4">
          <div className="text-center">
            <p className="text-gray-400 text-xs">Teams</p>
            <p className="text-white font-medium">{safeMaxTeams}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-xs">Players/Team</p>
            <p className="text-white font-medium">{safePlayers}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-xs">Type</p>
            <p className="text-white font-medium">{isArena ? "Arena" : "Survival"}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link 
          to={`/dashboard/tournaments/${id}`}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded text-center transition-colors"
        >
          View Details
        </Link>
      </CardFooter>
    </Card>
  );
} 