# Bridemeup

Bridemeup is a premium, multi-tenant bridal beauty and luxury salon marketplace tailored for the Delhi market.

## Architecture

This project is separated into a FastAPI backend and a React/Vite frontend.

### Unified Setup (Recommended)

1. **Install Root Dependencies:**
   Navigate to the root directory (`Bridemeup`) and install the development runner (`concurrently`):
   ```bash
   npm install
   ```

2. **Run Everything Simultaneously:**
   You can start both the frontend and backend servers with a single command from the root directory:
   ```bash
   npm run dev
   ```
   *The backend will be available at `http://localhost:8000` and the frontend at `http://localhost:8080` (or `5173`).*

---

### Manual / Separate Setup

If you prefer to run them independently, follow these steps:

#### Backend
1. **Prerequisites:** Python 3.9+
2. **Installation:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
   *Note: We use `mediapipe<0.10` to maintain compatibility with the `mediapipe.solutions` face mesh API which was removed or restructured in newer versions.*
3. **Run Backend Alone:**
   ```bash
   npm run backend
   ```
   (Or manually: `cd backend && uvicorn main:app --reload`)

#### Frontend
1. **Prerequisites:** Node.js 18+
2. **Installation:**
   ```bash
   cd frontend
   npm install
   ```
   *Note: We explicitly installed `tapable` and other missing Webpack/Vite resolver dependencies to resolve startup crashes.*
3. **Run Frontend Alone:**
   ```bash
   npm run frontend
   ```
   (Or manually: `cd frontend && npm run dev`)

## Core Features

| Feature | Description | Route |
|---------|-------------|-------|
| **AI Face Shape Analysis** | Upload a photo or use webcam to detect your face shape and get personalized bridal recommendations | `/ai-analysis` |
| **AI Bridal Chatbot** | Floating chat widget for real-time bridal beauty advice, powered by Gemini | All pages |
| **Vendor Discovery** | Browse and view profiles of top salons and stylists in Delhi | `/salons`, `/stylists/:id` |
| **Planner Dashboard** | Book appointments and manage your bridal beauty timeline | `/planner` |
| **Authentication** | Secure user sign-up / sign-in with Supabase, gating premium AI features | `/auth` |

## Auth & Feature Gating

Auth is built on **Supabase** (`frontend/src/lib/AuthContext.tsx`). The following features require an authenticated user and will redirect to `/auth` if the user is not logged in:

-   **AI Face Analysis** (`/ai-analysis`)
-   **AI Chatbot** (floating widget on all pages)
-   **Planner** (`/planner`)
-   **Salon / Stylist Booking** (`/salons/:id`, `/stylists/:id`)

After successful sign-in, users are redirected back to the page they came from via the `?redirect=` query parameter.

## API Endpoints (Backend)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/analysis/face` | Accepts a multipart image upload, returns detected face shape and an initial LLM recommendation |
| `POST` | `/api/analysis/chat` | Accepts chat history + face shape, streams a Gemini-powered response |

## Fixes Applied

1. **Backend MediaPipe Error:** The error `AttributeError: module 'mediapipe' has no attribute 'solutions'` was caused by using a very recent version of `mediapipe` (0.10.x) which restructured the python bindings. We downgraded to `mediapipe<0.10` to restore the legacy `solutions` API.
2. **Frontend Tapable Error:** The error `Cannot find module 'tapable'` from `enhanced-resolve` when starting `vite` was due to a missing peer dependency in the dependency tree. We installed `tapable` explicitly to resolve this resolver crash.

## Tech Stack

-   **Frontend:** React, Vite, Tailwind CSS, Framer Motion, shadcn/ui, TanStack Router, react-webcam
-   **Backend:** FastAPI, Uvicorn, MediaPipe (face mesh), Gemini API
-   **Auth & DB:** Supabase
