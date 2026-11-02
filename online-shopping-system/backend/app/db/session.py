from typing import Generator
from sqlmodel import Session, create_engine
from app.core.config import settings

# Engine for SQL Server via pyodbc
engine = create_engine(
    settings.DATABASE_URL,
    echo=False,
    pool_pre_ping=True,
    pool_recycle=3600,
    fast_executemany=True
)

def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session
