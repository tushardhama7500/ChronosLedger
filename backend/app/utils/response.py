from typing import Any


def build_response(data: Any, message: str = "Success", meta: dict[str, Any] | None = None) -> dict[str, Any]:
    response = {
        "data": data,
        "message": message,
    }
    if meta is not None:
        response["meta"] = meta
    return response
