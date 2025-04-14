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
      toast.error("Vous n'êtes pas autorisé à modifier ce tournoi.");
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

  const statusOptions = [
    { value: "0", label: "Draft" },
    { value: "1", label: "Open" },
    { value: "2", label: "In Progress" },
    { value: "3", label: "Completed" },
    { value: "4", label: "Cancelled" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="relative w-full max-w-6xl">
        <Card className="bg-gray-900 border-gray-700 text-white">
            <Button
              variant="ghost"
              className="absolute top-0 right-0 text-gray-400 hover:text-white"
              onClick={onClose}
            >
              <X className="h-6 w-6" />
            </Button>
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-3xl primary text-center font-bold">
              EDIT TOURNAMENT
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-white font-medium">Tournament Format</label>
                    <Info className="h-5 w-5 text-gray-400" />
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
                      <SelectItem value="0">Showtime-Survival</SelectItem>
                      <SelectItem value="1">Showtime-Score Counter</SelectItem>
                      <SelectItem value="2">Arena</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="flex items-center justify-between mt-6">
                    <label className="text-white font-medium">Number of rounds</label>
                    <Info className="h-5 w-5 text-gray-400" />
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
                  
                  <div className="flex items-center justify-between mt-6">
                    <label className="text-white font-medium">Team slots</label>
                    <Info className="h-5 w-5 text-gray-400" />
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
                  
                  <div className="flex items-center justify-between mt-6">
                    <label className="text-white font-medium">Player(s) per team</label>
                    <Info className="h-5 w-5 text-gray-400" />
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
                  
                  <div className="flex items-center justify-between mt-6">
                    <label className="text-white font-medium">Tournament status</label>
                    <Info className="h-5 w-5 text-gray-400" />
                  </div>
                  <Select 
                    value={formData.status.toString()} 
                    onValueChange={(value) => handleSelectChange("status", value)}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue>
                        {formData.status === 0 || formData.status === "0" ? "Draft" : ""}
                        {formData.status === 1 || formData.status === "1" ? "Open" : ""}
                        {formData.status === 2 || formData.status === "2" ? "In Progress" : ""}
                        {formData.status === 3 || formData.status === "3" ? "Completed" : ""}
                        {formData.status === 4 || formData.status === "4" ? "Cancelled" : ""}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      {statusOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-4 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="text-white font-medium">Tournament name</label>
                    <Info className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Enter tournament name"
                  />
                  
                  <div className="flex items-center justify-between mt-6">
                    <label className="text-white font-medium">Tournament rules</label>
                    <Info className="h-5 w-5 text-gray-400" />
                  </div>
                  <Textarea
                    name="rules"
                    value={formData.rules}
                    onChange={handleInputChange}
                    className="bg-gray-800 border-gray-700 text-white h-28"
                    placeholder="Enter tournament details/rules"
                  />
                  
                  <div className="flex items-center justify-between mt-6">
                    <label className="text-white font-medium">Agent Level required</label>
                    <Info className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    value={formData.agent_level_required}
                    className="bg-gray-800 border-gray-700 text-white"
                    disabled={true}
                  />
                  
                  <div className="flex items-center justify-between mt-6">
                    <label className="text-white font-medium">Tournament entry code</label>
                    <Info className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="bg-gray-800 border border-gray-700 text-white p-3 rounded-md">
                    {formData.entry_code ? "Yes" : "No"}
                  </div>
                </div>
              </div>
              
              <div className="py-4 border-t border-gray-700">
                <h3 className="text-lg text-white">Estimated tournament matches time :</h3>
                <div className="grid grid-cols-1 gap-2 mt-4">
                  <div className="text-2xl font-bold text-white">{estimatedMatches} Matches</div>
                  <div className="text-2xl font-bold primary">
                    {estimatedTime} Minutes ({Math.floor(estimatedTime/60) > 0 ? `${Math.floor(estimatedTime/60)}h` : ""}{estimatedTime % 60 > 0 ? `${estimatedTime % 60}` : ""})
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center gap-4 mt-6">
                <Button 
                  type="button"
                  className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-2 text-lg"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                
                <Button 
                  type="submit" 
                  className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-2 text-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2">⟳</span> Updating...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <CheckCircle size={18} className="mr-2" /> Save Changes
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
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