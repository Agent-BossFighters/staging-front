import { getTeamColor } from "../../constants/uiConfigs";
import { getAvailableSlots } from "../../utils";

/**
 * Section pour sélectionner un slot dans une équipe
 * @param {Object} props - Propriétés du composant
 * @param {Object} props.tournament - Le tournoi
 * @param {Object} props.selectedTeam - L'équipe sélectionnée
 * @param {Number} props.selectedSlot - Le slot sélectionné
 * @param {Function} props.setSelectedSlot - Définit le slot sélectionné
 * @returns {JSX.Element} - Élément JSX
 */
export function SlotSelectionSection({
  tournament,
  selectedTeam,
  selectedSlot,
  setSelectedSlot
}) {
  const availableSlots = selectedTeam ? getAvailableSlots(selectedTeam, tournament) : [];
  
  return (
    <div>
      <h3 className="text-yellow-400 font-bold mb-4 text-center uppercase">Select Slot</h3>
      {selectedTeam ? (
        <div>
          <div className="mb-4 p-2 text-center" 
            style={{ backgroundColor: getTeamColor(selectedTeam.team_index) }}>
            <span className="font-bold">
              {selectedTeam.isEmpty 
                ? `Team ${selectedTeam.letter || String.fromCharCode(65 + selectedTeam.team_index)}` 
                : selectedTeam.name}
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-3 justify-items-center">
            {Array.from({ length: tournament.players_per_team || 4 }, (_, i) => {
              const slotNum = i + 1;
              
              const teamIndex = selectedTeam.team_index;
              const teamLetter = selectedTeam.letter || String.fromCharCode(65 + teamIndex);
              const slotId = `${teamLetter}${slotNum}`;
              
              const isOccupied = selectedTeam.players?.some(p => p.slot_number === slotNum) 
                || selectedTeam.team_members?.some(m => m.slot_number === slotNum);
              
              const isSelectable = availableSlots.includes(slotNum);
              const isSlotSelected = selectedSlot === slotNum;
              
              return (
                <button
                  type="button"
                  key={`slot-${teamLetter}${slotNum}`}
                  className={`rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold 
                    ${isOccupied ? 'opacity-50 cursor-not-allowed' : ''} 
                    ${isSlotSelected ? 'ring-2 ring-white' : ''}
                    ${isSelectable ? 'cursor-pointer hover:brightness-110' : 'cursor-not-allowed'}`}
                  style={{ backgroundColor: getTeamColor(teamIndex) }}
                  onClick={() => isSelectable && setSelectedSlot(slotNum)}
                  disabled={!isSelectable || isOccupied}
                >
                  {slotId}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-40 text-gray-400">
          Please select a team first
        </div>
      )}
    </div>
  );
} 