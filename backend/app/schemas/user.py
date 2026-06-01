# File: chronosledger/backend/app/schemas/user.py
from datetime import datetime
from pydantic import BaseModel, EmailStr, field_validator


class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str = "viewer"
    is_active: bool = True


class UserCreate(UserBase):
    password: str

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v


class UserUpdate(BaseModel):
    full_name: str | None = None
    email: EmailStr | None = None
    role: str | None = None
    is_active: bool | None = None
    password: str | None = None


class UserRead(UserBase):
    id: int
    is_superuser: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class UserInDB(UserRead):
    hashed_password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    sub: str | None = None