import PropTypes from 'prop-types';
import { createContext, useEffect, useState } from 'react';

const LanguageContext = createContext();

export { LanguageContext };

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'vi';
  });

  const [voiceSettings, setVoiceSettings] = useState(() => {
    const saved = localStorage.getItem('voiceSettings');
    return saved ? JSON.parse(saved) : {
      voice: 'female-en-us',
      speed: 1,
      pitch: 1,
      accent: 'american',
      volume: 0.8
    };
  });

  // Supported languages
  const supportedLanguages = {
    vi: {
      name: 'Tiếng Việt',
      flag: '🇻🇳',
      code: 'vi-VN'
    },
    en: {
      name: 'English',
      flag: '🇺🇸',
      code: 'en-US'
    },
    ja: {
      name: '日本語',
      flag: '🇯🇵',
      code: 'ja-JP'
    },
    ko: {
      name: '한국어',
      flag: '🇰🇷',
      code: 'ko-KR'
    },
    zh: {
      name: '中文',
      flag: '🇨🇳',
      code: 'zh-CN'
    },
    es: {
      name: 'Español',
      flag: '🇪🇸',
      code: 'es-ES'
    },
    fr: {
      name: 'Français',
      flag: '🇫🇷',
      code: 'fr-FR'
    },
    de: {
      name: 'Deutsch',
      flag: '🇩🇪',
      code: 'de-DE'
    }
  };

  // Available voices for each language
  const availableVoices = {
    en: [
      { id: 'female-en-us', name: 'Giọng nữ (Mỹ)', lang: 'en-US', gender: 'female', country: 'US' },
      { id: 'male-en-us', name: 'Giọng nam (Mỹ)', lang: 'en-US', gender: 'male', country: 'US' },
      { id: 'female-en-uk', name: 'Giọng nữ (Anh)', lang: 'en-GB', gender: 'female', country: 'UK' },
      { id: 'male-en-uk', name: 'Giọng nam (Anh)', lang: 'en-GB', gender: 'male', country: 'UK' },
      { id: 'female-en-au', name: 'Giọng nữ (Úc)', lang: 'en-AU', gender: 'female', country: 'AU' },
      { id: 'male-en-au', name: 'Giọng nam (Úc)', lang: 'en-AU', gender: 'male', country: 'AU' }
    ],
    vi: [
      { id: 'female-vi-north', name: 'Giọng nữ (Miền Bắc)', lang: 'vi-VN', gender: 'female', region: 'north' },
      { id: 'male-vi-north', name: 'Giọng nam (Miền Bắc)', lang: 'vi-VN', gender: 'male', region: 'north' },
      { id: 'female-vi-south', name: 'Giọng nữ (Miền Nam)', lang: 'vi-VN', gender: 'female', region: 'south' },
      { id: 'male-vi-south', name: 'Giọng nam (Miền Nam)', lang: 'vi-VN', gender: 'male', region: 'south' }
    ],
    ja: [
      { id: 'female-ja', name: 'Giọng nữ (Nhật)', lang: 'ja-JP', gender: 'female' },
      { id: 'male-ja', name: 'Giọng nam (Nhật)', lang: 'ja-JP', gender: 'male' }
    ],
    ko: [
      { id: 'female-ko', name: 'Giọng nữ (Hàn)', lang: 'ko-KR', gender: 'female' },
      { id: 'male-ko', name: 'Giọng nam (Hàn)', lang: 'ko-KR', gender: 'male' }
    ],
    zh: [
      { id: 'female-zh', name: 'Giọng nữ (Trung)', lang: 'zh-CN', gender: 'female' },
      { id: 'male-zh', name: 'Giọng nam (Trung)', lang: 'zh-CN', gender: 'male' }
    ],
    es: [
      { id: 'female-es', name: 'Giọng nữ (Tây Ban Nha)', lang: 'es-ES', gender: 'female' },
      { id: 'male-es', name: 'Giọng nam (Tây Ban Nha)', lang: 'es-ES', gender: 'male' }
    ],
    fr: [
      { id: 'female-fr', name: 'Giọng nữ (Pháp)', lang: 'fr-FR', gender: 'female' },
      { id: 'male-fr', name: 'Giọng nam (Pháp)', lang: 'fr-FR', gender: 'male' }
    ],
    de: [
      { id: 'female-de', name: 'Giọng nữ (Đức)', lang: 'de-DE', gender: 'female' },
      { id: 'male-de', name: 'Giọng nam (Đức)', lang: 'de-DE', gender: 'male' }
    ]
  };

  // Translations
  const translations = {
    vi: {
      // Navigation
      home: 'Trang chủ',
      learn: 'Học từ mới',
      quiz: 'Trắc nghiệm',
      review: 'Ôn tập',
      topics: 'Chủ đề',
      progress: 'Tiến độ',
      about: 'Giới thiệu',
      settings: 'Cài đặt',
      
      // Common actions
      save: 'Lưu',
      cancel: 'Hủy',
      back: 'Quay lại',
      next: 'Tiếp',
      previous: 'Trước',
      search: 'Tìm kiếm',
      
      // Learning
      vocabulary: 'Từ vựng',
      pronunciation: 'Phát âm',
      meaning: 'Nghĩa',
      example: 'Ví dụ',
      learned: 'Đã học',
      learningProgress: 'Tiến độ',
      
      // Settings
      language: 'Ngôn ngữ',
      voice: 'Giọng nói',
      speed: 'Tốc độ',
      pitch: 'Độ cao',
      volume: 'Âm lượng',
      theme: 'Giao diện',
      notifications: 'Thông báo'
    },
    en: {
      // Navigation
      home: 'Home',
      learn: 'Learn',
      quiz: 'Quiz',
      review: 'Review',
      topics: 'Topics',
      progress: 'Progress',
      about: 'About',
      settings: 'Settings',
      
      // Common actions
      save: 'Save',
      cancel: 'Cancel',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      search: 'Search',
      
      // Learning
      vocabulary: 'Vocabulary',
      pronunciation: 'Pronunciation',
      meaning: 'Meaning',
      example: 'Example',
      learned: 'Learned',
      learningProgress: 'Progress',
      
      // Settings
      language: 'Language',
      voice: 'Voice',
      speed: 'Speed',
      pitch: 'Pitch',
      volume: 'Volume',
      theme: 'Theme',
      notifications: 'Notifications'
    }
  };

  // Save to localStorage when settings change
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('voiceSettings', JSON.stringify(voiceSettings));
  }, [voiceSettings]);

  const changeLanguage = (newLanguage) => {
    if (supportedLanguages[newLanguage]) {
      setLanguage(newLanguage);
    }
  };

  const updateVoiceSettings = (newSettings) => {
    setVoiceSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  const getTranslation = (key) => {
    const languageTranslations = translations[language] || translations.vi;
    return languageTranslations[key] || key;
  };

  const getCurrentVoiceConfig = () => {
    const currentVoice = availableVoices[language]?.find(v => v.id === voiceSettings.voice) || 
                        availableVoices.en?.[0];
    
    return {
      ...currentVoice,
      ...voiceSettings
    };
  };

  const playText = (text, targetLanguage = 'en') => {
    if (!text) return;

    // Get the appropriate voice for the target language
    const targetVoices = availableVoices[targetLanguage] || availableVoices.en;
    const voiceConfig = targetVoices.find(v => v.id === voiceSettings.voice) || targetVoices[0];

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voiceConfig.lang;
    utterance.rate = voiceSettings.speed;
    utterance.pitch = voiceSettings.pitch;
    utterance.volume = voiceSettings.volume;

    // Try to use a specific voice if available
    const voices = speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.lang.startsWith(voiceConfig.lang.split('-')[0]) &&
      (voiceConfig.gender === 'female' ? voice.name.toLowerCase().includes('female') : true)
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    speechSynthesis.speak(utterance);
  };

  const value = {
    language,
    supportedLanguages,
    availableVoices,
    voiceSettings,
    changeLanguage,
    updateVoiceSettings,
    getTranslation,
    getCurrentVoiceConfig,
    playText,
    t: getTranslation // Shorthand for getTranslation
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

LanguageProvider.propTypes = {
  children: PropTypes.node.isRequired
};