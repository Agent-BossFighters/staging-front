import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/tabs";
import {
  SlotContainer,
  ContractContainer,
  BadgeContainer,
  ForgeContainer,
  PlayerCycleContainer,
} from "./index";

const tabs = [
  { name: "SLOT", value: "Slot" },
  { name: "CONTRACT", value: "Contract" },
  { name: "BADGE", value: "Badge" },
  { name: "FORGE", value: "Forge" },
  { name: "PLAYER CYCLE", value: "Player Cycle", disabled: true },
];

export default function DatalabTabs({ defaultTab = "Slot" }) {
  // sécurité : si on passe un onglet inconnu, retombe sur "Slot"
  const allowed = new Set(tabs.filter(t => !t.disabled).map(t => t.value));
  const initial = allowed.has(defaultTab) ? defaultTab : "Slot";
  
  return (
    <Tabs defaultValue={initial} className="w-full flex flex-col bg-transparent">
      <div className="w-[80vw] mx-auto overflow-x-auto overflow-y-hidden">
        <TabsList className="bg-transparent text-2xl p-0 h-auto flex flex-col items-start justify-start">
          <div className="flex gap-1 w-max whitespace-nowrap">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                disabled={tab.disabled}
              >
                {tab.name}
              </TabsTrigger>
            ))}
          </div>
          <div className="border-primary border-b-2 w-full"></div>
        </TabsList>
      </div>
      <div className="mt-6 w-[80vw] mx-auto">
        <TabsContent value="Slot">
          <SlotContainer />
        </TabsContent>
        <TabsContent value="Contract">
          <ContractContainer />
        </TabsContent>
        <TabsContent value="Badge">
          <BadgeContainer />
        </TabsContent>
        <TabsContent value="Forge">
          <ForgeContainer />
        </TabsContent>
        <TabsContent value="Player Cycle">
          <PlayerCycleContainer />
        </TabsContent>
      </div>
    </Tabs>
  );
}
