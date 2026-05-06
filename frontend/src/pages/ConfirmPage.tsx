import { useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import Header from "../components/Header";
import { useLang } from "../context/LanguageContext";
import { Movie } from "../data/movies";
import { createCheckoutSession } from "../services/checkoutService";

const PRICE_PER_TICKET = 100000; // VND

const PAYMENT_METHODS = [
  { id: "stripe", label: "Stripe", icon: "💳" },
  { id: "paypal", label: "PayPal", icon: "🅿️" },
  { id: "momo", label: "MoMo", icon: "📱" },
  { id: "zalopay", label: "ZaloPay", icon: "💰" },
];

interface CheckoutState {
  name: string;
  phone: string;
  movie: Movie;
  seats: string[];
}

export default function ConfirmPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLang();
  const state = location.state as CheckoutState | null;
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!state) return <Navigate to="/checkout" replace />;

  const totalPrice = state.seats.length * PRICE_PER_TICKET;

  const handlePay = async () => {
    setError("");
    setLoading(true);
    try {
      // NOTE: Payment handled by external gateway.
      // Backend verifies via webhook. Frontend only redirects.
      const data = await createCheckoutSession({
        name: state.name,
        phone: state.phone,
        movieId: state.movie.id,
        seats: state.seats,
        totalPrice,
        paymentMethod,
      });
      window.location.href = data.paymentUrl;
    } catch {
      setError(t.apiError);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-50">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-sm text-gray-500 hover:text-brand-600"
        >
          ← {t.back}
        </button>

        <h1 className="text-2xl font-bold mb-5">{t.confirm}</h1>

        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-5">
          <h2 className="text-lg font-bold mb-4">{t.summary}</h2>
          <div className="space-y-2 text-sm">
            <Row label={t.name} value={state.name} />
            <Row label={t.phone} value={state.phone} />
            <Row label={t.movie} value={`${state.movie.poster} ${state.movie.title}`} />
            <Row label={t.selectedSeats} value={state.seats.join(", ")} />
            <Row label={t.quantity} value={String(state.seats.length)} />
            <div className="border-t pt-3 mt-3 flex justify-between items-center">
              <span className="font-semibold">{t.total}</span>
              <span className="text-2xl font-bold text-brand-600">
                {totalPrice.toLocaleString("vi-VN")} ₫
              </span>
            </div>
            <div className="text-xs text-gray-400 text-right">
              {PRICE_PER_TICKET.toLocaleString("vi-VN")} ₫ {t.perTicket}
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-5">
          <h2 className="text-lg font-bold mb-4">{t.paymentMethod}</h2>
          <div className="grid grid-cols-2 gap-3">
            {PAYMENT_METHODS.map((m) => (
              <label
                key={m.id}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer ${
                  paymentMethod === m.id
                    ? "border-brand-500 bg-brand-50"
                    : "border-gray-200 hover:border-brand-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value={m.id}
                  checked={paymentMethod === m.id}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="accent-brand-500"
                />
                <span className="text-2xl">{m.icon}</span>
                <span className="font-semibold">{m.label}</span>
              </label>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3 mb-4 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>
        )}

        <button
          onClick={handlePay}
          disabled={loading}
          className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-lg disabled:opacity-60"
        >
          {loading ? t.processing : t.proceedPayment}
        </button>
      </main>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}
