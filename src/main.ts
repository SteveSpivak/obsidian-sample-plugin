// src/main.ts

import { Plugin, WorkspaceLeaf, Notice } from 'obsidian';
import { ChatView, VIEW_TYPE_CHAT } from './Components/ChatView';
import { DEFAULT_OLLLAMA_SETTINGS, LocalOllamaSettings } from './Settings/OllamaSettings';
import ChatSettingsTab from './Settings/ChatSettingsTab';
import axios from 'axios';

export default class OllamaChatPlugin extends Plugin {
  settings!: LocalOllamaSettings;

  async onload() {
    console.log('Ollama Chat Plugin loaded');

    // Load settings from data.json or initialize with defaults
    await this.loadSettings();

    // Register the Chat View
    this.registerView(VIEW_TYPE_CHAT, (leaf: WorkspaceLeaf) => new ChatView(leaf, this.settings));

    // Add a ribbon icon to open the Chat View
    this.addRibbonIcon('robot', 'Open Ollama Chat', async () => {
      await this.activateChatView();
    });

    // Add a command to open the Chat View
    this.addCommand({
      id: 'open-ollama-chat',
      name: 'Open Ollama Chat',
      callback: () => this.activateChatView(),
    });

    // Register settings tab for managing API settings
    this.addSettingTab(new ChatSettingsTab(this.app, this));

    // Listen for settings changes to update ChatView accordingly
    this.registerEvent(this.app.workspace.on('layout-change', () => {
      // Refresh views or perform actions if necessary
    }));
  }

  onunload() {
    console.log('Ollama Chat Plugin unloaded');
    this.app.workspace.detachLeavesOfType(VIEW_TYPE_CHAT);
  }

  async activateChatView(): Promise<void> {
    this.app.workspace.detachLeavesOfType(VIEW_TYPE_CHAT);
    const leaf = this.app.workspace.getRightLeaf(false);
    if (leaf) {
      await leaf.setViewState({
        type: VIEW_TYPE_CHAT,
        active: true,
      });
      this.app.workspace.revealLeaf(leaf);
    } else {
      new Notice('Failed to create chat view.');
    }
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_OLLLAMA_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  // Fetch available models from the Ollama API
  async fetchAvailableModels(): Promise<string[]> {
    try {
      interface ModelsResponse {
        models: string[];
      }
      const url = new URL('/models', this.settings.ollamaApiUrl).toString();
      const response = await axios.get<ModelsResponse>(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200 && response.data && Array.isArray(response.data.models)) {
        return response.data.models;
      } else {
        throw new Error('Failed to fetch models: Invalid response structure');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error fetching models:', error.message);
      } else {
        console.error('Error fetching models:', error);
      }
      new Notice('Error fetching models from Ollama API. Please check the API URL and your Ollama server.');
      return [];
    }
  }
}
