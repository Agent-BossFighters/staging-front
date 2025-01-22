import DesktopNav from './desktop-nav';
import MobileNav from './mobile-nav';

export default function Header() {
  return (
    <header className="w-full z-50 border-b border-border">
      <DesktopNav />
      <MobileNav />
    </header>
  );
}
