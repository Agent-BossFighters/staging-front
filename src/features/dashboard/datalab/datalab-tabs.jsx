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
  { name: "PLAYER CYCLE", value: "Player Cycle" },
];

export default function DatalabTabs() {
  return (
    <Tabs defaultValue="Slot" className="w-full flex flex-col pl-8">
      <TabsList className="bg-transparent text-2xl pb-6 justify-start gap-1">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.name}
          </TabsTrigger>
        ))}
      </TabsList>
      <div className="border-primary border-b-2 w-[830px] gap-4"></div>
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
    </Tabs>
  );
}
