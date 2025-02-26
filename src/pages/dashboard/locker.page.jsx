import {
  LockerContainer,
  LockerContract,
  LockerBadges,
  LockerBuilds,
  LockerRecharge,
} from "@features/dashboard/locker";

export default function LockerPage() {
  return (
    <div className="flex flex-col px-10 lg:px-0 lg:w-[95%] mx-auto">
      <h1 className="text-6xl font-extrabold py-4 text-primary">LOCKER</h1>
      <div className="flex flex-col lg:flex-row gap-20 flex-grow">
        <div className="flex flex-col lg:w-1/2 gap-5 h-full">
          <LockerContainer />
          <LockerContract />
          <LockerBadges />
        </div>
        <div className="flex flex-col lg:w-1/2 h-full">
          <LockerBuilds />
          <LockerRecharge />
        </div>
      </div>
    </div>
  );
}
