# Development Rules

## 1. No Comments in Codebase
- Do not write comments (single-line `//` or multi-line `/* */`) in any project files, including source code, test files, and configuration files.
- Code should be clean, readable, and self-documenting.
- All existing comments in the codebase must be removed.

## 2. Directory Structure and Metadata
- All AI-related metadata, specifications, and configurations must be placed inside the `/metadata` folder.
- The `/metadata` folder must be registered in `.gitignore` to prevent it from being committed to the git repository.

## 3. Testing Stack
- Use **Playwright** with **TypeScript** for end-to-end (E2E) testing.
- Maintain test coverage for the target URL `https://trial.uc.ac.id`.
