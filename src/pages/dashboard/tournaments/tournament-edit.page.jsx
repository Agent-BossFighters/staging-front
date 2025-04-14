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
      
      setFormData({
        name: tournament.name || "",
        tournament_type: tournament.tournament_type?.toString() || "0",
        rules: tournament.rules || "",
        agent_level_required: tournament.agent_level_required || 0,
        players_per_team: tournament.players_per_team || 4,
        min_players_per_team: tournament.min_players_per_team || tournament.players_per_team || 4,
        max_teams: tournament.max_teams || 8,
        entry_code: tournament.entry_code || "",
        status: status,
        boss_id: tournament.creator_id || user?.id || null
      });
    }
  }, [tournament]);
  
  // Calculer le nombre de matchs et le temps estimé
  useEffect(() => {
    const teamsCount = parseInt(formData.max_teams) || 0;
    const tournamentType = parseInt(formData.tournament_type);
    
    // Calcul basique pour l'exemple
    let matches = 0;
    let timeInMinutes = 0;
    
    if (tournamentType === 0 || tournamentType === 1) { // Survival
      matches = teamsCount; // Chaque équipe fait un match
      timeInMinutes = matches * 10; // ~10 minutes par match
    } else if (tournamentType === 2) { // Arena
      matches = Math.ceil((teamsCount * (teamsCount - 1)) / 2); // Formule pour tous les matchs possibles
      timeInMinutes = matches * 10; // ~10 minutes par match
    }
    
    setEstimatedMatches(matches);
    setEstimatedTime(timeInMinutes);
  }, [formData.max_teams, formData.tournament_type]);

  // Vérifier si l'utilisateur est autorisé à modifier le tournoi
  useEffect(() => {
    if (tournament && user && tournament.creator_id !== user.id) {
      toast.error("Vous n'êtes pas autorisé à modifier ce tournoi.");
      navigate(`/dashboard/fighting?tournament=${initialTournament.id}`, { replace: true });
    }
  }, [tournament, user, initialTournament.id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name) {
      toast.error("Thank to enter a tournament name");
      return false;
    }
    
    if (formData.tournament_type === undefined || formData.tournament_type === null) {
      toast.error("Thank to select a valid tournament format");
      return false;
    }
    
    if (![0, 1, 2, "0", "1", "2"].includes(formData.tournament_type)) {
      toast.error("Thank to select a valid tournament format");
      return false;
    }
    
    if (formData.status === undefined || formData.status === null) {
      toast.error("Thank to select a valid status");
      return false;
    }
    
    if (![0, 1, 2, 3, 4, "0", "1", "2", "3", "4"].includes(formData.status)) {
      toast.error("Thank to select a valid status");
      return false;
    }
    
    const tournamentType = parseInt(formData.tournament_type);
    const teamsCount = parseInt(formData.max_teams);
    const playersCount = parseInt(formData.players_per_team);
    const minPlayersCount = parseInt(formData.min_players_per_team);
    const agentLevel = parseInt(formData.agent_level_required);
    
    if (isNaN(teamsCount) || teamsCount <= 1) {
      toast.error("The team number must be greater than 1");
      return false;
    }
    
    if (isNaN(playersCount) || playersCount < 1) {
      toast.error("The number of players per team must be a positive integer");
      return false;
    }
    
    if (playersCount > 5) {
      toast.error("The number of players per team cannot exceed 5");
      return false;
    }
    
    if (isNaN(agentLevel) || agentLevel < 0) {
      toast.error("The agent level required must be a positive integer or 0");
      return false;
    }
    
    // Validation pour Showtime (type 0 ou 1)
    if (tournamentType === 0 || tournamentType === 1) {
      if (!formData.boss_id) {
        toast.error("For Showtime tournaments, a boss_id is required");
        return false;
      }
      
      if (playersCount < 1 || playersCount > 4) {
        toast.error("For Showtime tournaments, the number of players per team must be between 1 and 4");
        return false;
      }
    }
    
    // Validation spécifique pour Arena (type 2)
    if (tournamentType === 2) {
      if (playersCount !== 5) {
        toast.error("Arena tournaments must have exactly 5 players per team");
        return false;
      }
      
      if (isNaN(minPlayersCount) || minPlayersCount <= 2) {
        toast.error("For Arena tournaments, the minimum number of players per team must be greater than 2");
        return false;
      }
    }
    
    // Validation du champ rounds (si présent dans le formulaire)
    if (formData.rounds !== undefined) {
      const rounds = parseInt(formData.rounds);
      if (isNaN(rounds) || rounds <= 0) {
        toast.error("The number of rounds must be a positive integer");
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Transformer les données pour l'API
      const tournamentData = {
        name: formData.name,
        tournament_type: parseInt(formData.tournament_type),
        rules: formData.rules || "Règles standard",
        agent_level_required: parseInt(formData.agent_level_required),
        players_per_team: parseInt(formData.players_per_team),
        min_players_per_team: parseInt(formData.min_players_per_team),
        max_teams: parseInt(formData.max_teams),
        status: parseInt(formData.status),
        boss_id: formData.boss_id
      };
      
      // Ajouter le code d'entrée si fourni
      if (formData.entry_code && formData.entry_code.trim() !== "") {
        tournamentData.entry_code = formData.entry_code;
      }
      
      console.log("Sending updated tournament data:", tournamentData);
      
      const response = await kyInstance.put(`v1/tournaments/${initialTournament.id}`, {
        json: {
          tournament: tournamentData
        }
      }).json();
      
      console.log("Tournament update response:", response);
      
      toast.success("Tournament updated successfully!");
      
      // Appeler le callback de mise à jour et fermer le modal
      onTournamentUpdated && onTournamentUpdated(response);
      onClose();
    } catch (err) {
      console.error("Error updating tournament:", err);
      let errorMessage = "Failed to update tournament. Please try again.";
      
      if (err.responseData?.error) {
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
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-3xl primary text-center font-bold">
              EDIT TOURNAMENT
            </CardTitle>
            <Button
              variant="ghost"
              className="text-gray-400 hover:text-white"
              onClick={onClose}
            >
              <X className="h-6 w-6" />
            </Button>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-white font-medium">Tournament format</label>
                    <Info className="h-5 w-5 text-gray-400" />
                  </div>
                  <Select 
                    value={formData.tournament_type} 
                    onValueChange={(value) => handleSelectChange("tournament_type", value)}
                    disabled={formData.status > 1} // Désactiver si le tournoi est en cours ou terminé
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem value="0">Showtime (Survival)</SelectItem>
                      <SelectItem value="1">Showtime (Score Counter)</SelectItem>
                      <SelectItem value="2">Arena</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="flex items-center justify-between mt-6">
                    <label className="text-white font-medium">Team slots</label>
                    <Info className="h-5 w-5 text-gray-400" />
                  </div>
                  <Select 
                    value={formData.max_teams.toString()} 
                    onValueChange={(value) => handleSelectChange("max_teams", value)}
                    disabled={formData.status > 1} // Désactiver si le tournoi est en cours ou terminé
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select slots" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      {[2, 4, 8, 16, 32].map(num => (
                        <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <div className="flex items-center justify-between mt-6">
                    <label className="text-white font-medium">Player(s) per team</label>
                    <Info className="h-5 w-5 text-gray-400" />
                  </div>
                  <Select 
                    value={formData.players_per_team.toString()} 
                    onValueChange={(value) => handleSelectChange("players_per_team", value)}
                    disabled={formData.status > 1} // Désactiver si le tournoi est en cours ou terminé
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select players" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      {Array.from({length: parseInt(formData.tournament_type) === 2 ? 1 : 4}, (_, i) => i + (parseInt(formData.tournament_type) === 2 ? 5 : 1)).map(num => (
                        <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <div className="flex items-center justify-between mt-6">
                    <label className="text-white font-medium">Min players per team</label>
                    <Info className="h-5 w-5 text-gray-400" />
                  </div>
                  <Select 
                    value={formData.min_players_per_team.toString()} 
                    onValueChange={(value) => handleSelectChange("min_players_per_team", value)}
                    disabled={formData.status > 1} // Désactiver si le tournoi est en cours ou terminé
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select min players" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      {Array.from({length: parseInt(formData.players_per_team)}, (_, i) => i + 1).map(num => (
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
                      <SelectValue placeholder="Select status" />
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
                  <Select 
                    value={formData.agent_level_required.toString()} 
                    onValueChange={(value) => handleSelectChange("agent_level_required", value)}
                    disabled={formData.status > 1} // Désactiver si le tournoi est en cours ou terminé
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      {[0, 1, 2, 3, 4, 5].map(num => (
                        <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <div className="flex items-center justify-between mt-6">
                    <label className="text-white font-medium">Tournament entry code</label>
                    <Info className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    name="entry_code"
                    value={formData.entry_code}
                    onChange={handleInputChange}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Laissez vide pour ne pas utiliser de code"
                    disabled={formData.status > 1} // Désactiver si le tournoi est en cours ou terminé
                  />
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