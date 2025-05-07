import React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import rarities from "@shared/data/rarities.json";

const RechargeEditor = ({
  items,
  rechargeValues,
  handleRechargeValueChange,
  title,
}) => {
  // Grouper les items par rareté
  const itemsByRarity = rarities.rarities.reduce((acc, rarity) => {
    acc[rarity.rarity] = items.filter(
      (item) => item.item.rarity === rarity.rarity
    );
    return acc;
  }, {});

  return (
    <div className="max-h-[70vh] overflow-y-auto space-y-4">
      <h3 className="text-primary text-sm font-medium uppercase sticky top-0 bg-gray-800 py-2">
        {title}
      </h3>

      {rarities.rarities.map((rarity) => {
        const rarityItems = itemsByRarity[rarity.rarity] || [];
        if (rarityItems.length === 0) return null;

        return (
          <div
            key={rarity.rarity}
            className="bg-gray-800/50 p-4 rounded-lg space-y-3"
          >
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: rarity.color }}
              />
              <span
                className="text-sm font-medium"
                style={{ color: rarity.color }}
              >
                {rarity.rarity}
              </span>
            </div>

            {rarityItems.map((recharge) => (
              <div
                key={recharge.id}
                className="bg-gray-900/50 p-4 rounded-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">
                    {recharge.item.name}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-300 text-xs mb-1">
                      Max Energy
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={
                        rechargeValues[recharge.id]?.max_energy_recharge ?? ""
                      }
                      onChange={(e) =>
                        handleRechargeValueChange(
                          recharge.id,
                          "max_energy_recharge",
                          e.target.value
                        )
                      }
                      className="w-full bg-gray-700"
                    />
                  </div>

                  <div>
                    <label
                      className="block text-gray-300 text-xs mb-1"
                      title="It is not possible to modify it here, but it is linked to the item_farmings table."
                    >
                      Badge Craft Time (min)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={rechargeValues[recharge.id]?.time_to_charge ?? ""}
                      disabled
                      onChange={(e) =>
                        handleRechargeValueChange(
                          recharge.id,
                          "time_to_charge",
                          e.target.value
                        )
                      }
                      className="w-full bg-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-xs mb-1">
                      Flex Charge
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={rechargeValues[recharge.id]?.flex_charge ?? ""}
                      onChange={(e) =>
                        handleRechargeValueChange(
                          recharge.id,
                          "flex_charge",
                          e.target.value
                        )
                      }
                      className="w-full bg-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-xs mb-1">
                      SP.MARKS Charge
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={
                        rechargeValues[recharge.id]?.sponsor_mark_charge ?? ""
                      }
                      onChange={(e) =>
                        handleRechargeValueChange(
                          recharge.id,
                          "sponsor_mark_charge",
                          e.target.value
                        )
                      }
                      className="w-full bg-gray-700"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

const ItemRechargeEditor = ({
  itemRecharges,
  rechargeValues,
  handleRechargeValueChange,
  onSave,
  isUpdating,
  onClose,
}) => {
  // Filtrer les items par type
  const badges =
    itemRecharges?.filter((item) => item.item.type === "Badge") || [];
  const contracts =
    itemRecharges?.filter((item) => item.item.type === "Contract") || [];

  return (
    <div className="top-full left-0 mt-2 z-50 bg-gray-800 p-4 rounded-md border border-gray-700 w-[800px] shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Item Recharge Settings</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => onSave(onClose)}
            disabled={isUpdating}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            onClick={onClose}
            disabled={isUpdating}
            className="bg-gray-600 hover:bg-gray-700 text-white"
          >
            Cancel
          </Button>
        </div>
      </div>

      <Tabs.Root defaultValue="contracts" className="w-full">
        <Tabs.List className="flex gap-4 mb-4 border-b border-gray-700">
          {/* <Tabs.Trigger
            value="badges"
            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white"
          >
            Badge Recharge
          </Tabs.Trigger> */}
          <Tabs.Trigger
            value="contracts"
            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white"
          >
            Contract Recharge
          </Tabs.Trigger>
        </Tabs.List>

        {/* <Tabs.Content value="badges">
          <RechargeEditor 
            items={badges}
            rechargeValues={rechargeValues}
            handleRechargeValueChange={handleRechargeValueChange}
            title="Badge Recharge Settings"
          />
        </Tabs.Content> */}
        <Tabs.Content value="contracts">
          <RechargeEditor
            items={contracts}
            rechargeValues={rechargeValues}
            handleRechargeValueChange={handleRechargeValueChange}
            title="Contract Recharge Settings"
          />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
};

export default ItemRechargeEditor;
