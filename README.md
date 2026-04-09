# Osdag Group Design — FOSSEE IIT Bombay Selection Task

[![Live Frontend Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?logo=vercel)](https://osdag-group-design-web.vercel.app/)
[![Backend API Status](https://img.shields.io/badge/API-Render-brightgreen?logo=render)](https://osdag-group-design.onrender.com/api/locations/)

This submission is in the FOSSEE IIT Bombay selection task, which is an interface design and structural validation logic of the Group Design module of the Osdag (Steel Bridge - Composite Girder) engineering interface.

## 🚀 Live Demonstration
- **Frontend UI:** [https://osdag-group-design-web.vercel.app](https://osdag-group-design-web.vercel.app)
- **Backend API:** On Render (Spin-up could require 30-50s on the initial request because of free tier sleep cycles).

## 🛠️ Technology Stack
This project follows a modern, decoupled architecture:
* **Frontend:** React, HTML5, Vanilla CSS, TypeScript, Vite
* **Backend:** Python, Django, Django REST Framework (DRF)
* **Database:** SQLite (Pre-populated with IS 875, IS 1893, and IRC 6 metrics)
* **Deployment:** Vercel (Frontend), Render (Backend)

## 📌 Features & Implementation Details

1. **Dual-Mode Geographical Data:**
   Directly draws out and cross-references wind speeds, seismic zones and temperatures based on the IS 875, IS 1893 and IRC 6:2017. This data can be automatically entered by users when selecting a State/District or can be bypassed and environmental metrics can be entered manually.

2. **Strict Engineering Validation:**
   Strong constraints on backend (`serializers.py`) implement IRC 24:2010 codes. It limits the widths of carriageways to standard values, enforces the span boundary constraints (20m -45m), and marks skew angles more than ±15°.

3. **Dynamic Girder Auto-Calculation:**
   The UI utilizes an advanced mathematical workflow to enforce the constraint: `(Overall Bridge Width - Deck Overhang) / Girder Spacing = Number of Girders`.Any changes in a field are safely computed to calculate the remaining variables without division-by-zero crashes. The logic that is impossible (e.g. negative overhangs) is blocked in advance in order to avoid crashes at the backend.

## 💻 Local Setup Instructions

Follow these steps to run the decoupled architecture locally on your machine.

### Prerequisites
* [Node.js](https://nodejs.org/en/) (v18+ recommended)
* [Python](https://www.python.org/downloads/) (v3.10+ recommended)
* Git

### 1. Clone the repository
```bash
git clone https://github.com/YourUsername/osdag-group-design.git
cd osdag-group-design
```

### 2. Backend Setup (Django)
Open a new terminal window to start the backend.
```bash
cd backend

# Create a virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations (if needed)
python manage.py migrate

# Start the Django development server
python manage.py runserver 8000
```
*The backend API will now be running at `http://127.0.0.1:8000/api/`*

### 3. Frontend Setup (React/Vite)
Open a second terminal window to start the frontend.
```bash
cd frontend

# Install Node modules
npm install

# Start the Vite development server
npm run dev
```
*The frontend user interface will now be running at `http://localhost:5173/`*

### Note on API Connection
In local development, the React frontend (`frontend/src/api/index.ts`) is currently configured to connect to the production Render URL. If you want to test calculations locally, change `BASE_URL` in `index.ts` from the render URL to `http://localhost:8000/api`.

---
*Created for the FOSSEE IIT Bombay Selection Task.*
