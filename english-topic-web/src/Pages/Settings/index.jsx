import { useState } from 'react';
import { useLanguage } from '../../contexts/useLanguage';
import { useTheme } from '../../contexts/useTheme';
import './Settings.scss';

const Settings = () => {
  const { toggleTheme, isDark } = useTheme();
  const { 
    language, 
    supportedLanguages, 
    availableVoices, 
    voiceSettings, 
    changeLanguage, 
    updateVoiceSettings,
    playText,
  } = useLanguage();
  const [notifications, setNotifications] = useState({
    vocabulary: true,
    dailyReminder: true,
    achievements: true
  });

  const handleVoiceChange = (key, value) => {
    updateVoiceSettings({
      [key]: value
    });
  };

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const testVoice = () => {
    const testText = language === 'vi' ? 'Xin chào, đây là bài kiểm tra giọng nói' : 'Hello, this is a voice test';
    playText(testText, language);
  };

  const getLanguageOptions = () => {
    return Object.entries(supportedLanguages).map(([code, info]) => ({
      value: code,
      label: `${info.flag} ${info.name}`
    }));
  };

  const getVoiceOptions = () => {
    return availableVoices[language] || [];
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        <div className="settings-header">
          <h1>Cài đặt</h1>
          <p>Tùy chỉnh trải nghiệm học tập của bạn</p>
        </div>

        <div className="settings-content">
          {/* Theme Settings */}
          <div className="settings-section">
            <div className="section-header">
              <h2>Giao diện</h2>
              <span className="section-icon">🎨</span>
            </div>
            <div className="settings-group">
              <div className="setting-item">
                <div className="setting-info">
                  <h3>Chế độ tối</h3>
                  <p>Bật chế độ tối để bảo vệ mắt khi học ban đêm</p>
                </div>
                <label className="toggle" aria-label="Bật tắt chế độ tối">
                  <input 
                    type="checkbox" 
                    checked={isDark}
                    onChange={toggleTheme}
                    aria-label="Chế độ tối"
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Language Settings */}
          <div className="settings-section">
            <div className="section-header">
              <h2>Ngôn ngữ</h2>
              <span className="section-icon">🌐</span>
            </div>
            <div className="settings-group">
              <div className="setting-item">
                <div className="setting-info">
                  <h3>Ngôn ngữ giao diện</h3>
                  <p>Chọn ngôn ngữ hiển thị của ứng dụng</p>
                </div>
                <select 
                  value={language}
                  onChange={(e) => changeLanguage(e.target.value)}
                  className="select-input"
                >
                  {getLanguageOptions().map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Voice Settings */}
          <div className="settings-section">
            <div className="section-header">
              <h2>Giọng nói</h2>
              <span className="section-icon">🔊</span>
            </div>
            <div className="settings-group">
              <div className="setting-item">
                <div className="setting-info">
                  <h3>Giọng đọc</h3>
                  <p>Chọn giọng nam hoặc nữ cho phát âm từ vựng</p>
                </div>
                <select 
                  value={voiceSettings.voice}
                  onChange={(e) => handleVoiceChange('voice', e.target.value)}
                  className="select-input"
                >
                  {getVoiceOptions().map(voice => (
                    <option key={voice.id} value={voice.id}>
                      {voice.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h3>Tốc độ đọc</h3>
                  <p>Điều chỉnh tốc độ phát âm từ vựng</p>
                </div>
                <div className="range-input-container">
                  <span className="range-label">Chậm</span>
                  <input 
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={voiceSettings.speed}
                    onChange={(e) => handleVoiceChange('speed', parseFloat(e.target.value))}
                    className="range-input"
                  />
                  <span className="range-label">Nhanh</span>
                </div>
                <span className="range-value">{voiceSettings.speed}x</span>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h3>Độ cao giọng</h3>
                  <p>Điều chỉnh âm điệu của giọng đọc</p>
                </div>
                <div className="range-input-container">
                  <span className="range-label">Thấp</span>
                  <input 
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={voiceSettings.pitch}
                    onChange={(e) => handleVoiceChange('pitch', parseFloat(e.target.value))}
                    className="range-input"
                  />
                  <span className="range-label">Cao</span>
                </div>
                <span className="range-value">{voiceSettings.pitch}</span>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h3>Âm lượng</h3>
                  <p>Điều chỉnh âm lượng của giọng đọc</p>
                </div>
                <div className="range-input-container">
                  <span className="range-label">Nhỏ</span>
                  <input 
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={voiceSettings.volume}
                    onChange={(e) => handleVoiceChange('volume', parseFloat(e.target.value))}
                    className="range-input"
                  />
                  <span className="range-label">Lớn</span>
                </div>
                <span className="range-value">{Math.round(voiceSettings.volume * 100)}%</span>
              </div>

              <div className="setting-item">
                <button onClick={testVoice} className="test-voice-btn">
                  🎵 Test giọng nói
                </button>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="settings-section">
            <div className="section-header">
              <h2>Thông báo</h2>
              <span className="section-icon">🔔</span>
            </div>
            <div className="settings-group">
              <div className="setting-item">
                <div className="setting-info">
                  <h3>Từ vựng mới</h3>
                  <p>Nhận thông báo khi có từ vựng mới được thêm</p>
                </div>
                <label className="toggle" aria-label="Bật tắt thông báo từ vựng mới">
                  <input 
                    type="checkbox" 
                    checked={notifications.vocabulary}
                    onChange={() => handleNotificationChange('vocabulary')}
                    aria-label="Thông báo từ vựng mới"
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h3>Nhắc nhở hàng ngày</h3>
                  <p>Nhận thông báo nhắc nhở học tập mỗi ngày</p>
                </div>
                <label className="toggle" aria-label="Bật tắt nhắc nhở hàng ngày">
                  <input 
                    type="checkbox" 
                    checked={notifications.dailyReminder}
                    onChange={() => handleNotificationChange('dailyReminder')}
                    aria-label="Nhắc nhở hàng ngày"
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h3>Thành tích</h3>
                  <p>Nhận thông báo khi đạt được thành tích mới</p>
                </div>
                <label className="toggle" aria-label="Bật tắt thông báo thành tích">
                  <input 
                    type="checkbox" 
                    checked={notifications.achievements}
                    onChange={() => handleNotificationChange('achievements')}
                    aria-label="Thông báo thành tích"
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="settings-actions">
            <button className="btn btn-primary">Lưu cài đặt</button>
            <button className="btn btn-secondary">Khôi phục mặc định</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;