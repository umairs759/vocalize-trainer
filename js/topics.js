/* ============================================================
   SpeakFlow — Topic & Vocabulary Database (js/topics.js)
   15 authentic scenarios across 5 interests × 3 difficulty levels.
   Each paragraph: 40-70 words. Each vocab: word, urdu, synonym, example.
   ============================================================ */

const topics = {
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
          { word: "ideas", urdu: "ایڈیاز", synonym: "thoughts", example: "She has good ideas." }
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
    creative: [
      {
        id: "beginner-creative-painting",
        title: "Painting a Picture",
        interest: "creative",
        level: "beginner",
        paragraph:
          "I love painting pictures in my free time. I use bright colors like red, blue, and yellow. Painting helps me express my feelings. I hang my art on the wall.",
        vocabulary: [
          { word: "painting", urdu: "پینٹنگ", synonym: "art", example: "Painting is fun." },
          { word: "colors", urdu: "رنگ", synonym: "hues", example: "I like bright colors." },
          { word: "feelings", urdu: "جذبات", synonym: "emotions", example: "I share my feelings." },
          { word: "wall", urdu: "دیوار", synonym: "partition", example: "Art on the wall." }
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
          { word: "essential", urdu: "لازمی", synonym: "necessary", example: "Water is essential." },
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
          { word: "gym", urdu: "جیِم", synonym: "fitness center", example: "I go to the gym." },
          { word: "weights", urdu: "وزن", synonym: "dumbbells", example: "I lift weights." },
          { word: "muscles", urdu: "پٹھے", synonym: "flesh", example: "Strong muscles." },
          { word: "hydrated", urdu: "پانی پرور", synonym: "moist", example: "Stay hydrated." }
        ]
      }
    ],
    creative: [
      {
        id: "intermediate-creative-photo",
        title: "Street Photography",
        interest: "creative",
        level: "intermediate",
        paragraph:
          "Street photography captures unexpected moments in public places. I walk around the city with my camera looking for interesting light. A good photo tells a story without words. Patience is the secret to a great shot.",
        vocabulary: [
          { word: "photography", urdu: "تصاویر کرنا", synonym: "imaging", example: "I love photography." },
          { word: "moments", urdu: "لحظے", synonym: "instances", example: "Happy moments." },
          { word: "patience", urdu: "صبر", synonym: "tolerance", example: "Patience is key." },
          { word: "story", urdu: "قصة", synonym: "tale", example: "Tell a story." }
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
          { word: "skill", urdu: "ہunar", synonym: "ability", example: "A useful skill." },
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
    fitness: [
      {
        id: "advanced-fitness-marathon",
        title: "Training for a Marathon",
        interest: "fitness",
        level: "advanced",
        paragraph:
          "Training for a marathon tests both physical endurance and mental strength. I increase my running distance gradually every week. Proper nutrition and rest are just as important as the runs. Crossing the finish line feels like a personal victory.",
        vocabulary: [
          { word: "marathon", urdu: "میراتھن", synonym: "long race", example: "Run a marathon." },
          { word: "endurance", urdu: "برداشت", synonym: "stamina", example: "Physical endurance." },
          { word: "nutrition", urdu: "غذائیت", synonym: "diet", example: "Good nutrition." },
          { word: "victory", urdu: "فتح", synonym: "win", example: "Sweet victory." },
          { word: "gradually", urdu: "آہستہ آہستہ", synonym: "slowly", example: "Increase gradually." }
        ]
      }
    ],
    creative: [
      {
        id: "advanced-creative-novel",
        title: "Writing a Novel",
        interest: "creative",
        level: "advanced",
        paragraph:
          "Writing a novel is a marathon of imagination and discipline. I outline the plot before drafting the first chapter. Revising takes longer than writing, but it shapes the final story. Seeing my book on a shelf is a dream come true.",
        vocabulary: [
          { word: "novel", urdu: "ناول", synonym: "book", example: "Write a novel." },
          { word: "imagination", urdu: "تصور", synonym: "creativity", example: "Pure imagination." },
          { word: "plot", urdu: "کہانی", synonym: "storyline", example: "The plot twists." },
          { word: "revising", urdu: "ترمیم", synonym: "editing", example: "Revising the draft." },
          { word: "dream", urdu: "خواб", synonym: "aspiration", example: "A dream come true." }
        ]
      }
    ]
  }
};

const INTEREST_LABELS = {
  tech: "Tech",
  daily_life: "Daily Life",
  business: "Business",
  fitness: "Fitness",
  cinema: "Cinema"
};

const LEVEL_MAP = {
  beginner: "beginner",
  intermediate: "intermediate",
  advanced: "advanced"
};

/**
 * Pick a topic for the given interest and level.
 * Falls back to any topic of the same level, then any topic at all.
 */
function getRandomTopic(interest, level) {
  const levelKey = LEVEL_MAP[level] || "beginner";
  const levelTopics = topics[levelKey];
  if (!levelTopics) return fallbackTopic();

  const pool = interest && levelTopics[interest]
    ? levelTopics[interest]
    : Object.values(levelTopics).flat();

  if (!pool || pool.length === 0) return fallbackTopic();

  const topic = pool[Math.floor(Math.random() * pool.length)];
  return cloneTopic(topic);
}

function getAllTopics() {
  const all = [];
  for (const level of Object.values(topics)) {
    for (const interest of Object.values(level)) {
      all.push(...interest);
    }
  }
  return all;
}

function cloneTopic(topic) {
  return {
    id: topic.id,
    title: topic.title,
    interest: topic.interest,
    level: topic.level,
    paragraph: topic.paragraph,
    vocabulary: (topic.vocabulary || []).map((v) => ({ ...v }))
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

export { topics, getRandomTopic, getAllTopics, INTEREST_LABELS, LEVEL_MAP };
