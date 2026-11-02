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
- [x] Render 15+ curated topics from `js/topics.js` based on selected interest & level (5 interests × 3 levels + cinema added)
- [x] Tokenize paragraph words into interactive `<span>` elements via `ui.prepareKaraoke()`
- [x] Implement `speechSynthesis` karaoke highlighting via `onboundary` in `js/speech-engine.js`
- [x] Implement tap-to-translate Urdu popup on difficult vocabulary words via `ui.showTooltip()` in `js/ui-controller.js`

## Phase 4: Voice Recording & 3-Pillar Scoring
- [x] Implement `SpeechRecognition` with continuous listening via `scorer.js` - `webkitSpeechRecognition` / `SpeechRecognition`
- [x] Add fallback simulation button if microphone is denied or unsupported - "Simulate Speaking (No Mic)" in `js/app.js`
- [x] Calculate 3-pillar score: Accuracy (50%), Pace/WPM (30%), Filler words penalty (20%) via `scorer.score()` 
- [x] Display diagnostic results with colored word badges (matched/omitted/mispronounced) via `js/scorer.js` `buildWordsReview()`

## Phase 5: Story Card & Gamification
- [x] Render 9:16 mobile story card template with user stats via `js/story-card.html`
- [x] Hook html2canvas for instant PNG export - `storyCard.export()` downloads as PNG
- [x] Trigger confetti celebration for scores ≥ 80 via `canvas-confetti` when `storyCard.export()` completes
- [x] Persist daily streaks in localStorage via `storage.updateStreak()`

## Phase 6: Final Verification & Deployment Readiness
- [x] Zero console errors on boot in Chrome/Edge - verified after all fixes
- [x] Commit all changes locally and update `REPORT.md`