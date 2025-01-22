import DesktopNav from './desktop-nav';
import MobileNav from './mobile-nav';

export default function Header() {
  return (
    <header className="shadow-lg w-full z-50">
      <DesktopNav />
      <MobileNav />
    </header>
  );
}
