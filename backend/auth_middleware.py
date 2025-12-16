from fastapi import HTTPException, Header
from typing import Annotated, Optional
import jwt
from config import get_settings

settings = get_settings()


def verify_jwt(authorization: Annotated[Optional[str], Header()] = None) -> str:
    """Verify JWT token from Authorization header and return user_id.
    Returns a guest user ID if no token is provided (for guest checkout)."""
    if not authorization:
        # Return guest user ID for unauthenticated users
        return "guest_user"
    
    if not authorization.startswith("Bearer "):
        # Return guest user ID if format is invalid
        return "guest_user"
    
    token = authorization.split(" ")[1]
    
    try:
        # Decode JWT token using Supabase JWT secret
        decoded = jwt.decode(
            token,
            settings.supabase_jwt_secret,
            algorithms=["HS256"],
            options={"verify_aud": False}  # Supabase doesn't use audience claim
        )
        
        # Extract user_id from 'sub' claim
        user_id = decoded.get("sub")
        if not user_id:
            return "guest_user"
        
        return user_id
        
    except jwt.ExpiredSignatureError:
        return "guest_user"
    except jwt.InvalidTokenError:
        return "guest_user"
    except Exception:
        return "guest_user"
