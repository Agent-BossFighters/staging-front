import { DailyContainer } from "@features/dashboard/daily";

export default function DailyPage() {
  return (
    <div className="flex flex-col">
      <h1 className="text-6xl font-extrabold py-4 text-primary">DAILY</h1>
      <div className="pl-5">
        <DailyContainer />
      </div>
    </div>
  );
}
