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

# Create Mangum adapter for FastAPI
mangum_handler = Mangum(app, lifespan="off")

# Vercel automatically calls this function for /api/* routes
def handler(event, context):
    """Vercel serverless function handler"""
    return mangum_handler(event, context)

