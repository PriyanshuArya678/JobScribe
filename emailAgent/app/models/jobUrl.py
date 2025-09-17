from typing import List, Optional
from pydantic import BaseModel
from enum import Enum
from pydantic import BaseModel

class Skill(BaseModel):
    name: str

class JobData(BaseModel):
    job_title: str
    company_name: str
    description: str
    responsibilities: Optional[List[str]] = None
    skills: List[Skill]
    experience_level: str
    location: Optional[str] = None
    education: Optional[str] = None



class MatchEnum(str, Enum):
    YES = "yes"
    NO = "no"

class ExperienceEducationMatch(BaseModel):
    experience_match: MatchEnum
    education_match: MatchEnum


class EmailContent(BaseModel):
    subject: str
    greeting: str
    para1: str
    para2: str
    sign_off: str