import os
import json
from dotenv import load_dotenv
from google import genai
from PIL import Image

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if api_key and api_key != "dummy_key_for_testing":
    client = genai.Client(api_key=api_key)
else:
    client = None
    print("Warning: GEMINI_API_KEY not set or using dummy key. Gemini service will return mock responses.")


def analyze_image(image_path: str):
    """
    Analyze an image using Gemini API for beauty analysis.
    Returns JSON string with analysis results.
    """
    if client is None:
        # Return mock response when API key is not configured
        fallback_response = {
            "skinTone": "Medium",
            "hairType": "Wavy",
            "concerns": ["Dryness"],
            "style": "Natural Elegant",
            "beautySummary": "Your skin has a lovely medium tone with wavy hair that suits elegant bridal styles.",
            "recommendedHairstyles": ["Soft Waves", "Low Bun", "Side Sweep"],
            "recommendedMakeup": ["Natural Look", "Soft Smokey Eye"],
            "recommendedTreatments": ["Hydrating Facial", "Gentle Exfoliation"]
        }
        return json.dumps(fallback_response)

    image = Image.open(image_path)

    prompt = """
    You are Aura AI, an AI-powered Wedding Readiness Assistant.

    Analyze the uploaded selfie and generate a Beauty DNA report.

    The user is preparing for a wedding and recommendations should be bridal-focused, elegant, feminine, and wedding-appropriate.

    Return ONLY valid JSON.

    Required JSON format:

    {
        "skinTone": "",
        "hairType": "",
        "concerns": [],
        "style": "",

        "beautySummary": "",

        "recommendedHairstyles": [],
        "recommendedMakeup": [],
        "recommendedTreatments": []
    }

    Rules:

    Skin Tone must be one of:
    Fair, Light, Medium, Tan, Deep

    Hair Type must be one of:
    Straight, Wavy, Curly, Coily

    Style must be one of:
    Natural Elegant
    Classic Bridal
    Modern Glam
    Minimal Chic
    Bohemian

    Concerns:
    Return 0-3 concerns only.

    Beauty Summary:
    Return one short sentence.

    Recommendations:

    recommendedHairstyles:
    Return exactly 3 bridal hairstyle recommendations suitable for weddings.
    Examples:
    Soft Waves
    Low Bun
    Textured Bun
    Side Sweep
    Hollywood Waves
    Braided Bun

    recommendedMakeup:
    Return exactly 2 makeup recommendations suitable for the skin tone and style profile.

    recommendedTreatments:
    Return exactly 2 beauty treatment recommendations suitable for the detected concerns.

    Do not include markdown.
    Do not include code blocks.
    Do not include explanations.
    Return valid JSON only.
    """

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[prompt, image]
        )

        # Debug print - can be removed in production
        print("\n===== GEMINI RESPONSE =====")
        print(response.text)
        print("===========================\n")

        return response.text

    except Exception as e:
        print("\n===== GEMINI ERROR =====")
        print(e)
        print("========================\n")

        fallback_response = {
            "skinTone": "Unknown",
            "hairType": "Unknown",
            "concerns": [],
            "style": "Unknown",
            "beautySummary": "AI analysis temporarily unavailable.",
            "recommendedHairstyles": [],
            "recommendedMakeup": [],
            "recommendedTreatments": []
        }

        return json.dumps(fallback_response)


def generate_chat_response(message: str, context: str = None):
    """
    Generate a chat response using Gemini API.
    Optional context can be provided for RAG-enhanced responses.
    """
    # Return mock response when API key is not configured
    if client is None:
        if context:
            return f"Based on the context: '{context[:100]}...', I can help you with wedding planning advice. For personalized recommendations, please configure your GEMINI_API_KEY."
        elif message:
            return f"Thanks for your message: '{message[:50]}...'. I'm Aura AI, your wedding readiness assistant. For full functionality, please configure your GEMINI_API_KEY."
        else:
            return "Hello! I'm Aura AI, your AI-powered Wedding Readiness Assistant. I can help with wedding planning, beauty advice, styling tips, and more. Please configure your GEMINI_API_KEY for full functionality."

    system_prompt = """You are Aura AI, a fabulous AI-powered Wedding Readiness bestie 💅✨

Style & Tone:
- Keep replies SHORT, snappy, and fun — no long paragraphs ever!
- Be ultra supportive, bubbly, and "girly" (think best-friend energy)
- Use casual, modern slang like "slay queen," "yasss," "iconic," "vibe," "main character energy"
- Pepper responses with girly emojis: 💅 ✨ 💖 🌸 💎 👑
- Focus ONLY on wedding, beauty, styling, and bridal topics
- If unsure about something wedding-related, keep it cute but honest — "Hmm, bestie, not totally sure on that one! 💖"

Rules:
- MAX 2-3 short sentences per reply
- No essays, no walls of text
- Always end on a positive, empowering note
- Make her feel like the main character on her big day 👑"""

    if context:
        prompt = f"{system_prompt}\n\nContext: {context}\n\nUser message: {message}\n\nResponse:"
    else:
        prompt = f"{system_prompt}\n\nUser message: {message}\n\nResponse:"

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        return response.text
    except Exception as e:
        print(f"\n===== GEMINI CHAT ERROR =====\n{e}\n========================\n")
        return "I'm temporarily unable to process your request. Please try again later."