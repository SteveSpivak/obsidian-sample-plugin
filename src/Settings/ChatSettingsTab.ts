// src/Settings/ChatSettingsTab.ts

import { App, PluginSettingTab, Setting, Notice } from 'obsidian';
import OllamaChatPlugin from '../main';
import { DEFAULT_OLLLAMA_SETTINGS } from '../Settings/OllamaSettings';

export default class ChatSettingsTab extends PluginSettingTab {
  plugin: OllamaChatPlugin;

  constructor(app: App, plugin: OllamaChatPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  async display(): Promise<void> {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl('h2', { text: 'Ollama Chat Settings' });

    // Fetch available models
    const models = await this.plugin.fetchAvailableModels();

    // Model Selection Setting
    new Setting(containerEl)
      .setName('Model Selection')
      .setDesc('Select the model to use with the Ollama API.')
      .addDropdown(dropdown => {
        if (models.length === 0) {
          dropdown.addOption('', 'No models available');
          dropdown.setValue('');
          dropdown.setDisabled(true);
        } else {
          models.forEach(model => dropdown.addOption(model, model));
          const currentModel = this.plugin.settings.model || models[0];
          // Ensure the current model exists in the fetched models
          const selectedModel = models.includes(currentModel) ? currentModel : models[0];
          dropdown.setValue(selectedModel);
          dropdown.onChange(async (value) => {
            this.plugin.settings.model = value;
            await this.plugin.saveSettings();
            new Notice(`Model changed to ${value}`);
          });
        }
      });

    // Ollama API URL Setting
    new Setting(containerEl)
      .setName('Ollama API URL')
      .setDesc('The base URL where your local Ollama server is running (e.g., http://localhost:11434).')
      .addText((text) =>
        text
          .setPlaceholder('http://localhost:11434')
          .setValue(this.plugin.settings.ollamaApiUrl || DEFAULT_OLLLAMA_SETTINGS.ollamaApiUrl)
          .onChange(async (value) => {
            const trimmedValue = value.trim().replace(/\/+$/, ''); // Remove trailing slashes
            this.plugin.settings.ollamaApiUrl = trimmedValue;
            await this.plugin.saveSettings();
            new Notice('Ollama API URL updated');
          })
      );
  }
}
