import { Link } from "react-router-dom";
import { AgentLogo, A } from "@img/index";
import HeaderPart from "@features/users/auth/header-part";
import DesktopLink from "./desktop-link";
import { useAuth } from "@context/auth.context";
import CurrencyDisplay from "./currency-display";
import PremiumButton from "./premium-button";
import AdminUpdateCurrencies from "./admin-update-currencies";

export default function DesktopNav() {
  const { user } = useAuth();

  return (
    <div className="hidden lg:flex h-full items-center justify-between py-4 px-10 lg:px-0 lg:w-5/6 mx-auto">
      <div className="flex items-center gap-20 h-full">
        {user ? (
          <div className="flex flex-col h-full">
            <Link to="/dashboard" className="flex items-center h-full">
              <img src={A} alt="A logo" className="lg:block xl:hidden w-10 h-10 object-contain" />
              <img src={AgentLogo} alt="Agent logo" className="hidden xl:block h-full" />
            </Link>
              {user.isPremium ? (
                <p className="text-sm font-bold italic text-primary flex justify-end">PREMIUM</p>
              ) : (
                <p className="text-sm font-bold italic text-secondary flex justify-end">FREEMIUM</p>
              )}
          </div>
        ) : (
          <Link to="/" className="flex items-center h-full mr-4">
            <img src={A} alt="A logo" className="lg:block xl:hidden w-10 h-10 object-contain" />
            <img src={AgentLogo} alt="Agent logo" className="hidden xl:block h-full" />
          </Link>
        )}
        <DesktopLink />
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden xl:block">
          <CurrencyDisplay />
        </div>
        <AdminUpdateCurrencies />
        <PremiumButton />
        <HeaderPart />
      </div>
    </div>
  );
}
