from math import ceil
from typing import Any

from schemas.common import PaginatedResponse


def build_paginated_response(
    items: list[Any], total: int, page: int, page_size: int
) -> PaginatedResponse[Any]:
    total_pages = ceil(total / page_size) if page_size else 1
    return PaginatedResponse[
        Any
    ](
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )
