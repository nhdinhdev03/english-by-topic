// Utility functions for generating quiz questions from data files

/**
 * Shuffle array using Fisher-Yates algorithm
 */
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Generate random incorrect answers from other vocabulary items
 */
const generateIncorrectAnswers = (correctAnswer, allVocab, answerType = 'vietnamese', count = 3) => {
  const incorrect = allVocab
    .filter(item => item[answerType] !== correctAnswer)
    .map(item => item[answerType]);
  
  return shuffleArray(incorrect).slice(0, count);
};

/**
 * Generate vocabulary translation questions (English to Vietnamese)
 */
const generateTranslationQuestions = (vocabData, count = 5, answerPool = null) => {
  const shuffledVocab = shuffleArray(vocabData).slice(0, count);
  const pool = answerPool || vocabData;
  
  return shuffledVocab.map((vocab, index) => {
    const incorrectAnswers = generateIncorrectAnswers(vocab.vietnamese, pool, 'vietnamese');
    const allOptions = shuffleArray([
      { id: 'a', text: vocab.vietnamese, isCorrect: true },
      { id: 'b', text: incorrectAnswers[0], isCorrect: false },
      { id: 'c', text: incorrectAnswers[1], isCorrect: false },
      { id: 'd', text: incorrectAnswers[2], isCorrect: false }
    ]);

    return {
      id: index + 1,
      type: 'translation_en_vi',
      question: `What does "${vocab.english}" mean?`,
      questionVi: `"${vocab.english}" có nghĩa là gì?`,
      options: allOptions,
      pronunciation: vocab.pronunciation,
      wordType: vocab.type,
      topicInfo: vocab.topicName ? { name: vocab.topicName, emoji: vocab.topicEmoji } : null
    };
  });
};

/**
 * Generate reverse translation questions (Vietnamese to English)
 */
const generateReverseTranslationQuestions = (vocabData, count = 5, answerPool = null) => {
  const shuffledVocab = shuffleArray(vocabData).slice(0, count);
  const pool = answerPool || vocabData;
  
  return shuffledVocab.map((vocab, index) => {
    const incorrectAnswers = generateIncorrectAnswers(vocab.english, pool, 'english');
    const allOptions = shuffleArray([
      { id: 'a', text: vocab.english, isCorrect: true },
      { id: 'b', text: incorrectAnswers[0], isCorrect: false },
      { id: 'c', text: incorrectAnswers[1], isCorrect: false },
      { id: 'd', text: incorrectAnswers[2], isCorrect: false }
    ]);

    return {
      id: index + 1,
      type: 'translation_vi_en',
      question: `How do you say "${vocab.vietnamese}" in English?`,
      questionVi: `"${vocab.vietnamese}" trong tiếng Anh là gì?`,
      options: allOptions,
      pronunciation: vocab.pronunciation,
      wordType: vocab.type,
      topicInfo: vocab.topicName ? { name: vocab.topicName, emoji: vocab.topicEmoji } : null
    };
  });
};

/**
 * Generate fill-in-the-blank questions
 */
