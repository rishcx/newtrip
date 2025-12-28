"""
Vercel Serverless Function Handler for FastAPI
"""
import sys
import os
from pathlib import Path
import logging
import json

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
    mangum_handler = None

# Vercel automatically calls this function for /api/* routes
def handler(event, context):
    """Vercel serverless function handler"""
    try:
        if mangum_handler is None:
            return {
                "statusCode": 500,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps({
                    "error": "Server initialization failed",
                    "message": "Check Vercel logs for details"
                })
            }
        return mangum_handler(event, context)
    except Exception as e:
        logger.error(f"Handler error: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({
                "error": "Handler error",
                "message": str(e)
            })
        }

