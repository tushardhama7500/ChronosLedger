from fastapi import APIRouter

from api.v1.endpoints import (
    dashboard_router,
    orders_router,
    products_router,
    suppliers_router,
    users_router,
    warehouse_router,
)

api_router = APIRouter()

api_router.include_router(dashboard_router)
api_router.include_router(orders_router)
api_router.include_router(products_router)
api_router.include_router(suppliers_router)
api_router.include_router(users_router)
api_router.include_router(warehouse_router)
