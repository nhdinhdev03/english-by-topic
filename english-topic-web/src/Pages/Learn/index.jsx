import { useCallback, useEffect, useState } from 'react';
import './Learn.scss';

// Mock data - moved outside component to prevent re-creation
const MOCK_WORDS = [
  {
    id: 1,
    word: "Adventure",
    phonetic: "/ədˈven.tʃər/",
    meaning: "Cuộc phiêu lưu",
    example: "We went on an adventure in the mountains.",
    exampleVi: "Chúng tôi đã đi phiêu lưu trên núi.",
    difficulty: "intermediate"
  },
  {
    id: 2,
    word: "Beautiful",
    phonetic: "/ˈbjuː.tɪ.fəl/",
    meaning: "Đẹp",
    example: "The sunset is beautiful tonight.",
    exampleVi: "Hoàng hôn tối nay thật đẹp.",
    difficulty: "beginner"
  },
  {
    id: 3,
    word: "Challenge",
    phonetic: "/ˈtʃæl.ɪndʒ/",
    meaning: "Thử thách",
    example: "Learning English is a challenge for me.",
    exampleVi: "Học tiếng Anh là một thử thách đối với tôi.",
    difficulty: "intermediate"
  }
];

const Learn = () => {
  const [currentWord, setCurrentWord] = useState(null);
  const [showMeaning, setShowMeaning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [learningMode, setLearningMode] = useState('flashcard');

  useEffect(() => {
    if (MOCK_WORDS.length > 0) {
      setCurrentWord(MOCK_WORDS[0]);
    }
  }, []); // Now safe without dependencies

  const nextWord = useCallback(() => {
    const currentIndex = MOCK_WORDS.findIndex(word => word.id === currentWord?.id);
    const nextIndex = (currentIndex + 1) % MOCK_WORDS.length;
    setCurrentWord(MOCK_WORDS[nextIndex]);
    setShowMeaning(false);
    setProgress(((nextIndex + 1) / MOCK_WORDS.length) * 100);
  }, [currentWord]);

  const prevWord = useCallback(() => {
    const currentIndex = MOCK_WORDS.findIndex(word => word.id === currentWord?.id);
    const prevIndex = currentIndex === 0 ? MOCK_WORDS.length - 1 : currentIndex - 1;
    setCurrentWord(MOCK_WORDS[prevIndex]);
    setShowMeaning(false);
    setProgress(((prevIndex + 1) / MOCK_WORDS.length) * 100);
  }, [currentWord]);

  const toggleMeaning = useCallback(() => {
    setShowMeaning(prev => !prev);
  }, []);

  const getDifficultyText = useCallback((difficulty) => {
    if (difficulty === 'beginner') return 'Dễ';
    if (difficulty === 'intermediate') return 'Trung bình';
    return 'Khó';
  }, []);

  return (
    <div className="learn-page">
      <div className="learn-container">
        <div className="learn-header">
          <h1>🎯 Học từ mới</h1>
          <p>Học từ vựng hiệu quả với flashcard tương tác</p>
          
          <div className="progress-section">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="progress-text">{Math.round(progress)}% hoàn thành</span>
          </div>
        </div>

        <div className="learning-modes">
          <button 
            className={`mode-btn ${learningMode === 'flashcard' ? 'active' : ''}`}
            onClick={() => setLearningMode('flashcard')}
          >
            <span className="mode-icon">🗂️</span>
            <span>Flashcard</span>
          </button>
          <button 
            className={`mode-btn ${learningMode === 'quiz' ? 'active' : ''}`}
            onClick={() => setLearningMode('quiz')}
          >
            <span className="mode-icon">❓</span>
            <span>Quiz</span>
          </button>
          <button 
            className={`mode-btn ${learningMode === 'listening' ? 'active' : ''}`}
            onClick={() => setLearningMode('listening')}
          >
            <span className="mode-icon">🎧</span>
            <span>Nghe</span>
          </button>
        </div>

        {currentWord && (
          <div className="word-card">
            <div className="card-header">
              <span className={`difficulty-badge ${currentWord.difficulty}`}>
                {getDifficultyText(currentWord.difficulty)}
              </span>
            </div>

            <div className="card-content">
              <div className="word-section">
                <h2 className="word-text">{currentWord.word}</h2>
                <p className="phonetic">{currentWord.phonetic}</p>
                <button className="speak-btn" title="Phát âm">
                  🔊
                </button>
              </div>

              <div className={`meaning-section ${showMeaning ? 'show' : ''}`}>
                <div className="meaning-content">
                  <h3>Nghĩa:</h3>
                  <p className="meaning">{currentWord.meaning}</p>
                  
                  <h4>Ví dụ:</h4>
                  <p className="example-en">"{currentWord.example}"</p>
                  <p className="example-vi">"{currentWord.exampleVi}"</p>
                </div>
              </div>

              <button 
                className="reveal-btn"
                onClick={toggleMeaning}
              >
                {showMeaning ? 'Ẩn nghĩa' : 'Hiển thị nghĩa'}
              </button>
            </div>

            <div className="card-actions">
              <button className="action-btn prev" onClick={prevWord}>
                ← Trước
              </button>
              <button className="action-btn next" onClick={nextWord}>
                Tiếp →
              </button>
            </div>
          </div>
        )}

        <div className="learning-stats">
          <div className="stat-item">
            <span className="stat-number">{MOCK_WORDS.length}</span>
            <span className="stat-label">Từ mới</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">0</span>
            <span className="stat-label">Đã thuộc</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">15</span>
            <span className="stat-label">Phút học</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learn;