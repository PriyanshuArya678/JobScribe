from langchain_community.document_loaders import WebBaseLoader
from app.utils.clear_text import clean_text


def fetch_page_content(url: str) -> str:
    loader = WebBaseLoader(url)
    data =  loader.load().pop().page_content
    return clean_text(data)
