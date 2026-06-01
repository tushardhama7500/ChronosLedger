from datetime import datetime, timedelta

from jose import jwt
from passlib.context import CryptContext
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.config import settings
from models.user import User
from repositories.base import BaseRepository
from schemas.user import TokenPayload, UserCreate, UserUpdate
from utils.exceptions import ConflictError, NotFoundError

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class UserService:
    def __init__(self, user_repo=None) -> None:
        self.user_repo = user_repo or BaseRepository[User, UserCreate, UserUpdate](User)

    def _hash_password(self, password: str) -> str:
        return pwd_context.hash(password)

    def _verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)

    async def get_by_email(self, db: AsyncSession, email: str) -> User | None:
        result = await db.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()

    async def get_user(self, db: AsyncSession, user_id: int) -> User:
        user = await self.user_repo.get(db, user_id)
        if not user:
            raise NotFoundError(f"User with id {user_id} not found")
        return user

    async def list_users(
        self, db: AsyncSession, *, skip: int = 0, limit: int = 25
    ) -> tuple[list[User], int]:
        return await self.user_repo.get_multi(db, skip=skip, limit=limit)

    async def create_user(self, db: AsyncSession, *, obj_in: UserCreate) -> User:
        existing = await self.get_by_email(db, obj_in.email)
        if existing:
            raise ConflictError(f"Account with email {obj_in.email} already exists")

        user_data = obj_in.model_dump(exclude={"password"})
        user_data["hashed_password"] = self._hash_password(obj_in.password)
        user = User(**user_data)

        db.add(user)
        await db.flush()
        await db.refresh(user)
        return user

    async def update_user(
        self, db: AsyncSession, user_id: int, *, obj_in: UserUpdate
    ) -> User:
        user = await self.get_user(db, user_id)
        update_data = obj_in.model_dump(exclude_unset=True)

        if "password" in update_data:
            update_data["hashed_password"] = self._hash_password(update_data.pop("password"))

        return await self.user_repo.update(db, db_obj=user, obj_in=update_data)

    async def authenticate_user(
        self, db: AsyncSession, email: str, password: str
    ) -> User | None:
        user = await self.get_by_email(db, email)
        if not user or not self._verify_password(password, user.hashed_password):
            return None
        return user

    def create_access_token(
        self, subject: str, expires_delta: timedelta | None = None
    ) -> str:
        now = datetime.utcnow()
        expires_delta = expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        payload = {
            "sub": subject,
            "exp": now + expires_delta,
            "iat": now,
        }
        return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")

    def build_token_payload(self, token: str) -> TokenPayload:
        data = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        return TokenPayload(sub=data.get("sub"))
