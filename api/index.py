from http.server import BaseHTTPRequestHandler
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

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        
        if mangum_handler is None:
            self.wfile.write(json.dumps({
                "error": "Server initialization failed",
                "message": "Check Vercel logs for details"
            }).encode())
        else:
            # Convert HTTP request to ASGI event
            event = {
                "path": self.path,
                "httpMethod": self.command,
                "headers": dict(self.headers),
                "body": None,
                "isBase64Encoded": False
            }
            try:
                response = mangum_handler(event, {})
                self.wfile.write(json.dumps(response).encode())
            except Exception as e:
                logger.error(f"Handler error: {str(e)}")
                self.wfile.write(json.dumps({
                    "error": str(e)
                }).encode())
    
    def do_POST(self):
        self.do_GET()
    
    def do_PUT(self):
        self.do_GET()
    
    def do_DELETE(self):
        self.do_GET()
