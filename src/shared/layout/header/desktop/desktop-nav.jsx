import { Link } from "react-router-dom";
import { AgentLogo } from "@img/index";
import HeaderPart from "@features/users/auth/header-part";
import DesktopLink from "./desktop-link";
import { useAuth } from "@context/auth.context";
import CurrencyDisplay from "./currency-display";
import PremiumButton from "./premium-button";
import AdminUpdateCurrencies from "./admin-update-currencies";

export default function DesktopNav() {
  const { user } = useAuth();

  return (
    <div className="hidden md:flex h-full items-center justify-between py-4 px-10 lg:px-0 lg:w-5/6 mx-auto">
      <div className="flex items-center gap-20 h-full">
        {user ? (
          <Link to="/dashboard" className="flex items-center h-full">
            <img src={AgentLogo} alt="Agent logo" className="h-full" />
          </Link>
        ) : (
          <Link to="/" className="flex items-center h-full mr-4">
            <img src={AgentLogo} alt="Agent logo" className="h-full" />
          </Link>
        )}
        <DesktopLink />
      </div>
      <div className="flex items-center gap-4">
        <CurrencyDisplay />
        <AdminUpdateCurrencies />
        <PremiumButton />
        <HeaderPart />
      </div>
    </div>
  );
}
