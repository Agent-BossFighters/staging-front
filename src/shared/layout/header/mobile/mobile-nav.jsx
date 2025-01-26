import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import MobileMenu from "./mobile-menu";
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
      <div className="h-20 flex justify-between items-center p-4">
        <button onClick={() => setIsOpen(!isOpen)} className="">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <img src={A} alt="logo" className="h-full" />
        {/* Create connextion / Avatar component */}
        <div>Connection</div>
      </div>

      <MobileMenu
        menuItems={menuItems}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
