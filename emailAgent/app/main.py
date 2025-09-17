from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from  app.routes.main import router
from app.core.middleware import AuthMiddleware
import uvicorn

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5175"],  # Your frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
    expose_headers=["*"],  # Expose all headers
)

# Add authentication middleware
# Exclude paths that don't require authentication (like registration and login)
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

app.include_router(router)

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))  # Render injects PORT automatically
    uvicorn.run("main:app", host="0.0.0.0", port=8000)
