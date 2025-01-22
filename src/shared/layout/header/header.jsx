import DesktopNav from './desktop-nav';
import MobileNav from './mobile-nav';

export default function Header() {
  return (
    <header className="shadow-lg fixed w-full top-0 z-50">
      <DesktopNav />
      <MobileNav />
    </header>
  );
}
