import { Input } from "@shared/ui/input";
import { Switch } from "@shared/ui/switch";

/**
 * Section pour configurer les options de jointure
 * @param {Object} props - Propriétés du composant
 * @param {Object} props.tournament - Le tournoi
 * @param {Object} props.selectedTeam - L'équipe sélectionnée
 * @param {Number} props.selectedSlot - Le slot sélectionné
 * @param {String} props.entryCode - Code d'entrée du tournoi
 * @param {Function} props.setEntryCode - Définit le code d'entrée
 * @param {String} props.invitationCode - Code d'invitation
 * @param {Function} props.setInvitationCode - Définit le code d'invitation
 * @param {Boolean} props.isPrivateTeam - Si l'équipe est privée
 * @param {Function} props.handleTogglePrivate - Bascule la confidentialité
 * @param {String} props.error - Message d'erreur à afficher
 * @returns {JSX.Element} - Élément JSX
 */
export function OptionsSection({
  tournament,
  selectedTeam,
  selectedSlot,
  entryCode,
  setEntryCode,
  invitationCode,
  setInvitationCode,
  isPrivateTeam,
  handleTogglePrivate,
  error
}) {
  return (
    <div className="bg-gray-900/50 p-4 rounded-lg">
      <h3 className="text-yellow-400 font-bold mb-4 text-center uppercase">Options</h3>
      
      {tournament.entry_code && (
        <div className="mb-4">
          <div className="text-white font-bold mb-2">Tournament Entry Code</div>
          <Input
            value={entryCode}
            onChange={(e) => setEntryCode(e.target.value)}
            placeholder="Enter tournament code"
            className="bg-gray-800 border-gray-700"
          />
          <div className="text-sm text-amber-500 mt-1">
            This tournament requires an entry code.
          </div>
        </div>
      )}
      
      {selectedTeam ? (
        <>
          {(selectedTeam.isEmpty || selectedTeam.is_empty || !selectedTeam.team_members || selectedTeam.team_members.length === 0) && (
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <span className="font-bold">PRIVATE TEAM</span>
                <Switch
                  checked={isPrivateTeam}
                  onCheckedChange={handleTogglePrivate}
                />
              </div>
              <p className="text-gray-400 text-xs mt-1">
                {isPrivateTeam 
                  ? "A private team requires an invitation code for others to join." 
                  : "A public team can be joined by anyone without a code."}
              </p>
            </div>
          )}
          
          {(selectedTeam.invitation_code) && (
            <div className="mb-4">
              <div className="text-white font-bold mb-2">Team Invitation Code</div>
              <Input
                value={invitationCode}
                onChange={(e) => setInvitationCode(e.target.value)}
                placeholder="Enter invitation code"
                className="bg-gray-800 border-gray-700"
              />
              <div className="text-sm text-amber-500 mt-1">
                This team requires an invitation code.
              </div>
            </div>
          )}
          
          <div className="bg-gray-800/50 p-3 rounded-lg">
            <h4 className="text-sm font-bold mb-2 text-yellow-400">YOUR SELECTION</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Team:</span>
                <span className="font-bold">
                  {selectedTeam.isEmpty 
                    ? `Team ${selectedTeam.letter || String.fromCharCode(65 + selectedTeam.team_index)}` 
                    : selectedTeam.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Slot:</span>
                <span className="font-bold">
                  {selectedSlot ? (
                    <>
                      {selectedTeam.letter || String.fromCharCode(65 + selectedTeam.team_index)}
                      {selectedSlot}
                    </>
                  ) : "None"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Privacy:</span>
                <span className="font-bold">
                  {(isPrivateTeam || selectedTeam.invitation_code) ? "Private" : "Public"}
                </span>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="text-red-400 mt-4 text-center text-sm">
              {error}
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center h-40 text-gray-400">
          Please select a team first
        </div>
      )}
    </div>
  );
} 