from sqlite3 import Date
from app.utils.extract_text_pdf import extract_text_from_pdf
from app.utils.prompts import resume_categorization_prompt
from app.core.llm import llm
from app.models.resumeModels import ResumeSchema
from app.core.chroma_db import collection
from app.models.user import User
from app.core.database import users_collection
from app.vector_db.resume import add_resume_to_vector_db

def process_resume(file,user):
    extracted_text = extract_text_from_pdf(file.file)
    chain= resume_categorization_prompt()|llm.with_structured_output(ResumeSchema)
    structured_resume=chain.invoke({"resume_text": extracted_text,"current_date": Date.today().strftime("%B %d, %Y")})
    print(structured_resume)
    resume_dict=structured_resume.model_dump()
    update_fields = {
        "total_experience": resume_dict.get("total_experience"),
        "education": resume_dict.get("education"),
        "phone": resume_dict.get("phone"),
        "skills":resume_dict.get("skills"),
    }

    # Update user document in MongoDB
    users_collection.update_one(
        {"email": user.email},
        {"$set": update_fields}
    )
    return add_resume_to_vector_db(resume_dict, user)
    return resume_dict
    
    
    