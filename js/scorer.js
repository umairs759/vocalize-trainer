/* ============================================================
   SpeakFlow — Speech Recognition & 3-Pillar Scoring (js/scorer.js)
   Web Speech API recognition + Levenshtein-based scoring.
   ============================================================ */

const RecCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognitionSupported = !!RecCtor;

const FILLER_WORDS = [
  "um", "uh", "hmm", "ah", "like", "you know", "i mean", "basically",
  "actually", "literally", "okay", "right", "so", "well"
];

export const scorer = {
  supported: recognitionSupported,

  isListening(recognizer) {
    return recognizer ? recognizerListening.has(recognizer) : false;
  },

  start({ onResult, onEnd, onError } = {}) {
    if (!RecCtor) {
      if (onError) onError(new Error("Speech recognition not supported in this browser"));
      return null;
    }

    let recognizer;
    try {
      recognizer = new RecCtor();
    } catch (err) {
      if (onError) onError(err);
      return null;
    }

    recognizer.continuous = true;
    recognizer.interimResults = true;
    recognizer.lang = "en-US";

    recognizerListening.add(recognizer);

    let finalTranscript = "";

    recognizer.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += (finalTranscript ? " " : "") + transcript;
        } else {
          interim += transcript;
        }
      }
      if (onResult) onResult({ final: finalTranscript, interim });
    };

    recognizer.onend = () => {
      recognizerListening.delete(recognizer);
      if (onEnd) onEnd(finalTranscript);
    };

    recognizer.onerror = (event) => {
      recognizerListening.delete(recognizer);
      if (onError) onError(event);
    };

    try {
      recognizer.start();
    } catch (err) {
      recognizerListening.delete(recognizer);
      if (onError) onError(err);
      return null;
    }

    return recognizer;
  },

  stop(recognizer) {
    if (!recognizer) return;
    recognizerListening.delete(recognizer);
    try { recognizer.abort(); } catch (err) { console.warn("[scorer] abort failed", err); }
  },

  /**
   * Score a transcript against the target paragraph.
   * 3 pillars: Accuracy 50, Pace 30, Fluency/Filler 20.
   */
  score(targetParagraph, transcript, durationSeconds) {
    const targetWords = tokenize(targetParagraph);
    const spokenWords = tokenize(transcript);

    const diff = wordDiff(targetWords, spokenWords);
    const matchedCount = diff.matched.length;
    const targetCount = targetWords.length;

    // Accuracy pillar (0-50)
    const accuracyRaw = targetCount > 0 ? matchedCount / targetCount : 0;
    const accuracyScore = Math.round(accuracyRaw * 50);

    // WPM & pace pillar (0-30)
    const minutes = Math.max(durationSeconds / 60, 0.01);
    const wpm = Math.round(spokenWords.length / minutes);
    const paceScore = paceScoreFromWpm(wpm);

    // Filler / hesitation pillar (0-20)
    const fillerCount = countFillers(spokenWords);
    const fluencyScore = Math.max(0, 20 - fillerCount * 3);

    const total = Math.round(
      Math.min(100, Math.max(0, accuracyScore + paceScore + fluencyScore))
    );

    const wordsReview = buildWordsReview(targetWords, diff);

    return {
      score: total,
      accuracy: Math.round(accuracyRaw * 100),
      accuracyScore,
      wpm,
      paceScore,
      fluencyScore,
      fillerCount,
      fillerPenalty: Math.min(20, fillerCount * 3),
      matched: diff.matched,
      omitted: diff.omitted,
      mispronounced: diff.mispronounced,
      wordsReview,
      feedback: buildFeedback(total, accuracyRaw, wpm, fillerCount)
    };
  }
};

const recognizerListening = new Set();

function tokenize(text) {
  if (!text) return [];
  return String(text)
    .toLowerCase()
    .replace(/[.,;:!?"'()\[\]{}\\/-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);
}

function countFillers(words) {
  return words.filter((w) => FILLER_WORDS.includes(w)).length;
}

function paceScoreFromWpm(wpm) {
  if (wpm >= 110 && wpm <= 150) return 30;
  if (wpm >= 80 && wpm <= 170) return 22;
  return 14;
}

function buildFeedback(total, accuracyRaw, wpm, fillerCount) {
  const fb = [];
  if (total >= 80) fb.push("Excellent fluency — keep it up!");
  else if (total >= 60) fb.push("Good progress — a little more practice will sharpen it.");
  else fb.push("Keep practicing — focus on the words highlighted below.");

  if (accuracyRaw < 0.6) fb.push("Replay the native audio and shadow it.");
  if (wpm < 80) fb.push("Pace is slow — try speaking a touch faster.");
  if (wpm > 170) fb.push("Pace is fast — slow down for clearer pronunciation.");
  if (fillerCount > 2) fb.push("Reduce filler words like 'um' and 'like'.");
  return fb;
}

function buildWordsReview(targetWords, diff) {
  const matchedSet = new Set(diff.matched);
  const mispronouncedSet = new Set(diff.mispronounced);
  return targetWords.map((w) => {
    if (matchedSet.has(w)) return { word: w, status: "correct" };
    if (mispronouncedSet.has(w)) return { word: w, status: "mispronounced" };
    return { word: w, status: "omitted" };
  });
}

function wordDiff(target, spoken) {
  const m = target.length;
  const n = spoken.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (target[i - 1] === spoken[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  const matched = [];
  const omitted = [];
  const mispronounced = [];

  let i = m;
  let j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && target[i - 1] === spoken[j - 1]) {
      matched.push(target[i - 1]);
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] <= dp[i - 1][j] && dp[i][j - 1] <= dp[i - 1][j - 1] + 1)) {
      mispronounced.push(spoken[j - 1]);
      j--;
    } else {
      omitted.push(target[i - 1]);
      i--;
    }
  }

  return {
    matched: matched.reverse(),
    omitted: omitted.reverse(),
    mispronounced: mispronounced.reverse()
  };
}
