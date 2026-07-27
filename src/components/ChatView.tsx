import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, ContextChunk } from '../types';
import { Send, Bot, User, ShieldCheck, ChevronDown, ChevronUp, Sparkles, Clock, FileText, CheckCircle, Activity, RefreshCw } from 'lucide-react';

interface ChatViewProps {
  messages: ChatMessage[];
  onSendMessage: (query: string) => void;
  isLoading: boolean;
  onSelectSampleQuery?: (query: string) => void;
  onClearHistory: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  onSendMessage,
  isLoading,
  onSelectSampleQuery,
  onClearHistory,
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const [expandedTraceId, setExpandedTraceId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sampleChips = [
    "What is an AI Agent and how does it differ from traditional automation?",
    "What are the 4 core architectural pillars of AI Agents?",
    "How does LangGraph orchestrate agentic workflows using StateGraph?",
    "How does the RAG pipeline prevent hallucinations?",
    "How does Human-In-The-Loop (HITL) work in LangGraph?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() || isLoading) return;
    onSendMessage(inputQuery);
    setInputQuery('');
  };

  const toggleTrace = (id: string) => {
    setExpandedTraceId(expandedTraceId === id ? null : id);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-112px)] max-w-5xl mx-auto px-4 py-4">
      {/* Quick Preset Bar */}
      <div className="mb-3 overflow-x-auto pb-1 scrollbar-none flex items-center space-x-2">
        <span className="text-xs font-semibold text-slate-500 whitespace-nowrap flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Presets:
        </span>
        {sampleChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (onSelectSampleQuery) onSelectSampleQuery(chip);
              else onSendMessage(chip);
            }}
            disabled={isLoading}
            className="text-xs bg-slate-800/60 hover:bg-indigo-950 hover:text-indigo-300 text-slate-300 border border-slate-700/60 px-3 py-1.5 rounded-full transition-all whitespace-nowrap shadow-xs disabled:opacity-50"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Messages Scroll View */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-slate-700">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/40">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
              <Bot className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-100 mb-2">
              Agentic AI eBook Knowledge Base RAG Engine
            </h2>
            <p className="text-sm text-slate-400 max-w-lg mb-6 leading-relaxed">
              Ask any question about Agentic AI concepts, architecture, memory systems, LangGraph multi-agent loops, or evaluation metrics. Answers are strictly grounded in <code className="text-indigo-400 bg-slate-800 px-1.5 py-0.5 rounded">Ebook-Agentic-AI.pdf</code>.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl text-left">
              {sampleChips.slice(0, 4).map((chip, i) => (
                <button
                  key={i}
                  onClick={() => onSendMessage(chip)}
                  className="p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500/50 rounded-xl text-xs text-slate-300 transition-all text-left flex items-start gap-2 group"
                >
                  <span className="text-indigo-400 font-bold">Q{i + 1}.</span>
                  <span className="group-hover:text-white">{chip}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`flex items-start gap-3 max-w-3xl ${
                msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-indigo-400 border border-indigo-500/30'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Box */}
              <div
                className={`rounded-2xl p-4 text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-sm'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">{msg.text}</div>

                {/* Assistant RAG Metadata Panel */}
                {msg.sender === 'assistant' && (
                  <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
                          <ShieldCheck className="w-3 h-3" />
                          {msg.confidenceScore ? `${msg.confidenceScore}% Grounded` : 'Grounded in PDF'}
                        </span>

                        {msg.executionTimeMs && (
                          <span className="text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {msg.executionTimeMs} ms
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => toggleTrace(msg.id)}
                        className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
                      >
                        {expandedTraceId === msg.id ? (
                          <>
                            Hide RAG Inspector <ChevronUp className="w-3.5 h-3.5" />
                          </>
                        ) : (
                          <>
                            View RAG Context & LangGraph Trace <ChevronDown className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>

                    {/* Expanded RAG Details Inspector */}
                    {expandedTraceId === msg.id && (
                      <div className="mt-3 space-y-3 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 animate-fadeIn">
                        {/* Retrieved Context Chunks */}
                        <div>
                          <div className="font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-indigo-400" />
                            Retrieved Context Chunks ({msg.chunks?.length || 0}):
                          </div>
                          <div className="space-y-2">
                            {msg.chunks?.map((chunk: ContextChunk, idx: number) => (
                              <div
                                key={idx}
                                className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-xs"
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-semibold text-indigo-300">
                                    [Page {chunk.page}] {chunk.title || chunk.section}
                                  </span>
                                  <span className="bg-slate-800 text-slate-400 border border-slate-700/60 px-1.5 py-0.5 rounded font-mono text-[10px]">
                                    Match: {(chunk.similarity_score * 100).toFixed(1)}%
                                  </span>
                                </div>
                                <p className="text-slate-300 font-mono text-[11px] leading-relaxed bg-slate-950/60 p-2 rounded border border-slate-800/60">
                                  "{chunk.content}"
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* LangGraph Node Execution Trace */}
                        {msg.graphTrace && msg.graphTrace.length > 0 && (
                          <div className="pt-2 border-t border-slate-800">
                            <div className="font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                              <Activity className="w-3.5 h-3.5 text-purple-400" />
                              LangGraph Execution Node Trace:
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {msg.graphTrace.map((node, nIdx) => (
                                <div
                                  key={nIdx}
                                  className="bg-slate-900/90 border border-slate-800/80 p-2 rounded-lg flex items-start gap-2"
                                >
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                  <div className="min-w-0">
                                    <div className="font-mono text-[11px] text-purple-300 font-semibold truncate">
                                      {node.node}
                                    </div>
                                    <div className="text-[10px] text-slate-400">
                                      {node.details} ({node.duration_ms} ms)
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 px-1">
              {msg.timestamp}
            </span>
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-800 text-indigo-400 border border-indigo-500/30 flex items-center justify-center animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-900 border border-slate-800 px-4 py-3 rounded-2xl rounded-tl-none flex items-center space-x-3 text-xs text-slate-300 shadow-md">
              <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin" />
              <span>Executing LangGraph RAG Agent (Retrieving vector chunks & synthesizing grounded response)...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="mt-3 pt-2">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask a question about Agentic AI eBook (e.g. LangGraph nodes, vector store memory, HITL)..."
            disabled={isLoading}
            className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-3.5 pr-24 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all shadow-inner disabled:opacity-50"
          />
          <div className="absolute right-2 flex items-center space-x-1">
            {messages.length > 0 && (
              <button
                type="button"
                onClick={onClearHistory}
                title="Clear Chat History"
                className="px-2 py-1 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
              >
                Clear
              </button>
            )}
            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 rounded-lg font-medium text-xs flex items-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
