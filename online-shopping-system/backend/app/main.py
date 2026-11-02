from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.init_db import init_db
from app.api.v1 import user, catalog, cart, order, payment, admin, ai

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure tables and seed data are initialized
    print(f"[STARTUP] Initializing {settings.PROJECT_NAME} database...")
    init_db()
    print("[STARTUP] Database ready.")
    yield
    print("[SHUTDOWN] LuxeMart E-Commerce shutting down.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Enterprise-grade E-Commerce Backend with SQL Server, AI Chatbot, and Role-based access.",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for Angular frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(user.router, prefix=settings.API_V1_STR)
app.include_router(catalog.router, prefix=settings.API_V1_STR)
app.include_router(cart.router, prefix=settings.API_V1_STR)
app.include_router(order.router, prefix=settings.API_V1_STR)
app.include_router(payment.router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=settings.API_V1_STR)
app.include_router(ai.router, prefix=settings.API_V1_STR)

@app.get("/", tags=["Root"])
def root():
    return {
        "app": settings.PROJECT_NAME,
        "version": "1.0.0",
        "status": "Online",
        "documentation": "/docs"
    }

@app.get("/api/v1/health", tags=["Health"])
def health():
    return {"status": "healthy", "database": "connected"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
