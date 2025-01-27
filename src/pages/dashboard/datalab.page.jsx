import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/tabs";
import {
  SlotContainer,
  Contract,
  Badge,
  Craft,
  PlayerCycle,
} from "@features/dashboard/datalab";

const tabs = [
  { name: "Slot", value: "Slot" },
  { name: "Contract", value: "Contract" },
  { name: "Badge", value: "Badge" },
  { name: "Craft", value: "Craft" },
  { name: "Player Cycle", value: "Player Cycle" },
];

export default function DatalabPage() {
  return (
    <Tabs defaultValue="Slot" className="w-full mt-5 flex flex-col">
      <TabsList className="bg-transparent text-2xl pb-4 justify-start">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.name}
          </TabsTrigger>
        ))}
      </TabsList>
      <div className="border-primary border-b-4 md:w-3/4 lg:w-1/2"></div>
      <TabsContent value="Slot">
        <SlotContainer />
      </TabsContent>
      <TabsContent value="Contract">
        <Contract />
      </TabsContent>
      <TabsContent value="Badge">
        <Badge />
      </TabsContent>
      <TabsContent value="Craft">
        <Craft />
      </TabsContent>
      <TabsContent value="Player Cycle">
        <PlayerCycle />
      </TabsContent>
    </Tabs>
  );
}
