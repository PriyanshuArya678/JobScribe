from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
from jose import JWTError, jwt
from app.core.config import settings
from app.core.database import users_collection
from app.models.user import UserInDB
import re

class AuthMiddleware:
    def __init__(self, app, exclude_paths=None):
        self.app = app
        self.exclude_paths = exclude_paths or []
        
    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return
            
        request = Request(scope, receive)
        
        # Allow OPTIONS requests for CORS preflight
        if request.method == "OPTIONS":
            await self.app(scope, receive, send)
            return
            
        # Check if path should be excluded from authentication
        path = request.url.path
        for pattern in self.exclude_paths:
            if re.match(pattern, path):
                await self.app(scope, receive, send)
                return
                
        # Extract token from Authorization header
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            response = JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"detail": "Authorization header missing or invalid"}
            )
            await response(scope, receive, send)
            return
            
        token = auth_header.split("Bearer ")[1]
        
        # Validate token and get user
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            email: str = payload.get("sub")
            if email is None:
                response = JSONResponse(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    content={"detail": "Could not validate credentials"}
                )
                await response(scope, receive, send)
                return
                
            # Get user from database
            user_data = users_collection.find_one({"email": email})
            if user_data is None:
                response = JSONResponse(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    content={"detail": "User not found"}
                )
                await response(scope, receive, send)
                return
                
            # Convert MongoDB's _id to id for Pydantic model
            user_data["id"] = str(user_data["_id"])
            del user_data["_id"]
            user = UserInDB(**user_data)
            
            # Add user to request state
            scope["user"] = user
            
        except JWTError:
            response = JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"detail": "Could not validate credentials"}
            )
            await response(scope, receive, send)
            return
            
        await self.app(scope, receive, send)