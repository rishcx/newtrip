"""
Vercel Serverless Function Handler for FastAPI
"""
import sys
import os
from pathlib import Path
import logging

# Configure logging for Vercel
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Add backend directory to path
backend_path = Path(__file__).parent.parent / "backend"
sys.path.insert(0, str(backend_path))

try:
    from mangum import Mangum
    from server import app
    
    # Create Mangum adapter for FastAPI
    mangum_handler = Mangum(app, lifespan="off")
    logger.info("FastAPI app and Mangum handler initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize FastAPI app: {str(e)}")
    logger.error(f"Error type: {type(e).__name__}")
    import traceback
    logger.error(traceback.format_exc())
    # Create a minimal error handler
    def error_handler(event, context):
        return {
            "statusCode": 500,
            "body": f"Server initialization failed: {str(e)}"
        }
    mangum_handler = error_handler

# Vercel automatically calls this function for /api/* routes
def handler(event, context):
    """Vercel serverless function handler"""
    try:
        return mangum_handler(event, context)
    except Exception as e:
        logger.error(f"Handler error: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
        return {
            "statusCode": 500,
            "body": f"Handler error: {str(e)}"
        }

