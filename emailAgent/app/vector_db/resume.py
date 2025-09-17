from app.core.chroma_db import collection
from uuid import uuid4
from langchain_core.documents import Document

def add_resume_to_vector_db(resume_data,user):
    documents = []

    user_id = user.id

    # Projects
    for proj in resume_data.get("projects", []):
        text = f"{proj['title']}: {proj['description']}"
        documents.append(Document(page_content=text,metadata={"user_id": user_id, "type": "project"}))
        

    # Work Experience
    for work in resume_data.get("work_experience", []):
        text = f"{work['role']} at {work['company']} ({work['duration']}): {work['description']}"
        documents.append(Document(page_content=text,metadata={"user_id": user_id, "type": "work_experience"}))


    # Achievements
    for ach in resume_data.get("achievements", []):
        documents.append(Document(page_content=ach,metadata={"user_id": user_id, "type": "achievement"}))

    # Certifications
    for cert in resume_data.get("certifications", []):
        documents.append(Document(page_content=cert,metadata={"user_id": user_id, "type": "certification"}))

    ids = [str(uuid4()) for _ in documents]
    if not documents:
        print("No documents to add to vector DB. Skipping embedding.")
        return
    
    result =collection.delete(where={"user_id": user_id})
    
    
    result=collection.add_documents(
        documents=documents,
        ids=ids
    )
    return result

def get_user_resumes_from_vector_db(user,structured_jd):
    user_id = user.id
    job_context = f"{structured_jd.job_title} at {structured_jd.company_name}. {structured_jd.description}."
    n_results = 5
    allowed_types = ["project", "work_experience", "achievement", "certification"]
    # Responsibilities & skills
    responsibilities_text = f"Responsibilities: {', '.join(structured_jd.responsibilities or [])}."
    skills_text = f"Required skills: {', '.join(skill.name for skill in structured_jd.skills)}."
    resp_results = collection.similarity_search_with_score(
        responsibilities_text,
        k=n_results,
        filter={"user_id": user_id},
        

    )

    # Semantic search for skills
    skills_results = collection.similarity_search_with_score(
        skills_text,
        k=n_results,
        filter={"user_id": user_id}
    )
    combined = resp_results + skills_results
    combined = [item for item in combined if item[0].metadata.get("type") in allowed_types]

    # Remove duplicates by Document.id, keep highest score for duplicates
    seen = {}
    for doc, score in combined:
        doc_id = doc.id
        if doc_id not in seen :  
            seen[doc_id] = (doc, score)

    # Get all unique results and sort by score ascending (best match first)
    unique_sorted = sorted(seen.values(), key=lambda x: x[1])

    # Return top n_results
    # return type and page_content
    return [{"type": doc.metadata.get("type"), "content": doc.page_content} for doc, score in unique_sorted[:n_results]]


