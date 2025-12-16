# Supabase Database Setup

## Quick Setup Instructions

The checkout feature requires database tables to be created in Supabase. Follow these steps:

### 1. Open Supabase SQL Editor

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Select your project
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**

### 2. Run the Setup SQL

1. Open the file: `backend/supabase_setup.sql`
2. Copy the entire contents
3. Paste it into the Supabase SQL Editor
4. Click **Run** (or press Cmd/Ctrl + Enter)

### 3. Verify Tables Created

After running the SQL, you should see these tables in the **Table Editor**:
- `profiles`
- `products` (with 6 sample products)
- `orders`
- `order_items`

### 4. Test Checkout

After the tables are created, the checkout should work! Try adding items to cart and clicking "Pay Now".

## What the SQL Does

- Creates all required database tables
- Sets up Row Level Security (RLS) policies
- Allows guest checkout (no login required)
- Seeds 6 sample products
- Creates a trigger to auto-create user profiles on signup

## Troubleshooting

If you get errors:
- Make sure you're using the **Service Role Key** (not the anon key) in your backend `.env` file
- Check that all tables were created successfully
- Verify RLS policies are enabled

