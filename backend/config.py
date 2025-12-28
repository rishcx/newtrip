from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import Optional
import os


class Settings(BaseSettings):
    # Supabase Configuration
    supabase_url: str  # Required - no default
    supabase_service_role_key: str  # Required - no default (get from Supabase dashboard)
    supabase_jwt_secret: str = ""  # Optional
    supabase_anon_key: str = ""  # Optional
    
    # Razorpay Configuration
    razorpay_key_id: str
    razorpay_key_secret: str
    razorpay_webhook_secret: str = "mock_webhook_secret"
    
    # Frontend URL
    frontend_url: str
    
    # Admin Configuration
    admin_secret_key: Optional[str] = None
    admin_email: Optional[str] = None
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False
        extra = "ignore"  # Ignore extra fields in .env file
        
        # For Vercel/serverless, read from environment variables directly
        @classmethod
        def customise_sources(cls, init_settings, env_settings, file_secret_settings):
            # Prioritize environment variables (for Vercel)
            # This ensures Vercel environment variables are read first
            return (env_settings, init_settings, file_secret_settings)


@lru_cache()
def get_settings():
    return Settings()
