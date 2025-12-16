# TrippyDrip - E-commerce Application

A full-stack e-commerce application built with FastAPI (backend) and React (frontend).

## Prerequisites

- Python 3.8+ 
- Node.js 16+ and Yarn
- Supabase account (for database and authentication)
- Razorpay account (for payments)

## Setup Instructions

### 1. Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a Python virtual environment (recommended):
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file in the `backend` directory with the following variables:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
FRONTEND_URL=http://localhost:3000
```

5. Run the backend server:
```bash
uvicorn server:app --reload --port 8000
```

The backend API will be available at `http://localhost:8000`
API documentation will be available at `http://localhost:8000/docs`

### 2. Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies using Yarn:
```bash
yarn install
```

3. Create a `.env` file in the `frontend` directory with the following variables:
```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_BACKEND_URL=http://localhost:8000/api
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
```

4. Start the development server:
```bash
yarn start
```

The frontend will be available at `http://localhost:3000`

## Running the Application

### Option 1: Run Both Services Separately

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # If using virtual environment
uvicorn server:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
yarn start
```

### Option 2: Quick Start Scripts

You can create shell scripts to start both services. For example:

**start-backend.sh:**
```bash
#!/bin/bash
cd backend
source venv/bin/activate
uvicorn server:app --reload --port 8000
```

**start-frontend.sh:**
```bash
#!/bin/bash
cd frontend
yarn start
```

## Environment Variables

Make sure to set up all required environment variables in `backend/.env`:

- **Supabase**: Get these from your Supabase project settings
- **Razorpay**: Get these from your Razorpay dashboard
- **Frontend URL**: Usually `http://localhost:3000` for development

## Database Setup

Run the SQL script in `backend/supabase_setup.sql` in your Supabase SQL editor to set up the required tables and triggers.

## Authentication

This app uses **Supabase Auth** for user authentication. Users can:

- **Sign up** with email and password at `/signup`
- **Login** at `/login`
- **Checkout as guest** (no login required)

### Features:
- Email/password authentication
- Automatic profile creation on signup
- JWT token-based session management
- Guest checkout support

After signing up, users will receive an email verification link. Once verified, they can log in and their orders will be linked to their account.

The authentication state is managed globally via `AuthContext` and persists across page refreshes.

## API Endpoints

Once the backend is running, you can access:
- API Base: `http://localhost:8000/api`
- API Docs: `http://localhost:8000/docs`
- OpenAPI Schema: `http://localhost:8000/openapi.json`

## Troubleshooting

1. **Backend won't start**: Check that all environment variables are set in `backend/.env`
2. **Frontend won't start**: Make sure you're using Yarn (not npm) and all dependencies are installed
3. **CORS errors**: Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
4. **Database errors**: Verify Supabase credentials and that tables are set up correctly
