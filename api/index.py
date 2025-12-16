"""
Vercel Serverless Function Handler for FastAPI
"""
import sys
import os
from pathlib import Path

# Add backend directory to path
backend_path = Path(__file__).parent.parent / "backend"
sys.path.insert(0, str(backend_path))

from mangum import Mangum
from server import app

# Create handler for Vercel
handler = Mangum(app, lifespan="off")

# Vercel Python serverless function handler
def handler_wrapper(event, context):
    """Wrapper for Vercel serverless function"""
    return handler(event, context)

# Export for Vercel (Vercel looks for 'handler' or uses the file name)
# For /api routes, Vercel will call this file

