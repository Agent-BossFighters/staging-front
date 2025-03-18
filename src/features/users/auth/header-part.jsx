import { Link } from "react-router-dom";
import Login from "@features/users/auth/login";
import { useAuth } from "@context/auth.context";
import { Avatar, AvatarFallback, AvatarImage } from "@shared/ui/avatar";
import { Button } from "@shared/ui/button";
import { Bot } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@ui/navigation-menu";

export default function HeaderPart() {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) return null;

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          {user ? (
            <>
              <NavigationMenuTrigger className="h-full flex items-center p-2 ps-6 rounded-full border border-border/20 hover:bg-primary hover:text-background">
                <p className="text-bold pr-2">
                  {user.username.toUpperCase()}
                </p>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user.asset} alt={user.username} />
                  <AvatarFallback className="bg-background">
                    <Bot size={32} className="text-primary bg-transparent" />
                  </AvatarFallback>
                </Avatar>
              </NavigationMenuTrigger>
              <NavigationMenuContent className="w-full p-3 bg-background border border-border rounded-lg text-foreground">
                <div className="w-full flex flex-col items-start">
                  <p className="border-b border-border/20 w-full py-2 px-2 font-medium">
                    {user.username.toUpperCase()}
                  </p>
                  <NavigationMenuLink asChild className="w-full">
                    <Link
                      to="/users/profile"
                      className="py-2 px-2 hover:text-primary w-full block whitespace-nowrap"
                    >
                      My profile
                    </Link>
                  </NavigationMenuLink>
                  <Button
                    variant="ghost"
                    className="text-xs py-2 px-2 h-auto text-muted-foreground hover:bg-transparent hover:text-destructive/70 w-full justify-start"
                    onClick={logout}
                  >
                    Sign out
                  </Button>
                </div>
              </NavigationMenuContent>
            </>
          ) : (
            <NavigationMenuLink asChild>
              <Link
                className="flex items-center gap-2 opacity-70 hover:opacity-100"
                to="users/login"
              >
                <span className="hidden md:block text-white translate-y-0.5">
                  Sign in
                </span>
                <Bot size={32} className="text-primary" />
              </Link>
            </NavigationMenuLink>
          )}
        </NavigationMenuItem>
        {!user && (
          <NavigationMenuItem>
            <NavigationMenuContent className="w-96 p-5 bg-background border border-border rounded-lg">
              <Login />
              <div className="mt-5 text-end text-xs flex justify-end">
                <p>Don&#39;t have an account?&nbsp;</p>
                <NavigationMenuLink asChild>
                  <Link to="/users/register" className="text-primary">
                    Sign up
                  </Link>
                </NavigationMenuLink>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
