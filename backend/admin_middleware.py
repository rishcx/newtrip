from fastapi import HTTPException, Header, Depends
from typing import Optional, Annotated
import hashlib
import hmac
from config import get_settings

settings = get_settings()

# Admin secret key - should be set in environment variables
# Generate a strong secret: openssl rand -hex 32
ADMIN_SECRET_KEY = getattr(settings, 'admin_secret_key', None)

# Admin user email (optional - for double verification)
ADMIN_EMAIL = getattr(settings, 'admin_email', None)


def verify_admin_key(
    x_admin_key: Annotated[Optional[str], Header()] = None,
    x_admin_id: Annotated[Optional[str], Header()] = None
) -> dict:
    """
    Verify admin access using secret key and admin ID.
    Both headers are required for security.
    
    Headers required:
    - X-Admin-Key: The admin secret key
    - X-Admin-ID: Your admin ID (can be your email or a unique identifier)
    """
    if not ADMIN_SECRET_KEY:
        raise HTTPException(
            status_code=500,
            detail="Admin authentication not configured. Please set ADMIN_SECRET_KEY in environment variables."
        )
    
    if not x_admin_key or not x_admin_id:
        raise HTTPException(
            status_code=401,
            detail="Admin authentication required. Missing X-Admin-Key or X-Admin-ID headers."
        )
    
    # Verify the admin key matches
    if not hmac.compare_digest(x_admin_key, ADMIN_SECRET_KEY):
        raise HTTPException(
            status_code=403,
            detail="Invalid admin credentials. Access denied."
        )
    
    # Optional: Verify admin email if configured
    if ADMIN_EMAIL and x_admin_id != ADMIN_EMAIL:
        raise HTTPException(
            status_code=403,
            detail="Admin ID does not match authorized admin email."
        )
    
    return {
        "admin_id": x_admin_id,
        "authenticated": True
    }


def get_admin_info(admin: dict = Depends(verify_admin_key)) -> dict:
    """Dependency to get admin info after verification"""
    return admin

