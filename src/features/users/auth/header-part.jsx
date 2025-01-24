import { useState } from 'react';
import { Link } from 'react-router-dom';
import Login from '@features/users/auth/login';
import { Bot } from 'lucide-react';

export default function HeaderPart() {
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsOpen(true); // Ouvre le pop-up
  };

  const handleMouseLeave = () => {
    setIsOpen(false); // Ferme le pop-up
  };

  return (
    <div className="relative">
      <Link
        className="flex items-center gap-2 opacity-70 hover:opacity-100"
        onMouseEnter={handleMouseEnter}
        to="users/login"
      >
        <Bot size={32} className="text-primary" />
        <span className="hidden md:block text-white translate-y-0.5">Sign in</span>
      </Link>

      {isOpen && (
        <div
          className="absolute top-10 right-0 w-96 p-5 bg-background border border-border rounded-lg"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Login />
          <div className="mt-5 text-end text-xs flex justify-end">
            <p>Don't have an account?&nbsp;</p><Link to="/users/register" className="text-primary">Sign up</Link>
          </div>
        </div>
      )}
    </div>
  );
}
