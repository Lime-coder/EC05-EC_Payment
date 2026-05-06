import { Link } from "react-router-dom";
import { useLang } from "../context/LanguageContext";
import LanguageToggle from "./LanguageToggle";

export default function Header() {
  const { t } = useLang();
  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-brand-500 flex items-center justify-center text-white text-xl">
            🎬
          </div>
          <span className="text-xl font-bold">{t.appName}</span>
        </Link>
        <LanguageToggle />
      </div>
    </header>
  );
}
