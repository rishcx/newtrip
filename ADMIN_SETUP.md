# Admin Panel Setup Guide

## Overview
The admin panel allows you to upload products directly to your database without manually going to Supabase. It's secured with a secret key and admin ID.

## Security Setup

### 1. Generate Admin Secret Key

Generate a strong secret key using one of these methods:

**Using OpenSSL:**
```bash
openssl rand -hex 32
```

**Using Python:**
```python
import secrets
print(secrets.token_hex(32))
```

**Using Node.js:**
```javascript
require('crypto').randomBytes(32).toString('hex')
```

### 2. Set Environment Variables

Add these to your `.env` file in the `backend` directory:

```env
# Admin Configuration
ADMIN_SECRET_KEY=your_generated_secret_key_here
ADMIN_EMAIL=your_email@example.com
```

**For Vercel Deployment:**
1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add:
   - `ADMIN_SECRET_KEY` = your generated secret key
   - `ADMIN_EMAIL` = your email address

### 3. Set Up Supabase Storage

1. Go to your Supabase Dashboard
2. Navigate to **Storage**
3. Click **Create a new bucket**
4. Name it: `product-images`
5. Make it **Public** (so images can be accessed)
6. Click **Create bucket**

## Using the Admin Panel

### Access the Admin Panel

1. Navigate to: `https://yourdomain.com/admin` (or `http://localhost:3000/admin` for local)
2. Enter your credentials:
   - **Admin ID**: Your email address (or any identifier you set)
   - **Admin Secret Key**: The secret key you generated
3. Click **Access Admin Panel**

### Upload a Product

1. Fill in the product details:
   - **Product ID**: Unique identifier (e.g., "7", "8", "9")
   - **Product Name**: Name of the product
   - **Description**: Product description
   - **Price**: Price in dollars (e.g., 89.99)
   - **Category**: Select from dropdown (hoodies, tees, accessories)
   - **Image**: Upload an image file OR paste an image URL
   - **Colors**: Add colors one by one (e.g., "Black", "Red", "Multi")
   - **Stock Quantity**: Number of items in stock

2. Click **Create Product**

3. The product will be uploaded to your Supabase database and images will be stored in Supabase Storage.

## API Endpoints

The admin endpoints are:

- `POST /api/admin/products` - Create a new product
- `PUT /api/admin/products/{id}` - Update a product
- `DELETE /api/admin/products/{id}` - Delete a product
- `GET /api/admin/products` - List all products (admin view)

### Using the API Directly

You can also use these endpoints directly with curl or any HTTP client:

```bash
curl -X POST https://yourdomain.com/api/admin/products \
  -H "Content-Type: application/json" \
  -H "X-Admin-Key: your_secret_key" \
  -H "X-Admin-ID: your_email" \
  -d '{
    "id": "7",
    "name": "New Product",
    "description": "Product description",
    "price": 99.99,
    "category": "hoodies",
    "sizes": ["S", "M", "L", "XL", "XXL"],
    "colors": ["Black", "Red"],
    "stock_quantity": 50,
    "image_url": "https://example.com/image.jpg"
  }'
```

## Image Upload Options

### Option 1: Upload Image File
- Click "Choose File" and select an image
- The image will be converted to base64 and uploaded to Supabase Storage
- A unique filename will be generated automatically

### Option 2: Use Image URL
- Paste a direct image URL (must start with `http://` or `https://`)
- The image will be used as-is (not uploaded to Supabase)

### Option 3: Base64 Data URL
- You can paste a base64 data URL directly
- Format: `data:image/png;base64,iVBORw0KGgoAAAANS...`

## Security Notes

1. **Never commit your admin secret key to Git**
   - It's already in `.gitignore`, but double-check
   
2. **Keep your secret key secure**
   - Don't share it with anyone
   - Don't use it in client-side code
   - Rotate it if compromised

3. **Session Storage**
   - Admin credentials are stored in browser sessionStorage
   - They're cleared when you close the browser
   - You'll need to re-authenticate each session

4. **Admin Email Verification**
   - If `ADMIN_EMAIL` is set, only that email can access
   - Leave it empty to allow any admin ID with correct key

## Troubleshooting

### "Admin authentication not configured"
- Make sure `ADMIN_SECRET_KEY` is set in your environment variables
- Restart your backend server after adding it

### "Failed to upload image"
- Make sure the `product-images` bucket exists in Supabase Storage
- Check that the bucket is set to **Public**
- Verify your Supabase service role key has storage permissions

### "Invalid admin credentials"
- Double-check your Admin ID and Secret Key
- Make sure there are no extra spaces
- Verify the environment variables are loaded correctly

## Example Product Data

```json
{
  "id": "7",
  "name": "Galaxy Flow Hoodie",
  "description": "Experience the cosmos with this stunning galaxy-inspired design. Premium quality fabric with vibrant colors.",
  "price": 94.99,
  "category": "hoodies",
  "sizes": ["S", "M", "L", "XL", "XXL"],
  "colors": ["Black", "Navy", "Purple"],
  "stock_quantity": 35,
  "image_url": "https://example.com/galaxy-hoodie.jpg"
}
```

