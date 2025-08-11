import { BossFighters, Map } from "@img/index";
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
import useUmamiTracking from "@utils/hooks/useUmamiTracking";

const menuItems = [
  {
    label: "MENU",
    requiresAuth: true,
    children: [
      { path: "/opensource", label: "Open Source" },
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
  { path: "/economy", label: "Economy map" },
];

export default function DesktopLink() {
  const { user } = useAuth();
  const { track } = useUmamiTracking();

  const handleLinkClick = (label, path) => {
    track(`${label}_section_view`, path, { section: label });
  };

  const filteredMenu = menuItems.filter((item) => !item.requiresAuth || user);

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {filteredMenu.map((item, index) => (
          <NavigationMenuItem key={item.label || index} className="">
            {item.children ? (
              <>
                <NavigationMenuTrigger className="gap-18 h-16">
                  <Link to={item.path} onClick={() => handleLinkClick(item.label, item.path)}>
                    {item.label}
                  </Link>
                </NavigationMenuTrigger>

                <NavigationMenuContent className="p-4 bg-[#212121] text-foreground">
                  {item.children.map((child) => (
                    <NavigationMenuLink
                      asChild
                      key={child.path}
                      className="w-36 text-center py-4 font-bold"
                    >
                      <Link
                        to={child.path}
                        className="block hover:bg-primary hover:text-background rounded"
                        onClick={() => handleLinkClick(child.label, child.path)}
                      >
                        {child.label}
                      </Link>
                    </NavigationMenuLink>
                  ))}
                </NavigationMenuContent>
              </>
            ) : (
              <NavigationMenuLink asChild className="transition-transform duration-200 hover:scale-105">
                <Link to={item.path} className="flex flex-col px-4 hover:text-primary items-center gap-2" onClick={() => handleLinkClick(item.label, item.path)}>
                {item.label === "Economy map" && (
                  <>
                    <img src={BossFighters} alt="BossFightersLogo" className="h-8 hidden xll:block" />
                    <span className="-mt-4 font-bold hidden xll:block">{item.label}</span>

                    <img src={Map} alt="BossFightersEconomyMapLogo" className="h-12 block xll:hidden" /> 
                  </>
                )}
                </Link>


              </NavigationMenuLink>
              
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
