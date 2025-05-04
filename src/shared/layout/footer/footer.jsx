import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <footer className="w-full text-xs border-t border-border/20 py-4 mt-4">
      <div className="flex justify-between items-center px-10 lg:px-0 lg:w-5/6 mx-auto">
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
        {/* Icon de discord + support */}
        <div className="flex items-center gap-2">
          <a
            href="https://discord.gg/TjgJ9x6B8g"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            <span className="hidden md:inline">
              Join our community on Discord
            </span>
            <span className="md:hidden">Discord</span>
          </a>
          <span className="mx-2">|</span>
          <a
            href="https://discord.gg/52mKT9g8NB"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            Support
          </a>
        </div>
      </div>
    </footer>
  );
}
