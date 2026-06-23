from fastapi import APIRouter, File, UploadFile, Depends, HTTPException, Body
from app.services.face_analysis import detect_face_shape, get_llm_recommendation
from app.services.gemini_service import generate_chat_response
from app.models.schemas import ChatRequest, ChatResponse
import base64

router = APIRouter(prefix="/api/analysis", tags=["analysis"])

@router.post("/face")
async def analyze_face(file: UploadFile = File(None), image_base64: str = Body(None, embed=True)):
    """
    Accepts multipart image upload or base64 string.
    Returns the classified face shape.
    """
    if file:
        image_bytes = await file.read()
    elif image_base64:
        try:
            # Handle standard "data:image/jpeg;base64,..." format
            if "," in image_base64:
                image_base64 = image_base64.split(",")[1]
            image_bytes = base64.b64decode(image_base64)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid base64 string")
    else:
        raise HTTPException(status_code=400, detail="No image provided")

    face_shape = detect_face_shape(image_bytes)
    
    if face_shape in ["No face detected", "Unknown", "Error"]:
        return {"success": False, "message": face_shape}
        
    initial_recommendation = get_llm_recommendation(face_shape, [])
        
    return {"success": True, "face_shape": face_shape, "recommendation": initial_recommendation}


@router.post("/chat", response_model=ChatResponse)
async def chat_with_stylist(request: ChatRequest):
    """
    Handles chat requests for the AI Bridal Consultant.
    """
    if not request.messages:
        return ChatResponse(response="No message provided.")
        
    last_message = request.messages[-1].content
    
    context_parts = [f"Client's face shape: {request.face_shape}"]
    for m in request.messages[:-1]:
        context_parts.append(f"{m.role.capitalize()}: {m.content}")
        
    context = "\n".join(context_parts)
    
    recommendation = generate_chat_response(last_message, context, request.user_name)
    return ChatResponse(response=recommendation)
