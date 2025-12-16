-- Supabase Database Setup for TrippyDrip
-- Execute this SQL in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create profiles table (linked to auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create products table
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  price numeric(10, 2) not null,
  image_url text,
  category text not null,
  sizes text[] not null default '{}',
  colors text[] not null default '{}',
  stock_quantity integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create orders table
create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  status text default 'pending',
  total_amount numeric(10, 2) not null,
  payment_id text,
  payment_status text default 'pending',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create order_items table
create table if not exists order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid not null references products(id),
  quantity integer not null check (quantity > 0),
  unit_price numeric(10, 2) not null,
  size text,
  color text,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table profiles enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- RLS Policies for profiles
create policy "Users can read their own profile"
  on profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  to authenticated
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on profiles for insert
  to authenticated
  with check (auth.uid() = id);

-- RLS Policies for products (public read access)
create policy "Anyone can read products"
  on products for select
  to authenticated, anon
  using (true);

-- RLS Policies for orders
create policy "Users can read their own orders"
  on orders for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can create orders"
  on orders for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own orders"
  on orders for update
  to authenticated
  using (auth.uid() = user_id);

-- RLS Policies for order_items
create policy "Users can read their order items"
  on order_items for select
  to authenticated
  using (
    order_id in (
      select id from orders where user_id = auth.uid()
    )
  );

create policy "Users can create order items"
  on order_items for insert
  to authenticated
  with check (
    order_id in (
      select id from orders where user_id = auth.uid()
    )
  );

-- Seed products from mock data
insert into products (name, description, price, image_url, category, sizes, colors, stock_quantity) values
  ('Cosmic Vortex Hoodie', 'Dive into the void with our signature cosmic vortex design. Ultra-soft fleece with trippy all-over print.', 89.99, 'https://images.unsplash.com/photo-1579572331145-5e53b299c64e', 'hoodies', ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Black', 'Purple', 'Cyan'], 50),
  ('Neon Dreams Tee', 'Electric vibes only. Premium cotton tee with glow-in-the-dark psychedelic print.', 45.99, 'https://images.unsplash.com/photo-1564557287817-3785e38ec1f5', 'tees', ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Grey', 'Black', 'White'], 100),
  ('Acid Trip Hoodie', 'Bold colors meet surreal patterns. This hoodie is a journey through liquid rainbows.', 95.99, 'https://images.unsplash.com/photo-1609873814058-a8928924184a', 'hoodies', ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Yellow', 'Green', 'Multi'], 30),
  ('Urban Mystic Hoodie', 'Street meets spiritual. Oversized fit with mystical mandala embroidery.', 92.99, 'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e', 'hoodies', ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Brown', 'Tan', 'Olive'], 40),
  ('Liquid Reality Tee', 'Reality melts away. Distorted graphics that shift with every move.', 42.99, 'https://images.pexels.com/photos/1036396/pexels-photo-1036396.jpeg', 'tees', ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Black', 'Navy', 'Charcoal'], 80),
  ('Dimension Shift Hoodie', 'Step between worlds. Color-shifting fabric with holographic details.', 98.99, 'https://images.pexels.com/photos/1868471/pexels-photo-1868471.jpeg', 'hoodies', ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Multi', 'Black', 'White'], 25);

-- Function to automatically create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
