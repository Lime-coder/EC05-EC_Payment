import { useLang } from "../context/LanguageContext";

export default function LanguageToggle() {
  const { lang, setLang } = useLang();
  return (
    <div className="inline-flex rounded-full border border-gray-200 bg-white p-1">
      {(["en", "vi"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-3 py-1 text-sm font-semibold rounded-full ${
            lang === l ? "bg-brand-500 text-white" : "text-gray-500 hover:text-gray-800"
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
