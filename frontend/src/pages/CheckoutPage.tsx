import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import MovieSelect from "../components/MovieSelect";
import SeatGrid from "../components/SeatGrid";
import { Movie } from "../data/movies";
import { useLang } from "../context/LanguageContext";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { t } = useLang();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [movie, setMovie] = useState<Movie | null>(null);
  const [seats, setSeats] = useState<string[]>([]);
  const [error, setError] = useState("");

  const toggleSeat = (s: string) =>
    setSeats((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));

  const handleNext = () => {
    if (!name.trim() || !phone.trim() || !movie || seats.length === 0) {
      setError(t.requiredFields);
      return;
    }
    navigate("/confirm", { state: { name, phone, movie, seats } });
  };

  return (
    <div className="min-h-screen bg-brand-50">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-1">{t.checkout}</h1>
          <p className="text-gray-500">{t.tagline}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">{t.name} *</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.namePlaceholder}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">{t.phone} *</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t.phonePlaceholder}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">{t.movie} *</label>
            <MovieSelect value={movie} onChange={setMovie} />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-3">{t.seats} *</label>
            <div className="bg-brand-50 rounded-lg p-6">
              <SeatGrid selected={seats} onToggle={toggleSeat} />
            </div>
          </div>

          {seats.length > 0 && (
            <div className="flex items-center justify-between p-4 bg-brand-100 rounded-lg">
              <div>
                <div className="text-xs text-gray-600">{t.selectedSeats}</div>
                <div className="font-bold">{seats.join(", ")}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-600">{t.quantity}</div>
                <div className="font-bold text-2xl text-brand-600">{seats.length}</div>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>
          )}

          <button
            onClick={handleNext}
            className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-lg"
          >
            {t.next} →
          </button>
        </div>
      </main>
    </div>
  );
}
