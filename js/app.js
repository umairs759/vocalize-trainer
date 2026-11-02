/* ============================================================
   SpeakFlow — Consolidated Standalone Application (js/app.js)
   Single self-contained file — NO imports, NO exports.
   Version: v6.0 Fully Interactive Live
   ============================================================ */

// ============================================================
// LABELS & CONFIG
// ============================================================

var INTEREST_LABELS = {
  tech: "Tech",
  daily_life: "Daily Life",
  business: "Business",
  fitness: "Fitness",
  cinema: "Cinema"
};

var LEVEL_LABELS = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced"
};

// ============================================================
// GLOBAL STATE
// ============================================================

var currentActiveTopic = null;
var currentPlaybackRate = 1.0;
var currentTranscript = "";
var recognizer = null;
var isRecording = false;
var recordingStartTime = null;
var currentUtterance = null;

// ============================================================
// KEY NORMALIZATION
// ============================================================

function normalizeKey(str) {
  if (!str) return '';
  return str.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
}

// ============================================================
// MULTI-TOPIC DYNAMIC DATABASE (45+ unique scenarios: 5 × 3 × 3)
// ============================================================

var TOPIC_DATABASE = {
  daily_life: {
    beginner: [
      {
        title: "Morning Routine",
        paragraph: "I wake up early in the morning and drink a glass of warm water. Then I brush my teeth and prepare a quick healthy breakfast before starting my day.",
        vocab: { "healthy": { urdu: "صحت مند", synonym: "nutritious" }, "prepare": { urdu: "تیار کرنا", synonym: "make ready" } }
      },
      {
        title: "A Visit to the Market",
        paragraph: "Today I visited the local grocery market to buy fresh vegetables, fruits, and bread. The streets were busy and filled with friendly neighborhood vendors.",
        vocab: { "grocery": { urdu: "کریانہ", synonym: "food store" }, "vendors": { urdu: "دکاندار", synonym: "sellers" } }
      },
      {
        title: "My Favorite Weekend",
        paragraph: "On weekends, I love relaxing at home with my family. We cook a delicious lunch together, watch a favorite movie, and enjoy evening tea in our garden.",
        vocab: { "delicious": { urdu: "مزیدار", synonym: "tasty" }, "relaxing": { urdu: "سکون دہ", synonym: "resting" } }
      }
    ],
    intermediate: [
      {
        title: "Cooking a New Recipe",
        paragraph: "Last evening, I decided to try cooking pasta for the first time. I boiled water, added salt, and carefully stirred the noodles until they were soft enough to eat.",
        vocab: { "decided": { urdu: "فaisla کیا", synonym: "chose" }, "stirred": { urdu: "هيلایا", synonym: "mixed" } }
      },
      {
        title: "A Day at the Park",
        paragraph: "The park was full of children playing and dogs running around. I sat on a bench under a tree and read a novel while enjoying the gentle breeze.",
        vocab: { "novel": { urdu: "ناول", synonym: "book" }, "breeze": { urdu: "ہوا", synonym: "wind" } }
      },
      {
        title: "Grocery Shopping List",
        paragraph: "Before going to the store, I always write down a shopping list. Today I needed milk, eggs, sugar, and a few cleaning supplies for the kitchen.",
        vocab: { "supplies": { urdu: "سامان", synonym: "items" }, "cleaning": { urdu: "صفائی", synonym: "washing" } }
      }
    ],
    advanced: [
      {
        title: "Time Management Tips",
        paragraph: "Effective time management requires planning each day in advance. I use a calendar to block out hours for work, exercise, and quality time with my family.",
        vocab: { "effective": { urdu: "مؤثر", synonym: "successful" }, "advance": { urdu: "پہلے سے", synonym: "early" } }
      },
      {
        title: "The Art of Listening",
        paragraph: "Good listeners do not just wait for their turn to speak. They pay close attention to tone, body language, and the emotions behind every word spoken.",
        vocab: { "emotions": { urdu: "جذبات", synonym: "feelings" }, "attention": { urdu: "توجہ", synonym: "focus" } }
      },
      {
        title: "Urban Gardening",
        paragraph: "Many city dwellers now grow vegetables on their balconies. With proper sunlight, water, and care, even a small space can produce fresh herbs and tomatoes.",
        vocab: { "dwellers": { urdu: "باسی", synonym: "residents" }, "produce": { urdu: "پیدا کرنا", synonym: "grow" } }
      }
    ]
  },
  tech: {
    beginner: [
      {
        title: "My Smartphone",
        paragraph: "I use my smartphone every day. It helps me talk to my friends and family. I can take photos and watch videos on it. My phone also tells me the weather and the latest news.",
        vocab: { "smartphone": { urdu: "سمارٹ فون", synonym: "mobile phone" }, "weather": { urdu: "موسم", synonym: "climate" } }
      },
      {
        title: "Using a Laptop",
        paragraph: "My laptop is light and easy to carry. I use it for schoolwork, watching movies, and chatting with friends online. The battery lasts for several hours.",
        vocab: { "laptop": { urdu: "لیپ ٹاپ", synonym: "notebook" }, "battery": { urdu: "بیٹری", synonym: "power" } }
      },
      {
        title: "Connecting to Wi-Fi",
        paragraph: "To connect to the internet, I open the settings menu and choose the Wi-Fi network. After entering the password, the signal strength shows full bars.",
        vocab: { "password": { urdu: "پاس ورڈ", synonym: "code" }, "signal": { urdu: "سگنل", synonym: "connection" } }
      }
    ],
    intermediate: [
      {
        title: "Mobile Apps",
        paragraph: "Mobile apps have become part of our daily routine. We use them to order food, book rides, and chat with friends. Some apps help us learn new languages every day.",
        vocab: { "routine": { urdu: "روزانہ کا کام", synonym: "habit" }, "language": { urdu: "زبان", synonym: "tongue" } }
      },
      {
        title: "Online Shopping",
        paragraph: "Buying clothes online is convenient but sometimes the size does not fit. I always check the return policy before placing an order on a new website.",
        vocab: { "convenient": { urdu: "آسان", synonym: "easy" }, "policy": { urdu: "نظام", synonym: "rule" } }
      },
      {
        title: "Video Calls",
        paragraph: "Video calls let me see my family even when they live far away. We can talk face to face, share screens, and celebrate birthdays together virtually.",
        vocab: { "virtually": { urdu: "افتراضی طور پر", synonym: "online" }, "celebrate": { urdu: "منانا", synonym: "honor" } }
      }
    ],
    advanced: [
      {
        title: "Artificial Intelligence",
        paragraph: "Artificial intelligence is changing how we live and work. It can write text, generate images, and answer difficult questions. Learning to use AI wisely is an important skill today.",
        vocab: { "intelligence": { urdu: "ذہانت", synonym: "smartness" }, "opportunities": { urdu: "موقع", synonym: "chances" } }
      },
      {
        title: "Cybersecurity Basics",
        paragraph: "Protecting personal data online is more important than ever. I use strong passwords, enable two-factor authentication, and avoid clicking suspicious links.",
        vocab: { "authentication": { urdu: "تصدیق", synonym: "verification" }, "suspicious": { urdu: "شبہناک", synonym: "doubtful" } }
      },
      {
        title: "Cloud Storage",
        paragraph: "Cloud storage lets me save files on remote servers instead of my computer. I can access my photos and documents from any device with an internet connection.",
        vocab: { "servers": { urdu: "سرورز", synonym: "computers" }, "access": { urdu: "رسائی", synonym: "entry" } }
      }
    ]
  },
  business: {
    beginner: [
      {
        title: "The Morning Meeting",
        paragraph: "We have a meeting every Monday at nine o'clock. The manager talks about the new project. Everyone shares their ideas and updates. We finish the meeting by eleven.",
        vocab: { "manager": { urdu: "منیجر", synonym: "supervisor" }, "project": { urdu: "پروجیکٹ", synonym: "plan" } }
      },
      {
        title: "Writing an Email",
        paragraph: "I write emails to my colleagues every day. A good email has a clear subject line, a polite greeting, and a short message that gets to the point quickly.",
        vocab: { "colleagues": { urdu: "سہی WORKFLOW", synonym: "coworkers" }, "subject": { urdu: "موضوع", synonym: "topic" } }
      },
      {
        title: "Office Supplies",
        paragraph: "Our office needs new supplies every month. We order paper, pens, folders, and printer ink. Keeping track of inventory helps us avoid running out of essentials.",
        vocab: { "supplies": { urdu: "سامان", synonym: "items" }, "inventory": { urdu: "استOCK", synonym: "stock" } }
      }
    ],
    intermediate: [
      {
        title: "Writing Emails",
        paragraph: "Writing clear emails is essential in a modern office. I always start with a polite greeting and state the purpose early. Short paragraphs make the message easier to read.",
        vocab: { "essential": { urdu: "لازمی", synonym: "necessary" }, "purpose": { urdu: "مقصد", synonym: "aim" } }
      },
      {
        title: "Team Collaboration",
        paragraph: "Successful teams collaborate by sharing ideas openly and giving constructive feedback. Weekly check-ins help everyone stay aligned and motivated toward common goals.",
        vocab: { "constructive": { urdu: " تعمیراتی", synonym: "helpful" }, "aligned": { urdu: "ہم آہنگ", synonym: "united" } }
      },
      {
        title: "Project Deadlines",
        paragraph: "Meeting project deadlines requires good planning and daily progress tracking. If a task takes longer than expected, I inform the team leader immediately.",
        vocab: { "deadlines": { urdu: "آخری تاریخ", synonym: "limits" }, "progress": { urdu: "ترقی", synonym: "advancement" } }
      }
    ],
    advanced: [
      {
        title: "Business Negotiation",
        paragraph: "Successful negotiation requires listening more than speaking. I focus on creating value for both parties instead of winning alone. Patience and empathy lead to better agreements.",
        vocab: { "negotiation": { urdu: "مذاکرات", synonym: "discussion" }, "empathy": { urdu: "ہمدردی", synonym: "understanding" } }
      },
      {
        title: "Leadership Skills",
        paragraph: "Great leaders inspire their teams by setting a clear vision and leading by example. They delegate tasks wisely and trust their team members to deliver results.",
        vocab: { "vision": { urdu: "منظر", synonym: "goal" }, "delegate": { urdu: "وَکالت", synonym: "assign" } }
      },
      {
        title: "Market Expansion",
        paragraph: "Expanding into a new market requires research on local culture, customer preferences, and competition. A well-planned strategy reduces financial risk significantly.",
        vocab: { "preferences": { urdu: "ترجیح", synonym: "choices" }, "strategy": { urdu: "حکمت عملی", synonym: "plan" } }
      }
    ]
  },
  fitness: {
    beginner: [
      {
        title: "Morning Walk",
        paragraph: "I walk for thirty minutes every morning. It keeps my heart healthy and my mind clear. I wear comfortable shoes and carry a bottle of water. Walking makes me active all day.",
        vocab: { "healthy": { urdu: "صحت مند", synonym: "fit" }, "active": { urdu: "فعال", synonym: "energetic" } }
      },
      {
        title: "Drinking Water",
        paragraph: "Drinking enough water is important for good health. I carry a water bottle with me everywhere and try to drink at least eight glasses every day.",
        vocab: { "bottle": { urdu: "بوتل", synonym: "container" }, "glasses": { urdu: "گلس", synonym: "cups" } }
      },
      {
        title: "Stretching Exercises",
        paragraph: "Before I start my day, I do simple stretching exercises for five minutes. This helps my muscles feel relaxed and prevents soreness after physical activity.",
        vocab: { "stretching": { urdu: "مڑna", synonym: "extending" }, "soreness": { urdu: "درد", synonym: "pain" } }
      }
    ],
    intermediate: [
      {
        title: "Gym Routine",
        paragraph: "I go to the gym three times a week to stay fit. Lifting weights makes my muscles stronger over time. I drink plenty of water between sets to stay hydrated.",
        vocab: { "gym": { urdu: "جیِم", synonym: "fitness center" }, "hydrated": { urdu: "پانی پرور", synonym: "moist" } }
      },
      {
        title: "Running Outdoors",
        paragraph: "Running in the park is better than using a treadmill. The fresh air and natural scenery keep me motivated. I usually run for about thirty minutes.",
        vocab: { "treadmill": { urdu: "دौڑنے کی مشین", synonym: "running machine" }, "motivated": { urdu: "ہिमت", synonym: "inspired" } }
      },
      {
        title: "Healthy Eating",
        paragraph: "Eating healthy means choosing fruits, vegetables, and whole grains over processed foods. I plan my meals ahead of time to avoid unhealthy snacks.",
        vocab: { "processed": { urdu: "پروسیسڈ", synonym: "refined" }, "snacks": { urdu: "ناشتہ", synonym: "light food" } }
      }
    ],
    advanced: [
      {
        title: "Training for a Marathon",
        paragraph: "Training for a marathon tests both physical endurance and mental strength. I increase my running distance gradually every week. Proper nutrition and rest are just as important as the runs.",
        vocab: { "endurance": { urdu: "برداشت", synonym: "stamina" }, "gradually": { urdu: "آہستہ آہستہ", synonym: "slowly" } }
      },
      {
        title: "Yoga for Stress Relief",
        paragraph: "Yoga combines breathing exercises, meditation, and physical poses. Practicing yoga for twenty minutes daily helps reduce stress and improves flexibility.",
        vocab: { "meditation": { urdu: "مراقبت", synonym: "contemplation" }, "flexibility": { urdu: "لچک", synonym: "bendiness" } }
      },
      {
        title: "Strength Training",
        paragraph: "Strength training builds muscle and increases bone density. I use dumbbells, resistance bands, and my own body weight to perform various exercises weekly.",
        vocab: { "density": { urdu: "گندگی", synonym: "compactness" }, "resistance": { urdu: "مقاومتی", synonym: "opposition" } }
      }
    ]
  },
  cinema: {
    beginner: [
      {
        title: "My Favorite Movie",
        paragraph: "I love watching movies in my free time. The story was exciting and the actors were great. I watched it with my family and we talked about it afterward.",
        vocab: { "exciting": { urdu: "uronجànk", synonym: "thrilling" }, "afterward": { urdu: "بعد میں", synonym: "later" } }
      },
      {
        title: "Going to the Cinema",
        paragraph: "Going to the cinema with friends is fun. We buy tickets, get popcorn and drinks, and find good seats in the middle of the theater.",
        vocab: { "tickets": { urdu: "ٹکٹ", synonym: "passes" }, "theater": { urdu: "سنیما", synonym: "hall" } }
      },
      {
        title: "Movie Night at Home",
        paragraph: "On Friday nights, my family watches a movie at home. We turn off the lights, make popcorn, and enjoy the film together on the big screen.",
        vocab: { "family": { urdu: "خاندان", synonym: "relatives" }, "enjoy": { urdu: "لطف اٹھانا", synonym: "like" } }
      }
    ],
    intermediate: [
      {
        title: "Movie Review",
        paragraph: "The film I saw last week had an amazing soundtrack and beautiful cinematography. The plot kept me guessing until the very end. I would highly recommend it.",
        vocab: { "soundtrack": { urdu: "اساؤنڈ ٹرک", synonym: "music" }, "cinematography": { urdu: "سینیمائوگرافی", synonym: "photography" } }
      },
      {
        title: "Classic Films",
        paragraph: "Classic black and white films have a special charm. The acting styles were different from modern movies, but the stories still feel relevant today.",
        vocab: { "charm": { urdu: "مと呼ばれている", synonym: "attraction" }, "relevant": { urdu: "مبہمت", synonym: "important" } }
      },
      {
        title: "Film Genres",
        paragraph: "I enjoy watching science fiction films because they explore futuristic ideas and technology. Documentaries are also interesting because they show real life stories.",
        vocab: { "futuristic": { urdu: "مستقبل کا", synonym: "advanced" }, "documentaries": { urdu: "دستاویزی فلمیں", synonym: "films" } }
      }
    ],
    advanced: [
      {
        title: "Classic Cinema",
        paragraph: "Classic cinema from the golden era continues to inspire modern filmmakers. The storytelling techniques developed decades ago are still studied today. Their influence can be seen in contemporary works.",
        vocab: { "storytelling": { urdu: "کہانی سننا", synonym: "narrative" }, "influence": { urdu: "تحریک", synonym: "impact" } }
      },
      {
        title: "Film Directing",
        paragraph: "A film director guides the actors, chooses camera angles, and oversees editing. Great directors have a unique vision that shapes the entire movie experience.",
        vocab: { "director": { urdu: "ڈائریکٹر", synonym: "filmmaker" }, "vision": { urdu: "منظر", synonym: "goal" } }
      },
      {
        title: "Film Festivals",
        paragraph: "International film festivals showcase independent movies from around the world. Winning an award at a major festival can launch a filmmaker's career.",
        vocab: { "festivals": { urdu: "تبصریاں", synonym: "events" }, "launch": { urdu: "شروع کرنا", synonym: "start" } }
      }
    ]
  }
};

// ============================================================
// TOPIC SELECTOR
// ============================================================

function getRandomTopic(category, level) {
  var catKey = category.trim().toLowerCase().replace(/\s+/g, '_');
  var lvlKey = level.trim().toLowerCase().replace(/\s+/g, '_');
  var pool = (TOPIC_DATABASE[catKey] && TOPIC_DATABASE[catKey][lvlKey])
    || TOPIC_DATABASE['daily_life']['beginner'];
  var randomIndex = Math.floor(Math.random() * pool.length);
  return {
    topic: pool[randomIndex],
    category: catKey,
    level: lvlKey
  };
}

// ============================================================
// LOAD PRACTICE SESSION (Main Entry from Onboarding)
// ============================================================

function initPracticeSession(interestRaw, levelRaw) {
  var result = getRandomTopic(interestRaw, levelRaw);
  currentActiveTopic = result.topic;

  // Update practice view badges
  var levelBadge = document.getElementById('prac-level-badge');
  var interestBadge = document.getElementById('prac-interest-badge');
  if (levelBadge) levelBadge.textContent = LEVEL_LABELS[result.level] || levelRaw;
  if (interestBadge) interestBadge.textContent = INTEREST_LABELS[result.category] || interestRaw;

  // Update topic title
  var topicTitle = document.getElementById('prac-topic-title');
  if (topicTitle) topicTitle.textContent = result.topic.title;

  // Render paragraph words into karaoke container
  renderParagraphWords(result.topic.paragraph);

  // Reset UI state
  currentTranscript = "";
  currentPlaybackRate = 1.0;

  // Reset speed buttons
  var speedBtns = document.querySelectorAll('.rate-btn');
  speedBtns.forEach(function(btn) {
    btn.classList.remove('active');
    if (btn.dataset.rate === '1.0') btn.classList.add('active');
  });

  // Reset record button
  var recBtn = document.getElementById('prac-record');
  var recLabel = document.getElementById('rec-label');
  if (recBtn) {
    recBtn.classList.remove('recording');
    recBtn.textContent = 'Record Voice';
  }
  if (recLabel) recLabel.textContent = 'Press record and read the paragraph aloud.';

  // Reset status
  var recStatus = document.getElementById('rec-status');
  if (recStatus) recStatus.textContent = 'Press record and read the paragraph aloud.';

  // Hide wave
  var waveEl = document.getElementById('rec-wave');
  if (waveEl) waveEl.classList.add('hidden');

  // Hide live transcript
  var liveTranscript = document.getElementById('live-transcript');
  if (liveTranscript) liveTranscript.style.display = 'none';
}

// ============================================================
// RENDER PARAGRAPH WORDS
// ============================================================

function renderParagraphWords(paragraph) {
  var container = document.getElementById('karaoke-paragraph');
  if (!container) return;

  container.innerHTML = '';
  var words = paragraph.split(/\s+/);
  words.forEach(function(w, i) {
    var cleanWord = w.replace(/[.,;:!?"'()\[\]{}\\/-]/g, '');
    var span = document.createElement('span');
    span.textContent = w;
    span.className = 'karaoke-word';
    span.id = 'kw-' + i;
    span.dataset.index = i;
    span.dataset.word = cleanWord.toLowerCase();
    span.tabIndex = 0;

    // Tap-to-translate Urdu popup
    var vocab = currentActiveTopic && currentActiveTopic.vocab ? currentActiveTopic.vocab : null;
    span.addEventListener('click', function(e) {
      e.stopPropagation();
      showUrduPopup(span, cleanWord, vocab);
    });

    span.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        span.click();
      }
    });

    container.appendChild(span);
    if (i < words.length - 1) container.appendChild(document.createTextNode(' '));
  });
}

// ============================================================
// URDU POPUP (Tap-to-Translate)
// ============================================================

var urduPopup = {
  container: null,
  wordEl: null,
  urduEl: null,
  synEl: null,
  exEl: null,

  init: function() {
    this.container = document.getElementById('word-tooltip');
    this.wordEl = document.getElementById('tooltip-word');
    this.urduEl = document.getElementById('tooltip-urdu');
    this.synEl = document.getElementById('tooltip-synonym');
    this.exEl = document.getElementById('tooltip-example');

    var playBtn = document.getElementById('tooltip-play');
    if (playBtn) {
      playBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        var word = urduPopup.wordEl.textContent;
        if (window.speechSynthesis) {
          var u = new SpeechSynthesisUtterance(word);
          u.lang = 'en-US';
          window.speechSynthesis.speak(u);
        }
      });
    }

    // Close popup when clicking elsewhere
    document.addEventListener('click', function(e) {
      if (!e.target.closest('#word-tooltip')) {
        urduPopup.hide();
      }
    });
  },

  show: function(targetSpan, word, vocabData) {
    if (!this.container) return;

    this.wordEl.textContent = word;

    var v = null;
    if (vocabData) {
      v = vocabData[word.toLowerCase()] || vocabData[word];
    }

    if (v && v.urdu) this.urduEl.textContent = v.urdu;
    else this.urduEl.textContent = '';

    if (v && v.synonym) this.synEl.textContent = 'Synonym: ' + v.synonym;
    else this.synEl.textContent = '';

    if (v && v.example) this.exEl.textContent = 'Example: ' + v.example;
    else this.exEl.textContent = '';

    var rect = targetSpan.getBoundingClientRect();
    this.container.style.left = (rect.left + rect.width / 2) + 'px';
    this.container.style.top = (rect.top - 10) + 'px';
    this.container.classList.add('visible');
    this.container.setAttribute('aria-hidden', 'false');
  },

  hide: function() {
    if (this.container) {
      this.container.classList.remove('visible');
      this.container.setAttribute('aria-hidden', 'true');
    }
  }
};

function showUrduPopup(targetSpan, word, vocabData) {
  urduPopup.show(targetSpan, word, vocabData);
}

// Initialize Urdu popup on load
document.addEventListener('DOMContentLoaded', function() {
  urduPopup.init();
});

// ============================================================
// SPEECH SYNTHESIS ENGINE (Karaoke + TTS)
// ============================================================

var synth = window.speechSynthesis;
var synthesisSupported = !!synth;

var speechEngine = {
  supported: synthesisSupported,

  isSpeaking: function() {
    return synthesisSupported && synth.speaking;
  },

  stop: function() {
    if (synthesisSupported) {
      try { synth.cancel(); } catch (e) { console.warn("[speech-engine] cancel failed", e); }
    }
    currentUtterance = null;
  },

  speak: function(paragraph, rate, onWordHighlight, onEnd) {
    this.stop();

    if (!synthesisSupported) {
      if (onEnd) onEnd();
      return;
    }

    currentUtterance = new SpeechSynthesisUtterance(paragraph);
    currentUtterance.rate = rate || currentPlaybackRate;
    currentUtterance.lang = 'en-US';

    var words = paragraph.split(/\s+/);
    var wordSpans = document.querySelectorAll('#karaoke-paragraph .karaoke-word');
    var activeIndex = -1;

    currentUtterance.onboundary = function(event) {
      if (event.name !== 'word' && event.name !== 'sentence') return;
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
        if (activeIndex !== -1 && wordSpans[activeIndex]) {
          wordSpans[activeIndex].classList.remove('karaoke-active');
        }
        activeIndex = idx;
        if (wordSpans[activeIndex]) {
          wordSpans[activeIndex].classList.add('karaoke-active');
          try {
            wordSpans[activeIndex].scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
          } catch (e) { console.warn("[speech-engine] scrollIntoView failed", e); }
        }
        if (onWordHighlight) onWordHighlight(words[idx], idx);
      }
    };

    currentUtterance.onend = function() {
      // Reset highlights
      wordSpans.forEach(function(span) { span.classList.remove('karaoke-active'); });

      // Reset play button
      var playBtn = document.getElementById('prac-play');
      if (playBtn) playBtn.textContent = '▶ Play Native Accent';

      if (onEnd) onEnd();
    };

    currentUtterance.onerror = function(err) {
      console.warn("[speech-engine] utterance error", err);
      wordSpans.forEach(function(span) { span.classList.remove('karaoke-active'); });
      var playBtn = document.getElementById('prac-play');
      if (playBtn) playBtn.textContent = '▶ Play Native Accent';
      if (onEnd) onEnd();
    };

    try {
      synth.speak(currentUtterance);
    } catch (err) {
      console.warn("[speech-engine] speak failed", err);
      if (onEnd) onEnd();
    }
  }
};

// ============================================================
// SPEECH RECOGNITION ENGINE
// ============================================================

var RecCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
var recognitionSupported = !!RecCtor;

function startRecording(options) {
  if (!RecCtor) {
    if (options.onError) options.onError(new Error("Speech recognition not supported"));
    return null;
  }

  var recognizer = new RecCtor();
  recognizer.continuous = true;
  recognizer.interimResults = true;
  recognizer.lang = 'en-US';

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
    currentTranscript = finalTranscript;

    // Update live transcript box
    var liveBox = document.getElementById('live-transcript');
    if (liveBox) {
      liveBox.style.display = 'block';
      liveBox.textContent = finalTranscript || interim;
    }
  };

  recognizer.onend = function() {
    isRecording = false;
    var recBtn = document.getElementById('prac-record');
    var recLabel = document.getElementById('rec-label');
    if (recBtn) {
      recBtn.classList.remove('recording');
      recBtn.textContent = 'Record Voice';
    }
    if (recLabel) recLabel.textContent = 'Press record and read the paragraph aloud.';
    var waveEl = document.getElementById('rec-wave');
    if (waveEl) waveEl.classList.add('hidden');
    if (options.onEnd) options.onEnd(finalTranscript);
  };

  recognizer.onerror = function(event) {
    isRecording = false;
    var recBtn = document.getElementById('prac-record');
    if (recBtn) {
      recBtn.classList.remove('recording');
      recBtn.textContent = 'Record Voice';
    }
    if (options.onError) options.onError(event);
  };

  try {
    recognizer.start();
    isRecording = true;
    recordingStartTime = Date.now();

    var recBtn = document.getElementById('prac-record');
    var recLabel = document.getElementById('rec-label');
    if (recBtn) {
      recBtn.classList.add('recording');
      recBtn.textContent = 'Listening... (Click to Finish)';
    }
    if (recLabel) recLabel.textContent = 'Listening... Speak now.';
    var waveEl = document.getElementById('rec-wave');
    if (waveEl) waveEl.classList.remove('hidden');

    var liveBox = document.getElementById('live-transcript');
    if (liveBox) {
      liveBox.style.display = 'block';
      liveBox.textContent = 'Listening for your voice...';
    }

    return recognizer;
  } catch (err) {
    isRecording = false;
    if (options.onError) options.onError(err);
    return null;
  }
}

function stopRecording() {
  if (recognizer) {
    recognizer.stop();
    recognizer = null;
  }
  isRecording = false;

  var recBtn = document.getElementById('prac-record');
  var recLabel = document.getElementById('rec-label');
  if (recBtn) {
    recBtn.classList.remove('recording');
    recBtn.textContent = 'Record Voice';
  }
  if (recLabel) recLabel.textContent = 'Press record and read the paragraph aloud.';
  var waveEl = document.getElementById('rec-wave');
  if (waveEl) waveEl.classList.add('hidden');
}

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
// EVALUATE SPEECH (Done / Evaluate Button)
// ============================================================

function evaluateSpeech() {
  // Stop any active recording/playback
  stopRecording();
  speechEngine.stop();

  var topic = currentActiveTopic;
  if (!topic) {
    alert('No topic loaded.');
    return;
  }

  var durationSeconds = recordingStartTime ? (Date.now() - recordingStartTime) / 1000 : 5;
  var transcript = currentTranscript || "";

  // Calculate 3-Pillar Score
  var result = scoreParagraph(topic.paragraph, transcript, durationSeconds);

  // Populate results view
  var scoreEl = document.getElementById('res-score');
  var dateEl = document.getElementById('res-date');
  var topicEl = document.getElementById('res-topic');
  var levelEl = document.getElementById('res-level');
  var accPill = document.getElementById('res-acc-pill');
  var accFill = document.getElementById('res-acc-fill');
  var wpmPill = document.getElementById('res-wpm-pill');
  var wpmFill = document.getElementById('res-wpm-fill');
  var fillPill = document.getElementById('res-fill-pill');
  var fillFill = document.getElementById('res-fill-fill');
  var badgeText = document.getElementById('res-badge-text');
  var scoreRing = document.getElementById('res-score-ring');
  var breakdownList = document.getElementById('res-breakdown');

  if (scoreEl) scoreEl.textContent = result.score;
  if (dateEl) dateEl.textContent = new Date().toLocaleDateString();
  if (topicEl) topicEl.textContent = topic.title;
  if (levelEl) levelEl.textContent = LEVEL_LABELS[topic.level] || topic.level;
  if (accPill) accPill.textContent = result.accuracy + '%';
  if (accFill) accFill.style.width = result.accuracy + '%';
  if (wpmPill) wpmPill.textContent = result.wpm + ' WPM';
  if (wpmFill) {
    wpmFill.style.width = Math.min(100, (result.wpm / 180) * 100) + '%';
    wpmFill.className = 'diag-bar-fill' + (result.wpm < 80 || result.wpm > 170 ? ' error' : '');
  }
  if (fillPill) fillPill.textContent = result.fluencyScore;
  if (fillFill) fillFill.style.width = Math.min(100, (result.fluencyScore / 20) * 100) + '%';

  var badge = result.score >= 85 ? "🔥 Fluency Maestro" : result.score >= 70 ? "⚡ Rising Speaker" : result.score >= 50 ? "📈 Developing Speaker" : "🌱 Keep Practising";
  if (badgeText) badgeText.textContent = badge;

  if (scoreRing) {
    var c = 2 * Math.PI * 42;
    scoreRing.style.strokeDashoffset = c - (result.score / 100) * c;
  }

  if (breakdownList) {
    breakdownList.innerHTML = "";
    result.wordsReview.forEach(function(item) {
      var d = document.createElement('div');
      d.className = 'breakdown-item ' + item.status;
      d.innerHTML = '<span class="breakdown-word">' + item.word + '</span><span class="breakdown-tag ' + item.status + '">' + item.status.charAt(0).toUpperCase() + item.status.slice(1) + '</span>';
      breakdownList.appendChild(d);
    });
  }

  // Switch to results view
  var views = document.querySelectorAll(".view");
  views.forEach(function(v) { v.style.display = "none"; v.classList.remove("active-view"); });
  var target = document.getElementById("view-results");
  if (target) {
    target.style.display = "block";
    target.classList.add("active-view");
    window.scrollTo(0, 0);
  }
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
// UI CONTROLLER
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

  group.querySelectorAll('.chip').forEach(function(c) {
    c.classList.remove('chip-selected', 'active');
    c.style.background = '';
    c.style.color = '';
  });

  chip.classList.add('chip-selected', 'active');
  chip.style.background = '#a855f7';
  chip.style.color = '#ffffff';

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
  var btn = e.target.closest('#ob-submit, .btn-start-speaking, button[type="button"]');
  if (!btn) return;

  if (btn.textContent.indexOf('Start Speaking') === -1) return;

  e.preventDefault();

  var interestEl = document.querySelector('#ob-interest-group .chip.chip-selected, #ob-interest-group .chip.active');
  var levelEl = document.querySelector('#ob-level-group .chip.chip-selected, #ob-level-group .chip.active');

  if (!interestEl || !levelEl) {
    alert('Please select both an Interest and a Target Level!');
    return;
  }

  var chosenInterest = interestEl.getAttribute('data-value') || interestEl.textContent.trim();
  var chosenLevel = levelEl.getAttribute('data-value') || levelEl.textContent.trim();

  var obView = document.getElementById('view-onboarding');
  var pracView = document.getElementById('view-practice') || document.getElementById('view-dashboard');
  if (obView && pracView) {
    obView.style.display = 'none';
    pracView.style.display = 'block';
    pracView.classList.add('active-view');
  }

  if (typeof initPracticeSession === 'function') {
    initPracticeSession(chosenInterest, chosenLevel);
  }
});

// ============================================================
// PRACTICE BUTTONS: Play Native Accent
// ============================================================

document.addEventListener('click', function(e) {
  var playBtn = e.target.closest('#prac-play');
  if (!playBtn) return;
  e.preventDefault();

  var topic = currentActiveTopic;
  if (!topic) return;

  if (speechEngine.isSpeaking()) {
    speechEngine.stop();
    playBtn.textContent = '▶ Play Native Accent';
    return;
  }

  playBtn.textContent = '⏹ Stop Audio';
  speechEngine.speak(topic.paragraph, currentPlaybackRate, function(word, idx) {
    // Optional per-word callback
  }, function() {
    playBtn.textContent = '▶ Play Native Accent';
  });
});

// ============================================================
// PRACTICE BUTTONS: Record Voice
// ============================================================

document.addEventListener('click', function(e) {
  var recBtn = e.target.closest('#prac-record');
  if (!recBtn) return;
  e.preventDefault();

  var topic = currentActiveTopic;
  if (!topic) {
    alert('No topic loaded. Please start a new practice session.');
    return;
  }

  if (!isRecording) {
    recognizer = startRecording({
      onResult: function(res) {
        var recStatus = document.getElementById('rec-status');
        if (recStatus) recStatus.textContent = 'Listening... (' + res.final.length + ' chars)';
      },
      onEnd: function(finalTranscript) {
        currentTranscript = finalTranscript;
        var recStatus = document.getElementById('rec-status');
        if (recStatus) recStatus.textContent = 'Recording complete. Click Done to evaluate.';
      },
      onError: function(err) {
        console.warn("[scorer] error:", err);
        isRecording = false;
        recBtn.classList.remove('recording');
        recBtn.textContent = 'Record Voice';
        var recStatus = document.getElementById('rec-status');
        if (recStatus) recStatus.textContent = 'Speech recognition not available. Using simulation mode.';
        currentTranscript = topic.paragraph;
      }
    });
  } else {
    stopRecording();
    var recStatus = document.getElementById('rec-status');
    if (recStatus) recStatus.textContent = 'Recording stopped. Click Done to evaluate.';
  }
});

