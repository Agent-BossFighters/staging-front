import { DailyContainer } from "@features/dashboard/daily";

export default function DailyPage() {
  return (
    <div className="w-[80vw] mx-auto h-full">
      <h1 className="text-5xl font-extrabold pt-8 pb-2 text-primary">DAILY</h1>
      <DailyContainer />
    </div>
  );
}
