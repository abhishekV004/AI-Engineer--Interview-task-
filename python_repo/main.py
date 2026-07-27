"""
FastAPI Server for Agentic AI RAG Chatbot API.
Exposes RESTful endpoints for RAG queries, health check, and vector store status.
"""

import os
import time
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

from vector_store import VectorStore
from rag_agent import LangGraphRAGAgent

app = FastAPI(
    title="Agentic AI eBook RAG Chatbot API",
    description="Production LangGraph RAG Agent powered by Gemini & Pinecone Vector DB.",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize VectorStore and RAG Agent
vector_store = VectorStore()
rag_agent = LangGraphRAGAgent(vector_store)


class ChatRequest(BaseModel):
    message: str = Field(..., description="User query question about Agentic AI eBook.")
    history: Optional[List[Dict[str, str]]] = Field(default=[], description="Previous conversation context.")


class ContextChunkResponse(BaseModel):
    chunk_id: str
    content: str
    page: int
    section: str
    similarity_score: float


class ChatResponse(BaseModel):
    answer: str
    retrieved_chunks: List[ContextChunkResponse]
    confidence_score: float
    is_grounded: bool
    execution_time_ms: float
    graph_trace: List[Dict[str, Any]]


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "knowledge_base": "Agentic AI eBook (Ebook-Agentic-AI.pdf)",
        "vector_store": "Pinecone (Index: agentic-ai-ebook)",
        "orchestration": "LangGraph StateGraph"
    }


@app.post("/chat", response_model=ChatResponse)
def query_rag(request: ChatRequest):
    start_time = time.time()
    
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Query message cannot be empty.")

    # Execute LangGraph RAG pipeline
    result = rag_agent.run(request.message)
    execution_time = round((time.time() - start_time) * 1000, 2)

    chunks_formatted = [
        ContextChunkResponse(
            chunk_id=doc.get("chunk_id", "chunk-0"),
            content=doc.get("content", ""),
            page=doc.get("page", 1),
            section=doc.get("section", "General"),
            similarity_score=doc.get("similarity_score", 0.0)
        )
        for doc in result.get("documents", [])
    ]

    return ChatResponse(
        answer=result.get("generation", "No grounded answer could be generated."),
        retrieved_chunks=chunks_formatted,
        confidence_score=result.get("confidence_score", 0.0),
        is_grounded=result.get("is_grounded", False),
        execution_time_ms=execution_time,
        graph_trace=result.get("graph_trace", [])
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
