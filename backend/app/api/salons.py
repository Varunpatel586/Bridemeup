from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.models.schemas import Salon
from app.core.security import get_current_user

router = APIRouter(prefix="/api/salons", tags=["salons"])

MOCK_SALONS = [
    {
        "id": "salon-1",
        "name": "Lumière Artistry",
        "address": "South Extension II, New Delhi",
        "phone": "+91 9876543210",
        "email": "contact@lumiere.in",
        "rating": 4.9,
        "reviews_count": 342,
        "images": ["https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1000"],
        "cosmetic_brands": [
            {"brand": "Chanel", "category": "Base Makeup", "image_url": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=200"},
            {"brand": "Dior", "category": "Lips", "image_url": "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=200"}
        ],
        "packages": [
            {"id": "pkg_1", "name": "Royal Delhi Bridal", "price": 25000, "services": ["Airbrush", "Hairstyling", "Draping"]},
            {"id": "pkg_2", "name": "Soft Glam Bridal", "price": 18000, "services": ["HD Makeup", "Hairstyling", "Draping"]}
        ]
    },
    {
        "id": "salon-2",
        "name": "The Velvet Room",
        "address": "Vasant Vihar, New Delhi",
        "phone": "+91 9876543211",
        "email": "booking@velvetroom.in",
        "rating": 4.8,
        "reviews_count": 215,
        "images": ["https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&q=80&w=1000"],
        "cosmetic_brands": [
            {"brand": "Charlotte Tilbury", "category": "Base Makeup", "image_url": "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&q=80&w=200"},
            {"brand": "Tom Ford", "category": "Eyes", "image_url": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=200"}
        ],
        "packages": [
            {"id": "pkg_3", "name": "Diamond Editorial Bridal", "price": 35000, "services": ["Premium Airbrush", "Extensions", "Draping", "Pre-bridal Facial"]}
        ]
    }
]

@router.get("/", response_model=List[Salon])
async def get_salons():
    """Fetch all salons with ratings & cosmetic brands"""
    return MOCK_SALONS

@router.get("/{salon_id}", response_model=Salon)
async def get_salon(salon_id: str):
    """Detailed salon view with nested packages"""
    for salon in MOCK_SALONS:
        if salon["id"] == salon_id:
            return salon
    raise HTTPException(status_code=404, detail="Salon not found")
