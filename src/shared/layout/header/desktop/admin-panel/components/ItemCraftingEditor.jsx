import React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import rarities from "@shared/data/rarities.json";

const CraftingEditor = ({
  items,
  craftingValues,
  handleCraftingValueChange,
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

            {rarityItems.map((crafting) => (
              <div
                key={crafting.id}
                className="bg-gray-900/50 p-4 rounded-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">
                    {crafting.item.name}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {crafting.item.type === "Contract" && (
                    <>
                      <div>
                        <label className="block text-gray-300 text-xs mb-1">
                          Flex Cost
                        </label>
                        <Input
                          type="number"
                          min="0"
                          value={craftingValues[crafting.id]?.flex_craft ?? ""}
                          onChange={(e) =>
                            handleCraftingValueChange(
                              crafting.id,
                              "flex_craft",
                              e.target.value
                            )
                          }
                          className="w-full bg-gray-700"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 text-xs mb-1">
                          SP.MARKS Craft
                        </label>
                        <Input
                          type="number"
                          min="0"
                          value={
                            craftingValues[crafting.id]?.sponsor_mark_craft ??
                            ""
                          }
                          onChange={(e) =>
                            handleCraftingValueChange(
                              crafting.id,
                              "sponsor_mark_craft",
                              e.target.value
                            )
                          }
                          className="w-full bg-gray-700"
                        />
                      </div>
                    </>
                  )}

                  {crafting.item.type === "Badge" && (
                    <>
                      <div>
                        <label className="block text-gray-300 text-xs mb-1">
                          $BFT
                        </label>
                        <Input
                          type="number"
                          min="0"
                          value={
                            craftingValues[crafting.id]?.craft_tokens ?? ""
                          }
                          onChange={(e) =>
                            handleCraftingValueChange(
                              crafting.id,
                              "craft_tokens",
                              e.target.value
                            )
                          }
                          className="w-full bg-gray-700"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-xs mb-1">
                          SP.MARKS Reward
                        </label>
                        <Input
                          type="number"
                          min="0"
                          value={
                            craftingValues[crafting.id]?.sponsor_marks_reward ??
                            ""
                          }
                          onChange={(e) =>
                            handleCraftingValueChange(
                              crafting.id,
                              "sponsor_marks_reward",
                              e.target.value
                            )
                          }
                          className="w-full bg-gray-700"
                        />
                      </div>
                    </>
                  )}

                  {crafting.item.type === "Contract" && (
                    <>
                      <div>
                        <label className="block text-gray-300 text-xs mb-1">
                        Nb Badges rarity -1
                        </label>
                        <Input
                          type="number"
                          min="0"
                          value={
                            craftingValues[crafting.id]
                              ?.nb_lower_badge_to_craft ?? ""
                          }
                          onChange={(e) =>
                            handleCraftingValueChange(
                              crafting.id,
                              "nb_lower_badge_to_craft",
                              e.target.value
                            )
                          }
                          className="w-full bg-gray-700"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 text-xs mb-1">
                          Craft Time (min)
                        </label>
                        <Input
                          type="number"
                          min="0"
                          value={craftingValues[crafting.id]?.craft_time ?? ""}
                          onChange={(e) =>
                            handleCraftingValueChange(
                              crafting.id,
                              "craft_time",
                              e.target.value
                            )
                          }
                          className="w-full bg-gray-700"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 text-xs mb-1">
                        Level Max 
                        </label>
                        <Input
                          type="number"
                          min="0"
                          value={craftingValues[crafting.id]?.max_level ?? ""}
                          onChange={(e) =>
                            handleCraftingValueChange(
                              crafting.id,
                              "max_level",
                              e.target.value
                            )
                          }
                          className="w-full bg-gray-700"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

const ItemCraftingEditor = ({
  itemCraftings,
  craftingValues,
  handleCraftingValueChange,
  onSave,
  isUpdating,
  onClose,
}) => {
  // Filtrer les items par type
  const badges =
    itemCraftings?.filter((item) => item.item.type === "Badge") || [];
  const contracts =
    itemCraftings?.filter((item) => item.item.type === "Contract") || [];

  return (
    <div className="top-full left-0 mt-2 bg-gray-800 p-4 rounded-md border border-gray-700 w-[800px] shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Item Crafting Settings</h2>
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
          <Tabs.Trigger
            value="craft"
            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white"
          >
            Craft
          </Tabs.Trigger>
          <Tabs.Trigger
            value="contracts"
            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white"
          >
            Contract Crafting
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="craft">
          <CraftingEditor
            items={badges}
            craftingValues={craftingValues}
            handleCraftingValueChange={handleCraftingValueChange}
            title="Craft Settings"
          />
        </Tabs.Content>
        <Tabs.Content value="contracts">
          <CraftingEditor
            items={contracts}
            craftingValues={craftingValues}
            handleCraftingValueChange={handleCraftingValueChange}
            title="Contract Crafting Settings"
          />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
};

export default ItemCraftingEditor;
