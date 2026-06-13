import os
import urllib.request   
# pyrefly: ignore [missing-import]
import cv2
# pyrefly: ignore [missing-import]
import numpy as np
import base64
# pyrefly: ignore [missing-import]
import mediapipe as mp
# pyrefly: ignore [missing-import]
from mediapipe.tasks import python
# pyrefly: ignore [missing-import]
from mediapipe.tasks.python import vision
# pyrefly: ignore [missing-import]
from google import genai

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'face_landmarker.task')

def download_model():
    if not os.path.exists(MODEL_PATH):
        print("Downloading face_landmarker.task...")
        url = "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task"
        try:
            urllib.request.urlretrieve(url, MODEL_PATH)
        except Exception as e:
            print(f"Failed to download model: {e}")

def detect_face_shape(image_bytes: bytes) -> str:
    """
    Process image bytes with MediaPipe Face Landmarker to determine face shape.
    Classifies face shape category (Oval, Round, Heart, Square) based on geometric dimensions.
    """
    try:
        download_model()
        if not os.path.exists(MODEL_PATH):
             return "Model not found"

        # Convert bytes to numpy array then to opencv image
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            return "Unknown"

        # Convert the BGR image to RGB before processing.
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=img_rgb)
        
        base_options = python.BaseOptions(model_asset_path=MODEL_PATH)
        options = vision.FaceLandmarkerOptions(
            base_options=base_options,
            num_faces=1
        )
        
        with vision.FaceLandmarker.create_from_options(options) as landmarker:
            result = landmarker.detect(mp_image)
            
            if not result.face_landmarks:
                return "No face detected"
                
            landmarks = result.face_landmarks[0]
            
            # Simple heuristic for face shape using basic landmarks
            # Top: 10, Bottom: 152, Left edge: 234, Right edge: 454
            top = landmarks[10]
            bottom = landmarks[152]
            left = landmarks[234]
            right = landmarks[454]
            
            face_height = np.linalg.norm(np.array([top.x, top.y]) - np.array([bottom.x, bottom.y]))
            face_width = np.linalg.norm(np.array([left.x, left.y]) - np.array([right.x, right.y]))
            
            aspect_ratio = face_height / face_width
            
            if aspect_ratio > 1.5:
                return "Oval"
            elif aspect_ratio > 1.3:
                return "Heart"
            elif aspect_ratio < 1.2:
                return "Round"
            else:
                return "Square"
                
    except Exception as e:
        print(f"Error processing image: {e}")
        return "Error"

def get_llm_recommendation(face_shape: str, user_messages: list) -> str:
    """
    Use Google GenAI SDK to generate bridal makeup and styling recommendations.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return f"Mocked LLM Response for {face_shape} face shape. I recommend a soft contouring and an elegant updo to complement your features."

    try:
        client = genai.Client(api_key=api_key)
        
        system_prompt = f"""
        You are an expert luxury bridal makeup artist and stylist based in Delhi.
        The client has a {face_shape} face shape.
        Provide contextual, high-end bridal styling summaries and package suggestions.
        Keep the tone elegant, soft-minimalist, and premium.
        """
        
        prompt = system_prompt + "\n\nUser Messages:\n" + "\n".join([f"{m.role}: {m.content}" for m in user_messages])
        
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )
        return response.text
    except Exception as e:
         print(f"LLM Error: {e}")
         return f"Based on your {face_shape} face, we recommend a soft focus makeup look with a high bun to accentuate your cheekbones."
