import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const menuItems = [
  {
    path: "/dashboard",
    label: "Dashboard",
    children: [
      { path: "/dashboard/vestiary", label: "Vestiary" },
      { path: "/dashboard/datalab", label: "Datalab" },
      { path: "/dashboard/farming", label: "Farming" },
      { path: "/dashboard/playing", label: "Playing" },
    ],
  },
  { path: "/economy", label: "Economy" },
];

export default function DesktopLink() {
  const [openMenu, setOpenMenu] = useState(null);
  const [delayClose, setDelayClose] = useState(null);

  const handleMouseEnter = (label) => {
    clearTimeout(delayClose);
    setOpenMenu(label);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setOpenMenu(null);
    }, 200);
    setDelayClose(timeout);
  };

  useEffect(() => {
    return () => clearTimeout(delayClose);
  }, [delayClose]);

  return (
    <div className="flex gap-4">
      {menuItems.map((item) => (
        <div
          key={item.path}
          className="relative"
          onMouseEnter={() => handleMouseEnter(item.label)}
          onMouseLeave={handleMouseLeave}
        >
          <Link
            to={item.path}
            className="hover:text-primary flex items-center gap-2"
          >
            {item.label}
            {item.children && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4 hidden lg:block"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            )}
          </Link>

          {item.children && openMenu === item.label && (
            <ul className="absolute left-0 top-full mt-2 flex flex-col rounded p-1 bg-background border border-border z-10">
              {item.children.map((child) => (
                <li key={child.path}>
                  <Link to={child.path} className="block px-4 py-2 text-sm">
                    {child.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
