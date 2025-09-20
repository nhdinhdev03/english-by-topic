import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SpeechReader from '../SpeechReader';
import SpeechRecognition from '../SpeechRecognition';
import './VocabularyPractice.css';

const VocabularyPractice = ({ words, topicTitle, onComplete }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [practiceResults, setPracticeResults] = useState([]);
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    incorrect: 0,
    total: 0,
    accuracy: 0
  });
  const [isCompleted, setIsCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const currentWord = words[currentIndex];
  const progress = ((currentIndex + 1) / words.length) * 100;

  useEffect(() => {
    // Cập nhật thống kê khi có kết quả mới
    const correct = practiceResults.filter(result => result.isMatch).length;
    const total = practiceResults.length;
    const accuracy = total > 0 ? (correct / total) * 100 : 0;

    setSessionStats({
      correct,
      incorrect: total - correct,
      total,
      accuracy
    });
  }, [practiceResults]);

  const handlePracticeResult = (result) => {
    const newResult = {
      word: currentWord,
      ...result,
      timestamp: new Date(),
      wordIndex: currentIndex
    };

    setPracticeResults(prev => [...prev, newResult]);
    setShowResults(true);

    // Tự động chuyển sang từ tiếp theo sau 3 giây
    setTimeout(() => {
      nextWord();
    }, 3000);
  };

  const nextWord = () => {
    setShowResults(false);
    
    if (currentIndex < words.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      completeSession();
    }
  };

  const previousWord = () => {
    setShowResults(false);
    
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const skipWord = () => {
    const skipResult = {
      word: currentWord,
      transcript: '',
      confidence: 0,
      similarity: 0,
      isMatch: false,
      timestamp: new Date(),
      wordIndex: currentIndex,
      skipped: true
    };

    setPracticeResults(prev => [...prev, skipResult]);
    nextWord();
  };

  const completeSession = () => {
    setIsCompleted(true);
    if (onComplete) {
      onComplete(practiceResults, sessionStats);
    }
  };

  const restartSession = () => {
    setCurrentIndex(0);
    setPracticeResults([]);
    setIsCompleted(false);
    setShowResults(false);
  };

  const exitPractice = () => {
    navigate(-1);
  };

  if (isCompleted) {
    return (
      <div className="vocabulary-practice completed">
        <div className="completion-container">
          <div className="completion-header">
            <h1>🎉 Hoàn thành luyện tập!</h1>
            <p>Chủ đề: {topicTitle}</p>
          </div>

          <div className="final-stats">
            <div className="stat-card accuracy">
              <div className="stat-number">{Math.round(sessionStats.accuracy)}%</div>
              <div className="stat-label">Độ chính xác</div>
            </div>
            <div className="stat-card correct">
              <div className="stat-number">{sessionStats.correct}</div>
              <div className="stat-label">Đúng</div>
            </div>
            <div className="stat-card incorrect">
              <div className="stat-number">{sessionStats.incorrect}</div>
              <div className="stat-label">Sai</div>
            </div>
            <div className="stat-card total">
              <div className="stat-number">{sessionStats.total}</div>
              <div className="stat-label">Tổng số</div>
            </div>
          </div>

          <div className="detailed-results">
            <h3>Chi tiết kết quả:</h3>
            <div className="results-grid">
              {practiceResults.map((result, index) => (
                <div key={index} className={`result-card ${result.isMatch ? 'correct' : 'incorrect'}`}>
                  <div className="result-word">{result.word.english}</div>
                  <div className="result-transcript">
                    {result.skipped ? 'Đã bỏ qua' : `"${result.transcript}"`}
                  </div>
                  <div className="result-accuracy">
                    {result.skipped ? '0%' : `${Math.round(result.similarity * 100)}%`}
                  </div>
                  <div className="result-status">
                    {result.isMatch ? '✅' : result.skipped ? '⏭️' : '❌'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="completion-actions">
            <button className="btn-secondary" onClick={restartSession}>
              🔄 Luyện lại
            </button>
            <button className="btn-primary" onClick={exitPractice}>
              ✅ Hoàn thành
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="vocabulary-practice">
      <div className="practice-header">
        <button className="btn-exit" onClick={exitPractice}>
          ← Thoát
        </button>
        
        <div className="practice-info">
          <h1>Luyện phát âm</h1>
          <p>{topicTitle}</p>
        </div>

        <div className="practice-progress">
          <span className="progress-text">{currentIndex + 1} / {words.length}</span>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="practice-content">
        <div className="current-word-section">
          <div className="word-display">
            <h2 className="word-english">{currentWord.english}</h2>
            <p className="word-pronunciation">{currentWord.pronunciation}</p>
            <p className="word-vietnamese">{currentWord.vietnamese}</p>
            <div className="word-example">
              <span className="example-label">Ví dụ:</span>
              <span className="example-text">"{currentWord.example}"</span>
            </div>
          </div>

          <div className="speech-controls">
            <div className="listen-section">
              <h3>🔊 Nghe phát âm</h3>
              <SpeechReader 
                text={currentWord.english} 
                language="en-US"
                showControls={true}
              />
            </div>

            <div className="speak-section">
              <h3>🎤 Luyện nói</h3>
              <SpeechRecognition
                targetText={currentWord.english}
                language="en-US"
                onResult={handlePracticeResult}
                threshold={0.6}
                showTranscript={true}
              />
            </div>
          </div>

          {showResults && practiceResults.length > 0 && (
            <div className="instant-feedback">
              {(() => {
                const lastResult = practiceResults[practiceResults.length - 1];
                return (
                  <div className={`feedback ${lastResult.isMatch ? 'success' : 'error'}`}>
                    {lastResult.isMatch ? (
                      <>
                        <span className="feedback-icon">🎉</span>
                        <span className="feedback-text">Tuyệt vời! Phát âm chính xác {Math.round(lastResult.similarity * 100)}%</span>
                      </>
                    ) : (
                      <>
                        <span className="feedback-icon">💪</span>
                        <span className="feedback-text">Cần cải thiện. Độ chính xác: {Math.round(lastResult.similarity * 100)}%</span>
                      </>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        <div className="navigation-section">
          <div className="nav-controls">
            <button 
              className="btn-nav secondary" 
              onClick={previousWord}
              disabled={currentIndex === 0}
            >
              ← Từ trước
            </button>
            
            <button className="btn-nav skip" onClick={skipWord}>
              ⏭️ Bỏ qua
            </button>
            
            <button 
              className="btn-nav primary" 
              onClick={nextWord}
            >
              {currentIndex === words.length - 1 ? 'Hoàn thành' : 'Từ tiếp →'}
            </button>
          </div>
        </div>

        <div className="session-stats">
          <div className="stats-row">
            <div className="stat-item">
              <span className="stat-label">Độ chính xác:</span>
              <span className="stat-value">{Math.round(sessionStats.accuracy)}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Đã làm:</span>
              <span className="stat-value">{sessionStats.total}/{words.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Đúng:</span>
              <span className="stat-value correct">{sessionStats.correct}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Sai:</span>
              <span className="stat-value incorrect">{sessionStats.incorrect}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VocabularyPractice;