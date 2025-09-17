from fastapi import APIRouter
from .email import emailRouter
from .user import apiRouter as userRouter
from .resume import resumeRouter
router = APIRouter()

router.include_router(emailRouter)
router.include_router(userRouter)
router.include_router(resumeRouter)