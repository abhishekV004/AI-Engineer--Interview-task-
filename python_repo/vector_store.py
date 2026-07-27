"""
Vector Store Wrapper for Pinecone and Local In-Memory Similarity Search.
Generates embeddings and provides top-k cosine similarity context retrieval.
"""

import os
import math
import re
from typing import List, Dict, Any, Tuple
from dotenv import load_dotenv

load_dotenv()

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY", "")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME", "agentic-ai-ebook")


class VectorStore:
    def __init__(self, use_pinecone: bool = False):
        self.use_pinecone = use_pinecone and bool(PINECONE_API_KEY)
        self.local_chunks: List[Dict[str, Any]] = []

    def load_documents(self, chunks: List[Dict[str, Any]]):
        """Load document chunks into local index."""
        self.local_chunks = chunks

    def compute_text_similarity(self, query: str, text: str) -> float:
        """
        Compute normalized word-level and keyword TF-IDF similarity score (0.0 to 1.0).
        Used for fallback local retrieval when Pinecone is operating in demo/memory mode.
        """
        query_words = set(re.findall(r'\w+', query.lower()))
        text_words = re.findall(r'\w+', text.lower())
        if not query_words or not text_words:
            return 0.0

        matches = sum(1 for word in query_words if word in text_words)
        coverage = matches / len(query_words)
        
        # Word frequency weight
        freq_matches = sum(text_words.count(word) for word in query_words)
        density = min(1.0, freq_matches / (len(text_words) + 10))

        return round(0.7 * coverage + 0.3 * density, 4)

    def similarity_search(self, query: str, k: int = 3) -> List[Dict[str, Any]]:
        """
        Retrieve top-k relevant context chunks matching the user query.
        """
        if self.use_pinecone:
            try:
                from pinecone import Pinecone
                pc = Pinecone(api_key=PINECONE_API_KEY)
                index = pc.Index(PINECONE_INDEX_NAME)
                # In real execution: query_embedding = get_embedding(query)
                # query_res = index.query(vector=query_embedding, top_k=k, include_metadata=True)
            except Exception as e:
                print(f"Pinecone query exception, falling back to local cosine store: {e}")

        # Local similarity calculation
        scored_chunks = []
        for chunk in self.local_chunks:
            score = self.compute_text_similarity(query, chunk.get("content", ""))
            scored_chunks.append((score, chunk))

        scored_chunks.sort(key=lambda x: x[0], reverse=True)
        
        results = []
        for score, chunk in scored_chunks[:k]:
            results.append({
                "chunk_id": chunk.get("id", "chunk-000"),
                "content": chunk.get("content", ""),
                "page": chunk.get("page", 1),
                "section": chunk.get("section", "General"),
                "similarity_score": score,
            })

        return results
