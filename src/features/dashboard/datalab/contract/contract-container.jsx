import Showrunner from "./showrunner";
import ShowrunnerLevel from "./showrunner-level";
export default function ContractContainer() {
  return (
    <div className="flex flex-col">
      <Showrunner />
      <ShowrunnerLevel />
    </div>
  );
}
