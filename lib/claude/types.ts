export interface ClaudeConfig {
  apiKey: string;
  apiUrl: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

export interface ClaudeMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ClaudeResponse {
  content: Array<{
    text: string;
  }>;
}

export interface ClaudeError {
  error?: {
    type: string;
    message: string;
  };
}