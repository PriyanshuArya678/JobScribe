
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from app.core.config import settings

embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")

# Initialize ChromaDB client
collection =Chroma(
    collection_name="resumes",
    persist_directory="./chroma_db",
    embedding_function=embeddings
)