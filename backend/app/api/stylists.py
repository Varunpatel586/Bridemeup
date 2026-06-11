from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.models.schemas import Stylist
from app.core.security import get_current_user

router = APIRouter(prefix="/api/stylists", tags=["stylists"])

MOCK_STYLISTS = [
    {
        "id": "stylist-1",
        "salon_id": "salon-1",
        "name": "Anya Sharma",
        "profile_image": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=500",
        "domain_ratings": {"Hair": 4.9, "Pedicure": 4.5, "Facials": 4.8, "DeTan": 4.7, "CleanUp": 4.9},
        "portfolio_images": [
            "https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?auto=format&fit=crop&q=80&w=500",
            "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=80&w=500",
            "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=500"
        ]
    },
    {
        "id": "stylist-2",
        "salon_id": "salon-1",
        "name": "Kabir Singh",
        "profile_image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=500",
        "domain_ratings": {"Hair": 5.0, "Pedicure": 4.2, "Facials": 4.5, "DeTan": 4.1, "CleanUp": 4.6},
        "portfolio_images": [
            "https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&q=80&w=500"
        ]
    },
    {
        "id": "stylist-3",
        "salon_id": "salon-2",
        "name": "Meera Kapoor",
        "profile_image": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=500",
        "domain_ratings": {"Hair": 4.8, "Pedicure": 4.9, "Facials": 5.0, "DeTan": 4.8, "CleanUp": 4.9},
        "portfolio_images": [
            "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=500",
            "https://images.unsplash.com/photo-1526413232644-8a40f41ce931?auto=format&fit=crop&q=80&w=500"
        ]
    }
]

@router.get("/", response_model=List[Stylist])
async def get_all_stylists():
    """Fetch all stylists (mostly for explore page mocking)"""
    return MOCK_STYLISTS

@router.get("/{stylist_id}", response_model=Stylist)
async def get_stylist(stylist_id: str):
    """Individual stylist profile, custom portfolio, and domain reviews"""
    for stylist in MOCK_STYLISTS:
        if stylist["id"] == stylist_id:
            return stylist
    raise HTTPException(status_code=404, detail="Stylist not found")

@router.get("/salon/{salon_id}", response_model=List[Stylist])
async def get_stylists_by_salon(salon_id: str):
    """Get all stylists attached to a specific establishment"""
    return [s for s in MOCK_STYLISTS if s["salon_id"] == salon_id]
