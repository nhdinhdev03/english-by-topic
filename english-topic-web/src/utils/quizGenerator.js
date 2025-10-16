// Utility functions for generating quiz questions from data files

// Enhanced question history with performance optimization
class QuestionHistoryManager {
  constructor() {
    this.history = new Map();
    this.maxHistorySize = 1000; // Limit memory usage
  }

  addQuestion(topicKey, questionKey) {
    if (!this.history.has(topicKey)) {
      this.history.set(topicKey, new Set());
    }

    const topicHistory = this.history.get(topicKey);
    topicHistory.add(questionKey);

    // Prevent memory overflow by limiting history size
    if (topicHistory.size > this.maxHistorySize) {
      const iterator = topicHistory.values();
      const firstItem = iterator.next().value;
      topicHistory.delete(firstItem);
    }
  }

  isQuestionUsed(topicKey, questionKey) {
    return (
      this.history.has(topicKey) && this.history.get(topicKey).has(questionKey)
    );
  }

  clearTopicHistory(topicKey) {
    if (this.history.has(topicKey)) {
      this.history.get(topicKey).clear();
    }
  }

  clearAllHistory() {
    this.history.clear();
  }

  getUsageStats(topicKey) {
    if (!this.history.has(topicKey)) return { used: 0, total: 0 };
    return {
      used: this.history.get(topicKey).size,
      total: this.maxHistorySize,
    };
  }
}

// Global question history manager
const questionHistoryManager = new QuestionHistoryManager();

/**
 * Optimized Fisher-Yates shuffle with early termination option
 */
