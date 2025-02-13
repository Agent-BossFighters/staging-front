import { Link } from "react-router-dom";
import { useAuth } from "@context/auth.context";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@ui/navigation-menu";

const menuItems = [
  {
    path: "/dashboard",
    label: "Dashboard",
    requiresAuth: true,
    children: [
      { path: "/dashboard/locker", label: "Locker" },
      { path: "/dashboard/datalab", label: "Datalab" },
      //   { path: "/dashboard/schedule", label: "Schedule" },
      //   { path: "/dashboard/playing", label: "Playing" },
    ],
  },
  { path: "/economy", label: "Economy" },
];

export default function DesktopLink() {
  const { user } = useAuth();
  const filteredMenu = menuItems.filter((item) => !item.requiresAuth || user);

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {filteredMenu.map((item) => (
          <NavigationMenuItem key={item.path}>
            {item.children ? (
              <>
                <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
                <NavigationMenuContent className="p-2 bg-background text-foreground border border-border rounded-md shadow-md">
                  {item.children.map((child) => (
                    <NavigationMenuLink asChild key={child.path}>
                      <Link
                        to={child.path}
                        className="block px-4 py-2 hover:bg-primary hover:text-background rounded"
                      >
                        {child.label}
                      </Link>
                    </NavigationMenuLink>
                  ))}
                </NavigationMenuContent>
              </>
            ) : (
              <NavigationMenuLink asChild>
                <Link to={item.path} className="px-4 py-2 hover:text-primary">
                  {item.label}
                </Link>
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
