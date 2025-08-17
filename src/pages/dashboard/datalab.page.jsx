import DatalabTabs from "@features/dashboard/datalab/datalab-tabs";
export default function DatalabPage() {
  return (
    <div className="w-[80vw] mx-auto flex flex-col h-full">
      <h1 className="text-5xl font-extrabold pt-8 pb-2 text-primary mb-4">DATA LAB</h1>
      <DatalabTabs />
    </div>
  );
}
