import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './Quiz.scss';

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizStarted, setQuizStarted] = useState(false);

  // Mock quiz data
  const quizData = useMemo(() => [
    {
      id: 1,
      question: "What does 'Adventure' mean?",
      questionVi: "'Adventure' có nghĩa là gì?",
      options: [
        { id: 'a', text: 'Cuộc phiêu lưu', isCorrect: true },
        { id: 'b', text: 'Sự an toàn', isCorrect: false },
        { id: 'c', text: 'Ngôi nhà', isCorrect: false },
        { id: 'd', text: 'Thức ăn', isCorrect: false }
      ]
    },
    {
      id: 2,
      question: "Choose the correct sentence:",
      questionVi: "Chọn câu đúng:",
      options: [
        { id: 'a', text: 'She is very beauty', isCorrect: false },
        { id: 'b', text: 'She is very beautiful', isCorrect: true },
        { id: 'c', text: 'She very beautiful', isCorrect: false },
        { id: 'd', text: 'She beautiful very', isCorrect: false }
      ]
    },
    {
      id: 3,
      question: "What is the past tense of 'go'?",
      questionVi: "Thì quá khứ của 'go' là gì?",
      options: [
        { id: 'a', text: 'goed', isCorrect: false },
        { id: 'b', text: 'goes', isCorrect: false },
        { id: 'c', text: 'went', isCorrect: true },
        { id: 'd', text: 'going', isCorrect: false }
      ]
    },
    {
      id: 4,
      question: "Complete: 'Learning English is a _____ for me.'",
      questionVi: "Hoàn thành: 'Learning English is a _____ for me.'",
      options: [
        { id: 'a', text: 'easy', isCorrect: false },
        { id: 'b', text: 'challenge', isCorrect: true },
        { id: 'c', text: 'house', isCorrect: false },
        { id: 'd', text: 'food', isCorrect: false }
      ]
    },
    {
      id: 5,
      question: "What does 'beautiful' mean in Vietnamese?",
      questionVi: "'Beautiful' có nghĩa là gì trong tiếng Việt?",
      options: [
        { id: 'a', text: 'Xấu xí', isCorrect: false },
        { id: 'b', text: 'Bình thường', isCorrect: false },
        { id: 'c', text: 'Đẹp', isCorrect: true },
        { id: 'd', text: 'Lớn', isCorrect: false }
      ]
    }
  ], []);

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

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizCompleted(false);
    setTimeLeft(30);
  };

  const selectAnswer = (answerId) => {
    setSelectedAnswer(answerId);
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizCompleted(false);
    setTimeLeft(30);
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
            
            <button className="start-btn" onClick={startQuiz}>
              Bắt đầu trắc nghiệm
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
                {Math.round((score / quizData.length) * 100)}% chính xác
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
            <h2 className="question-text">{currentQ.question}</h2>
            <p className="question-vi">{currentQ.questionVi}</p>
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