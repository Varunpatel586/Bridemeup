# pyrefly: ignore [missing-import]
from pydantic import BaseModel, Field
from typing import List, Dict, Optional

class CosmeticBrand(BaseModel):
    brand: str
    category: str
    image_url: str

class Package(BaseModel):
    id: str
    name: str
    price: int
    services: List[str]

class Salon(BaseModel):
    id: str
    name: str
    address: str
    phone: str
    email: str
    rating: float
    reviews_count: int
    images: List[str]
    cosmetic_brands: List[CosmeticBrand]
    packages: List[Package]

class DomainRatings(BaseModel):
    Hair: float
    Pedicure: float
    Facials: float
    DeTan: float
    CleanUp: float

class Stylist(BaseModel):
    id: str
    salon_id: str
    name: str
    profile_image: str
    domain_ratings: DomainRatings
    portfolio_images: List[str]

# API Schemas

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    face_shape: str
    messages: List[ChatMessage]
    user_name: Optional[str] = None

class ChatResponse(BaseModel):
    response: str

class PaymentOrderRequest(BaseModel):
    package_name: str
    amount: int

class PaymentOrderResponse(BaseModel):
    order_id: str
    amount: int
    currency: str
    key: str
