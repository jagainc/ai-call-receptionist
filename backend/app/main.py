from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .core.database import engine
from .models import user  # Import models to create tables
from .api import auth, users

# Create database tables
user.Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title=settings.project_name,
    version="1.0.0",
    description="AI Call Receptionist Backend API",
    debug=settings.debug
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix=f"{settings.api_v1_str}/auth", tags=["authentication"])
app.include_router(users.router, prefix=f"{settings.api_v1_str}/users", tags=["users"])

@app.get("/")
def read_root():
    return {
        "message": "AI Call Receptionist API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug
    )