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
// CHIP SELECT HANDLER (Fail-Safe, No Import Dependencies)
// ============================================================

document.addEventListener('click', function(e) {
  // --- Chip Selection ---
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

  // --- Sync to hidden inputs ---
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
  // Find the "Start Speaking" button
  var btn = e.target.closest('#ob-submit, button[type="button"]');
  if (!btn) return;

  // Must contain "Start Speaking" text
  if (btn.textContent.indexOf('Start Speaking') === -1) return;

  e.preventDefault();

  // Read selected interest and level from the chip groups
  var interestGroup = document.getElementById('ob-interest-group');
  var levelGroup = document.getElementById('ob-level-group');

  var selectedInterest = interestGroup ?
    interestGroup.querySelector('.chip.chip-selected, .chip.active') : null;

  var selectedLevel = levelGroup ?
    levelGroup.querySelector('.chip.chip-selected, .chip.active') : null;

  // Text content of selected chips
  var interestText = selectedInterest ? selectedInterest.textContent.trim() : '';
  var levelText = selectedLevel ? selectedLevel.textContent.trim() : '';

  // Validation: both must be selected
  if (!interestText || !levelText) {
    alert('Please select both an Interest and a Target Level!');
    // Add error visual feedback
    if (selectedInterest && interestGroup) interestGroup.classList.add('error-shake');
    if (!interestText && interestGroup) {
      // Find the interest group and add error class
      var ig = document.getElementById('ob-interest-group');
      if (ig) ig.classList.add('error-shake');
    }
    if (!levelText && levelGroup) {
      var lg = document.getElementById('ob-level-group');
      if (lg) lg.classList.add('error-shake');
    }
    // Remove error shake after 800ms
    setTimeout(function() {
      if (interestGroup) interestGroup.classList.remove('error-shake');
      if (levelGroup) levelGroup.classList.remove('error-shake');
    }, 800);
    return;
  }

  // --- Save profile to localStorage ---
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
  } catch (e) {
    // localStorage may be disabled; continue anyway
  }

  // --- Switch Views ---
  var obView = document.getElementById('view-onboarding');
  var pracView = document.getElementById('view-practice') || document.getElementById('view-dashboard');

  if (obView) obView.style.display = 'none';
  if (pracView) {
    pracView.style.display = 'block';
    pracView.classList.add('active-view');
  }

  // --- Auto-load a topic based on selected interest & level ---
  // Define topics inline (beginner level, each interest)
  var topics = {
    tech: {
      beginner: {
        title: "My Smartphone",
        paragraph: "I use my smartphone every day. It helps me talk to my friends and family. I can take photos and watch videos on it. My phone also tells me the weather and the latest news."
      },
      intermediate: {
        title: "Mobile Apps",
        paragraph: "Mobile apps have become part of our daily routine. We use them to order food, book rides, and chat with friends. Some apps help us learn new languages every day. A good app should be fast and easy to use."
      },
      advanced: {
        title: "Artificial Intelligence",
        paragraph: "Artificial intelligence is changing how we live and work. It can write text, generate images, and answer difficult questions. Many people worry about jobs, but AI also creates new opportunities. Learning to use AI wisely is an important skill today."
      }
    },
    daily_life: {
      beginner: {
        title: "My Breakfast",
        paragraph: "Every morning I eat a healthy breakfast. I drink a glass of milk and eat an egg with toast. Fruits give me energy for the whole day. I feel fresh after breakfast."
      },
      intermediate: {
        title: "Cooking Dinner",
        paragraph: "Cooking dinner is my favorite way to relax after work. I chop vegetables and stir them in a hot pan. The smell of spices fills the whole kitchen. My family always praises the taste of the food."
      },
      advanced: {
        title: "Managing a Budget",
        paragraph: "Managing a monthly budget requires discipline and careful planning. I track every expense in a spreadsheet to avoid overspending. Saving a small amount regularly builds a safety fund. Financial freedom starts with knowing where your money goes."
      }
    },
    business: {
      beginner: {
        title: "The Morning Meeting",
        paragraph: "We have a meeting every Monday at nine o'clock. The manager talks about the new project. Everyone shares their ideas and updates. We finish the meeting by eleven."
      },
      intermediate: {
        title: "Writing Emails",
        paragraph: "Writing clear emails is essential in a modern office. I always start with a polite greeting and state the purpose early. Short paragraphs make the message easier to read. I proofread before I click send."
      },
      advanced: {
        title: "Business Negotiation",
        paragraph: "Successful negotiation requires listening more than speaking. I focus on creating value for both parties instead of winning alone. Patience and empathy often lead to better agreements. A signed contract is only the beginning of the relationship."
      }
    },
    fitness: {
      beginner: {
        title: "Morning Walk",
        paragraph: "I walk for thirty minutes every morning. It keeps my heart healthy and my mind clear. I wear comfortable shoes and carry a bottle of water. Walking makes me active all day."
      },
      intermediate: {
        title: "Gym Routine",
        paragraph: "I go to the gym three times a week to stay fit. Lifting weights makes my muscles stronger over time. I drink plenty of water between sets to stay hydrated. A good workout leaves me tired but satisfied."
      },
      advanced: {
        title: "Training for a Marathon",
        paragraph: "Training for a marathon tests both physical endurance and mental strength. I increase my running distance gradually every week. Proper nutrition and rest are just as important as the runs. Crossing the finish line feels like a personal victory."
      }
    },
    cinema: {
      beginner: {
        title: "My Favorite Movie",
        paragraph: "I love watching movies in my free time. The story was exciting and the actors were great. I watched it with my family and we talked about it afterward. It was a wonderful experience."
      },
      intermediate: {
        title: "Movie Review",
        paragraph: "The film I saw last week had an amazing soundtrack and beautiful cinematography. The plot kept me guessing until the very end. I would highly recommend it to anyone who enjoys thoughtful drama. The direction was superb."
      },
      advanced: {
        title: "Classic Cinema",
        paragraph: "Classic cinema from the golden era continues to inspire modern filmmakers. The storytelling techniques developed decades ago are still studied today. I appreciate the artistry and craftsmanship of those early films. Their influence can be seen in contemporary works."
      }
    }
  };

  // Select topic based on interest and level
  var interestLower = interestText.toLowerCase();
  var levelLower = levelText.toLowerCase();
  var selectedTopic = topics[interestLower] && topics[interestLower][levelLower] ?
    topics[interestLower][levelLower] :
    {
      title: "Daily Practice",
      paragraph: "Practice makes perfect. Speak a little every day and your English will improve. Be patient with yourself and enjoy the journey of learning."
    };

  // --- Switch Views ---
  var obView = document.getElementById('view-onboarding');
  var dashboardView = document.getElementById('view-dashboard');
  var practiceView = document.getElementById('view-practice');

  if (obView) obView.style.display = 'none';
  if (dashboardView) dashboardView.classList.add('active-view');
  if (practiceView) {
    practiceView.style.display = 'block';
    practiceView.classList.add('active-view');
  }

  // --- Update Practice UI ---
  if (practiceView) {
    // Update topic title
    var topicTitle = document.getElementById('prac-topic-title');
    if (topicTitle) topicTitle.textContent = selectedTopic.title;

    // Update level badge
    var levelBadge = document.getElementById('prac-level-badge');
    if (levelBadge) levelBadge.textContent = LEVEL_LABELS[levelLower] || levelText;

    // Update interest badge
    var interestBadge = document.getElementById('prac-interest-badge');
    if (interestBadge) interestBadge.textContent = INTEREST_LABELS[interestLower] || interestText;

    // Update topic paragraph for karaoke
    var karaokeContainer = document.getElementById('karaoke-paragraph');
    if (karaokeContainer) {
      // Prepare karaoke word spans
      var words = selectedTopic.paragraph.split(/\s+/);
      karaokeContainer.innerHTML = '';
      words.forEach(function(w, i) {
        var span = document.createElement('span');
        span.textContent = w;
        span.className = 'karaoke-word';
        span.dataset.index = i;
        span.tabIndex = 0;
        karaokeContainer.appendChild(span);
        if (i < words.length - 1) {
          karaokeContainer.appendChild(document.createTextNode(' '));
        }
      });
    }

    // Update level and interest in the topic meta
    var topicLevel = document.getElementById('prac-level-badge');
    var topicInterest = document.getElementById('prac-interest-badge');
    if (topicLevel) topicLevel.textContent = LEVEL_LABELS[levelLower] || levelText;
    if (topicInterest) topicInterest.textContent = INTEREST_LABELS[interestLower] || interestText;
  }
  });
  });
  });
  
// ============================================================
// ERROR HANDLING & VERSION INFO
// ============================================================

// Confirm loaded version
console.log("SpeakFlow v4.0 Loaded — Standalone JS (no module crashes)");

// Ensure chips have minimum styling on page load
document.addEventListener('DOMContentLoaded', function() {
  var chips = document.querySelectorAll('.chip');
  chips.forEach(function(chip) {
    // Ensure default styling is applied
    chip.style.transition = 'background 0.2s, color 0.2s';
  });
});

// Fallback: if localStorage fails, just continue
try { localStorage.setItem('_speakflow_test', 'ok'); localStorage.removeItem('_speakflow_test'); } catch(e) {}

// Make globals available if other scripts need them (but we don't use imports)
window.SpeakFlow = {
  INTEREST_LABELS: INTEREST_LABELS,
  LEVEL_LABELS: LEVEL_LABELS,
  defaultProfile: defaultProfile
};