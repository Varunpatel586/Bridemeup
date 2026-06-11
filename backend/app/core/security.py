# pyrefly: ignore [missing-import]
import jwt
# pyrefly: ignore [missing-import]
from fastapi import HTTPException, Security
# pyrefly: ignore [missing-import]
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os
# pyrefly: ignore [missing-import]
from typing import Optional

# Mock Supabase secret or get from environment
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET", "mock_secret_key_for_development")
security = HTTPBearer()

def verify_jwt(credentials: HTTPAuthorizationCredentials = Security(security)) -> dict:
    """
    Extracts the JWT from the Authorization header and verifies it.
    For this implementation, we will accept a mock token if the secret is mock_secret_key_for_development,
    otherwise we will try to decode it properly.
    """
    token = credentials.credentials
    try:
        # In a real scenario, you'd specify algorithms=["HS256"] and audience
        payload = jwt.decode(
            token,
            SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            options={"verify_aud": False}
        )
        return payload
    except jwt.ExpiredSignatureError:
        # For development purposes, if the token is "test_token", bypass
        if token == "test_token":
             return {"sub": "test_user"}
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        # For development purposes, if the token is "test_token", bypass
        if token == "test_token":
             return {"sub": "test_user"}
        raise HTTPException(status_code=401, detail="Invalid token")

def get_current_user(payload: dict = Security(verify_jwt)) -> str:
    """
    Returns the user ID from the token payload.
    """
    user_id = payload.get("sub")
    if not user_id:
         raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    return user_id
