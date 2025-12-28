from mangum import Mangum
import sys
import os
from pathlib import Path

# Add backend directory to path
backend_path = Path(__file__).parent.parent / "backend"
sys.path.insert(0, str(backend_path))

from server import app

# Vercel serverless function handler
handler = Mangum(app, lifespan="off")
