from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

from app.models.resumeModels import Education

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    phone: Optional[str] = None
    total_experience: Optional[str] = None
    education: List[Education] = []

class UserCreate(UserBase):
    password: str

class UserInDB(UserBase):
    id: str
    hashed_password: str
    created_at: datetime
    updated_at: Optional[datetime] = None


class User(UserBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None