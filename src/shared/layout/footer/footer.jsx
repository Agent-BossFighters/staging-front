import { Link } from "react-router-dom";
import { Discord } from "@img/index";
export default function Footer() {
  return (
    <footer className="w-full text-xs border-t border-border/20 py-4 mt-4">
      <div className="flex justify-between items-center px-10 lg:px-0 lg:w-5/6 mx-auto">
        <p>© 2025 Agent</p>
        <div className="flex md:flex-row items-center gap-4">
          <Link to="/policy/privacy">
            <span className="hover:text-primary transition-colors">Privacy Policy</span>
          </Link>
          <p className="hidden md:block">|</p>
          <Link to="/policy/terms">
            <span className="hover:text-primary transition-colors">Terms of Service</span>
          </Link>
        </div>
        {/* Icon de discord + support */}
        <div className="flex items-center gap-0">
          <a
            href="https://discord.gg/TjgJ9x6B8g"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-primary transition-colors"
          >
            <img src={Discord} alt="Discord" className="w-6 h-6" />
            <span className="hidden md:inline">
              Boss Fighters
            </span>
            <span className="md:hidden">BF</span>
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
