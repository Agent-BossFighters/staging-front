import LockerTabs from "@features/dashboard/locker/locker-tabs";

export default function LockerPage() {
  return (
    <div className="w-5/6 mx-auto flex flex-col h-full">
      <h1 className="text-5xl font-extrabold pt-8 pb-2 text-primary">LOCKER</h1>
      <LockerTabs />
    </div>
  );
}
