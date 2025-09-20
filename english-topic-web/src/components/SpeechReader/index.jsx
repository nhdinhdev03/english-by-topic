import { useCallback, useEffect, useState } from 'react';
import './SpeechReader.css';

const SpeechReader = ({ text, language = 'en-US', onSpeechEnd, showControls = true }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);

  const loadVoices = useCallback(() => {
    const availableVoices = speechSynthesis.getVoices();
    setVoices(availableVoices);
    
    // Tự động chọn voice phù hợp với ngôn ngữ
    const preferredVoice = availableVoices.find(voice => 
      voice.lang.startsWith(language.split('-')[0])
    );
    
    if (preferredVoice) {
      setSelectedVoice(preferredVoice);
    } else if (availableVoices.length > 0) {
      setSelectedVoice(availableVoices[0]);
    }
  }, [language]);

  useEffect(() => {
    // Kiểm tra xem trình duyệt có hỗ trợ Speech Synthesis không
    if ('speechSynthesis' in window) {
      setIsSupported(true);
      loadVoices();
      
      // Lắng nghe sự kiện thay đổi voices
      speechSynthesis.addEventListener('voiceschanged', loadVoices);
      
      return () => {
        speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      };
    }
  }, [loadVoices]);



  const speak = () => {
    if (!isSupported || !text) return;

    // Dừng speech hiện tại nếu đang chạy
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Cấu hình utterance
    utterance.voice = selectedVoice;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.lang = language;

    // Xử lý events
    utterance.onstart = () => {
      setIsPlaying(true);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      if (onSpeechEnd) {
        onSpeechEnd();
      }
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      setIsPlaying(false);
    };

    speechSynthesis.speak(utterance);
  };

  const stop = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const handleVoiceChange = (event) => {
    const voiceIndex = parseInt(event.target.value);
    setSelectedVoice(voices[voiceIndex]);
  };

  if (!isSupported) {
    return (
      <div className="speech-reader-error">
        <p>⚠️ Trình duyệt của bạn không hỗ trợ tính năng đọc văn bản</p>
      </div>
    );
  }

  return (
    <div className="speech-reader">
      <div className="speech-controls">
        <button 
          className={`btn-speech ${isPlaying ? 'playing' : ''}`}
          onClick={isPlaying ? stop : speak}
          disabled={!text}
          title={isPlaying ? 'Dừng phát' : 'Phát âm'}
        >
          {isPlaying ? (
            <span className="icon">⏹️</span>
          ) : (
            <span className="icon">🔊</span>
          )}
          {isPlaying ? 'Dừng' : 'Phát âm'}
        </button>

        {showControls && (
          <div className="advanced-controls">
            <div className="control-group">
              <label htmlFor="voice-select">Giọng đọc:</label>
              <select 
                id="voice-select"
                value={voices.indexOf(selectedVoice)}
                onChange={handleVoiceChange}
                disabled={voices.length === 0}
              >
                {voices.map((voice, index) => (
                  <option key={index} value={index}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>

            <div className="control-group">
              <label htmlFor="rate-slider">Tốc độ: {rate.toFixed(1)}x</label>
              <input
                id="rate-slider"
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
              />
            </div>

            <div className="control-group">
              <label htmlFor="pitch-slider">Cao độ: {pitch.toFixed(1)}</label>
              <input
                id="pitch-slider"
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeechReader;