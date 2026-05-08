import { Link, useSearchParams, Navigate } from "react-router-dom";
import Header from "../components/Header";
import { useLang } from "../context/LanguageContext";

export default function SuccessPage() {
  const [params] = useSearchParams();
  const orderId = params.get("orderId");
  const status = params.get("status");
  const { t } = useLang();

  // Khi bấm Hủy ở ZaloPay, họ sẽ tự chèn tham số ?status=... (VD: status=-49) vào url redirect
  // status = 1 là thành công, khác 1 là thất bại/hủy.
  if (status && status !== "1") {
    return <Navigate to="/cancel" replace />;
  }

  return (
    <div className="min-h-screen bg-brand-50">
      <Header />
      <main className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-brand-500 flex items-center justify-center text-4xl text-white">
          ✓
        </div>
        <h1 className="text-2xl font-bold mb-3">{t.success}</h1>
        <p className="text-gray-500 mb-6">{t.successMsg}</p>

        {orderId && (
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
            <div className="text-xs text-gray-500">{t.orderId}</div>
            <div className="font-mono font-bold text-lg text-brand-600">{orderId}</div>
          </div>
        )}

        <Link
          to="/checkout"
          className="inline-block px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-lg"
        >
          {t.backHome}
        </Link>
      </main>
    </div>
  );
}
