import { Link, useLocation } from "react-router-dom";

export default function MobileMenu({ menuItems, isOpen, onClose }) {
  const location = useLocation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Menu Content */}
      <div className="absolute left-0 top-0 bottom-0 w-64 bg-stone-900 shadow-xl transform transition-transform">
        <nav className="h-full pt-20 px-4">
          <ul className="space-y-4">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={onClose}
                  className={`block py-2 px-4 rounded-lg ${
                    location.pathname === item.path
                      ? "bg-stone-700 text-white"
                      : "text-gray-300 hover:bg-stone-800 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
