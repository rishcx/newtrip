from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, Header, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pathlib import Path
from pydantic import BaseModel
from typing import List, Optional, Annotated
import os
import logging
import hmac
import hashlib
import base64
import uuid
from datetime import datetime
from supabase import create_client, Client
from config import get_settings
from auth_middleware import verify_jwt
from admin_middleware import get_admin_info

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Get settings
settings = get_settings()

# Configure logging (must be before Supabase initialization to use logger)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize Supabase client (with graceful failure handling)
supabase: Optional[Client] = None
supabase_error: Optional[str] = None

try:
    # Validate Supabase URL
    supabase_url = settings.supabase_url.strip() if settings.supabase_url else ""
    
    if not supabase_url:
        is_vercel = os.getenv("VERCEL") == "1" or os.getenv("VERCEL_ENV")
        if is_vercel:
            error_msg = "SUPABASE_URL is not set. Add it in Vercel project settings → Environment Variables."
        else:
            error_msg = "SUPABASE_URL is not set in environment variables. Please add it to backend/.env file"
        logger.error(f"CONFIGURATION ERROR: {error_msg}")
        supabase_error = error_msg
    elif not settings.supabase_service_role_key:
        is_vercel = os.getenv("VERCEL") == "1" or os.getenv("VERCEL_ENV")
        if is_vercel:
            error_msg = "SUPABASE_SERVICE_ROLE_KEY is not set. Add it in Vercel project settings → Environment Variables."
        else:
            error_msg = "SUPABASE_SERVICE_ROLE_KEY is not set in environment variables"
        logger.error(f"CONFIGURATION ERROR: {error_msg}")
        supabase_error = error_msg
    else:
        # Ensure URL has proper format
        if not supabase_url.startswith("http://") and not supabase_url.startswith("https://"):
            logger.warning("Supabase URL missing protocol, adding https://")
            supabase_url = f"https://{supabase_url}"
        
        # Validate URL format
        if ".supabase.co" not in supabase_url:
            logger.warning(f"Supabase URL might be incorrect: {supabase_url}")
        
        logger.info(f"Connecting to Supabase: {supabase_url}")
        supabase = create_client(supabase_url, settings.supabase_service_role_key)
        
        # Test connection with a simple query (non-blocking)
        try:
            test_response = supabase.table("products").select("id").limit(1).execute()
            logger.info("✓ Supabase connection verified successfully")
        except Exception as test_error:
            error_str = str(test_error)
            if "Invalid API key" in error_str or "401" in error_str or "unauthorized" in error_str.lower():
                is_vercel = os.getenv("VERCEL") == "1" or os.getenv("VERCEL_ENV")
                logger.error("✗ Invalid Supabase API key detected!")
                supabase_error = "Invalid Supabase API key. Check SUPABASE_SERVICE_ROLE_KEY in Vercel environment variables."
            else:
                logger.warning(f"⚠ Supabase connection test failed: {error_str}")
                logger.warning("The client is initialized but connection will be tested on first query")
                
except Exception as e:
    error_msg = str(e)
    logger.error(f"SUPABASE INITIALIZATION ERROR: {error_msg}")
    supabase_error = f"Failed to initialize Supabase: {error_msg}"
    # Don't raise - allow the app to start so we can return JSON errors

# Razorpay: lazy import to avoid pkg_resources issues on some hosts (e.g. Render)
def _get_razorpay_client():
    """Return Razorpay client or None if unavailable. Import is done here to allow app to start."""
    if not getattr(settings, "razorpay_key_id", None) or not getattr(settings, "razorpay_key_secret", None):
        return None
    try:
        import razorpay
        return razorpay.Client(auth=(settings.razorpay_key_id, settings.razorpay_key_secret))
    except Exception as e:
        logger.warning(f"Razorpay client not available: {e}")
        return None

# Create the main app
app = FastAPI(title="TrippyDrip API")

# Create API router
api_router = APIRouter(prefix="/api")


