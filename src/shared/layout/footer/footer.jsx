import { Link } from 'react-router-dom';
export default function Footer () {
  return (
    <footer className="w-full flex justify-around items-center py-4 text-xs">
      <p>© 2025 Agent</p>
      <div className="flex flex-col md:flex-row items-center gap-4">
        <Link to="/policy/privacy">
          <span className="">Privacy Policy</span>
        </Link>
        <p className="hidden md:block">|</p>
        <Link to="/policy/terms">
          <span className="">Terms of Service</span>
        </Link>
      </div>
      {/* Icon de discord */}
      <p className="hidden md:block">Join our community on Discord</p>
      <p className="md:hidden">Discord</p>
    </footer>
  );
};
