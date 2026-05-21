# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server at http://localhost:5173
npm run build     # Production build to /dist
npm run preview   # Preview production build locally
npm run lint      # ESLint check
```

No test runner is configured — the app is interactive-only with no unit/integration test suite.

## Architecture

**OffCode** is an offline-first PWA for practicing Blind 75 LeetCode problems without a backend. All code execution happens client-side.

### Routing & Pages

`App.jsx` uses `HashRouter` (required for static hosting) with two routes:
- `/` → `Home.jsx` — animated loading screen; sets a `deps-ready` flag in `localStorage` on first visit
- `/editor` → `Editor.jsx` — main IDE with split layout (problem description left, Monaco editor + console right)

### Code Execution Pipeline

The critical path for running user code:

1. `Editor.jsx` calls `executionService.js` on Run/Submit
2. `executionService.js` spawns a Web Worker (`jsWorker.js` or `pythonWorker.js`) per run, with a 30-second hard timeout for TLE detection
3. The worker executes user code + test cases in isolation, captures console output, and returns `{status, error, logs, results[], runtime}`
4. Results are displayed in `ConsolePanel.jsx`

**Python execution** uses Pyodide (Python 3.11 via WASM) loaded from CDN and cached by the Service Worker for 1 year. The `pythonWorker.js` auto-aliases `Solution` class methods as globals so test code works whether the user writes a class or standalone functions.

### Data

`src/data/blind75.json` contains all 76 problems with HTML descriptions, starter code for Python and JavaScript, and 10–20 test cases per problem stored as executable code strings. `ghostData.json` holds performance benchmarks for the tier system in `ConsolePanel`.

### Persistence

`src/services/storage.js` uses IndexedDB (`offline-leetcode` DB, `submissions` store) with keys formatted as `{problemId}-{language}`. `Editor.jsx` auto-saves on every keystroke via `useEffect`.

### PWA & Offline

`vite.config.js` configures Workbox with an auto-update service worker. Pyodide CDN assets use `CacheFirst` with a 1-year TTL. After the first visit, the app is fully offline-capable.

### State Management

No global state library. State is local React hooks in each component. Cross-page persistence goes through IndexedDB (code) or `localStorage` (onboarding flag, deps-ready flag).

### Styling

Vanilla CSS with custom properties in `index.css`. No CSS framework. Glassmorphism panels with `backdrop-filter: blur`. Key palette: `#0B0E14` background, `#3b82f6` accent blue, `#10b981` success green, `#ef4444` error red.

## Key Non-Obvious Behaviors

- **Fake loading progress** on `Home.jsx` — the progress bar is a timed animation, not tied to actual Pyodide initialization
- **HashRouter is intentional** — do not switch to `BrowserRouter`; it would break static deployment
- **Workers are spawned and terminated per run** — not kept alive between executions
- **Test cases are code strings** executed via `eval()` in the worker, not structured data objects
- `generate_problems.py` in the repo root is a one-time data generation script, not part of the build
