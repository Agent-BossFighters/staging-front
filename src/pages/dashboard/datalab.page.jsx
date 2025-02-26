import DatalabTabs from "@features/dashboard/datalab/datalab-tabs";
export default function DatalabPage() {
  return (
    <div className="flex flex-col px-10 lg:px-0 lg:w-[95%] mx-auto">
      <h1 className="text-6xl font-extrabold py-8 text-primary">DATA LAB</h1>
      <DatalabTabs />
    </div>
  );
}
