
# Prompt for Developer AI Engineer

**Objective:**

Implement the specified enhancements to the Obsidian Ollama Chat Plugin, ensuring all features are developed according to best practices and with attention to performance, security, and user experience.

---

**Tasks:**

1. **Establish Communication with Ollama:**

   - Write code to communicate with the local Ollama AI model via its HTTP API.
   - Implement error handling for network issues or API failures.

2. **Fetch and Display Available Models:**

   - Use the Ollama API to retrieve a list of available models.
   - Update the settings UI to display the models and allow user selection.

3. **Implement Vault Indexing:**

   - Develop functions to traverse and read all markdown files in the vault.
   - Extract and index content, tags, and metadata for quick retrieval.

4. **Enhance Chat with Contextual Information:**

   - Add UI components for users to select files or input keywords.
   - Modify the AI prompts to include context from the selected files or search results.

5. **Develop AI-Assisted Tagging and Metadata Management:**

   - Create a command accessible via the command palette to trigger AI suggestions.
   - Implement UI for users to review and approve tags and metadata before applying.

6. **Create Note Organization Feature:**

   - Use AI to analyze notes and suggest connections or reorganizations.
   - Provide an interface for users to review and apply these suggestions.

7. **Build the AI-Powered Rewrite Tool:**

   - Allow users to select text and choose rewrite options.
   - Handle the AI interaction and update the note upon user approval.

8. **Implement Comprehensive Error Handling and Logging:**

   - Ensure all operations have proper error handling.
   - Implement logging mechanisms to aid in debugging.

9. **Ensure User Approval for Changes:**

   - Before making any changes suggested by the AI, require user confirmation.
   - Provide clear and detailed information about what changes will occur.

10. **Optimize Performance and Ensure Security:**

    - Use asynchronous programming to prevent blocking the UI.
    - Ensure all data processing is local and secure.

---

**Guidelines:**

- **Code Quality:** Write clean, maintainable, and well-documented code. Use TypeScript features effectively.
- **Modularity:** Structure the code into reusable components and modules.
- **Best Practices:** Follow best practices for Obsidian plugin development and adhere to the Obsidian Plugin API guidelines.
- **Testing:** Include unit tests and ensure that all new features are thoroughly tested.
- **User Experience:** Focus on creating intuitive and user-friendly interfaces.

---

**Output Expected:**

- **Implementation Plans:** For each task, provide a detailed plan on how to implement it, including any necessary code snippets.
- **Code Examples:** Include code samples that demonstrate how to perform key operations.
- **Libraries and Tools:** Suggest any third-party libraries or tools that can facilitate development.
- **Potential Challenges:** Identify any challenges or limitations and propose solutions.

---

**Note:** Remember to regularly test each feature as it's developed, gather user feedback, and iterate accordingly to ensure the plugin meets the needs of its users effectively.
