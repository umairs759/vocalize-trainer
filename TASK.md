# SPEAKFLOW / VOCALIZE-TRAINER TASK TRACKER

## Phase 1: Path & Loading Diagnostics
- [x] Fix all absolute paths in `index.html` to relative (`./css/...`, `./js/...`, `./assets/...`)
- [x] Verify CSP meta tag permits inline styles, CDNs, and media recording without console warnings
- [x] Ensure all JS files use strict relative module imports (`./storage.js`, etc.)

## Phase 2: Onboarding & Chip Selection (Critical Fix)
- [x] Rebuild chip click listeners in `js/app.js` using resilient event binding
- [x] Ensure `.chip-selected` visually activates immediately on click with bright highlight
- [x] Add explicit validation toast if "Start Speaking" is clicked with missing fields
- [x] Ensure clicking "Start Speaking" transitions smoothly to Dashboard/Practice without page reload

## Phase 3: Practice & Karaoke Engine
- [x] Render 15+ curated topics from `js/topics.js` based on selected interest & level
- [x] Tokenize paragraph words into interactive `<span>` elements
- [x] Implement `speechSynthesis` karaoke highlighting via `onboundary`
- [x] Implement tap-to-translate Urdu popup on difficult vocabulary words

## Phase 4: Voice Recording & 3-Pillar Scoring
- [x] Implement `SpeechRecognition` with continuous listening
- [x] Add fallback simulation button if microphone is denied or unsupported
- [x] Calculate 3-pillar score: Accuracy (50%), Pace/WPM (30%), Filler words penalty (20%)
- [x] Display diagnostic results with colored word badges (matched/omitted/mispronounced)

## Phase 5: Story Card & Gamification
- [x] Render 9:16 mobile story card template with user stats
- [x] Hook html2canvas for instant PNG export
- [x] Trigger confetti celebration for scores ≥ 80
- [x] Persist daily streaks in localStorage

## Phase 6: Final Verification & Deployment Readiness
- [x] Zero console errors on boot in Chrome/Edge
- [x] Commit all changes locally and update `REPORT.md`

## Phase 7: Practice View Rendering & Button Interactivity (v5.0)
- [x] Add `normalizeKey()` function for interest/level key normalization
- [x] Add `loadPracticeSession()` function to load topics and render them
- [x] Add `renderTopicToPractice()` to render paragraph words as interactive `<span>` elements
- [x] Wire up "Play Native Accent" button with TTS + Karaoke sync
- [x] Wire up "Record Voice" button with Speech Recognition
- [x] Wire up "Done / Evaluate" button with 3-pillar scoring
- [x] Wire up speed buttons (0.8x Slow & 1.0x Normal)
- [x] Wire up Reset and Back to Dashboard buttons
- [x] Add direct view switch bridge from onboarding to practice
- [x] Update version watermark to `v5.0 Live`