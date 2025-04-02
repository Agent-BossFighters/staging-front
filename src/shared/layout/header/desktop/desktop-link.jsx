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
    label: "MENU",
    requiresAuth: true,
    children: [
      { path: "/economy", label: "Economy" },
      { path: "/dashboard", label: "Dashboard" },
      { path: "/dashboard/locker", label: "Locker" },
      { path: "/dashboard/datalab", label: "Datalab" },
      { path: "/dashboard/missions", label: "Missions" },
      { path: "/dashboard/schedule/daily", label: "Daily" },
      { path: "/dashboard/schedule/monthly", label: "Monthly" },
      //   { path: "/dashboard/schedule", label: "Schedule" },
      //   { path: "/dashboard/playing", label: "Playing" },
    ],
  },
  // { path: "/economy", label: "Economy map" },
];

export default function DesktopLink() {
  const { user } = useAuth();
  const filteredMenu = menuItems.filter((item) => !item.requiresAuth || user);

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {filteredMenu.map((item) => (
          <NavigationMenuItem key={item.path} className="">
            {item.children ? (
              <>
                <NavigationMenuTrigger className="gap-10">
                  <Link to={item.path}>{item.label}</Link>
                </NavigationMenuTrigger>
                <NavigationMenuContent className="p-4 bg-background text-foreground border border-border rounded-md shadow-md">
                  {item.children.map((child) => (
                    <NavigationMenuLink
                      asChild
                      key={child.path}
                      className="w-36 text-center py-1"
                    >
                      <Link
                        to={child.path}
                        className="block hover:bg-primary hover:text-background rounded"
                      >
                        {child.label}
                      </Link>
                    </NavigationMenuLink>
                  ))}
                </NavigationMenuContent>
              </>
            ) : (
              <NavigationMenuLink asChild className="">
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
