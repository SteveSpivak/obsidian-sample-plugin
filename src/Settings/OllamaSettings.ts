// src/Settings/OllamaSettings.ts

export interface LocalOllamaSettings {
    ollamaApiUrl: string;
    model: string;
}

export const DEFAULT_OLLLAMA_SETTINGS: LocalOllamaSettings = {
    ollamaApiUrl: 'http://localhost:11434', // Removed trailing slash
    model: 'qwen2.5-coder:latest', // Ensure this model exists in your Ollama setup
};
