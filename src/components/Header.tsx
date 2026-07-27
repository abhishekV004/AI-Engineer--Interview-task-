import React from 'react';
import { ViewTab } from '../types';
import { MessageSquare, Database, GitFork, FolderCode, TestTube2, ExternalLink, Cpu, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
  hasApiKey: boolean;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, hasApiKey }) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Navbar Row */}
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 font-bold text-lg">
              🤖
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-semibold text-base sm:text-lg text-white tracking-tight">
                  Agentic AI RAG Studio
                </h1>
                <span className="px-2 py-0.5 text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
                  LangGraph + Pinecone
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <span>Grounded strictly in</span>
                <a
                  href="https://konverge.ai/pdf/Ebook-Agentic-AI.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 flex items-center gap-0.5 transition-colors"
                >
                  Ebook-Agentic-AI.pdf <ExternalLink className="w-3 h-3 inline" />
                </a>
              </p>
            </div>
          </div>

          {/* Status Badges */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs text-slate-300">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>Gemini 3.6 Flash</span>
            </div>

            <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Pinecone Vector DB</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation Row */}
        <div className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'chat'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Interactive Chat</span>
          </button>

          <button
            onClick={() => setActiveTab('kb')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'kb'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Knowledge Base</span>
          </button>

          <button
            onClick={() => setActiveTab('graph')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'graph'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <GitFork className="w-4 h-4" />
            <span>LangGraph Workflow</span>
          </button>

          <button
            onClick={() => setActiveTab('repo')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'repo'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FolderCode className="w-4 h-4" />
            <span>Python Codebase</span>
          </button>

          <button
            onClick={() => setActiveTab('benchmark')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'benchmark'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <TestTube2 className="w-4 h-4" />
            <span>Sample Queries (6)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
