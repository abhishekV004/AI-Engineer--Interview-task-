import React, { useState } from 'react';
import { SAMPLE_BENCHMARK_QUERIES } from '../data/knowledge_base';
import { Play, CheckCircle2, ShieldCheck, Clock, FileText, ArrowRight, Sparkles, RefreshCw } from 'lucide-react';

interface BenchmarkSuiteProps {
  onRunQueryInChat: (query: string) => void;
}

export const BenchmarkSuite: React.FC<BenchmarkSuiteProps> = ({ onRunQueryInChat }) => {
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [runningId, setRunningId] = useState<string | null>(null);

  const handleRunSingleTest = async (q: typeof SAMPLE_BENCHMARK_QUERIES[0]) => {
    setRunningId(q.id);
    const start = Date.now();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: q.query }),
      });
      const data = await res.json();
      setTestResults((prev) => ({
        ...prev,
        [q.id]: {
          ...data,
          timeMs: Date.now() - start,
        },
      }));
    } catch (err) {
      console.error('Test query execution failed:', err);
    } finally {
      setRunningId(null);
    }
  };

  const handleRunAllTests = async () => {
    for (const q of SAMPLE_BENCHMARK_QUERIES) {
      await handleRunSingleTest(q);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl font-bold text-white">RAG Evaluation Benchmark Queries</h2>
            </div>
            <p className="text-xs text-slate-400">
              Set of 6 technical test queries evaluating grounded answer accuracy, context retrieval, and LangGraph workflow steps.
            </p>
          </div>

          <button
            onClick={handleRunAllTests}
            disabled={runningId !== null}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50"
          >
            {runningId !== null ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Executing Suite...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Run Full Benchmark Suite (6)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Query Cards List */}
      <div className="space-y-4">
        {SAMPLE_BENCHMARK_QUERIES.map((item, idx) => {
          const result = testResults[item.id];
          const isRunning = runningId === item.id;

          return (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all shadow-xs"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-800/80">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    0{idx + 1}
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-slate-100">{item.query}</h3>
                    <div className="flex items-center space-x-2 mt-1 text-[11px] text-slate-400">
                      <span>Topic: <strong className="text-slate-300">{item.expectedTopic}</strong></span>
                      <span>•</span>
                      <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono text-[10px]">
                        {item.difficulty}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => onRunQueryInChat(item.query)}
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <span>Inspect in Chat</span> <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleRunSingleTest(item)}
                    disabled={isRunning}
                    className="text-xs bg-indigo-600/90 hover:bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1 disabled:opacity-50"
                  >
                    {isRunning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isRunning ? 'Testing...' : 'Run Test'}</span>
                  </button>
                </div>
              </div>

              {/* Execution Test Result Panel */}
              {result ? (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-3 animate-fadeIn">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center space-x-3">
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Score: {result.confidence_score}% Grounded
                      </span>
                      <span className="text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {result.timeMs || result.execution_time_ms} ms
                      </span>
                    </div>
                    <span className="text-slate-400 text-[11px]">
                      Context Chunks Retrieved: <strong className="text-slate-200">{result.retrieved_chunks?.length || 0}</strong>
                    </span>
                  </div>

                  <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800/80 text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
                    {result.answer}
                  </div>
                </div>
              ) : (
                <div className="text-[11px] text-slate-500 italic">
                  Click 'Run Test' to execute live LangGraph RAG pipeline on this query and display groundedness score.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
