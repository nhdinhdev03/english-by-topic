// Utility functions để quản lý dữ liệu progress trong localStorage

const STORAGE_KEYS = {
  TOPIC_PROGRESS: 'english_topic_progress',
  LEARNED_WORDS: 'english_learned_words',
  QUIZ_RESULTS: 'english_quiz_results',
  USER_STATS: 'english_user_stats'
};

/**
 * Lấy tiến độ của một topic cụ thể
 * @param {string} topicId - ID của topic
 * @returns {Object} Thông tin tiến độ của topic
 */
export const getTopicProgress = (topicId) => {
  try {
    const progressData = JSON.parse(localStorage.getItem(STORAGE_KEYS.TOPIC_PROGRESS) || '{}');
    return progressData[topicId] || {
      totalWords: 0,
      learnedWords: 0,
      percentage: 0,
      lastStudied: null,
      completedLessons: []
    };
  } catch (error) {
    console.error('Error getting topic progress:', error);
    return { totalWords: 0, learnedWords: 0, percentage: 0, lastStudied: null, completedLessons: [] };
  }
};

/**
 * Cập nhật tiến độ của một topic
 * @param {string} topicId - ID của topic
 * @param {Object} progressData - Dữ liệu tiến độ mới
 */
export const updateTopicProgress = (topicId, progressData) => {
  try {
    const allProgress = JSON.parse(localStorage.getItem(STORAGE_KEYS.TOPIC_PROGRESS) || '{}');
    allProgress[topicId] = {
      ...allProgress[topicId],
      ...progressData,
      lastStudied: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.TOPIC_PROGRESS, JSON.stringify(allProgress));
  } catch (error) {
    console.error('Error updating topic progress:', error);
  }
};

/**
 * Lấy danh sách từ đã học của một topic
 * @param {string} topicId - ID của topic
 * @returns {Array} Danh sách từ đã học
 */
export const getLearnedWords = (topicId) => {
  try {
    const learnedData = JSON.parse(localStorage.getItem(STORAGE_KEYS.LEARNED_WORDS) || '{}');
    return learnedData[topicId] || [];
  } catch (error) {
    console.error('Error getting learned words:', error);
    return [];
  }
};

/**
 * Đánh dấu một từ đã được học
 * @param {string} topicId - ID của topic
 * @param {Object} word - Thông tin từ đã học
 */
export const markWordAsLearned = (topicId, word) => {
  try {
    const learnedData = JSON.parse(localStorage.getItem(STORAGE_KEYS.LEARNED_WORDS) || '{}');
    if (!learnedData[topicId]) {
      learnedData[topicId] = [];
    }
    
    // Kiểm tra xem từ đã được học chưa
    const existingWordIndex = learnedData[topicId].findIndex(w => w.english === word.english);
    if (existingWordIndex === -1) {
      learnedData[topicId].push({
        ...word,
        learnedAt: new Date().toISOString(),
        reviewCount: 1
      });
    } else {
      // Tăng số lần ôn tập
      learnedData[topicId][existingWordIndex].reviewCount += 1;
      learnedData[topicId][existingWordIndex].lastReviewed = new Date().toISOString();
    }
    
    localStorage.setItem(STORAGE_KEYS.LEARNED_WORDS, JSON.stringify(learnedData));
    
    // Cập nhật tiến độ topic
    const currentProgress = getTopicProgress(topicId);
    const newLearnedCount = learnedData[topicId].length;
    const percentage = currentProgress.totalWords > 0 ? Math.round((newLearnedCount / currentProgress.totalWords) * 100) : 0;
    
    updateTopicProgress(topicId, {
      learnedWords: newLearnedCount,
      percentage: percentage
    });
    
  } catch (error) {
    console.error('Error marking word as learned:', error);
  }
};

/**
 * Lưu kết quả quiz
 * @param {string} topicId - ID của topic
 * @param {Object} quizResult - Kết quả quiz
 */
export const saveQuizResult = (topicId, quizResult) => {
  try {
    const quizData = JSON.parse(localStorage.getItem(STORAGE_KEYS.QUIZ_RESULTS) || '{}');
    if (!quizData[topicId]) {
      quizData[topicId] = [];
    }
    
    quizData[topicId].push({
      ...quizResult,
      completedAt: new Date().toISOString()
    });
    
    // Giữ chỉ 10 kết quả gần nhất
    if (quizData[topicId].length > 10) {
      quizData[topicId] = quizData[topicId].slice(-10);
    }
    
    localStorage.setItem(STORAGE_KEYS.QUIZ_RESULTS, JSON.stringify(quizData));
  } catch (error) {
    console.error('Error saving quiz result:', error);
  }
};

