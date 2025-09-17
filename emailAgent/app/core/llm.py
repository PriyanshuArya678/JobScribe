from langchain_groq import ChatGroq
from .config import settings
llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0,
    api_key= settings.GROQ_API_KEY
) 