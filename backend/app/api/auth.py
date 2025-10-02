from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..core.deps import get_current_user
from ..schemas.auth import LoginRequest, AuthResponse
from ..schemas.user import UserCreate, User as UserSchema
from ..services.auth_service import AuthService
from ..models.user import User

router = APIRouter()

@router.post("/register", response_model=AuthResponse)
def register(
    user_create: UserCreate,
    db: Session = Depends(get_db)
):
    """Register a new user"""
    try:
        # Create user
        user = AuthService.create_user(db, user_create)
        
        # Create access token
        access_token = AuthService.create_access_token_for_user(user)
        
        return AuthResponse(
            access_token=access_token,
            token_type="bearer",
            user={
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "is_active": user.is_active
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed"
        )

@router.post("/login", response_model=AuthResponse)
def login(
    login_request: LoginRequest,
    db: Session = Depends(get_db)
):
    """Login user"""
    try:
        # Authenticate user
        user = AuthService.authenticate_user(
            db, login_request.email, login_request.password
        )
        
        # Create access token
        access_token = AuthService.create_access_token_for_user(user)
        
        return AuthResponse(
            access_token=access_token,
            token_type="bearer",
            user={
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "is_active": user.is_active
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed"
        )

@router.get("/me", response_model=UserSchema)
def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    """Get current user information"""
    return current_user

@router.post("/logout")
def logout():
    """Logout user (client should discard token)"""
    return {"message": "Successfully logged out"}