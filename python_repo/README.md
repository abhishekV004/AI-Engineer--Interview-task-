# Agentic AI eBook – RAG Chatbot & LangGraph System

[![Python 3.10+](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![LangGraph](https://img.shields.io/badge/Orchestration-LangGraph-orange.svg)](https://github.com/langchain-ai/langgraph)
[![Pinecone](https://img.shields.io/badge/Vector%20DB-Pinecone-green.svg)](https://www.pinecone.io/)
[![Gemini API](https://img.shields.io/badge/LLM-Gemini%203.6%20Flash-purple.svg)](https://ai.google.dev/)
[![FastAPI](https://img.shields.io/badge/API-FastAPI-009688.svg)](https://fastapi.tiangolo.com/)

A production-grade RAG (Retrieval-Augmented Generation) Chatbot and Python agent framework built for the **AI Engineer Interview Assignment**. Answers user queries strictly grounded in the **Agentic AI eBook** (`https://konverge.ai/pdf/Ebook-Agentic-AI.pdf`).

---

## 📌 Architecture Overview

```
                          ┌──────────────────────────┐
                          │   Agentic AI eBook PDF   │
                          └────────────┬─────────────┘
                                       │
                                       ▼
                       ┌───────────────────────────────┐
                       │  ingest.py (Chunk & Embed)   │
                       └───────────────┬───────────────┘
                                       │
                                       ▼
                       ┌───────────────────────────────┐
                       │  Pinecone Vector Index (768d) │
                       └───────────────┬───────────────┘
                                       │
                                       ▼
                       ┌───────────────────────────────┐
                       │  LangGraph RAG StateGraph    │
                       └───────────────┬───────────────┘
                                       │
   ┌───────────────────────────────────┼──────────────────────────────────┐
   │                                   │                                  │
   ▼                                   ▼                                  ▼
┌──────────────────┐        ┌──────────────────────┐         ┌─────────────────────┐
│  retrieve_node   │ ──────►│ grade_documents_node │ ───────►│    generate_node    │
└──────────────────┘        └──────────────────────┘         └──────────┬──────────┘
                                                                        │
                                                                        ▼
                                                             ┌─────────────────────┐
                                                             │grounding_check_node │
                                                             └──────────┬──────────┘
                                                                        │
                                                                        ▼
                                                             ┌─────────────────────┐
                                                             │ FastAPI / Chat UI   │
                                                             └─────────────────────┘
```

### LangGraph Workflow Nodes:
1. **`retrieve_node`**: Fetches top-$k$ document chunks from Pinecone using dense vector cosine similarity search.
2. **`grade_documents_node`**: Computes average document relevance score to filter out noisy context.
3. **`generate_node`**: Synthesizes a strictly grounded answer using Gemini (`gemini-3.6-flash`).
4. **`grounding_check_node`**: Verifies answer faithfulness against retrieved PDF sources and outputs a **Confidence Score (%)**.

---

## 🚀 Quick Start Guide

### 1. Prerequisites & Environment Setup
Clone the repository and set up a virtual environment:

```bash
git clone https://github.com/your-username/agentic-ai-rag-chatbot.git
cd agentic-ai-rag-chatbot
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in the root directory:

```env
GEMINI_API_KEY="your_gemini_api_key_here"
PINECONE_API_KEY="your_pinecone_api_key_here"
PINECONE_INDEX_NAME="agentic-ai-ebook"
```

### 2. Ingest Knowledge Base PDF
Run the ingestion script to download `Ebook-Agentic-AI.pdf`, chunk the text, generate vector embeddings, and populate Pinecone:

```bash
python ingest.py
```

### 3. Launch FastAPI Server
Start the backend REST API:

```bash
python main.py
```
The API server will run on `http://localhost:8000`. Access interactive Swagger docs at `http://localhost:8000/docs`.

### 4. Run Benchmark Test Suite
Run the automated evaluation benchmark on the sample queries:

```bash
python test_rag.py
```

---

## 📡 API Endpoint Reference

### `POST /chat`
Sends a query question to the RAG Agent.

#### **Request Payload:**
```json
{
  "message": "What is an AI Agent and how does it differ from traditional workflow automation?"
}
```

#### **Response Body:**
```json
{
  "answer": "According to the Agentic AI eBook, an AI Agent is an autonomous system capable of perceiving environments, reasoning through complex goals, making independent decisions, and utilizing tools...",
  "retrieved_chunks": [
    {
      "chunk_id": "chunk-001",
      "content": "Agentic AI refers to autonomous or semi-autonomous AI systems...",
      "page": 1,
      "section": "Executive Summary & Definition",
      "similarity_score": 0.892
    }
  ],
  "confidence_score": 96.5,
  "is_grounded": true,
  "execution_time_ms": 342.10,
  "graph_trace": [
    { "node": "retrieve_node", "duration_ms": 45.2 },
    { "node": "grade_documents_node", "duration_ms": 12.1 },
    { "node": "generate_node", "duration_ms": 250.4 },
    { "node": "grounding_check_node", "duration_ms": 34.4 }
  ]
}
```

---

## 🧪 Benchmark Sample Queries

| # | Question | Core Topic | Target Metric |
|---|----------|------------|---------------|
| **1** | What is an AI Agent and how does it differ from traditional workflow automation? | Definition & Autonomy | Groundedness > 90% |
| **2** | What are the four core architectural pillars of an Agentic AI system? | Architecture | Context Precision = 1.0 |
| **3** | How does LangGraph orchestrate agentic RAG workflows using StateGraph? | LangGraph & State | Zero Hallucination |
| **4** | How does the RAG pipeline ensure strict grounding and prevent hallucinations? | Grounding Guardrails | Faithfulness Score |
| **5** | How does Human-In-The-Loop (HITL) governance work in LangGraph agents? | Checkpoints & Safety | Citation Accuracy |
| **6** | What are the primary evaluation metrics used to measure RAG pipeline accuracy? | Evaluation Metrics | Context Recall |

---

## 📐 Evaluation & Guardrail Methodology

To prevent hallucinations:
1. **Strict Prompt Constraint**: The system prompt forces the LLM to restrict its response strictly to facts present in the retrieved context chunks.
2. **Document Grading**: Retain only chunks with similarity scores exceeding thresholds.
3. **Grounding Audit**: Evaluates overlap between generated assertions and source document text.

---

## 📄 License
Licensed under Apache 2.0. Built for AI Engineer Technical Assignment.
