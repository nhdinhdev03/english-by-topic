import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/useLanguage';
import { useProgress } from '../../contexts/useProgress';
import './Review.scss';

const Review = () => {
  const navigate = useNavigate();
  const { playText } = useLanguage();
  const { 
    getAllTopicsProgress, 
    getTopicLearnedWords, 
    markWordLearned
  } = useProgress();

  const [reviewWords, setReviewWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedWords, setReviewedWords] = useState(new Set());
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [selectedTopics, setSelectedTopics] = useState(new Set(['all']));
  const [reviewInterval, setReviewInterval] = useState(7); // days
  const [loading, setLoading] = useState(true);

  // Helper function to get topic display name
  const getTopicDisplayName = useCallback((topicId) => {
    const displayNames = {
      'daily-activities': 'Hoạt động hàng ngày',
      'food': 'Thức ăn',
      'travel': 'Du lịch',
      'animals': 'Động vật',
      'colors': 'Màu sắc',
      'family': 'Gia đình',
      'health': 'Sức khỏe',
      'work': 'Công việc',
      'count': 'Số đếm',
      'clothes': 'Quần áo',
      'weather': 'Thời tiết',
      'school': 'Trường học',
      'shopping': 'Mua sắm',
      'environment': 'Môi trường',
      'sport': 'Thể thao'
    };
    return displayNames[topicId] || topicId
      .replace(/\.json$/, '')
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }, []);

  // Spaced repetition intervals (in days)
  const SRS_INTERVALS = useMemo(() => ({
    1: 1,     // First review after 1 day
    2: 3,     // Second review after 3 days  
    3: 7,     // Third review after 1 week
    4: 14,    // Fourth review after 2 weeks
    5: 30,    // Fifth review after 1 month
    6: 90     // Sixth review after 3 months
  }), []);

  // Calculate when a word should be reviewed based on spaced repetition
  const getNextReviewDate = useCallback((word) => {
    const reviewCount = word.reviewCount || 1;
    const interval = SRS_INTERVALS[Math.min(reviewCount, 6)] || 90;
    const lastReviewed = new Date(word.lastReviewed || word.learnedAt);
    const nextReview = new Date(lastReviewed);
    nextReview.setDate(nextReview.getDate() + interval);
    return nextReview;
  }, [SRS_INTERVALS]);

  // Check if a word needs review
  const needsReview = useCallback((word) => {
    const nextReviewDate = getNextReviewDate(word);
    const now = new Date();
    return now >= nextReviewDate;
  }, [getNextReviewDate]);

  // Get all topics with learned words
  const availableTopics = useMemo(() => {
    const allProgress = getAllTopicsProgress();
    const topics = Object.keys(allProgress).map(topicId => {
      const learnedWords = getTopicLearnedWords(topicId);
      return {
        id: topicId,
        name: getTopicDisplayName(topicId),
        learnedCount: learnedWords.length,
        reviewCount: learnedWords.filter(needsReview).length
      };
    }).filter(topic => topic.learnedCount > 0);

    return topics;
  }, [getAllTopicsProgress, getTopicLearnedWords, needsReview, getTopicDisplayName]);

  // Load words for review
  useEffect(() => {
    const loadReviewWords = () => {
      setLoading(true);
      let allReviewWords = [];

      const topicsToReview = selectedTopics.has('all') 
        ? availableTopics.map(t => t.id)
        : Array.from(selectedTopics);

      topicsToReview.forEach(topicId => {
        const learnedWords = getTopicLearnedWords(topicId);
        const wordsForReview = learnedWords.filter(word => {
          // Filter by review interval
          const daysSinceLastReview = Math.floor(
            (new Date() - new Date(word.lastReviewed || word.learnedAt)) / (1000 * 60 * 60 * 24)
          );
          
          if (daysSinceLastReview < reviewInterval) return false;

          // Filter by difficulty (based on review count)
          if (difficultyFilter === 'easy' && word.reviewCount >= 4) return false;
          if (difficultyFilter === 'medium' && (word.reviewCount < 2 || word.reviewCount > 4)) return false;
          if (difficultyFilter === 'hard' && word.reviewCount > 3) return false;

          return true;
        });

        allReviewWords = [...allReviewWords, ...wordsForReview.map(word => ({
          ...word,
          topicId,
          topicName: getTopicDisplayName(topicId)
        }))];
      });

      // Shuffle and prioritize words that need review most
      allReviewWords.sort((a, b) => {
        const aDaysSince = Math.floor(
          (new Date() - new Date(a.lastReviewed || a.learnedAt)) / (1000 * 60 * 60 * 24)
        );
        const bDaysSince = Math.floor(
          (new Date() - new Date(b.lastReviewed || b.learnedAt)) / (1000 * 60 * 60 * 24)
        );
        return bDaysSince - aDaysSince; // Oldest first
      });

      setReviewWords(allReviewWords);
      setCurrentIndex(0);
      setIsFlipped(false);
      setReviewedWords(new Set());
      setLoading(false);
    };

    loadReviewWords();
  }, [selectedTopics, difficultyFilter, reviewInterval, availableTopics, getTopicLearnedWords, getTopicDisplayName]);

  const currentWord = reviewWords[currentIndex];

  const handleNext = () => {
    if (currentIndex < reviewWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const markAsReviewed = (difficulty = 'medium') => {
    if (currentWord) {
      // Update review count and last reviewed date
      const updatedWord = {
        ...currentWord,
        lastReviewed: new Date().toISOString(),
        reviewCount: (currentWord.reviewCount || 1) + 1,
        difficulty: difficulty
      };

      // Save to localStorage
      markWordLearned(currentWord.topicId, updatedWord);
      
      // Mark as reviewed in current session
      setReviewedWords(prev => new Set([...prev, currentIndex]));
      
      // Move to next word
      handleNext();
    }
  };

  const playPronunciation = () => {
    if (currentWord?.english) {
      playText(currentWord.english, 'en');
    }
  };

  const handleTopicSelection = (topicId) => {
    if (topicId === 'all') {
      setSelectedTopics(new Set(['all']));
    } else {
      const newSelection = new Set(selectedTopics);
      newSelection.delete('all');
      
      if (newSelection.has(topicId)) {
        newSelection.delete(topicId);
      } else {
        newSelection.add(topicId);
      }
      
      if (newSelection.size === 0) {
        newSelection.add('all');
      }
      
      setSelectedTopics(newSelection);
    }
  };

  const reviewProgress = reviewWords.length > 0 ? 
    Math.round(((currentIndex + 1) / reviewWords.length) * 100) : 0;

  const completedProgress = reviewWords.length > 0 ? 
    Math.round((reviewedWords.size / reviewWords.length) * 100) : 0;

  if (loading) {
    return (
      <div className="review-page">
        <div className="container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Đang tải từ cần ôn tập...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="review-page">
      <div className="container">
        {/* Header */}
        <div className="review-header">
          <button className="back-btn" onClick={() => navigate('/progress')}>
            ← Quay lại
          </button>
          <div className="review-info">
            <h1>Ôn tập từ vựng</h1>
            <p>Sử dụng phương pháp lặp lại cách quãng để ghi nhớ lâu dài</p>
          </div>
        </div>

        {/* Filters */}
        <div className="review-filters">
          <div className="filter-group">
            <label htmlFor="review-interval">Khoảng thời gian ôn tập:</label>
            <select 
              id="review-interval"
              value={reviewInterval} 
              onChange={(e) => setReviewInterval(Number(e.target.value))}
              className="filter-select"
            >
              <option value={1}>Từ học hôm qua</option>
              <option value={3}>Từ học 3 ngày trước</option>
              <option value={7}>Từ học 1 tuần trước</option>
              <option value={14}>Từ học 2 tuần trước</option>
              <option value={30}>Từ học 1 tháng trước</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="difficulty-filter">Độ khó:</label>
            <select 
              id="difficulty-filter"
              value={difficultyFilter} 
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">Tất cả</option>
              <option value="hard">Khó (ít ôn tập)</option>
              <option value="medium">Trung bình</option>
              <option value="easy">Dễ (đã thuộc)</option>
            </select>
          </div>
        </div>

        {/* Topic Selection */}
        <div className="topic-selection">
          <h3>Chọn chủ đề ôn tập:</h3>
          <div className="topic-chips">
            <button
              className={`topic-chip ${selectedTopics.has('all') ? 'active' : ''}`}
              onClick={() => handleTopicSelection('all')}
            >
              Tất cả ({availableTopics.reduce((sum, t) => sum + t.reviewCount, 0)} từ)
            </button>
            {availableTopics.map(topic => (
              <button
                key={topic.id}
                className={`topic-chip ${selectedTopics.has(topic.id) ? 'active' : ''}`}
                onClick={() => handleTopicSelection(topic.id)}
              >
                {topic.name} ({topic.reviewCount})
              </button>
            ))}
          </div>
        </div>

        {reviewWords.length === 0 ? (
          <div className="empty-review">
            <div className="empty-icon">🎉</div>
            <h3>Không có từ nào cần ôn tập!</h3>
            <p>Tất cả các từ đã học đều còn trong thời gian ghi nhớ tốt.</p>
            <div className="empty-actions">
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/topics')}
              >
                Học từ mới
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => setReviewInterval(1)}
              >
                Ôn tập từ gần đây
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Progress */}
            <div className="review-progress">
              <div className="progress-info">
                <span>Tiến độ: {currentIndex + 1}/{reviewWords.length}</span>
                <span>Đã ôn: {reviewedWords.size}/{reviewWords.length}</span>
              </div>
              <div className="progress-bars">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${reviewProgress}%` }}></div>
                </div>
                <div className="completed-bar">
                  <div className="completed-fill" style={{ width: `${completedProgress}%` }}></div>
                </div>
              </div>
            </div>

            {/* Flashcard */}
            <div className={`review-flashcard ${isFlipped ? 'flipped' : ''}`}>
              <div className="card-inner">
                <div className="card-front">
                  <div className="topic-badge">{currentWord.topicName}</div>
                  <div className="word-content">
                    <h2 className="english-word">{currentWord.english}</h2>
                    {currentWord.pronunciation && (
                      <div className="pronunciation">
                        <span>{currentWord.pronunciation}</span>
                        <button className="audio-btn" onClick={playPronunciation}>
                          🔊
                        </button>
                      </div>
                    )}
                    <div className="review-info">
                      <span>Đã ôn: {currentWord.reviewCount || 1} lần</span>
                      <span>Học lần cuối: {new Date(currentWord.learnedAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                  <button className="flip-btn" onClick={handleFlip}>
                    Xem nghĩa →
                  </button>
                </div>

                <div className="card-back">
                  <div className="topic-badge">{currentWord.topicName}</div>
                  <div className="word-content">
                    <h2 className="vietnamese-word">{currentWord.vietnamese}</h2>
                    <h3 className="english-word-small">{currentWord.english}</h3>
                    {currentWord.pronunciation && (
                      <div className="pronunciation">
                        <span>{currentWord.pronunciation}</span>
                        <button className="audio-btn" onClick={playPronunciation}>
                          🔊
                        </button>
                      </div>
                    )}
                  </div>
                  <button className="flip-btn" onClick={handleFlip}>
                    ← Ẩn nghĩa
                  </button>
                </div>
              </div>
            </div>

            {/* Review Controls */}
            <div className="review-controls">
              <button 
                className="control-btn secondary" 
                onClick={handlePrevious}
                disabled={currentIndex === 0}
              >
                ← Trước
              </button>
              
              <div className="difficulty-buttons">
                <button 
                  className="difficulty-btn hard"
                  onClick={() => markAsReviewed('hard')}
                  disabled={reviewedWords.has(currentIndex)}
                >
                  Khó 😅
                </button>
                <button 
                  className="difficulty-btn medium"
                  onClick={() => markAsReviewed('medium')}
                  disabled={reviewedWords.has(currentIndex)}
                >
                  Bình thường 😐
                </button>
                <button 
                  className="difficulty-btn easy"
                  onClick={() => markAsReviewed('easy')}
                  disabled={reviewedWords.has(currentIndex)}
                >
                  Dễ 😊
                </button>
              </div>
              
              <button 
                className="control-btn secondary" 
                onClick={handleNext}
                disabled={currentIndex === reviewWords.length - 1}
              >
                Tiếp →
              </button>
            </div>

            {/* Word Status */}
            {reviewedWords.has(currentIndex) && (
              <div className="word-status reviewed">
                ✅ Đã ôn tập từ này
              </div>
            )}

            {/* Completion */}
            {reviewedWords.size === reviewWords.length && (
              <div className="completion-section">
                <h3>🎉 Hoàn thành phiên ôn tập!</h3>
                <p>Bạn đã ôn tập {reviewWords.length} từ vựng</p>
                <div className="completion-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={() => navigate('/progress')}
                  >
                    Xem tiến độ
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => window.location.reload()}
                  >
                    Ôn tập tiếp
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Review;