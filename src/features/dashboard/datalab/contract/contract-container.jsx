import Showrunner from "./showrunner";
import ShowrunnerLevel from "./showrunner-level";
export default function ContractContainer() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-3xl font-extrabold py-2">SHOWRUNNER CONTRACTS</h2>
        <Showrunner />
      </div>
      <div>
        <h2 className="text-3xl font-extrabold py-2">
          SHOWRUNNER CONTRACTS LVL UP
        </h2>
        <ShowrunnerLevel />
      </div>
    </div>
  );
}
