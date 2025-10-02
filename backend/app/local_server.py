"""
Local HTTP server for AI Call Receptionist.
This server runs only on localhost (127.0.0.1) to avoid IP exposure while providing
a simple interface for React Native to communicate with the local SQLite database.
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any
import uvicorn
from .local_service import local_auth_service

# Pydantic models for request/response
class UserRegistration(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone_number: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    profile_picture_path: Optional[str] = None

class SessionToken(BaseModel):
    session_token: str

# Create FastAPI app
app = FastAPI(
    title="AI Call Receptionist Local Service",
    version="1.0.0",
    description="Local-first authentication and data service",
    docs_url="/docs",  # Available at http://localhost:8001/docs
)

# Add CORS middleware - only allow localhost
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8081",  # Expo dev server
        "http://127.0.0.1:8081",
        "http://localhost:19006", # Expo web
        "http://127.0.0.1:19006",
        "exp://localhost:8081",   # Expo app
        "exp://127.0.0.1:8081",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "message": "AI Call Receptionist Local Service",
        "version": "1.0.0",
        "status": "running",
        "note": "This service runs locally only for security"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "local"}

@app.post("/auth/register")
def register_user(user_data: UserRegistration):
    """Register a new user."""
    result = local_auth_service.register_user(
        email=user_data.email,
        password=user_data.password,
        full_name=user_data.full_name,
        phone_number=user_data.phone_number
    )
    
    if not result['success']:
        raise HTTPException(status_code=400, detail=result['error'])
    
    return {
        "message": "User registered successfully",
        "user": result['user']
    }

@app.post("/auth/login")
def login_user(login_data: UserLogin):
    """Authenticate user and create session."""
    result = local_auth_service.login_user(
        email=login_data.email,
        password=login_data.password
    )
    
    if not result['success']:
        raise HTTPException(status_code=401, detail=result['error'])
    
    return {
        "message": "Login successful",
        "session_token": result['session_token'],
        "user": result['user']
    }

@app.post("/auth/logout")
def logout_user(session_data: SessionToken):
    """Logout user by removing session."""
    result = local_auth_service.logout_user(session_data.session_token)
    
    if not result['success']:
        raise HTTPException(status_code=400, detail=result['error'])
    
    return {"message": result['message']}

@app.get("/auth/me")
def get_current_user(session_token: str):
    """Get current user information by session token."""
    result = local_auth_service.get_user_by_session(session_token)
    
    if not result['success']:
        raise HTTPException(status_code=401, detail=result['error'])
    
    return result['user']

@app.put("/users/profile")
def update_profile(profile_data: ProfileUpdate, session_token: str):
    """Update user profile."""
    updates = profile_data.dict(exclude_unset=True)
    result = local_auth_service.update_user_profile(session_token, updates)
    
    if not result['success']:
        raise HTTPException(status_code=400, detail=result['error'])
    
    return {
        "message": "Profile updated successfully",
        "user": result['user']
    }

def run_local_server():
    """Run the local server on localhost only."""
    print("🔐 Starting AI Call Receptionist Local Service...")
    print("📍 Server will run on: http://localhost:8001")
    print("📚 API Documentation: http://localhost:8001/docs")
    print("⚠️  This server only accepts connections from localhost for security")
    
    uvicorn.run(
        "app.local_server:app",
        host="127.0.0.1",  # Only localhost - no external access
        port=8001,          # Different port from main API
        reload=True,
        log_level="info"
    )

if __name__ == "__main__":
    run_local_server()