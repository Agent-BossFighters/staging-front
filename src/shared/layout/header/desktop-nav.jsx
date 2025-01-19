import { Link } from 'react-router-dom';

export default function DesktopNav() {
  return (
    <div className="hidden">
      <div className="flex items-center">
        <Link to="/" className="flex items-center">
          <img src="/assets/logo.svg" alt="Agent" className="h-8 w-auto" />
        </Link>
      </div>

      {/* Currency */}
      <div className="flex items-center gap-4">
        <div className="bg-amber-500 text-black px-2 py-1 rounded text-sm font-medium">
          PREMIUM
        </div>
        <button className="w-8 h-8 rounded-full bg-gray-700">
          {/* User */}
        </button>
      </div>
    </div>
  );
}
