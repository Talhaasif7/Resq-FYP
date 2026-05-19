# ResQ — Pakistan's Real-Time Safety & Crisis Alert Platform

ResQ is a professional, bilingual (English / Urdu), AI-augmented crisis intelligence platform designed for Pakistan. It aggregates live disaster signals, lets citizens and verified volunteers report incidents, surfaces AI-verified trust scores, broadcasts voice alerts, and routes people to safety in real time.

This project is structured as a monorepo with a dedicated **FastAPI Backend** and a **React/Vite Frontend**.

---

## 🏗️ Project Architecture

```text
Resq/
├── Backend/               # FastAPI Server
│   ├── app/               # Core application logic
│   │   ├── api/           # API Endpoints (Auth, etc.)
│   │   ├── core/          # Config, Mail service, Security
│   │   ├── db/            # Supabase client initialization
│   │   └── models/        # Pydantic schemas
│   ├── .env               # Backend environment variables
│   └── requirements.txt   # Python dependencies
├── Frontend/              # React/Vite Application
│   ├── src/               # Component architecture
│   ├── .env               # Frontend environment variables
│   └── package.json       # Node dependencies
└── README.md              # Project documentation
```

---

## 🚀 Getting Started

### 1. Backend Setup (FastAPI)
The backend handles authentication via Supabase Admin API and dispatches custom verification emails.

```bash
cd Backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
# Run the server
uvicorn app.main:app --reload --app-dir Backend
```

**Environment Variables (`Backend/.env`):**
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`
- `EMAIL_FROM`

### 2. Frontend Setup (React + Vite)
The frontend provides a premium, animated dashboard for crisis monitoring.

```bash
cd Frontend
npm install
npm run dev
```

**Environment Variables (`Frontend/.env`):**
- `VITE_API_URL=http://localhost:8000`

---

## ✨ Key Features

### 🔐 Professional Authentication
- **Supabase Admin API**: Bypasses standard email rate limits by using the Admin SDK for user creation.
- **Custom Verification**: Manual generation of signup links dispatched via a custom SMTP service with a premium, branded email template.
- **Secure Sessions**: Integrated with `AuthContext` on the frontend for persistent, secure user states.

### 📊 Intelligence Dashboard
- **Live Crisis Feed**: Real-time AI-verified alerts for floods, earthquakes, and security incidents.
- **AI Trust Scoring**: Visualized trust gauges for every report to filter noise from genuine crises.
- **Interactive Safety Map**: GIS-powered maps showing shelters, danger zones, and evacuation routes.
- **Multilingual Support**: Fully translated in English and Urdu, including voice alerts.

### 📧 Premium Email System
- **Modern Design**: Branded emails with CSS gradients, "Inter" typography, and responsive layouts.
- **Verification Flow**: Secure link-based email verification before account activation.

---

## 🎨 Design System

- **Aesthetic**: Apple-style glassmorphism + premium aurora gradients.
- **Primary Palette**: Emerald (`--primary`) + Safety Amber (`--safety`) + Alert Red (`--alert`).
- **Animations**: Fluid, GPU-accelerated motion using `framer-motion`.
- **Bilingual**: RTL support for Urdu and standard LTR for English.

---

## 🛠️ Tech Stack

### Frontend
- React 18, Vite 5, TypeScript
- Tailwind CSS (Semantic Design Tokens)
- Framer Motion (Animations)
- Lucide React (Icons)
- Shadcn/UI (Component Primitives)

### Backend
- FastAPI (High-performance Python framework)
- Supabase (Auth & Database)
- FastAPI-Mail (Custom SMTP delivery)
- Pydantic Settings (Type-safe configuration)

---

## 📜 Application Routes

| Path | Component | Protection |
|------|-----------|------------|
| `/` | `Landing` | Public |
| `/signin` | `SignIn` | Public |
| `/signup` | `SignUp` | Public (with verification flow) |
| `/dashboard` | `Dashboard` | Auth required |
| `/profile` | `Profile` | Auth required |
| `/shelters` | `Shelters` | Public |
| `/qa` | `QA` | Public |

---

© 2026 ResQ Platform. All rights reserved.
