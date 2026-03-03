# OffCode — Offline LeetCode Practice

Practice Blind 75 LeetCode problems completely offline with Python and JavaScript.

## Features
- 76 Blind 75 problems with descriptions, starter code, and test cases
- Python execution via Pyodide (WebAssembly) — no server needed
- JavaScript execution via Web Workers
- Monaco code editor with syntax highlighting
- Auto-saves your code locally (IndexedDB)
- Installable as a PWA — works in airplane mode
- Performance tiers (Optimal / Average / Slow)

## Quick Start
```bash
git clone https://github.com/che4goud/offcode.git
cd offcode
npm install
npm run dev
```

## Production Build
```bash
npm run build
npx serve dist
```

## Install as App
1. Open the deployed URL in Chrome/Edge
2. Click the install icon in the URL bar
3. The app works offline forever after first visit

## Tech Stack
React 19 • Vite 7 • Monaco Editor • Pyodide • PWA (vite-plugin-pwa) • IndexedDB
