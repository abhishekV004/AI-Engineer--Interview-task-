import React, { useState, useEffect } from 'react';
import { ViewTab, ChatMessage } from './types';
import { Header } from './components/Header';
import { ChatView } from './components/ChatView';
import { KBExplorer } from './components/KBExplorer';
import { LangGraphVisualizer } from './components/LangGraphVisualizer';
import { PythonRepoViewer } from './components/PythonRepoViewer';
import { BenchmarkSuite } from './components/BenchmarkSuite';

export default function App() {
  const [activeTab, setActiveTab] = useState<ViewTab>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(true);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setHasApiKey(data.hasApiKey);
      })
      .catch(() => {});
  }, []);

  const handleSendMessage = async (queryText: string) => {
    if (!queryText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: queryText }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: data.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        chunks: data.retrieved_chunks,
        confidenceScore: data.confidence_score,
        isGrounded: data.is_grounded,
        executionTimeMs: data.execution_time_ms,
        graphTrace: data.graph_trace,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Failed to query RAG API:', err);
      const errorMsg: ChatMessage = {
        id: `assistant-err-${Date.now()}`,
        sender: 'assistant',
        text: `⚠️ An error occurred while executing the RAG pipeline. Please check network connection or API status.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunQueryInChat = (query: string) => {
    setActiveTab('chat');
    handleSendMessage(query);
  };

  const handleClearHistory = () => {
    setMessages([]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} hasApiKey={hasApiKey} />

      <main className="flex-1 overflow-x-hidden">
        {activeTab === 'chat' && (
          <ChatView
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            onSelectSampleQuery={handleSendMessage}
            onClearHistory={handleClearHistory}
          />
        )}

        {activeTab === 'kb' && <KBExplorer />}

        {activeTab === 'graph' && <LangGraphVisualizer />}

        {activeTab === 'repo' && <PythonRepoViewer />}

        {activeTab === 'benchmark' && (
          <BenchmarkSuite onRunQueryInChat={handleRunQueryInChat} />
        )}
      </main>
    </div>
  );
}
