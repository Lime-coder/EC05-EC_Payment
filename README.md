# Movie Ticket Checkout

A simple full-stack demo: React frontend + Express backend, with multi-payment gateway flow (Stripe / PayPal / MoMo / ZaloPay).

```
root/
│
├── backend/             Node.js + Express API
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── server.js
│   └── package.json
│
├── frontend/            React + Vite + Tailwind
│   ├── src/
│   ├── public/
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
├── .gitignore
└── README.md
```

## Run the frontend
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173

## Run the backend
```bash
cd backend
npm install
npm run dev
```
Runs on http://localhost:4000

## Payment flow
1. User fills the checkout form → `POST /api/checkout`
2. Backend creates an order and returns a `paymentUrl`
3. Browser redirects to the gateway
4. Gateway calls `/api/webhook/:provider` to confirm payment
5. Gateway redirects user back to `/success` or `/cancel`

> Frontend never handles real payment SDKs. The backend verifies payments via webhooks.
