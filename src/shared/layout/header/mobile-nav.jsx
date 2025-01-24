import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import MobileMenu from "./mobile-menu";
import HeaderPart from "@features/users/auth/header-part";
import { A } from "@img/index";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/economy", label: "Economy" },
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
      <div className="h-20 flex justify-between items-center p-4 md:hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="z-50">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <Link to="/" className="h-full">
          <img src={A} alt="logo" className="h-full" />
        </Link>
        {/* Create connextion / Avatar component */}
        <HeaderPart />
      </div>

      <MobileMenu
        menuItems={menuItems}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
