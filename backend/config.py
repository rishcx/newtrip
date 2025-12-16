from pydantic_settings import BaseSettings
from functools import lru_cache
import os


class Settings(BaseSettings):
    # Supabase Configuration
    supabase_url: str
    supabase_service_role_key: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvanJqdWljZmhxZW13dmx2ZGV2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzg4MzU4MCwiZXhwIjoyMDc5NDU5NTgwfQ.FaJKlq3smNBWZtBYvqkl6iYbGYl9M2pWmGOJD-Xnz7I"
    supabase_jwt_secret: str = "5r9xwKHZsFhA6wnMkv4ljF0xXyGOzFkXXczrPZBFjJ0kKEGxT1OJ3bwA5gP5n6UT1AjRQ2kLH1HJ5F0lZJGX3w=="
    supabase_anon_key: str
    
    # Razorpay Configuration
    razorpay_key_id: str
    razorpay_key_secret: str
    razorpay_webhook_secret: str = "mock_webhook_secret"
    
    # Frontend URL
    frontend_url: str
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


@lru_cache()
def get_settings():
    return Settings()
