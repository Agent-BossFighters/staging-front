import { DailyContainer } from "@features/dashboard/daily";

export default function DailyPage() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-background text-foreground">
      <div className="flex items-center justify-between px-5 py-4">
      </div>
      <DailyContainer />
    </div>
  );
}
