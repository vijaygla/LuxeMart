import os
from typing import List
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "LuxeMart E-Commerce"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "mssql+pyodbc://sa:Capgemini%4012345@LIN-5CD6268KRS/ECommerceDb?driver=ODBC+Driver+18+for+SQL+Server&TrustServerCertificate=yes&Encrypt=yes"
    )
    JWT_SECRET: str = os.getenv("JWT_SECRET", "c6b547285627f12e8b2b6c164a6d36e890c0a34b21e8b4e78a2e1d7f6c5b4a39")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))

    CAPGEMINI_AI_API_KEY: str = os.getenv("CAPGEMINI_AI_API_KEY", "zWa88L3KGt9pjRwIhvNl48RaVpv4H4El1JTKAOeO")
    CAPGEMINI_AI_ENDPOINT: str = os.getenv("CAPGEMINI_AI_ENDPOINT", "https://openai.generative.engine.capgemini.com/v1")
    DEFAULT_AI_MODEL: str = os.getenv("DEFAULT_AI_MODEL", "openai.gpt-5")

    ALLOWED_AI_MODELS: List[str] = [
        "openai.gpt-5",
        "phi-4-mini-reasoning",
        "us.anthropic.claude-sonnet-4-5-20250929-v1:0",
        "mistral.mistral-7b-instruct-v0:2"
    ]

    CORS_ORIGINS: List[str] = [
        "http://localhost:4200",
        "http://127.0.0.1:4200",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
