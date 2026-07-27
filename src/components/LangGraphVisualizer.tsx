import React, { useState } from 'react';
import { GitFork, ArrowRight, ShieldCheck, CheckCircle2, RotateCcw, Cpu, Database, FileSearch, Sparkles, Terminal } from 'lucide-react';

export const LangGraphVisualizer: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string>('retrieve_node');

  const nodes = [
    {
      id: 'retrieve_node',
      name: 'retrieve_node',
      title: 'Vector Retriever Node',
      icon: Database,
      type: 'Ingestion & Query Search',
      description: 'Executes top-k dense vector search against Pinecone or in-memory vector store using cosine similarity.',
      inputs: 'Query string, top_k parameter (default: 3)',
      outputs: 'List of Document Chunks with similarity score, page numbers, and metadata',
      codeSnippet: `def retrieve_node(state: RAGState) -> RAGState:
    docs = vector_store.similarity_search(state["question"], k=3)
    return { **state, "documents": docs }`,
    },
    {
      id: 'grade_documents_node',
      name: 'grade_documents_node',
      title: 'Document Relevance Grader',
      icon: FileSearch,
      type: 'Quality Assurance',
      description: 'Evaluates the average cosine similarity of retrieved document chunks against the user question.',
      inputs: 'Retrieved Document Chunks',
      outputs: 'Relevance Score (0.0 to 1.0) & filtering decision',
      codeSnippet: `def grade_documents_node(state: RAGState) -> RAGState:
    avg_relevance = sum(d["similarity_score"] for d in state["documents"]) / len(docs)
    return { **state, "relevance_score": avg_relevance }`,
    },
    {
      id: 'generate_node',
      name: 'generate_node',
      title: 'Grounded LLM Generator',
      icon: Cpu,
      type: 'Text Synthesis',
      description: 'Synthesizes grounded response using Gemini 3.6 Flash constrained strictly to retrieved context chunks.',
      inputs: 'User Question + Knowledge Base Context Chunks',
      outputs: 'Markdown Answer text strictly citing page numbers & sections',
      codeSnippet: `def generate_node(state: RAGState) -> RAGState:
    generation = llm.generate_content(system_prompt + context + state["question"])
    return { **state, "generation": generation }`,
    },
    {
      id: 'grounding_check_node',
      name: 'grounding_check_node',
      title: 'Grounding & Faithfulness Audit',
      icon: ShieldCheck,
      type: 'Hallucination Guardrail',
      description: 'Verifies whether generated claims are supported by context chunks and assigns a Confidence Score.',
      inputs: 'Generated Answer + Source Document Chunks',
      outputs: 'Confidence Score (%) & Is Grounded Boolean flag',
      codeSnippet: `def grounding_check_node(state: RAGState) -> RAGState:
    score = calculate_grounding_confidence(state["generation"], state["documents"])
    return { **state, "confidence_score": score, "is_grounded": score >= 70.0 }`,
    },
  ];

  const activeNode = nodes.find((n) => n.id === selectedNode) || nodes[0];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
            <GitFork className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">LangGraph StateGraph Workflow Architecture</h2>
            <p className="text-xs text-slate-400">
              Cyclic agent state machine controlling retrieval, document grading, grounded generation, and hallucination guardrails.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Graph Node Diagram */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-6 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-indigo-400" /> Click a node to view state transitions & Python code implementation:
        </div>

        {/* Nodes Pipeline Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
          {nodes.map((node, index) => {
            const Icon = node.icon;
            const isSelected = selectedNode === node.id;
            return (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node.id)}
                className={`cursor-pointer rounded-xl p-4 border transition-all flex flex-col justify-between relative group ${
                  isSelected
                    ? 'bg-indigo-950/60 border-indigo-500 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500'
                    : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700/60">
                      Step 0{index + 1}
                    </span>
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                  </div>

                  <h3 className="font-bold text-sm text-slate-100 group-hover:text-indigo-300 transition-colors mb-1">
                    {node.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{node.title}</p>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>{node.type}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>
            );
          })}
        </div>

        {/* State Flow Details Inspector */}
        <div className="mt-8 bg-slate-900/90 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">{activeNode.title} (<code className="text-indigo-400">{activeNode.name}</code>)</h3>
              <p className="text-xs text-slate-400">{activeNode.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-4">
            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
              <span className="font-semibold text-indigo-400 block mb-1">📥 Input Schema:</span>
              <p className="text-slate-300 font-mono text-[11px]">{activeNode.inputs}</p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
              <span className="font-semibold text-emerald-400 block mb-1">📤 Output Schema:</span>
              <p className="text-slate-300 font-mono text-[11px]">{activeNode.outputs}</p>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs text-slate-200">
            <div className="text-slate-500 mb-2 font-sans font-semibold">Python LangGraph Node Implementation:</div>
            <pre className="text-emerald-400 overflow-x-auto">{activeNode.codeSnippet}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
