import React, { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { Button } from "@shared/ui/button";
import BadgeEditor from './BadgeEditor';
import ContractEditor from './ContractEditor';
import CurrencyEditor from './CurrencyEditor';
import ItemCraftingEditor from './ItemCraftingEditor';
import ItemRechargeEditor from './ItemRechargeEditor';

export const AdminModal = ({
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
  handleSaveCurrencies,
  onClose
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  // Filtrer les badges et les contrats
  const badges = items?.filter(item => item.type?.name === "Badge") || [];
  const contracts = items?.filter(item => item.type?.name === "Contract") || [];

  return (
    <>
      <Button
        variant="default"
        className="flex items-center gap-2"
        onClick={() => setIsOpen(true)}
      >
        Admin Panel
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />
          <div className="relative z-50 w-1/2 h-4/5 bg-gray-800 rounded-lg shadow-lg p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Admin Panel</h2>
              <button
                className="text-gray-400 hover:text-white"
                onClick={handleClose}
              >
                <span className="material-icons">close</span>
              </button>
            </div>

            <Tabs.Root defaultValue="badges" className="w-full">
              <Tabs.List className="grid grid-cols-5 gap-4 mb-4">
                <Tabs.Trigger
                  value="badges"
                  className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white"
                >
                  Badges
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="contracts"
                  className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white"
                >
                  Contracts
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="currencies"
                  className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white"
                >
                  Currencies
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="crafting"
                  className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white"
                >
                  Item Crafting
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="recharge"
                  className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white"
                >
                  Item Recharge
                </Tabs.Trigger>
              </Tabs.List>

              <Tabs.Content value="badges">
                <BadgeEditor
                  badges={badges}
                  itemValues={itemValues}
                  handleItemValueChange={handleItemValueChange}
                  handleSaveBadges={handleSaveBadges}
                  isUpdating={isUpdating}
                  onClose={handleClose}
                />
              </Tabs.Content>
              <Tabs.Content value="contracts">
                <ContractEditor
                  contracts={contracts}
                  itemValues={itemValues}
                  handleItemValueChange={handleItemValueChange}
                  handleSaveContracts={handleSaveContracts}
                  isUpdating={isUpdating}
                  onClose={handleClose}
                />
              </Tabs.Content>
              <Tabs.Content value="currencies">
                <CurrencyEditor
                  currencies={currencies}
                  currencyValues={currencyValues}
                  handleValueChange={handleCurrencyValueChange}
                  handleSaveCurrencies={handleSaveCurrencies}
                  isUpdating={isUpdating}
                  onClose={handleClose}
                />
              </Tabs.Content>
              <Tabs.Content value="crafting">
                <ItemCraftingEditor
                  itemCraftings={itemCraftings}
                  craftingValues={craftingValues}
                  handleCraftingValueChange={handleCraftingValueChange}
                  onSave={handleSaveCraftings}
                  isUpdating={isUpdating}
                  onClose={handleClose}
                />
              </Tabs.Content>
              <Tabs.Content value="recharge">
                <ItemRechargeEditor
                  itemRecharges={itemRecharges}
                  rechargeValues={rechargeValues}
                  handleRechargeValueChange={handleRechargeValueChange}
                  onSave={handleSaveRecharges}
                  isUpdating={isUpdating}
                  onClose={handleClose}
                />
              </Tabs.Content>
            </Tabs.Root>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminModal; 