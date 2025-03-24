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
  
  const currenciesData = useCurrencies(user);
  const itemsData = useItems(user);

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
        isMenuOpen={isMenuOpen}
        onMenuToggle={handleMenuToggle}
        onSectionSelect={handleSectionSelect}
      />
      
      {activeSection === 'currencies' && (
        <CurrencyEditor
          currencies={currenciesData.currencies}
          currencyValues={currenciesData.currencyValues}
          handleValueChange={currenciesData.handleValueChange}
          handleSaveCurrencies={currenciesData.handleSaveCurrencies}
          isUpdating={currenciesData.isUpdating}
          onClose={handleCloseSection}
        />
      )}
      
      {activeSection === 'badges' && (
        <BadgeEditor
          badges={itemsData.badges}
          itemValues={itemsData.itemValues}
          handleItemValueChange={itemsData.handleItemValueChange}
          handleSaveBadges={itemsData.handleSaveBadges}
          isUpdating={itemsData.isUpdating}
          onClose={handleCloseSection}
        />
      )}
      
      {activeSection === 'contracts' && (
        <ContractEditor
          contracts={itemsData.contracts}
          itemValues={itemsData.itemValues}
          handleItemValueChange={itemsData.handleItemValueChange}
          handleSaveContracts={itemsData.handleSaveContracts}
          isUpdating={itemsData.isUpdating}
          onClose={handleCloseSection}
        />
      )}
    </div>
  );
}