const shuffleArray = (array, maxItems = null) => {
  const shuffled = [...array];
  const limit = maxItems
    ? Math.min(maxItems, shuffled.length)
    : shuffled.length;

  // Optimized shuffle - only shuffle what we need
  for (let i = 0; i < limit; i++) {
    const j = Math.floor(Math.random() * (shuffled.length - i)) + i;
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return maxItems ? shuffled.slice(0, limit) : shuffled;
};

/**
 * Get unused vocabulary items with performance optimization
 */
const getUnusedVocab = (vocabData, topicKey, maxCount = null) => {
  const unused = [];

  for (const vocab of vocabData) {
    const questionKey = `${vocab.english}_${vocab.vietnamese}`;

    if (!questionHistoryManager.isQuestionUsed(topicKey, questionKey)) {
      unused.push(vocab);

      // Early termination for performance
      if (maxCount && unused.length >= maxCount * 2) {
        break;
      }
    }
  }

  // If not enough unused questions, reset history and return all
  if (unused.length < (maxCount || vocabData.length * 0.5)) {
    questionHistoryManager.clearTopicHistory(topicKey);
    return vocabData;
  }

  return unused;
};

/**
 * Export functions for external use
 */
export const clearAllQuestionHistory = () => {
  questionHistoryManager.clearAllHistory();
};

export const clearQuestionHistory = (topicKey) => {
  questionHistoryManager.clearTopicHistory(topicKey);
};

export const getQuestionUsageStats = (topicKey) => {
  return questionHistoryManager.getUsageStats(topicKey);
};

/**
 * Reset randomization for fresh start
 */
export const resetRandomization = () => {
  questionHistoryManager.clearAllHistory();
  console.log("Quiz randomization reset - all question history cleared");
};

/**
 * Optimized incorrect answer generation with early termination
 */
const generateIncorrectAnswers = (
  correctAnswer,
  allVocab,
  answerType = "vietnamese",
  count = 3
) => {
  const availableAnswers = [];

  // Use early termination for performance
  for (const item of allVocab) {
    if (item[answerType] !== correctAnswer) {
      availableAnswers.push(item[answerType]);

      // Early termination when we have enough options
      if (availableAnswers.length >= count * 2) {
        break;
      }
    }
  }

  return shuffleArray(availableAnswers, count);
};

/**
 * Enhanced translation questions with smart selection
 */
const generateTranslationQuestions = (
  vocabData,
  count = 5,
  answerPool = null,
  topicKey = "default"
) => {
  // Get unused vocabulary items with performance optimization
  const unusedVocab = getUnusedVocab(vocabData, topicKey, count);
  const selectedVocab = shuffleArray(unusedVocab, count);
  const pool = answerPool || vocabData;

  return selectedVocab.map((vocab, index) => {
    // Mark this question as used
    const questionKey = `${vocab.english}_${vocab.vietnamese}`;
    questionHistoryManager.addQuestion(topicKey, questionKey);

    const incorrectAnswers = generateIncorrectAnswers(
      vocab.vietnamese,
      pool,
      "vietnamese"
    );
    const allOptions = shuffleArray([
      { id: "a", text: vocab.vietnamese, isCorrect: true },
      { id: "b", text: incorrectAnswers[0], isCorrect: false },
      { id: "c", text: incorrectAnswers[1], isCorrect: false },
      { id: "d", text: incorrectAnswers[2], isCorrect: false },
    ]);

    return {
      id: index + 1,
      type: "translation_en_vi",
      question: `What does "${vocab.english}" mean?`,
      questionVi: `"${vocab.english}" có nghĩa là gì?`,
      options: allOptions,
      pronunciation: vocab.pronunciation,
      wordType: vocab.type,
      topicInfo: vocab.topicName
        ? { name: vocab.topicName, emoji: vocab.topicEmoji }
        : null,
    };
  });
};

/**
 * Enhanced reverse translation questions
 */
const generateReverseTranslationQuestions = (
  vocabData,
  count = 5,
  answerPool = null,
  topicKey = "default"
) => {
  // Get unused vocabulary items with performance optimization
  const unusedVocab = getUnusedVocab(vocabData, topicKey, count);
  const selectedVocab = shuffleArray(unusedVocab, count);
  const pool = answerPool || vocabData;

  return selectedVocab.map((vocab, index) => {
    // Mark this question as used
    const questionKey = `${vocab.english}_${vocab.vietnamese}`;
    questionHistoryManager.addQuestion(topicKey, questionKey);

    const incorrectAnswers = generateIncorrectAnswers(
      vocab.english,
      pool,
      "english"
    );
    const allOptions = shuffleArray([
      { id: "a", text: vocab.english, isCorrect: true },
      { id: "b", text: incorrectAnswers[0], isCorrect: false },
      { id: "c", text: incorrectAnswers[1], isCorrect: false },
      { id: "d", text: incorrectAnswers[2], isCorrect: false },
    ]);

    return {
      id: index + 1,
      type: "translation_vi_en",
      question: `How do you say "${vocab.vietnamese}" in English?`,
      questionVi: `"${vocab.vietnamese}" trong tiếng Anh là gì?`,
      options: allOptions,
      pronunciation: vocab.pronunciation,
      wordType: vocab.type,
      topicInfo: vocab.topicName
        ? { name: vocab.topicName, emoji: vocab.topicEmoji }
        : null,
    };
  });
};

/**
 * Enhanced fill-in-the-blank questions with smart template selection
 */
const generateFillBlankQuestions = (
  vocabData,
  count = 3,
  answerPool = null,
  topicKey = "default"
) => {
  // Get unused vocabulary items with performance optimization
  const unusedVocab = getUnusedVocab(vocabData, topicKey, count);
  const selectedVocab = shuffleArray(unusedVocab, count);
  const pool = answerPool || vocabData;

  // Enhanced sentence templates with better variety
  const templates = [
    "I saw a ___ at the zoo.",
    "The ___ is very beautiful.",
    "She likes to eat ___.",
    "My favorite ___ is red.",
    "We need to buy some ___.",
    "The ___ is on the table.",
    "He is wearing a ___ today.",
    "Look at that ___ over there!",
    "This ___ is expensive.",
    "I love this ___.",
    "Can you pass me the ___?",
    "The ___ smells good.",
  ];

  return selectedVocab.map((vocab, index) => {
    // Mark this question as used
    const questionKey = `${vocab.english}_${vocab.vietnamese}`;
    questionHistoryManager.addQuestion(topicKey, questionKey);

    // Smart template selection based on word type
    let selectedTemplates = templates;
    if (vocab.type === "n") {
      // noun
      selectedTemplates = templates.filter(
        (t) =>
          t.includes("a ___") || t.includes("the ___") || t.includes("some ___")
      );
    }

    const template =
      selectedTemplates[Math.floor(Math.random() * selectedTemplates.length)];
    const sentence = template.replace("___", vocab.english.toLowerCase());
    const sentenceWithBlank = template;

    const incorrectAnswers = generateIncorrectAnswers(
      vocab.english,
      pool,
      "english"
    );
    const allOptions = shuffleArray([
      { id: "a", text: vocab.english.toLowerCase(), isCorrect: true },
      {
        id: "b",
        text: incorrectAnswers[0]?.toLowerCase() || "option1",
        isCorrect: false,
      },
      {
        id: "c",
        text: incorrectAnswers[1]?.toLowerCase() || "option2",
        isCorrect: false,
      },
      {
        id: "d",
        text: incorrectAnswers[2]?.toLowerCase() || "option3",
        isCorrect: false,
      },
    ]);

    return {
      id: index + 1,
      type: "fill_blank",
      question: `Complete the sentence: "${sentenceWithBlank}"`,
      questionVi: `Hoàn thành câu: "${sentenceWithBlank}" (${vocab.vietnamese})`,
      options: allOptions,
      completeSentence: sentence,
      pronunciation: vocab.pronunciation,
      wordType: vocab.type,
      topicInfo: vocab.topicName
        ? { name: vocab.topicName, emoji: vocab.topicEmoji }
        : null,
    };
  });
};

/**
 * Enhanced pronunciation questions with better filtering
 */
const generatePronunciationQuestions = (
  vocabData,
  count = 3,
  answerPool = null,
  topicKey = "default"
) => {
  // Filter and get unused vocabulary items with pronunciation
  const vocabWithPronunciation = vocabData.filter((item) => item.pronunciation);
  const unusedVocab = getUnusedVocab(vocabWithPronunciation, topicKey, count);
  const selectedVocab = shuffleArray(unusedVocab, count);
  const pool = (answerPool || vocabData).filter((item) => item.pronunciation);

  return selectedVocab.map((vocab, index) => {
    // Mark this question as used
    const questionKey = `${vocab.english}_${vocab.vietnamese}`;
    questionHistoryManager.addQuestion(topicKey, questionKey);

    const incorrectAnswers = generateIncorrectAnswers(
      vocab.pronunciation,
      pool,
      "pronunciation"
    );
    const allOptions = shuffleArray([
      { id: "a", text: vocab.pronunciation, isCorrect: true },
      { id: "b", text: incorrectAnswers[0] || "/ˈdʌmi/", isCorrect: false },
      { id: "c", text: incorrectAnswers[1] || "/ˈsæmpl/", isCorrect: false },
      { id: "d", text: incorrectAnswers[2] || "/ˈekspl/", isCorrect: false },
    ]);

    return {
      id: index + 1,
      type: "pronunciation",
      question: `How is "${vocab.english}" pronounced?`,
      questionVi: `"${vocab.english}" (${vocab.vietnamese}) được phát âm như thế nào?`,
      options: allOptions,
      wordType: vocab.type,
      topicInfo: vocab.topicName
        ? { name: vocab.topicName, emoji: vocab.topicEmoji }
        : null,
    };
  });
};

/**
 * Enhanced mixed quiz with optimized distribution
 */
export const generateMixedQuiz = (
  vocabData,
  totalQuestions = 10,
  answerPool = null,
  topicKey = "default"
) => {
  if (!vocabData || vocabData.length === 0) {
    return [];
  }

  // Ensure we have enough data
  const availableQuestions = Math.min(totalQuestions, vocabData.length);
  const pool = answerPool || vocabData;

  // Enhanced distribution with better balance
  const distributions = {
    small: {
      translation: 0.5,
      reverse: 0.3,
      fillBlank: 0.1,
      pronunciation: 0.1,
    },
    medium: {
      translation: 0.4,
      reverse: 0.3,
      fillBlank: 0.2,
      pronunciation: 0.1,
    },
    large: {
      translation: 0.35,
      reverse: 0.25,
      fillBlank: 0.25,
      pronunciation: 0.15,
    },
  };

  let distKey = "medium";
  if (availableQuestions <= 5) {
    distKey = "small";
  } else if (availableQuestions > 15) {
    distKey = "large";
  }

  const dist = distributions[distKey];

  const translationCount = Math.ceil(availableQuestions * dist.translation);
  const reverseCount = Math.ceil(availableQuestions * dist.reverse);
  const fillBlankCount = Math.ceil(availableQuestions * dist.fillBlank);
  const pronunciationCount = Math.max(
    1,
    availableQuestions - translationCount - reverseCount - fillBlankCount
  );

  // Generate questions with optimized selection
  const questions = [];

  try {
    questions.push(
      ...generateTranslationQuestions(
        vocabData,
        translationCount,
        pool,
        topicKey
      )
    );
    questions.push(
      ...generateReverseTranslationQuestions(
        vocabData,
        reverseCount,
        pool,
        topicKey
      )
    );
    questions.push(
      ...generateFillBlankQuestions(vocabData, fillBlankCount, pool, topicKey)
    );
    questions.push(
      ...generatePronunciationQuestions(
        vocabData,
        pronunciationCount,
        pool,
        topicKey
      )
    );
  } catch (error) {
    console.warn(
      "Error in question generation, falling back to simple generation:",
      error
    );
    // Fallback to simple random selection
    const selectedVocab = shuffleArray(vocabData, availableQuestions);
    return selectedVocab.map((vocab, index) => ({
      id: index + 1,
      type: "translation_en_vi",
      question: `What does "${vocab.english}" mean?`,
      questionVi: `"${vocab.english}" có nghĩa là gì?`,
      options: shuffleArray([
        { id: "a", text: vocab.vietnamese, isCorrect: true },
        { id: "b", text: "Option 1", isCorrect: false },
        { id: "c", text: "Option 2", isCorrect: false },
        { id: "d", text: "Option 3", isCorrect: false },
      ]),
      pronunciation: vocab.pronunciation,
      wordType: vocab.type,
      topicInfo: vocab.topicName
        ? { name: vocab.topicName, emoji: vocab.topicEmoji }
        : null,
    }));
  }

  // Optimized final shuffle with better randomization
  const finalQuestions = shuffleArray(questions, availableQuestions);
  return finalQuestions.map((q, index) => ({ ...q, id: index + 1 }));
};

/**
 * Generate quiz by specific type
 */
export const generateQuizByType = (
  vocabData,
  type,
  count = 10,
  allVocabData = null,
  topicKey = "default"
) => {
  // Use provided allVocabData for generating incorrect answers, or fall back to vocabData
  const answerPool = allVocabData || vocabData;

  switch (type) {
    case "translation":
      return generateTranslationQuestions(
        vocabData,
        count,
        answerPool,
        topicKey
      );
    case "reverse_translation":
      return generateReverseTranslationQuestions(
        vocabData,
        count,
        answerPool,
        topicKey
      );
    case "fill_blank":
      return generateFillBlankQuestions(vocabData, count, answerPool, topicKey);
    case "pronunciation":
      return generatePronunciationQuestions(
        vocabData,
        count,
        answerPool,
        topicKey
      );
    case "mixed":
    default:
      return generateMixedQuiz(vocabData, count, answerPool, topicKey);
  }
};

/**
 * Available topic data files
 */
export const AVAILABLE_TOPICS = {
  animal: { name: "Animals", emoji: "🐾", file: "Animal.json" },
  food: { name: "Food", emoji: "🍽️", file: "Food.json" },
  color: { name: "Colors", emoji: "🎨", file: "Color.json" },
  family: { name: "Family", emoji: "👨‍👩‍👧‍👦", file: "Family.json" },
  clothes: { name: "Clothes", emoji: "👕", file: "Clothes.json" },
  fruit: { name: "Fruits", emoji: "🍎", file: "Fruit.json" },
  vegetable: { name: "Vegetables", emoji: "🥕", file: "Vegetable.json" },
  sport: { name: "Sports", emoji: "⚽", file: "Sport.json" },
  weather: { name: "Weather", emoji: "🌤️", file: "Weather.json" },
  travel: { name: "Travel", emoji: "✈️", file: "Travel.json" },
  school: { name: "School", emoji: "🎒", file: "School.json" },
  job: { name: "Jobs", emoji: "💼", file: "Job.json" },
  health: { name: "Health", emoji: "🏥", file: "Health.json" },
  shopping: { name: "Shopping", emoji: "🛒", file: "Shopping.json" },
  kitchen: { name: "Kitchen", emoji: "🍳", file: "Kitchen.json" },
  arts: { name: "Arts", emoji: "🎨", file: "Arts.json" },
};

/**
 * Import vocabulary data dynamically
 */
export const importTopicData = async (topicKey) => {
  try {
    const topicInfo = AVAILABLE_TOPICS[topicKey];
    if (!topicInfo) {
      throw new Error(`Topic "${topicKey}" not found`);
    }

    console.log(`Loading topic data for: ${topicKey}, file: ${topicInfo.file}`);

    // Use fetch instead of dynamic import for JSON files
    const response = await fetch(`/data/${topicInfo.file}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${topicInfo.file}: ${response.status}`);
    }

    const data = await response.json();
    console.log(
      `Successfully loaded ${data.length} items for topic: ${topicKey}`
    );
    return data;
  } catch (error) {
    console.error(`Error loading topic data for ${topicKey}:`, error);
    return [];
  }
};

