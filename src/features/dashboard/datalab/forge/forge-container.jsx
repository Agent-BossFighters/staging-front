import Forge from "./forge.jsx";

export default function ForgeContainer() {
  return (
    <div className="flex flex-col gap-5">
      <div className="w-full flex justify-start items-start">
        <div className="w-full">
          <Forge />
        </div>
      </div>
    </div>
  );
}