const generateFillBlankQuestions = (vocabData, count = 3, answerPool = null) => {
  const shuffledVocab = shuffleArray(vocabData).slice(0, count);
  const pool = answerPool || vocabData;
  
  // Simple sentence templates
  const templates = [
    "I saw a ___ at the zoo.",
    "The ___ is very beautiful.",
    "She likes to eat ___.",
    "My favorite ___ is red.",
    "We need to buy some ___.",
    "The ___ is on the table.",
    "He is wearing a ___ today.",
    "Look at that ___ over there!"
  ];

  return shuffledVocab.map((vocab, index) => {
    const template = templates[Math.floor(Math.random() * templates.length)];
    const sentence = template.replace('___', vocab.english.toLowerCase());
    const sentenceWithBlank = template;
    
    const incorrectAnswers = generateIncorrectAnswers(vocab.english, pool, 'english');
    const allOptions = shuffleArray([
      { id: 'a', text: vocab.english.toLowerCase(), isCorrect: true },
      { id: 'b', text: incorrectAnswers[0].toLowerCase(), isCorrect: false },
      { id: 'c', text: incorrectAnswers[1].toLowerCase(), isCorrect: false },
      { id: 'd', text: incorrectAnswers[2].toLowerCase(), isCorrect: false }
    ]);

    return {
      id: index + 1,
      type: 'fill_blank',
      question: `Complete the sentence: "${sentenceWithBlank}"`,
      questionVi: `Hoàn thành câu: "${sentenceWithBlank}" (${vocab.vietnamese})`,
      options: allOptions,
      completeSentence: sentence,
      pronunciation: vocab.pronunciation,
      wordType: vocab.type,
      topicInfo: vocab.topicName ? { name: vocab.topicName, emoji: vocab.topicEmoji } : null
    };
  });
};

/**
 * Generate pronunciation questions
 */
const generatePronunciationQuestions = (vocabData, count = 3, answerPool = null) => {
  const shuffledVocab = shuffleArray(vocabData.filter(item => item.pronunciation)).slice(0, count);
  const pool = answerPool || vocabData;
  
  return shuffledVocab.map((vocab, index) => {
    const incorrectAnswers = generateIncorrectAnswers(vocab.pronunciation, pool.filter(item => item.pronunciation), 'pronunciation');
    const allOptions = shuffleArray([
      { id: 'a', text: vocab.pronunciation, isCorrect: true },
      { id: 'b', text: incorrectAnswers[0], isCorrect: false },
      { id: 'c', text: incorrectAnswers[1], isCorrect: false },
      { id: 'd', text: incorrectAnswers[2], isCorrect: false }
    ]);

    return {
      id: index + 1,
      type: 'pronunciation',
      question: `How is "${vocab.english}" pronounced?`,
      questionVi: `"${vocab.english}" (${vocab.vietnamese}) được phát âm như thế nào?`,
      options: allOptions,
      wordType: vocab.type,
      topicInfo: vocab.topicName ? { name: vocab.topicName, emoji: vocab.topicEmoji } : null
    };
  });
};

/**
 * Generate mixed quiz from vocabulary data
 */
export const generateMixedQuiz = (vocabData, totalQuestions = 10, answerPool = null) => {
  if (!vocabData || vocabData.length === 0) {
    return [];
  }

  // Ensure we have enough data
  const availableQuestions = Math.min(totalQuestions, vocabData.length);
  const pool = answerPool || vocabData;
  
  // Distribute question types
  const translationCount = Math.ceil(availableQuestions * 0.4); // 40% translation
  const reverseCount = Math.ceil(availableQuestions * 0.3); // 30% reverse translation
  const fillBlankCount = Math.ceil(availableQuestions * 0.2); // 20% fill blank
  const pronunciationCount = availableQuestions - translationCount - reverseCount - fillBlankCount; // remaining for pronunciation

  const questions = [
    ...generateTranslationQuestions(vocabData, translationCount, pool),
    ...generateReverseTranslationQuestions(vocabData, reverseCount, pool),
    ...generateFillBlankQuestions(vocabData, fillBlankCount, pool),
    ...generatePronunciationQuestions(vocabData, pronunciationCount, pool)
  ];

  // Shuffle all questions and assign sequential IDs
  const shuffledQuestions = shuffleArray(questions).slice(0, availableQuestions);
  return shuffledQuestions.map((q, index) => ({ ...q, id: index + 1 }));
};

/**
 * Generate quiz by specific type
 */
