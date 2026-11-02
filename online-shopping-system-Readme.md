# LuxeMart: Enterprise Full-Stack E-Commerce System

An enterprise-grade, curated luxury e-commerce platform built with **FastAPI** (Python), **Microsoft SQL Server**, and **Angular** (v21+), integrated with the **Capgemini Generative Engine** for live-catalog grounded conversational AI shopping.

---

## 📑 Table of Contents
1. [Architecture Overview](#-architecture-overview)
2. [Key Features](#-key-features)
3. [Technology Stack](#-technology-stack)
4. [Database & Seed Credentials](#-database--seed-credentials)
5. [AI Shopping Concierge (Generative Engine)](#-ai-shopping-concierge-generative-engine)
6. [Quick Start & Setup Guide](#-quick-start--setup-guide)
   - [Prerequisites](#prerequisites)
   - [Backend Setup (FastAPI)](#1-backend-setup-fastapi)
   - [Frontend Setup (Angular)](#2-frontend-setup-angular)
7. [API Documentation & Testing](#-api-documentation--testing)
8. [Folder & Directory Structure](#-folder--directory-structure)
9. [Master Prompt Playbook & Build Guide](online-shopping-system-Prompts.md)

---

## 🏛 Architecture Overview

```
                          ┌───────────────────────────┐
                          │   Angular 21 Frontend     │
                          │   (SSR / Client Hydrated) │
                          │   http://localhost:4200   │
                          └─────────────┬─────────────┘
                                        │  HTTP / REST + Bearer JWT
                                        ▼
                          ┌───────────────────────────┐
                          │     FastAPI Backend       │
                          │   http://127.0.0.1:8000   │
                          └──────┬─────────────┬──────┘
                                 │             │
                SQLModel / PyODBC│             │ HTTPS (Bearer Auth)
                                 ▼             ▼
  ┌───────────────────────────────────┐   ┌───────────────────────────────────┐
  │      Microsoft SQL Server 2022    │   │    Capgemini Generative Engine    │
  │        Database: ECommerceDb      │   │     OpenAI GPT-5 / Claude 4.5     │
  │    Users, Products, Carts, Orders │   │     Phi-4 Mini / Mistral 7B       │
  └───────────────────────────────────┘   └───────────────────────────────────┘
```

---

## 🌟 Key Features

### 1. Role-Based Access Control (RBAC) & Authentication
- **Roles Supported**: `Admin` and `Customer`.
- **Security**: Cryptographic password hashing using `bcrypt` and stateless session verification using `PyJWT` (HS256).
- **One-Click Demo Profiles**: Pre-populated credentials on the login screen for instant evaluation as Admin or Customer.

### 2. Comprehensive Database Seeding (No Dummy Data)
- **Automatic Initialization**: On backend startup, database tables are automatically verified and populated if empty.
- **6 Rich Taxonomies**: Electronics & Gadgets, Fashion & Apparel, Home & Kitchen, Health & Fitness, Beauty & Personal Care, Books & Stationery.
- **27+ Curated Products**: High-resolution Unsplash CDN photo assets, detailed descriptions, technical specifications JSON, pricing, stock levels, and SKUs.
- **Verified Customer Reviews**: Authentic appraisals and ratings tied directly to database records.

### 3. Real-Time Grounded AI Shopping Assistant
- **Capgemini Generative Engine**: Real-time integration with `https://openai.generative.engine.capgemini.com/v1`.
- **4 Selectable Models in Chat Dropdown**:
  - `openai.gpt-5` *(Flagship)*
  - `phi-4-mini-reasoning`
  - `us.anthropic.claude-sonnet-4-5-20250929-v1:0`
  - `mistral.mistral-7b-instruct-v0:2`
- **Catalog-Grounded Knowledge**: The assistant queries live database records (pricing, discounts, stock availability, shipping thresholds, and authenticated user orders).
- **Interactive In-Chat Cards**: When products are recommended, clickable product cards appear directly inside the conversation for instant "Add to Bag".

### 4. Customer Shopping Experience
- **Faceted Catalog Filters**: Live search, category pills, price range slider ($0 - $3000), in-stock toggle, and sorting (Newest, Price Low/High, Rating).
- **Product Detail View**: Multi-angle image preview gallery, inventory status badges, technical specifications table, customer review list, and new review submission form.
- **Dynamic Shopping Bag**: Real-time quantity adjustments, live price calculations, and a free express shipping progress bar (orders over $100).
- **Multi-Step Checkout**: Shipping consignment address form, multi-gateway selector (Credit Card, UPI, Net Banking, COD), and order summary.
- **Order Tracking & History**: Visual milestone stepper timeline (Placed → Processing → Shipped → Delivered).

### 5. Store Administration Console (Admin Panel)
- **KPI Metrics Dashboard**: Total Revenue ($), Total Orders, Active Catalog Items, and Low Stock Alerts (< 10 units).
- **Product Inventory Management (Full CRUD)**:
  - Create new products with image preview URL, specs, and stock.
  - Edit pricing, stock quantities, and discounts.
  - Archive/delete products.
- **Order Fulfillment**: Review customer orders, update order status to *Shipped* or *Delivered*, and inspect recipient addresses.
- **Category Analytics**: Revenue distribution and catalog volume breakdown per category.

---

## 💻 Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Angular 21 (Standalone Components, Signals, Reactive Forms, SCSS) |
| **Icons & Typography** | Remixicon 4.2, Google Fonts (Plus Jakarta Sans & Outfit) |
| **Backend** | FastAPI 0.115+, Python 3.12, Uvicorn, Pydantic v2 |
| **ORM / Data Access** | SQLModel / SQLAlchemy 2.0, PyODBC 5.3+ |
| **Database** | Microsoft SQL Server 2022 (`LIN-5CD6268KRS`, `ECommerceDb`) |
| **Authentication** | JSON Web Tokens (`PyJWT`), Password Hashing (`bcrypt`, `passlib`) |
| **AI Integration** | Capgemini Generative Engine REST API (`httpx`, `requests`) |

---

## 🔐 Database & Seed Credentials

### Microsoft SQL Server Configuration
- **Server**: `LIN-5CD6268KRS`
- **Database**: `ECommerceDb`
- **Authentication**: SQL Server Authentication (`sa` / `Capgemini@12345`)
- **Connection String**:
  ```
  mssql+pyodbc://sa:Capgemini%4012345@LIN-5CD6268KRS/ECommerceDb?driver=ODBC+Driver+18+for+SQL+Server&TrustServerCertificate=yes&Encrypt=yes
  ```

### Pre-Seeded User Accounts

| Role | Name | Email | Password | Access Capabilities |
|---|---|---|---|---|
| **Admin** | **Vijay Kumar** | `vijaykumar@gmail.com` | `VijayKumar@12345` | Full administrative control, KPI dashboard, product CRUD, inventory, order fulfillment |
| **Customer** | **Rohan Verma** | `rohan@example.com` | `Rohan@12345` | Product discovery, shopping bag, simulated payments, order tracking |

---

## 🤖 AI Shopping Concierge (Generative Engine)

- **Endpoint**: `https://openai.generative.engine.capgemini.com/v1/chat/completions`
- **API Key**: `zWa88L3KGt9pjRwIhvNl48RaVpv4H4El1JTKAOeO`
- **Supported Models**:
  - `openai.gpt-5`
  - `phi-4-mini-reasoning`
  - `us.anthropic.claude-sonnet-4-5-20250929-v1:0`
  - `mistral.mistral-7b-instruct-v0:2`

The user can switch between these models anytime using the dropdown inside the floating **AI Concierge** widget at the bottom right.

---

## 🚀 Quick Start & Setup Guide

### Prerequisites
- Python 3.10+ (Python 3.12 recommended)
- Node.js 18+ & npm 9+
- ODBC Driver 18 (or 17) for SQL Server installed on Windows
- Microsoft SQL Server running with database `ECommerceDb`

---

### 1. Backend Setup (FastAPI)

1. Open a PowerShell terminal in the `backend` directory:
   ```powershell
   cd backend
   ```

2. Activate the virtual environment:
   ```powershell
   .\.venv\Scripts\Activate.ps1
   ```
   *(If creating a new virtual environment: `python -m venv .venv` and `pip install -r requirements.txt`)*

3. Initialize and seed the SQL Server database:
   ```powershell
   python -m app.db.init_db
   ```

4. Launch the FastAPI development server:
   ```powershell
   .\.venv\Scripts\uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```

- **Backend API**: [http://127.0.0.1:8000](http://127.0.0.1:8000)
- **Interactive Swagger Documentation**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc Documentation**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

### 2. Frontend Setup (Angular)

1. Open a second PowerShell terminal in the `frontend` directory:
   ```powershell
   cd frontend
   ```

2. Install dependencies (if not already installed):
   ```powershell
   npm install
   ```

3. Start the Angular development server:
   ```powershell
   npm start -- --port 4200
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:4200
   ```

---

## 🧪 API Documentation & Testing

A complete, production-ready REST test suite is available in [`backend/api-testing.http`](file:///c:/Users/vkuma141/OneDrive%20-%20Capgemini/Desktop/capg/L1/online-shopping-system/backend/api-testing.http). It can be executed via Visual Studio Code's **REST Client** extension or any standard HTTP client.

### Key Endpoint Groups:
- **Auth**: `POST /api/v1/user/login`, `POST /api/v1/user/register`, `GET /api/v1/user/me`
- **Catalog**: `GET /api/v1/catalog/categories`, `GET /api/v1/catalog/products`, `GET /api/v1/catalog/products/{id}`, `POST /api/v1/catalog/products/{id}/reviews`
- **Cart**: `GET /api/v1/cart`, `POST /api/v1/cart/items`, `PUT /api/v1/cart/items/{id}`, `DELETE /api/v1/cart/items/{id}`, `DELETE /api/v1/cart/clear`
- **Orders**: `POST /api/v1/order/checkout`, `GET /api/v1/order/my-orders`, `GET /api/v1/order/{id}`, `GET /api/v1/order/all`, `PUT /api/v1/order/{id}/status`
- **Payments**: `POST /api/v1/payment/process`
- **AI Concierge**: `GET /api/v1/ai/models`, `POST /api/v1/ai/chat`
- **Admin**: `GET /api/v1/admin/stats`

---

## 📁 Folder & Directory Structure

```
online-shopping-system/
├── online-shopping-system.md       # Complete system documentation (this file)
├── backend/
│   ├── .env                        # Environment variables & DB connection string
│   ├── requirements.txt            # Python pinned dependencies
│   ├── api-testing.http            # Comprehensive REST API testing suite
│   └── app/
│       ├── main.py                 # FastAPI initialization, CORS, Lifespan events
│       ├── core/
│       │   ├── config.py           # Pydantic Settings & environment config
│       │   ├── security.py         # Bcrypt hashing & JWT token management
│       │   └── exceptions.py       # Custom HTTP exceptions
│       ├── db/
│       │   ├── session.py          # SQLAlchemy SQL Server engine & session dependency
│       │   ├── base.py             # Model metadata aggregator
│       │   └── init_db.py          # Table migration & rich data seeding script
│       ├── models/                 # SQLModel persistent table entities
│       │   ├── user.py             # User model with role ("Admin" / "Customer")
│       │   ├── catalog.py          # Category and Product models
│       │   ├── cart.py             # Cart and CartItem models
│       │   ├── order.py            # Order and OrderItem models
│       │   ├── payment.py          # PaymentTransaction model
│       │   └── review.py           # ProductReview model
│       ├── schemas/                # Pydantic request/response schemas
│       ├── services/               # Core business services
│       │   ├── cart_service.py     # Price calculations, taxes, discounts, shipping
│       │   └── payment_service.py  # Simulated transaction processing
│       ├── ai/
│       │   └── client.py           # Capgemini Generative Engine client with DB context
│       └── api/
│           ├── deps.py             # Authentication & DB session dependencies
│           └── v1/                 # Version 1 API routers
│               ├── user.py         # Auth & user routes
│               ├── catalog.py      # Products, categories, reviews, admin product CRUD
│               ├── cart.py         # Shopping cart operations
│               ├── order.py        # Checkout & order tracking
│               ├── payment.py      # Payment processing
│               ├── admin.py        # Analytics KPI metrics
│               └── ai.py           # Conversational assistant & models
│
└── frontend/
    ├── angular.json                # Angular workspace configuration & budgets
    ├── package.json                # Frontend dependencies (Angular 21)
    └── src/
        ├── index.html              # HTML shell with Google Fonts & Remixicon
        ├── styles.scss             # Global luxury dark design system & tokens
        └── app/
            ├── app.ts              # Root standalone component
            ├── app.html            # Main layout (Navbar, Router, Footer, AI Chat, Toast)
            ├── app.scss            # Layout styles
            ├── app.config.ts       # Application providers (HttpClient, Router, Interceptor)
            ├── app.routes.ts       # Client routing definitions with Guards
            ├── core/
            │   ├── guards/         # auth.guard.ts, admin.guard.ts
            │   ├── interceptors/   # auth.interceptor.ts (JWT header)
            │   └── services/       # AuthService, CatalogService, CartService, OrderService, AiService, etc.
            ├── models/             # TypeScript data contracts & interfaces
            ├── shared/
            │   ├── navbar/         # Header with live search, cart counter, user menu
            │   ├── footer/         # Luxury footer with links & security assurances
            │   └── toast/          # In-app toast notifications
            └── features/
                ├── catalog/        # Catalog list (filters, cards) & Product detail view
                ├── cart/           # Shopping bag page with free shipping tracker
                ├── checkout/       # Address consignment & payment selection
                ├── order/          # Order history & milestone stepper tracking
                ├── auth/           # Login (with 1-click demo buttons) & Register
                ├── admin/          # KPI cards, Product CRUD modal, Order fulfillment
                └── ai-chat/        # Floating AI Shopping Concierge with model switcher
```

---

## 🛡 License & Quality Standards
Developed in compliance with enterprise coding practices:
- **Clean Separation of Concerns**: Modular service-oriented backend and component-driven frontend.
- **Zero Dummy Data**: All products, reviews, categories, and orders are persisted in and queried from Microsoft SQL Server.
- **Defensive Error Handling**: Comprehensive HTTP status codes, structured JSON error responses, and graceful fallback behavior.

# Command to Run the project
1. Backend
.\.venv\Scripts\uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
2. Frontend
npm start -- --port 4200
---
