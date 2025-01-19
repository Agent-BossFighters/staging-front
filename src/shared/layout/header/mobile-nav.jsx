import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const menuItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/dashboard/vestiary', label: 'Vestiary' },
    { path: '/dashboard/datalab', label: 'Datalab' },
    { path: '/dashboard/farming', label: 'Farming' },
    { path: '/dashboard/playing', label: 'Playing' },
  ];

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-5 left-4 z-50 text-gray-200 hover:text-white"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-40">
          <div 
            className="absolute inset-0 bg-black/50 transition-opacity"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-stone-900 shadow-xl transform transition-transform">
            <nav className="h-full pt-20 px-4">
              <ul className="space-y-4">
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`block py-2 px-4 rounded-lg ${
                        location.pathname === item.path
                          ? 'bg-stone-700 text-white'
                          : 'text-gray-300 hover:bg-stone-800 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
