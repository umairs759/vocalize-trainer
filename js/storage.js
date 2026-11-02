/* ============================================================
   SpeakFlow — Local Persistence & Resilience (js/storage.js)
   Schema-validated, try/catch wrapped, private-browsing safe.
   Keys: speakflow_profile, speakflow_streak, speakflow_history
   ============================================================ */

const PROFILE_KEY = "speakflow_profile";
const STREAK_KEY  = "speakflow_streak";
const HISTORY_KEY = "speakflow_history";
const SCHEMA_VERSION = 1;

const defaultProfile = {
  name: "",
  age: 0,
  interest: "daily_life",
  level: "beginner",
  streakCount: 0
};

const defaultStreak = { count: 0, lastActiveDate: "" };

function defaultState() {
  return {
    schemaVersion: SCHEMA_VERSION,
    profile: { ...defaultProfile },
    streak: { ...defaultStreak },
    history: []
  };
}

function isValidState(state) {
  if (!state || typeof state !== "object") return false;
  if (!state.profile || typeof state.profile !== "object") return false;
  if (!state.streak || typeof state.streak !== "object") return false;
  if (!Array.isArray(state.history)) return false;
  return true;
}

function migrate(state) {
  if (state.schemaVersion !== SCHEMA_VERSION) {
    state.schemaVersion = SCHEMA_VERSION;
    state.profile = { ...defaultProfile, ...state.profile };
    state.streak  = { ...defaultStreak,  ...state.streak };
    state.history = Array.isArray(state.history) ? state.history : [];
  }
  return state;
}

const storage = {
  read() {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      if (!isValidState(parsed)) return defaultState();
      return migrate(parsed);
    } catch (err) {
      console.warn("[storage] read failed", err);
      return defaultState();
    }
  },

  write(state) {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(state));
      return true;
    } catch (err) {
      console.warn("[storage] write failed (quota / private mode)", err);
      return false;
    }
  },

  getUserProfile() {
    return this.read().profile;
  },

  saveUserProfile(profile) {
    const state = this.read();
    state.profile = { ...defaultProfile, ...profile };
    return this.write(state);
  },

  updateStreak() {
    const state = this.read();
    const today = new Date().toISOString().slice(0, 10);

    if (state.streak.lastActiveDate === today) {
      return this.write(state);
    }

    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    state.streak.count = state.streak.lastActiveDate === yesterday
      ? state.streak.count + 1
      : 1;
    state.streak.lastActiveDate = today;
    state.profile.streakCount = state.streak.count;
    return this.write(state);
  },

  saveSessionScore(session) {
    const state = this.read();
    const entry = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      date: new Date().toISOString(),
      ...session
    };
    state.history = [entry, ...state.history].slice(0, 50);
    return this.write(state);
  },

  getHistory() {
    return this.read().history;
  },

  clear() {
    try {
      localStorage.removeItem(PROFILE_KEY);
    } catch (err) {
      console.warn("[storage] clear failed", err);
    }
  }
};

export default storage;
