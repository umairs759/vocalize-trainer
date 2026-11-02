/* ============================================================
   SpeakFlow — Speech Synthesis & Karaoke Engine (js/speech-engine.js)
   Native window.speechSynthesis with word-level highlighting.
   ============================================================ */

const synth = window.speechSynthesis;
const synthesisSupported = !!synth;

let currentUtterance = null;
let wordSpans = [];
let activeIndex = -1;

export const speechEngine = {
  supported: synthesisSupported,

  isSpeaking() {
    return synthesisSupported && synth.speaking;
  },

  stop() {
    if (synthesisSupported) {
      try { synth.cancel(); } catch (err) { console.warn("[speech-engine] cancel failed", err); }
    }
    currentUtterance = null;
    activeIndex = -1;
    this.clearHighlights();
  },

  clearHighlights() {
    wordSpans.forEach((span) => span.classList.remove("karaoke-active", "tap-highlight"));
    wordSpans = [];
    activeIndex = -1;
  },

  /**
   * Render paragraph into karaoke word <span>s and speak with highlight sync.
   * @param {HTMLElement} container - DOM node to fill with word spans
   * @param {string} paragraph - full text to speak
   * @param {number} rate - 0.8 (slow) or 1.0 (normal)
   * @param {Function} onWordHighlight - (word, index) => void
   * @param {Function} onEnd - () => void
   */
  speak(container, paragraph, rate = 1, onWordHighlight, onEnd) {
    this.stop();

    if (!synthesisSupported) {
      if (onEnd) onEnd();
      return;
    }

    container.innerHTML = "";
    const words = paragraph.split(/\s+/);

    wordSpans = words.map((w, i) => {
      const span = document.createElement("span");
      span.textContent = w;
      span.id = `word-${i}`;
      span.dataset.index = i;
      span.className = "karaoke-word";
      span.setAttribute("role", "button");
      span.setAttribute("aria-label", `Word ${i + 1}: ${w}`);
      span.tabIndex = 0;

      span.addEventListener("click", (e) => {
        e.stopPropagation();
        window.__speakflow_onWordTap?.(w, i, span);
      });
      span.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          window.__speakflow_onWordTap?.(w, i, span);
        }
      });

      container.appendChild(span);
      if (i < words.length - 1) container.appendChild(document.createTextNode(" "));
      return span;
    });

    const utterance = new SpeechSynthesisUtterance(paragraph);
    utterance.rate = rate;
    utterance.lang = "en-US";

    utterance.onboundary = (event) => {
      if (event.name !== "word" && event.name !== "sentence") return;
      const charIndex = event.charIndex;
      let cumulative = 0;
      let idx = -1;

      for (let i = 0; i < words.length; i++) {
        if (charIndex >= cumulative && charIndex < cumulative + words[i].length) {
          idx = i;
          break;
        }
        cumulative += words[i].length + 1;
      }

      if (idx !== -1 && idx !== activeIndex) {
        if (activeIndex !== -1) wordSpans[activeIndex].classList.remove("karaoke-active");
        activeIndex = idx;
        wordSpans[idx].classList.add("karaoke-active");

        try { wordSpans[idx].scrollIntoView({ behavior: "smooth", block: "center", inline: "center" }); }
        catch (err) { console.warn("[speech-engine] scrollIntoView failed", err); }

        if (onWordHighlight) onWordHighlight(words[idx], idx);
      }
    };

    utterance.onend = () => {
      this.clearHighlights();
      currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (err) => {
      console.warn("[speech-engine] utterance error", err);
      this.clearHighlights();
      currentUtterance = null;
      if (onEnd) onEnd();
    };

    try {
      synth.speak(utterance);
      currentUtterance = utterance;
    } catch (err) {
      console.warn("[speech-engine] speak failed", err);
      this.clearHighlights();
      if (onEnd) onEnd();
    }
  },

  speakWord(word) {
    if (!synthesisSupported) return;
    try {
      const u = new SpeechSynthesisUtterance(word);
      u.rate = 1;
      u.lang = "en-US";
      synth.speak(u);
    } catch (err) {
      console.warn("[speech-engine] speakWord failed", err);
    }
  }
};
