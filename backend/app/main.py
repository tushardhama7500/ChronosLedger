from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

from api.v1.router import api_router
from core.config import settings
from db.session import engine
from db.base import Base


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


def create_application() -> FastAPI:
    application = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        description="ChronosLedger Smart Inventory & Order Intelligence API",
        openapi_url=f"{settings.API_V1_STR}/openapi.json",
        docs_url=f"{settings.API_V1_STR}/docs",
        redoc_url=f"{settings.API_V1_STR}/redoc",
        lifespan=lifespan,
    )

    application.add_middleware(GZipMiddleware, minimum_size=1000)
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    application.include_router(api_router, prefix=settings.API_V1_STR)

    return application


app = create_application()
def __main__():
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)

if __name__ == "__main__":
    __main__()