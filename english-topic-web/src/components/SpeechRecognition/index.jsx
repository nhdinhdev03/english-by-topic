import { useCallback, useEffect, useRef, useState } from 'react';
import './SpeechRecognition.css';

const SpeechRecognition = ({ 
  targetText, 
  language = 'en-US', 
  onResult, 
  onMatch, 
  threshold = 0.8,
  showTranscript = true 
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState(null);
  const [isMatching, setIsMatching] = useState(false);
  
  const recognitionRef = useRef(null);
  const timeoutRef = useRef(null);

  // Thuật toán Levenshtein Distance
  const levenshteinDistance = useCallback((str1, str2) => {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }, []);

  // Hàm tính toán độ tương đồng giữa hai chuỗi
  const calculateSimilarity = useCallback((str1, str2) => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) {
      return 1.0;
    }
    
    const distance = levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }, [levenshteinDistance]);

  useEffect(() => {
    // Kiểm tra hỗ trợ Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      
      const recognition = recognitionRef.current;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
        setTranscript('');
        setConfidence(0);
      };

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0].transcript;
          
          if (result.isFinal) {
            finalTranscript += transcript;
            setConfidence(result[0].confidence || 0);
          } else {
            interimTranscript += transcript;
          }
        }

        const currentTranscript = finalTranscript || interimTranscript;
        setTranscript(currentTranscript);

        if (finalTranscript) {
          const similarity = calculateSimilarity(finalTranscript.toLowerCase().trim(), targetText.toLowerCase().trim());
          const isMatch = similarity >= threshold;
          
          setIsMatching(isMatch);
          
          if (onResult) {
            onResult({
              transcript: finalTranscript,
              confidence: event.results[0][0].confidence || 0,
              similarity: similarity,
              isMatch: isMatch
            });
          }

          if (isMatch && onMatch) {
            onMatch({
              transcript: finalTranscript,
              similarity: similarity,
              confidence: event.results[0][0].confidence || 0
            });
          }

          // Tự động dừng sau khi có kết quả cuối cùng
          setTimeout(() => {
            setIsListening(false);
          }, 1000);
        }
      };

      recognition.onerror = (event) => {
        setError(`Lỗi nhận diện: ${event.error}`);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [language, targetText, threshold, onResult, onMatch, calculateSimilarity]);

  const startListening = () => {
    if (!isSupported || !recognitionRef.current) return;
    
    try {
      recognitionRef.current.start();
      
      // Tự động dừng sau 10 giây
      timeoutRef.current = setTimeout(() => {
        if (isListening) {
          stopListening();
        }
      }, 10000);
    } catch (err) {
      setError('Không thể bắt đầu nhận diện giọng nói');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  if (!isSupported) {
    return (
      <div className="speech-recognition-error">
        <p>⚠️ Trình duyệt của bạn không hỗ trợ tính năng nhận diện giọng nói</p>
      </div>
    );
  }

  return (
    <div className="speech-recognition">
      <div className="recognition-controls">
        <button
          className={`btn-record ${isListening ? 'recording' : ''}`}
          onClick={isListening ? stopListening : startListening}
          title={isListening ? 'Dừng ghi âm' : 'Bắt đầu ghi âm'}
        >
          {isListening ? (
            <span className="icon recording-icon">🔴</span>
          ) : (
            <span className="icon">🎤</span>
          )}
          {isListening ? 'Đang nghe...' : 'Bắt đầu nói'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {showTranscript && transcript && (
        <div className="transcript-container">
          <div className="target-text">
            <label>Văn bản mục tiêu:</label>
            <p>{targetText}</p>
          </div>
          
          <div className="recognized-text">
            <label>Văn bản nhận diện:</label>
            <p className={isMatching ? 'match' : 'no-match'}>{transcript}</p>
          </div>
          
          {confidence > 0 && (
            <div className="confidence-meter">
              <label>Độ tin cậy: {Math.round(confidence * 100)}%</label>
              <div className="confidence-bar">
                <div 
                  className="confidence-fill"
                  style={{ width: `${confidence * 100}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {transcript && (
            <div className="similarity-meter">
              <label>
                Độ chính xác: {Math.round(calculateSimilarity(transcript.toLowerCase().trim(), targetText.toLowerCase().trim()) * 100)}%
              </label>
              <div className="similarity-bar">
                <div 
                  className={`similarity-fill ${isMatching ? 'good' : 'poor'}`}
                  style={{ 
                    width: `${calculateSimilarity(transcript.toLowerCase().trim(), targetText.toLowerCase().trim()) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SpeechRecognition;