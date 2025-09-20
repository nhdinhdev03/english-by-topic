import { useState } from 'react';
import SpeechReader from '../SpeechReader';
import SpeechRecognition from '../SpeechRecognition';
import './WordList.css';

const WordList = ({ words, title, showPractice = true }) => {
  const [expandedWord, setExpandedWord] = useState(null);
  const [practiceMode, setPracticeMode] = useState(false);
  const [currentPracticeIndex, setCurrentPracticeIndex] = useState(0);
  const [practiceResults, setPracticeResults] = useState([]);

  const toggleWordExpansion = (index) => {
    setExpandedWord(expandedWord === index ? null : index);
  };

  const startPracticeMode = () => {
    setPracticeMode(true);
    setCurrentPracticeIndex(0);
    setPracticeResults([]);
  };

  const exitPracticeMode = () => {
    setPracticeMode(false);
    setCurrentPracticeIndex(0);
    setPracticeResults([]);
  };

  const handlePracticeResult = (result) => {
    const newResult = {
      word: words[currentPracticeIndex],
      ...result,
      timestamp: new Date()
    };

    setPracticeResults(prev => [...prev, newResult]);

    // Tự động chuyển sang từ tiếp theo sau 2 giây
    setTimeout(() => {
      if (currentPracticeIndex < words.length - 1) {
        setCurrentPracticeIndex(prev => prev + 1);
      } else {
        // Kết thúc practice mode
        setPracticeMode(false);
      }
    }, 2000);
  };

  const nextPracticeWord = () => {
    if (currentPracticeIndex < words.length - 1) {
      setCurrentPracticeIndex(prev => prev + 1);
    } else {
      setPracticeMode(false);
    }
  };

  const previousPracticeWord = () => {
    if (currentPracticeIndex > 0) {
      setCurrentPracticeIndex(prev => prev - 1);
    }
  };

  if (practiceMode) {
    const currentWord = words[currentPracticeIndex];
    const progress = ((currentPracticeIndex + 1) / words.length) * 100;

    return (
      <div className="word-list practice-mode">
        <div className="practice-header">
          <button className="btn-exit" onClick={exitPracticeMode}>
            ← Thoát luyện tập
          </button>
          <h2>Luyện phát âm: {title}</h2>
          <div className="practice-progress">
            <span>{currentPracticeIndex + 1} / {words.length}</span>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="practice-content">
          <div className="current-word">
            <div className="word-info">
              <h3 className="word-english">{currentWord.english}</h3>
              <p className="word-pronunciation">{currentWord.pronunciation}</p>
              <p className="word-vietnamese">{currentWord.vietnamese}</p>
              <p className="word-example">"{currentWord.example}"</p>
            </div>

            <div className="practice-controls">
              <div className="speech-section">
                <h4>Nghe phát âm:</h4>
                <SpeechReader 
                  text={currentWord.english} 
                  language="en-US"
                  showControls={false}
                />
              </div>

              <div className="recognition-section">
                <h4>Luyện nói:</h4>
                <SpeechRecognition
                  targetText={currentWord.english}
                  language="en-US"
                  onResult={handlePracticeResult}
                  threshold={0.7}
                  showTranscript={true}
                />
              </div>
            </div>

            <div className="navigation-controls">
              <button 
                className="btn-nav" 
                onClick={previousPracticeWord}
                disabled={currentPracticeIndex === 0}
              >
                ← Từ trước
              </button>
              <button 
                className="btn-nav" 
                onClick={nextPracticeWord}
              >
                {currentPracticeIndex === words.length - 1 ? 'Kết thúc' : 'Từ tiếp theo →'}
              </button>
            </div>
          </div>

          {practiceResults.length > 0 && (
            <div className="practice-results">
              <h4>Kết quả luyện tập:</h4>
              <div className="results-list">
                {practiceResults.map((result, index) => (
                  <div key={index} className={`result-item ${result.isMatch ? 'correct' : 'incorrect'}`}>
                    <span className="result-word">{result.word.english}</span>
                    <span className="result-transcript">"{result.transcript}"</span>
                    <span className="result-accuracy">{Math.round(result.similarity * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="word-list">
      <div className="word-list-header">
        <h2>{title}</h2>
        {showPractice && (
          <button className="btn-practice" onClick={startPracticeMode}>
            🎤 Luyện phát âm
          </button>
        )}
      </div>

      <div className="words-grid">
        {words.map((word, index) => (
          <div key={index} className={`word-card ${expandedWord === index ? 'expanded' : ''}`}>
            <div className="word-header" onClick={() => toggleWordExpansion(index)}>
              <div className="word-main">
                <h3 className="word-english">{word.english}</h3>
                <p className="word-vietnamese">{word.vietnamese}</p>
              </div>
              <div className="expand-icon">
                {expandedWord === index ? '−' : '+'}
              </div>
            </div>

            {expandedWord === index && (
              <div className="word-details">
                <div className="word-info">
                  <p className="pronunciation">{word.pronunciation}</p>
                  <p className="example">"{word.example}"</p>
                </div>
                
                <div className="word-actions">
                  <SpeechReader 
                    text={word.english} 
                    language="en-US"
                    showControls={false}
                  />
                  
                  <div className="practice-section">
                    <h4>Luyện nói:</h4>
                    <SpeechRecognition
                      targetText={word.english}
                      language="en-US"
                      threshold={0.7}
                      showTranscript={true}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="word-list-stats">
        <p>Tổng số từ: <strong>{words.length}</strong></p>
      </div>
    </div>
  );
};

export default WordList;