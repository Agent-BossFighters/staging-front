import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/tabs";
import {
  SlotContainer,
  ContractContainer,
  BadgeContainer,
  CraftContainer,
  PlayerCycleContainer,
} from "./index";

const tabs = [
  { name: "SLOT", value: "Slot" },
  { name: "CONTRACT", value: "Contract" },
  { name: "BADGE", value: "Badge" },
  { name: "CRAFT", value: "Craft" },
  { name: "PLAYER CYCLE", value: "Player Cycle", disabled: true },
];

export default function DatalabTabs() {
  return (
    <Tabs defaultValue="Slot" className="w-full flex flex-col">
      <div className="w-fit">
        <TabsList className="bg-transparent text-2xl pb-0 justify-start gap-1 flex flex-col">
          <div className="flex gap-1">
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
          <div className="border-primary border-b-2 w-full gap-4"></div>
        </TabsList>
      </div>
      <div className="mt-6">
        <TabsContent value="Slot">
          <SlotContainer />
        </TabsContent>
        <TabsContent value="Contract">
          <ContractContainer />
        </TabsContent>
        <TabsContent value="Badge">
          <BadgeContainer />
        </TabsContent>
        <TabsContent value="Craft">
          <CraftContainer />
        </TabsContent>
        <TabsContent value="Player Cycle">
          <PlayerCycleContainer />
        </TabsContent>
      </div>
    </Tabs>
  );
}
