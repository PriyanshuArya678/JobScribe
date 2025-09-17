from langchain.prompts import ChatPromptTemplate
from textwrap import dedent


def resume_categorization_prompt() -> ChatPromptTemplate:
    return ChatPromptTemplate.from_messages([
        ("user", """
            You are an expert resume parser. 
            Your task is to extract structured, meaningful information from a candidate's resume. 
            The output should be a JSON object with the following fields:

            {{
              "name": "Full name of candidate or null if not available",
              "email": "Email address or null if not available",
              "phone": "Phone number or null if not available",
              "skills": ["List of technical skills relevant in 2025-2026, ignore trivial or outdated skills like basic HTML/CSS unless advanced"],
              "projects": [
                {{
                  "title": "Project title or null",
                  "description": "Brief description highlighting achievements, technologies used, and outcomes or null"
                }}
              ],
              "work_experience": [
                {{
                  "company": "Company name or null",
                  "role": "Job title or null",
                  "duration": "Start date – End date or null",
                  "description": "Brief description of responsibilities, achievements, and technologies used or null"
                }}
              ],
              "education": [
                {{
                  "degree": "Degree name or null",
                  "institution": "College/University name or null",
                  "duration": "Start date – End date or null",
                  "details": "Any relevant achievements or coursework or null"
                }}
              ],
              "certifications": ["List relevant certifications or empty list if none"],
              "achievements": ["List notable achievements or empty list if none"],
              "total_experience": "Calculate the total experience by summing durations in work_experience. Return in years rounded to 1 decimal if ≥ 1 year. If less than 1 year, return in months as an integer (e.g., '8 months'). If unknown, return 0."
            }}

            Guidelines:
            1. Ignore trivial or outdated skills unless advanced. Focus on modern, in-demand skills (React, Next.js, Python, Node.js, AI/ML, Cloud, etc.).
            2. Only include meaningful and market-relevant info.
            3. If information is missing for a field, use null for strings or empty list for arrays.
            4. Output strictly as JSON — do not add any extra text or explanations.
            5. For total_experience, parse each duration in work_experience (like "Jan 2020 – Mar 2022"), calculate the difference, sum all jobs, and return in years or months as described above.

            Here is the resume text:

            "{resume_text}"
            """
        )])


def job_structuring_prompt() -> ChatPromptTemplate:
    return ChatPromptTemplate.from_messages([
        ("system", "You are an expert job scraper and information extractor."),
        ("user", """
            Given the following job posting text, extract the key information and return it 
            strictly in the required structured format.

            Job Posting:
            -----------------
            "{job_posting}"
            -----------------
            """
         )
    ])


def experience_education_match_prompt():
    return ChatPromptTemplate.from_messages([
        ("system", "You are an expert HR assistant who can check candidate suitability."),
        ("user", """
            Compare the candidate's resume details with the job description.

            Candidate Resume:
            Total Experience: {candidate_experience}
            Education: {candidate_education}

            Job Description Requirements:
            Required Experience: {jd_experience}
            Required Education: {jd_education}

            Instructions:
            1. For experience, return "yes" if candidate's total experience is equal or greater than the JD requirement, else "no".
            2. For education, return "yes" if candidate's education satisfies the JD requirement, else "no".
            3. Output strictly as JSON with fields "experience_match" and "education_match".
            4. Do not add any extra text or explanation.

            Output:
        """)
    ])


def email_generation_prompt() -> ChatPromptTemplate:
    return ChatPromptTemplate.from_messages([
        ("system", dedent("""
            You are an expert career assistant. 
            Your job is to generate a professional, concise job application email.
            Use the provided candidate info, matched skills, and relevant experience from projects, work experience, achievements, and certifications.
            Keep the email clear, readable, and no longer than 250-300 words.

            Email Structure Rules:
            - Start with a clear Subject line.
            - Greeting: "Dear Hiring Manager,"
            - Exactly TWO paragraphs:
              • Paragraph 1: Brief intro (who the candidate is, why applying).  
              • Paragraph 2: Relevant experience, matched skills, achievements, enthusiasm.
            - Closing must be on separate lines in this format:

              Best regards,  
              {name}  
              Email: {email}  
              Phone: {phone}
        """)),
        ("user", dedent("""
            Generate a job application email using the following data:

            Candidate Info:
            Name: {name}
            Email: {email}
            Phone: {phone}

            Job Info:
            Title: {job_title}
            Company: {company_name}
            Description: {description}
            Responsibilities: {responsibilities}
            Required Skills: {jd_skills}

            Candidate Data:
            Matched Skills: {matched_skills}
            Relevant Experience: {chroma_data}  # combine top 5 semantic matches from projects, work experience, achievements, certifications

            Requirements:
            - Follow the email structure rules exactly.
            - Do not merge sign-off into one line.
            - Ensure readability and professionalism.
        """))
    ])
