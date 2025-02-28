import { DailyContainer } from "@features/dashboard/daily";

export default function DailyPage() {
  return (
    <div className="w-5/6 mx-auto h-full">
      <h1 className="text-6xl font-extrabold py-4 text-primary">DAILY</h1>
      <DailyContainer />
    </div>
  );
}
