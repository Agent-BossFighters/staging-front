import { DailyContainer } from "@features/dashboard/daily";

export default function DailyPage() {
  return (
    <div className="w-5/6 mx-auto h-full max-w-[1700px] mr-auto ml-auto">
      <h1 className="text-5xl font-extrabold pt-8 pb-2 text-primary">DAILY</h1>
      <DailyContainer />
    </div>
  );
}
