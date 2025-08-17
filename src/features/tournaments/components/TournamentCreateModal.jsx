import { useState, useEffect } from "react";
import { kyInstance } from "@utils/api/ky-config";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shared/ui/select";
import { Textarea } from "@shared/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { Info, X } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@context/auth.context";

export default function TournamentCreateModal({ isOpen, onClose, onSuccess }) {
  if (!isOpen) return null;

  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [entryCodeCopied, setEntryCodeCopied] = useState(false);

  
  // Générer un code aléatoire de 6 caractères
  const generateRandomCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Exclus des caractères qui peuvent prêter à confusion
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };
  
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
  
  // Générer les règles en fonction du type de tournoi et des paramètres
  useEffect(() => {
    const tournamentType = parseInt(formData.tournament_type);
    const teamsCount = parseInt(formData.max_teams) || 0;
    const playersCount = parseInt(formData.players_per_team) || 0;
    const roundsCount = parseInt(formData.rounds) || 1;
    const roundWord = roundsCount === 1 ? "Round" : "Rounds";
    const creatorName = user?.username || "Tournament Host";

    let rulesText = "";
    
    if (tournamentType === 0) { // Showtime Survival
      rulesText = `Take on Boss ${creatorName} in a tournament of ${teamsCount} teams of ${playersCount} player(s), where players will try to survive as long as possible over ${roundsCount} ${roundWord}.\n
One rule survive without killing the boss !`;
    } else if (tournamentType === 1) { // Showtime Score Counter
      rulesText = `Take on Boss ${creatorName} in a tournament of ${teamsCount} teams of ${playersCount} player(s), where players will try to score as many points score as possible against the boss over ${roundsCount} ${roundWord} for a total team score.\n
One rule survive and kill the Boss!`;
    } else if (tournamentType === 2) { // Arena
      const boFormat = roundsCount === 1 ? "BO1" : "BO3";
      rulesText = `"Team vs Team" with ${teamsCount} teams of ${playersCount} players in ${roundsCount} ${roundWord} (${boFormat}) format. May the best team win!`;
    }
    
    if (rulesText) {
      setFormData(prev => ({ ...prev, rules: rulesText }));
    }
  }, [formData.tournament_type, formData.max_teams, formData.players_per_team, formData.rounds, user?.username]);
  
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
    
    // Vérifier que le code d'entrée est valide s'il est fourni
    if (formData.entry_code && formData.entry_code.length < 4) {
      toast.error("Entry code must be at least 4 characters long");
      return false;
    }
    
    return true;
  };

  const handleCreateTournament = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validation supplémentaire
      if (!validateForm()) {
        setIsLoading(false);
        return;
      }

      // Générer le code aléatoire côté client si nécessaire
      if (formData.entry_code) {
        // On génère un code aléatoire de 6 caractères
        const entryCode = generateRandomCode();
        // On le stocke pour l'utiliser dans la requête
        formData.generated_code = entryCode;
      }

      // Créer le tournoi
      const tournamentData = {
        name: formData.name,
        tournament_type: parseInt(formData.tournament_type),
        rounds: parseInt(formData.rounds),
        rules: formData.rules || "Standard rules",
        agent_level_required: parseInt(formData.agent_level_required),
        players_per_team: parseInt(formData.players_per_team),
        min_players_per_team: parseInt(formData.players_per_team),
        max_teams: parseInt(formData.max_teams),
        status: 1,
        auto_create_teams: true 
      };

      // Ajouter le code d'entrée uniquement si demandé
      if (formData.entry_code) {
        tournamentData.entry_code = formData.generated_code;
      }

      const tournamentResponse = await kyInstance.post('v1/tournaments', {
        json: tournamentData
      }).json();
      
      const tournamentId = tournamentResponse.id || tournamentResponse.tournament?.id;

      if (!tournamentId) {
        throw new Error("Failed to get tournament ID from response");
      }

      toast.success("Tournament created successfully with empty teams!");
      if (onSuccess) {
        onSuccess(tournamentId);
      }
    } catch (err) {
      console.error("Error in tournament creation process:", err);
      const errorMessage = err.message || err.response?.data?.error || "Failed to create tournament";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Copier le code dans le presse-papier
  const copyEntryCodeToClipboard = () => {
    if (formData.entry_code) {
      navigator.clipboard.writeText(formData.entry_code)
        .then(() => {
          setEntryCodeCopied(true);
          setTimeout(() => setEntryCodeCopied(false), 2000);
        })
        .catch(err => {
          console.error('Error when copying the code:', err);
          toast.error("Impossible to copy the code");
        });
    }
  };

return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80">
      <Card className="bg-gray-900 border-gray-700 text-white w-[90vw] md:w-[80vw] relative overflow-hidden">
        <div className="md:max-h-none max-h-[80vh] md:overflow-y-visible overflow-y-auto relative z-10">
          <CardHeader>
            <CardTitle className="text-xl xl:text-3xl text-primary text-center font-bold">
              CREATE A TOURNAMENT
            </CardTitle>
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              onClick={onClose}
            >
              <X size={40} />
            </button>
          </CardHeader>
          
          <CardContent>
          <form onSubmit={handleCreateTournament} className="space-y-8 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <label className="text-white font-bold">Tournament format</label>
                  <div className="relative group/format">
                    <Info size={20} className="text-gray-400 hover:text-primary cursor-help" />
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 bg-[rgba(0,0,0,0.8)] text-white text-sm rounded-lg opacity-0 group-hover/format:opacity-100 transition-opacity duration-200 pointer-events-none z-[1000] w-64">
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
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select type" />
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
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select slots" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    {parseInt(formData.tournament_type) === 2 
                      ? [2, 4, 8].map(num => (
                        <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                      ))
                      : [2, 3, 4, 5, 6, 7, 8].map(num => (
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
                {(parseInt(formData.tournament_type) === 0 || parseInt(formData.tournament_type) === 1) && (
                  <>
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
                  type="number"
                  name="agent_level_required"
                  value={formData.agent_level_required}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value) && value >= 0) {
                      handleInputChange(e);
                    } else if (e.target.value === "") {
                      setFormData(prev => ({ ...prev, agent_level_required: 0 }));
                    }
                  }}
                  min="0"
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="Enter agent level"
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
                <Select 
                  value={formData.entry_code ? "Yes" : "No"} 
                  onValueChange={(value) => {
                    if (value === "No") {
                      setFormData(prev => ({ ...prev, entry_code: "" }));
                    } else {
                      // On marque simplement qu'un code est requis, sans le générer ni l'afficher
                      setFormData(prev => ({ ...prev, entry_code: "REQUIRED" }));
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
                
                {formData.entry_code && (
                  <div className="mt-2">
                    <p className="text-gray-400 text-sm">
                      An entry code will be generated for this tournament. You will be able to view and copy it after tournament creation.
                    </p>
                  </div>
                )}
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
                  {isLoading ? "Creating..." : "VALIDATE"}
                </Button>
              </div>

            </div>
            
          </form>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}