import { Link } from "react-router-dom";
import { Button } from "@shared/ui/button";
import { useAuth } from "@context/auth.context";
import useUmamiTracking from "@utils/hooks/useUmamiTracking"

export default function PremiumButton({ isMobile = false }) {
  const { user } = useAuth();
  const { track } = useUmamiTracking();

  const handleSupportUsClick = () => {
    track("support_us_click", window.location.pathname, { button: "Support Us"});
  }

  const handlePremiumClick = () => {
    track("premium_click", window.location.pathname, { button: "Premium"});
  }

  // Si l'utilisateur n'est pas connecté, on ne rend rien
  if (!user) return null;

  // Sinon, on affiche le bouton pour devenir premium
  return (
    <>
      {!user.isPremium ? (
      <Link to="/payments/pricing">
        <Button
          className={`${isMobile ? "text-xs py-1 px-2" : ""}`}
          size={isMobile ? "sm" : "default"}
          onClick={handlePremiumClick}
        >
          PREMIUM
        </Button>
      </Link>
      ) : ( '' )}
        <Link to="/payments/donation">
          <Button
          className={`${isMobile ? "text-xs py-1 px-2" : ""}`}
          size={isMobile ? "sm" : "default"}
          onClick={handleSupportUsClick}
        >
          SUPPORT US
        </Button>
      </Link>
    </>
  );
}
