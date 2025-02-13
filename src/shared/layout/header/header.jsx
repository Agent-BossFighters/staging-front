import DesktopNav from "./desktop/desktop-nav";
import MobileNav from "./mobile/mobile-nav";

export default function Header() {
  return (
    <header className="w-full h-20 z-50 border-b border-border/20">
      <DesktopNav />
      <MobileNav />
    </header>
  );
}
