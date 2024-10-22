// src/Settings/OllamaSettings.ts

export interface OllamaSettings {
    ollamaApiUrl: string;
  }

  export const DEFAULT_OLLLAMA_SETTINGS: OllamaSettings = {
    ollamaApiUrl: 'http://localhost:11434/v1/chat', // Default Ollama API URL
  };
