import { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { kyInstance } from "@utils/api/ky-config";
import { useTournament } from "@features/tournaments/hooks/useTournaments";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shared/ui/select";
import { Textarea } from "@shared/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { Info, X, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@context/auth.context";

// Transformer en composant modal avec des props
export default function TournamentEditModal({ tournament: initialTournament, isOpen, onClose, onTournamentUpdated }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  
  // Récupérer les données du tournoi
  const { 
    tournament, 
    isLoading: tournamentLoading, 
    error: tournamentError 
  } = useTournament(initialTournament.id);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    tournament_type: "0",
    rules: "",
    agent_level_required: 0,
    players_per_team: 4,
    min_players_per_team: 4,
    max_teams: 8,
    rounds: "1",
    entry_code: "",
    status: 1,
    boss_id: user?.id || null
  });
  
  // Estimation du temps de matchs
  const [estimatedMatches, setEstimatedMatches] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState("0");
  
  // Charger les données du tournoi dans le formulaire
  useEffect(() => {
    if (tournament) {      
      // Convertir le statut en nombre si nécessaire
      let status = tournament.status;
      if (typeof status === 'string') {
        switch(status) {
          case 'draft': status = 0; break;
          case 'open': status = 1; break;
          case 'in_progress': status = 2; break;
          case 'completed': status = 3; break;
          case 'cancelled': status = 4; break;
        }
      }
      
      // S'assurer que les valeurs numériques sont converties en chaînes pour les select
      const tournamentType = tournament.tournament_type || "0";
      const rounds = tournament.rounds?.toString() || "1";
      
      setFormData({
        name: tournament.name || "",
        tournament_type: tournamentType,
        rules: tournament.rules || "",
        agent_level_required: tournament.agent_level_required || 0,
        players_per_team: tournament.players_per_team || 4,
        min_players_per_team: tournament.min_players_per_team || tournament.players_per_team || 4,
        max_teams: tournament.max_teams?.toString() || "8",
        rounds: rounds,
        entry_code: tournament.entry_code || "",
        status: status,
        boss_id: tournament.creator_id || user?.id || null
      });
      
      // Forcer le calcul du temps estimé après le chargement des données
      calculateEstimatedTime(tournamentType, tournament.max_teams?.toString() || "8", rounds);
    }
  }, [tournament]);
  
  // Calculer le nombre de matchs et le temps estimé
  const calculateEstimatedTime = (tournamentType, maxTeams, rounds) => {
    const teamsCount = parseInt(maxTeams) || 0;
    const roundsCount = parseInt(rounds) || 1;
    
    // Convertir les types de tournoi de chaîne en numérique
    let type;
    if (tournamentType === "showtime_survival" || tournamentType === "0" || tournamentType === 0) {
      type = 0; // Survival
    } else if (tournamentType === "showtime_score" || tournamentType === "1" || tournamentType === 1) {
      type = 1; // Score Counter
    } else if (tournamentType === "arena" || tournamentType === "2" || tournamentType === 2) {
      type = 2; // Arena
    } else {
      type = 0; // Valeur par défaut
    }
    
    let matches = 0;
    let timeInMinutes = 0;
    
    if (type === 0 || type === 1) { // Showtime (Survival ou Score Counter)
      matches = teamsCount * roundsCount; // Chaque équipe joue un match par round
      timeInMinutes = matches * 10; // 10 minutes par match
    } else if (type === 2) { // Arena
      if (teamsCount === 2) {
        matches = 1 * roundsCount; // Un seul match pour 2 équipes * nombre de rounds
      } else if (teamsCount === 4) {
        matches = (2 + 1) * roundsCount; // Demi-finales + finale * nombre de rounds
      } else if (teamsCount === 8) {
        matches = (4 + 2 + 1) * roundsCount; // Quarts + demi-finales + finale * nombre de rounds
      } else if (teamsCount === 16) {
        matches = (8 + 4 + 2 + 1) * roundsCount;
      } else if (teamsCount === 32) {
        matches = (16 + 8 + 4 + 2 + 1) * roundsCount;
      }
      timeInMinutes = matches * 10; // 10 minutes par match
    }
    
    // Utiliser des valeurs par défaut si les calculs donnent 0
    matches = matches || 0;
    timeInMinutes = timeInMinutes || 0;
    
    setEstimatedMatches(matches);
    setEstimatedTime(timeInMinutes);
  };

  // Vérifier si l'utilisateur est autorisé à modifier le tournoi
  useEffect(() => {
    if (tournament && user && tournament.creator_id !== user.id) {
      toast.error("You are not authorized to modify this tournament.");
      navigate(`/dashboard/fighting?tournament=${initialTournament.id}`, { replace: true });
    }
  }, [tournament, user, initialTournament.id, navigate]);

  // Ajouter un effet pour le calcul initial du temps estimé
  useEffect(() => {
    if (isOpen && formData.tournament_type && formData.max_teams && formData.rounds) {
      calculateEstimatedTime(formData.tournament_type, formData.max_teams, formData.rounds);
    }
  }, [isOpen, formData.tournament_type, formData.max_teams, formData.rounds]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Si le type de tournoi ou le nombre d'équipes change, recalculer le temps estimé
      if (name === 'max_teams' || name === 'tournament_type') {
        calculateEstimatedTime(
          name === 'tournament_type' ? value : newData.tournament_type,
          name === 'max_teams' ? value : newData.max_teams,
          newData.rounds
        );
      }
      
      return newData;
    });
  };

  const validateForm = () => {
    if (!formData.name) {
      toast.error("Please enter a tournament name");
      return false;
    }
    
    // Accepter les valeurs numériques et les chaînes du backend
    const validTournamentTypes = [0, 1, 2, "0", "1", "2", "showtime_survival", "showtime_score", "arena"];
    if (!validTournamentTypes.includes(formData.tournament_type)) {
      toast.error("Please select a valid tournament format");
      return false;
    }
    
    if (formData.status === undefined || formData.status === null) {
      toast.error("Please select a valid status");
      return false;
    }
    
    if (![0, 1, 2, 3, 4, "0", "1", "2", "3", "4"].includes(formData.status)) {
      toast.error("Please select a valid status");
      return false;
    }
    
    const teamsCount = parseInt(formData.max_teams);
    
    if (isNaN(teamsCount) || teamsCount <= 1) {
      toast.error("The team number must be greater than 1");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Vérifier si l'utilisateur réduit le nombre d'équipes
    const currentMaxTeams = tournament ? tournament.max_teams : 0;
    const newMaxTeams = parseInt(formData.max_teams);
    
    if (newMaxTeams < currentMaxTeams) {
      // Confirmer la réduction du nombre d'équipes
      if (!window.confirm(
        "Reducing the number of teams might result in teams being deleted. " +
        "Teams with the highest IDs will be removed first. " +
        "If there are players in these teams, they will also be removed. " +
        "Do you want to continue?"
      )) {
        return;
      }
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Transformer les données pour l'API
      const tournamentData = {
        name: formData.name,
        tournament_type: convertTournamentTypeForBackend(formData.tournament_type),
        rules: formData.rules || "Standard rules",
        max_teams: parseInt(formData.max_teams),
        status: parseInt(formData.status),
        agent_level_required: parseInt(formData.agent_level_required),
        rounds: parseInt(formData.rounds),
        auto_create_teams: true // Utiliser le paramètre existant dans le modèle
      };
      
      if (formData.entry_code) {
        tournamentData.entry_code = formData.entry_code;
      }
      
      // Assurer que max_teams est bien un nombre
      tournamentData.max_teams = parseInt(tournamentData.max_teams);
      
      // Créer un objet séparé pour les options supplémentaires qui ne font pas partie du modèle Tournament
      const options = {
        delete_higher_id_teams: newMaxTeams < currentMaxTeams,
        create_missing_teams: true
      };
      
      const response = await kyInstance.put(`v1/tournaments/${initialTournament.id}`, {
        json: {
          tournament: tournamentData,
          options: options
        }
      }).json();
      
      toast.success("Tournament updated successfully!");
      
      // Appeler le callback de mise à jour et fermer le modal
      onTournamentUpdated && onTournamentUpdated(response);
      onClose();
    } catch (err) {
      console.error("Error updating tournament:", err);
      let errorMessage = "Failed to update tournament. Please try again.";
      
      if (err.response) {
        try {
          const errorData = await err.response.json();
          console.error("Error response data:", errorData);
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (e) {
          console.error("Error parsing error response:", e);
        }
      } else if (err.responseData?.error) {
        errorMessage = err.responseData.error;
      }
      
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="flex relative w-full max-w-6xl items-center justify-center">
        <Card className="bg-gray-900 border-gray-700 text-white w-[90vw] md:w-[80vw] relative overflow-hidden">
          <div className="md:max-h-none max-h-[80vh] md:overflow-y-visible overflow-y-auto relative z-10">
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              onClick={onClose}
            >
              <X size={40} />
            </button>
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-xl xl:text-3xl text-primary text-center font-bold">
              EDIT TOURNAMENT
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <label className="text-white font-bold">Tournament Format</label>
                    <div className="relative group/format">
                      <Info size={20} className="text-gray-400 hover:text-primary cursor-help" />
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 bg-[rgba(0,0,0,0.8)] text-white text-sm rounded-lg opacity-0 group-hover/format:opacity-100 transition-opacity duration-200 pointer-events-none z-[1000] w-48">
                        <p className="break-words">
                          'Showtime - Survival' is a tournament for a single Boss where players have to survive as long as possible during 1 or more matches to earn as many time points as possible for their team to win the tournament. Be careful, the Boss score also counts as a tie-breaker.
                          <br /><br />
                          'Showtime - Score counter' is a tournament for a single Boss where players have to do as much as possible score during 1 or more matches to earn as many points as possible for their team to win the tournament. Be careful, the life left also counts as a tie-breaker.
                          <br /><br />
                          'Arena' is a knockout tournament team versus team where you will have to win round(s) with Home/Away match(es).
                        </p>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-black"></div>
                      </div>
                    </div>
                  </div>
                  <Select 
                    value={formData.tournament_type} 
                    onValueChange={(value) => handleSelectChange("tournament_type", value)}
                    disabled={formData.status > 1}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem value="0">Showtime - Survival</SelectItem>
                      <SelectItem value="1">Showtime - Score Counter</SelectItem>
                      <SelectItem value="2" disabled={true}>Arena (soon)</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  
                  <div className="flex items-center gap-2 mt-6">
                    <label className="text-white font-bold">Team slots</label>
                    <div className="relative group/slots">
                      <Info size={20} className="text-gray-400 hover:text-primary cursor-help" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[rgba(0,0,0,0.8)] text-white text-sm rounded-lg opacity-0 group-hover/slots:opacity-100 transition-opacity duration-200 pointer-events-none z-[1000] w-48">
                        <p className="break-words">
                          Total number of teams in the tournament.
                        </p>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black"></div>
                      </div>
                    </div>
                  </div>
                  <Select 
                    value={formData.max_teams.toString()} 
                    onValueChange={(value) => handleSelectChange("max_teams", value)}
                    disabled={formData.status > 1}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue>{formData.max_teams}</SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      {(formData.tournament_type === "2" || formData.tournament_type === 2 || formData.tournament_type === "arena") ? 
                        [2, 4, 8].map(num => (
                          <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                        )) : 
                        [2, 3, 4, 5, 6, 7, 8].map(num => (
                          <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                  
                  <div className="flex items-center gap-2 mt-6">
                    <label className="text-white font-bold">Player(s) per team</label>
                    <div className="relative group/players">
                      <Info size={20} className="text-gray-400 hover:text-primary cursor-help" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[rgba(0,0,0,0.8)] text-white text-sm rounded-lg opacity-0 group-hover/players:opacity-100 transition-opacity duration-200 pointer-events-none z-[1000] w-48">
                        <p className="break-words">
                          Total number of player(s) per team in the tournament.
                        </p>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black"></div>
                      </div>
                    </div>
                  </div>
                  <Select 
                    value={formData.players_per_team.toString()} 
                    onValueChange={(value) => handleSelectChange("players_per_team", value)}
                    disabled={true}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue>{formData.players_per_team}</SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      {[1, 2, 3, 4, 5].map(num => (
                        <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <div className="flex items-center gap-2 mt-6">
                    <label className="text-white font-bold">Number of rounds</label>
                    <div className="relative group/rounds">
                      <Info size={20} className="text-gray-400 hover:text-primary cursor-help" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[rgba(0,0,0,0.8)] text-white text-sm rounded-lg opacity-0 group-hover/rounds:opacity-100 transition-opacity duration-200 pointer-events-none z-[1000] w-48">
                        <p className="break-words">
                          Total number of round(s) in the tournament.
                        </p>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black"></div>
                      </div>
                    </div>
                  </div>
                  <Select 
                    value={formData.rounds} 
                    onValueChange={(value) => handleSelectChange("rounds", value)}
                    defaultValue={formData.rounds}
                    disabled={true}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue>
                        {formData.rounds === "1" && "1 Round"}
                        {formData.rounds === "3" && "3 Rounds"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem value="1">1 Round</SelectItem>
                      <SelectItem value="3">3 Rounds</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-4 md:col-span-2">
                  <div className="flex items-center gap-2">
                    <label className="text-white font-bold">Tournament name</label>
                    <div className="relative group/name">
                      <Info size={20} className="text-gray-400 hover:text-primary cursor-help" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[rgba(0,0,0,0.8)] text-white text-sm rounded-lg opacity-0 group-hover/name:opacity-100 transition-opacity duration-200 pointer-events-none z-[1000] w-48">
                        <p className="break-words">
                          Tournament name is limited by 40 characters.
                        </p>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black"></div>
                      </div>
                    </div>
                  </div>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Enter tournament name"
                    maxLength={40}
                  />
                  
                  <div className="flex items-center gap-2 mt-6">
                    <label className="text-white font-bold">Tournament rules</label>
                    <div className="relative group/rules">
                      <Info size={20} className="text-gray-400 hover:text-primary cursor-help" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[rgba(0,0,0,0.8)] text-white text-sm rounded-lg opacity-0 group-hover/rules:opacity-100 transition-opacity duration-200 pointer-events-none z-[1000] w-48">
                        <p className="break-words">
                          Rules of the tournament.
                        </p>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black"></div>
                      </div>
                    </div>
                  </div>
                  <Textarea
                    name="rules"
                    value={formData.rules}
                    onChange={handleInputChange}
                    className="bg-gray-800 border-gray-700 text-white h-28"
                    placeholder="Enter tournament details/rules"
                  />
                  
                  <div className="flex items-center gap-2 mt-6">
                    <label className="text-white font-bold">Agent Level required</label>
                    <div className="relative group/level">
                      <Info size={20} className="text-gray-400 hover:text-primary cursor-help" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[rgba(0,0,0,0.8)] text-white text-sm rounded-lg opacity-0 group-hover/level:opacity-100 transition-opacity duration-200 pointer-events-none z-[1000] w-48">
                        <p className="break-words">
                          User level required to join the tournament.
                        </p>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black"></div>
                      </div>
                    </div>
                  </div>
                  <Input
                    value={formData.agent_level_required}
                    className="bg-gray-800 border-gray-700 text-white"
                    disabled={true}
                  />
                  
                  <div className="flex items-center gap-2 mt-6">
                    <label className="text-white font-bold">Tournament entry code</label>
                    <div className="relative group/code">
                      <Info size={20} className="text-gray-400 hover:text-primary cursor-help" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[rgba(0,0,0,0.8)] text-white text-sm rounded-lg opacity-0 group-hover/code:opacity-100 transition-opacity duration-200 pointer-events-none z-[1000] w-48">
                        <p className="break-words">
                          Code required to join the tournament.
                        </p>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black"></div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-800 border border-gray-700 text-white p-3 rounded-md">
                    {formData.entry_code ? "Yes" : "No"}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-row lg:h-12">

              <div className="flex flex-col lg:flex-row py-2 w-3/4 lg:w-5/6 items-center justify-start">
                <h3 className="text-sm sm:text-lg font-bold text-white xs:w-full">Tournament matches time estimation :</h3>
                <div className="flex flex-row justify-center items-center px-4 gap-6">
                  <div className="text-sm sm:text-lg text-white">{estimatedMatches} Matches</div>
                  <div className="text-sm sm:text-lg text-primary">
                    {estimatedTime} Minutes ({Math.floor(estimatedTime/60) > 0 ? `${Math.floor(estimatedTime/60)}h` : ""}{estimatedTime % 60 > 0 ? `${estimatedTime % 60}` : ""})
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col lg:flex-row item-end lg:items-center justify-center lg:justify-end w-1/4 lg:w-1/6">
                <Button 
                  type="submit" 
                  className="justify-center whitespace-nowrap rounded-md text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-background shadow hover:bg-primary/90 font-bold uppercase h-12 px-8 py-2 flex items-center gap-2 transition-transform duration-200 hover:scale-105"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "VALIDATE"}
                </Button>
              </div>

            </div>
            </form>
          </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Fonction pour convertir le type de tournoi pour le backend (si nécessaire)
const convertTournamentTypeForBackend = (type) => {
  if (type === "showtime_survival") return 0;
  if (type === "showtime_score") return 1;
  if (type === "arena") return 2;
  return parseInt(type);
};

// Fonction pour obtenir le texte du format de tournoi
const getTournamentFormatText = (type) => {
  if (type === "showtime_survival" || type === "0" || type === 0) return "Showtime-Survival";
  if (type === "showtime_score" || type === "1" || type === 1) return "Showtime-Score Counter";
  if (type === "arena" || type === "2" || type === 2) return "Arena";
  return "Unknown";
}; 