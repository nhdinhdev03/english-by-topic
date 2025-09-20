// Utility functions for managing quiz progress and statistics

const STORAGE_KEYS = {
  QUIZ_HISTORY: 'english_quiz_history',
  QUIZ_STATS: 'english_quiz_stats',
  TOPIC_PROGRESS: 'english_topic_progress'
};

/**
 * Save quiz result to localStorage
 */
export const saveQuizResult = (result) => {
  try {
    const history = getQuizHistory();
    const newResult = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...result
    };
    
    history.push(newResult);
    
    // Keep only last 50 results
    if (history.length > 50) {
      history.splice(0, history.length - 50);
    }
    
    localStorage.setItem(STORAGE_KEYS.QUIZ_HISTORY, JSON.stringify(history));
    updateQuizStats(newResult);
    updateTopicProgress(newResult);
    
    return newResult;
  } catch (error) {
    console.error('Error saving quiz result:', error);
    return null;
  }
};

/**
 * Get quiz history from localStorage
 */
export const getQuizHistory = () => {
  try {
    const history = localStorage.getItem(STORAGE_KEYS.QUIZ_HISTORY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error getting quiz history:', error);
    return [];
  }
};

/**
 * Get quiz statistics
 */
export const getQuizStats = () => {
  try {
    const stats = localStorage.getItem(STORAGE_KEYS.QUIZ_STATS);
    return stats ? JSON.parse(stats) : {
      totalQuizzes: 0,
      totalQuestions: 0,
      correctAnswers: 0,
      averageScore: 0,
      bestScore: 0,
      favoriteTopics: {},
      preferredQuizTypes: {},
      weeklyProgress: [],
      streakDays: 0,
      lastQuizDate: null
    };
  } catch (error) {
    console.error('Error getting quiz stats:', error);
    return {};
  }
};

/**
 * Update quiz statistics
 */
const updateQuizStats = (result) => {
  try {
    const stats = getQuizStats();
    const today = new Date().toDateString();
    
    // Update basic stats
    stats.totalQuizzes += 1;
    stats.totalQuestions += result.totalQuestions;
    stats.correctAnswers += result.score;
    stats.averageScore = (stats.correctAnswers / stats.totalQuestions) * 100;
    stats.bestScore = Math.max(stats.bestScore || 0, result.percentage);
    
    // Update topic preferences
    if (!stats.favoriteTopics[result.topic]) {
      stats.favoriteTopics[result.topic] = 0;
    }
    stats.favoriteTopics[result.topic] += 1;
    
    // Update quiz type preferences
    if (!stats.preferredQuizTypes[result.quizType]) {
      stats.preferredQuizTypes[result.quizType] = 0;
    }
    stats.preferredQuizTypes[result.quizType] += 1;
    
    // Update streak
    if (stats.lastQuizDate !== today) {
      const lastDate = new Date(stats.lastQuizDate || today);
      const todayDate = new Date(today);
      const daysDiff = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        stats.streakDays += 1;
      } else if (daysDiff > 1) {
        stats.streakDays = 1;
      } else {
        // Same day, keep streak
      }
      
      stats.lastQuizDate = today;
    }
    
    // Update weekly progress
    const weekKey = getWeekKey(new Date());
    let weeklyEntry = stats.weeklyProgress.find(w => w.week === weekKey);
    
    if (!weeklyEntry) {
      weeklyEntry = {
        week: weekKey,
        quizzes: 0,
        totalScore: 0,
        bestScore: 0
      };
      stats.weeklyProgress.push(weeklyEntry);
    }
    
    weeklyEntry.quizzes += 1;
    weeklyEntry.totalScore += result.percentage;
    weeklyEntry.bestScore = Math.max(weeklyEntry.bestScore, result.percentage);
    
    // Keep only last 12 weeks
    if (stats.weeklyProgress.length > 12) {
      stats.weeklyProgress.sort((a, b) => a.week.localeCompare(b.week));
      stats.weeklyProgress = stats.weeklyProgress.slice(-12);
    }
    
    localStorage.setItem(STORAGE_KEYS.QUIZ_STATS, JSON.stringify(stats));
  } catch (error) {
    console.error('Error updating quiz stats:', error);
  }
};

