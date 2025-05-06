import React from "react";
import AdminModal from "./AdminModal";

const AdminButton = ({
  items,
  itemValues,
  itemCraftings,
  itemRecharges,
  craftingValues,
  rechargeValues,
  currencies,
  currencyValues,
  isUpdating,
  handleItemValueChange,
  handleCraftingValueChange,
  handleRechargeValueChange,
  handleCurrencyValueChange,
  handleSaveBadges,
  handleSaveContracts,
  handleSaveCraftings,
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
  );
};

export default AdminButton; 