import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

# Get the directory where .env is located
# We resolve the physical path to handle junctions/symlinks correctly
PHYSICAL_APP_DIR = Path(__file__).resolve().parent.parent
BASE_DIR = PHYSICAL_APP_DIR.parent # This is the 'Backend' folder

class Settings(BaseSettings):
    SUPABASE_URL: str
    SUPABASE_ANON_KEY: str
    SUPABASE_SERVICE_ROLE_KEY: Optional[str] = None
    DATABASE_URL: str
    FRONTEND_URL: str = "http://localhost:8080"
    
    # SMTP Settings
    SMTP_HOST: str
    SMTP_PORT: int
    SMTP_MAIL: str
    SMTP_PASSWORD: str
    SMTP_SERVICE: Optional[str] = "gmail"

    model_config = SettingsConfigDict(
        env_file=str(BASE_DIR / ".env"),
        extra="ignore"
    )

settings = Settings()