/**
 * Get topic progress
 */
export const getTopicProgress = () => {
  try {
    const progress = localStorage.getItem(STORAGE_KEYS.TOPIC_PROGRESS);
    return progress ? JSON.parse(progress) : {};
  } catch (error) {
    console.error('Error getting topic progress:', error);
    return {};
  }
};

/**
 * Update topic progress
 */
const updateTopicProgress = (result) => {
  try {
    const progress = getTopicProgress();
    
    if (!progress[result.topic]) {
      progress[result.topic] = {
        totalQuizzes: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        bestScore: 0,
        lastPlayed: null,
        quizTypes: {}
      };
    }
    
    const topicData = progress[result.topic];
    topicData.totalQuizzes += 1;
    topicData.totalQuestions += result.totalQuestions;
    topicData.correctAnswers += result.score;
    topicData.bestScore = Math.max(topicData.bestScore, result.percentage);
    topicData.lastPlayed = new Date().toISOString();
    
    // Update quiz type performance for this topic
    if (!topicData.quizTypes[result.quizType]) {
      topicData.quizTypes[result.quizType] = {
        attempts: 0,
        totalScore: 0,
        bestScore: 0
      };
    }
    
    const quizTypeData = topicData.quizTypes[result.quizType];
    quizTypeData.attempts += 1;
    quizTypeData.totalScore += result.percentage;
    quizTypeData.bestScore = Math.max(quizTypeData.bestScore, result.percentage);
    
    localStorage.setItem(STORAGE_KEYS.TOPIC_PROGRESS, JSON.stringify(progress));
  } catch (error) {
    console.error('Error updating topic progress:', error);
  }
};

/**
 * Get week key for grouping weekly progress
 */
const getWeekKey = (date) => {
  const year = date.getFullYear();
  const weekNumber = getWeekNumber(date);
  return `${year}-W${weekNumber.toString().padStart(2, '0')}`;
};

/**
 * Get week number of the year
 */
const getWeekNumber = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

/**
 * Get recent quiz performance
 */
export const getRecentPerformance = (days = 7) => {
  try {
    const history = getQuizHistory();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const recentQuizzes = history.filter(quiz => 
      new Date(quiz.timestamp) >= cutoffDate
    );
    
    if (recentQuizzes.length === 0) {
      return {
        totalQuizzes: 0,
        averageScore: 0,
        improvement: 0,
        topTopics: []
      };
    }
    
    const totalScore = recentQuizzes.reduce((sum, quiz) => sum + quiz.percentage, 0);
    const averageScore = totalScore / recentQuizzes.length;
    
    // Calculate improvement (compare first half vs second half)
    const halfPoint = Math.floor(recentQuizzes.length / 2);
    const firstHalf = recentQuizzes.slice(0, halfPoint);
    const secondHalf = recentQuizzes.slice(halfPoint);
    
    let improvement = 0;
    if (firstHalf.length > 0 && secondHalf.length > 0) {
      const firstAvg = firstHalf.reduce((sum, quiz) => sum + quiz.percentage, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((sum, quiz) => sum + quiz.percentage, 0) / secondHalf.length;
      improvement = secondAvg - firstAvg;
    }
    
    // Get top topics
    const topicCounts = {};
    recentQuizzes.forEach(quiz => {
      topicCounts[quiz.topic] = (topicCounts[quiz.topic] || 0) + 1;
    });
    
    const topTopics = Object.entries(topicCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([topic, count]) => ({ topic, count }));
    
    return {
      totalQuizzes: recentQuizzes.length,
      averageScore: Math.round(averageScore),
      improvement: Math.round(improvement),
      topTopics
    };
  } catch (error) {
    console.error('Error getting recent performance:', error);
    return {
      totalQuizzes: 0,
      averageScore: 0,
      improvement: 0,
      topTopics: []
    };
  }
};

/**
 * Clear all quiz data
 */
export const clearQuizData = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.QUIZ_HISTORY);
    localStorage.removeItem(STORAGE_KEYS.QUIZ_STATS);
    localStorage.removeItem(STORAGE_KEYS.TOPIC_PROGRESS);
    return true;
  } catch (error) {
    console.error('Error clearing quiz data:', error);
    return false;
  }
};