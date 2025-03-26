import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import MobileMenu from "./mobile-menu";
import { A } from "@img/index";
import { useAuth } from "@context/auth.context";
import { Button } from "@shared/ui/button";
import { Bot } from "lucide-react";
import PremiumButton from "../desktop/premium-button";

export default function MobileNav() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", requiresAuth: true },
    { path: "/economy", label: "Economy" },
    { path: "/payments/donation", label: "Support us" },
  ];

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <div className="lg:hidden h-20 flex justify-between items-center p-4">
        <button onClick={() => setIsOpen(!isOpen)} className="z-50">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        <Link to="/" className="flex items-center">
          <img src={A} alt="logo" className="w-10 h-10 object-contain" />
        </Link>

        <div className="flex items-center gap-2">
          <PremiumButton isMobile={true} />
          {user ? (
            <Link to="/users/profile" className="text-md hover:text-primary">
              {user.asset ? (
                <img src={user.asset} alt={user.username} />
              ) : (
                <Bot size={24} className="text-primary" />
              )}
            </Link>
          ) : (
            <Link to="users/login">
              <Bot size={24} className="text-primary" />
            </Link>
          )}
        </div>
      </div>

      <MobileMenu
        menuItems={menuItems}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
