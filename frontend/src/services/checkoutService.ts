// All backend API calls live here.
// NOTE: Payment is handled by external gateway pages.
// Backend must verify payment via webhook. Frontend only redirects and displays.

export interface CheckoutPayload {
  name: string;
  phone: string;
  movieId: string;
  seats: string[];
  totalPrice: number;
  paymentMethod: string;
}

export interface CheckoutResponse {
  paymentUrl: string;
  orderId?: string;
}

const API_BASE = "http://localhost:4000";

export async function createCheckoutSession(
  payload: CheckoutPayload
): Promise<CheckoutResponse> {
  const res = await fetch(`${API_BASE}/api/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Checkout API error");
  return res.json();
}
