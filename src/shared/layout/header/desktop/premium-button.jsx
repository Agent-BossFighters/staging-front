import { Link } from "react-router-dom";
import { Button } from "@shared/ui/button";

export default function PremiumButton() {
  return (
    <Link to="/payments/pricing">
      <Button className="bg-primary text-background hover:bg-primary/90 font-medium">
        PREMIUM
      </Button>
    </Link>
  );
}
