import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '../../contexts/useLanguage';
import { useProgress } from '../../contexts/useProgress';
import './TopicLearn.scss';

const TopicLearn = () => {
  const { topicName } = useParams();
  const navigate = useNavigate();
  const { playText } = useLanguage();
  const { markWordLearned, getTopicLearnedWords } = useProgress();

  const [vocabularyData, setVocabularyData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completedWords, setCompletedWords] = useState(new Set());
  const [showMeaning, setShowMeaning] = useState(false);
  const [learnedWords, setLearnedWords] = useState(new Set());

  // Fisher-Yates shuffle algorithm
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Load vocabulary data based on topic
  useEffect(() => {
    // Mapping topic names to JSON files
    const topicFileMapping = {
      'daily-activities': 'Daily-Activities.json',
      'food': 'Food.json',
      'travel': 'Travel.json',
      'animals': 'Animal.json',
      'colors': 'Color.json',
      'family': 'Family.json',
      'health': 'Health.json',
      'work': 'Work.json',
      'count': 'Count.json',
      'clothes': 'Clothes.json',
      'weather': 'Weather.json',
      'school': 'School.json',
      'shopping': 'Shopping.json',
      'environment': 'Environment.json',
      'sport': 'Sport.json'
    };

    const loadVocabulary = async () => {
      try {
        const fileName = topicFileMapping[topicName];
        if (!fileName) {
          console.error('Topic not found:', topicName);
          return;
        }

        console.log(`Loading vocabulary for topic: ${topicName}, file: ${fileName}`);
        
        // Use fetch instead of dynamic import for JSON files
        const response = await fetch(`/data/${fileName}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${fileName}: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`Successfully loaded ${data.length} vocabulary items for ${topicName}`);
        
        // Auto-shuffle vocabulary on initial load
        const shuffledData = shuffleArray(data);

        setVocabularyData(shuffledData);
      } catch (error) {
        console.error('Error loading vocabulary:', error);
      }
    };

    if (topicName) {
      loadVocabulary();
    }
  }, [topicName]);

  // Load learned words from localStorage when component mounts
  useEffect(() => {
    if (topicName) {
      const savedLearnedWords = getTopicLearnedWords(topicName);
      const learnedWordIds = new Set(savedLearnedWords.map(word => word.english));
      setLearnedWords(learnedWordIds);
    }
  }, [topicName, getTopicLearnedWords]);

  const currentWord = vocabularyData[currentIndex];

  const handleNext = () => {
    if (currentIndex < vocabularyData.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      setShowMeaning(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
      setShowMeaning(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    setShowMeaning(!showMeaning);
  };

  const markAsLearned = () => {
    if (currentWord && topicName) {
      // Mark word as learned in localStorage
      markWordLearned(topicName, currentWord);
      
      // Update local state
      setCompletedWords(prev => new Set([...prev, currentIndex]));
      setLearnedWords(prev => new Set([...prev, currentWord.english]));
    }
    handleNext();
  };

  const playPronunciation = () => {
    if (currentWord?.english) {
      playText(currentWord.english, 'en');
    }
  };

  const getTopicDisplayName = (topicName) => {
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
    return displayNames[topicName] || topicName;
  };

  if (!vocabularyData.length) {
    return (
      <div className="topic-learn-page">
        <div className="container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Đang tải từ vựng...</p>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentIndex + 1) / vocabularyData.length) * 100;
  const learnedProgress = (learnedWords.size / vocabularyData.length) * 100;

  return (
    <div className="topic-learn-page">
      <div className="container">
        {/* Header */}
        <div className="learn-header">
          <button className="back-btn" onClick={() => navigate('/topics')}>
            ← Quay lại
          </button>
          <div className="topic-info">
            <h1>{getTopicDisplayName(topicName)}</h1>
            <p>{vocabularyData.length} từ vựng</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-section">
          <div className="progress-info">
            <span>Tiến độ: {currentIndex + 1}/{vocabularyData.length}</span>
            <span>Đã học: {learnedWords.size}/{vocabularyData.length}</span>
            <span>Phiên này: {completedWords.size} từ mới</span>
          </div>
          <div className="progress-bars">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="learned-bar">
              <div className="learned-fill" style={{ width: `${learnedProgress}%` }}></div>
            </div>
          </div>
        </div>

        {/* Flashcard */}
        <div className={`flashcard ${isFlipped ? 'flipped' : ''}`}>
          <div className="card-inner">
            <div className="card-front">
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
                {currentWord.type && (
                  <span className="word-type">{currentWord.type}</span>
                )}
              </div>
              <button className="flip-btn" onClick={handleFlip}>
                Xem nghĩa →
              </button>
            </div>

            <div className="card-back">
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
                {currentWord.type && (
                  <span className="word-type">{currentWord.type}</span>
                )}
              </div>
              <button className="flip-btn" onClick={handleFlip}>
                ← Ẩn nghĩa
              </button>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="learn-controls">
          <button 
            className="control-btn secondary" 
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            ← Trước
          </button>
          
          <button 
            className="control-btn primary learned-btn" 
            onClick={markAsLearned}
            disabled={completedWords.has(currentIndex) || learnedWords.has(currentWord?.english)}
          >
            {(completedWords.has(currentIndex) || learnedWords.has(currentWord?.english)) ? '✓ Đã học' : 'Đã hiểu'}
          </button>
          
          <button 
            className="control-btn secondary" 
            onClick={handleNext}
            disabled={currentIndex === vocabularyData.length - 1}
          >
            Tiếp →
          </button>
        </div>

        {/* Word Status */}
        {(completedWords.has(currentIndex) || learnedWords.has(currentWord?.english)) && (
          <div className="word-status learned">
            ✅ {completedWords.has(currentIndex) ? 'Vừa học xong từ này' : 'Bạn đã học từ này trước đây'}
          </div>
        )}

        {/* Completion Message */}
        {currentIndex === vocabularyData.length - 1 && (
          <div className="completion-section">
            <h3>🎉 Bạn đã hoàn thành chủ đề này!</h3>
            <p>Đã học: {completedWords.size}/{vocabularyData.length} từ</p>
            <div className="completion-actions">
              <button 
                className="control-btn primary"
                onClick={() => navigate('/topics')}
              >
                Chọn chủ đề khác
              </button>
              <button 
                className="control-btn secondary"
                onClick={() => setCurrentIndex(0)}
              >
                Học lại từ đầu
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicLearn;