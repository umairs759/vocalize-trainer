/* ============================================================
   SpeakFlow — Consolidated Standalone Application (js/app.js)
   Single self-contained file — NO imports, NO exports.
   Guaranteed to execute on GitHub Pages without module crashes.
   ============================================================ */

// ============================================================
// SPEAKFLOW CORE DATA & CONFIGURATION
// ============================================================

// Interest labels (matching HTML chip values)
var INTEREST_LABELS = {
  tech: "Tech",
  daily_life: "Daily Life",
  business: "Business",
  fitness: "Fitness",
  cinema: "Cinema"
};

// Level labels
var LEVEL_LABELS = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced"
};

// Default profile
var defaultProfile = {
  name: "",
  age: 0,
  interest: "daily_life",
  level: "beginner",
  streakCount: 0
};

// ============================================================
// TOPICS DATABASE (15 scenarios across 5 interests × 3 levels)
// ============================================================

var topics = {
  beginner: {
    tech: [
      {
        id: "beginner-tech-smartphone",
        title: "My Smartphone",
        interest: "tech",
        level: "beginner",
        paragraph:
          "I use my smartphone every day. It helps me talk to my friends and family. I can take photos and watch videos on it. My phone also tells me the weather and the latest news.",
        vocabulary: [
          { word: "smartphone", urdu: "سمارٹ فون", synonym: "mobile phone", example: "I bought a new smartphone." },
          { word: "friends", urdu: "دوست", synonym: "pals", example: "I meet my friends on weekends." },
          { word: "photos", urdu: "تصاویر", synonym: "pictures", example: "I like taking photos." },
          { word: "weather", urdu: "موسم", synonym: "climate", example: "The weather is sunny today." },
          { word: "news", urdu: "خبریں", synonym: "updates", example: "I read the news every morning." }
        ]
      }
    ],
    daily_life: [
      {
        id: "beginner-daily-breakfast",
        title: "My Breakfast",
        interest: "daily_life",
        level: "beginner",
        paragraph:
          "Every morning I eat a healthy breakfast. I drink a glass of milk and eat an egg with toast. Fruits give me energy for the whole day. I feel fresh after breakfast.",
        vocabulary: [
          { word: "breakfast", urdu: "ناشتہ", synonym: "morning meal", example: "Breakfast is my favorite meal." },
          { word: "milk", urdu: "دودھ", synonym: "dairy", example: "I drink milk daily." },
          { word: "fruits", urdu: "پھل", synonym: "produce", example: "Fruits are healthy." },
          { word: "energy", urdu: "توانائی", synonym: "power", example: "I have lots of energy." }
        ]
      }
    ],
    business: [
      {
        id: "beginner-business-meeting",
        title: "The Morning Meeting",
        interest: "business",
        level: "beginner",
        paragraph:
          "We have a meeting every Monday at nine o'clock. The manager talks about the new project. Everyone shares their ideas and updates. We finish the meeting by eleven.",
        vocabulary: [
          { word: "meeting", urdu: "میٹنگ", synonym: "gathering", example: "We have a team meeting." },
          { word: "manager", urdu: "منیجر", synonym: "supervisor", example: "Our manager is kind." },
          { word: "project", urdu: "پروجیکٹ", synonym: "plan", example: "The project is due soon." },
          { word: "ideas", urdu: "ایدیاز", synonym: "thoughts", example: "She has good ideas." }
        ]
      }
    ],
    fitness: [
      {
        id: "beginner-fitness-walk",
        title: "Morning Walk",
        interest: "fitness",
        level: "beginner",
        paragraph:
          "I walk for thirty minutes every morning. It keeps my heart healthy and my mind clear. I wear comfortable shoes and carry a bottle of water. Walking makes me active all day.",
        vocabulary: [
          { word: "walk", urdu: "سیر", synonym: "stroll", example: "I go for a walk." },
          { word: "healthy", urdu: "tandrust", synonym: "fit", example: "I eat healthy food." },
          { word: "shoes", urdu: "جوتے", synonym: "footwear", example: "My shoes are new." },
          { word: "water", urdu: "پانی", synonym: "liquid", example: "Drink more water." }
        ]
      }
    ],
    cinema: [
      {
        id: "beginner-cinema-movie",
        title: "My Favorite Movie",
        interest: "cinema",
        level: "beginner",
        paragraph:
          "I love watching movies in my free time. The story was exciting and the actors were great. I watched it with my family and we talked about it afterward. It was a wonderful experience.",
        vocabulary: [
          { word: "movie", urdu: "مموری", synonym: "film", example: "I watched a movie." },
          { word: "story", urdu: "کاہانی", synonym: "tale", example: "The story was good." },
          { word: "actors", urdu: "آکرز", synonym: "performers", example: "The actors were great." },
          { word: "family", urdu: "خاندان", synonym: "relatives", example: "I watched with family." },
          { word: "experience", urdu: "تجربه", synonym: "experience", example: "A wonderful experience." }
        ]
      }
    ]
  },
  intermediate: {
    tech: [
      {
        id: "intermediate-tech-apps",
        title: "Mobile Apps",
        interest: "tech",
        level: "intermediate",
        paragraph:
          "Mobile apps have become part of our daily routine. We use them to order food, book rides, and chat with friends. Some apps help us learn new languages every day. A good app should be fast and easy to use.",
        vocabulary: [
          { word: "routine", urdu: "روزانہ کا کام", synonym: "habit", example: "It is my daily routine." },
          { word: "language", urdu: "زبان", synonym: "tongue", example: "I learn a new language." },
          { word: "easy", urdu: "آسان", synonym: "simple", example: "This app is easy." },
          { word: "fast", urdu: "tez", synonym: "quick", example: "The service is fast." }
        ]
      }
    ],
    daily_life: [
      {
        id: "intermediate-daily-cooking",
        title: "Cooking Dinner",
        interest: "daily_life",
        level: "intermediate",
        paragraph:
          "Cooking dinner is my favorite way to relax after work. I chop vegetables and stir them in a hot pan. The smell of spices fills the whole kitchen. My family always praises the taste of the food.",
        vocabulary: [
          { word: "vegetables", urdu: "سبزیاں", synonym: "produce", example: "I eat vegetables." },
          { word: "spices", urdu: "مسالے", synonym: "seasoning", example: "Spices add flavor." },
          { word: "kitchen", urdu: "باورچی خانہ", synonym: "cookroom", example: "I work in the kitchen." },
          { word: "taste", urdu: "ذائقہ", synonym: "flavor", example: "The taste is great." }
        ]
      }
    ],
    business: [
      {
        id: "intermediate-business-email",
        title: "Writing Emails",
        interest: "business",
        level: "intermediate",
        paragraph:
          "Writing clear emails is essential in a modern office. I always start with a polite greeting and state the purpose early. Short paragraphs make the message easier to read. I proofread before I click send.",
        vocabulary: [
          { word: "essential", urdu: "لازمے", synonym: "necessary", example: "Water is essential." },
          { word: "greeting", urdu: "سلام", synonym: "salutation", example: "A polite greeting." },
          { word: "purpose", urdu: "مقصد", synonym: "aim", example: "What is the purpose?" },
          { word: "proofread", urdu: "پروف ریڈ کرنا", synonym: "check", example: "I proofread my email." }
        ]
      }
    ],
    fitness: [
      {
        id: "intermediate-fitness-gym",
        title: "Gym Routine",
        interest: "fitness",
        level: "intermediate",
        paragraph:
          "I go to the gym three times a week to stay fit. Lifting weights makes my muscles stronger over time. I drink plenty of water between sets to stay hydrated. A good workout leaves me tired but satisfied.",
        vocabulary: [
          { word: "gym", urdu: "جیْم", synonym: "fitness center", example: "I go to the gym." },
          { word: "weights", urdu: "وزن", synonym: "dumbbells", example: "I lift weights." },
          { word: "muscles", urdu: "پٹھے", synonym: "flesh", example: "Strong muscles." },
          { word: "hydrated", urdu: "پانی پرور", synonym: "moist", example: "Stay hydrated." }
        ]
      }
    ],
    cinema: [
      {
        id: "intermediate-cinema-review",
        title: "Movie Review",
        interest: "cinema",
        level: "intermediate",
        paragraph:
          "The film I saw last week had an amazing soundtrack and beautiful cinematography. The plot kept me guessing until the very end. I would highly recommend it to anyone who enjoys thoughtful drama. The direction was superb.",
        vocabulary: [
          { word: "soundtrack", urdu: "اساؤنڈ ٹرک", synonym: "music", example: "The soundtrack was great." },
          { word: "cinematography", urdu: "سینیمائوگرافی", synonym: "photography", example: "Beautiful shots." },
          { word: "plot", urdu: "quet", synonym: "story", example: "The plot was tight." },
          { word: "highly", urdu: "زیادہ", synonym: "very", example: "I highly recommend it." },
          { word: "recommend", urdu: "mosanِn", synonym: "suggest", example: "I recommend this." }
        ]
      }
    ]
  },
  advanced: {
    tech: [
      {
        id: "advanced-tech-ai",
        title: "Artificial Intelligence",
        interest: "tech",
        level: "advanced",
        paragraph:
          "Artificial intelligence is changing how we live and work. It can write text, generate images, and answer difficult questions. Many people worry about jobs, but AI also creates new opportunities. Learning to use AI wisely is an important skill today.",
        vocabulary: [
          { word: "artificial", urdu: "مصنوعی", synonym: "human-made", example: "Artificial intelligence." },
          { word: "intelligence", urdu: "ذہانت", synonym: "smartness", example: "Human intelligence." },
          { word: "opportunities", urdu: "موقع", synonym: "chances", example: "New opportunities." },
          { word: "skill", urdu: "ہنر", synonym: "ability", example: "A useful skill." },
          { word: "questions", urdu: "سوالات", synonym: "queries", example: "Difficult questions." }
        ]
      }
    ],
    daily_life: [
      {
        id: "advanced-daily-budget",
        title: "Managing a Budget",
        interest: "daily_life",
        level: "advanced",
        paragraph:
          "Managing a monthly budget requires discipline and careful planning. I track every expense in a spreadsheet to avoid overspending. Saving a small amount regularly builds a safety fund. Financial freedom starts with knowing where your money goes.",
        vocabulary: [
          { word: "budget", urdu: "بجٹ", synonym: "plan", example: "Monthly budget." },
          { word: "expense", urdu: "اخراجات", synonym: "cost", example: "Living expense." },
          { word: "saving", urdu: "بچت", synonym: "reserve", example: "Regular saving." },
          { word: "discipline", urdu: "انضباط", synonym: "control", example: "Self discipline." },
          { word: "freedom", urdu: "آزادی", synonym: "liberty", example: "Financial freedom." }
        ]
      }
    ],
    business: [
      {
        id: "advanced-business-negotiation",
        title: "Business Negotiation",
        interest: "business",
        level: "advanced",
        paragraph:
          "Successful negotiation requires listening more than speaking. I focus on creating value for both parties instead of winning alone. Patience and empathy often lead to better agreements. A signed contract is only the beginning of the relationship.",
        vocabulary: [
          { word: "negotiation", urdu: "مذاکرات", synonym: "discussion", example: "Business negotiation." },
          { word: "parties", urdu: "فریق", synonym: "sides", example: "Both parties agreed." },
          { word: "empathy", urdu: "ہمدردی", synonym: "understanding", example: "Show empathy." },
          { word: "agreement", urdu: "معاہدہ", synonym: "deal", example: "A legal agreement." },
          { word: "contract", urdu: "کنٹریکٹ", synonym: "pact", example: "Sign the contract." }
        ]
      }
    ],
    cinema: [
      {
        id: "advanced-cinema-classic",
        title: "Classic Cinema",
        interest: "cinema",
        level: "advanced",
        paragraph:
          "Classic cinema from the golden era continues to inspire modern filmmakers. The storytelling techniques developed decades ago are still studied today. I appreciate the artistry and craftsmanship of those early films. Their influence can be seen in contemporary works.",
        vocabulary: [
          { word: "classic", urdu: "پیشistory", synonym: "timeless", example: "A classic film." },
          { word: "cinema", urdu: "سینما", synonym: "film", example: "Cinema history." },
          { word: "filmmakers", urdu: "فلم_exec", synonym: "directors", example: "Modern filmmakers." },
          { word: "storytelling", urdu: "ursday", synonym: "narrative", example: "Story techniques." },
          { word: "influence", urdu: "تحریک", synonym: "impact", example: "Cultural influence." }
        ]
      }
    ]
  }
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function getRandomTopic(interest, level) {
  var levelKey = level; // level is already "beginner", "intermediate", or "advanced"
  var levelTopics = topics[levelKey];
  if (!levelTopics) return fallbackTopic();

  var pool = interest && levelTopics[interest]
    ? levelTopics[interest]
    : Object.values(levelTopics).flat();

  if (!pool || pool.length === 0) return fallbackTopic();

  var topic = pool[Math.floor(Math.random() * pool.length)];
  return {
    id: topic.id,
    title: topic.title,
    interest: topic.interest,
    level: topic.level,
    paragraph: topic.paragraph,
    vocabulary: (topic.vocabulary || []).map(function(v) { return { word: v.word, urdu: v.urdu, synonym: v.synonym, example: v.example }; })
  };
}

function fallbackTopic() {
  return {
    id: "fallback-daily",
    title: "Daily Practice",
    interest: "daily_life",
    level: "beginner",
    paragraph:
      "Practice makes perfect. Speak a little every day and your English will improve. Be patient with yourself and enjoy the journey of learning.",
    vocabulary: [
      { word: "practice", urdu: "مشق", synonym: "rehearsal", example: "Daily practice helps." },
      { word: "improve", urdu: "بہتر ہونا", synonym: "get better", example: "I want to improve." },
      { word: "patient", urdu: "صبور", synonym: "calm", example: "Be patient." }
    ]
  };
}

// ============================================================
// SPEECH SYNTHESIS ENGINE (Karaoke & TTS)
// ============================================================

var speechEngine = {
  supported: !!window.speechSynthesis,

  isSpeaking: function() {
    return synthesisSupported && synth.speaking;
  },

  stop: function() {
    if (synthesisSupported) {
      try { synth.cancel(); } catch (e) { console.warn("[speech-engine] cancel failed", e); }
    }
    wordSpans = [];
    activeIndex = -1;
  },

  speak: function(container, paragraph, rate, onWordHighlight, onEnd) {
    this.stop();

    if (!synthesisSupported) {
      if (onEnd) onEnd();
      return;
    }

    container.innerHTML = "";
    var words = paragraph.split(/\s+/);

    wordSpans = words.map(function(w, i) {
      var span = document.createElement("span");
      span.textContent = w;
      span.id = "word-" + i;
      span.dataset.index = i;
      span.className = "karaoke-word";
      span.setAttribute("role", "button");
      span.setAttribute("aria-label", "Word " + (i + 1) + ": " + w);
      span.tabIndex = 0;

      span.addEventListener("click", function(e) {
        e.stopPropagation();
        window.__speakflow_onWordTap?(w, i, span);
      });

      span.addEventListener("keydown", function(e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          span.click();
        }
      });

      container.appendChild(span);
      if (i < words.length - 1) container.appendChild(document.createTextNode(" "));
      return span;
    });

    var currentUtterance = null;
    var activeIndex = -1;

    var utterance = new SpeechSynthesisUtterance(paragraph);
    utterance.rate = rate || 1;
    utterance.lang = "en-US";

    utterance.onboundary = function(event) {
      if (event.name !== "word" && event.name !== "sentence") return;
      var charIndex = event.charIndex;
      var cumulative = 0;
      var idx = -1;

      for (var i = 0; i < words.length; i++) {
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

        try {
          wordSpans[idx].scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
        } catch (e) { console.warn("[speech-engine] scrollIntoView failed", e); }

        if (onWordHighlight) onWordHighlight(words[idx], idx);
      }
    };

    utterance.onend = function() {
      speechEngine.clearHighlights();
      currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = function(err) {
      console.warn("[speech-engine] utterance error", err);
      speechEngine.clearHighlights();
      currentUtterance = null;
      if (onEnd) onEnd();
    };

    try {
      synth.speak(utterance);
      currentUtterance = utterance;
    } catch (err) {
      console.warn("[speech-engine] speak failed", err);
      speechEngine.clearHighlights();
      if (onEnd) onEnd();
    }
  },

  clearHighlights: function() {
    wordSpans.forEach(function(span) { span.classList.remove("karaoke-active"); });
    wordSpans = [];
    activeIndex = -1;
  }
};

// Global synth reference
var synth = window.speechSynthesis;
var synthesisSupported = !!synth;

// ============================================================
// SPEECH RECOGNITION ENGINE
// ============================================================

var scorer = {
  supported: !!window.SpeechRecognition || !!window.webkitSpeechRecognition,

  recognize: function(options) {
    var RecCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!RecCtor) {
      if (options.onError) options.onError(new Error("Speech recognition not supported"));
      return null;
    }

    var recognizer = new RecCtor();
    recognizer.continuous = true;
    recognizer.interimResults = true;
    recognizer.lang = "en-US";

    var finalTranscript = "";

    recognizer.onresult = function(event) {
      var interim = "";
      for (var i = event.resultIndex; i < event.results.length; i++) {
        var transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += (finalTranscript ? " " : "") + transcript;
        } else {
          interim += transcript;
        }
      }
      if (options.onResult) options.onResult({ final: finalTranscript, interim });
    };

    recognizer.onend = function() {
      if (options.onEnd) options.onEnd(finalTranscript);
    };

    recognizer.onerror = function(event) {
      if (options.onError) options.onError(event);
    };

    try {
      recognizer.start();
    } catch (err) {
      if (options.onError) options.onError(err);
      return null;
    }

    return recognizer;
  }
};

// ============================================================
// SCORING ENGINE (3-Pillar: Accuracy, WPM, Fillers)
// ============================================================

var FILLER_WORDS = ["um", "uh", "hmm", "ah", "like", "you know", "I mean", "basically", "actually", "literally", "okay", "right", "so", "well"];

function tokenize(text) {
  if (!text) return [];
  return String(text)
    .toLowerCase()
    .replace(/[.,;:!?"'()\[\]{}\\/-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(function(bool) { return bool; });
}

function wordDiff(target, spoken) {
  var m = target.length;
  var n = spoken.length;
  var dp = [];

  for (var i = 0; i <= m; i++) dp[i] = [];
  for (var j = 0; j <= n; j++) dp[0][j] = j;
  for (var i = 1; i <= m; i++) dp[i][0] = i;

  for (var i = 1; i <= m; i++) {
    for (var j = 1; j <= n; j++) {
      if (target[i - 1] === spoken[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1;
      }
    }
  }

  var matched = [];
  var omitted = [];
  var mispronounced = [];

  var i = m;
  var j = n;
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

function scoreParagraph(targetParagraph, transcript, durationSeconds) {
  var targetWords = tokenize(targetParagraph);
  var spokenWords = tokenize(transcript);

  var diff = wordDiff(targetWords, spokenWords);
  var matchedCount = diff.matched.length;
  var targetCount = targetWords.length;

  // Accuracy pillar (0-50)
  var accuracyRaw = targetCount > 0 ? matchedCount / targetCount : 0;
  var accuracyScore = Math.round(accuracyRaw * 50);

  // Pace pillar (0-30)
  var minutes = Math.max(durationSeconds / 60, 0.01);
  var wpm = Math.round(spokenWords.length / minutes);

  var paceScore;
  if (wpm >= 110 && wpm <= 150) paceScore = 30;
  else if (wpm >= 80 && wpm <= 170) paceScore = 22;
  else paceScore = 14;

  // Filler pillar (0-20)
  var fillerCount = spokenWords.filter(function(w) { return FILLER_WORDS.includes(w); }).length;
  var fluencyScore = Math.max(0, 20 - fillerCount * 3);

  var total = Math.round(
    Math.min(100, Math.max(0, accuracyScore + paceScore + fluencyScore))
  );

  var wordsReview = targetWords.map(function(w) {
    if (diff.matched.includes(w)) return { word: w, status: "correct" };
    if (diff.mispronounced.includes(w)) return { word: w, status: "mispronounced" };
    return { word: w, status: "omitted" };
  });

  return {
    score: total,
    accuracy: Math.round(accuracyRaw * 100),
    accuracyScore: accuracyScore,
    wpm: wpm,
    paceScore: paceScore,
    fluencyScore: fluencyScore,
    fillerCount: fillerCount,
    fillerPenalty: Math.min(20, fillerCount * 3),
    matched: diff.matched,
    omitted: diff.omitted,
    mispronounced: diff.mispronounced,
    wordsReview: wordsReview,
    feedback: buildFeedback(total, accuracyRaw, wpm, fillerCount)
  };
}

function buildFeedback(total, accuracyRaw, wpm, fillerCount) {
  var fb = [];
  if (total >= 80) fb.push("Excellent fluency — keep it up!");
  else if (total >= 60) fb.push("Good progress — a little more practice will sharpen it.");
  else fb.push("Keep practicing — focus on the words highlighted below.");

  if (accuracyRaw < 0.6) fb.push("Replay the native audio and shadow it.");
  if (wpm < 80) fb.push("Pace is slow — try speaking a touch faster.");
  if (wpm > 170) fb.push("Pace is fast — slow down for clearer pronunciation.");
  if (fillerCount > 2) fb.push("Reduce filler words like 'um' and 'like'.");
  return fb;
}

// ============================================================
// STORY CARD EXPORT (html2canvas + confetti)
// ============================================================

var storyCard = {
  container: null,

  init: function() {
    this.container = document.getElementById("story-card-container");
  },

  render: function(data) {
    if (!this.container) this.init();
    var card = this.container.querySelector("#story-card");
    if (!card) return;

    var nameEl = this.container.querySelector("#story-name");
    var dateEl = this.container.querySelector("#story-date");
    var topicEl = this.container.querySelector("#story-topic");
    var badgeEl = this.container.querySelector("#story-badge");
    var scoreEl = this.container.querySelector("#story-score");
    var ringEl = this.container.querySelector("#story-ring");
    var wpmEl = this.container.querySelector("#story-wpm");
    var accEl = this.container.querySelector("#story-accuracy");
    var lvlEl = this.container.querySelector("#story-level");

    if (nameEl) nameEl.textContent = data.name || "Speaker";
    if (dateEl) dateEl.textContent = data.date || new Date().toLocaleDateString();
    if (topicEl) topicEl.textContent = data.topic || "-";
    if (badgeEl) badgeEl.textContent = data.badge || "Rising Speaker";
    if (scoreEl) scoreEl.textContent = data.score != null ? data.score : "0";

    if (ringEl) {
      var circumference = 2 * Math.PI * 38;
      var offset = circumference - ((data.score || 0) / 100) * circumference;
      ringEl.style.strokeDashoffset = offset;
    }

    if (wpmEl) wpmEl.textContent = data.wpm != null ? data.wpm + " WPM" : "- WPM";
    if (accEl) accEl.textContent = data.accuracy != null ? data.accuracy + "% Accuracy" : "- Accuracy";
    if (lvlEl) lvlEl.textContent = data.level || "-";
  },

  open: function() {
    if (!this.container) return;
    this.container.classList.remove("hidden");
    this.container.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  },

  close: function() {
    if (!this.container) return;
    this.container.classList.add("hidden");
    this.container.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  },

  export: function(data) {
    if (!this.container) this.init();
    var card = this.container.querySelector("#story-card");
    if (!card) { console.warn("[story-card] card element not found"); return; }

    html2canvas(card, {
      scale: 2,
      backgroundColor: "#0f0c29",
      logging: false,
      useCORS: true
    }).then(function(canvas) {
      var link = document.createElement("a");
      link.download = "speakflow-story-" + Date.now() + ".png";
      link.href = canvas.toDataURL("image/png");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Confetti for scores >= 80
      if (data && data.score >= 80) {
        try {
          confetti({
            particleCount: 140,
            spread: 80,
            origin: { y: 0.55 },
            colors: ["#a855f7", "#22d3ee", "#ffeb3b"]
          });
        } catch (e) { console.warn("[story-card] confetti failed", e); }
      }
    }).catch(function(err) {
      console.warn("[story-card] html2canvas failed", err);
    });
  }
};

// ============================================================
// UI CONTROLLER (View switching, chips, toasts)
// ============================================================

var ui = {
  showView: function(viewId) {
    var views = document.querySelectorAll(".view");
    views.forEach(function(v) { v.style.display = "none"; v.classList.remove("active-view"); });
    var target = document.getElementById(viewId);
    if (target) {
      target.style.display = "block";
      target.classList.add("active-view");
      window.scrollTo(0, 0);
    }
  },

  toast: function(options) {
    var container = document.getElementById("toast-container");
    if (!container) return;

    var el = document.createElement("div");
    el.className = "toast " + (options.type || "info");
    el.textContent = options.message || "Operation completed";
    container.appendChild(el);

    setTimeout(function() {
      el.style.opacity = "0";
      el.style.transform = "translateX(20px)";
      setTimeout(function() { el.remove(); }, 300);
    }, options.duration || 3000);
  },

  escapeHtml: function(text) {
    var div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  },

  prepareKaraoke: function(container, paragraph) {
    container.innerHTML = "";
    var words = paragraph.split(/\s+/);
    words.forEach(function(w, i) {
      var span = document.createElement("span");
      span.textContent = w;
      span.id = "word-" + i;
      span.dataset.index = i;
      span.className = "karaoke-word";
      span.setAttribute("role", "button");
      span.setAttribute("aria-label", "Word " + (i + 1) + ": " + w);
      span.tabIndex = 0;
      container.appendChild(span);
      if (i < words.length - 1) container.appendChild(document.createTextNode(" "));
    });
  },

  setRecordingState: function(button, labelEl, recording) {
    if (recording) {
      button.classList.add("recording");
      if (labelEl) labelEl.textContent = "Listening…";
    } else {
      button.classList.remove("recording");
      if (labelEl) labelEl.textContent = "Record Voice";
    }
  },

  setWaveVisible: function(el, visible) {
    if (!el) return;
    el.classList.toggle("hidden", !visible);
  }
};

// ============================================================
// CHIP SELECT HANDLER (Fail-Safe, Global Delegation)
// ============================================================

document.addEventListener('click', function(e) {
  var chip = e.target.closest('.chip');
  if (!chip) return;

  var group = chip.closest('.chip-group');
  if (!group) return;

  // Remove selection from all chips in the same group
  group.querySelectorAll('.chip').forEach(function(c) {
    c.classList.remove('chip-selected', 'active');
    c.style.background = '';
    c.style.color = '';
  });

  // Activate clicked chip with forced inline styling
  chip.classList.add('chip-selected', 'active');
  chip.style.background = '#a855f7';
  chip.style.color = '#ffffff';

  // Sync to hidden input or dataset
  var value = chip.getAttribute('data-value') || chip.textContent.trim().toLowerCase();

  if (group.id.includes('interest')) {
    var obInterest = document.getElementById('ob-interest');
    if (obInterest) obInterest.value = value;
    group.setAttribute('data-selected', value);
  } else if (group.id.includes('level')) {
    var obLevel = document.getElementById('ob-level');
    if (obLevel) obLevel.value = value;
    group.setAttribute('data-selected', value);
  }
});

// ============================================================
// START SPEAKING BUTTON HANDLER
// ============================================================

document.addEventListener('click', function(e) {
  var btn = e.target.closest('#ob-submit, button[type="button"]');
  if (!btn) return;

  // Must contain "Start Speaking" text
  if (btn.textContent.indexOf('Start Speaking') === -1) return;

  e.preventDefault();

  // Read selected interest and level from chip groups
  var interestGroup = document.getElementById('ob-interest-group');
  var levelGroup = document.getElementById('ob-level-group');

  var selectedInterest = interestGroup ?
    interestGroup.querySelector('.chip.chip-selected, .chip.active') : null;

  var selectedLevel = levelGroup ?
    levelGroup.querySelector('.chip.chip-selected, .chip.active') : null;

  var interestText = selectedInterest ? selectedInterest.textContent.trim() : '';
  var levelText = selectedLevel ? selectedLevel.textContent.trim() : '';

  // Validation: both must be selected
  if (!interestText || !levelText) {
    alert('Please select both an Interest and a Target Level!');
    if (selectedInterest && interestGroup) interestGroup.classList.add('error-shake');
    if (!interestText && interestGroup) {
      var ig = document.getElementById('ob-interest-group');
      if (ig) ig.classList.add('error-shake');
    }
    if (!levelText && levelGroup) {
      var lg = document.getElementById('ob-level-group');
      if (lg) lg.classList.add('error-shake');
    }
    setTimeout(function() {
      if (interestGroup) interestGroup.classList.remove('error-shake');
      if (levelGroup) levelGroup.classList.remove('error-shake');
    }, 800);
    return;
  }

  // Save profile to localStorage
  var nameInput = document.getElementById('ob-name');
  var name = nameInput ? nameInput.value.trim() : 'Speaker';

  var profile = {
    name: name,
    interest: interestText.toLowerCase(),
    level: levelText.toLowerCase(),
    streakCount: 0
  };
  try {
    localStorage.setItem('speakflow_profile', JSON.stringify(profile));
  } catch (e) {}

  // Switch views: hide onboarding, show practice
  var obView = document.getElementById('view-onboarding');
  var dashboardView = document.getElementById('view-dashboard');
  var practiceView = document.getElementById('view-practice');

  if (obView) obView.style.display = 'none';
  if (dashboardView) dashboardView.classList.add('active-view');
  if (practiceView) {
    practiceView.style.display = 'block';
    practiceView.classList.add('active-view');
  }

  // Auto-load a topic based on selected interest & level
  var interestLower = interestText.toLowerCase();
  var levelLower = levelText.toLowerCase();
  var selectedTopic = getRandomTopic(interestLower, levelLower);

  // Update Practice UI
  var topicTitle = document.getElementById('prac-topic-title');
  if (topicTitle) topicTitle.textContent = selectedTopic.title;

  var levelBadge = document.getElementById('prac-level-badge');
  if (levelBadge) levelBadge.textContent = LEVEL_LABELS[levelLower] || levelText;

  var interestBadge = document.getElementById('prac-interest-badge');
  if (interestBadge) interestBadge.textContent = INTEREST_LABELS[interestLower] || interestText;

  // Update topic paragraph for karaoke
  var karaokeContainer = document.getElementById('karaoke-paragraph');
  if (karaokeContainer) {
    ui.prepareKaraoke(karaokeContainer, selectedTopic.paragraph);
  }

  // Update diagnostic display
  var topicLevel = document.getElementById('prac-level-badge');
  var topicInterest = document.getElementById('prac-interest-badge');
  if (topicLevel) topicLevel.textContent = LEVEL_LABELS[levelLower] || levelText;
  if (topicInterest) topicInterest.textContent = INTEREST_LABELS[interestLower] || interestText;
});

// ============================================================
// ERROR HANDLING & VERSION INFO
// ============================================================

console.log("SpeakFlow v4.0 Loaded — Standalone JS (no module crashes)");

// Ensure chips have minimum styling on page load
document.addEventListener('DOMContentLoaded', function() {
  var chips = document.querySelectorAll('.chip');
  chips.forEach(function(chip) {
    chip.style.transition = 'background 0.2s, color 0.2s';
  });
});

// Fallback: if localStorage fails, just continue
try { localStorage.setItem('_speakflow_test', 'ok'); localStorage.removeItem('_speakflow_test'); } catch(e) {}

// Make globals available
window.SpeakFlow = {
  INTEREST_LABELS: INTEREST_LABELS,
  LEVEL_LABELS: LEVEL_LABELS,
  defaultProfile: defaultProfile,
  getRandomTopic: getRandomTopic,
  scoreParagraph: scoreParagraph,
  speechEngine: speechEngine,
  ui: ui
};