import { Link } from "react-router-dom";
import Header from "../components/Header";
import { useLang } from "../context/LanguageContext";

export default function CancelPage() {
  const { t } = useLang();
  return (
    <div className="min-h-screen bg-brand-50">
      <Header />
      <main className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center text-4xl text-red-600">
          ✕
        </div>
        <h1 className="text-2xl font-bold mb-3">{t.cancel}</h1>
        <p className="text-gray-500 mb-6">{t.cancelMsg}</p>
        <Link
          to="/checkout"
          className="inline-block px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-lg"
        >
          {t.tryAgain}
        </Link>
      </main>
    </div>
  );
}
