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
  forgeSettings,
  forgeValues,
  handleForgeValueChange,
  perksSettings,
  perksValues,
  handlePerksValueChange,
  handleSavePerks,
  handleSaveForge,
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

      <Tabs.Root defaultValue="forge_merge_digital" className="w-full">
        <Tabs.List className="flex gap-4 mb-4 border-b border-gray-700">
          <Tabs.Trigger
            value="forge_merge_digital"
            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white"
          >
            Forge: Merge Digital
          </Tabs.Trigger>
          <Tabs.Trigger
            value="forge_merge_nft"
            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white"
          >
            Forge: Merge NFT
          </Tabs.Trigger>
          <Tabs.Trigger
            value="forge_craft_nft"
            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white"
          >
            Forge: Craft NFT
          </Tabs.Trigger>
          <Tabs.Trigger
            value="perks"
            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white"
          >
            Perks Lock
          </Tabs.Trigger>
          <Tabs.Trigger
            value="contracts"
            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white"
          >
            Contract Crafting
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="contracts">
          <CraftingEditor
            items={contracts}
            craftingValues={craftingValues}
            handleCraftingValueChange={handleCraftingValueChange}
            title="Contract Crafting Settings"
          />
        </Tabs.Content>

        <Tabs.Content value="forge_merge_digital">
          <div className="max-h-[70vh] overflow-y-auto space-y-4">
            <h3 className="text-primary text-sm font-medium uppercase sticky top-0 bg-gray-800 py-2">Forge: Merge Digital</h3>
            <div className="flex justify-end mb-2">
              <Button onClick={() => handleSaveForge && handleSaveForge(onClose)} disabled={isUpdating} className="bg-green-600 hover:bg-green-700 text-white">
                {isUpdating ? "Saving..." : "Save Forge"}
              </Button>
            </div>
            {forgeSettings.filter((s) => s.operation_type === "merge_digital").map((s) => (
              <div key={s.id} className="bg-gray-900/50 p-4 rounded-lg grid grid-cols-2 gap-3">
                <div className="text-sm font-medium">{s.rarity}</div>
                <div>
                  <label className="block text-gray-300 text-xs mb-1">Nb previous</label>
                  <Input type="number" min="0" value={forgeValues[s.id]?.nb_previous_required ?? ''} onChange={(e)=>handleForgeValueChange(s.id,'nb_previous_required',e.target.value)} className="w-full bg-gray-700" />
                </div>
                <div>
                  <label className="block text-gray-300 text-xs mb-1">Cash</label>
                  <Input type="number" min="0" value={forgeValues[s.id]?.cash ?? ''} onChange={(e)=>handleForgeValueChange(s.id,'cash',e.target.value)} className="w-full bg-gray-700" />
                </div>
              </div>
            ))}
          </div>
        </Tabs.Content>

        <Tabs.Content value="forge_merge_nft">
          <div className="max-h-[70vh] overflow-y-auto space-y-4">
            <h3 className="text-primary text-sm font-medium uppercase sticky top-0 bg-gray-800 py-2">Forge: Merge NFT</h3>
            <div className="flex justify-end mb-2">
              <Button onClick={() => handleSaveForge && handleSaveForge(onClose)} disabled={isUpdating} className="bg-green-600 hover:bg-green-700 text-white">
                {isUpdating ? "Saving..." : "Save Forge"}
              </Button>
            </div>
            {forgeSettings.filter((s) => s.operation_type === "merge_nft").map((s) => (
              <div key={s.id} className="bg-gray-900/50 p-4 rounded-lg grid grid-cols-2 gap-3">
                <div className="text-sm font-medium">{s.rarity}</div>
                <div>
                  <label className="block text-gray-300 text-xs mb-1">Supply</label>
                  <Input type="number" min="0" value={forgeValues[s.id]?.supply ?? ''} onChange={(e)=>handleForgeValueChange(s.id,'supply',e.target.value)} className="w-full bg-gray-700" />
                </div>
                <div>
                  <label className="block text-gray-300 text-xs mb-1">Nb previous</label>
                  <Input type="number" min="0" value={forgeValues[s.id]?.nb_previous_required ?? ''} onChange={(e)=>handleForgeValueChange(s.id,'nb_previous_required',e.target.value)} className="w-full bg-gray-700" />
                </div>
                <div>
                  <label className="block text-gray-300 text-xs mb-1">Cash</label>
                  <Input type="number" min="0" value={forgeValues[s.id]?.cash ?? ''} onChange={(e)=>handleForgeValueChange(s.id,'cash',e.target.value)} className="w-full bg-gray-700" />
                </div>
                <div>
                  <label className="block text-gray-300 text-xs mb-1">Fusion Core</label>
                  <Input type="number" min="0" value={forgeValues[s.id]?.fusion_core ?? ''} onChange={(e)=>handleForgeValueChange(s.id,'fusion_core',e.target.value)} className="w-full bg-gray-700" />
                </div>
                <div>
                  <label className="block text-gray-300 text-xs mb-1">$BFT</label>
                  <Input type="number" min="0" value={forgeValues[s.id]?.bft_tokens ?? ''} onChange={(e)=>handleForgeValueChange(s.id,'bft_tokens',e.target.value)} className="w-full bg-gray-700" />
                </div>
                <div>
                  <label className="block text-gray-300 text-xs mb-1">SP.MARKS Reward</label>
                  <Input type="number" min="0" value={forgeValues[s.id]?.sponsor_marks_reward ?? ''} onChange={(e)=>handleForgeValueChange(s.id,'sponsor_marks_reward',e.target.value)} className="w-full bg-gray-700" />
                </div>
              </div>
            ))}
          </div>
        </Tabs.Content>

        <Tabs.Content value="forge_craft_nft">
          <div className="max-h-[70vh] overflow-y-auto space-y-4">
            <h3 className="text-primary text-sm font-medium uppercase sticky top-0 bg-gray-800 py-2">Forge: Craft NFT</h3>
            <div className="flex justify-end mb-2">
              <Button onClick={() => handleSaveForge && handleSaveForge(onClose)} disabled={isUpdating} className="bg-green-600 hover:bg-green-700 text-white">
                {isUpdating ? "Saving..." : "Save Forge"}
              </Button>
            </div>
            {forgeSettings.filter((s) => s.operation_type === "craft_nft").map((s) => (
              <div key={s.id} className="bg-gray-900/50 p-4 rounded-lg grid grid-cols-2 gap-3">
                <div className="text-sm font-medium">{s.rarity}</div>
                <div>
                  <label className="block text-gray-300 text-xs mb-1">Supply</label>
                  <Input type="number" min="0" value={forgeValues[s.id]?.supply ?? ''} onChange={(e)=>handleForgeValueChange(s.id,'supply',e.target.value)} className="w-full bg-gray-700" />
                </div>
                <div>
                  <label className="block text-gray-300 text-xs mb-1">Nb digital</label>
                  <Input type="number" min="0" value={forgeValues[s.id]?.nb_digital_required ?? ''} onChange={(e)=>handleForgeValueChange(s.id,'nb_digital_required',e.target.value)} className="w-full bg-gray-700" />
                </div>
                <div>
                  <label className="block text-gray-300 text-xs mb-1">$BFT</label>
                  <Input type="number" min="0" value={forgeValues[s.id]?.bft_tokens ?? ''} onChange={(e)=>handleForgeValueChange(s.id,'bft_tokens',e.target.value)} className="w-full bg-gray-700" />
                </div>
                <div>
                  <label className="block text-gray-300 text-xs mb-1">SP.MARKS Reward</label>
                  <Input type="number" min="0" value={forgeValues[s.id]?.sponsor_marks_reward ?? ''} onChange={(e)=>handleForgeValueChange(s.id,'sponsor_marks_reward',e.target.value)} className="w-full bg-gray-700" />
                </div>
              </div>
            ))}
          </div>
        </Tabs.Content>

        <Tabs.Content value="perks">
          <div className="max-h-[70vh] overflow-y-auto space-y-4">
            <h3 className="text-primary text-sm font-medium uppercase sticky top-0 bg-gray-800 py-2">Perks Lock</h3>
            <div className="flex justify-end mb-2">
              <Button onClick={() => handleSavePerks && handleSavePerks(onClose)} disabled={isUpdating} className="bg-green-600 hover:bg-green-700 text-white">
                {isUpdating ? "Saving..." : "Save Perks"}
              </Button>
            </div>
            {perksSettings.map((s) => (
              <div key={s.id} className="bg-gray-900/50 p-4 rounded-lg grid grid-cols-5 gap-3 items-end">
                <div className="text-sm font-medium">{s.rarity}</div>
                <div>
                  <label className="block text-gray-300 text-xs mb-1">No Star</label>
                  <Input type="number" min="0" value={perksValues[s.id]?.star_0 ?? ''} onChange={(e)=>handlePerksValueChange(s.id,'star_0',e.target.value)} className="w-full bg-gray-700" />
                </div>
                <div>
                  <label className="block text-gray-300 text-xs mb-1">★</label>
                  <Input type="number" min="0" value={perksValues[s.id]?.star_1 ?? ''} onChange={(e)=>handlePerksValueChange(s.id,'star_1',e.target.value)} className="w-full bg-gray-700" />
                </div>
                <div>
                  <label className="block text-gray-300 text-xs mb-1">★★</label>
                  <Input type="number" min="0" value={perksValues[s.id]?.star_2 ?? ''} onChange={(e)=>handlePerksValueChange(s.id,'star_2',e.target.value)} className="w-full bg-gray-700" />
                </div>
                <div>
                  <label className="block text-gray-300 text-xs mb-1">★★★</label>
                  <Input type="number" min="0" value={perksValues[s.id]?.star_3 ?? ''} onChange={(e)=>handlePerksValueChange(s.id,'star_3',e.target.value)} className="w-full bg-gray-700" />
                </div>
              </div>
            ))}
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
};

export default ItemCraftingEditor;
