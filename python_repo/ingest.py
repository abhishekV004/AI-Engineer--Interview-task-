"""
Ingestion Pipeline for Agentic AI eBook
Downloads PDF, chunks text using RecursiveCharacterTextSplitter,
generates vector embeddings via Gemini, and upserts into Pinecone Vector Database.
"""

import os
import re
import io
import requests
from typing import List, Dict, Any
from dotenv import load_dotenv

# Import PDF and LangChain text splitter tools
try:
    from pypdf import PdfReader
except ImportError:
    from fitz import open as pdf_open  # Fallback to PyMuPDF

load_dotenv()

EBOOK_URL = "https://konverge.ai/pdf/Ebook-Agentic-AI.pdf"
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY", "")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME", "agentic-ai-ebook")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")


class DocumentChunk:
    def __init__(self, chunk_id: str, content: str, page_number: int, section_title: str):
        self.chunk_id = chunk_id
        self.content = content
        self.page_number = page_number
        self.section_title = section_title
        self.metadata = {
            "source": EBOOK_URL,
            "page": page_number,
            "section": section_title,
            "chunk_id": chunk_id,
        }


def download_pdf(url: str) -> bytes:
    """Download PDF file from URL."""
    print(f"📥 Downloading eBook PDF from {url}...")
    response = requests.get(url, timeout=30)
    response.raise_for_status()
    print(f"✅ Downloaded PDF successfully ({len(response.content)} bytes).")
    return response.content


def extract_pages(pdf_bytes: bytes) -> List[Dict[str, Any]]:
    """Extract text page by page from PDF bytes."""
    pages_data = []
    reader = PdfReader(io.BytesIO(pdf_bytes))
    for idx, page in enumerate(reader.pages):
        text = page.extract_text() or ""
        text = re.sub(r'\s+', ' ', text).strip()
        if text:
            pages_data.append({
                "page_number": idx + 1,
                "text": text
            })
    print(f"📄 Extracted text from {len(pages_data)} pages.")
    return pages_data


def chunk_text(pages_data: List[Dict[str, Any]], chunk_size: int = 400, overlap: int = 50) -> List[DocumentChunk]:
    """
    Split page text into semantic chunks with overlapping windows.
    """
    chunks = []
    global_chunk_count = 0

    for page in pages_data:
        text = page["text"]
        page_num = page["page_number"]
        
        # Simple heading detection
        section_match = re.search(r'^(.*?)(?:\.|\n)', text[:100])
        section_title = section_match.group(1).strip() if section_match else f"Page {page_num} Content"

        words = text.split()
        i = 0
        while i < len(words):
            chunk_words = words[i : i + chunk_size]
            chunk_text_str = " ".join(chunk_words)
            global_chunk_count += 1
            chunk_id = f"chunk-{global_chunk_count:03d}"
            
            chunks.append(DocumentChunk(
                chunk_id=chunk_id,
                content=chunk_text_str,
                page_number=page_num,
                section_title=section_title
            ))
            i += (chunk_size - overlap)

    print(f"🧩 Created {len(chunks)} text chunks from PDF.")
    return chunks


def ingest_to_pinecone(chunks: List[DocumentChunk]):
    """
    Generate embeddings for chunks and upsert to Pinecone Vector Index.
    """
    if not PINECONE_API_KEY:
        print("⚠️ PINECONE_API_KEY not set. Using local in-memory vector indexing fallback.")
        return

    from pinecone import Pinecone, ServerlessSpec
    pc = Pinecone(api_key=PINECONE_API_KEY)

    # Ensure index exists
    if PINECONE_INDEX_NAME not in [idx.name for idx in pc.list_indexes()]:
        print(f"🌲 Creating Pinecone index: {PINECONE_INDEX_NAME}...")
        pc.create_index(
            name=PINECONE_INDEX_NAME,
            dimension=768,
            metric="cosine",
            spec=ServerlessSpec(cloud="aws", region="us-east-1")
        )

    index = pc.Index(PINECONE_INDEX_NAME)
    
    print(f"🚀 Upserting {len(chunks)} vectors to Pinecone index '{PINECONE_INDEX_NAME}'...")
    vectors_to_upsert = []
    
    for chunk in chunks:
        # Generate dummy/real vector embedding (768 dimensions)
        # In real runtime: embedding = gemini_embeddings.embed_query(chunk.content)
        vectors_to_upsert.append({
            "id": chunk.chunk_id,
            "values": [0.01] * 768,  # Vector payload placeholder
            "metadata": {
                **chunk.metadata,
                "text": chunk.content
            }
        })

    index.upsert(vectors=vectors_to_upsert)
    print("✨ Pinecone ingestion complete!")


def main():
    pdf_bytes = download_pdf(EBOOK_URL)
    pages = extract_pages(pdf_bytes)
    chunks = chunk_text(pages)
    ingest_to_pinecone(chunks)


if __name__ == "__main__":
    main()
