import { useState } from "react";
import MatchesList from "./components/matches-list";
import { useUserPreference } from "@context/userPreference.context";
import { MatchDialogs } from "./components/MatchDialogs";
import { useLastMatchData } from "@shared/hook/useLastMatchData";
import Calculator from "./components/Calculator";


export default function DailyMatches({
  matches,
  builds,
  loading,
  onAdd,
  onUpdate,
  onDelete,
  selectedDate
}) {
  const [editingMatchId, setEditingMatchId] = useState(null);
  const [editedData, setEditedData] = useState(null);
  const { unlockedSlots } = useUserPreference();
  const [showEditTimeoutDialog, setShowEditTimeoutDialog] = useState(false);
  const [currentMatch, setCurrentMatch] = useState(null);
  const { lastMatchData, saveLastMatchData } = useLastMatchData();
  const [totalEnergyUsed, setTotalEnergyUsed] = useState(0)
  const [totalPriceEnergyUsed, setTotalPriceEnergyUsed] = useState(0)



  const availableSlots = unlockedSlots;

  // Fonction pour sauvegarder le dernier match
  const handleMatchAdd = (matchData) => {
    const buildId = builds.find(b => b.buildName === matchData.match.build)?.id || "";
    const rarities = Array(5).fill("none").map((_, index) => {
      const badge = matchData.match.badge_used_attributes.find(b => b.slot === index + 1 && !b._destroy);
      return badge ? badge.rarity : "none";
    });
    
    console.log("Saving match data:", { buildId, rarities });
    saveLastMatchData({ buildId, rarities });
    onAdd(matchData);
  };

  const handleEdit = (match) => {
    const creationTime = new Date(match.created_at || match.date);
    const currentTime = new Date();
    const timeDifferenceInMinutes = (currentTime - creationTime) / (1000 * 60);
    
    if (timeDifferenceInMinutes > 15) {
      setCurrentMatch(match);
      setShowEditTimeoutDialog(true);
      return;
    }
    
    setEditingMatchId(match.id);
    setEditedData({
      buildId: builds.find((b) => b.buildName === match.build)?.id || "",
      map: match.map || "",
      time: match.time || "",
      result: match.result || "",
      bft: match.totalToken || "",
      flex: match.totalPremiumCurrency || "",
      energyUsed: match.energyUsed || "",
      energyCost: match.energyCost || "",
      rarities: Array(5)
        .fill("none")
        .map((_, index) => {
          const badge = match.badge_used?.find((b) => b.slot === index + 1);
          return badge ? badge.rarity : "none";
        }),
    });
  };

  const handleCancel = () => {
    setEditingMatchId(null);
    setEditedData(null);
  };

  const handleEditField = (field, value) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  };

  // Fonction pour obtenir les données initiales d'un nouveau match
  const getInitialMatchData = () => {
    console.log("Getting initial match data, last match data:", lastMatchData);
    if (lastMatchData) {
      return {
        buildId: lastMatchData.buildId,
        map: "",
        time: "",
        result: "",
        bft: "",
        flex: "",
        rarities: lastMatchData.rarities,
      };
    }
    return {
      buildId: "",
      map: "",
      time: "",
      result: "",
      bft: "",
      flex: "",
      rarities: Array(5).fill("none"),
    };
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-4 w-48 bg-muted-foreground/30 rounded"></div>
          <div className="h-4 w-36 bg-muted-foreground/20 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">

      <Calculator
        onEnergyUsedChange={setTotalEnergyUsed}
        onPriceChange={setTotalPriceEnergyUsed}
      />

      <MatchesList
        matches={matches}
        builds={builds}
        unlockedSlots={availableSlots}
        editingMatchId={editingMatchId}
        editedData={editedData}
        onAdd={handleMatchAdd}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onEdit={handleEdit}
        onEditField={handleEditField}
        onCancel={handleCancel}
        selectedDate={selectedDate}
        initialMatchData={getInitialMatchData()}
        totalEnergyUsed={totalEnergyUsed}
        totalPriceEnergyUsed={totalPriceEnergyUsed}
      />
      
      {/* Dialog for edit timeout */}
      <MatchDialogs
        showMissingFieldsDialog={false}
        setShowMissingFieldsDialog={() => {}}
        missingFieldsList={[]}
        showCreateWarningDialog={false}
        setShowCreateWarningDialog={() => {}}
        onCreateConfirm={() => {}}
        showEditTimeoutDialog={showEditTimeoutDialog}
        setShowEditTimeoutDialog={setShowEditTimeoutDialog}
        onTimeoutConfirm={() => setShowEditTimeoutDialog(false)}
      />
    </div>
  );
}
