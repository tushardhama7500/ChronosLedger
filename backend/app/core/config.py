# File: chronosledger/backend/app/core/config.py
from pathlib import Path
from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=BACKEND_DIR / ".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
    )

    PROJECT_NAME: str = "ChronosLedger"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "change-this-secret-key-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/chronosledger"

    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
    ]

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip().rstrip("/") for i in v.split(",")]
        elif isinstance(v, list):
            return [str(i).rstrip("/") for i in v]
        return v

    LOW_STOCK_THRESHOLD_DEFAULT: int = 10
    REORDER_LEAD_DAYS_DEFAULT: int = 7


settings = Settings()
