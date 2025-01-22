import DesktopNav from './desktop-nav';
import MobileNav from './mobile/mobile-nav';

export default function Header() {
  return (
    <header className="text-white shadow-lg fixed w-full top-0 z-50">
      <DesktopNav />
      <MobileNav />
    </header>
  );
}
