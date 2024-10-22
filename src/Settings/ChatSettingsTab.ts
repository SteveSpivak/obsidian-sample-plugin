import { App, PluginSettingTab, Setting, Notice } from 'obsidian';
import OllamaChatPlugin from '../main';
import { DEFAULT_OLLLAMA_SETTINGS } from './OllamaSettings';

export default class ChatSettingsTab extends PluginSettingTab {
  plugin: OllamaChatPlugin;

  constructor(app: App, plugin: OllamaChatPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl('h2', { text: 'Ollama Chat Settings' });

    new Setting(containerEl)
      .setName('Ollama API URL')
      .setDesc('The URL where your local Ollama server is running.')
      .addText((text) =>
        text
          .setPlaceholder('http://localhost:11434/v1/chat')
          .setValue(this.plugin.settings.ollamaApiUrl || DEFAULT_OLLLAMA_SETTINGS.ollamaApiUrl)  // Use default if undefined
          .onChange(async (value) => {
            this.plugin.settings.ollamaApiUrl = value.trim();
            await this.plugin.saveSettings();
            new Notice('Ollama API URL updated');
          })
      );
  }
}
