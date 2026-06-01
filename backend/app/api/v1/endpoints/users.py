from pydantic import BaseModel, EmailStr
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from db.session import get_db
from schemas.common import PaginatedResponse
from schemas.user import Token, UserCreate, UserRead, UserUpdate
from services.user_service import UserService
from utils.pagination import build_paginated_response

router = APIRouter(prefix="/users", tags=["users"])
service = UserService()


class UserLogin(BaseModel):
    email: EmailStr
    password: str


@router.get("/", response_model=PaginatedResponse[UserRead])
async def list_users(
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
) -> PaginatedResponse[UserRead]:
    skip = (page - 1) * page_size
    items, total = await service.list_users(db, skip=skip, limit=page_size)
    return build_paginated_response(items, total, page, page_size)


@router.post("/", response_model=UserRead, status_code=201)
async def create_user(
    user_in: UserCreate,
    db: AsyncSession = Depends(get_db),
) -> UserRead:
    return await service.create_user(db, obj_in=user_in)


@router.get("/{user_id}", response_model=UserRead)
async def get_user(user_id: int, db: AsyncSession = Depends(get_db)) -> UserRead:
    return await service.get_user(db, user_id)


@router.patch("/{user_id}", response_model=UserRead)
async def update_user(
    user_id: int,
    user_in: UserUpdate,
    db: AsyncSession = Depends(get_db),
) -> UserRead:
    return await service.update_user(db, user_id, obj_in=user_in)


@router.delete("/{user_id}", status_code=204)
async def delete_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
) -> None:
    await service.get_user(db, user_id)
    await service.user_repo.remove(db, id=user_id)


@router.post("/login", response_model=Token)
async def login(
    credentials: UserLogin,
    db: AsyncSession = Depends(get_db),
) -> Token:
    user = await service.authenticate_user(db, credentials.email, credentials.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    access_token = service.create_access_token(subject=str(user.id))
    return Token(access_token=access_token)
