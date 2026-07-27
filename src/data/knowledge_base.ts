export interface KBChunk {
  id: string;
  page: number;
  section: string;
  title: string;
  content: string;
  tags: string[];
  embeddingPreview?: number[];
}

export interface KBMetadata {
  title: string;
  sourceUrl: string;
  author: string;
  organization: string;
  totalPages: number;
  totalChunks: number;
  embeddingModel: string;
  vectorDimension: number;
  vectorDb: string;
}

export const EBOOK_METADATA: KBMetadata = {
  title: "Agentic AI: The Next Frontier in Enterprise Automation & Autonomous Intelligence",
  sourceUrl: "https://konverge.ai/pdf/Ebook-Agentic-AI.pdf",
  author: "Konverge AI Engineering & Research Team",
  organization: "Konverge AI",
  totalPages: 18,
  totalChunks: 12,
  embeddingModel: "gemini-embedding-2-preview (768-dim)",
  vectorDimension: 768,
  vectorDb: "Pinecone / In-Memory Cosine Vector Store"
};

export const AGENTIC_EBOOK_CHUNKS: KBChunk[] = [
  {
    id: "chunk-001",
    page: 1,
    section: "Executive Summary & Definition",
    title: "Definition of Agentic AI",
    content: "Agentic AI refers to autonomous or semi-autonomous AI systems that possess the capability to perceive their environment, reason through complex multi-step problems, make independent decisions, formulate plans, execute actions using external tools, and iteratively adapt based on feedback to achieve predefined goals with minimal or zero human intervention.",
    tags: ["definition", "agentic-ai", "autonomy", "reasoning"]
  },
  {
    id: "chunk-002",
    page: 2,
    section: "Evolution of AI Systems",
    title: "Evolution from LLMs to Autonomous Agents",
    content: "Traditional LLMs act as passive text completers or single-turn responders. Workflow automation relies on rigid, hardcoded conditional scripts. Agentic AI bridges this gap by combining LLM reasoning engines with dynamic execution loops (ReAct pattern), enabling systems to autonomously decompose macro goals into sub-tasks, select appropriate APIs or tools, evaluate intermediate outputs, and self-correct when encountering errors.",
    tags: ["evolution", "llm-vs-agent", "react-pattern", "automation"]
  },
  {
    id: "chunk-003",
    page: 4,
    section: "Core Agent Architecture",
    title: "The Four Core Pillars of AI Agent Architecture",
    content: "An Agentic AI system comprises four foundational pillars: 1) Brain / Reasoning Engine (LLM that decomposes tasks and directs execution), 2) Memory System (Short-term working memory buffer and Long-term vector database memory like Pinecone), 3) Tool Integration Layer (APIs, web search, database connectors, code interpreters), and 4) Planning & Reflection Module (Sub-goal generation, ReAct loops, and Reflexion for error analysis).",
    tags: ["architecture", "pillars", "memory", "tools", "planning"]
  },
  {
    id: "chunk-004",
    page: 6,
    section: "Memory & State Management",
    title: "Short-Term vs Long-Term Memory in RAG Agents",
    content: "Short-term memory manages active execution context, user dialogue history, and transient task state within the model's context window. Long-term memory utilizes Vector Databases (e.g. Pinecone, Chroma) to store episodic logs, semantic document embeddings, and domain knowledge base vectors. RAG (Retrieval-Augmented Generation) uses cosine similarity matching over long-term vector indexes to inject highly relevant context chunks into the LLM prompt.",
    tags: ["memory", "vector-db", "pinecone", "rag", "short-term", "long-term"]
  },
  {
    id: "chunk-005",
    page: 8,
    section: "Multi-Agent Systems & LangGraph",
    title: "LangGraph StateGraph & Multi-Agent Orchestration",
    content: "LangGraph is a framework for building stateful, multi-actor applications with LLMs using graph structures. A LangGraph workflow represents agent execution as a StateGraph consisting of Nodes (Python execution functions) and Edges (conditional or direct state transitions). The State object persists across graph steps. This cyclic architecture allows agents to implement loops, human approval interruptions (checkpoints), and specialized supervisor-worker multi-agent networks.",
    tags: ["langgraph", "stategraph", "nodes-edges", "multi-agent", "orchestration"]
  },
  {
    id: "chunk-006",
    page: 10,
    section: "RAG Pipeline & Grounding",
    title: "Strict Grounding & Hallucination Prevention in RAG",
    content: "To enforce strict grounding, RAG pipelines implement document relevance grading and hallucination verification nodes. When a query is received, retrieved context chunks are evaluated for relevance score. If context quality is low, a query-rewriter node modifies the prompt for better retrieval. After answer generation, a grader inspects whether all facts in the final answer are explicitly supported by the retrieved document chunks, filtering out unsupported assertions.",
    tags: ["rag", "grounding", "hallucination", "document-grader", "relevance"]
  },
  {
    id: "chunk-007",
    page: 12,
    section: "Human-In-The-Loop (HITL)",
    title: "Human-In-The-Loop Checkpoints & Governance",
    content: "Enterprise agentic deployments require Human-In-The-Loop (HITL) safety governance. LangGraph supports state checkpoints where execution pauses before high-consequence operations (such as financial transactions, API mutations, or database updates). A human operator inspects the proposed action in a review UI and can approve, edit, or reject the state before the agent resumes execution.",
    tags: ["hitl", "governance", "checkpoints", "safety", "approval"]
  },
  {
    id: "chunk-008",
    page: 14,
    section: "Error Handling & Self-Correction",
    title: "Reflexion and Adaptive Recovery Loops",
    content: "When an agentic tool call or retrieval step yields invalid results or error responses, the agent triggers a Reflexion self-correction node. The system logs the failure reason into short-term memory, re-evaluates its sub-goal strategy, and generates a revised query or tool invocation payload. This self-healing mechanism increases task completion rates without manual debugging.",
    tags: ["reflexion", "error-recovery", "self-correction", "resilience"]
  },
  {
    id: "chunk-009",
    page: 15,
    section: "Evaluation Framework & Metrics",
    title: "Key Metrics for RAG and Agentic AI Systems",
    content: "Evaluating agentic RAG pipelines involves four critical metrics: 1) Context Precision (ratio of relevant chunks retrieved), 2) Context Recall (extent to which all needed ground-truth facts are retrieved), 3) Faithfulness / Groundedness (measure of answer alignment with retrieved chunks, ensuring zero hallucination), and 4) Answer Relevance (how directly the answer addresses the user query).",
    tags: ["evaluation", "metrics", "context-precision", "faithfulness", "relevance"]
  },
  {
    id: "chunk-010",
    page: 16,
    section: "Enterprise Use Cases",
    title: "Enterprise Applications of Agentic AI",
    content: "Key enterprise use cases detailed in the eBook include: 1) Autonomous Customer Service (resolving multi-step inquiries with backend system updates), 2) Intelligent Document Processing (extracting, verifying, and routing complex unstructured PDFs), 3) Financial & Compliance Analysis (RAG-backed audit reporting and risk detection), and 4) DevOps & Software Maintenance (automated bug diagnosis and pull request creation).",
    tags: ["use-cases", "enterprise", "customer-service", "document-processing", "finance"]
  },
  {
    id: "chunk-011",
    page: 17,
    section: "Vector Search Implementation",
    title: "Pinecone Vector Indexing and Semantic Retrieval",
    content: "In a Pinecone vector database workflow, documents are split into semantic chunks (300-500 tokens with 50-token overlap). Embeddings are generated using dense vector models (e.g. Gemini Embeddings or Text-Embedding-3) and upserted into Pinecone indexes alongside metadata payloads (chunk text, page number, document ID). At query time, top-k vector cosine similarity retrieval returns context matches with similarity scores.",
    tags: ["pinecone", "vector-db", "embeddings", "cosine-similarity", "chunking"]
  },
  {
    id: "chunk-012",
    page: 18,
    section: "Best Practices & Future Outlook",
    title: "Best Practices for Building Production Agentic Systems",
    content: "Key design principles for production AI Agents: 1) Keep tools deterministic and focused on single responsibilities, 2) Implement strict input/output validation schemas (e.g. Pydantic), 3) Set explicit iteration step limits to prevent infinite ReAct loops, 4) Monitor token consumption and latency metrics, 5) Enforce strict RAG context grounding rules to prevent off-topic or hallucinated model outputs.",
    tags: ["best-practices", "pydantic", "guardrails", "production", "monitoring"]
  }
];

export const SAMPLE_BENCHMARK_QUERIES = [
  {
    id: "q1",
    query: "What is an AI Agent according to the eBook and how does it differ from traditional workflow automation?",
    expectedTopic: "Definition & Evolution",
    difficulty: "Fundamental"
  },
  {
    id: "q2",
    query: "What are the four core architectural pillars of an Agentic AI system?",
    expectedTopic: "Core Agent Architecture",
    difficulty: "Architectural"
  },
  {
    id: "q3",
    query: "How does LangGraph orchestrate agentic RAG workflows using StateGraph?",
    expectedTopic: "LangGraph Orchestration",
    difficulty: "Advanced"
  },
  {
    id: "q4",
    query: "How does the RAG pipeline ensure strict grounding and prevent hallucinations?",
    expectedTopic: "Grounding & Document Grading",
    difficulty: "Core RAG"
  },
  {
    id: "q5",
    query: "How does Human-In-The-Loop (HITL) governance work in LangGraph agents?",
    expectedTopic: "HITL Governance",
    difficulty: "Safety"
  },
  {
    id: "q6",
    query: "What are the primary evaluation metrics used to measure RAG pipeline accuracy?",
    expectedTopic: "Evaluation & Metrics",
    difficulty: "Evaluation"
  }
];
