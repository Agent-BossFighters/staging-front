import DatalabTabs from "@features/dashboard/datalab/datalab-tabs";
export default function DatalabPage() {
  return (
    <div className="w-5/6 mx-auto flex flex-col h-full">
      <h1 className="text-6xl font-extrabold py-8 text-primary">DATA LAB</h1>
      <DatalabTabs />
    </div>
  );
}
