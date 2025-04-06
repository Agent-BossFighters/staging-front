import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { kyInstance } from "@utils/api/ky-config";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { Badge } from "@shared/ui/badge";
import { useAuth } from "@context/auth.context";
import { useTournament } from "@features/tournaments/hooks/useTournaments";
import { useTeamMembers } from "@features/tournaments/hooks/useTeamMembers";
import TeamMembersList from "@features/tournaments/components/TeamMembersList";
import toast from "react-hot-toast";

export default function TeamManagePage() {
  const { tournamentId, teamId } = useParams();
  const navigate = useNavigate();
  const [isCopied, setIsCopied] = useState(false);
  const { user } = useAuth();
  
  // Utilisation du hook personnalisé pour les membres d'équipe
  const { 
    members, 
    teamData: team, 
    captainId, 
    isUserCaptain, 
    isLoading, 
    error 
  } = useTeamMembers(tournamentId, teamId);
  
  // Hook pour obtenir les détails du tournoi (pour maxPlayers)
  const { tournament } = useTournament(tournamentId);

  const handleCopyInviteCode = () => {
    navigator.clipboard.writeText(team?.invitation_code || "");
    setIsCopied(true);
    toast.success("Code d'invitation copié dans le presse-papier !");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleLeaveTeam = async () => {
    if (!confirm("Êtes-vous sûr de vouloir quitter cette équipe ?")) return;
    
    try {
      await kyInstance.delete(`v1/tournaments/${tournamentId}/teams/${teamId}/leave`).json();
      toast.success("Vous avez quitté l'équipe.");
      navigate(`/dashboard/tournaments/${tournamentId}`);
    } catch (err) {
      console.error("Erreur lors du départ de l'équipe:", err);
      const errorMessage = err.responseData?.error || "Impossible de quitter l'équipe. Veuillez réessayer.";
      toast.error(errorMessage);
    }
  };

  const handleKickPlayer = async (playerId) => {
    if (!confirm("Êtes-vous sûr de vouloir retirer ce joueur de l'équipe ?")) return;
    
    try {
      await kyInstance.delete(`v1/tournaments/${tournamentId}/teams/${teamId}/kick/${playerId}`).json();
      toast.success("Joueur retiré de l'équipe.");
      window.location.reload();
    } catch (err) {
      console.error("Erreur lors de l'exclusion du joueur:", err);
      const errorMessage = err.responseData?.error || "Impossible de retirer le joueur. Veuillez réessayer.";
      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex justify-center">
        <div className="loader">Chargement des détails de l'équipe...</div>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="text-red-500 mb-4">Erreur : {error || "Équipe introuvable"}</div>
        <Link to={`/dashboard/tournaments/${tournamentId}`}>
          <Button variant="outline">Retour au Tournoi</Button>
        </Link>
      </div>
    );
  }

  // Extraction des informations additionnelles
  const maxPlayers = tournament?.players_per_team || 4;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link to={`/dashboard/tournaments/${tournamentId}`} className="text-yellow-400 hover:underline mb-2 inline-block">
            &larr; Retour au Tournoi
          </Link>
          <h1 className="text-2xl font-bold text-white">{team.name}</h1>
        </div>
        {isUserCaptain ? (
          <Badge className="bg-yellow-400 text-black">Capitaine d'équipe</Badge>
        ) : (
          <Badge className="bg-gray-600 text-white">Membre d'équipe</Badge>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="col-span-2">
          <Card className="bg-gray-800 border border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl text-yellow-400">Membres de l'équipe</CardTitle>
              <span className="text-gray-400">
                {members.length}/{maxPlayers}
              </span>
            </CardHeader>
            <CardContent>
              {/* Utilisation directe du composant avec les données normalisées */}
              <TeamMembersList 
                members={members} 
                maxPlayers={maxPlayers}
                captainId={captainId}
                isTeamCaptain={isUserCaptain}
                onKickPlayer={handleKickPlayer}
              />
              
              <div className="mt-6">
                <Button 
                  variant="destructive" 
                  className="w-full bg-red-600 hover:bg-red-700"
                  onClick={handleLeaveTeam}
                >
                  {isUserCaptain ? "Dissoudre l'équipe" : "Quitter l'équipe"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="bg-gray-800 border border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl text-yellow-400">Inviter des Joueurs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-1">
                  Code d'invitation de l'équipe
                </label>
                <div className="flex">
                  <Input
                    value={team.invitation_code || ""}
                    readOnly
                    className="bg-gray-700 border-gray-600 text-white focus:border-yellow-400 rounded-r-none"
                  />
                  <Button 
                    onClick={handleCopyInviteCode}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black rounded-l-none"
                  >
                    {isCopied ? "Copié !" : "Copier"}
                  </Button>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  Partagez ce code avec les joueurs pour les inviter à votre équipe.
                </p>
              </div>
              
              {isUserCaptain && (
                <div className="mt-6 p-4 bg-gray-700 rounded">
                  <h3 className="text-white font-medium mb-2">Contrôles du Capitaine</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    En tant que capitaine d'équipe, vous pouvez gérer les joueurs et les paramètres de l'équipe.
                  </p>
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-gray-600 text-gray-300"
                    disabled
                  >
                    Plus de paramètres (À venir)
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Bouton de rejoindre pour les visiteurs qui ne sont pas membres de l'équipe */}
      {!isUserCaptain && !members.some(m => m.playerId === user?.id) && (
        <div className="mt-6">
          <Button 
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-3 text-lg"
            onClick={async () => {
              if (!confirm("Êtes-vous sûr de vouloir rejoindre cette équipe ?")) return;
              
              try {
                await kyInstance.post(`v1/tournaments/${tournamentId}/teams/${teamId}/join`, {
                  json: {
                    invitation_code: team.invitation_code || ""  // Utiliser le code d'invitation de l'équipe
                  }
                }).json();
                toast.success("Vous avez rejoint l'équipe !");
                window.location.reload();
              } catch (err) {
                console.error("Erreur lors de la tentative de rejoindre l'équipe:", err);
                const errorMessage = err.responseData?.error || "Impossible de rejoindre l'équipe. Veuillez réessayer.";
                
                if (errorMessage.includes("invitation") || errorMessage.includes("code")) {
                  toast.error("Impossible de rejoindre sans code d'invitation. Demandez le code au capitaine.");
                } else {
                  toast.error(errorMessage);
                }
              }
            }}
          >
            REJOINDRE CETTE ÉQUIPE
          </Button>
        </div>
      )}
    </div>
  );
} 