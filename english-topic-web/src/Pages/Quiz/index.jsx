import { useCallback, useEffect, useState } from 'react';
import { AVAILABLE_TOPICS, generateQuizByType, importTopicData } from '../../utils/quizGenerator';
import { getRecentPerformance, saveQuizResult } from '../../utils/quizStorage';
import './Quiz.scss';

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizStarted, setQuizStarted] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedQuizType, setSelectedQuizType] = useState('mixed');
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [topicSelection, setTopicSelection] = useState(true);
  const [recentStats, setRecentStats] = useState(null);

  // Load recent performance stats
  useEffect(() => {
    if (topicSelection) {
      const stats = getRecentPerformance(7);
      setRecentStats(stats);
    }
  }, [topicSelection]);

  const handleNextQuestion = useCallback(() => {
    if (selectedAnswer) {
      const isCorrect = quizData[currentQuestion].options.find(
        option => option.id === selectedAnswer
      )?.isCorrect;
      
      if (isCorrect) {
        setScore(score + 1);
      }
    }

    setShowResult(true);
    
    setTimeout(() => {
      if (currentQuestion + 1 < quizData.length) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
        setTimeLeft(30);
      } else {
        setQuizCompleted(true);
        
        // Save quiz result
        const percentage = Math.round((score / quizData.length) * 100);
        saveQuizResult({
          topic: selectedTopic,
          quizType: selectedQuizType,
          score: score,
          totalQuestions: quizData.length,
          percentage: percentage,
          timeSpent: (10 * 30) - timeLeft // Approximate time spent
        });
      }
    }, 2000);
  }, [selectedAnswer, currentQuestion, score, quizData]);

  // Timer effect
  useEffect(() => {
    let timer;
    if (quizStarted && !showResult && !quizCompleted && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleNextQuestion();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, quizStarted, showResult, quizCompleted, handleNextQuestion]);

  const startQuiz = useCallback(async () => {
    if (!selectedTopic) return;
    
    setLoading(true);
    try {
      const vocabData = await importTopicData(selectedTopic);
      if (vocabData && vocabData.length > 0) {
        const questions = generateQuizByType(vocabData, selectedQuizType, 10);
        setQuizData(questions);
        setQuizStarted(true);
        setTopicSelection(false);
        setCurrentQuestion(0);
        setScore(0);
        setSelectedAnswer(null);
        setShowResult(false);
        setQuizCompleted(false);
        setTimeLeft(30);
      }
    } catch (error) {
      console.error('Error loading quiz data:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedTopic, selectedQuizType]);

  const selectAnswer = (answerId) => {
    setSelectedAnswer(answerId);
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setTopicSelection(true);
    setSelectedTopic(null);
    setSelectedQuizType('mixed');
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizCompleted(false);
    setTimeLeft(30);
    setQuizData([]);
  };

  const getScoreMessage = () => {
    const percentage = (score / quizData.length) * 100;
    if (percentage >= 80) return { text: 'Xuất sắc! 🎉', emoji: '🏆', color: 'excellent' };
    if (percentage >= 60) return { text: 'Tốt! 👍', emoji: '👏', color: 'good' };
    if (percentage >= 40) return { text: 'Khá! 📚', emoji: '📖', color: 'fair' };
    return { text: 'Cần cố gắng thêm! 💪', emoji: '💪', color: 'poor' };
  };

  const getOptionClass = (option) => {
    let className = 'option-btn';
    
    if (selectedAnswer === option.id) {
      className += ' selected';
    }
    
    if (showResult) {
      if (option.isCorrect) {
        className += ' correct';
      } else if (selectedAnswer === option.id) {
        className += ' incorrect';
      }
    }
    
    return className;
  };

  if (topicSelection) {
    return (
      <div className="quiz-page">
        <div className="quiz-container">
          <div className="topic-selection">
            <h1>🧠 Chọn chủ đề Quiz</h1>
            <p>Chọn chủ đề từ vựng bạn muốn luyện tập</p>
            
            {recentStats && recentStats.totalQuizzes > 0 && (
              <div className="recent-stats">
                <h3>📊 Thống kê 7 ngày gần đây</h3>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-number">{recentStats.totalQuizzes}</span>
                    <span className="stat-label">Quiz đã làm</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{recentStats.averageScore}%</span>
                    <span className="stat-label">Điểm trung bình</span>
                  </div>
                  <div className="stat-item">
                    <span className={`stat-number ${recentStats.improvement >= 0 ? 'positive' : 'negative'}`}>
                      {recentStats.improvement >= 0 ? '+' : ''}{recentStats.improvement}%
                    </span>
                    <span className="stat-label">Cải thiện</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="quiz-type-selector">
              <h3>Loại câu hỏi:</h3>
              <div className="quiz-type-options">
                <button 
                  className={`type-btn ${selectedQuizType === 'mixed' ? 'active' : ''}`}
                  onClick={() => setSelectedQuizType('mixed')}
                >
                  🎲 Hỗn hợp
                </button>
                <button 
                  className={`type-btn ${selectedQuizType === 'translation' ? 'active' : ''}`}
                  onClick={() => setSelectedQuizType('translation')}
                >
                  🔤 Dịch sang tiếng Việt
                </button>
                <button 
                  className={`type-btn ${selectedQuizType === 'reverse_translation' ? 'active' : ''}`}
                  onClick={() => setSelectedQuizType('reverse_translation')}
                >
                  🔄 Dịch sang tiếng Anh
                </button>
                <button 
                  className={`type-btn ${selectedQuizType === 'fill_blank' ? 'active' : ''}`}
                  onClick={() => setSelectedQuizType('fill_blank')}
                >
                  📝 Điền từ vào chỗ trống
                </button>
                <button 
                  className={`type-btn ${selectedQuizType === 'pronunciation' ? 'active' : ''}`}
                  onClick={() => setSelectedQuizType('pronunciation')}
                >
                  🗣️ Phát âm
                </button>
              </div>
            </div>

            <div className="topics-grid">
              {Object.entries(AVAILABLE_TOPICS).map(([key, topic]) => (
                <button
                  key={key}
                  className={`topic-card ${selectedTopic === key ? 'selected' : ''}`}
                  onClick={() => setSelectedTopic(key)}
                >
                  <span className="topic-emoji">{topic.emoji}</span>
                  <span className="topic-name">{topic.name}</span>
                </button>
              ))}
            </div>

            <div className="selection-actions">
              <button 
                className="start-quiz-btn" 
                disabled={!selectedTopic || loading}
                onClick={startQuiz}
              >
                {loading ? (
                  <div className="loading-spinner">
                    <div className="spinner"></div>
                    <span className="loading-text">Đang tạo câu hỏi...</span>
                  </div>
                ) : (
                  '🚀 Bắt đầu Quiz'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="quiz-page">
        <div className="quiz-container">
          <div className="quiz-intro">
            <h1>🧠 Trắc nghiệm từ vựng</h1>
            <p>Kiểm tra kiến thức từ vựng với {quizData.length} câu hỏi thú vị</p>
            
            <div className="quiz-info">
              <div className="info-item">
                <span className="info-icon">❓</span>
                <span className="info-text">{quizData.length} câu hỏi</span>
              </div>
              <div className="info-item">
                <span className="info-icon">⏱️</span>
                <span className="info-text">30 giây/câu</span>
              </div>
              <div className="info-item">
                <span className="info-icon">🎯</span>
                <span className="info-text">4 đáp án</span>
              </div>
            </div>
            
            <button className="start-btn" onClick={() => setTopicSelection(true)}>
              Chọn chủ đề khác
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    const scoreMsg = getScoreMessage();
    return (
      <div className="quiz-page">
        <div className="quiz-container">
          <div className="quiz-result">
            <div className="result-header">
              <span className="result-emoji">{scoreMsg.emoji}</span>
              <h2>Hoàn thành!</h2>
              <p className={`result-message ${scoreMsg.color}`}>{scoreMsg.text}</p>
            </div>
            
            <div className="score-display">
              <div className="score-circle">
                <span className="score-number">{score}</span>
                <span className="score-total">/{quizData.length}</span>
              </div>
              <p className="score-percentage">
                {quizData.length > 0 ? Math.round((score / quizData.length) * 100) : 0}% chính xác
              </p>
            </div>
            
            <div className="result-actions">
              <button className="retry-btn" onClick={resetQuiz}>
                Làm lại
              </button>
              <button className="continue-btn" onClick={() => window.history.back()}>
                Tiếp tục học
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (quizData.length === 0) {
    return (
      <div className="quiz-page">
        <div className="quiz-container">
          <div className="quiz-intro">
            <h1>⚠️ Không có dữ liệu</h1>
            <p>Không thể tải dữ liệu quiz. Vui lòng thử lại sau.</p>
            <button className="start-btn" onClick={resetQuiz}>
              Về trang chọn chủ đề
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = quizData[currentQuestion];
  const progress = ((currentQuestion + 1) / quizData.length) * 100;

  return (
    <div className="quiz-page">
      <div className="quiz-container">
        <div className="quiz-header">
          <div className="quiz-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="progress-text">
              Câu {currentQuestion + 1} / {quizData.length}
            </span>
          </div>
          
          <div className="quiz-timer">
            <span className="timer-icon">⏱️</span>
            <span className={`timer-text ${timeLeft <= 10 ? 'warning' : ''}`}>
              {timeLeft}s
            </span>
          </div>
        </div>

        <div className="question-card">
          <div className="question-content">
            <div className="question-type-badge">
              {currentQ.type === 'translation_en_vi' && '🔤 Dịch sang tiếng Việt'}
              {currentQ.type === 'translation_vi_en' && '🔄 Dịch sang tiếng Anh'}
              {currentQ.type === 'fill_blank' && '📝 Điền từ vào chỗ trống'}
              {currentQ.type === 'pronunciation' && '🗣️ Phát âm'}
            </div>
            <h2 className="question-text">{currentQ.question}</h2>
            <p className="question-vi">{currentQ.questionVi}</p>
            {currentQ.pronunciation && currentQ.type !== 'pronunciation' && (
              <p className="question-pronunciation">📢 {currentQ.pronunciation}</p>
            )}
          </div>

          <div className="options-grid">
            {currentQ.options.map((option) => (
              <button
                key={option.id}
                className={getOptionClass(option)}
                onClick={() => !showResult && selectAnswer(option.id)}
                disabled={showResult}
              >
                <span className="option-letter">{option.id.toUpperCase()}</span>
                <span className="option-text">{option.text}</span>
                {showResult && option.isCorrect && (
                  <span className="option-icon">✓</span>
                )}
                {showResult && selectedAnswer === option.id && !option.isCorrect && (
                  <span className="option-icon">✗</span>
                )}
              </button>
            ))}
          </div>

          {!showResult && selectedAnswer && (
            <button className="submit-btn" onClick={handleNextQuestion}>
              {currentQuestion + 1 === quizData.length ? 'Hoàn thành' : 'Câu tiếp theo'}
            </button>
          )}

          {showResult && (
            <div className="result-feedback">
              {selectedAnswer === currentQ.options.find(opt => opt.isCorrect)?.id ? (
                <div className="feedback correct-feedback">
                  <span className="feedback-icon">🎉</span>
                  <span className="feedback-text">Chính xác!</span>
                </div>
              ) : (
                <div className="feedback incorrect-feedback">
                  <span className="feedback-icon">😞</span>
                  <span className="feedback-text">
                    Đáp án đúng là: {currentQ.options.find(opt => opt.isCorrect)?.text}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;