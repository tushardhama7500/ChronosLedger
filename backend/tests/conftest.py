import os

import pytest
import pytest_asyncio
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings
from app.db.base import Base
from app.db.session import get_db
from app.main import app

TEST_DATABASE_URL = os.getenv("TEST_DATABASE_URL", "sqlite+aiosqlite:///:memory:")

engine = create_async_engine(TEST_DATABASE_URL, future=True, echo=False)
TestingSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def override_get_db() -> AsyncSession:
    async with TestingSessionLocal() as session:
        yield session
        await session.rollback()


@pytest_asyncio.fixture(scope="session")
async def initialized_db() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture(scope="function")
async def db_session(initialized_db) -> AsyncSession:
    async with TestingSessionLocal() as session:
        yield session
        await session.rollback()


@pytest_asyncio.fixture(scope="function")
async def async_client(db_session: AsyncSession) -> AsyncClient:
    app.dependency_overrides[get_db] = override_get_db
    async with AsyncClient(app=app, base_url="http://testserver") as client:
        yield client
    app.dependency_overrides.clear()
