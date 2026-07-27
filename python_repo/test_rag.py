"""
Benchmark test runner for Agentic AI eBook RAG Pipeline.
Runs sample queries against the RAG system and outputs structured metrics.
"""

import time

from vector_store import VectorStore
from rag_agent import LangGraphRAGAgent

SAMPLE_QUERIES = [
    "What is an AI Agent according to the eBook and how does it differ from traditional workflow automation?",
    "What are the four core architectural pillars of an Agentic AI system?",
    "How does LangGraph orchestrate agentic RAG workflows using StateGraph?",
    "How does the RAG pipeline ensure strict grounding and prevent hallucinations?",
    "How does Human-In-The-Loop (HITL) governance work in LangGraph agents?",
    "What are the primary evaluation metrics used to measure RAG pipeline accuracy?"
]


def run_benchmark():
    print("=" * 70)
    print("🧪 RUNNING AGENTIC AI RAG BENCHMARK EVALUATION")
    print("=" * 70 + "\n")

    vector_store = VectorStore()
    agent = LangGraphRAGAgent(vector_store)

    for idx, query in enumerate(SAMPLE_QUERIES, 1):
        print(f"[{idx}/{len(SAMPLE_QUERIES)}] Query: {query}")
        start = time.time()
        res = agent.run(query)
        elapsed = round((time.time() - start) * 1000, 2)

        print(f"   ⏱️ Time: {elapsed} ms")
        print(f"   🎯 Confidence Score: {res.get('confidence_score')}%")
        print(f"   🛡️ Grounded: {res.get('is_grounded')}")
        print(f"   📚 Context Chunks Retrieved: {len(res.get('documents', []))}")
        print("   💬 Answer Preview:")
        print(f"      {res.get('generation')[:180]}...")
        print("-" * 70 + "\n")

    print("✅ BENCHMARK EVALUATION COMPLETED SUCCESSFULLY!")


if __name__ == "__main__":
    run_benchmark()
