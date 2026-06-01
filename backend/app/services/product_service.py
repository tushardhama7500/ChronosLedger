from sqlalchemy.ext.asyncio import AsyncSession

from repositories.product import product_repository
from schemas.product import ProductCreate, ProductUpdate
from utils.exceptions import ConflictError, NotFoundError


class ProductService:
    def __init__(self, product_repo=product_repository) -> None:
        self.product_repo = product_repo

    async def get_product(self, db: AsyncSession, product_id: int):
        product = await self.product_repo.get_with_relations(db, id=product_id)
        if not product:
            raise NotFoundError(f"Product with id {product_id} not found")
        return product

    async def search_products(
        self,
        db: AsyncSession,
        *,
        query: str | None = None,
        category_id: int | None = None,
        supplier_id: int | None = None,
        warehouse_id: int | None = None,
        is_active: bool | None = None,
        low_stock_only: bool = False,
        skip: int = 0,
        limit: int = 25,
    ):
        return await self.product_repo.search(
            db,
            query=query,
            category_id=category_id,
            supplier_id=supplier_id,
            warehouse_id=warehouse_id,
            is_active=is_active,
            low_stock_only=low_stock_only,
            skip=skip,
            limit=limit,
        )

    async def create_product(self, db: AsyncSession, *, obj_in: ProductCreate):
        existing = await self.product_repo.get_by_sku(db, obj_in.sku)
        if existing:
            raise ConflictError(f"Product with sku {obj_in.sku} already exists")
        return await self.product_repo.create(db, obj_in=obj_in)

    async def update_product(
        self, db: AsyncSession, product_id: int, *, obj_in: ProductUpdate
    ):
        product = await self.product_repo.get(db, product_id)
        if not product:
            raise NotFoundError(f"Product with id {product_id} not found")

        if obj_in.sku and obj_in.sku != product.sku:
            existing = await self.product_repo.get_by_sku(db, obj_in.sku)
            if existing:
                raise ConflictError(f"Product with sku {obj_in.sku} already exists")

        return await self.product_repo.update(db, db_obj=product, obj_in=obj_in)
