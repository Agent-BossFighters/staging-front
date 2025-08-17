import { Button } from "@shared/ui/button";
import { TeamSelectionSection } from "./TeamSelectionSection";
import { SlotSelectionSection } from "./SlotSelectionSection";
import { OptionsSection } from "./OptionsSection";

/**
 * Formulaire pour rejoindre un tournoi
 * @param {Object} props - Propriétés du composant
 * @param {Object} props.tournament - Le tournoi à rejoindre
 * @param {Array} props.teams - Les équipes du tournoi
 * @param {Array} props.userTeams - Les équipes de l'utilisateur
 * @param {Boolean} props.isLoading - Si le formulaire est en cours de chargement
 * @param {String} props.error - Message d'erreur à afficher
 * @param {Object} props.selectedTeam - L'équipe sélectionnée
 * @param {Function} props.setSelectedTeam - Définit l'équipe sélectionnée
 * @param {String} props.entryCode - Code d'entrée du tournoi
 * @param {Function} props.setEntryCode - Définit le code d'entrée
 * @param {String} props.invitationCode - Code d'invitation de l'équipe
 * @param {Function} props.setInvitationCode - Définit le code d'invitation
 * @param {Number} props.selectedSlot - Slot sélectionné
 * @param {Function} props.setSelectedSlot - Définit le slot sélectionné
 * @param {Boolean} props.isPrivateTeam - Si l'équipe est privée
 * @param {Function} props.handleTogglePrivate - Bascule la confidentialité de l'équipe
 * @param {Function} props.handleJoinTeam - Fonction pour rejoindre l'équipe
 * @returns {JSX.Element} - Élément JSX
 */
export function JoinFormView({
  tournament,
  teams,
  userTeams,
  isLoading,
  error,
  selectedTeam,
  setSelectedTeam,
  entryCode,
  setEntryCode,
  invitationCode,
  setInvitationCode,
  selectedSlot,
  setSelectedSlot,
  isPrivateTeam,
  handleTogglePrivate,
  handleJoinTeam
}) {
  return (
    <div className="flex flex-col">
      {/* En-tête d'informations */}
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <div className="text-sm text-gray-300">
            <span className="font-bold">REMAINING SLOTS:</span> {tournament.max_teams - (teams?.length || 0)}/{tournament.max_teams}
          </div>
          <div className="text-sm text-gray-300">
            <span className="font-bold">PLAYER(S) PER TEAM:</span> {tournament.players_per_team || 4}
          </div>
        </div>
      </div>
      
      {/* Section principale en 3 colonnes */}
      <form onSubmit={handleJoinTeam}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {/* Colonne 1: Sélection d'équipe */}
          <TeamSelectionSection
            tournament={tournament}
            teams={teams}
            userTeams={userTeams}
            selectedTeam={selectedTeam}
            setSelectedTeam={setSelectedTeam}
          />
          
          {/* Colonne 2: Sélection de slot */}
          <SlotSelectionSection
            tournament={tournament}
            selectedTeam={selectedTeam}
            selectedSlot={selectedSlot}
            setSelectedSlot={setSelectedSlot}
          />
          
          {/* Colonne 3: Options */}
          <OptionsSection
            tournament={tournament}
            selectedTeam={selectedTeam}
            selectedSlot={selectedSlot}
            entryCode={entryCode}
            setEntryCode={setEntryCode}
            invitationCode={invitationCode}
            setInvitationCode={setInvitationCode}
            isPrivateTeam={isPrivateTeam}
            handleTogglePrivate={handleTogglePrivate}
            error={error}
          />
        </div>
        
        {error && (
          <div className="text-red-500 text-center mb-4">
            {error}
          </div>
        )}
        
        <div className="flex justify-center w-full">
          <Button
            type="submit"
            disabled={isLoading || !selectedTeam || !selectedSlot}
            className="inline-flex items-center justify-center gap-4 whitespace-nowrap rounded-md text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-background shadow hover:bg-primary/90 font-bold uppercase h-9 px-4 py-2 transition-transform duration-200 hover:scale-105"
          >
            {isLoading ? "JOINING..." : "VALIDATE"}
          </Button>
        </div>
      </form>
    </div>
  );
} 