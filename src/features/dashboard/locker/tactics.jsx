import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@ui/select";
import { Button } from "@ui/button";
import SelectSlot from "@features/dashboard/datalab/slot/select-slot";
import { MyTactic } from "@img/index";
import { useUserPreference } from "@context/userPreference.context";
import { useCurrencyPacks } from "./hook/useCurrencyPacks";
import TacticsSkeleton from "./skeletons/TacticsSkeleton";
import { toast } from "react-hot-toast";
import { kyInstance } from "@utils/api/ky-config";
import { formatNumber, formatPrice } from "@utils/formatters";

const numbers = Array.from({ length: 4 }, (_, i) => i + 1);
const STORAGE_KEY = "userPreferences";

export default function Tactics() {
  const {
    maxRarity,
    setMaxRarity,
    unlockedSlots,
    setUnlockedSlots,
    selectedFlexPack,
    setSelectedFlexPack,
    streamerMode,
    setStreamerMode,
    savePreferences,
    getStoredPreferences,
    reloadPreferences,
  } = useUserPreference();
  const { currencyPacks, loading, error, fetchCurrencyPacks } =
    useCurrencyPacks();
  
  // État local pour stocker les modifications temporaires
  const [localMaxRarity, setLocalMaxRarity] = useState(() => {
    try {
      const savedPreferences = localStorage.getItem(STORAGE_KEY);
      return savedPreferences && JSON.parse(savedPreferences).maxRarity
        ? JSON.parse(savedPreferences).maxRarity
        : maxRarity || "Unique";
    } catch (error) {
      console.error("Error loading maxRarity:", error);
      return maxRarity || "Unique";
    }
  });
  
  const [localUnlockedSlots, setLocalUnlockedSlots] = useState(() => {
    try {
      const savedPreferences = localStorage.getItem(STORAGE_KEY);
      return savedPreferences && JSON.parse(savedPreferences).unlockedSlots
        ? JSON.parse(savedPreferences).unlockedSlots
        : unlockedSlots || 1;
    } catch (error) {
      console.error("Error loading unlockedSlots:", error);
      return unlockedSlots || 1;
    }
  });
  
  const [localSelectedFlexPack, setLocalSelectedFlexPack] = useState(() => {
    try {
      const savedPreferences = localStorage.getItem(STORAGE_KEY);
      return savedPreferences && JSON.parse(savedPreferences).selectedFlexPack
        ? JSON.parse(savedPreferences).selectedFlexPack
        : selectedFlexPack || "";
    } catch (error) {
      console.error("Error loading selectedFlexPack:", error);
      return selectedFlexPack || "";
    }
  });
  
  const [localStreamerMode, setLocalStreamerMode] = useState(() => {
    try {
      const savedPreferences = localStorage.getItem(STORAGE_KEY);
      return savedPreferences && JSON.parse(savedPreferences).streamerMode
        ? JSON.parse(savedPreferences).streamerMode
        : streamerMode || false;
    } catch (error) {
      console.error("Error loading streamerMode:", error);
      return streamerMode || false;
    }
  });
  
  const [saveStatus, setSaveStatus] = useState(null);

  // Convertir le nombre total de slots en nombre de slots additionnels pour l'affichage
  const displayedSlots = localUnlockedSlots ? (localUnlockedSlots - 1).toString() : "0";

  const handleSlotChange = (value) => {
    // Convertir le nombre de slots additionnels en nombre total de slots
    if (value === "none" || value === "0") {
      setLocalUnlockedSlots(1); // Au minimum 1 slot
    } else {
      setLocalUnlockedSlots(parseInt(value) + 1);
    }
  };

  // Fonction pour sauvegarder les modifications locales dans le contexte
  const handleSave = async () => {
    try {
      // S'assurer que les valeurs sont définies
      const safeMaxRarity = localMaxRarity || "legendary";
      const safeUnlockedSlots = localUnlockedSlots || 1;
      const safeSelectedFlexPack = localSelectedFlexPack || "";
      const safeStreamerMode = localStreamerMode || false;
      
      console.log("Saving preferences:", {
        maxRarity: safeMaxRarity,
        unlockedSlots: safeUnlockedSlots,
        selectedFlexPack: safeSelectedFlexPack,
        streamerMode: safeStreamerMode
      });
      
      // Mettre à jour directement le localStorage pour éviter les problèmes de synchronisation
      const existingPrefs = localStorage.getItem(STORAGE_KEY);
      const existingPrefsObj = existingPrefs ? JSON.parse(existingPrefs) : {};
      
      const preferences = {
        ...existingPrefsObj,
        maxRarity: safeMaxRarity,
        unlockedSlots: safeUnlockedSlots,
        selectedFlexPack: safeSelectedFlexPack,
        streamerMode: safeStreamerMode
      };
      
      localStorage.setItem("userPreferences", JSON.stringify(preferences));
      
      // Mettre à jour le contexte
      setMaxRarity(safeMaxRarity);
      setUnlockedSlots(safeUnlockedSlots);
      setSelectedFlexPack(safeSelectedFlexPack);
      setStreamerMode(safeStreamerMode);
      
      // Sauvegarder le flex pack choisi en BDD via l'API
      if (safeSelectedFlexPack) {
        try {
          // Trouver le pack correspondant pour obtenir des informations supplémentaires si nécessaire
          const packId = currencyPacks.findIndex(pack =>
            pack.currencyNumber.toString() === safeSelectedFlexPack) + 1;
          
          // Envoyer la mise à jour à l'API
          const response = await kyInstance.patch('v1/users/tactics', {
            json: {
              user: {
                flex_pack: packId
              }
            }
          });
          
          console.log('Flex pack updated in database:', response);
        } catch (apiError) {
          console.error('Error updating flex pack in database:', apiError);
          // Ne pas bloquer la sauvegarde locale si l'API échoue
          toast.error("Your preferences were saved locally, but we couldn't update the server. Some features may not work correctly until next login.");
        }
      }
      
      // Afficher un message de succès
      toast.success("Preferences saved successfully");
      setSaveStatus('success');
    } catch (error) {
      console.error("Error saving preferences:", error);
      setSaveStatus('error');
    }
  };

  // Charger les préférences au montage du composant
  useEffect(() => {
    // Ne pas recharger les préférences au montage pour éviter d'écraser les modifications locales
    // reloadPreferences();
    fetchCurrencyPacks();
  }, []);

  // Réinitialiser le statut de sauvegarde après 3 secondes
  useEffect(() => {
    if (saveStatus) {
      const timer = setTimeout(() => {
        setSaveStatus(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  const formatSelectedValue = (value) => {
    if (!value) return "Select";
    const pack = currencyPacks.find(
      (p) => p.currencyNumber.toString() === value
    );
    if (!pack) return "Select";
    return `${formatPrice(pack.price)} (${formatNumber(pack.currencyNumber)})`;
  };

  if (loading) return <TacticsSkeleton />;
  if (error)
    return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div className="flex flex-col px-5 gap-3">
      <div className="flex flex-col lg:flex-row gap-5 lg:gap-9 pt-2">
        <div className="flex flex-col">
          <h3 className="text-l font-bold whitespace-nowrap leading-tight pb-[8px]">
            MAX ITEM RARITY
            <br />
            TO SHOW
          </h3>
          <SelectSlot
            onSelectRarity={(value) => setLocalMaxRarity(value)}
            selectedRarity={localMaxRarity || "none"}
          />
        </div>
        <div className="flex flex-col">
          <h3 className="text-l font-bold whitespace-nowrap leading-tight pb-[8px]">
            FAVORITE
            <br />
            FLEX PACK
          </h3>
          <Select
            value={localSelectedFlexPack || "none"}
            onValueChange={setLocalSelectedFlexPack}
            className="w-full"
          >
            <SelectTrigger className="inline-flex items-center gap-1 w-[200px] px-4 py-2">
              <SelectValue placeholder="Select">
                {formatSelectedValue(localSelectedFlexPack)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {currencyPacks.map((pack) => (
                  <SelectItem
                    key={pack.id}
                    value={pack.currencyNumber.toString()}
                    className="py-2"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {formatPrice(pack.price)} ({formatNumber(pack.currencyNumber)})
                      </span>
                      <span className="text-sm text-gray-400">
                        {formatPrice(pack.unitPrice, 4)}/FLEX
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col">
          <h3 className="text-l font-bold whitespace-nowrap leading-tight pb-[8px]">
            BADGE SLOT(S)
            <br />
            UNLOCKED
          </h3>
          <Select
            value={displayedSlots || "none"}
            onValueChange={handleSlotChange}
          >
            <SelectTrigger className="inline-flex items-center gap-1 w-[70px] px-4 py-2">
              <SelectValue>{displayedSlots || "-"}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Slot Used</SelectLabel>
                <SelectItem value="0">0</SelectItem>
                {numbers.map((number) => (
                  <SelectItem key={number} value={number.toString()}>
                    {number}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col">
          <h3 className="text-l font-bold whitespace-nowrap leading-tight pb-[8px]">
            STREAMER
            <br />
            MODE
          </h3>
          <Select
            value={localStreamerMode ? "yes" : "no"}
            onValueChange={(value) => setLocalStreamerMode(value === "yes")}
          >
            <SelectTrigger className="inline-flex items-center gap-1 w-[80px] px-4 py-2">
              <SelectValue>{localStreamerMode ? "Yes" : "No"}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Enable Streamer Mode</SelectLabel>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col justify-end duration-200 hover:scale-105">
          <Button
            onClick={handleSave}
          >
            SAVE
          </Button>
        </div>
      </div>
    </div>
  );
}