/**
 * Lấy kết quả quiz của một topic
 * @param {string} topicId - ID của topic
 * @returns {Array} Danh sách kết quả quiz
 */
export const getQuizResults = (topicId) => {
  try {
    const quizData = JSON.parse(localStorage.getItem(STORAGE_KEYS.QUIZ_RESULTS) || '{}');
    return quizData[topicId] || [];
  } catch (error) {
    console.error('Error getting quiz results:', error);
    return [];
  }
};

/**
 * Lấy thống kê tổng quan của người dùng
 * @returns {Object} Thống kê người dùng
 */
export const getUserStats = () => {
  try {
    const progressData = JSON.parse(localStorage.getItem(STORAGE_KEYS.TOPIC_PROGRESS) || '{}');
    const quizData = JSON.parse(localStorage.getItem(STORAGE_KEYS.QUIZ_RESULTS) || '{}');
    
    let totalWords = 0;
    let totalLearnedWords = 0;
    let totalQuizzes = 0;
    let totalCorrectAnswers = 0;
    let totalQuestions = 0;
    
    // Tính thống kê từ progress data
    Object.values(progressData).forEach(progress => {
      totalWords += progress.totalWords || 0;
      totalLearnedWords += progress.learnedWords || 0;
    });
    
    // Tính thống kê từ quiz data
    Object.values(quizData).forEach(topicQuizzes => {
      topicQuizzes.forEach(quiz => {
        totalQuizzes++;
        totalCorrectAnswers += quiz.correctAnswers || 0;
        totalQuestions += quiz.totalQuestions || 0;
      });
    });
    
    const averageScore = totalQuestions > 0 ? Math.round((totalCorrectAnswers / totalQuestions) * 100) : 0;
    const overallProgress = totalWords > 0 ? Math.round((totalLearnedWords / totalWords) * 100) : 0;
    
    return {
      totalWords,
      totalLearnedWords,
      totalQuizzes,
      averageScore,
      overallProgress,
      topicsStarted: Object.keys(progressData).length,
      lastActivity: getLastActivity()
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    return {
      totalWords: 0,
      totalLearnedWords: 0,
      totalQuizzes: 0,
      averageScore: 0,
      overallProgress: 0,
      topicsStarted: 0,
      lastActivity: null
    };
  }
};

/**
 * Lấy thời gian hoạt động gần nhất
 * @returns {string|null} Thời gian hoạt động gần nhất
 */
const getLastActivity = () => {
  try {
    const progressData = JSON.parse(localStorage.getItem(STORAGE_KEYS.TOPIC_PROGRESS) || '{}');
    let lastActivity = null;
    
    Object.values(progressData).forEach(progress => {
      if (progress.lastStudied && (!lastActivity || new Date(progress.lastStudied) > new Date(lastActivity))) {
        lastActivity = progress.lastStudied;
      }
    });
    
    return lastActivity;
  } catch (error) {
    console.error('Error getting last activity:', error);
    return null;
  }
};

/**
 * Khởi tạo tiến độ cho một topic mới
 * @param {string} topicId - ID của topic
 * @param {number} totalWords - Tổng số từ trong topic
 */
export const initializeTopicProgress = (topicId, totalWords) => {
  const existingProgress = getTopicProgress(topicId);
  if (existingProgress.totalWords === 0) {
    updateTopicProgress(topicId, {
      totalWords,
      learnedWords: 0,
      percentage: 0,
      completedLessons: []
    });
  }
};

/**
 * Reset toàn bộ dữ liệu progress (dùng cho testing hoặc reset tài khoản)
 */
export const resetAllProgress = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error resetting progress:', error);
  }
};

/**
 * Export/Import dữ liệu progress
 */
export const exportProgressData = () => {
  try {
    const data = {};
    Object.entries(STORAGE_KEYS).forEach(([key, storageKey]) => {
      data[key] = JSON.parse(localStorage.getItem(storageKey) || '{}');
    });
    return JSON.stringify(data, null, 2);
  } catch (error) {
    console.error('Error exporting progress data:', error);
    return null;
  }
};

export const importProgressData = (dataString) => {
  try {
    const data = JSON.parse(dataString);
    Object.entries(STORAGE_KEYS).forEach(([key, storageKey]) => {
      if (data[key]) {
        localStorage.setItem(storageKey, JSON.stringify(data[key]));
      }
    });
    return true;
  } catch (error) {
    console.error('Error importing progress data:', error);
    return false;
  }
};