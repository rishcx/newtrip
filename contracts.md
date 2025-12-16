# TrippyDrip Backend Implementation Contracts

## Overview
This document outlines the contracts for backend implementation with Supabase database, Supabase Auth for authentication, and Razorpay for payment processing.

## Technology Stack
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (email/password)
- **Payment Gateway**: Razorpay (mock keys for now)
- **Backend**: FastAPI with Supabase Python SDK
- **Frontend**: React with Supabase JS SDK

## Database Schema (Supabase Tables)

### 1. profiles
- Links to auth.users
- Fields: id (uuid, FK to auth.users), email, full_name, avatar_url, created_at, updated_at
- RLS: Users can read/update their own profile

### 2. products
- Fields: id (uuid), name, description, price, image_url, category, sizes (array), colors (array), stock_quantity, created_at, updated_at
- RLS: Public read access, admin write access

### 3. orders
- Fields: id (uuid), user_id (FK to profiles), status, total_amount, payment_id (razorpay), payment_status, created_at, updated_at
- RLS: Users can read/create their own orders

### 4. order_items
- Fields: id (uuid), order_id (FK to orders), product_id (FK to products), quantity, unit_price, size, color, created_at
- RLS: Users can read items from their orders

## API Endpoints

### Authentication (Supabase Auth via Frontend)
Frontend handles auth directly via Supabase client:
- Sign up: `supabase.auth.signUp()`
- Sign in: `supabase.auth.signInWithPassword()`
- Sign out: `supabase.auth.signOut()`
- Session management: `supabase.auth.getSession()`

### Backend API Endpoints

#### Products
- `GET /api/products` - Get all products (public)
- `GET /api/products/:id` - Get single product (public)
- `POST /api/products` - Create product (admin only - future)
- `PUT /api/products/:id` - Update product (admin only - future)

#### Orders
- `GET /api/orders` - Get user's orders (requires auth)
- `GET /api/orders/:id` - Get single order (requires auth)
- `POST /api/orders` - Create order (requires auth)
- `PUT /api/orders/:id/status` - Update order status (requires auth)

#### Payments (Razorpay)
- `POST /api/payments/create-order` - Create Razorpay order (requires auth)
- `POST /api/payments/verify` - Verify payment signature (requires auth)
- `POST /api/payments/webhook` - Handle Razorpay webhooks

#### User Profile
- `GET /api/profile` - Get user profile (requires auth)
- `PUT /api/profile` - Update user profile (requires auth)

## Mock Data Migration
The following mock data in `/app/frontend/src/mock.js` will be migrated to Supabase:
- Products array → `products` table
- Cart functions will be updated to work with Supabase and checkout flow

## Authentication Flow
1. User signs up/signs in via Supabase Auth (frontend)
2. Supabase returns JWT token stored in session
3. Frontend includes JWT in Authorization header for backend API calls
4. Backend validates JWT using Supabase JWT secret
5. Backend extracts user_id from JWT for database operations

## Checkout & Payment Flow
1. User adds items to cart (localStorage for now)
2. User proceeds to checkout
3. Frontend calls backend `POST /api/payments/create-order` with cart items
4. Backend:
   - Creates order in Supabase with status "pending"
   - Creates Razorpay order via Razorpay API
   - Returns Razorpay order_id to frontend
5. Frontend opens Razorpay checkout modal
6. User completes payment
7. Razorpay returns payment details
8. Frontend calls backend `POST /api/payments/verify` with payment details
9. Backend:
   - Verifies Razorpay signature
   - Updates order status to "completed" or "failed"
   - Saves payment_id to order
10. Frontend shows success/failure message

## Environment Variables

### Backend (.env)
```
SUPABASE_URL=https://iojrjuicfhqemwvlvdev.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>
SUPABASE_JWT_SECRET=<jwt_secret>
RAZORPAY_KEY_ID=rzp_test_mock123 (mock for now)
RAZORPAY_KEY_SECRET=mock_secret_123 (mock for now)
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_SUPABASE_URL=https://iojrjuicfhqemwvlvdev.supabase.co
REACT_APP_SUPABASE_ANON_KEY=<anon_key_provided>
REACT_APP_BACKEND_URL=<existing_backend_url>
REACT_APP_RAZORPAY_KEY_ID=rzp_test_mock123 (mock for now)
```

## Frontend Changes Required
1. Install Supabase JS client: `yarn add @supabase/supabase-js`
2. Create Supabase client instance
3. Create AuthContext for Supabase Auth
4. Add authentication pages (Login, Signup)
5. Add protected route wrapper
6. Update product fetching to use Supabase
7. Update cart to persist in Supabase (optional) or keep localStorage
8. Add checkout page with Razorpay integration
9. Add user profile page
10. Add orders history page

## Backend Implementation Steps
1. Install dependencies: `supabase`, `razorpay`, `PyJWT`
2. Create Supabase client with service role key
3. Create JWT verification middleware
4. Implement product endpoints (read from Supabase)
5. Implement order endpoints (create/read orders)
6. Implement Razorpay payment endpoints
7. Add CORS configuration for frontend
8. Test all endpoints

## Testing Checklist
- [ ] User can sign up with email/password
- [ ] User can sign in with email/password
- [ ] User can view products from Supabase
- [ ] User can view product details
- [ ] User can add items to cart (localStorage)
- [ ] User can proceed to checkout (authenticated only)
- [ ] Razorpay checkout modal opens with correct amount
- [ ] Payment verification works
- [ ] Order is created in Supabase with correct items
- [ ] User can view their order history
- [ ] User can view individual order details
- [ ] User can update their profile
- [ ] User can sign out

## Notes
- Razorpay keys are currently mock/test keys
- User will add real Razorpay keys later
- Products will be seeded into Supabase from mock data
- Focus on core e-commerce flow first
- Admin features (product management) can be added later
