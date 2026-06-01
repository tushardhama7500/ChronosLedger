# File: chronosledger/backend/app/repositories/product.py
from sqlalchemy import select, func, and_, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from models.product import Product
from repositories.base import BaseRepository
from schemas.product import ProductCreate, ProductUpdate


class ProductRepository(BaseRepository[Product, ProductCreate, ProductUpdate]):
    async def get_with_relations(self, db: AsyncSession, id: int) -> Product | None:
        result = await db.execute(
            select(Product)
            .options(
                selectinload(Product.category),
                selectinload(Product.supplier),
                selectinload(Product.warehouse),
            )
            .where(Product.id == id)
        )
        return result.scalar_one_or_none()

    async def get_by_sku(self, db: AsyncSession, sku: str) -> Product | None:
        result = await db.execute(select(Product).where(Product.sku == sku))
        return result.scalar_one_or_none()

    async def search(
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
        limit: int = 100,
    ) -> tuple[list[Product], int]:
        filters = []

        if query:
            filters.append(
                or_(
                    Product.name.ilike(f"%{query}%"),
                    Product.sku.ilike(f"%{query}%"),
                    Product.barcode.ilike(f"%{query}%"),
                )
            )
        if category_id is not None:
            filters.append(Product.category_id == category_id)
        if supplier_id is not None:
            filters.append(Product.supplier_id == supplier_id)
        if warehouse_id is not None:
            filters.append(Product.warehouse_id == warehouse_id)
        if is_active is not None:
            filters.append(Product.is_active == is_active)
        if low_stock_only:
            filters.append(Product.quantity_on_hand <= Product.reorder_point)

        base_query = select(Product).where(and_(*filters)) if filters else select(Product)

        count_result = await db.execute(
            select(func.count()).select_from(base_query.subquery())
        )
        total = count_result.scalar_one()

        result = await db.execute(
            base_query
            .options(
                selectinload(Product.category),
                selectinload(Product.supplier),
                selectinload(Product.warehouse),
            )
            .offset(skip)
            .limit(limit)
            .order_by(Product.name)
        )
        return result.scalars().all(), total

    async def get_low_stock(self, db: AsyncSession, limit: int = 10) -> list[Product]:
        result = await db.execute(
            select(Product)
            .where(
                and_(
                    Product.is_active == True,
                    Product.quantity_on_hand <= Product.reorder_point,
                )
            )
            .order_by(Product.quantity_on_hand.asc())
            .limit(limit)
        )
        return result.scalars().all()

    async def update_stock(
        self, db: AsyncSession, product_id: int, quantity_delta: int
    ) -> Product | None:
        product = await self.get(db, product_id)
        if product:
            product.quantity_on_hand = max(0, product.quantity_on_hand + quantity_delta)
            db.add(product)
            await db.flush()
            await db.refresh(product)
        return product


product_repository = ProductRepository(Product)