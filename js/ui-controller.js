/* ============================================================
   SpeakFlow — UI Controller (js/ui-controller.js)
   SPA view switching, toasts, dashboard stats, recording state, tooltips.
   ============================================================ */

export const ui = {
  showView(viewId) {
    document.querySelectorAll(".view").forEach((v) => v.classList.remove("active-view"));
    const target = document.getElementById(viewId);
    if (target) {
      target.classList.add("active-view");
      window.scrollTo(0, 0);
    }
  },

  toast({ message, type = "info", duration = 3000 } = {}) {
    const container = document.getElementById("toast-container");
    if (!container) return;
    const el = document.createElement("div");
    el.className = `toast ${type}`;
    el.textContent = message;
    container.appendChild(el);
    setTimeout(() => {
      el.style.opacity = "0";
      el.style.transform = "translateX(20px)";
      setTimeout(() => el.remove(), 300);
    }, duration);
  },

  updateDashboard(profile, history) {
    const nameEl = document.getElementById("dash-name");
    const streakEl = document.getElementById("dash-streak");
    const sessionsEl = document.getElementById("dash-sessions");
    const bestEl = document.getElementById("dash-best");
    const interestEl = document.getElementById("dash-interest");
    const levelEl = document.getElementById("dash-level-badge");
    const recentList = document.getElementById("dash-recent-list");
    const timeOfDayEl = document.getElementById("dash-timeofday");

    const hour = new Date().getHours();
    const tod = hour < 12 ? "Morning" : hour < 18 ? "Afternoon" : "Evening";
    if (timeOfDayEl) timeOfDayEl.textContent = tod;
    if (nameEl) nameEl.textContent = profile.name || "Speaker";
    if (streakEl) streakEl.textContent = profile.streakCount || 0;
    if (sessionsEl) sessionsEl.textContent = history.length;
    if (bestEl) {
      bestEl.textContent = history.length
        ? Math.max(...history.map((h) => h.score || 0))
        : 0;
    }
    if (interestEl) interestEl.textContent = profile.interest ? profile.interest.replace(/_/g, " ") : "-";
    if (levelEl) levelEl.textContent = `Level: ${(profile.level || "beginner").charAt(0).toUpperCase() + (profile.level || "beginner").slice(1)}`;

    if (recentList) {
      recentList.innerHTML = "";
      if (!history || history.length === 0) {
        recentList.appendChild(document.createTextNode("No sessions yet. Start your first practice!"));
        recentList.className = "recent-list empty";
        return;
      }
      recentList.className = "recent-list";
      history.slice(0, 5).forEach((session) => {
        const item = document.createElement("div");
        item.className = "breakdown-item";
        const date = new Date(session.date).toLocaleDateString(undefined, { month: "short", day: "numeric" });
        const tagClass = session.score >= 80 ? "matched" : session.score >= 60 ? "" : "omitted";
        item.innerHTML = `<span class="breakdown-word">${this.escapeHtml(session.topic || "Practice")}</span>
          <span class="breakdown-tag ${tagClass}">${session.score}</span>
          <span style="color:var(--text-muted);font-size:0.8rem;margin-left:auto;">${date}</span>`;
        recentList.appendChild(item);
      });
    }
  },

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  },

  prepareKaraoke(container, paragraph) {
    container.innerHTML = "";
    const words = paragraph.split(/\s+/);
    words.forEach((w, i) => {
      const span = document.createElement("span");
      span.textContent = w;
      span.id = `word-${i}`;
      span.dataset.index = i;
      span.className = "karaoke-word";
      span.tabIndex = 0;
      span.setAttribute("role", "button");
      span.setAttribute("aria-label", `Word ${i + 1}: ${w}`);
      container.appendChild(span);
      if (i < words.length - 1) container.appendChild(document.createTextNode(" "));
    });
  },

  setRecordingState(button, labelEl, recording) {
    if (recording) {
      button.classList.add("recording");
      if (labelEl) labelEl.textContent = "Listening…";
    } else {
      button.classList.remove("recording");
      if (labelEl) labelEl.textContent = "Record Voice";
    }
  },

  setWaveVisible(el, visible) {
    if (!el) return;
    el.classList.toggle("hidden", !visible);
  },

  showTooltip(el, word, vocab) {
    const tooltip = document.getElementById("word-tooltip");
    const wordEl = document.getElementById("tooltip-word");
    const urduEl = document.getElementById("tooltip-urdu");
    const synEl = document.getElementById("tooltip-synonym");
    const exEl = document.getElementById("tooltip-example");
    const playBtn = document.getElementById("tooltip-play");
    if (!tooltip || !wordEl || !urduEl || !synEl || !exEl || !playBtn) return;

    wordEl.textContent = word;
    urduEl.textContent = vocab ? vocab.urdu : "";
    synEl.textContent = vocab ? `Synonym: ${vocab.synonym}` : "";
    exEl.textContent = vocab ? `Example: ${vocab.example}` : "";

    playBtn.onclick = (e) => {
      e.stopPropagation();
      if (window.__speakflow_onWordPronounce) window.__speakflow_onWordPronounce(word);
    };

    const rect = el.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width / 2}px`;
    tooltip.style.top = `${rect.top - 12}px`;
    tooltip.classList.add("visible");
  },

  hideTooltip() {
    const tooltip = document.getElementById("word-tooltip");
    if (tooltip) tooltip.classList.remove("visible");
  }
};
