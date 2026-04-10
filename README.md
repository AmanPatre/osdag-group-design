# Osdag Group Design — FOSSEE IIT Bombay Screening Task

[![Live Frontend](https://img.shields.io/badge/Live%20Demo-Vercel-black?logo=vercel)](https://osdag-group-design-web.vercel.app/)
[![Backend API](https://img.shields.io/badge/API-Render-brightgreen?logo=render)](https://osdag-group-design.onrender.com/api/locations/)
[![Stack](https://img.shields.io/badge/Stack-React%20%2B%20Django-blue?logo=react)](https://github.com/AmanPatre/osdag-group-design)

---

> **Submission by:** Aman Patre  
> **Task:** FOSSEE IIT Bombay — Osdag Bridge Module Web UI  
> **Module:** Group Design — Steel Bridge (Composite Girder) as per IRC 24:2010

---

## 🌐 Live Links

| Service | URL | Notes |
|---|---|---|
| **Frontend (React)** | [osdag-group-design-web.vercel.app](https://osdag-group-design-web.vercel.app) | Deployed on Vercel |
| **Backend API (Django)** | [osdag-group-design.onrender.com/api](https://osdag-group-design.onrender.com/api/locations/) | Deployed on Render (free tier — may take 30–50s to wake up on first request) |

---

## 📸 Screenshots

**Full Application Dashboard**
![Full Application Dashboard](https://github.com/user-attachments/assets/eb1c56d1-0599-4162-a26f-525fab6b6f27)

**Location Database — Green Auto-filled Values (Extra Credit ⭐)**
![Location database showing green wind, seismic and temperature values](https://github.com/user-attachments/assets/12fb2d42-21da-4ffb-ad4a-8034ea4ec169)

**Geometry Constraint Modal**
![Modify Additional Geometry pop-up with auto-calculated values](https://github.com/user-attachments/assets/0e796bf8-f9d0-4afd-a0cb-7e47e86080a8
)

**Live Validation Errors**
![Input validation error messages for span and carriageway width](https://github.com/user-attachments/assets/34291de1-a493-4366-a9b4-6f31c06fc237
)
**Live Design Summary Panel**
![Real-time design summary table showing all 12 engineering parameters](https://github.com/user-attachments/assets/f9e0742a-f552-4ffd-a107-14a90c3a7853)

**Responsive Mobile View**

![Application stacked layout on a mobile screen](https://github.com/user-attachments/assets/64593c69-01a5-426a-ac26-d0e5db0c6501
)

---

## ⭐ Extra Credit: Location Database (+20%)

> I implemented the **full location database** as described under **Option A** of the screening task.

Instead of hardcoding values for only 5 cities, I built a complete database populated from the official engineering tables provided (IS 875, IS 1893, and IRC 6:2017). Here is what was implemented:

- **SQLite Database** pre-populated with hundreds of Indian states and districts.
- Each station entry stores:
  - **Basic Wind Speed** (m/s) — from IS 875 Part 3
  - **Seismic Zone & Zone Factor** — from IS 1893
  - **Max/Min Shade Air Temperature (°C)** — from IRC 6:2017
- When a user selects their **State → District** from the dropdowns, the backend API instantly returns the corresponding values.
- These auto-filled values are **displayed in green** in the Project Location section, clearly distinguishing them from user-entered data.
- Two dedicated REST API endpoints (`/api/locations/` and `/api/location-data/`) serve this data to the frontend.

This was fully implemented in Django using proper relational models (`State`, `Station`, `SeismicZone`) — not a simple lookup table or hardcoded dictionary.

![Selecting Maharashtra → Mumbai shows green wind speed, seismic zone and temperature values automatically](assets/screenshot-location-database.png)

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Features & Implementation](#features--implementation)
4. [API Reference](#api-reference)
5. [Local Setup Guide](#local-setup-guide)
6. [Project Structure](#project-structure)
7. [Methodology](#methodology)
8. [Challenges Faced](#challenges-faced)
9. [References](#references)

---

## Project Overview

This project is a full-stack web application for the **Group Design** module of Osdag — an open-source structural engineering software developed by FOSSEE, IIT Bombay. The module is specifically designed for steel composite girder highway bridges following **IRC 24:2010** standards.

The interface allows an engineer to:
- Select the project location and automatically retrieve environmental data from a real database.
- Enter geometric and material inputs with live validation against IRC/IS code limits.
- Interactively solve the girder geometry constraint equation in a pop-up dialog.
- See a live-updating Design Summary alongside the bridge cross-section reference image.

---

## Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | React 18 + TypeScript | Component-based UI |
| **Frontend Build Tool** | Vite | Fast development server & bundling |
| **Styling** | Vanilla CSS with Design Tokens | Custom professional design system |
| **Backend Framework** | Python 3.11 + Django 5 | API server & data management |
| **REST API** | Django REST Framework (DRF) | Serialization, validation, endpoints |
| **Database** | SQLite 3 | Pre-populated engineering data |
| **CORS** | django-cors-headers | Cross-origin frontend-backend communication |
| **Frontend Deployment** | Vercel | Continuous deployment from GitHub |
| **Backend Deployment** | Render | Cloud hosting for the Django API |

---

## Features & Implementation

### 1. `Type of Structure` Selection
- A clean radio button group allows selecting **Highway** or **Other**.
- If **Other** is selected, a context-aware message is displayed: *"Other structures not included."* and all remaining input sections are instantly disabled — preventing any accidental data entry.

### 2. `Project Location` — Dual Mode (with Full Database Integration ⭐)
This section has two mutually exclusive modes:

**Mode 1: Enter Location Name (Database-Driven)**
- State → District cascading dropdowns populated from the backend database.
- Selecting a district triggers an API call to `/api/location-data/`.
- The following values are **automatically fetched and displayed in green**:
  - Basic Wind Speed (m/s)
  - Seismic Zone & Zone Factor
  - Max/Min Shade Air Temperature (°C)

**Mode 2: Tabulate Custom Loading Parameters (Manual Entry)**
- A spreadsheet-style pop-up dialog allows engineers to manually enter all environmental parameters.
- Selecting this mode disables the dropdown and vice versa, ensuring mutual exclusivity.

### 3. `Geometric Details` — Live Validation
Every field validates in real-time as the user types, with human-readable messages:

| Field | Rule | Error Message |
|---|---|---|
| Span (m) | Between 20 m and 45 m | "Span must be between 20m and 45m." |
| Carriageway Width (m) | ≥ 4.25 m and < 24 m | "Width must be between 4.25m and 24m." |
| Skew Angle (°) | Within ±15° | "Values outside -15° to 15° require detailed analysis." |

Validation hits both the **frontend** (instant feedback on keystrokes) and the **backend** (`/api/validate-geometry/` endpoint), giving engineering-grade double verification.

### 4. `Modify Additional Geometry` — Interactive Pop-up Dialog
This is the most technically complex part of the implementation. The dialog enforces the following engineering constraint:

```
Overall Bridge Width = Carriageway Width + 5 m
(Overall Bridge Width - Deck Overhang) / Girder Spacing = No. of Girders
```

- **Any field can be the "known" value** — change one and the other two auto-update instantly.
- The recalculation happens live on every keystroke using frontend math, confirmed by the `/api/calculate-girder/` backend endpoint on Apply.
- Clear, specific error messages are shown for impossible configurations (e.g., negative deck overhang, zero-division).

### 5. `Material Inputs`
Dropdown selectors for:
- **Girder Steel:** E250, E350, E450
- **Cross Bracing Steel:** E250, E350, E450
- **Deck Concrete:** M25, M30, M35, M40, M45, M50, M55, M60

### 6. `Live Design Summary` Panel
The right-hand panel shows a real-time summary of all 12 design parameters across two side-by-side tables (Geometry & Materials). This updates instantly — no button click required.

### 7. Responsive Design
The application is fully responsive across all screen sizes:
- **Desktop (>1000px):** Classic split-screen dashboard with independent panel scrolling.
- **Tablet (768–1000px):** Header labels adapt with centered branding.
- **Mobile (<768px):** Panels stack vertically with dual-zone independent scrolling (Input top zone / Summary bottom zone).

---

## API Reference

All endpoints are served under the base path `/api/`.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/locations/` | Returns the full State → District tree from the database |
| `GET` | `/api/location-data/?state=X&district=Y` | Returns wind, seismic & temperature data for a location |
| `POST` | `/api/validate-geometry/` | Validates span, carriageway width & skew angle against IRC codes |
| `POST` | `/api/calculate-girder/` | Solves the bridge geometry constraint equation (3-field interdependency) |
| `POST` | `/api/design/` | Accepts a full design payload and returns a structured validation report |

---

## Local Setup Guide

Make sure you have **Node.js 18+** and **Python 3.10+** installed.

### Step 1: Clone the Repository
```bash
git clone https://github.com/AmanPatre/osdag-group-design.git
cd osdag-group-design
```

### Step 2: Backend (Django)
Open a terminal in the `backend/` directory.

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv

# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Run the development server
python manage.py runserver 8000
```

The API will be available at: `http://127.0.0.1:8000/api/`

### Step 3: Frontend (React/Vite)
Open a **second** terminal in the `frontend/` directory.

```bash
cd frontend

# Install Node packages
npm install

# Start the development server
npm run dev
```

The UI will be available at: `http://localhost:5173/`

### Step 4: Connect Frontend to Local Backend (Optional)
By default, the frontend is configured to safely fall back to the production API on Render, so it works completely out-of-the-box with zero configuration required!

To point the frontend to the local Django server you started in Step 2:
1. Locate the `.env.example` file in the `frontend/` directory.
2. Rename it to `.env`.
3. Uncomment the provided local URL variable so it looks like this:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```
4. Restart your React development server (`npm run dev`).

---

## Project Structure

```
osdag-group-design/
├── .gitignore                 # Root ignore file
├── README.md
├── backend/
│   ├── .env.example           # Django environment template
│   ├── design/
│   │   ├── tests/             # Django testing sub-module
│   │   │   └── test_views.py
│   │   ├── models.py          # State, Station, SeismicZone models
│   │   ├── serializers.py     # DRF serializers with IRC validation rules
│   │   ├── views.py           # All API endpoints
│   │   └── urls.py            # URL routing
│   ├── db.sqlite3             # Pre-populated engineering database
│   ├── requirements.txt
│   └── manage.py
│
└── frontend/
    ├── .env.example           # Vite environment template
    ├── package.json
    ├── vite.config.ts
    └── src/
        ├── __tests__/         # Vite/React testing structure
        │   └── App.test.tsx
        ├── components/
        │   ├── ui/            # Reusable form primitives
        │   └── [Feature Components...]
        ├── styles/
        │   └── app.css        # Main layout, tokens, responsive rules
        ├── api/
        │   └── index.ts       # Typed API client
        ├── types/
        │   └── index.ts       # Shared TypeScript interfaces
        └── App.tsx            # Root component + Dynamic Summary panel
```

---

## Methodology

I approached this task by first thoroughly understanding the IRC 24:2010 code requirements before writing a single line of code. The development was structured in three phases:

1. **Backend First:** Designed the database schema and implemented all REST endpoints. This ensured the data layer was solid before building the UI on top of it. The location database was ingested from the provided engineering tables and normalized into proper relational models.

2. **Component-Driven Frontend:** Built the React UI as composable, single-responsibility components (one per section: Structure, Location, Geometry, Material). Each component manages its own local state and communicates upward via `onChange` callbacks to the root `App.tsx`.

3. **Polish & Validation Layer:** Added real-time field validation, the interactive geometry modal, and the live design summary panel as the final layer. The responsive design and accessibility refinements came last.

---

## Challenges Faced

- **Interdependent Geometry Fields:** Solving the 3-variable bridge geometry constraint (where any one field's change must update the other two without causing infinite loops or division-by-zero errors) required careful state management logic and dedicated backend validation.

- **Render.com Cold Starts:** The free tier of Render spins down after inactivity. The first API request after idle can take 30–50 seconds. This was handled gracefully with loading skeletons on the frontend.

- **Database Population:** Ingesting hundreds of rows from the provided engineering PDFs/tables into a clean, relational SQLite structure was time-consuming but essential to delivering the full extra credit implementation.

- **Mutual Exclusivity for Location Modes:** Ensuring that the "Enter Location Name" and "Tabulate Custom Parameters" modes were truly mutually exclusive — and that switching between them cleanly reset state — required careful event handling logic.

---

## Dependencies

**Backend (`requirements.txt`)**
```
django==5.2.13
djangorestframework==3.17.1
django-cors-headers==4.9.0
gunicorn==21.2.0
```

**Frontend (`package.json` key deps)**
```
react ^18
typescript ^5
vite ^6
```

---

## References

- [IRC 24:2010 — Standard Specifications for Road Bridges (Steel Road Bridges)](https://www.irc.org.in/)
- [IS 875 Part 3 — Wind Loads on Buildings and Structures](https://www.bis.gov.in/)
- [IS 1893 — Criteria for Earthquake Resistant Design of Structures](https://www.bis.gov.in/)
- [IRC 6:2017 — Standard Specifications for Road Bridges (Loads & Stresses)](https://www.irc.org.in/)
- [Django REST Framework Documentation](https://www.django-rest-framework.org/)
- [React + Vite Official Documentation](https://vitejs.dev/guide/)
- [Osdag Official Repository](https://github.com/osdag-admin/Osdag)

---

