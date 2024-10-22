import { Plugin, WorkspaceLeaf, Notice } from 'obsidian';
import ChatView from './Components/ChatView';
import { DEFAULT_OLLLAMA_SETTINGS, OllamaSettings } from './Settings/OllamaSettings';
import { VIEW_TYPE_CHAT } from './Constants/constants';
import ChatSettingsTab from './Settings/ChatSettingsTab';

export default class OllamaChatPlugin extends Plugin {
  settings!: OllamaSettings;

  async onload() {
    console.log('Ollama Chat Plugin loaded');

    // Load settings from data.json or initialize with defaults
    await this.loadSettings();

    // Register the Chat View
    this.registerView(VIEW_TYPE_CHAT, (leaf: WorkspaceLeaf) => new ChatView(leaf, this.settings));

    // Add a ribbon icon to open the Chat View
    this.addRibbonIcon('robot', 'Open Ollama Chat', async (evt: MouseEvent) => {
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
  }

  onunload() {
    console.log('Ollama Chat Plugin unloaded');

    // Detach any leaves of the chat view when the plugin is unloaded
    this.app.workspace.detachLeavesOfType(VIEW_TYPE_CHAT);
  }

  async activateChatView(): Promise<void> {
    // Close any existing Chat Views
    this.app.workspace.detachLeavesOfType(VIEW_TYPE_CHAT);

    // Create a new leaf in the right sidebar and set the Chat View
    const leaf = this.app.workspace.getRightLeaf(false);
    if (leaf) {
      await leaf.setViewState({
        type: VIEW_TYPE_CHAT,
        active: true,
      });

      // Focus on the new leaf to make it visible
      this.app.workspace.revealLeaf(leaf);
    } else {
      new Notice('Failed to create chat view.');
    }
  }

  async loadSettings() {
	this.settings = Object.assign({}, DEFAULT_OLLLAMA_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    // Save settings to data.json
    await this.saveData(this.settings);
  }
}
