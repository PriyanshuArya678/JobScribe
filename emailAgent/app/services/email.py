from app.core.llm import llm
from app.utils.prompts import email_generation_prompt, experience_education_match_prompt, job_structuring_prompt
from app.models.jobUrl import EmailContent, ExperienceEducationMatch, JobData
from app.core.database import users_collection
from app.vector_db.resume import get_user_resumes_from_vector_db
def generate_email_service(job_posting: str,user):
    chain= job_structuring_prompt()|llm.with_structured_output(JobData)
    structured_jd=chain.invoke({"job_posting": job_posting})


    mongoUserData=users_collection.find_one(
        filter={"email": user.email},
    )
    eligibility_chain = experience_education_match_prompt() | llm.with_structured_output(ExperienceEducationMatch)

    result = eligibility_chain.invoke({
        "candidate_experience": mongoUserData.get("total_experience"),
        "candidate_education": mongoUserData.get("education"),
        "jd_experience": structured_jd.experience_level,
        "jd_education": structured_jd.education
    })

    if result.experience_match == "no" or result.education_match == "no":
        return {"message": "Candidate does not meet the job requirements."}

    mongo_skills = [skill['name'].lower() for skill in mongoUserData.get("skills", [])]
    jd_skills = [skill.name.lower() for skill in structured_jd.skills]
    matched_skills = list(set(mongo_skills) & set(jd_skills))
    matched_skills_str = ", ".join(matched_skills)
    chromaUserData=get_user_resumes_from_vector_db(user,structured_jd)
    chroma_text = "\n".join([f"- {item['type'].title()}: {item['content']}" for item in chromaUserData])

    email_chain = email_generation_prompt() | llm.with_structured_output(EmailContent)

    email_content = email_chain.invoke({
        "name": mongoUserData.get("full_name"),
        "email": mongoUserData.get("email"),
        "phone": mongoUserData.get("phone"),
        "matched_skills": matched_skills_str,  
        "chroma_data": chroma_text,
        "job_title": structured_jd.job_title,
        "company_name": structured_jd.company_name,
        "description": structured_jd.description,
        "responsibilities": structured_jd.responsibilities,
        "jd_skills": ", ".join([skill.name for skill in structured_jd.skills]),  
    })


    return email_content