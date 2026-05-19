import sys
import os
from pathlib import Path

# Add the parent directory (Backend) to sys.path to allow absolute imports
# This enables running from the project root without ModuleNotFoundError
current_dir = Path(__file__).resolve().parent
if str(current_dir.parent) not in sys.path:
    sys.path.append(str(current_dir.parent))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, verify

app = FastAPI(title="Resq Backend API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(verify.router)

@app.on_event("startup")
async def startup_event():
    # Pre-load verification models in the background to avoid latency on first request
    from app.services.verification import verification_engine
    import asyncio
    
    # We don't want to block startup, so we use a thread or just let it lazy load
    # but calling _load_models here starts the download/loading process
    try:
        # Using loop.run_in_executor to avoid blocking the event loop during model load
        loop = asyncio.get_event_loop()
        loop.run_in_executor(None, verification_engine._load_models)
        print("Verification models loading initiated in background...")
    except Exception as e:
        print(f"Failed to initiate model loading: {e}")

@app.get("/")
async def root():
    return {"message": "Welcome to Resq Backend API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
# App main reload trigger V2
