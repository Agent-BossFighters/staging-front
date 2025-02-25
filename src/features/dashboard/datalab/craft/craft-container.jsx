import Craft from "./craft.jsx";

export default function CraftContainer() {
  return (
    <div className="flex flex-col px-5 gap-5">
      <div className="w-full flex justify-start items-start">
        <div className="w-full">
          <Craft />
        </div>
      </div>
    </div>
  );
}
