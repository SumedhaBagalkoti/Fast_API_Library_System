from fastapi import Request
from fastapi.responses import JSONResponse
import base64

# Hard-coded username and password for assignment
VALID_USERNAME = "admin"
VALID_PASSWORD = "password123"

def validate_credentials(request: Request):
    auth = request.headers.get("Authorization")

    if not auth:
        return None

    try:
        scheme, encoded = auth.split()

        # Only accept Basic authentication
        if scheme.lower() != "basic":
            return None

        decoded = base64.b64decode(encoded).decode("utf-8")

        username, password = decoded.split(":")

        if username == VALID_USERNAME and password == VALID_PASSWORD:
            return username
    except:
        return None

    return None


async def auth_middleware(request: Request, call_next):
    user = validate_credentials(request)

    if not user:
        return JSONResponse(
            status_code=401,
            content={"detail": "Unauthorized"}
        )

    request.state.user = user  # Attach user to request
    response = await call_next(request)
    return response
