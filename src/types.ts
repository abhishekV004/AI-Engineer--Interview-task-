export interface ContextChunk {
  chunk_id: string;
  content: string;
  page: number;
  section: string;
  similarity_score: number;
  title?: string;
}

export interface GraphTraceNode {
  node: string;
  action: string;
  details: string;
  duration_ms: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  chunks?: ContextChunk[];
  confidenceScore?: number;
  isGrounded?: boolean;
  executionTimeMs?: number;
  graphTrace?: GraphTraceNode[];
  isThinking?: boolean;
}

export type ViewTab = 'chat' | 'kb' | 'graph' | 'repo' | 'benchmark';

export interface KBChunkDetail {
  id: string;
  page: number;
  section: string;
  title: string;
  content: string;
  tags: string[];
}

export interface BenchmarkQuery {
  id: string;
  query: string;
  expectedTopic: string;
  difficulty: string;
}
