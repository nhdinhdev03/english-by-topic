import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  getTopicProgress,
  updateTopicProgress,
  getLearnedWords,
  markWordAsLearned,
  saveQuizResult,
  getQuizResults,
  getUserStats,
  initializeTopicProgress
} from '../utils/progressStorage';

const ProgressContext = createContext();

export const ProgressProvider = ({ children }) => {
  const [userStats, setUserStats] = useState({
    totalWords: 0,
    totalLearnedWords: 0,
    totalQuizzes: 0,
    averageScore: 0,
    overallProgress: 0,
    topicsStarted: 0,
    lastActivity: null
  });

  // Refresh user stats từ localStorage
  const refreshUserStats = useCallback(() => {
    const stats = getUserStats();
    setUserStats(stats);
  }, []);

  // Load stats khi component mount
  useEffect(() => {
    refreshUserStats();
  }, [refreshUserStats]);

  // Lấy tiến độ của một topic
  const getTopicProgressData = useCallback((topicId) => {
    return getTopicProgress(topicId);
  }, []);

  // Khởi tạo topic mới
  const initializeTopic = useCallback((topicId, totalWords) => {
    initializeTopicProgress(topicId, totalWords);
    refreshUserStats();
  }, [refreshUserStats]);

  // Cập nhật tiến độ topic
  const updateTopicProgressData = useCallback((topicId, progressData) => {
    updateTopicProgress(topicId, progressData);
    refreshUserStats();
  }, [refreshUserStats]);

  // Lấy danh sách từ đã học
  const getTopicLearnedWords = useCallback((topicId) => {
    return getLearnedWords(topicId);
  }, []);

  // Đánh dấu từ đã học
  const markWordLearned = useCallback((topicId, word) => {
    markWordAsLearned(topicId, word);
    refreshUserStats();
  }, [refreshUserStats]);

  // Lưu kết quả quiz
  const saveTopicQuizResult = useCallback((topicId, quizResult) => {
    saveQuizResult(topicId, quizResult);
    refreshUserStats();
  }, [refreshUserStats]);

  // Lấy kết quả quiz
  const getTopicQuizResults = useCallback((topicId) => {
    return getQuizResults(topicId);
  }, []);

  // Lấy tất cả topics đã học
  const getAllTopicsProgress = useCallback(() => {
    try {
      const progressData = JSON.parse(localStorage.getItem('english_topic_progress') || '{}');
      return progressData;
    } catch (error) {
      console.error('Error getting all topics progress:', error);
      return {};
    }
  }, []);

  // Tính toán streak (số ngày học liên tiếp)
  const calculateStreak = useCallback(() => {
    try {
      const progressData = getAllTopicsProgress();
      const dates = [];
      
      Object.values(progressData).forEach(progress => {
        if (progress.lastStudied) {
          const date = new Date(progress.lastStudied).toDateString();
          if (!dates.includes(date)) {
            dates.push(date);
          }
        }
      });
      
      // Sắp xếp dates theo thứ tự giảm dần
      dates.sort((a, b) => new Date(b) - new Date(a));
      
      let streak = 0;
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
      
      // Kiểm tra xem hôm nay hoặc hôm qua có học không
      if (dates.length > 0 && (dates[0] === today || dates[0] === yesterday)) {
        streak = 1;
        
        // Tính streak liên tiếp
        for (let i = 1; i < dates.length; i++) {
          const currentDate = new Date(dates[i-1]);
          const prevDate = new Date(dates[i]);
          const diffDays = Math.floor((currentDate - prevDate) / (24 * 60 * 60 * 1000));
          
          if (diffDays === 1) {
            streak++;
          } else {
            break;
          }
        }
      }
      
      return streak;
    } catch (error) {
      console.error('Error calculating streak:', error);
      return 0;
    }
  }, [getAllTopicsProgress]);

  // Lấy words cần ôn tập (đã học lâu rồi)
  const getWordsForReview = useCallback((topicId, daysThreshold = 7) => {
    try {
      const learnedWords = getLearnedWords(topicId);
      const now = new Date();
      
      return learnedWords.filter(word => {
        const learnedDate = new Date(word.learnedAt);
        const daysDiff = Math.floor((now - learnedDate) / (24 * 60 * 60 * 1000));
        return daysDiff >= daysThreshold;
      });
    } catch (error) {
      console.error('Error getting words for review:', error);
      return [];
    }
  }, []);

  // Lấy thống kê chi tiết của một topic
  const getDetailedTopicStats = useCallback((topicId) => {
    try {
      const progress = getTopicProgress(topicId);
      const learnedWords = getLearnedWords(topicId);
      const quizResults = getQuizResults(topicId);
      
      const recentQuizzes = quizResults.slice(-5); // 5 quiz gần nhất
      const averageQuizScore = recentQuizzes.length > 0 
        ? Math.round(recentQuizzes.reduce((acc, quiz) => acc + ((quiz.correctAnswers / quiz.totalQuestions) * 100), 0) / recentQuizzes.length)
        : 0;
      
      const wordsNeedReview = getWordsForReview(topicId);
      
      return {
        ...progress,
        learnedWords: learnedWords.length,
        totalQuizzes: quizResults.length,
        averageQuizScore,
        wordsNeedReview: wordsNeedReview.length,
        recentActivity: learnedWords.slice(-10) // 10 từ học gần nhất
      };
    } catch (error) {
      console.error('Error getting detailed topic stats:', error);
      return null;
    }
  }, [getWordsForReview]);

  const value = useMemo(() => ({
    // State
    userStats,
    
    // Methods
    refreshUserStats,
    getTopicProgressData,
    initializeTopic,
    updateTopicProgressData,
    getTopicLearnedWords,
    markWordLearned,
    saveTopicQuizResult,
    getTopicQuizResults,
    getAllTopicsProgress,
    calculateStreak,
    getWordsForReview,
    getDetailedTopicStats
  }), [
    userStats,
    refreshUserStats,
    getTopicProgressData,
    initializeTopic,
    updateTopicProgressData,
    getTopicLearnedWords,
    markWordLearned,
    saveTopicQuizResult,
    getTopicQuizResults,
    getAllTopicsProgress,
    calculateStreak,
    getWordsForReview,
    getDetailedTopicStats
  ]);

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};

ProgressProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default ProgressContext;