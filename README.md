# SweetShop E-Commerce Platform

A production-ready, high-performance E-commerce platform built with Next.js (App Router) on the frontend, and Node.js/Express.js layered architecture on the backend.

---

## 🛠️ Technology Stack

### Frontend (`apps/web/`)
- **Framework**: Next.js 16 (App Router) & React 19
- **Styles & Elements**: Tailwind CSS & shadcn/ui
- **State & Queries**: Zustand & TanStack React Query
- **Validation**: React Hook Form & Zod

### Backend (`apps/api/`)
- **Server**: Node.js & Express.js
- **Database**: MongoDB Atlas via Mongoose
- **Cache**: Redis / In-Memory Dual Layer
- **Payments**: Razorpay Gateway (Simulated Fallback Mode Supported)
- **Billing**: Dynamic PDF Invoice generation via PDFKit
- **Emails**: Responsive HTML Templates via Nodemailer

---

## 🏗️ Architecture

The backend follows a strict **layered controller-service-repository design pattern**:

```
apps/api/src/
├── models/             # Mongoose schemas (User, Product, Order, etc.)
├── modules/            # Domain-driven sub-modules
│   ├── product/        # Catalog, inventory, bulk CSV imports, analytics
│   ├── cart/           # Shopping cart operations with stock/price validation
│   ├── wishlist/       # Favorites management & move-to-cart handshakes
│   ├── coupon/         # Percentage/Flat active coupon validations
│   ├── checkout/       # Calculations for GST, shipping, & discount rules
│   ├── order/          # Order lifecycle, returns, refunds, & aggregations
│   ├── payment/        # Razorpay creation, signatures, & refund requests
│   ├── webhook/        # HMAC-verified public payment processors
│   └── notification/   # Nodemailer HTML templates & simulation drivers
└── utils/              # Background workers, queues, & global tools
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.x or v20.x)
- MongoDB running locally or an Atlas connection string

### Running Locally

1. **Install Dependencies**:
   ```bash
   # From root directory
   npm install
   ```

2. **Start Backend API**:
   ```bash
   cd apps/api
   npm run dev
   ```

3. **Start Next.js Frontend**:
   ```bash
   cd apps/web
   npm run dev
   ```

---

## 🧪 Testing

The API uses Node's native test harness:

```bash
cd apps/api
npm test
```

---

## 📦 Operations & Guides
- **API Documentation**: Refer to [docs/api_documentation.md](file:///home/prakash/sweetshop/docs/api_documentation.md).
- **Deployment Manual**: Refer to [docs/deployment_and_operations.md](file:///home/prakash/sweetshop/docs/deployment_and_operations.md).
