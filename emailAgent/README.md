# Email Agent with User Authentication

This application provides an email generation service with user authentication and authorization using MongoDB.

## Features

- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- MongoDB for user data storage
- Two authentication approaches:
  1. Dependency-based authentication (per-route)
  2. Middleware-based authentication (global)

## Setup

1. Install dependencies:
   ```bash
   pip install -e .
   ```

2. Set up your environment variables in `.env`:
   ```env
   GROQ_API_KEY=your_groq_api_key
   MONGODB_URL=your_mongodb_connection_string
   SECRET_KEY=your_secret_key
   ```

## Database Connection

MongoDB connection is now centralized in `app/core/database.py` for better organization and reusability.

## Authentication

### Approach 1: Dependency-based (Route-specific)

For protecting individual routes, use the dependency approach:

```python
from fastapi import APIRouter, Depends
from app.core.middleware import get_current_active_user
from app.models.user import User

protectedRouter = APIRouter(
    prefix="/protected",
    tags=["protected"]
)

@protectedRouter.get("/profile")
def get_user_profile(current_user: User = Depends(get_current_active_user)):
    return {"email": current_user.email, "full_name": current_user.full_name}
```

Note: In the login endpoint (`/user/token`), we use OAuth2PasswordRequestForm which has a "username" field, but we actually use it for the email address. This is a common practice in FastAPI applications that use email for authentication.

### Approach 2: Middleware-based (Global)

The application also includes a global authentication middleware that protects all routes by default, except for explicitly excluded paths like registration and login.

The middleware is configured in `main.py`:

```python
app.add_middleware(
    AuthMiddleware,
    exclude_paths=[
        "/user/register",
        "/user/token",
        "/docs",
        "/redoc",
        "/openapi.json"
    ]
)
```

With this middleware, all routes require a valid JWT token in the Authorization header, except for the excluded paths.

## API Endpoints

- `POST /user/register` - Register a new user
- `POST /user/token` - Login and get access token
- `POST /email/generate-email` - Generate an email (protected by middleware)

## Usage

1. Register a user:
   ```bash
   curl -X POST "http://localhost:8000/user/register" \
        -H "Content-Type: application/json" \
        -d '{"email": "user@example.com", "password": "password123", "full_name": "John Doe"}'
   ```

2. Login to get a token:
   ```bash
   curl -X POST "http://localhost:8000/user/token" \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -d "username=user@example.com&password=password123"
   ```

3. Access protected routes using the token:
  ```bash
  curl -X POST "http://localhost:8000/email/generate-email?url=https://example.com" \
       -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
  ```

4. When the access token expires (after 30 minutes by default), users need to log in again to get a new token.