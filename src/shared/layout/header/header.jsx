import DesktopNav from './desktop-nav';
import MobileNav from './mobile-nav';

export default function Header() {
  return (
    <header className="bg-[#1a1b1e] text-white shadow-lg fixed w-full top-0 z-50">
      <DesktopNav />
      <MobileNav />
    </header>
  );
}
