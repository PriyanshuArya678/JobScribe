from fastapi import APIRouter,UploadFile,Request
from app.services.resume import process_resume
resumeRouter = APIRouter(
    prefix="/resume",  
    tags=["resume"]
)

@resumeRouter.post('/upload')
def upload_resume(request:Request,file: UploadFile):
    
    user = request.scope.get("user")  # Access the authenticated user
    user = process_resume(file, user)
    return {"filename": file.filename, "content_type": file.content_type,"user":user}