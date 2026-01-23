#!/bin/bash

# Backend Setup Script
echo "Setting up backend..."

cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Upgrade pip first
echo "Upgrading pip..."
pip install --upgrade pip

# Install dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "Backend setup complete!"
echo ""
echo "To run the backend server:"
echo "  cd backend"
echo "  source venv/bin/activate"
echo "  uvicorn server:app --reload --port 8000"
