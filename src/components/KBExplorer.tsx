import React, { useState } from 'react';
import { AGENTIC_EBOOK_CHUNKS, EBOOK_METADATA } from '../data/knowledge_base';
import { Search, Database, Layers, FileText, Tag, Hash, ExternalLink, Cpu, CheckCircle2 } from 'lucide-react';

export const KBExplorer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = Array.from(
    new Set(AGENTIC_EBOOK_CHUNKS.flatMap((c) => c.tags))
  ).sort();

  const filteredChunks = AGENTIC_EBOOK_CHUNKS.filter((chunk) => {
    const matchesSearch =
      !searchTerm ||
      chunk.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chunk.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chunk.section.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTag = !selectedTag || chunk.tags.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Knowledge Base Overview Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Database className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl font-bold text-white">Agentic AI Knowledge Base Index</h2>
            </div>
            <p className="text-sm text-slate-400">
              Directly parsed and indexed from{' '}
              <a
                href={EBOOK_METADATA.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:underline inline-flex items-center gap-1 font-medium"
              >
                Ebook-Agentic-AI.pdf <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Index Status: Ready & Synchronized
            </span>
          </div>
        </div>

        {/* Index Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl">
            <div className="text-slate-500 font-medium mb-1">Total Indexed Chunks</div>
            <div className="text-lg font-bold text-slate-100 font-mono">{EBOOK_METADATA.totalChunks} Chunks</div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl">
            <div className="text-slate-500 font-medium mb-1">eBook Source Scope</div>
            <div className="text-lg font-bold text-slate-100 font-mono">{EBOOK_METADATA.totalPages} Pages</div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl">
            <div className="text-slate-500 font-medium mb-1">Embedding Dimensions</div>
            <div className="text-lg font-bold text-indigo-400 font-mono">{EBOOK_METADATA.vectorDimension} Dim (Dense)</div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl">
            <div className="text-slate-500 font-medium mb-1">Vector Store Engine</div>
            <div className="text-lg font-bold text-emerald-400 font-mono">Pinecone + Cosine</div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search chunks by title, content keyword, or section..."
            className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 outline-none transition-all placeholder-slate-500"
          />
        </div>

        {/* Tag Selector */}
        <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              selectedTag === null
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            All Tags ({AGENTIC_EBOOK_CHUNKS.length})
          </button>
          {allTags.slice(0, 5).map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedTag === tag
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Chunks List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredChunks.map((chunk) => (
          <div
            key={chunk.id}
            className="bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-xl p-4 transition-all flex flex-col justify-between group shadow-sm"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md font-mono text-[11px] font-semibold">
                    {chunk.id}
                  </span>
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                    <FileText className="w-3 h-3 text-slate-500" /> Page {chunk.page}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {chunk.section}
                </span>
              </div>

              <h3 className="font-bold text-sm text-slate-100 group-hover:text-indigo-300 transition-colors mb-2">
                {chunk.title}
              </h3>

              <p className="text-xs text-slate-300 font-sans leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 mb-3">
                "{chunk.content}"
              </p>
            </div>

            {/* Tags footer */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800/60">
              <Tag className="w-3 h-3 text-slate-500" />
              {chunk.tags.map((tag) => (
                <span
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className="cursor-pointer text-[10px] bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 px-2 py-0.5 rounded border border-slate-700/60 transition-colors font-mono"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
