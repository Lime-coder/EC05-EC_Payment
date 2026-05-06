# Backend (Express)

Beginner-friendly Express scaffold for the movie ticket checkout demo.

## Run it

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Server starts on `http://localhost:4000`.

## Folder structure

```
backend/
├── server.js              # App entry point
├── routes/                # URL → controller mapping
│   ├── checkout.routes.js
│   └── webhook.routes.js
├── controllers/           # Handle HTTP request/response
│   ├── checkout.controller.js
│   └── webhook.controller.js
├── services/              # Business logic + DB
│   ├── order.service.js
│   ├── payment.service.js
│   └── gateways/          # One file per payment provider
│       ├── stripe.js
│       ├── paypal.js
│       ├── momo.js
│       └── zalopay.js
└── middleware/            # Runs before controllers
    ├── validateCheckout.js
    └── errorHandler.js
```

## Request flow

```
Frontend  →  Route  →  Middleware  →  Controller  →  Service  →  DB / Gateway
                                                  ←  paymentUrl
Frontend  ←  { paymentUrl }
```

1. **Route** decides *which* function runs for a URL.
2. **Middleware** checks the request (auth, validation).
3. **Controller** is the glue: read request, call services, send response.
4. **Service** does the real work (DB queries, gateway calls).

## Payment flow

1. Frontend POSTs `/api/checkout` with order details.
2. Backend creates an order (`pending`) and asks the gateway for a `paymentUrl`.
3. Frontend redirects the user to `paymentUrl`.
4. Gateway calls `/api/webhook/<provider>` to confirm payment.
5. Backend marks order `paid` (or `failed`).
6. Gateway redirects user back to `/success` or `/cancel`.

> ⚠️ Never trust the redirect alone — always confirm via the webhook.
