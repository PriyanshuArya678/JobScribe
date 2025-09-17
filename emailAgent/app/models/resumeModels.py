from pydantic import BaseModel
from typing import Optional, List, Dict

class Project(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None

class WorkExperience(BaseModel):
    company: Optional[str] = None
    role: Optional[str] = None
    duration: Optional[str] = None
    description: Optional[str] = None

class Education(BaseModel):
    degree: Optional[str] = None
    institution: Optional[str] = None
    duration: Optional[str] = None
    details: Optional[str] = None

class Skill(BaseModel):
    name:str

class ResumeSchema(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    skills: List[Skill] = []
    projects: List[Project] = []
    work_experience: List[WorkExperience] = []
    education: List[Education] = []
    certifications: List[str] = []
    achievements: List[str] = []
    total_experience: Optional[str] = None  
