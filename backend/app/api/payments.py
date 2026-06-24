import os
import razorpay
from fastapi import APIRouter, HTTPException
from app.models.schemas import PaymentOrderRequest, PaymentOrderResponse

router = APIRouter(prefix="/payments", tags=["payments"])

@router.post("/create-order", response_model=PaymentOrderResponse)
async def create_order(request: PaymentOrderRequest):
    try:
        # Get keys from environment at runtime so it handles changes better
        razorpay_key_id = os.environ.get("RAZORPAY_KEY_ID", "rzp_test_dummykey12345")
        razorpay_key_secret = os.environ.get("RAZORPAY_KEY_SECRET", "dummysecret1234567890")

        client = razorpay.Client(auth=(razorpay_key_id, razorpay_key_secret))

        # Amount needs to be in paise
        amount_paise = request.amount * 100
        
        data = {
            "amount": amount_paise,
            "currency": "INR",
            "receipt": "receipt#1",
            "notes": {
                "package": request.package_name
            }
        }
        
        payment = client.order.create(data=data)
        
        return PaymentOrderResponse(
            order_id=payment["id"],
            amount=payment["amount"],
            currency=payment["currency"],
            key=razorpay_key_id
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
