from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..core.deps import get_current_user
from ..schemas.user import User as UserSchema, UserUpdate
from ..services.user_service import UserService
from ..models.user import User

router = APIRouter()

@router.get("/profile", response_model=UserSchema)
def get_user_profile(
    current_user: User = Depends(get_current_user)
):
    """Get user profile"""
    return current_user

@router.put("/profile", response_model=UserSchema)
def update_user_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user profile"""
    return UserService.update_user(db, current_user, user_update)