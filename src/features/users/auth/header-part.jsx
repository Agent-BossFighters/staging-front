import { useState } from "react";
import { Link } from "react-router-dom";
import Login from "@features/users/auth/login";
import { useAuth } from "@context/auth.context";
import { Avatar, AvatarFallback, AvatarImage } from "@shared/ui/avatar";
import { Button } from "@shared/ui/button";
import { Bot } from "lucide-react";

export default function HeaderPart() {
  const { user, isLoading, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = () => setIsOpen(true);
  const handleMouseLeave = () => setIsOpen(false);

  if (isLoading) return null;

  return (
    <div className="relative">
      {user ? (
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="flex items-center gap-2 opacity-70 hover:opacity-100 p-2 ps-4 rounded-full border border-border"
        >
          <p className="text-bold">{user.username.toUpperCase()}</p>
          <Avatar className="cursor-pointer">
            <AvatarImage src={user.asset} alt={user.username} />
            <AvatarFallback className="bg-background">
              <Bot size={32} className="text-primary" />
            </AvatarFallback>
          </Avatar>

          {isOpen && (
            <div
              className="absolute top-10 right-0 w-96 p-5 bg-background border border-border rounded-lg"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex flex-col items-center justify-between gap-2">
                <p className="">{user.username}</p>
                <Link to="/users/profile" className="hover:text-primary">
                  My profile | Edit
                </Link>
                <Button
                  variant="ghost"
                  className="text-xs text-muted-foreground hover:bg-destructive/70"
                  onClick={logout}
                >
                  Sign out
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Link
          className="flex items-center gap-2 opacity-70 hover:opacity-100"
          onMouseEnter={handleMouseEnter}
          to="users/login"
        >
          <span className="hidden md:block text-white translate-y-0.5">
            Sign in
          </span>
          <Bot size={32} className="text-primary" />
        </Link>
      )}
      {!user && isOpen && (
        <div
          className="absolute top-10 right-0 w-96 p-5 bg-background border border-border rounded-lg"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Login />
          <div className="mt-5 text-end text-xs flex justify-end">
            <p>Don&#39;t have an account?&nbsp;</p>
            <Link to="/users/register" className="text-primary">
              Sign up
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
