import React, { useState, useEffect } from 'react';
import { FolderCode, FileCode, Copy, Check, Download, ExternalLink, Github, Terminal } from 'lucide-react';

export const PythonRepoViewer: React.FC = () => {
  const [repoFiles, setRepoFiles] = useState<Record<string, string>>({});
  const [activeFile, setActiveFile] = useState<string>('rag_agent.py');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/python-repo')
      .then((res) => res.json())
      .then((data) => {
        setRepoFiles(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch python repo files:', err);
        setIsLoading(false);
      });
  }, []);

  const handleCopyCode = () => {
    const code = repoFiles[activeFile] || '';
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const code = repoFiles[activeFile] || '';
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeFile;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fileList = Object.keys(repoFiles);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
              <FolderCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Python RAG Repository Source Code</h2>
              <p className="text-xs text-slate-400">
                Complete Python 3.10+ project ready for GitHub submission containing LangGraph, Pinecone, FastAPI & RAG pipeline.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyCode}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied File!' : 'Copy Code'}</span>
            </button>

            <button
              onClick={handleDownloadFile}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download {activeFile}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main File Explorer Container */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col md:flex-row min-h-[550px]">
        {/* Sidebar File Selector */}
        <div className="w-full md:w-64 bg-slate-900/90 border-b md:border-b-0 md:border-r border-slate-800 p-3 shrink-0">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2 flex items-center justify-between">
            <span>Repository Files</span>
            <Github className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <div className="space-y-1">
            {fileList.map((fileName) => {
              const isActive = activeFile === fileName;
              return (
                <button
                  key={fileName}
                  onClick={() => setActiveFile(fileName)}
                  className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-mono transition-all text-left ${
                    isActive
                      ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <FileCode className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span className="truncate">{fileName}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 px-2">
            <div className="text-[10px] font-semibold text-slate-500 uppercase mb-2">Project Tech Stack</div>
            <div className="space-y-1.5 text-[11px] text-slate-400 font-mono">
              <div className="flex items-center justify-between">
                <span>Orchestration:</span>
                <span className="text-orange-400">LangGraph</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Vector DB:</span>
                <span className="text-emerald-400">Pinecone</span>
              </div>
              <div className="flex items-center justify-between">
                <span>LLM Engine:</span>
                <span className="text-indigo-400">Gemini Flash</span>
              </div>
              <div className="flex items-center justify-between">
                <span>API Server:</span>
                <span className="text-teal-400">FastAPI</span>
              </div>
            </div>
          </div>
        </div>

        {/* Code Content Area */}
        <div className="flex-1 bg-slate-950 p-4 font-mono text-xs overflow-x-auto flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-slate-400 text-[11px]">
              <span className="flex items-center gap-1.5 font-semibold text-indigo-300">
                <Terminal className="w-3.5 h-3.5 text-slate-500" /> python_repo/{activeFile}
              </span>
              <span>{repoFiles[activeFile]?.split('\n').length || 0} Lines</span>
            </div>

            {isLoading ? (
              <div className="text-slate-500 p-8 text-center animate-pulse">Loading repository file contents...</div>
            ) : (
              <pre className="text-slate-200 leading-relaxed font-mono whitespace-pre text-[12px] scrollbar-thin scrollbar-thumb-slate-800">
                {repoFiles[activeFile] || '# File empty or missing'}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
