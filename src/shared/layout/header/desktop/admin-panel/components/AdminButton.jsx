import React from "react";
import AdminModal from "./AdminModal";

const AdminButton = ({
  items,
  itemValues,
  itemCraftings,
  itemRecharges,
  craftingValues,
  forgeSettings,
  forgeValues,
  perksSettings,
  perksValues,
  rechargeValues,
  currencies,
  currencyValues,
  isUpdating,
  handleItemValueChange,
  handleCraftingValueChange,
  handleForgeValueChange,
  handlePerksValueChange,
  handleRechargeValueChange,
  handleCurrencyValueChange,
  handleSaveBadges,
  handleSaveContracts,
  handleSaveCraftings,
  handleSaveForge,
  handleSavePerks,
  handleSaveRecharges,
  handleSaveCurrencies
}) => {
  return (
    <AdminModal
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
  );
};

export default AdminButton; 