// ============================================================
// PRACTICE BUTTONS: Done / Evaluate
// ============================================================

document.addEventListener('click', function(e) {
  var doneBtn = e.target.closest('#prac-done');
  if (!doneBtn) return;
  e.preventDefault();
  evaluateSpeech();
});

// ============================================================
// PRACTICE BUTTONS: Speed Toggle
// ============================================================

document.addEventListener('click', function(e) {
  var speedBtn = e.target.closest('.rate-btn');
  if (!speedBtn) return;
  e.preventDefault();

  currentPlaybackRate = parseFloat(speedBtn.dataset.rate) || 1.0;

  var speedBtns = document.querySelectorAll('.rate-btn');
  speedBtns.forEach(function(btn) {
    btn.classList.remove('active');
  });
  speedBtn.classList.add('active');
});

// ============================================================
// PRACTICE BUTTONS: Reset
// ============================================================

document.addEventListener('click', function(e) {
  var resetBtn = e.target.closest('#prac-reset');
  if (!resetBtn) return;
  e.preventDefault();

  speechEngine.stop();
  stopRecording();

  var playBtn = document.getElementById('prac-play');
  if (playBtn) playBtn.textContent = '▶ Play Native Accent';

  var recBtn = document.getElementById('prac-record');
  var recLabel = document.getElementById('rec-label');
  if (recBtn) {
    recBtn.classList.remove('recording');
    recBtn.textContent = 'Record Voice';
  }
  if (recLabel) recLabel.textContent = 'Press record and read the paragraph aloud.';

  var waveEl = document.getElementById('rec-wave');
  if (waveEl) waveEl.classList.add('hidden');

  var recStatus = document.getElementById('rec-status');
  if (recStatus) recStatus.textContent = 'Press record and read the paragraph aloud.';

  var liveBox = document.getElementById('live-transcript');
  if (liveBox) {
    liveBox.style.display = 'none';
    liveBox.textContent = '';
  }

  currentTranscript = "";
  recordingStartTime = null;
  isRecording = false;

  var topic = currentActiveTopic;
  if (topic) {
    renderParagraphWords(topic.paragraph);
  }
});

// ============================================================
// PRACTICE BUTTONS: Back to Dashboard
// ============================================================

document.addEventListener('click', function(e) {
  var backBtn = e.target.closest('#prac-back');
  if (!backBtn) return;
  e.preventDefault();

  stopRecording();
  speechEngine.stop();

  var views = document.querySelectorAll(".view");
  views.forEach(function(v) { v.style.display = "none"; v.classList.remove("active-view"); });
  var target = document.getElementById("view-dashboard");
  if (target) {
    target.style.display = "block";
    target.classList.add("active-view");
    window.scrollTo(0, 0);
  }
});

// ============================================================
// ERROR HANDLING & VERSION INFO
// ============================================================

console.log("SpeakFlow v6.0 Loaded — Fully Interactive Live");

document.addEventListener('DOMContentLoaded', function() {
  var chips = document.querySelectorAll('.chip');
  chips.forEach(function(chip) {
    chip.style.transition = 'background 0.2s, color 0.2s';
  });
  urduPopup.init();
});

try { localStorage.setItem('_speakflow_test', 'ok'); localStorage.removeItem('_speakflow_test'); } catch(e) {}

window.SpeakFlow = {
  INTEREST_LABELS: INTEREST_LABELS,
  LEVEL_LABELS: LEVEL_LABELS,
  getRandomTopic: getRandomTopic,
  initPracticeSession: initPracticeSession,
  scoreParagraph: scoreParagraph,
  speechEngine: speechEngine,
  ui: ui,
  TOPIC_DATABASE: TOPIC_DATABASE
};