/**
 * Import all topic data for comprehensive review
 */
export const importAllTopicsData = async () => {
  try {
    const allData = [];
    const topicKeys = Object.keys(AVAILABLE_TOPICS);

    for (const topicKey of topicKeys) {
      try {
        const topicData = await importTopicData(topicKey);
        if (topicData && topicData.length > 0) {
          // Add topic information to each vocabulary item
          const enrichedData = topicData.map((item) => ({
            ...item,
            topicKey,
            topicName: AVAILABLE_TOPICS[topicKey].name,
            topicEmoji: AVAILABLE_TOPICS[topicKey].emoji,
          }));
          allData.push(...enrichedData);
        }
      } catch (error) {
        console.warn(`Failed to load topic ${topicKey}:`, error);
      }
    }

    return allData;
  } catch (error) {
    console.error("Error loading all topics data:", error);
    return [];
  }
};

/**
 * Enhanced all-topics quiz with optimized selection
 */
export const generateAllTopicsQuiz = async (
  quizType = "mixed",
  questionCount = null
) => {
  try {
    const allData = await importAllTopicsData();
    if (allData.length === 0) {
      throw new Error("No vocabulary data available");
    }

    // Group data by topic for balanced distribution
    const topicGroups = {};
    allData.forEach((item) => {
      if (!topicGroups[item.topicKey]) {
        topicGroups[item.topicKey] = [];
      }
      topicGroups[item.topicKey].push(item);
    });

    const topicKeys = Object.keys(topicGroups);

    // Auto-calculate optimal question count if not provided
    if (!questionCount) {
      // Use 5 questions per topic, but max 100 total
      questionCount = Math.min(topicKeys.length * 5, 100);
    }

    // Calculate how many questions per topic with better distribution
    const questionsPerTopic = Math.floor(questionCount / topicKeys.length);
    const remainingQuestions = questionCount % topicKeys.length;

    // Select vocabulary items from each topic, avoiding recently used ones
    let selectedVocab = [];

    for (const [index, topicKey] of topicKeys.entries()) {
      const unusedTopicData = getUnusedVocab(topicGroups[topicKey], topicKey);
      const count = questionsPerTopic + (index < remainingQuestions ? 1 : 0);

      if (unusedTopicData.length > 0) {
        const selectedFromTopic = shuffleArray(unusedTopicData, count);
        selectedVocab.push(...selectedFromTopic);
      }
    }

    // If we don't have enough items, fill from all available data
    if (selectedVocab.length < questionCount) {
      const remaining = questionCount - selectedVocab.length;
      const availableItems = allData.filter(
        (item) =>
          !selectedVocab.some(
            (selected) =>
              selected.english === item.english &&
              selected.topicKey === item.topicKey
          )
      );
      selectedVocab.push(...shuffleArray(availableItems, remaining));
    }

    // Generate questions using the selected vocabulary with 'all' as topicKey
    return generateQuizByType(
      selectedVocab,
      quizType,
      questionCount,
      allData,
      "all"
    );
  } catch (error) {
    console.error("Error generating all topics quiz:", error);
    return [];
  }
};
