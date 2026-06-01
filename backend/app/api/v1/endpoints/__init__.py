from api.v1.endpoints.dashboard import router as dashboard_router
from api.v1.endpoints.orders import router as orders_router
from api.v1.endpoints.products import router as products_router
from api.v1.endpoints.suppliers import router as suppliers_router
from api.v1.endpoints.users import router as users_router
from api.v1.endpoints.warehouse import router as warehouse_router

__all__ = [
    "dashboard_router",
    "orders_router",
    "products_router",
    "suppliers_router",
    "users_router",
    "warehouse_router",
]
