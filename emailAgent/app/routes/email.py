from fastapi import APIRouter,Request
from app.utils.scraper import fetch_page_content
from app.services.email import generate_email_service
emailRouter = APIRouter(
    prefix="/email",
    tags=["email"]
)

@emailRouter.post('/generate-email')
def generate_email(request:Request,url: str):
    user = request.scope.get("user")  
    content = fetch_page_content(url)
    email=generate_email_service(content,user)
    return {"message": "Email generated successfully", "email": email}