export const generateQuizByType = (vocabData, type, count = 10, allVocabData = null) => {
  // Use provided allVocabData for generating incorrect answers, or fall back to vocabData
  const answerPool = allVocabData || vocabData;
  
  switch (type) {
    case 'translation':
      return generateTranslationQuestions(vocabData, count, answerPool);
    case 'reverse_translation':
      return generateReverseTranslationQuestions(vocabData, count, answerPool);
    case 'fill_blank':
      return generateFillBlankQuestions(vocabData, count, answerPool);
    case 'pronunciation':
      return generatePronunciationQuestions(vocabData, count, answerPool);
    case 'mixed':
    default:
      return generateMixedQuiz(vocabData, count, answerPool);
  }
};

/**
 * Available topic data files
 */
export const AVAILABLE_TOPICS = {
  animal: { name: 'Animals', emoji: '🐾', file: 'Animal.json' },
  food: { name: 'Food', emoji: '🍽️', file: 'Food.json' },
  color: { name: 'Colors', emoji: '🎨', file: 'Color.json' },
  family: { name: 'Family', emoji: '👨‍👩‍👧‍👦', file: 'Family.json' },
  clothes: { name: 'Clothes', emoji: '👕', file: 'Clothes.json' },
  fruit: { name: 'Fruits', emoji: '🍎', file: 'Fruit.json' },
  vegetable: { name: 'Vegetables', emoji: '🥕', file: 'Vegetable.json' },
  sport: { name: 'Sports', emoji: '⚽', file: 'Sport.json' },
  weather: { name: 'Weather', emoji: '🌤️', file: 'Weather.json' },
  travel: { name: 'Travel', emoji: '✈️', file: 'Travel.json' },
  school: { name: 'School', emoji: '🎒', file: 'School.json' },
  job: { name: 'Jobs', emoji: '💼', file: 'Job.json' },
  health: { name: 'Health', emoji: '🏥', file: 'Health.json' },
  shopping: { name: 'Shopping', emoji: '🛒', file: 'Shopping.json' },
  kitchen: { name: 'Kitchen', emoji: '🍳', file: 'Kitchen.json' }
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
    
    const module = await import(`../data/${topicInfo.file}`);
    return module.default;
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
          const enrichedData = topicData.map(item => ({
            ...item,
            topicKey,
            topicName: AVAILABLE_TOPICS[topicKey].name,
            topicEmoji: AVAILABLE_TOPICS[topicKey].emoji
          }));
          allData.push(...enrichedData);
        }
      } catch (error) {
        console.warn(`Failed to load topic ${topicKey}:`, error);
      }
    }
    
    return allData;
  } catch (error) {
    console.error('Error loading all topics data:', error);
    return [];
  }
};

/**
 * Generate balanced quiz from all topics
 */
export const generateAllTopicsQuiz = async (quizType = 'mixed', questionCount = null) => {
  try {
    const allData = await importAllTopicsData();
    if (allData.length === 0) {
      throw new Error('No vocabulary data available');
    }
    
    // Group data by topic for balanced distribution
    const topicGroups = {};
    allData.forEach(item => {
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
    
    // Calculate how many questions per topic
    const questionsPerTopic = Math.floor(questionCount / topicKeys.length);
    const remainingQuestions = questionCount % topicKeys.length;
    
    // Select vocabulary items from each topic
    let selectedVocab = [];
    topicKeys.forEach((topicKey, index) => {
      const topicData = shuffleArray(topicGroups[topicKey]);
      const count = questionsPerTopic + (index < remainingQuestions ? 1 : 0);
      selectedVocab.push(...topicData.slice(0, count));
    });
    
    // If we don't have enough items, fill from all available data
    if (selectedVocab.length < questionCount) {
      const remaining = questionCount - selectedVocab.length;
      const availableItems = allData.filter(item => 
        !selectedVocab.some(selected => 
          selected.english === item.english && selected.topicKey === item.topicKey
        )
      );
      selectedVocab.push(...shuffleArray(availableItems).slice(0, remaining));
    }
    
    // Generate questions using the selected vocabulary
    return generateQuizByType(selectedVocab, quizType, questionCount, allData);
    
  } catch (error) {
    console.error('Error generating all topics quiz:', error);
    return [];
  }
};