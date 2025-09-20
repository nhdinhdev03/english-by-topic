import { useEffect, useState } from 'react';
import './VocabularyQuiz.css';

const VocabularyQuiz = ({ words, topicTitle }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState({ correct: 0, incorrect: 0, skipped: 0 });
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);

  const currentWord = words[currentWordIndex];
  const progress = ((currentWordIndex + 1) / words.length) * 100;

  useEffect(() => {
    setSelectedAnswer('');
    setShowResult(false);
  }, [currentWordIndex]);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;

    const isCorrect = selectedAnswer === currentWord.vietnamese;
    const newAnswer = {
      word: currentWord,
      selectedAnswer,
      isCorrect,
      action: 'answered'
    };

    setUserAnswers(prev => [...prev, newAnswer]);
    setShowResult(true);

    if (isCorrect) {
      setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setScore(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
    }

    setTimeout(() => {
      nextWord();
    }, 2000);
  };

  const handleSkip = () => {
    const newAnswer = {
      word: currentWord,
      selectedAnswer: null,
      isCorrect: false,
      action: 'skipped'
    };

    setUserAnswers(prev => [...prev, newAnswer]);
    setScore(prev => ({ ...prev, skipped: prev.skipped + 1 }));
    nextWord();
  };

  const nextWord = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
    } else {
      setIsQuizCompleted(true);
    }
  };

  const restartQuiz = () => {
    setCurrentWordIndex(0);
    setSelectedAnswer('');
    setShowResult(false);
    setScore({ correct: 0, incorrect: 0, skipped: 0 });
    setIsQuizCompleted(false);
    setUserAnswers([]);
  };

  if (isQuizCompleted) {
    const totalWords = words.length;
    const accuracy = totalWords > 0 ? Math.round((score.correct / totalWords) * 100) : 0;

    return (
      <div className="quiz-completed">
        <div className="completion-header">
          <h2>🎉 Hoàn thành!</h2>
          <p>Bạn đã hoàn thành chủ đề "{topicTitle}"</p>
        </div>

        <div className="final-stats">
          <div className="stat-card correct">
            <div className="stat-number">{score.correct}</div>
            <div className="stat-label">Đúng</div>
          </div>
          <div className="stat-card incorrect">
            <div className="stat-number">{score.incorrect}</div>
            <div className="stat-label">Sai</div>
          </div>
          <div className="stat-card skipped">
            <div className="stat-number">{score.skipped}</div>
            <div className="stat-label">Bỏ qua</div>
          </div>
          <div className="stat-card accuracy">
            <div className="stat-number">{accuracy}%</div>
            <div className="stat-label">Độ chính xác</div>
          </div>
        </div>

        <div className="review-section">
          <h3>📋 Ôn tập</h3>
          <div className="review-list">
            {userAnswers.map((answer, index) => (
              <div key={index} className={`review-item ${answer.isCorrect ? 'correct' : answer.action === 'skipped' ? 'skipped' : 'incorrect'}`}>
                <div className="review-word">
                  <strong>{answer.word.english}</strong>
                  <span className="pronunciation">{answer.word.pronunciation}</span>
                </div>
                <div className="review-meaning">
                  Đáp án đúng: <strong>{answer.word.vietnamese}</strong>
                  {answer.action === 'answered' && (
                    <div className="user-answer">
                      Bạn chọn: <span className={answer.isCorrect ? 'correct' : 'incorrect'}>{answer.selectedAnswer}</span>
                    </div>
                  )}
                  {answer.action === 'skipped' && (
                    <div className="user-answer skipped">Đã bỏ qua</div>
                  )}
                </div>
                <div className="review-example">{answer.word.example}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="quiz-actions">
          <button onClick={restartQuiz} className="btn-restart">
            🔄 Học lại
          </button>
          <button onClick={() => window.history.back()} className="btn-home">
            🏠 Chọn chủ đề khác
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="vocabulary-quiz">
      <div className="quiz-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="progress-text">
          {currentWordIndex + 1} / {words.length}
        </div>
      </div>

      <div className="quiz-stats">
        <div className="stat">
          <span className="stat-value">{score.correct}</span>
          <span className="stat-label">Đúng</span>
        </div>
        <div className="stat">
          <span className="stat-value">{score.incorrect}</span>
          <span className="stat-label">Sai</span>
        </div>
        <div className="stat">
          <span className="stat-value">{score.skipped}</span>
          <span className="stat-label">Bỏ qua</span>
        </div>
      </div>

      <div className="quiz-card">
        <div className="word-section">
          <h2 className="english-word">{currentWord.english}</h2>
          <p className="pronunciation">{currentWord.pronunciation}</p>
          <p className="example">"{currentWord.example}"</p>
        </div>

        <div className="question-section">
          <h3>Từ này có nghĩa là gì?</h3>
          <div className="options">
            {currentWord.options.map((option, index) => (
              <button
                key={index}
                className={`option ${selectedAnswer === option ? 'selected' : ''} 
                  ${showResult ? 
                    (option === currentWord.vietnamese ? 'correct' : 
                     option === selectedAnswer && option !== currentWord.vietnamese ? 'incorrect' : '') 
                    : ''}`}
                onClick={() => !showResult && handleAnswerSelect(option)}
                disabled={showResult}
              >
                {option}
                {showResult && option === currentWord.vietnamese && (
                  <span className="check-mark">✓</span>
                )}
                {showResult && option === selectedAnswer && option !== currentWord.vietnamese && (
                  <span className="x-mark">✗</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="quiz-actions">
          <button 
            onClick={handleSkip} 
            className="btn-skip"
            disabled={showResult}
          >
            ⏭️ Tôi đã biết từ này
          </button>
          <button 
            onClick={handleSubmitAnswer} 
            className="btn-submit"
            disabled={!selectedAnswer || showResult}
          >
            {showResult ? '⏳ Chuyển câu tiếp...' : '✓ Xác nhận'}
          </button>
        </div>

        {showResult && (
          <div className={`result-feedback ${selectedAnswer === currentWord.vietnamese ? 'correct' : 'incorrect'}`}>
            {selectedAnswer === currentWord.vietnamese ? (
              <div className="feedback-content">
                <span className="feedback-icon">🎉</span>
                <span>Chính xác!</span>
              </div>
            ) : (
              <div className="feedback-content">
                <span className="feedback-icon">💡</span>
                <span>Đáp án đúng là: <strong>{currentWord.vietnamese}</strong></span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VocabularyQuiz;