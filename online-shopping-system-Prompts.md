# LuxeMart E-Commerce System: Master Prompt Playbook & Build Guide

> **Document Version**: 1.0.0  
> **Target Audience**: AI Agents, Prompt Engineers, Full-Stack Architects, and Software Engineers  
> **Technology Stack**: Python 3.12, FastAPI 0.115+, SQLModel (SQLAlchemy 2.0), Microsoft SQL Server 2022, PyODBC, Angular 21 (Standalone, Signals, SCSS), Capgemini Generative Engine (GPT-5, Phi-4, Claude 4.5, Mistral 7B).

---

## 📑 Table of Contents
1. [Introduction & Prompt Strategy](#1-introduction--prompt-strategy)
2. [End-to-End Build Pipeline Diagram](#2-end-to-end-build-pipeline-diagram)
3. [Master System Prompt (Persona & Guardrails)](#3-master-system-prompt-persona--guardrails)
4. [Phase 1: Architecture, System Design & Database Modeling](#4-phase-1-architecture-system-design--database-modeling)
   - [Prompt 1.1: High-Level Architecture & Technical Specification](#prompt-11-high-level-architecture--technical-specification)
   - [Prompt 1.2: Relational Database Schema & SQLModel Entities](#prompt-12-relational-database-schema--sqlmodel-entities)
   - [Prompt 1.3: Database Engine Connection & PyODBC Connection Pooling](#prompt-13-database-engine-connection--pyodbc-connection-pooling)
   - [Prompt 1.4: Production Seed Data Generator (Taxonomies, Curated Products, Reviews)](#prompt-14-production-seed-data-generator-taxonomies-curated-products-reviews)
5. [Phase 2: FastAPI Backend & Micro-Modular API Development](#5-phase-2-fastapi-backend--micro-modular-api-development)
   - [Prompt 2.1: FastAPI Core Initialization, Settings & Middleware](#prompt-21-fastapi-core-initialization-settings--middleware)
   - [Prompt 2.2: Authentication & RBAC Engine (JWT + Bcrypt)](#prompt-22-authentication--rbac-engine-jwt--bcrypt)
   - [Prompt 2.3: Product Catalog & Faceted Search Endpoints](#prompt-23-product-catalog--faceted-search-endpoints)
   - [Prompt 2.4: Shopping Cart & Calculation Service](#prompt-24-shopping-cart--calculation-service)
   - [Prompt 2.5: Order Checkout & Transactional Inventory Deductions](#prompt-25-order-checkout--transactional-inventory-deductions)
   - [Prompt 2.6: Multi-Gateway Payment Simulation Service](#prompt-26-multi-gateway-payment-simulation-service)
   - [Prompt 2.7: Store Admin Dashboard & Inventory Management API](#prompt-27-store-admin-dashboard--inventory-management-api)
6. [Phase 3: AI Shopping Assistant & LLM Grounding](#6-phase-3-ai-shopping-assistant--llm-grounding)
   - [Prompt 3.1: Capgemini Generative Engine Multi-Model Client](#prompt-31-capgemini-generative-engine-multi-model-client)
   - [Prompt 3.2: Dynamic Database Catalog Grounding & Interactive In-Chat Cards](#prompt-32-dynamic-database-catalog-grounding--interactive-in-chat-cards)
7. [Phase 4: Frontend Architecture & Global Design System](#7-phase-4-frontend-architecture--global-design-system)
   - [Prompt 4.1: Angular 21 Standalone Setup, SSR & Styling Architecture](#prompt-41-angular-21-standalone-setup-ssr--styling-architecture)
   - [Prompt 4.2: Core State Management, API Services & JWT HTTP Interceptor](#prompt-42-core-state-management-api-services--jwt-http-interceptor)
   - [Prompt 4.3: Role-Based Route Guards & Navigation Routing](#prompt-43-role-based-route-guards--navigation-routing)
   - [Prompt 4.4: Luxury Glassmorphism Design System & SCSS Tokens](#prompt-44-luxury-glassmorphism-design-system--scss-tokens)
8. [Phase 5: Frontend Feature Components Implementation](#8-phase-5-frontend-feature-components-implementation)
   - [Prompt 5.1: Navigation Bar, Announcement Bar & Global Footer](#prompt-51-navigation-bar-announcement-bar--global-footer)
   - [Prompt 5.2: Catalog Showcase & Faceted Filter Suite](#prompt-52-catalog-showcase--faceted-filter-suite)
   - [Prompt 5.3: Product Detail Gallery & Customer Reviews Component](#prompt-53-product-detail-gallery--customer-reviews-component)
   - [Prompt 5.4: Slide-Over Cart Drawer & Free Shipping Progress Indicator](#prompt-54-slide-over-cart-drawer--free-shipping-progress-indicator)
   - [Prompt 5.5: Multi-Step Checkout & Payment Selector](#prompt-55-multi-step-checkout--payment-selector)
   - [Prompt 5.6: Order Tracking Timeline & User Purchase History](#prompt-56-order-tracking-timeline--user-purchase-history)
   - [Prompt 5.7: Store Administration Console (KPIs, Inventory CRUD, Order Management)](#prompt-57-store-administration-console-kpis-inventory-crud-order-management)
   - [Prompt 5.8: Real-Time AI Concierge Chatbot Widget](#prompt-58-real-time-ai-concierge-chatbot-widget)
9. [Phase 6: Integration, Testing & Quality Assurance](#9-phase-6-integration-testing--quality-assurance)
   - [Prompt 6.1: Comprehensive REST API Testing Suite (.http)](#prompt-61-comprehensive-rest-api-testing-suite-http)
   - [Prompt 6.2: End-to-End Verification & Health Checklist](#prompt-62-end-to-end-verification--health-checklist)
10. [Phase 7: Production Deployment & Orchestration](#10-phase-7-production-deployment--orchestration)
    - [Prompt 7.1: Environment Variable Configurations & Secret Management](#prompt-71-environment-variable-configurations--secret-management)
    - [Prompt 7.2: Build, Serve & Production Runbook](#prompt-72-build-serve--production-runbook)

---

## 1. Introduction & Prompt Strategy

This document provides a **production-standard prompt engineering playbook** for recreating or extending the **LuxeMart** enterprise full-stack e-commerce system.

### Why Standardized Prompts?
Building a modern enterprise e-commerce platform involves multi-tier orchestration:
1. Relational schema definitions with integrity constraints and JSON columns.
2. Fast, asynchronous REST APIs with role-based access control.
3. Grounded generative AI integration with enterprise LLM endpoints.
4. Reactive single-page applications with modern design systems.

Using these standardized prompts ensures that any AI coding assistant or engineering team executes each module with:
- **Zero Mock/Placeholder Code**: Every component generates functioning, production-ready code.
- **Strict Separation of Concerns**: Models, Schemas, Routers, Services, Guards, and UI Components are strictly decoupled.
- **Strong Typing**: Python Pydantic v2 / SQLModel and TypeScript interfaces mirror each other 1:1.
- **Defensive Error Handling**: HTTP status codes, try/catch blocks, and transactional rollbacks are incorporated by default.

---

## 2. End-to-End Build Pipeline Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       PROMPT EXECUTION PIPELINE                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
        ┌─────────────────────────────────────────────────────────┐
        │ Phase 1: Database Architecture & SQLModel Entity Models │
        │ (Prompts 1.1, 1.2, 1.3, 1.4)                            │
        └────────────────────────────┬────────────────────────────┘
                                     │
                                     ▼
        ┌─────────────────────────────────────────────────────────┐
        │ Phase 2: FastAPI Backend Services & REST API Routers    │
        │ (Prompts 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7)             │
        └────────────────────────────┬────────────────────────────┘
                                     │
                                     ▼
        ┌─────────────────────────────────────────────────────────┐
        │ Phase 3: Capgemini Generative Engine LLM Grounding      │
        │ (Prompts 3.1, 3.2)                                      │
        └────────────────────────────┬────────────────────────────┘
                                     │
                                     ▼
        ┌─────────────────────────────────────────────────────────┐
        │ Phase 4: Angular 21 Architecture, State & Design System │
        │ (Prompts 4.1, 4.2, 4.3, 4.4)                            │
        └────────────────────────────┬────────────────────────────┘
                                     │
                                     ▼
        ┌─────────────────────────────────────────────────────────┐
        │ Phase 5: Angular Feature Components & AI Chat Widget    │
        │ (Prompts 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8)       │
        └────────────────────────────┬────────────────────────────┘
                                     │
                                     ▼
        ┌─────────────────────────────────────────────────────────┐
        │ Phase 6 & 7: API Testing Suite, QA & Deployment Runbook │
        │ (Prompts 6.1, 6.2, 7.1, 7.2)                            │
        └─────────────────────────────────────────────────────────┘
```

---

## 3. Master System Prompt (Persona & Guardrails)

*Before executing any prompts below, set the AI system instructions using this master prompt:*

```text
SYSTEM PROMPT:
You are an Elite Principal Full-Stack Architect and AI Systems Engineer specializing in:
- Modern Python web architectures (FastAPI 0.115+, SQLModel, SQLAlchemy 2.0, Pydantic v2).
- Enterprise relational database design (Microsoft SQL Server 2022 via PyODBC connection pooling).
- Enterprise frontend engineering (Angular 21 Standalone Components, Signals, RxJS, Reactive Forms, SCSS).
- Grounded Generative AI Integration (Capgemini Generative Engine, multi-model LLM orchestration, dynamic context injection).

STRICT CODING GUARDRAILS:
1. NO PLACEHOLDERS OR 'TODO' STUBS: All generated code must be complete, production-grade, and immediately executable.
2. STRICT TYPING & SCHEMA ALIGNMENT: Every endpoint must use Pydantic models for request validation and response serialisation. Angular services must define explicit TypeScript interfaces matching backend schemas.
3. SECURITY FIRST: Never store plaintext passwords (use bcrypt with salt). Secure API routes with stateless JWT tokens containing user ID, email, and role ('Admin' or 'Customer').
4. AESTHETICS & UX EXCELLENCE: Frontend components must implement an ultra-premium, dark-themed luxury aesthetic (deep slate/charcoal backgrounds, warm gold accents, glassmorphic cards, smooth micro-interactions).
5. DEFENSIVE PROGRAMMING: Include robust exception handling, transaction rollback on database write failures, and fallback strategies if third-party AI endpoints fail.
```

---

## 4. Phase 1: Architecture, System Design & Database Modeling

### Prompt 1.1: High-Level Architecture & Technical Specification
- **Objective**: Establish the system boundaries, communication protocols, and technology matrix.
- **Context**: Greenfield or initial architecting stage.

```text
PROMPT:
Act as a Principal Software Architect. Formulate a comprehensive High-Level Design (HLD) document for "LuxeMart", an enterprise luxury e-commerce platform.

Requirements:
1. Define the end-to-end architecture topology using a Mermaid graph showing:
   - Client Layer: Angular 21 (SPA/SSR Hydrated, Port 4200).
   - Application Layer: FastAPI (Port 8000) with CORS middleware, JWT Bearer authentication, and modular domain routers.
   - Persistence Layer: Microsoft SQL Server 2022 (Database: ECommerceDb) accessed via SQLModel/PyODBC connection pooling with fast_executemany.
   - External AI Layer: Capgemini Generative Engine REST Gateway (v1/chat/completions) supporting GPT-5, Phi-4, Claude 4.5, and Mistral 7B.
2. Define the architectural principles: Layered modularity, stateless session validation, real-time database grounding for LLMs, and transactional integrity.
3. Document the subsystem breakdown: Identity & Access, Catalog & Inventory, Cart & Checkout, Order Management, Payment Gateway Simulation, AI Shopping Concierge, and Admin Control Console.
4. Detail the Non-Functional Requirements (NFRs): Sub-150ms P95 latency for catalog reads, database connection pooling, role-based route guards, and SQL injection prevention via ORM parameterization.
```
- **Output Artifact**: `online-shoping-system-HLD.md`

---

### Prompt 1.2: Relational Database Schema & SQLModel Entities
- **Objective**: Design the relational entity models with primary/foreign keys, unique constraints, cascading behaviors, and JSON serialization.
- **Context**: Stored under `backend/app/models/`.

```text
PROMPT:
Act as a Database Architect and Python Backend Specialist. Design the complete SQLModel (SQLAlchemy 2.0 + Pydantic) database entity models for our e-commerce platform targeting Microsoft SQL Server 2022.

Create the following model files in `app/models/`:
1. `user.py`:
   - Entity `User`: id (PK), name, email (UK, index), hashed_password, role ('Admin' | 'Customer', default 'Customer'), is_active (bool), created_at (datetime, UTC).
2. `catalog.py`:
   - Entity `Category`: id (PK), name (UK), slug (UK), description, image_url, is_active (bool).
   - Entity `Product`: id (PK), name, slug (UK), description, price (float), discount_price (Optional[float]), category_id (FK -> category.id), stock_quantity (int), sku (UK), image_url, additional_images_json (Optional[str]), rating (float, default 0.0), review_count (int, default 0), is_featured (bool), is_active (bool), specs_json (Optional[str]), created_at (datetime).
3. `cart.py`:
   - Entity `Cart`: id (PK), user_id (FK -> user.id, unique), created_at, updated_at.
   - Entity `CartItem`: id (PK), cart_id (FK -> cart.id), product_id (FK -> product.id), quantity (int), unit_price (float).
4. `order.py`:
   - Entity `Order`: id (PK), user_id (FK -> user.id), order_number (UK, index), subtotal_amount, discount_amount, shipping_fee, tax_amount, total_amount, status ('Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'), shipping_name, shipping_address, shipping_city, shipping_state, shipping_postal_code, shipping_phone, payment_method, payment_status, created_at.
   - Entity `OrderItem`: id (PK), order_id (FK -> order.id), product_id (FK -> product.id), product_name, product_image, quantity, unit_price, total_price.
5. `payment.py`:
   - Entity `PaymentTransaction`: id (PK), order_id (FK -> order.id), transaction_id (UK), amount, payment_method ('Credit Card', 'UPI', 'Net Banking', 'Cash on Delivery'), status ('Success', 'Pending', 'Failed'), gateway_response_json, created_at.
6. `review.py`:
   - Entity `ProductReview`: id (PK), product_id (FK -> product.id), user_id (FK -> user.id), rating (int 1-5), comment, user_name, created_at.
7. `__init__.py`:
   - Export all models for clean global imports.

Ensure all fields have accurate Python type hints and SQLModel Field constraints.
```
- **Output Artifacts**: `backend/app/models/*.py`

---

### Prompt 1.3: Database Engine Connection & PyODBC Connection Pooling
- **Objective**: Configure the database engine with Microsoft ODBC Driver 18 for SQL Server and connection pooling.
- **Context**: Stored under `backend/app/db/`.

```text
PROMPT:
Act as a Python Database Engineer. Implement the database session and engine lifecycle management for Microsoft SQL Server 2022 using SQLModel, SQLAlchemy, and pyodbc.

Create:
1. `app/db/session.py`:
   - Construct an engine using `create_engine` with the connection string:
     `mssql+pyodbc:///?odbc_connect=DRIVER={ODBC Driver 18 for SQL Server};SERVER=<server>;DATABASE=<db>;UID=<user>;PWD=<password>;TrustServerCertificate=yes;Encrypt=yes;Connection Timeout=30;`
   - Configure connection pooling: pool_size=10, max_overflow=20, pool_recycle=1800, pool_pre_ping=True, fast_executemany=True.
   - Create a dependency function `get_db()` that yields a `Session(engine)` inside a context manager, ensuring commit or rollback on exception and automatic closing.
2. `app/db/base.py`:
   - Function `create_db_and_tables()` that calls `SQLModel.metadata.create_all(engine)` to create tables if they do not exist.
```
- **Output Artifacts**: `backend/app/db/session.py`, `backend/app/db/base.py`

---

### Prompt 1.4: Production Seed Data Generator (Taxonomies, Curated Products, Reviews)
- **Objective**: Ensure the application boots with rich, authentic catalog data—no mock placeholders or "Lorem Ipsum".
- **Context**: Stored under `backend/app/db/init_db.py`.

```text
PROMPT:
Act as a Data Engineer and E-Commerce Merchandising Specialist. Create `app/db/init_db.py` to auto-seed the Microsoft SQL Server database upon application startup if empty.

Requirements:
1. Create Default Users:
   - Admin: Name: "Vijay Kumar", Email: "vijaykumar@gmail.com", Password: "VijayKumar@12345", Role: "Admin" (hashed with bcrypt).
   - Customer: Name: "Rohan Verma", Email: "rohan@example.com", Password: "Rohan@12345", Role: "Customer" (hashed with bcrypt).
2. Create 6 Rich Categories:
   - Electronics & Gadgets, Fashion & Apparel, Home & Kitchen, Health & Fitness, Beauty & Personal Care, Books & Stationery. Each with descriptive copy and CDN image URL.
3. Seed 27+ High-End Curated Products:
   - Realistic prices ($49.99 to $2,499.00), discount prices, stock counts (including some < 10 for low-stock testing), SKUs, Unsplash CDN luxury imagery, JSON-encoded specs (e.g. dimensions, warranty, battery life), and ratings (4.2 - 4.9).
4. Seed Verified Reviews:
   - Multiple customer appraisals attached to seeded products with ratings 1 to 5, timestamps, and helpful feedback.
5. Create function `init_db(db: Session)` that checks `select(User).first()`. If empty, execute all seedings within a single transaction and log progress.
```
- **Output Artifact**: `backend/app/db/init_db.py`

---

## 5. Phase 2: FastAPI Backend & Micro-Modular API Development

### Prompt 2.1: FastAPI Core Initialization, Settings & Middleware
- **Objective**: Scaffold the FastAPI application with Pydantic v2 settings, CORS, and startup events.
- **Context**: `backend/app/core/` and `backend/app/main.py`.

```text
PROMPT:
Act as a Senior Python Backend Architect. Scaffold the core FastAPI application.

1. Create `app/core/config.py` using `pydantic_settings.BaseSettings`:
   - Application metadata: PROJECT_NAME ("LuxeMart API"), VERSION ("1.0.0"), API_V1_STR ("/api/v1").
   - Database credentials & connection string builder.
   - JWT configurations: SECRET_KEY, ALGORITHM ("HS256"), ACCESS_TOKEN_EXPIRE_MINUTES (1440).
   - AI Engine configurations: CAPGEMINI_AI_ENDPOINT, CAPGEMINI_AI_API_KEY, DEFAULT_AI_MODEL ("openai.gpt-5"), ALLOWED_AI_MODELS (list).
   - CORS origins list (`http://localhost:4200`, `http://127.0.0.1:4200`).
2. Create `app/main.py`:
   - Initialize `FastAPI(title=settings.PROJECT_NAME, version=settings.VERSION, openapi_url=f"{settings.API_V1_STR}/openapi.json")`.
   - Mount `CORSMiddleware` with credentials allowed, all headers, all methods.
   - Define lifespan event: On startup, run `create_db_and_tables()` and `init_db(db)`.
   - Register root health check route: `GET /health` returning `{"status": "healthy", "service": "LuxeMart API"}`.
   - Mount API v1 router prefix.
```
- **Output Artifacts**: `backend/app/core/config.py`, `backend/app/main.py`

---

### Prompt 2.2: Authentication & RBAC Engine (JWT + Bcrypt)
- **Objective**: Implement secure authentication, password hashing, and role-based access control.
- **Context**: `backend/app/core/security.py`, `backend/app/api/deps.py`, `backend/app/api/v1/user.py`.

```text
PROMPT:
Act as a Security Engineer and FastAPI Specialist. Implement Role-Based Access Control (RBAC) and JWT authentication.

1. Create `app/core/security.py`:
   - Password hashing and verification using `passlib.context.CryptContext(schemes=["bcrypt"], deprecated="auto")`.
   - `create_access_token(subject: Union[str, Any], role: str, expires_delta: Optional[timedelta] = None) -> str` using `jwt.encode`.
2. Create `app/api/deps.py`:
   - `get_db()` session dependency.
   - `oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/user/login")`.
   - `get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User`: Decodes JWT, validates user exists and `is_active == True`. Raises HTTP 401 if invalid.
   - `get_current_admin(current_user: User = Depends(get_current_user)) -> User`: Verifies `current_user.role == "Admin"`. Raises HTTP 403 Forbidden if not.
3. Create `app/api/v1/user.py`:
   - `POST /register`: Registers a new user, hashes password, saves to DB, returns user info.
   - `POST /login`: Validates credentials, returns `{access_token, token_type: "bearer", user: {...}}`.
   - `GET /me`: Returns profile of the authenticated user.
```
- **Output Artifacts**: `backend/app/core/security.py`, `backend/app/api/deps.py`, `backend/app/api/v1/user.py`

---

### Prompt 2.3: Product Catalog & Faceted Search Endpoints
- **Objective**: Build high-performance catalog querying with faceted search, sorting, and customer reviews.
- **Context**: `backend/app/api/v1/catalog.py`, `backend/app/schemas/catalog.py`.

```text
PROMPT:
Act as a Backend Specialist. Implement the Product Catalog and Category REST endpoints in `app/api/v1/catalog.py`.

Implement the following endpoints:
1. `GET /categories`: Returns all active categories with product counts.
2. `GET /products`: Supports query params:
   - `category_id: Optional[int]`
   - `search: Optional[str]` (filters case-insensitively across name and description)
   - `min_price: Optional[float]`, `max_price: Optional[float]`
   - `in_stock_only: Optional[bool]` (stock_quantity > 0)
   - `sort_by: Optional[str]` ("newest", "price_asc", "price_desc", "rating")
   - `skip: int = 0`, `limit: int = 50`
   Returns: Paginated response with total count, items, and price boundaries.
3. `GET /products/{product_id}`: Returns product details including specifications JSON.
4. `GET /products/{product_id}/reviews`: Returns list of verified reviews.
5. `POST /products/{product_id}/reviews`: Authenticated endpoint (`get_current_user`). Creates a review, updates product's aggregate rating and review count.
```
- **Output Artifacts**: `backend/app/api/v1/catalog.py`, `backend/app/schemas/catalog.py`

---

### Prompt 2.4: Shopping Cart & Calculation Service
- **Objective**: Implement user cart state persistence and dynamic pricing calculation.
- **Context**: `backend/app/services/cart_service.py`, `backend/app/api/v1/cart.py`.

```text
PROMPT:
Act as an E-Commerce Backend Engineer. Create the Shopping Cart business logic and API endpoints.

1. Create `app/services/cart_service.py` with methods:
   - `get_or_create_cart(user_id: int, db: Session) -> Cart`
   - `add_item(user_id: int, product_id: int, quantity: int, db: Session) -> CartResponse`
   - `update_item_quantity(user_id: int, item_id: int, quantity: int, db: Session) -> CartResponse`
   - `remove_item(user_id: int, item_id: int, db: Session) -> CartResponse`
   - `clear_cart(user_id: int, db: Session)`
   - `calculate_totals(cart: Cart) -> CartTotals`:
     * Subtotal = Sum of (unit_price * quantity).
     * Discount = Sum of ((original_price - discount_price) * quantity) where applicable.
     * Shipping = Free ($0.00) if subtotal >= $100.00, else flat $15.00.
     * Tax = 8% of (Subtotal - Discount).
     * Grand Total = Subtotal - Discount + Shipping + Tax.
2. Create `app/api/v1/cart.py`:
   - All routes secured with `Depends(get_current_user)`.
   - `GET /`: Returns user's cart items, computed totals, and free-shipping eligibility delta.
   - `POST /items`: Adds item to cart (validates stock availability).
   - `PUT /items/{item_id}`: Updates quantity (deletes if quantity <= 0).
   - `DELETE /items/{item_id}`: Removes item.
   - `DELETE /clear`: Empties the cart.
```
- **Output Artifacts**: `backend/app/services/cart_service.py`, `backend/app/api/v1/cart.py`

---

### Prompt 2.5: Order Checkout & Transactional Inventory Deductions
- **Objective**: Build atomic order placement with inventory decrements, unique order number generation, and tracking milestones.
- **Context**: `backend/app/api/v1/order.py`, `backend/app/schemas/order.py`.

```text
PROMPT:
Act as a Senior Backend Engineer specializing in transactional systems. Implement Order Checkout and Order Lifecycle management in `app/api/v1/order.py`.

Requirements:
1. `POST /checkout`:
   - Dependency: `get_current_user`.
   - Request Body: Recipient name, shipping address, city, state, postal code, phone, and payment method ('Credit Card', 'UPI', 'Net Banking', 'Cash on Delivery').
   - Atomic Transaction:
     * Fetch user's cart items. If empty, raise HTTP 400.
     * For each item, verify and decrement `Product.stock_quantity`. If insufficient stock, raise HTTP 400 and rollback.
     * Generate unique human-readable order number: `LX-YYYYMMDD-XXXX` (random alphanumeric).
     * Create `Order` and associated `OrderItem` records.
     * Create initial `PaymentTransaction` record.
     * Empty user's cart.
     * Commit transaction and return order summary with HTTP 201.
2. `GET /my-orders`: Returns authenticated user's order history sorted by `created_at DESC`.
3. `GET /{order_id}`: Returns full order details with tracking milestones (Placed -> Processing -> Shipped -> Delivered).
```
- **Output Artifacts**: `backend/app/api/v1/order.py`, `backend/app/schemas/order.py`

---

### Prompt 2.6: Multi-Gateway Payment Simulation Service
- **Objective**: Simulate realistic payment gateway interactions and record transaction logs.
- **Context**: `backend/app/services/payment_service.py`, `backend/app/api/v1/payment.py`.

```text
PROMPT:
Act as a Fintech & Payment Gateway Integration Engineer. Implement payment processing simulation.

1. Create `app/services/payment_service.py`:
   - `simulate_payment(order_id: int, payment_method: str, amount: float, db: Session) -> PaymentTransaction`:
     * Generates a unique transaction reference (e.g. `TXN-<timestamp>-<uuid4>`).
     * Simulates 98% success rate (and sets status to 'Success'), updates `Order.payment_status = 'Paid'`.
     * If Cash on Delivery, sets payment_status to 'Pending COD'.
     * Returns structured transaction payload.
2. Create `app/api/v1/payment.py`:
   - `POST /process`: Validates payment request and invokes `payment_service.simulate_payment`.
```
- **Output Artifacts**: `backend/app/services/payment_service.py`, `backend/app/api/v1/payment.py`

---

### Prompt 2.7: Store Admin Dashboard & Inventory Management API
- **Objective**: Deliver business analytics, KPI aggregations, and catalog CRUD endpoints for store administrators.
- **Context**: `backend/app/api/v1/admin.py`.

```text
PROMPT:
Act as a Backend Specialist. Implement the Store Admin Control Console API in `app/api/v1/admin.py`. All endpoints must require `Depends(get_current_admin)`.

Implement:
1. `GET /analytics`:
   - Compute: Total Revenue ($), Total Order Count, Active Catalog Items Count, and Low Stock Alerts (items with `stock_quantity < 10`).
   - Category Breakdown: Product count and revenue distribution per category.
   - Recent 5 Orders summary.
2. `POST /products`: Create a new product (validates unique SKU and slug).
3. `PUT /products/{product_id}`: Update pricing, discount price, stock quantity, specs, or images.
4. `DELETE /products/{product_id}`: Soft delete or remove product.
5. `GET /orders`: Paginated list of all customer orders with filter by status.
6. `PATCH /orders/{order_id}/status`: Update order milestone ('Processing', 'Shipped', 'Delivered', 'Cancelled').
```
- **Output Artifact**: `backend/app/api/v1/admin.py`

---

## 6. Phase 3: AI Shopping Assistant & LLM Grounding

### Prompt 3.1: Capgemini Generative Engine Multi-Model Client
- **Objective**: Build an asynchronous HTTP client targeting the Capgemini Generative Engine with multi-model switching.
- **Context**: `backend/app/ai/client.py`, `backend/app/schemas/ai.py`.

```text
PROMPT:
Act as an AI Systems Architect. Create the Capgemini Generative Engine LLM client in `app/ai/client.py`.

Specifications:
1. Remote Endpoint: `https://openai.generative.engine.capgemini.com/v1/chat/completions`.
2. Model Selection: Support dynamic model selection from the client:
   - `openai.gpt-5` (Default)
   - `phi-4-mini-reasoning`
   - `us.anthropic.claude-sonnet-4-5-20250929-v1:0`
   - `mistral.mistral-7b-instruct-v0:2`
3. Client Implementation:
   - Use `httpx.AsyncClient` with a 25.0s timeout and Bearer token authentication.
   - Maintain conversational context by accepting past dialogue history (last 8 turns).
   - Defensive fallback: If the remote API returns an error or times out, trigger an internal rule-based heuristic fallback generator so the user is never left without assistance.
```
- **Output Artifacts**: `backend/app/ai/client.py`, `backend/app/schemas/ai.py`

---

### Prompt 3.2: Dynamic Database Catalog Grounding & Interactive In-Chat Cards
- **Objective**: Inject live database records into the AI system prompt to prevent hallucinations and enable in-chat interactive product cards.
- **Context**: `backend/app/ai/client.py`, `backend/app/api/v1/ai.py`.

```text
PROMPT:
Act as an AI Grounding & Prompt Engineer. Enhance `app/ai/client.py` with real-time database catalog context injection.

Requirements:
1. Method `_build_system_context(db: Session, user_id: Optional[int]) -> str`:
   - Query active categories and list them.
   - Query top catalog products from `ECommerceDb` (IDs, names, prices, discount prices, stock levels, ratings, SKUs).
   - If user is authenticated, query their recent 5 orders (Order #, status, date, total amount).
   - System Prompt Instructions for the LLM:
     * Grounding Rule: Answer strictly using the real store catalog data. Never invent non-existent products or prices.
     * Order Tracking: If user asks about their recent orders, reference order numbers and status.
     * Structured Card Tagging: When recommending products from the catalog, append a tag at the end of the response:
       `[SUGGESTED_IDS: <id1>, <id2>]`
2. In `app/api/v1/ai.py`:
   - `POST /chat`: Parses user message, selected model, and optional auth token.
   - Runs `AIClient.chat()`.
   - Regex-extracts `[SUGGESTED_IDS: ...]`, queries the full `ProductRead` entities from the database, strips the tag from the text response, and returns `{message, suggested_products, model_used}`.
```
- **Output Artifact**: `backend/app/ai/client.py`, `backend/app/api/v1/ai.py`

---

## 7. Phase 4: Frontend Architecture & Global Design System

### Prompt 4.1: Angular 21 Standalone Setup, SSR & Styling Architecture
- **Objective**: Initialize an Angular 21 application utilizing Standalone components, modern Signals, and SCSS styling.
- **Context**: `frontend/angular.json`, `frontend/src/app/app.config.ts`, `frontend/src/styles.scss`.

```text
PROMPT:
Act as a Lead Angular Engineer. Initialize an Angular 21 application configured with Standalone components and modern Signal reactivity.

1. Configure `app.config.ts`:
   - Provide `provideRouter(routes, withComponentInputBinding(), withViewTransitions())`.
   - Provide `provideHttpClient(withFetch(), withInterceptors([authInterceptor]))`.
   - Provide `provideAnimationsAsync()`.
2. Configure `styles.scss`:
   - Import Google Fonts: 'Plus Jakarta Sans' (Body, 400/500/600) and 'Outfit' (Headings, 600/700/800).
   - Import Remixicon CDN for vector icons (`remixicon.css`).
   - Define CSS custom properties for a luxury palette:
     * Dark charcoal background: `--bg-primary: #0b0f19`, `--bg-secondary: #111827`, `--bg-card: rgba(17, 24, 39, 0.8)`.
     * Warm gold accents: `--accent-gold: #d4af37`, `--accent-gold-light: #f3e5ab`, `--accent-gold-hover: #b8972e`.
     * Text colors: `--text-primary: #f9fafb`, `--text-secondary: #9ca3af`, `--text-muted: #6b7280`.
     * Borders: `--border-subtle: rgba(255, 255, 255, 0.08)`, `--border-gold: rgba(212, 175, 55, 0.3)`.
3. Set global CSS reset, custom scrollbars, and glassmorphism utility classes (`.glass-panel`, `.gold-gradient-text`, `.btn-gold`).
```
- **Output Artifacts**: `frontend/src/app/app.config.ts`, `frontend/src/styles.scss`

---

### Prompt 4.2: Core State Management, API Services & JWT HTTP Interceptor
- **Objective**: Create reactive Angular services with Signals and an HTTP interceptor for JWT token injection.
- **Context**: `frontend/src/app/core/services/` and `frontend/src/app/core/interceptors/`.

```text
PROMPT:
Act as an Angular Specialist. Implement the core services and HTTP interceptor in `src/app/core/`.

1. Create `interceptors/auth.interceptor.ts`:
   - Intercepts outgoing requests to `/api/v1/`.
   - Retrieves JWT token from `localStorage.getItem('access_token')`.
   - If present, clones request with `Authorization: Bearer <token>`.
   - Handles HTTP 401 by redirecting to `/login` and triggering a logout signal.
2. Create `services/auth.service.ts`:
   - Signals: `currentUser = signal<User | null>(null)`, `isAuthenticated = computed(() => !!this.currentUser())`, `isAdmin = computed(() => this.currentUser()?.role === 'Admin')`.
   - Methods: `login(credentials)`, `register(payload)`, `logout()`, `loadCurrentUser()`.
3. Create `services/catalog.service.ts`:
   - Methods: `getCategories()`, `getProducts(params)`, `getProductById(id)`, `getProductReviews(id)`, `addReview(id, review)`.
4. Create `services/cart.service.ts`:
   - Signals: `cart = signal<CartResponse | null>(null)`, `itemCount = computed(...)`.
   - Methods: `loadCart()`, `addItem(productId, qty)`, `updateQuantity(itemId, qty)`, `removeItem(itemId)`, `clearCart()`.
5. Create `services/ai.service.ts`:
   - Signal: `activeModel = signal<string>('openai.gpt-5')`.
   - Method: `sendMessage(message, model, history)`.
```
- **Output Artifacts**: `frontend/src/app/core/interceptors/auth.interceptor.ts`, `frontend/src/app/core/services/*.ts`

---

### Prompt 4.3: Role-Based Route Guards & Navigation Routing
- **Objective**: Configure route protection for authenticated users and administrators.
- **Context**: `frontend/src/app/core/guards/`, `frontend/src/app/app.routes.ts`.

```text
PROMPT:
Act as an Angular Engineer. Configure application routing and authentication guards.

1. Create `guards/auth.guard.ts`:
   - Functional guard `canActivate` checking `authService.isAuthenticated()`. If false, redirect to `/login` with `returnUrl`.
2. Create `guards/admin.guard.ts`:
   - Functional guard verifying `authService.isAdmin()`. If false, redirect to `/catalog`.
3. Create `app.routes.ts`:
   - `/` -> Redirect to `/catalog`.
   - `/catalog` -> `CatalogListComponent`.
   - `/catalog/:slug` -> `ProductDetailComponent`.
   - `/cart` -> `CartComponent`.
   - `/checkout` -> `CheckoutComponent` (canActivate: [authGuard]).
   - `/orders` -> `OrderHistoryComponent` (canActivate: [authGuard]).
   - `/orders/:id` -> `OrderDetailComponent` (canActivate: [authGuard]).
   - `/login` -> `LoginComponent`.
   - `/register` -> `RegisterComponent`.
   - `/admin` -> `AdminDashboardComponent` (canActivate: [authGuard, adminGuard]).
   - `**` -> Redirect to `/catalog`.
```
- **Output Artifacts**: `frontend/src/app/core/guards/*.ts`, `frontend/src/app/app.routes.ts`

---

### Prompt 4.4: Luxury Glassmorphism Design System & SCSS Tokens
- **Objective**: Develop modern styling specifications for cards, buttons, badges, and animations.
- **Context**: `frontend/src/app/app.scss`, `frontend/src/styles.scss`.

```text
PROMPT:
Act as a Lead UI/UX Designer and CSS Specialist. Create luxury design system utility styles and animations for LuxeMart.

Design Requirements:
1. Glassmorphism Card Style:
   - Background: `rgba(17, 24, 39, 0.75)`, backdrop-filter: `blur(12px)`, border: `1px solid rgba(255, 255, 255, 0.08)`.
   - Hover state: Subtle translateY(-4px), box-shadow: `0 12px 30px rgba(0, 0, 0, 0.4)`, border-color: `rgba(212, 175, 55, 0.35)`.
2. Buttons:
   - Primary Gold Button: Gradient `linear-gradient(135deg, #d4af37, #f3e5ab)`, dark typography, subtle gold glow hover effect.
   - Secondary Outline Button: Transparent background, 1px gold border, gold text with soft hover fill.
3. Micro-Animations:
   - Keyframe shimmer animations for skeleton loaders.
   - Pulse animations for live cart item badges and AI thinking indicators.
   - Smooth accordion transitions for technical product specifications.
```
- **Output Artifact**: `frontend/src/styles.scss`

---

## 8. Phase 5: Frontend Feature Components Implementation

### Prompt 5.1: Navigation Bar, Announcement Bar & Global Footer
- **Objective**: Implement responsive navigation with user profile menu, cart counter badge, and quick category shortcuts.
- **Context**: `frontend/src/app/shared/components/navbar/` and `footer/`.

```text
PROMPT:
Act as an Angular UI Engineer. Build the global navigation header and footer components.

1. Announcement Top Bar:
   - Display: "✨ Complimentary express courier shipping on orders exceeding $100 | 30-Day Luxury Guarantee".
2. Navbar Component:
   - Brand Logo: "LUXEMART" in Outfit typography with gold diamond emblem.
   - Search Bar: Instant search input that navigates to `/catalog?search=...`.
   - Navigation Links: Catalog, New Arrivals, Featured Collections.
   - Cart Action: Cart icon displaying live badge with `cartService.itemCount()` signal. Clicking toggles the cart offcanvas drawer.
   - User Account Menu:
     * If unauthenticated: "Sign In" button opening login dialog/page with pre-populated demo buttons.
     * If authenticated: Dropdown with user avatar, name, "My Orders", "Admin Console" (if admin), and "Sign Out".
3. Footer Component:
   - Brand summary, curated taxonomy links, customer care policies, newsletter subscription input, and copyright notice.
```
- **Output Artifacts**: `frontend/src/app/shared/components/navbar/`, `frontend/src/app/shared/components/footer/`

---

### Prompt 5.2: Catalog Showcase & Faceted Filter Suite
- **Objective**: Build the catalog page featuring category pills, price range slider, stock filter, sorting, and responsive product cards.
- **Context**: `frontend/src/app/features/catalog/catalog-list/`.

```text
PROMPT:
Act as a Frontend Engineer. Build the Product Catalog component (`catalog-list.component.ts` and template) with faceted filtering.

Features:
1. Hero Showcase Banner:
   - High-impact headline, subheadline, and background image celebrating luxury collections.
2. Category Pill Filter:
   - Horizontal scrolling pills for categories ("All Items", "Electronics & Gadgets", etc.) with active state indication.
3. Faceted Filter Sidebar:
   - Live Search Input.
   - Price Slider ($0 to $3,000) with dynamic min/max labels.
   - In-Stock Only toggle switch.
   - Sort Dropdown: "Newest", "Price: Low to High", "Price: High to Low", "Customer Rating".
   - Clear All Filters button.
4. Product Grid & Cards:
   - Responsive grid (1 col mobile, 2 col tablet, 4 col desktop).
   - Card displays: Badge ("Featured" / "Discount %"), high-res product image with zoom on hover, category title, product name, star rating with review count, price and strikethrough original price, and quick "Add to Bag" button.
5. Empty State:
   - Elegant feedback with a "Reset Filters" action if zero products match.
```
- **Output Artifacts**: `frontend/src/app/features/catalog/catalog-list/`

---

### Prompt 5.3: Product Detail Gallery & Customer Reviews Component
- **Objective**: Implement product detail view with multi-image gallery, specs table, and review submission.
- **Context**: `frontend/src/app/features/catalog/product-detail/`.

```text
PROMPT:
Act as an Angular UI Engineer. Build the Product Detail page (`product-detail.component.ts`).

Requirements:
1. Gallery Showcase:
   - Large main image display with interactive thumbnail gallery below.
2. Product Information Panel:
   - Category breadcrumb navigation.
   - Product title, SKU badge, star rating, price calculation.
   - Stock Status: "In Stock (<N> units remaining)" or "Low Stock Alert" if < 10.
   - Quantity selector (+ / -) and primary "Add to Shopping Bag" button with feedback.
3. Technical Specifications Table:
   - Render key-value pairs parsed from `product.specs_json` (e.g. Dimensions, Material, Warranty, Weight).
4. Customer Reviews Section:
   - Rating overview breakdown.
   - List of verified reviews with star icons, reviewer name, date, and comments.
   - "Write an Appraisal" form (rating 1-5 stars, review textarea, submit button) visible to authenticated users.
```
- **Output Artifacts**: `frontend/src/app/features/catalog/product-detail/`

---

### Prompt 5.4: Slide-Over Cart Drawer & Free Shipping Progress Indicator
- **Objective**: Build a slide-over cart drawer with quantity adjustments and a live free-shipping progress tracker.
- **Context**: `frontend/src/app/features/cart/`.

```text
PROMPT:
Act as an Angular Specialist. Build the Slide-Over Shopping Bag component (`cart.component.ts`).

Requirements:
1. Slide-Over Panel Behavior:
   - Slides smoothly from the right side of the screen with backdrop blur overlay.
2. Free Shipping Meter:
   - Progress bar showing progress toward $100.00 threshold:
     * If < $100: "Add $<remaining> more for FREE Express Shipping!"
     * If >= $100: "🎉 You have unlocked Free Luxury Express Courier Delivery!"
3. Cart Items List:
   - Product thumbnail, name, unit price, quantity increment/decrement controls, item subtotal, and remove button.
4. Order Summary Calculations:
   - Subtotal, Discount Savings (in green), Shipping ($0.00 or $15.00), Estimated Tax (8%), and Total.
5. Checkout Action:
   - "Proceed to Secure Checkout" button navigating to `/checkout`.
```
- **Output Artifacts**: `frontend/src/app/features/cart/`

---

### Prompt 5.5: Multi-Step Checkout & Payment Selector
- **Objective**: Implement a multi-step checkout workflow: Shipping Address, Payment Method, and Order Review.
- **Context**: `frontend/src/app/features/checkout/`.

```text
PROMPT:
Act as a Frontend Engineer. Build the multi-step checkout component (`checkout.component.ts`) with reactive forms.

Form Steps & Logic:
1. Step 1: Consignment Address:
   - Reactive form: Recipient Full Name, Address, City, State, Postal Code, Phone Number.
   - Form validation: All fields required; postal code and phone validated with regex patterns.
2. Step 2: Payment Gateway Selection:
   - Selectable cards: "Credit / Debit Card", "UPI / Instant Transfer", "Net Banking", "Cash on Delivery".
   - If Credit Card: Simulated Card Number, Expiry, CVV inputs with formatting.
3. Step 3: Order Review & Placement:
   - Summary of items, shipping address preview, selected payment method, and fee breakdown.
   - "Place Order & Pay" button with loading spinner.
   - On success: Empties cart and navigates to `/orders/<order_id>` with celebratory confirmation modal.
```
- **Output Artifacts**: `frontend/src/app/features/checkout/`

---

### Prompt 5.6: Order Tracking Timeline & User Purchase History
- **Objective**: Build the customer order tracking interface with a visual milestone stepper.
- **Context**: `frontend/src/app/features/order/`.

```text
PROMPT:
Act as an Angular UI Engineer. Build the Order History and Order Tracking detail components in `features/order/`.

Requirements:
1. Order History List (`order-history.component.ts`):
   - Table or card view of previous orders: Order #, date, total cost, items count, and status badge.
   - Quick action: "Track Order" or "View Receipt".
2. Order Detail & Visual Stepper (`order-detail.component.ts`):
   - Stepper timeline with 4 milestones: Placed ➔ Processing ➔ Shipped ➔ Delivered.
   - Dynamic step states: Completed (Gold checkmark), Active (Pulsing ring), Upcoming (Muted gray).
   - Recipient address details and payment confirmation summary.
   - Itemized list of purchased products with thumbnail, SKU, quantity, and price.
```
- **Output Artifacts**: `frontend/src/app/features/order/`

---

### Prompt 5.7: Store Administration Console (KPIs, Inventory CRUD, Order Management)
- **Objective**: Deliver a full-featured admin management dashboard with metrics, stock management, and status updates.
- **Context**: `frontend/src/app/features/admin/`.

```text
PROMPT:
Act as a Senior Frontend Specialist. Implement the Store Administration Console (`admin-dashboard.component.ts`).

Requirements:
1. Analytics KPI Metric Cards:
   - Total Gross Revenue ($), Total Orders, Active Catalog Items, Low-Stock Warnings (< 10 units).
2. Product Inventory Management Table:
   - List all products with thumbnails, names, categories, price, stock quantity, and status.
   - "Add New Product" modal with inputs for name, category, price, discount, SKU, stock, image URL, and specs.
   - "Edit Product" inline or modal editor to modify pricing and stock levels.
   - Delete/archive action.
3. Order Fulfillment Table:
   - List customer orders with order number, customer name, date, total, and status.
   - Status update dropdown allowing immediate transition to 'Processing', 'Shipped', or 'Delivered'.
4. Security: Component guarded by `adminGuard`.
```
- **Output Artifacts**: `frontend/src/app/features/admin/`

---

### Prompt 5.8: Real-Time AI Concierge Chatbot Widget
- **Objective**: Build a floating AI shopping assistant widget with model selection dropdown and rich product recommendation cards.
- **Context**: `frontend/src/app/features/ai-chat/`.

```text
PROMPT:
Act as a Frontend & Generative AI Engineer. Implement the floating AI Shopping Assistant widget (`ai-chat.component.ts`).

Widget Features:
1. Floating Launcher Button:
   - Fixed bottom-right launcher button with luxury gold gradient icon and pulse animation.
   - Clicking opens/minimizes the chat window.
2. Chat Header:
   - Title: "LuxeMart AI Concierge".
   - Model Selector Dropdown:
     * `openai.gpt-5` (Flagship)
     * `phi-4-mini-reasoning`
     * `us.anthropic.claude-sonnet-4-5-20250929-v1:0`
     * `mistral.mistral-7b-instruct-v0:2`
   - Minimize and Clear Chat buttons.
3. Message Stream & Formatting:
   - Distinguish user messages from assistant responses.
   - Render markdown formatting (bold, bulleted lists, links).
   - Thinking indicator: Animated dots while waiting for LLM response.
4. Interactive Product Cards in Chat:
   - When the backend returns `suggested_products` (e.g. from `[SUGGESTED_IDS: ...]`), render compact product preview cards directly inside the conversation flow.
   - Each card displays: Product thumbnail, name, price, stock status, and direct "Add to Cart" button.
5. Quick Prompt Chips:
   - "🎁 Recommend luxury gifts under $200"
   - "📦 What is my latest order status?"
   - "⚡ Show me in-stock smart electronics"
```
- **Output Artifact**: `frontend/src/app/features/ai-chat/ai-chat.component.ts`

---

## 9. Phase 6: Integration, Testing & Quality Assurance

### Prompt 6.1: Comprehensive REST API Testing Suite (.http)
- **Objective**: Provide an executable HTTP test suite covering all backend endpoints.
- **Context**: `backend/api-testing.http`.

```text
PROMPT:
Act as a QA Automation Engineer. Create a complete, executable REST API testing suite in `backend/api-testing.http` (compatible with VS Code REST Client / IntelliJ HTTP Client).

Include parameterized requests for:
1. Environment variables: `@baseUrl = http://localhost:8000/api/v1`.
2. Health check verification: `GET /health`.
3. Authentication workflows:
   - Admin Login (capturing `@adminToken`).
   - Customer Login (capturing `@customerToken`).
   - User Registration with validation tests.
   - `GET /user/me` with Bearer token.
4. Catalog workflows:
   - Fetch categories.
   - Faceted search (category, price range, search query, sorting).
   - Product details and reviews.
   - Submitting a product review.
5. Cart & Order workflows:
   - Add items, update quantities, fetch cart totals.
   - Order checkout with simulated payment details.
   - Fetching user order history and order tracking milestones.
6. Admin workflows:
   - Fetching store analytics and KPI metrics using `@adminToken`.
   - Creating a product, updating stock, and updating order fulfillment status.
7. AI Assistant workflows:
   - Chat completion with model switching (`openai.gpt-5`, `phi-4-mini-reasoning`, `claude-sonnet-4-5`, `mistral-7b`).
   - Catalog-grounded product queries and user order status queries.
```
- **Output Artifact**: `backend/api-testing.http`

---

### Prompt 6.2: End-to-End Verification & Health Checklist
- **Objective**: Formulate the QA checklist for validating the complete system integration.
- **Context**: Integration verification.

```text
PROMPT:
Act as a Principal QA Lead. Formulate a comprehensive End-to-End Verification Runbook for the LuxeMart application.

Create testing scenarios covering:
1. Authentication & Security:
   - Verify unauthenticated requests to protected endpoints return HTTP 401.
   - Verify non-admin users attempting admin routes receive HTTP 403 Forbidden.
   - Verify password hashes in SQL Server are salted bcrypt strings.
2. Data Integrity & Concurrency:
   - Verify that purchasing the last remaining unit of an item decrements `stock_quantity` to 0 and reflects immediately across catalog queries.
   - Verify that adding more units than available stock returns an error.
3. Generative AI Accuracy:
   - Verify AI assistant answers catalog queries using live database prices and descriptions.
   - Verify interactive product cards appear in the chat window when specific items are recommended.
4. UI & Responsive Design:
   - Validate responsive layouts across Mobile (375px), Tablet (768px), and Desktop (1440px).
   - Test free-shipping meter calculation transitions at exactly $100.00.
```
- **Output Artifact**: Integrated verification steps.

---

## 10. Phase 7: Production Deployment & Orchestration

### Prompt 7.1: Environment Variable Configurations & Secret Management
- **Objective**: Standardize configuration management across development and production environments.
- **Context**: `backend/.env`, `frontend/src/environments/`.

```text
PROMPT:
Act as a DevOps & Security Engineer. Define the configuration files and environment variable schemas for both Backend and Frontend.

1. Create `backend/.env`:
   - `PROJECT_NAME="LuxeMart Enterprise E-Commerce"`
   - `API_V1_STR="/api/v1"`
   - `SECRET_KEY="<cryptographically-secure-random-string>"`
   - `ACCESS_TOKEN_EXPIRE_MINUTES=1440`
   - `DB_SERVER="LIN-5CD6268KRS"`
   - `DB_NAME="ECommerceDb"`
   - `DB_USER=""`
   - `DB_PASSWORD=""`
   - `CAPGEMINI_AI_ENDPOINT="https://openai.generative.engine.capgemini.com/v1"`
   - `CAPGEMINI_AI_API_KEY="<api-key>"`
   - `DEFAULT_AI_MODEL="openai.gpt-5"`
2. Define documentation for each variable, security best practices, and rotation strategies.
```
- **Output Artifact**: `backend/.env`

---

### Prompt 7.2: Build, Serve & Production Runbook
- **Objective**: Create the operational runbook for executing, compiling, and running both backend and frontend applications.
- **Context**: Developer operations.

```text
PROMPT:
Act as a DevOps Engineer. Create a clear runbook with commands to start and verify the full LuxeMart system.

Include:
1. Database Prerequisites:
   - Ensuring Microsoft SQL Server service is running.
   - Database `ECommerceDb` creation command.
2. Backend Execution (FastAPI):
   - Virtual environment activation (`.venv\Scripts\activate`).
   - Dependency installation (`pip install -r requirements.txt`).
   - Uvicorn server startup command: `uvicorn app.main:app --reload --host 127.0.0.1 --port 8000`.
3. Frontend Execution (Angular 21):
   - Dependency installation (`npm install`).
   - Dev server startup: `npm start` (or `ng serve --port 4200`).
   - Production SSR build: `npm run build`.
4. Verification URLs:
   - Frontend Application: `http://localhost:4200`
   - Backend Swagger Documentation: `http://127.0.0.1:8000/docs`
   - Backend Redoc: `http://127.0.0.1:8000/redoc`
```
- **Output Artifact**: Runbook section in documentation.

---

## 11. Quick Reference: Seed Credentials & Model Capabilities

| Profile | Email | Password | Role | Permissions |
|---|---|---|---|---|
| **Admin** | `vijaykumar@gmail.com` | `VijayKumar@12345` | `Admin` | Full Catalog CRUD, Analytics, Order Status Updates |
| **Customer** | `rohan@example.com` | `Rohan@12345` | `Customer` | Browsing, Cart, Checkout, Order Tracking, Appraisals |

### Supported AI Models (Capgemini Generative Engine)
- **`openai.gpt-5`**: Flagship conversational model for nuanced recommendations and natural dialogue.
- **`phi-4-mini-reasoning`**: Ultra-fast reasoning model optimized for budget/spec comparisons.
- **`us.anthropic.claude-sonnet-4-5-20250929-v1:0`**: Nuanced luxury styling advisor and detailed descriptive analysis.
- **`mistral.mistral-7b-instruct-v0:2`**: Efficient, concise catalog item retrieval.

---
*LuxeMart E-Commerce System — Engineered with FastAPI, Microsoft SQL Server, Angular 21, and Capgemini Generative Engine.*
