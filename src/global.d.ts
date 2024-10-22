// src/global.d.ts

import { MarkdownRenderer } from 'obsidian';

declare module 'obsidian' {
  interface App {
    markdownRenderer: MarkdownRenderer;
  }
}
