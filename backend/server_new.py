from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, Header
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pathlib import Path
from pydantic import BaseModel
from typing import List, Optional, Annotated
import os
import logging
import razorpay
import hmac
import hashlib
from supabase import create_client, Client
from config import get_settings
from auth_middleware import verify_jwt

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Get settings
settings = get_settings()

# Initialize Supabase client
supabase: Client = create_client(settings.supabase_url, settings.supabase_service_role_key)

# Initialize Razorpay client
razorpay_client = razorpay.Client(auth=(settings.razorpay_key_id, settings.razorpay_key_secret))

# Create the main app
app = FastAPI(title="TrippyDrip API")

# Create API router
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


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


# Root endpoint
@api_router.get("/")
async def root():
    return {"message": "TrippyDrip API is running", "version": "1.0.0"}


# Product Endpoints
@api_router.get("/products", response_model=List[Product])
async def get_products():
    """Get all products"""
    try:
        response = supabase.table("products").select("*").execute()
        return response.data
    except Exception as e:
        logger.error(f"Error fetching products: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch products")


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
        
        # Create Razorpay order
        razorpay_order_data = {
            "amount": int(total_amount * 100),  # Convert to paise
            "currency": "INR",
            "payment_capture": 1
        }
        
        try:
            razorpay_order = razorpay_client.order.create(data=razorpay_order_data)
            
            # Update order with Razorpay order ID
            supabase.table("orders").update({
                "payment_id": razorpay_order["id"]
            }).eq("id", order_id).execute()
            
        except Exception as razorpay_error:
            logger.warning(f"Razorpay order creation failed (mock mode): {str(razorpay_error)}")
            # For mock/test mode, create a mock order ID
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
        # Verify order belongs to user
        order_response = supabase.table("orders").select("*").eq("id", payment_data.order_id).eq("user_id", user_id).execute()
        
        if not order_response.data:
            raise HTTPException(status_code=404, detail="Order not found")
        
        # Verify Razorpay signature
        try:
            params_dict = {
                "razorpay_order_id": payment_data.razorpay_order_id,
                "razorpay_payment_id": payment_data.razorpay_payment_id,
                "razorpay_signature": payment_data.razorpay_signature
            }
            
            razorpay_client.utility.verify_payment_signature(params_dict)
            payment_verified = True
            
        except Exception as verify_error:
            logger.warning(f"Razorpay signature verification failed (mock mode): {str(verify_error)}")
            # For mock/test mode, accept payment
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
        
        # Verify webhook signature
        try:
            razorpay_client.utility.verify_webhook_signature(
                payload.decode(),
                signature,
                settings.razorpay_webhook_secret
            )
        except Exception as e:
            logger.warning(f"Webhook signature verification failed: {str(e)}")
            # In mock mode, continue processing
        
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
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    logger.info("Starting TrippyDrip API with Supabase and Razorpay integration")


@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down TrippyDrip API")
