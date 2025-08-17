import { useState } from "react";
import { useAuth } from "@context/auth.context";
import useCurrencies from "./admin-panel/hooks/useCurrencies";
import useItems from "./admin-panel/hooks/useItems";
import AdminButton from "./admin-panel/components/AdminButton";
import CurrencyEditor from "./admin-panel/components/CurrencyEditor";
import BadgeEditor from "./admin-panel/components/BadgeEditor";
import ContractEditor from "./admin-panel/components/ContractEditor";

export default function AdminUpdateCurrencies() {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  
  const {
    items,
    badges,
    contracts,
    itemValues,
    itemCraftings,
    itemRecharges,
    craftingValues,
    forgeSettings,
    forgeValues,
    perksSettings,
    perksValues,
    rechargeValues,
    isUpdating,
    handleItemValueChange,
    handleCraftingValueChange,
    handleForgeValueChange,
    handlePerksValueChange,
    handleRechargeValueChange,
    handleSaveItems,
    handleSaveBadges,
    handleSaveContracts,
    handleSaveCraftings,
    handleSaveForge,
    handleSavePerks,
    handleSaveRecharges
  } = useItems(user);

  const {
    currencies,
    currencyValues,
    handleCurrencyValueChange,
    handleSaveCurrencies
  } = useCurrencies(user);

  if (!user || user.is_admin !== true) return null;

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isMenuOpen) {
      setActiveSection(null);
    }
  };

  const handleSectionSelect = (section) => {
    setActiveSection(section);
    setIsMenuOpen(false);
  };

  const handleCloseSection = () => {
    setActiveSection(null);
  };

  return (
    <div className="relative">
      <AdminButton 
        items={items}
        itemValues={itemValues}
        itemCraftings={itemCraftings}
        itemRecharges={itemRecharges}
        craftingValues={craftingValues}
        forgeSettings={forgeSettings}
        forgeValues={forgeValues}
        perksSettings={perksSettings}
        perksValues={perksValues}
        rechargeValues={rechargeValues}
        currencies={currencies}
        currencyValues={currencyValues}
        isUpdating={isUpdating}
        handleItemValueChange={handleItemValueChange}
        handleCraftingValueChange={handleCraftingValueChange}
        handleForgeValueChange={handleForgeValueChange}
        handlePerksValueChange={handlePerksValueChange}
        handleRechargeValueChange={handleRechargeValueChange}
        handleCurrencyValueChange={handleCurrencyValueChange}
        handleSaveBadges={handleSaveBadges}
        handleSaveContracts={handleSaveContracts}
        handleSaveCraftings={handleSaveCraftings}
        handleSaveForge={handleSaveForge}
        handleSavePerks={handleSavePerks}
        handleSaveRecharges={handleSaveRecharges}
        handleSaveCurrencies={handleSaveCurrencies}
      />
      
      {activeSection === 'currencies' && (
        <CurrencyEditor
          currencies={currencies}
          currencyValues={currencyValues}
          handleValueChange={handleCurrencyValueChange}
          handleSaveCurrencies={handleSaveCurrencies}
          isUpdating={isUpdating}
          onClose={handleCloseSection}
        />
      )}
      
      {activeSection === 'badges' && (
        <BadgeEditor
          badges={badges}
          itemValues={itemValues}
          handleItemValueChange={handleItemValueChange}
          handleSaveBadges={handleSaveBadges}
          isUpdating={isUpdating}
          onClose={handleCloseSection}
        />
      )}
      
      {activeSection === 'contracts' && (
        <ContractEditor
          contracts={contracts}
          itemValues={itemValues}
          handleItemValueChange={handleItemValueChange}
          handleSaveContracts={handleSaveContracts}
          isUpdating={isUpdating}
          onClose={handleCloseSection}
        />
      )}
    </div>
  );
}