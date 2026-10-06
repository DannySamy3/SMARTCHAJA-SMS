# SmartChaja SMS & OTP Gateway (Express.js TypeScript)

A lightweight, high-performance, pure Express.js TypeScript microservice architected with **Model-View-Controller (MVC)** design principles to manage and dispatch all **Beem Africa SMS services** for SmartChaja.

Designed to run in Docker on your Hostinger VPS, giving it a clean, static IP address that completely bypasses Beem Africa's AWS WAF / Cloudflare bot protection.

---

## 🏛️ Architecture Overview

```
smartchaja-sms-service/
├── Dockerfile                      # Multi-stage production build (Node 20 Alpine)
├── docker-compose.yml              # Container orchestration
├── package.json
├── tsconfig.json
└── src/
    ├── server.ts                   # Express server entrypoint & middleware setup
    ├── config/
    │   └── env.ts                  # Centralized configuration & environment loader
    ├── models/                     # Data schemas & type safety (Zod)
    │   ├── sms.model.ts            # Zod validation schemas (OTP, Rental, Return, Reminder)
    │   └── response.model.ts       # Standardized API response envelopes
    ├── routes/                     # Express API Routers
    │   ├── index.ts                # Route aggregator
    │   ├── health.routes.ts        # Health monitoring
    │   ├── balance.routes.ts       # Beem balance check
    │   ├── sms.routes.ts           # Single & bulk SMS dispatch
    │   └── template.routes.ts      # SmartChaja template SMS dispatch
    ├── controllers/                # Request & response controllers
    │   ├── otp.controller.ts       # OTP dispatch handler
    │   ├── rental.controller.ts    # Power bank pickup, reminder, and return handlers
    │   ├── sms.controller.ts       # Generic single & bulk SMS handlers
    │   └── balance.controller.ts   # Live Beem Africa SMS balance checker
    ├── services/                   # Business Logic & Gateway Clients
    │   ├── beem.service.ts         # Beem Africa client with keepAlive HTTPS agent & 2-phase retry
    │   └── template.service.ts     # Single source of truth for all SmartChaja SMS templates
    └── middleware/
        └── auth.middleware.ts      # API Key authentication guard (x-api-key)
```

---

## 🚀 All SmartChaja SMS Services Configured

| Service Name | Endpoint | Trigger / Use-case |
| :--- | :--- | :--- |
| **OTP Verification** | `POST /api/templates/otp` | User registration & authentication (`sendOTP`) |
| **Rental Pickup** | `POST /api/templates/rental-pickup` | Dispatched when a power bank is unlocked from station |
| **Rental Reminder** | `POST /api/templates/rental-reminder` | Scheduled reminder 15 minutes before rental ends |
| **Rental Return** | `POST /api/templates/rental-return` | Dispatched when power bank is successfully returned |
| **Custom SMS** | `POST /api/sms/send` | Generic notification or admin alerts |
| **Bulk SMS** | `POST /api/sms/bulk` | Marketing or announcement SMS to multiple recipients |
| **Balance Checker**| `GET /api/balance` | Query current Beem Africa wallet balance |
| **Health Check** | `GET /api/health` | Container liveness check |

---

## 🐳 Docker Setup & Deployment

### 1. Configure Environment (`.env`)
Create or edit `.env` in the project root:
```env
PORT=7677
NODE_ENV=production

# Secret API key required in the x-api-key header
API_SECRET_KEY=your_api_secret_key_here

# Beem Africa Credentials
BEEM_API_KEY=your_beem_api_key_here
BEEM_SECRET_KEY=your_beem_secret_key_here
BEEM_SENDER_ID=SmartChaja
```

### 2. Run with Docker Compose
```bash
docker-compose up -d --build
```

### 3. Check Logs
```bash
docker-compose logs -f
```

The REST API microservice will be running at `http://localhost:7677` (or `http://YOUR_SERVER_IP:7677`).

---

## 🧪 Testing with cURL

### 1. Send OTP:
```bash
curl -X POST http://localhost:7677/api/templates/otp \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_api_secret_key_here" \
  -d '{
    "phoneNumber": "255712345678",
    "otpCode": "849201"
  }'
```

### 2. Send Rental Pickup SMS:
```bash
curl -X POST http://localhost:7677/api/templates/rental-pickup \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_api_secret_key_here" \
  -d '{
    "phoneNumber": "255712345678",
    "userName": "Customer",
    "deviceId": "CN-8821"
  }'
```

### 3. Send Rental Return SMS:
```bash
curl -X POST http://localhost:7677/api/templates/rental-return \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_api_secret_key_here" \
  -d '{
    "phoneNumber": "255712345678",
    "userName": "Customer"
  }'
```

### 4. Check Beem Balance:
```bash
curl http://localhost:7677/api/balance \
  -H "x-api-key: your_api_secret_key_here"
```

---

## 🔗 How Firebase Cloud Functions Connects to this Service

In your Firebase Cloud Functions, simply route outbound SMS requests to this service:

```javascript
const axios = require("axios");

// In verifyOTPAndGetToken.js:
const response = await axios.post(
  "https://sms.your-hostinger-domain.com/api/templates/otp",
  {
    phoneNumber: cleanPhone,
    otpCode: otpCode,
  },
  {
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.SMS_SERVICE_API_KEY || "your_api_secret_key_here",
    },
    timeout: 10000,
  }
);
```
