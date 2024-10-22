// src/Components/ChatView.ts

import { ItemView, WorkspaceLeaf, Notice, MarkdownView, MarkdownRenderer } from 'obsidian';
import axios from 'axios';

interface LocalOllamaSettings {
  ollamaApiUrl: string;
  model: string; // Add the model property
}

export const VIEW_TYPE_CHAT = 'chat-view';

export interface ChatViewSettings {
  ollamaApiUrl: string;
}

export class ChatView extends ItemView {
  private chatContainer!: HTMLElement;
  private inputEl!: HTMLInputElement;
  private sendButton!: HTMLButtonElement;
  private messagesEl!: HTMLElement;
  private apiUrl: string;
  private settings: LocalOllamaSettings;

  constructor(leaf: WorkspaceLeaf, settings: LocalOllamaSettings) {
    super(leaf);
    this.apiUrl = settings.ollamaApiUrl;
    this.leaf = leaf;

    this.settings = settings;
  }

  getViewType(): string {
    return VIEW_TYPE_CHAT;
  }

  getDisplayText(): string {
    return 'AI Chat';
  }

  async onOpen(): Promise<void> {
    this.contentEl.empty();

    // Create chat container
    this.chatContainer = this.contentEl.createDiv({ cls: 'chat-container' });

    // Create messages display area
    this.messagesEl = this.chatContainer.createDiv({ cls: 'messages' });

    // Create input area
    const inputArea = this.chatContainer.createDiv({ cls: 'input-area' });
    this.inputEl = inputArea.createEl('input', {
      type: 'text',
      placeholder: 'Type your message...',
    }) as HTMLInputElement;
    this.sendButton = inputArea.createEl('button', {
      text: 'Send',
    }) as HTMLButtonElement;

    // Add event listener to send button
    this.sendButton.addEventListener('click', () => this.handleSendMessage());

    // Add Enter key support
    this.inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.handleSendMessage();
      }
    });
  }

  async onClose(): Promise<void> {
    // Cleanup if necessary
  }

  private async handleSendMessage() {
    const message = this.inputEl.value.trim();
    if (message === '') return;

    // Display user's message
    this.addMessage('User', message);

    // Clear input
    this.inputEl.value = '';

    // Show loading indicator
    this.addMessage('AI', '...');

    // Define payload
    const payload = {
      model: 'qwen2.5-coder:latest',  // Specify the model here
      prompt: message,
      max_tokens: 150,  // Adjust as needed
    };

    // Scroll to bottom
    this.messagesEl.scrollTop = this.messagesEl.scrollHeight;

    // Send message to Ollama and display response
    try {
      const response = await axios.post(`${this.apiUrl}/v1/chat`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      this.updateLastAIMessage(response.data as string);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      this.updateLastAIMessage('Sorry, there was an error processing your request.');
      new Notice('Failed to fetch AI response. Please check your Ollama setup.');
    }
  }

  private async addMessage(sender: string, message: string): Promise<void> {
    const messageEl = this.messagesEl.createDiv({ cls: 'message' });
    messageEl.createSpan({ text: `${sender}: `, cls: 'sender' });

    // Create a container for Markdown rendering
    const markdownContainer = messageEl.createDiv({ cls: 'markdown' });

    // Ensure that the active file is a MarkdownView
    const activeFile = this.app.workspace.getActiveFile();
    if (activeFile) {
      const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
      if (activeView) {
        // Await the rendering to ensure it completes before proceeding
        await MarkdownRenderer.render(
          this.app,
          message,
          markdownContainer,
          activeFile.path,
          this
        );
      } else {
        markdownContainer.setText(message);
      }
    } else {
      markdownContainer.setText(message);
    }

    this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
  }

  private updateLastAIMessage(message: string) {
    const aiMessages = this.messagesEl.querySelectorAll('.message');
    const lastAiMessage = aiMessages[aiMessages.length - 1];
    if (lastAiMessage) {
      const markdownContainer = lastAiMessage.querySelector('.markdown');
      if (markdownContainer) {
        MarkdownRenderer.render(
          this.app,
          message,
          markdownContainer as HTMLElement,
          this.app.workspace.getActiveFile()?.path || '',
          this
        );
      }
    }
    this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
  }

  private async fetchAIResponse(message: string): Promise<string> {
    this.showLoadingIndicator(); // Show loading indicator
    const payload = {
      model: 'qwen2.5-coder:latest',  // Specify the model here
      prompt: message,
      max_tokens: 150,  // Adjust as needed
    };

    const response = await axios.post<Response>(this.apiUrl, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200 && response.data && response.data) {
      return String(response.data);
    } else {
      throw new Error('Invalid response from Ollama');
    }
  }

  private showLoadingIndicator(): void {
    // Implementation for showing a loading indicator
    const loadingEl = this.messagesEl.createDiv({ cls: 'loading' });
    loadingEl.setText('Loading...');
    this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
  }
}
