import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/auth.context";
import { Button } from "@shared/ui/button";

export default function MobileMenu({ menuItems, isOpen, onClose }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const filteredMenu = menuItems.filter((item) => !item.requiresAuth || user);

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
        {user ? (
          <div className="flex flex-col items-start gap-2 px-4 pt-20 pb-2 border-b border-foreground/50">
            <p className="text-bold text-2xl text-primary">
              {user.username.toUpperCase()}
            </p>
            <Link to="/users/profile" className="text-md hover:text-primary">
              My profile
            </Link>
            <Button
              variant="ghost"
              className="text-md p-0 text-destructive/50"
              onClick={logout}
            >
              Sign out
            </Button>
          </div>
        ) : (
          <div className="px-4 pt-20 pb-2 border-b border-foreground/50">
            <Link className="" to="users/login">
              Sign in
            </Link>
          </div>
        )}
        <nav className="h-full pt-4 px-4">
          <ul className="space-y-4">
            {filteredMenu.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={onClose}
                  className={`block py-2 px-4 rounded-lg ${
                    location.pathname === item.path ? "text-primary" : ""
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
