import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useJoinTournament, useTournamentTeamsData, useTeamSelection } from "../hooks";
import { CreatorView, SuccessView, JoinFormView } from "./JoinTournamentModal/index";
import toast from "react-hot-toast";

export default function JoinTournamentModal({ tournament, isOpen, onClose }) {
  // State pour les erreurs
  const [error, setError] = useState(null);
  
  // Utiliser le hook pour charger les données des équipes
  const { 
    teams, 
    emptyTeams, 
    userTeams, 
    isCreator 
  } = useTournamentTeamsData(tournament, isOpen, setError);
  
  // Utiliser le hook pour gérer la sélection d'équipe
  const { 
    selectedTeam, 
    setSelectedTeam, 
    entryCode,
    setEntryCode,
    invitationCode, 
    setInvitationCode, 
    selectedSlot, 
    setSelectedSlot, 
    isPrivateTeam, 
    handleTogglePrivate 
  } = useTeamSelection(tournament);
  
  // Utiliser le hook pour rejoindre un tournoi
  const { 
    isLoading, 
    success, 
    joinTournament 
  } = useJoinTournament(tournament, teams, onClose);
  
  // Fermer la modale quand le tournoi a été rejoint avec succès
  useEffect(() => {
    if (success) {
      setTimeout(() => {
        onClose();
      }, 3000);
    }
  }, [success, onClose]);
  
  // Fermer la modale si l'utilisateur est le créateur
  useEffect(() => {
    if (isCreator) {
      setTimeout(() => {
        onClose();
      }, 3000);
    }
  }, [isCreator, onClose]);
  
  if (!isOpen) return null;
  
  if (isCreator) {
    return <CreatorView tournament={tournament} onClose={onClose} />;
  }

  const handleJoinTeam = async (e) => {
    e.preventDefault();

    // Vérification de la sélection d'une équipe
    if (!selectedTeam) {
      toast.error("Please select a team");
      return;
    }

    // Vérification du code d'entrée du tournoi
    if (tournament.entry_code && !entryCode) {
      toast.error("Please enter the tournament entry code");
      return;
    }

    // Vérification du code d'invitation de l'équipe
    if (selectedTeam.invitation_code && !invitationCode) {
      toast.error("Please enter the team invitation code");
      return;
    }

    // Vérification de la validité des codes
    if (tournament.entry_code && entryCode !== tournament.entry_code) {
      toast.error("Invalid tournament entry code");
      return;
    }

    if (selectedTeam.invitation_code && invitationCode !== selectedTeam.invitation_code) {
      toast.error("Invalid team invitation code");
      return;
    }

    // Si tout est valide, on peut procéder
    joinTournament(selectedTeam, selectedSlot, entryCode, invitationCode, isPrivateTeam);
  };

  // Formatage du nom du tournoi en majuscules
  const tournamentNameFormatted = tournament.name ? tournament.name.toUpperCase() : '';

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-[800px] bg-[#111827] border border-gray-700 text-white rounded-md">
        {/* Header avec titre et bouton de fermeture */}
        <div className="bg-black p-4 flex justify-between items-center rounded-t-md">
          <h2 className="text-yellow-400 text-lg font-bold">
            {tournamentNameFormatted} - REGISTER
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Contenu principal */}
        <div className="p-6">
          {success ? (
            <SuccessView onClose={onClose} />
          ) : (
            <JoinFormView 
              tournament={tournament}
              teams={teams}
              userTeams={userTeams}
              isLoading={isLoading}
              error={error}
              selectedTeam={selectedTeam}
              setSelectedTeam={setSelectedTeam}
              entryCode={entryCode}
              setEntryCode={setEntryCode}
              invitationCode={invitationCode}
              setInvitationCode={setInvitationCode}
              selectedSlot={selectedSlot}
              setSelectedSlot={setSelectedSlot}
              isPrivateTeam={isPrivateTeam}
              handleTogglePrivate={handleTogglePrivate}
              handleJoinTeam={handleJoinTeam}
            />
          )}
        </div>
      </div>
    </div>
  );
} 