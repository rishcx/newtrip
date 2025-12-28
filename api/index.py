import sys
import os
from pathlib import Path
import json
import traceback

# Add backend directory to path
backend_path = Path(__file__).parent.parent / "backend"
sys.path.insert(0, str(backend_path))

# Try to import and create handler
try:
    from mangum import Mangum
    from server import app
    
    # Vercel serverless function handler
    handler = Mangum(app, lifespan="off")
    
except Exception as e:
    # If initialization fails, create an error handler
    error_message = f"Failed to initialize: {str(e)}\n{traceback.format_exc()}"
    
    def handler(event, context):
        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            "body": json.dumps({
                "error": "Initialization failed",
                "message": str(e),
                "traceback": traceback.format_exc(),
                "env_check": {
                    "SUPABASE_URL": "set" if os.getenv("SUPABASE_URL") else "missing",
                    "SUPABASE_SERVICE_ROLE_KEY": "set" if os.getenv("SUPABASE_SERVICE_ROLE_KEY") else "missing",
                    "RAZORPAY_KEY_ID": "set" if os.getenv("RAZORPAY_KEY_ID") else "missing",
                }
            })
        }
