from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from app.models.user import UserCreate, User, Token
from app.services.auth import authenticate_user, create_user, create_access_token, get_user
from app.core.config import settings

apiRouter = APIRouter(
    prefix="/user",
    tags=["user"]
)

@apiRouter.post("/register", response_model=User)
def register_user(user: UserCreate):
    db_user = create_user(user)
    return User(
        id=db_user.id,
        email=db_user.email,
        full_name=db_user.full_name,
        created_at=db_user.created_at,
        updated_at=db_user.updated_at
    )

@apiRouter.post("/token", response_model=Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    # In OAuth2PasswordRequestForm, "username" field is used for email
    email = form_data.username
    print(email,form_data.password)
    user = authenticate_user(email, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    print(access_token)
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

