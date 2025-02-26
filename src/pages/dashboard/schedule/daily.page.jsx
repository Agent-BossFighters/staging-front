import { DailyContainer } from "@features/dashboard/daily";

export default function DailyPage() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-background text-foreground">
      <div className="flex flex-col px-10 lg:px-0 lg:w-[95%] mx-auto">
        <div className="flex items-center justify-between py-4">
          <h1 className="text-6xl font-extrabold text-primary">DAILY</h1>
        </div>

        <div className="pl-5">
          <DailyContainer />
        </div>
      </div>
    </div>
  );
}
