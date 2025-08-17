import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/tabs";
import {
  LockerContainer,
  LockerContract,
  LockerBadges,
  LockerBuilds,
  LockerRecharge,
} from "./index";

const tabs = [
  { name: "TACTICS", value: "Container" },
  { name: "CONTRACT(S)", value: "Contract" },
  { name: "BADGE(S)", value: "Badges" },
  { name: "BUILD(S)", value: "Builds" },
  { name: "RECHARGE DISCOUNT(S)", value: "Recharge", disabled: true },
];

export default function LockerTabs() {
  return (
    <Tabs defaultValue="Container" className="w-full flex flex-col">
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
      <div className="mt-6">
        <TabsContent value="Container">
          <LockerContainer />
        </TabsContent>
        <TabsContent value="Contract">
          <LockerContract />
        </TabsContent>
        <TabsContent value="Badges">
          <LockerBadges />
        </TabsContent>
        <TabsContent value="Builds">
          <LockerBuilds />
        </TabsContent>
        <TabsContent value="Recharge">
          <LockerRecharge />
        </TabsContent>
      </div>
    </Tabs>
  );
}
