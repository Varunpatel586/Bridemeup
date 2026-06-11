    # Bridemeup - Technical Architecture & Feature Specification

## 1. Project Overview & System Architecture
Bridemeup is a premium, multi-tenant bridal beauty and luxury salon marketplace tailored for the Delhi market. The architecture separates a highly polished, responsive React + Tailwind CSS frontend from an asynchronous, AI-capable FastAPI backend. Data storage, authentication, and user metadata are anchored via Supabase.

### Directory Structure
```text
bridemeup/
├── backend/
│   ├── app/
│   │   ├── api/          # Endpoints (auth, salons, stylists, analysis)
│   │   ├── core/         # Config, Supabase middleware security
│   │   ├── models/       # Pydantic schemas
│   │   └── services/     # AI analysis (MediaPipe), LLM pipelines
│   ├── requirements.txt
│   └── main.py
└── frontend/
    ├── src/
    │   ├── components/   # UI Layouts, Pinterest Grid, Webcam, Cards
    │   ├── pages/        # Explore, Salons, SalonDetail, StylistDetail
    │   ├── context/      # Supabase Auth context
    │   └── App.jsx# Bridemeup - Technical Architecture & Feature Specification


2. Global UI/UX Guardrails (Tailwind & Aesthetic Compliance)

    Aesthetic Identity: Strict soft minimalism. Keep the luxury editorial feel from the landing page. Use fluid typography, generous white space, light borders (border-neutral-100 or border-gold-100/20), and smooth transitions.

    Color Palette:

        Backgrounds: Pure White (bg-white) and Ultra-light Cream/Alabaster (bg-[#FAFAFA]).

        Primary Text / Accents: Deep Charcoal/Muted Black (text-[#1A1A1A]) and Luxury Warm Muted Gold (text-[#C5A880] or bg-[#C5A880]).

    Layout Rules: Replace all custom vanilla CSS files entirely with Tailwind utility classes. Maintain the transparent backdrop-blur effects (backdrop-blur-md bg-white/70) for all persistent headers or overlay banners.

3. Database Schema Design (Supabase PostgreSQL / JSONB)
salons Table

    id: UUID (Primary Key)

    name: String

    address, phone, email: String

    rating: Float | reviews_count: Integer

    images: Text[] (URLs)

    cosmetic_brands: JSONB

        Structure: [{"brand": "Chanel", "category": "Base Makeup", "image_url": "..."}]

    packages: JSONB

        Structure: [{"id": "pkg_1", "name": "Royal Delhi Bridal", "price": 25000, "services": ["Airbrush", "Hairstyling", "Draping"]}]

stylists Table

    id: UUID (Primary Key)

    salon_id: UUID (Foreign Key -> salons.id)

    name: String

    profile_image: String

    domain_ratings: JSONB

        Structure: {"Hair": 4.9, "Pedicure": 4.5, "Facials": 4.8, "DeTan": 4.7, "CleanUp": 4.9}

    portfolio_images: Text[] (URLs for Pinterest Explore feed tracking)

4. Frontend Page-by-Page Requirements
A. Pinterest-Style Explore Page (/explore)

    Layout: Masonry columns using Tailwind's layout properties (columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4).

    Cards: Clean image tiles showcasing actual bridal/stylist work. Hover states must smoothly reveal a glassmorphic overlay containing the Stylist's name, their parent Salon, and a "View Look" action button.

    Navigation: Clicking an image smoothly redirects the user to that specific stylist's detailed profile page.

B. Salons Directory & Detailed Page (/salons, /salons/:id)

    Directory Grid: Render crisp asymmetric layout cards displaying salon primary image, name, full address, aggregations of domain features, and total review scores.

    Cosmetic Brand Display: Render a elegant feature grid or minimalist table highlighting the luxury brands used by the salon alongside corresponding cosmetic product photos.

    Stylist Row: Render a horizontal scrolling rail (overflow-x-auto flex gap-6) of all stylists attached to this specific establishment.

C. Stylist Detailed Profile Page (/stylists/:id)

    Header Profile: Prominently render the stylist avatar, contact coordinates, domain-specific star rating components (Hair, Facials, etc.), and their parent salon connection.

    Unified Booking Engine: Display the salon’s package cards directly on the stylist’s page.

    Time-slot Picker: Integrating a clean date-picker alongside interactive time chips representing morning and evening booking availabilities.

D. AI Face Analysis & Recommendation Overlay/Page (/ai-analysis)

    Capture Interface: Implement an interactive camera view utilizing react-webcam with an overlay guide mask, allowing a secondary standard file upload backup.

    Processing Screen: Render a beautiful, minimal layout loading skeleton with subtle pulse animations while the picture payload processes via the FastAPI engine.

    Response View: Display the classified face geometric profile alongside an interactive, conversational chatbot interface loaded with curated packages matching the structural assessment.

5. FastAPI Backend Requirements & Security Rules
Authentication & Authorization Integration

    Extract the Supabase issued JSON Web Token (JWT) passed explicitly within incoming client headers: Authorization: Bearer <token>.

    Verify signatures asynchronously against the local environment variables configuration (SUPABASE_JWT_SECRET) utilizing Python's PyJWT implementation.

API Endpoints Needed
Plaintext

GET  /api/salons              - Fetch all salons with ratings & cosmetic brands
GET  /api/salons/{id}         - Detailed salon view with nested packages & lists of stylists
GET  /api/stylists/{id}       - Individual stylist profile, custom portfolio, and domain reviews
POST /api/analysis/face       - Processes uploaded/webcam image base64 bytes
POST /api/analysis/chat       - Handles chat requests for the AI Bridal Consultant

AI Analysis Logic (/api/analysis/face)

    Receive incoming Base64 image streams or standard multipart upload requests.

    Convert file streams directly into accessible OpenCV structures.

    Apply mediapipe.solutions.face_mesh instances to trace structural layout parameters across 468 critical coordinates.

    Programmatically isolate height-to-width aspect configurations to deduce facial shape taxonomy (Oval, Round, Heart, Square).

    Combine the mathematical evaluation metrics into an expressive structuring prompt dispatched to your chosen generative LLM client to return contextual packages and aesthetic makeup advice back down the socket stream.


***

### How to use this prompt sequence with your AI Assistant:

1. **Step 1 (Setup Backend):** Copy sections **1, 3, and 5** and say: *"Based on this specification file, initialize the backend directory. Generate `requirements.txt` containing fastapi, uvicorn, pyjwt, opencv-python-headless, mediapipe, and pydantic. Write out the FastAPI folder structure, database models, and the complete face detection router using MediaPipe."*
2. **Step 2 (Setup Frontend Views):** Copy sections **2 and 4 (A, B, C)** and say: *"Using our existing styling foundations from the landing page, implement the `/explore` Pinterest masonry layout page, the `/salons` list view, and the specialized `/stylists/:id` booking subpages. Ensure all layout CSS rules use pure Tailwind utility components."*
3. **Step 3 (Connect Webcam & Chat):** Copy section **4 (D) and 5** and say: *"Now build the