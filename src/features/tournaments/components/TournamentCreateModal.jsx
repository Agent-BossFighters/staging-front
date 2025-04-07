import { useState, useEffect } from "react";
import { kyInstance } from "@utils/api/ky-config";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shared/ui/select";
import { Textarea } from "@shared/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { Info, X } from "lucide-react";
import toast from "react-hot-toast";

export default function TournamentCreateModal({ isOpen, onClose, onSuccess }) {
  if (!isOpen) return null;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    tournament_type: "0", // 0 = Showtime (Survival)
    rounds: "1", // 1 round par défaut
    rules: "",
    agent_level_required: 0,
    players_per_team: 4,
    max_teams: 8,
    entry_code: ""
  });
  
  // Estimation du temps de matchs
  const [estimatedMatches, setEstimatedMatches] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState("0");
  
  // Calculer le nombre de matchs et le temps estimé
  useEffect(() => {
    const teamsCount = parseInt(formData.max_teams) || 0;
    const tournamentType = parseInt(formData.tournament_type);
    const roundsCount = parseInt(formData.rounds) || 1;
    
    // Calcul basique pour l'exemple
    let matches = 0;
    let timeInMinutes = 0;
    
    if (tournamentType === 0 || tournamentType === 1) { // Showtime
      matches = teamsCount * roundsCount; // Each team plays one match per round
      timeInMinutes = matches * 10; // ~10 minutes per match
    } else if (tournamentType === 2) { // Arena
      matches = Math.ceil((teamsCount * (teamsCount - 1)) / 2); // Formula for all possible matches
      timeInMinutes = matches * 10; // ~10 minutes per match
    }
    
    setEstimatedMatches(matches);
    setEstimatedTime(timeInMinutes);
  }, [formData.max_teams, formData.tournament_type, formData.rounds]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name) {
      toast.error("Please enter a tournament name");
      return false;
    }
    
    const tournamentType = parseInt(formData.tournament_type);
    const teamsCount = parseInt(formData.max_teams);
    const playersCount = parseInt(formData.players_per_team);
    
    if (isNaN(teamsCount) || teamsCount < 2) {
      toast.error("The team number must be at least 2");
      return false;
    }
    
    if (isNaN(playersCount) || playersCount < 1) {
      toast.error("The number of players per team must be at least 1");
      return false;
    }
    
    // Validation spécifique pour Arena
    if (tournamentType === 2 && playersCount !== 5) {
      toast.error("Arena tournaments must have exactly 5 players per team");
      return false;
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
        rounds: parseInt(formData.rounds),
        rules: formData.rules || "Standard rules",
        agent_level_required: parseInt(formData.agent_level_required),
        players_per_team: parseInt(formData.players_per_team),
        min_players_per_team: parseInt(formData.players_per_team), // Simplified
        max_teams: parseInt(formData.max_teams),
        status: 1 // 1 = open (au lieu de "pending")
      };
      
      // Ajouter le code d'entrée si fourni
      if (formData.entry_code && formData.entry_code.trim() !== "") {
        tournamentData.entry_code = formData.entry_code;
      }
      
      console.log("Sending tournament data:", tournamentData);
      
      const response = await kyInstance.post('v1/tournaments', {
        json: {
          tournament: tournamentData
        }
      }).json();
      
      console.log("Tournament creation response:", response);
      
      toast.success("Tournament created successfully!");
      
      // Notifier que la création est réussie
      if (onSuccess) {
        let tournamentId = null;
        
        if (response.tournament && response.tournament.id) {
          tournamentId = response.tournament.id;
        } else if (response.data && response.data.id) {
          tournamentId = response.data.id;
        } else if (response.id) {
          tournamentId = response.id;
        }
        
        onSuccess(tournamentId);
      }
    } catch (err) {
      console.error("Error creating tournament:", err);
      let errorMessage = "Failed to create tournament. Please try again.";
      
      if (err.responseData?.error) {
        errorMessage = err.responseData.error;
      }
      
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80">
      <Card className="bg-gray-900 border-gray-700 text-white max-w-4xl relative">
        <CardHeader>
          <CardTitle className="text-3xl text-yellow-400 text-center font-bold">
            CREATE A TOURNAMENT
          </CardTitle>
          <button 
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
            onClick={onClose}
          >
            <X size={24} />
          </button>
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
                
                {(parseInt(formData.tournament_type) === 0 || parseInt(formData.tournament_type) === 1) && (
                  <>
                    <div className="flex items-center justify-between mt-6">
                      <label className="text-white font-medium">Nombre de rounds</label>
                      <Info className="h-5 w-5 text-gray-400" />
                    </div>
                    <Select 
                      value={formData.rounds} 
                      onValueChange={(value) => handleSelectChange("rounds", value)}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Select rounds" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        <SelectItem value="1">1 Round</SelectItem>
                        <SelectItem value="3">3 Rounds</SelectItem>
                      </SelectContent>
                    </Select>
                  </>
                )}
                
                <div className="flex items-center justify-between mt-6">
                  <label className="text-white font-medium">Team slots</label>
                  <Info className="h-5 w-5 text-gray-400" />
                </div>
                <Select 
                  value={formData.max_teams.toString()} 
                  onValueChange={(value) => handleSelectChange("max_teams", value)}
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
                <Select 
                  value={formData.entry_code ? "Yes" : "No"} 
                  onValueChange={(value) => {
                    if (value === "No") {
                      setFormData(prev => ({ ...prev, entry_code: "" }));
                    } else {
                      setFormData(prev => ({ ...prev, entry_code: "random" }));
                    }
                  }}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="No">No</SelectItem>
                    <SelectItem value="Yes">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="py-4 border-t border-gray-700">
              <h3 className="text-lg text-white">Estimated tournament matches time :</h3>
              <div className="grid grid-cols-1 gap-2 mt-4">
                <div className="text-2xl font-bold text-white">{estimatedMatches} Matches</div>
                <div className="text-2xl font-bold text-yellow-400">
                  {estimatedTime} Minutes ({Math.floor(estimatedTime/60) > 0 ? `${Math.floor(estimatedTime/60)}h` : ""}{estimatedTime % 60 > 0 ? `${estimatedTime % 60}` : ""}00)
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-6">
              <Button 
                type="submit" 
                className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-2 text-lg"
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "VALIDATE"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 