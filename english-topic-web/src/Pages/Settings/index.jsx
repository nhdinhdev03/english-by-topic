import { useState } from 'react';
import './Settings.scss';

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('vi');
  const [voiceSettings, setVoiceSettings] = useState({
    voice: 'female-vi',
    speed: 1,
    pitch: 1,
    accent: 'northern'
  });
  const [notifications, setNotifications] = useState({
    vocabulary: true,
    dailyReminder: true,
    achievements: true
  });

  const handleVoiceChange = (key, value) => {
    setVoiceSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const testVoice = () => {
    // Placeholder for voice testing
    alert('Chức năng test giọng nói sẽ được thực hiện ở đây');
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
                <label className="toggle">
                  <input 
                    type="checkbox" 
                    checked={darkMode}
                    onChange={(e) => setDarkMode(e.target.checked)}
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
                  onChange={(e) => setLanguage(e.target.value)}
                  className="select-input"
                >
                  <option value="vi">Tiếng Việt</option>
                  <option value="en">English</option>
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
                  <option value="female-vi">Giọng nữ (Việt Nam)</option>
                  <option value="male-vi">Giọng nam (Việt Nam)</option>
                  <option value="female-en-us">Giọng nữ (Mỹ)</option>
                  <option value="male-en-us">Giọng nam (Mỹ)</option>
                  <option value="female-en-uk">Giọng nữ (Anh)</option>
                  <option value="male-en-uk">Giọng nam (Anh)</option>
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
                  <h3>Giọng địa phương</h3>
                  <p>Chọn giọng theo vùng miền (cho tiếng Việt)</p>
                </div>
                <select 
                  value={voiceSettings.accent}
                  onChange={(e) => handleVoiceChange('accent', e.target.value)}
                  className="select-input"
                >
                  <option value="northern">Miền Bắc</option>
                  <option value="central">Miền Trung</option>
                  <option value="southern">Miền Nam</option>
                </select>
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
                <label className="toggle">
                  <input 
                    type="checkbox" 
                    checked={notifications.vocabulary}
                    onChange={() => handleNotificationChange('vocabulary')}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h3>Nhắc nhở hàng ngày</h3>
                  <p>Nhận thông báo nhắc nhở học tập mỗi ngày</p>
                </div>
                <label className="toggle">
                  <input 
                    type="checkbox" 
                    checked={notifications.dailyReminder}
                    onChange={() => handleNotificationChange('dailyReminder')}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h3>Thành tích</h3>
                  <p>Nhận thông báo khi đạt được thành tích mới</p>
                </div>
                <label className="toggle">
                  <input 
                    type="checkbox" 
                    checked={notifications.achievements}
                    onChange={() => handleNotificationChange('achievements')}
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