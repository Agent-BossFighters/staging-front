import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/tabs";

import {
  BossWheel,
  PackOpening,
} from "./index";

const tabs = [
  { name: "BOSS WHEEL", value: "Boss Wheel" },
  { name: "PACK OPENING", value: "Pack Opening" },
];

export default function TvToolsTabs() {
  return (
  <Tabs defaultValue="Boss Wheel" className="w-full flex flex-col">
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
      <TabsContent value="Boss Wheel">
        <BossWheel />
      </TabsContent>
      <TabsContent value="Pack Opening">
        <PackOpening />
      </TabsContent>
    </div>
  </Tabs>
  );
}