from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    # Database
    database_url: str = "sqlite:///./ai_call_receptionist.db"
    
    # Security
    secret_key: str = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # Environment
    environment: str = "development"
    debug: bool = True
    
    # CORS
    allowed_origins: str = "http://localhost:3000,http://localhost:8081,http://192.168.0.101:8081,exp://192.168.0.101:8081,http://192.168.0.101:3000"
    
    # API
    api_v1_str: str = "/api/v1"
    project_name: str = "AI Call Receptionist API"
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()