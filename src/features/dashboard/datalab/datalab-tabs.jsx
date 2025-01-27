import { TabsList, TabsTrigger } from "@ui/tabs";

const tabs = [
  { name: "Slot", value: "Slot" },
  { name: "Contract", value: "Contract" },
  { name: "Badge", value: "Badge" },
  { name: "Craft", value: "Craft" },
  { name: "Player Cycle", value: "Player Cycle" },
];

export default function DatalabTabs() {
  <TabsList className="bg-transparent text-2xl pb-4 justify-start">
    {tabs.map((tab) => (
      <TabsTrigger key={tab.value} value={tab.value}>
        {tab.name}
      </TabsTrigger>
    ))}
  </TabsList>;
}
