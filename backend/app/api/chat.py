from fastapi import APIRouter
from pydantic import BaseModel

from app.ai.gemini_service import chat_with_gemini

router = APIRouter()


from typing import List, Dict

class ChatRequest(BaseModel):
    message: str
    history: List[Dict] = []


@router.post("/chat")
async def chat(req: ChatRequest):

    response = chat_with_gemini(
    req.message,
    req.history
)

    return {
        "response": response
    }