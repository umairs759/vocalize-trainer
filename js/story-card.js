/* ============================================================
   SpeakFlow — Viral Instagram Story Card Export (js/story-card.js)
   9:16 mobile story card (1080x1920 ratio) via html2canvas.
   Confetti fireworks if score >= 80.
   ============================================================ */

import html2canvas from "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.esm.js";
import confetti from "https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.es.js";

export const storyCard = {
  container: null,

  init() {
    this.container = document.getElementById("story-card-container");
  },

  render(data) {
    if (!this.container) this.init();
    const card = this.container.querySelector("#story-card");
    if (!card) return;

    const nameEl = this.container.querySelector("#story-name");
    const dateEl = this.container.querySelector("#story-date");
    const topicEl = this.container.querySelector("#story-topic");
    const badgeEl = this.container.querySelector("#story-badge");
    const scoreEl = this.container.querySelector("#story-score");
    const ringEl = this.container.querySelector("#story-ring");
    const wpmEl = this.container.querySelector("#story-wpm");
    const accEl = this.container.querySelector("#story-accuracy");
    const lvlEl = this.container.querySelector("#story-level");

    if (nameEl) nameEl.textContent = data.name || "Speaker";
    if (dateEl) dateEl.textContent = data.date || new Date().toLocaleDateString();
    if (topicEl) topicEl.textContent = data.topic || "-";
    if (badgeEl) badgeEl.textContent = data.badge || "Rising Speaker";
    if (scoreEl) scoreEl.textContent = data.score != null ? data.score : "0";
    if (ringEl) {
      const circumference = 2 * Math.PI * 38;
      const offset = circumference - ((data.score || 0) / 100) * circumference;
      ringEl.style.strokeDashoffset = offset;
    }
    if (wpmEl) wpmEl.textContent = data.wpm != null ? `${data.wpm} WPM` : "- WPM";
    if (accEl) accEl.textContent = data.accuracy != null ? `${data.accuracy}% Accuracy` : "- Accuracy";
    if (lvlEl) lvlEl.textContent = data.level || "-";
  },

  open() {
    if (!this.container) return;
    this.container.classList.remove("hidden");
    this.container.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  },

  close() {
    if (!this.container) return;
    this.container.classList.add("hidden");
    this.container.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  },

  async export(data) {
    if (!this.container) this.init();
    const card = this.container.querySelector("#story-card");
    if (!card) {
      console.warn("[story-card] card element not found");
      return;
    }

    try {
      const canvas = await html2canvas(card, {
        scale: 2,
        backgroundColor: "#0f0c29",
        logging: false,
        useCORS: true
      });

      const link = document.createElement("a");
      link.download = `speakflow-story-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.warn("[story-card] export failed", err);
      throw err;
    } finally {
      if (data && data.score >= 80) {
        try {
          confetti({
            particleCount: 140,
            spread: 80,
            origin: { y: 0.55 },
            colors: ["#a855f7", "#22d3ee", "#ffeb3b"]
          });
        } catch (err) {
          console.warn("[story-card] confetti failed", err);
        }
      }
    }
  }
};
