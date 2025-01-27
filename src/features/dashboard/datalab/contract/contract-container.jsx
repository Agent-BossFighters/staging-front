import Showrunner from "./showrunner";
import ShowrunnerLevel from "./showrunner-level";
export default function ContractContainer() {
  return (
    <div className="flex flex-col px-5">
      <Showrunner />
      <ShowrunnerLevel />
    </div>
  );
}
