# 🎙️ Vocalize Trainer — Interactive Speech & Fluency Practice Engine

[![Live Demo](https://img.shields.io/badge/Demo-Live%20on%20GitHub%20Pages-success?style=for-the-badge&logo=github)](https://umairs759.github.io/vocalize-trainer/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Zero Backend](https://img.shields.io/badge/Backend-100%25%20Client--Side-orange?style=for-the-badge)](#tech-stack)

**Vocalize Trainer** is a responsive, client-side web application designed to help learners practice English speaking, build pronunciation fluency, and expand active vocabulary. Built natively with modern Web APIs, it runs entirely in the browser without subscriptions, API keys, or backend servers.

---

## ✨ Features

- **🎯 Adaptive Onboarding:** Customizes content across 5 domains (*Tech, Daily Life, Business, Fitness, Cinema*) and 3 difficulty tiers (*Beginner, Intermediate, Advanced*).
- **🎶 Instagram Reels-Style Karaoke:** Real-time word-by-word animation highlighting synchronized with the browser's native `SpeechSynthesis` boundary engine.
- **📖 Tap-to-Translate Vocabulary:** Instant tooltips on difficult words with Urdu translations, synonyms, and context usage.
- **🎙️ Real-Time Voice Recognition:** Hands-free speech transcription via Chromium `SpeechRecognition` API.
- **📊 3-Pillar Diagnostic Scoring (0–100):**
  - **Accuracy (50%):** Levenshtein distance token comparison against the original paragraph.
  - **Pace / Fluency (30%):** Real-time Words Per Minute (WPM) calculation.
  - **Hesitation & Fillers (20%):** Automated deduction for silence gaps and filler ticks (*um, uh, like*).
- **📱 9:16 Viral Story Card Export:** Downloadable high-resolution Instagram Story PNGs with CEFR badges via `html2canvas`.
- **🎉 Gamification & Streaks:** `canvas-confetti` celebrations for high scores and persistent daily streak tracking via `localStorage`.

---

## 🛠️ Tech Stack

- **Markup & Layout:** Semantic HTML5, CSS3 Grid/Flexbox (Dark Glassmorphic UI)
- **Logic:** Vanilla JavaScript (Self-contained ES6+)
- **Browser APIs:**
  - `window.speechSynthesis` (Text-to-Speech)
  - `window.webkitSpeechRecognition` / `SpeechRecognition` (Audio Transcription)
  - `localStorage` (Session and streak persistence)
- **Vendor Libraries:**
  - `html2canvas` (DOM canvas rendering)
  - `canvas-confetti` (Celebration animations)

---

## 🚀 Live Demo

Access the live web app:  
🔗 **[https://umairs759.github.io/vocalize-trainer/](https://umairs759.github.io/vocalize-trainer/)**

> **Browser Requirement:** Speech recognition features require Chromium-based browsers (Chrome, Edge, Brave) with microphone permissions enabled.

---

## 💻 Local Setup

1. Clone repository:
   ```bash
   git clone https://github.com/umairs759/vocalize-trainer.git
   cd vocalize-trainer
   ```

2. Start a static server:
   ```bash
   npx serve .
   ```

3. Open http://localhost:3000 in Google Chrome or Microsoft Edge.

---

## 👤 Author

Developed by Muhammad Umair

GitHub: @umairs759

📄 License

This project is licensed under the MIT License.