from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import analysis, salons, stylists, chat

app = FastAPI(title="Bridemeup API", description="Luxury Bridal Beauty Marketplace API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for development, restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(salons.router)
app.include_router(stylists.router)
app.include_router(analysis.router)
app.include_router(chat.router)
@app.get("/")
async def root():
    return {"message": "Welcome to Bridemeup API"}
