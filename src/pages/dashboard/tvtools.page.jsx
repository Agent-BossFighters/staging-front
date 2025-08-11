import TvToolsTabs from "@features/dashboard/tvtools/tvtools-tabs";

export default function TvToolsPage() {
  return (
    <div className="w-5/6 mx-auto flex flex-col h-full">
      <h1 className="text-5xl font-extrabold pt-8 pb-2 text-primary">TV Tools</h1>
      <TvToolsTabs />
    </div>
  );
}