from fastapi import HTTPException, status


def ensure_positive_int(value: int, field_name: str) -> int:
    if value is None or value < 0:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"{field_name} must be a non-negative integer",
        )
    return value


def ensure_non_empty_string(value: str, field_name: str) -> str:
    if not value or not value.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"{field_name} must not be empty",
        )
    return value.strip()
