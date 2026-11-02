# SpeakFlow — English Speaking & Vocabulary Practice

A modern, viral, zero-cost, responsive English Speaking & Vocabulary Practice Web Application designed for GitHub Pages hosting. No backend, no paid API keys — everything runs in the browser using native Web APIs and `localStorage`.

## Tech Stack
* Semantic HTML5 (`index.html`)
* Modular CSS3 (Glassmorphism / Dark UI, Grid/Flexbox, Instagram Reel-style typography)
* Vanilla JavaScript ES6 Modules
* Native Web APIs: `speechSynthesis`, `SpeechRecognition`/`webkitSpeechRecognition`, `localStorage`
* Vendored via CDN: `html2canvas`, `canvas-confetti`

## Project Structure
```
C:\Users\usamah\Desktop\LovelyWeb\
├── index.html
├── INSTRUCTIONS.md
├── BUILD_REPORT.md
├── css/
│   ├── main.css
│   ├── onboarding.css
│   ├── dashboard.css
│   ├── practice.css
│   └── animations.css
├── js/
│   ├── app.js
│   ├── storage.js
│   ├── topics.js
│   ├── speech-engine.js
│   ├── scorer.js
│   ├── story-card.js
│   └── ui-controller.js
└── assets/
    └── icons/
        ├── mic.svg
        ├── play.svg
        ├── sound.svg
        ├── retry.svg
        └── share.svg
```

## How to Run Locally

### Option 1: Double-click
1. Open File Explorer → `C:\Users\usamah\Desktop\LovelyWeb`.
2. Double-click `index.html`.
3. The app opens in your default browser.

### Option 2: VS Code Live Server (recommended for Speech API)
1. Open the folder `C:\Users\usamah\Desktop\LovelyWeb` in VS Code.
2. Install the "Live Server" extension.
3. Right-click `index.html` → "Open with Live Server".
4. Open `http://127.0.0.1:5500` in your browser.

> **Speech Recognition** works in Chromium-based browsers (Chrome, Edge, Brave) with microphone permission. If unavailable, a fallback notice appears with a **"Simulate Practice (No Mic)"** button so you can still use the app.

## Features
1. **Onboarding** — name, age, interests (Tech, Daily Life, Business, Fitness, Cinema), level (Beginner, Intermediate, Advanced).
2. **Dashboard** — streak counter, stats, level/interest badges, 3 practice modes (Daily Practice, Impromptu 60s Blitz, Shadowing Challenge), recent sessions.
3. **Practice** — karaoke-style paragraph, native-accent playback, record & compare, Urdu translation popover on word tap.
4. **Results** — 0–100 fluency score, diagnostic breakdown (Accuracy, WPM, Fluency), word-by-word review, Instagram Story card export.
5. **Persistence** — profile, streak, and session history in `localStorage` (private-browsing safe).
6. **Speech fallback** — clear message + simulate mode when mic/speech unavailable.
7. **Security** — CSP meta, no `innerHTML` with user input, all `localStorage` wrapped in try/catch.

## Browser Support
* Chrome / Edge / Brave (recommended): full experience including voice recognition.
* Firefox: Speech recognition limited; TTS + karaoke work where available; fallback notice shown.
* Safari: limited speech support; TTS works where available.

## Security & Robustness
* `Content-Security-Policy` meta restricts scripts/styles; `object-src 'none'`; `unsafe-eval` not required.
* No `innerHTML` with user input — all text via `textContent` / DOM nodes.
* Every `localStorage` read/write wrapped in `try...catch`.
* Schema versioning prevents JSON parse crashes on stored data.
