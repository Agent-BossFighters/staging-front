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
    rechargeValues,
    isUpdating,
    handleItemValueChange,
    handleCraftingValueChange,
    handleRechargeValueChange,
    handleSaveItems,
    handleSaveBadges,
    handleSaveContracts,
    handleSaveCraftings,
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
    <div className="ml-4 relative">
      <AdminButton 
        items={items}
        itemValues={itemValues}
        itemCraftings={itemCraftings}
        itemRecharges={itemRecharges}
        craftingValues={craftingValues}
        rechargeValues={rechargeValues}
        currencies={currencies}
        currencyValues={currencyValues}
        isUpdating={isUpdating}
        handleItemValueChange={handleItemValueChange}
        handleCraftingValueChange={handleCraftingValueChange}
        handleRechargeValueChange={handleRechargeValueChange}
        handleCurrencyValueChange={handleCurrencyValueChange}
        handleSaveBadges={handleSaveBadges}
        handleSaveContracts={handleSaveContracts}
        handleSaveCraftings={handleSaveCraftings}
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