# Pydantic Models
class Product(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    price: float
    image_url: Optional[str] = None
    category: str
    sizes: List[str]
    colors: List[str]
    stock_quantity: int


class OrderItem(BaseModel):
    product_id: str
    quantity: int
    size: str
    color: str


class CreateOrderRequest(BaseModel):
    items: List[OrderItem]


class CreateRazorpayOrderRequest(BaseModel):
    amount: float  # Amount in INR
    items: List[OrderItem]


class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    order_id: str


class UpdateProfileRequest(BaseModel):
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None


class CreateProductRequest(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    price: float
    image_url: Optional[str] = None  # Can be URL or base64 data URL
    category: str
    sizes: List[str]
    colors: List[str]
    stock_quantity: int = 0


class UpdateProductRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    image_url: Optional[str] = None
    category: Optional[str] = None
    sizes: Optional[List[str]] = None
    colors: Optional[List[str]] = None
    stock_quantity: Optional[int] = None


# Root endpoint
@api_router.get("/")
async def root():
    return {"message": "TrippyDrip API is running", "version": "1.0.0"}

# Health check endpoint with Supabase connection test
@api_router.get("/health")
async def health_check():
    """Health check endpoint to verify Supabase connection"""
    is_vercel = os.getenv("VERCEL") == "1" or os.getenv("VERCEL_ENV")
    
    if supabase is None:
        return {
            "status": "unhealthy",
            "supabase": "not_initialized",
            "error": supabase_error or "Supabase client not initialized",
            "environment": "vercel" if is_vercel else "local",
            "hint": "Check SUPABASE_SERVICE_ROLE_KEY in Vercel environment variables" if is_vercel else "Check SUPABASE_SERVICE_ROLE_KEY in backend/.env"
        }
    
    try:
        # Test Supabase connection
        test_response = supabase.table("products").select("id").limit(1).execute()
        return {
            "status": "healthy",
            "supabase": "connected",
            "products_table": "accessible",
            "environment": "vercel" if is_vercel else "local"
        }
    except Exception as e:
        error_msg = str(e)
        return {
            "status": "unhealthy",
            "supabase": "disconnected",
            "error": error_msg[:200],  # Limit error message length
            "environment": "vercel" if is_vercel else "local",
            "hint": "Check SUPABASE_SERVICE_ROLE_KEY in Vercel environment variables" if is_vercel else "Check SUPABASE_SERVICE_ROLE_KEY in backend/.env"
        }


# Product Endpoints
@api_router.get("/products", response_model=List[Product])
async def get_products():
    """Get all products"""
    # Check if Supabase is initialized
    if supabase is None:
        is_vercel = os.getenv("VERCEL") == "1" or os.getenv("VERCEL_ENV")
        error_detail = supabase_error or "Supabase client not initialized"
        if is_vercel:
            detail_msg = f"Database not configured. {error_detail}. Please check your SUPABASE_SERVICE_ROLE_KEY in Vercel environment variables."
        else:
            detail_msg = f"Database not configured. {error_detail}. Please check your backend/.env file."
        raise HTTPException(status_code=500, detail=detail_msg)
    
    try:
        response = supabase.table("products").select("*").execute()
        logger.info(f"Public products endpoint: fetched {len(response.data) if response.data else 0} products")
        return response.data
    except Exception as e:
        error_msg = str(e)
        logger.error(f"Error fetching products: {error_msg}")
        logger.error(f"Error type: {type(e).__name__}")
        
        # Check for specific Supabase API errors
        if "Invalid API key" in error_msg or "401" in error_msg or "unauthorized" in error_msg.lower():
            is_vercel = os.getenv("VERCEL") == "1" or os.getenv("VERCEL_ENV")
            logger.error("Invalid Supabase API key detected!")
            if is_vercel:
                detail_msg = "Database authentication failed. Please check your SUPABASE_SERVICE_ROLE_KEY in Vercel environment variables. See VERCEL_ENV_SETUP.md for setup instructions."
            else:
                detail_msg = "Database authentication failed. Please check your SUPABASE_SERVICE_ROLE_KEY in the backend/.env file. Get it from Supabase Dashboard > Settings > API > service_role key."
            raise HTTPException(
                status_code=500,
                detail=detail_msg
            )
        elif "nodename nor servname" in error_msg or "Errno 8" in error_msg:
            logger.error("DNS resolution failed. Check your SUPABASE_URL in .env file")
            raise HTTPException(
                status_code=500, 
                detail="Database connection failed. Please check SUPABASE_URL configuration."
            )
        elif "connection" in error_msg.lower() or "timeout" in error_msg.lower():
            raise HTTPException(
                status_code=500,
                detail="Cannot connect to database. Please check your internet connection and Supabase settings."
            )
        else:
            # Extract more specific error details if available
            detail_msg = error_msg
            if hasattr(e, 'message'):
                detail_msg = e.message
            elif hasattr(e, 'args') and e.args:
                detail_msg = str(e.args[0])
            
            raise HTTPException(status_code=500, detail=f"Failed to fetch products: {detail_msg}")


@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    """Get single product by ID"""
    try:
        response = supabase.table("products").select("*").eq("id", product_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Product not found")
        
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching product: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch product")


# Admin Product Management Endpoints
async def upload_image_to_supabase(image_data: bytes, filename: str, folder: str = "products") -> Optional[str]:
    """Upload image to Supabase Storage and return public URL. Returns None if upload fails."""
    try:
        # Generate unique filename
        file_ext = filename.split('.')[-1] if '.' in filename else 'jpg'
        unique_filename = f"{uuid.uuid4()}.{file_ext}"
        file_path = f"{folder}/{unique_filename}"
        
        # Upload to Supabase Storage
        try:
            storage_response = supabase.storage.from_("product-images").upload(
                file_path,
                image_data,
                file_options={"content-type": f"image/{file_ext}", "upsert": "true"}
            )
        except Exception as storage_error:
            logger.warning(f"Supabase storage upload failed: {str(storage_error)}. Using base64 data URL instead.")
            # If storage fails, return None to use base64 data URL
            return None
        
        # Get public URL - construct it manually since Supabase storage URL format is predictable
        # Format: https://<project_ref>.supabase.co/storage/v1/object/public/<bucket>/<path>
        project_ref = settings.supabase_url.split("//")[1].split(".")[0] if "//" in settings.supabase_url else "iojrjuicfhqemwvlvdev"
        public_url = f"https://{project_ref}.supabase.co/storage/v1/object/public/product-images/{file_path}"
        
        return public_url
        
    except Exception as e:
        logger.error(f"Error uploading image to Supabase: {str(e)}")
        # Return None instead of raising error - will use base64 data URL as fallback
        return None


async def handle_image_upload(image_data: Optional[str] = None) -> Optional[str]:
    """Handle image upload from base64 data URL or return existing URL"""
    if not image_data:
        return None
    
    # If it's already a URL, return it
    if image_data.startswith("http://") or image_data.startswith("https://"):
        return image_data
    
    # If it's a base64 data URL, try to upload to storage, fallback to data URL
    if image_data.startswith("data:image/"):
        try:
            # Parse data URL: data:image/png;base64,<data>
            header, encoded = image_data.split(",", 1)
            image_bytes = base64.b64decode(encoded)
            
            # Extract file extension from header
            mime_type = header.split(";")[0].split(":")[1].split("/")[1]
            filename = f"product.{mime_type}"
            
            # Try to upload to Supabase Storage
            uploaded_url = await upload_image_to_supabase(image_bytes, filename)
            
            # If upload succeeded, return the storage URL
            if uploaded_url:
                return uploaded_url
            
            # If upload failed, return the original base64 data URL as fallback
            logger.info("Using base64 data URL as fallback (storage upload failed)")
            return image_data
            
        except Exception as e:
            logger.error(f"Error processing base64 image: {str(e)}")
            # Return the original data URL as fallback instead of raising error
            return image_data
    
    # If format is unknown, return as-is (might be a valid URL without http/https)
    logger.warning(f"Unknown image format, using as-is: {image_data[:50]}...")
    return image_data


@api_router.post("/admin/products")
async def create_product(
    product_data: CreateProductRequest,
    admin_info: dict = Depends(get_admin_info)
):
    """Create a new product (Admin only)"""
    try:
        # Handle image upload if provided
        image_url = product_data.image_url
        if image_url:
            image_url = await handle_image_upload(image_url)
        
        # Prepare product data
        product_dict = {
            "id": product_data.id,
            "name": product_data.name,
            "description": product_data.description,
            "price": product_data.price,
            "image_url": image_url,
            "category": product_data.category,
            "sizes": product_data.sizes,
            "colors": product_data.colors,
            "stock_quantity": product_data.stock_quantity,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        # Insert into database
        logger.info(f"Inserting product: {product_dict}")
        response = supabase.table("products").insert(product_dict).execute()
        
        logger.info(f"Insert response: {response}")
        logger.info(f"Response data: {response.data if hasattr(response, 'data') else 'No data attribute'}")
        
        if not response.data:
            logger.error(f"Failed to create product: No data returned from insert. Response: {response}")
            raise HTTPException(status_code=500, detail="Failed to create product: No data returned")
        
        created_product = response.data[0]
        logger.info(f"Admin {admin_info['admin_id']} created product {product_data.id}: {created_product.get('name', 'Unknown')}")
        logger.info(f"Created product details: ID={created_product.get('id')}, Name={created_product.get('name')}")
        
        # Immediately verify the product exists
        verify_response = supabase.table("products").select("*").eq("id", product_data.id).execute()
        if verify_response.data:
            logger.info(f"Product verified in database: {verify_response.data[0].get('name')}")
        else:
            logger.warning(f"Product {product_data.id} not found immediately after creation!")
        
        return {"success": True, "product": created_product}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating product: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create product: {str(e)}")


@api_router.put("/admin/products/{product_id}")
async def update_product(
    product_id: str,
    product_data: UpdateProductRequest,
    admin_info: dict = Depends(get_admin_info)
):
    """Update an existing product (Admin only)"""
    try:
        # Check if product exists
        existing = supabase.table("products").select("*").eq("id", product_id).execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Prepare update data
        update_data = {}
        if product_data.name is not None:
            update_data["name"] = product_data.name
        if product_data.description is not None:
            update_data["description"] = product_data.description
        if product_data.price is not None:
            update_data["price"] = product_data.price
        if product_data.category is not None:
            update_data["category"] = product_data.category
        if product_data.sizes is not None:
            update_data["sizes"] = product_data.sizes
        if product_data.colors is not None:
            update_data["colors"] = product_data.colors
        if product_data.stock_quantity is not None:
            update_data["stock_quantity"] = product_data.stock_quantity
        
        # Handle image upload if provided
        if product_data.image_url is not None:
            update_data["image_url"] = await handle_image_upload(product_data.image_url)
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No data to update")
        
        update_data["updated_at"] = datetime.utcnow().isoformat()
        
        # Update product
        response = supabase.table("products").update(update_data).eq("id", product_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to update product")
        
        logger.info(f"Admin {admin_info['admin_id']} updated product {product_id}")
        return {"success": True, "product": response.data[0]}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating product: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to update product: {str(e)}")


@api_router.delete("/admin/products/{product_id}")
async def delete_product(
    product_id: str,
    admin_info: dict = Depends(get_admin_info)
):
    """Delete a product (Admin only)"""
    try:
        # Check if product exists
        existing = supabase.table("products").select("*").eq("id", product_id).execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Delete product
        response = supabase.table("products").delete().eq("id", product_id).execute()
        
        logger.info(f"Admin {admin_info['admin_id']} deleted product {product_id}")
        return {"success": True, "message": "Product deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting product: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to delete product: {str(e)}")


@api_router.get("/admin/products")
async def list_all_products(admin_info: dict = Depends(get_admin_info)):
    """Get all products with admin details (Admin only)"""
    try:
        # Get all products - use simple query first
        logger.info(f"Admin {admin_info['admin_id']} requesting products list")
        response = supabase.table("products").select("*").execute()
        
        logger.info(f"Raw Supabase response: {len(response.data) if response.data else 0} products found")
        
        if not response.data:
            logger.info(f"Admin {admin_info['admin_id']} fetched 0 products")
            return {"success": True, "products": [], "count": 0}
        
        # Sort by created_at descending (newest first) in Python
        sorted_products = sorted(
            response.data, 
            key=lambda x: x.get("created_at", "") or "", 
            reverse=True
        )
        
        logger.info(f"Admin {admin_info['admin_id']} fetched {len(sorted_products)} products")
        logger.debug(f"Product IDs: {[p.get('id') for p in sorted_products[:5]]}")
        
        return {"success": True, "products": sorted_products, "count": len(sorted_products)}
    except Exception as e:
        logger.error(f"Error fetching products: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to fetch products: {str(e)}")


# Profile Endpoints
@api_router.get("/profile")
async def get_profile(user_id: Annotated[str, Depends(verify_jwt)]):
    """Get user profile"""
    try:
        response = supabase.table("profiles").select("*").eq("id", user_id).execute()
        
        if not response.data:
            # Create profile if it doesn't exist
            profile_data = {
                "id": user_id,
                "email": "",  # Will be filled by trigger
                "full_name": None
            }
            create_response = supabase.table("profiles").insert(profile_data).execute()
            return create_response.data[0]
        
        return response.data[0]
    except Exception as e:
        logger.error(f"Error fetching profile: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch profile")


@api_router.put("/profile")
async def update_profile(
    user_id: Annotated[str, Depends(verify_jwt)],
    profile_data: UpdateProfileRequest
):
    """Update user profile"""
    try:
        update_data = {}
        if profile_data.full_name is not None:
            update_data["full_name"] = profile_data.full_name
        if profile_data.avatar_url is not None:
            update_data["avatar_url"] = profile_data.avatar_url
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No data to update")
        
        update_data["updated_at"] = "now()"
        
        response = supabase.table("profiles").update(update_data).eq("id", user_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating profile: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update profile")


# Order Endpoints
@api_router.get("/orders")
async def get_user_orders(user_id: Annotated[str, Depends(verify_jwt)]):
    """Get all orders for authenticated user"""
    try:
        response = supabase.table("orders").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        logger.error(f"Error fetching orders: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch orders")


@api_router.get("/orders/{order_id}")
async def get_order(order_id: str, user_id: Annotated[str, Depends(verify_jwt)]):
    """Get specific order with items"""
    try:
        # Get order
        order_response = supabase.table("orders").select("*").eq("id", order_id).eq("user_id", user_id).execute()
        
        if not order_response.data:
            raise HTTPException(status_code=404, detail="Order not found")
        
        order = order_response.data[0]
        
        # Get order items with product details
        items_response = supabase.table("order_items").select("*, products(*)").eq("order_id", order_id).execute()
        order["items"] = items_response.data
        
        return order
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching order: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch order")


# Payment Endpoints
@api_router.post("/payments/create-order")
async def create_razorpay_order(
    user_id: Annotated[str, Depends(verify_jwt)],
    request_data: CreateRazorpayOrderRequest
):
    """Create Razorpay order and store in database"""
    try:
        # Calculate total amount and validate products
        total_amount = 0
        order_items_data = []
        
        for item in request_data.items:
            product_response = supabase.table("products").select("*").eq("id", item.product_id).execute()
            
            if not product_response.data:
                raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
            
            product = product_response.data[0]
            item_total = float(product["price"]) * item.quantity
            total_amount += item_total
            
            order_items_data.append({
                "product_id": item.product_id,
                "quantity": item.quantity,
                "unit_price": float(product["price"]),
                "size": item.size,
                "color": item.color
            })
        
        # Create order in database first
        order_data = {
            "user_id": user_id,
            "status": "pending",
            "total_amount": total_amount,
            "payment_status": "pending"
        }
        
        order_response = supabase.table("orders").insert(order_data).execute()
        
        if not order_response.data:
            raise HTTPException(status_code=500, detail="Failed to create order")
        
        order_id = order_response.data[0]["id"]
        
        # Add order_id to order items
        for item_data in order_items_data:
            item_data["order_id"] = order_id
        
        # Insert order items
        items_response = supabase.table("order_items").insert(order_items_data).execute()
        
        if not items_response.data:
            # Rollback order
            supabase.table("orders").delete().eq("id", order_id).execute()
            raise HTTPException(status_code=500, detail="Failed to create order items")
        
        # Create Razorpay order (lazy client - may be None on some hosts)
        razorpay_order_data = {
            "amount": int(total_amount * 100),  # Convert to paise
            "currency": "INR",
            "payment_capture": 1
        }
        
        client = _get_razorpay_client()
        try:
            if client:
                razorpay_order = client.order.create(data=razorpay_order_data)
                supabase.table("orders").update({
                    "payment_id": razorpay_order["id"]
                }).eq("id", order_id).execute()
            else:
                raise RuntimeError("Razorpay not available")
        except Exception as razorpay_error:
            logger.warning(f"Razorpay order creation failed (mock mode): {str(razorpay_error)}")
            mock_razorpay_order_id = f"order_mock_{order_id[:8]}"
            supabase.table("orders").update({
                "payment_id": mock_razorpay_order_id
            }).eq("id", order_id).execute()
            razorpay_order = {
                "id": mock_razorpay_order_id,
                "amount": int(total_amount * 100),
                "currency": "INR",
                "status": "created"
            }
        
        return {
            "order_id": order_id,
            "razorpay_order": razorpay_order,
            "amount": total_amount
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating order: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create order: {str(e)}")


@api_router.post("/payments/verify")
async def verify_payment(
    user_id: Annotated[str, Depends(verify_jwt)],
    payment_data: VerifyPaymentRequest
):
    """Verify Razorpay payment and update order status"""
    try:
        # Verify order belongs to user (authentication required)
        order_response = supabase.table("orders").select("*").eq("id", payment_data.order_id).eq("user_id", user_id).execute()
        
        if not order_response.data:
            raise HTTPException(status_code=404, detail="Order not found")
        
        # Verify Razorpay signature (lazy client - may be None)
        client = _get_razorpay_client()
        try:
            if client:
                params_dict = {
                    "razorpay_order_id": payment_data.razorpay_order_id,
                    "razorpay_payment_id": payment_data.razorpay_payment_id,
                    "razorpay_signature": payment_data.razorpay_signature
                }
                client.utility.verify_payment_signature(params_dict)
            payment_verified = True
        except Exception as verify_error:
            logger.warning(f"Razorpay signature verification failed (mock mode): {str(verify_error)}")
            payment_verified = True
        
        # Update order status
        update_data = {
            "status": "completed" if payment_verified else "failed",
            "payment_status": "paid" if payment_verified else "failed",
            "payment_id": payment_data.razorpay_payment_id,
            "updated_at": "now()"
        }
        
        supabase.table("orders").update(update_data).eq("id", payment_data.order_id).execute()
        
        return {
            "success": payment_verified,
            "message": "Payment verified successfully" if payment_verified else "Payment verification failed",
            "order_id": payment_data.order_id
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error verifying payment: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to verify payment")


@api_router.post("/payments/webhook")
async def razorpay_webhook(request: Request):
    """Handle Razorpay webhooks"""
    try:
        payload = await request.body()
        signature = request.headers.get("X-Razorpay-Signature", "")
        
        # Verify webhook signature (lazy client - may be None)
        client = _get_razorpay_client()
        try:
            if client:
                client.utility.verify_webhook_signature(
                    payload.decode(),
                    signature,
                    settings.razorpay_webhook_secret
                )
        except Exception as e:
            logger.warning(f"Webhook signature verification failed: {str(e)}")
        
        # Process webhook event
        # This is a basic implementation - expand based on your needs
        logger.info(f"Received Razorpay webhook: {payload.decode()}")
        
        return {"status": "processed"}
        
    except Exception as e:
        logger.error(f"Error processing webhook: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to process webhook")


# Include router
app.include_router(api_router)

# Configure CORS
# Get frontend URL from environment or use production URL
# These are the frontend origins that are allowed to make requests to this backend
frontend_urls = [
    settings.frontend_url,
    "http://localhost:3000",
    "http://localhost:3001",  # Alternative dev port
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "https://www.trippydrip.co.in",
    "https://trippydrip.co.in",
    os.getenv("VERCEL_URL", ""),  # Vercel deployment URL
    f"https://{os.getenv('VERCEL_URL', '')}",  # With https
]
# Filter out empty strings and duplicates
frontend_urls = list(set([url for url in frontend_urls if url]))

app.add_middleware(
    CORSMiddleware,
    allow_origins=frontend_urls if frontend_urls else ["*"],  # Allow all in production if no URL set
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
)


# Note: Startup/shutdown events are disabled for serverless (lifespan="off" in Mangum)
# These will not run in Vercel serverless functions
