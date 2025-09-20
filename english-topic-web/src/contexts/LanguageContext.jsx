import PropTypes from "prop-types";
import { createContext, useEffect, useState } from "react";

const LanguageContext = createContext();

export { LanguageContext };

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });

  const [voiceSettings, setVoiceSettings] = useState(() => {
    const saved = localStorage.getItem("voiceSettings");
    return saved
      ? JSON.parse(saved)
      : {
          voice: "female-en-us",
          speed: 1,
          pitch: 1,
          accent: "american",
          volume: 0.8,
        };
  });

  // Supported languages
  const supportedLanguages = {
    en: {
      name: "English",
      flag: "🇺🇸",
      code: "en-US",
    },
    vi: {
      name: "Tiếng Việt",
      flag: "🇻🇳",
      code: "vi-VN",
    },

    ja: {
      name: "日本語",
      flag: "🇯🇵",
      code: "ja-JP",
    },
    ko: {
      name: "한국어",
      flag: "🇰🇷",
      code: "ko-KR",
    },
    zh: {
      name: "中文",
      flag: "🇨🇳",
      code: "zh-CN",
    },
    es: {
      name: "Español",
      flag: "🇪🇸",
      code: "es-ES",
    },
    fr: {
      name: "Français",
      flag: "🇫🇷",
      code: "fr-FR",
    },
    de: {
      name: "Deutsch",
      flag: "🇩🇪",
      code: "de-DE",
    },
  };

  // Available voices for each language
  const availableVoices = {
    en: [
      {
        id: "female-en-us",
        name: "Giọng nữ (Mỹ)",
        lang: "en-US",
        gender: "female",
        country: "US",
      },
      {
        id: "male-en-us",
        name: "Giọng nam (Mỹ)",
        lang: "en-US",
        gender: "male",
        country: "US",
      },
      {
        id: "female-en-uk",
        name: "Giọng nữ (Anh)",
        lang: "en-GB",
        gender: "female",
        country: "UK",
      },
      {
        id: "male-en-uk",
        name: "Giọng nam (Anh)",
        lang: "en-GB",
        gender: "male",
        country: "UK",
      },
      {
        id: "female-en-au",
        name: "Giọng nữ (Úc)",
        lang: "en-AU",
        gender: "female",
        country: "AU",
      },
      {
        id: "male-en-au",
        name: "Giọng nam (Úc)",
        lang: "en-AU",
        gender: "male",
        country: "AU",
      },
    ],
    vi: [
      {
        id: "female-vi-north",
        name: "Giọng nữ (Miền Bắc)",
        lang: "vi-VN",
        gender: "female",
        region: "north",
      },
      {
        id: "male-vi-north",
        name: "Giọng nam (Miền Bắc)",
        lang: "vi-VN",
        gender: "male",
        region: "north",
      },
      {
        id: "female-vi-south",
        name: "Giọng nữ (Miền Nam)",
        lang: "vi-VN",
        gender: "female",
        region: "south",
      },
      {
        id: "male-vi-south",
        name: "Giọng nam (Miền Nam)",
        lang: "vi-VN",
        gender: "male",
        region: "south",
      },
    ],
    ja: [
      {
        id: "female-ja",
        name: "Giọng nữ (Nhật)",
        lang: "ja-JP",
        gender: "female",
      },
      {
        id: "male-ja",
        name: "Giọng nam (Nhật)",
        lang: "ja-JP",
        gender: "male",
      },
    ],
    ko: [
      {
        id: "female-ko",
        name: "Giọng nữ (Hàn)",
        lang: "ko-KR",
        gender: "female",
      },
      { id: "male-ko", name: "Giọng nam (Hàn)", lang: "ko-KR", gender: "male" },
    ],
    zh: [
      {
        id: "female-zh",
        name: "Giọng nữ (Trung)",
        lang: "zh-CN",
        gender: "female",
      },
      {
        id: "male-zh",
        name: "Giọng nam (Trung)",
        lang: "zh-CN",
        gender: "male",
      },
    ],
    es: [
      {
        id: "female-es",
        name: "Giọng nữ (Tây Ban Nha)",
        lang: "es-ES",
        gender: "female",
      },
      {
        id: "male-es",
        name: "Giọng nam (Tây Ban Nha)",
        lang: "es-ES",
        gender: "male",
      },
    ],
    fr: [
      {
        id: "female-fr",
        name: "Giọng nữ (Pháp)",
        lang: "fr-FR",
        gender: "female",
      },
      {
        id: "male-fr",
        name: "Giọng nam (Pháp)",
        lang: "fr-FR",
        gender: "male",
      },
    ],
    de: [
      {
        id: "female-de",
        name: "Giọng nữ (Đức)",
        lang: "de-DE",
        gender: "female",
      },
      { id: "male-de", name: "Giọng nam (Đức)", lang: "de-DE", gender: "male" },
    ],
  };

  // Translations
  const translations = {
    vi: {
      // Navigation
      home: "Trang chủ",
      learn: "Học từ mới",
      quiz: "Trắc nghiệm",
      review: "Ôn tập",
      topics: "Chủ đề",
      progress: "Tiến độ",
      about: "Giới thiệu",
      settings: "Cài đặt",

      // Common actions
      save: "Lưu",
      cancel: "Hủy",
      back: "Quay lại",
      next: "Tiếp",
      previous: "Trước",
      search: "Tìm kiếm",

      // Learning
      vocabulary: "Từ vựng",
      pronunciation: "Phát âm",
      meaning: "Nghĩa",
      example: "Ví dụ",
      learned: "Đã học",
      learningProgress: "Tiến độ",

      // Audio & Pronunciation
      listen: "Nghe",
      playAudio: "Phát âm thanh",
      listenToPronunciation: "Nghe phát âm",
      playPronunciation: "Phát âm",
      audioSettings: "Cài đặt âm thanh",
      practiceListening: "Luyện nghe",
      repeatAudio: "Lặp lại",

      // Settings
      language: "Ngôn ngữ",
      voice: "Giọng nói",
      speed: "Tốc độ",
      pitch: "Độ cao",
      volume: "Âm lượng",
      theme: "Giao diện",
      notifications: "Thông báo",
    },
    en: {
      // Navigation
      home: "Home",
      learn: "Learn",
      quiz: "Quiz",
      review: "Review",
      topics: "Topics",
      progress: "Progress",
      about: "About",
      settings: "Settings",

      // Common actions
      save: "Save",
      cancel: "Cancel",
      back: "Back",
      next: "Next",
      previous: "Previous",
      search: "Search",

      // Learning
      vocabulary: "Vocabulary",
      pronunciation: "Pronunciation",
      meaning: "Meaning",
      example: "Example",
      learned: "Learned",
      learningProgress: "Progress",

      // Audio & Pronunciation
      listen: "Listen",
      playAudio: "Play Audio",
      listenToPronunciation: "Listen to Pronunciation",
      playPronunciation: "Play Pronunciation",
      audioSettings: "Audio Settings",
      practiceListening: "Practice Listening",
      repeatAudio: "Repeat Audio",

      // Settings
      language: "Language",
      voice: "Voice",
      speed: "Speed",
      pitch: "Pitch",
      volume: "Volume",
      theme: "Theme",
      notifications: "Notifications",
    },
  };

  // Save to localStorage when settings change
  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem("voiceSettings", JSON.stringify(voiceSettings));
  }, [voiceSettings]);

  // Initialize speech synthesis on component mount
  useEffect(() => {
    initializeSpeechSynthesis();
  }, []);

  const changeLanguage = (newLanguage) => {
    if (supportedLanguages[newLanguage]) {
      setLanguage(newLanguage);
    }
  };

  const updateVoiceSettings = (newSettings) => {
    setVoiceSettings((prev) => {
      const updated = {
        ...prev,
        ...newSettings,
      };
      
      // Platform-specific settings optimization
      const userAgent = navigator.userAgent.toLowerCase();
      const isIOS = /ipad|iphone|ipod/.test(userAgent);
      const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      
      // Auto-adjust settings for better compatibility
      if (isIOS) {
        // iOS has more limited range
        updated.speed = Math.max(0.5, Math.min(1.5, updated.speed));
        updated.pitch = Math.max(0.8, Math.min(1.2, updated.pitch));
      } else if (isMobile) {
        // Mobile generally works better with conservative settings
        updated.speed = Math.max(0.3, Math.min(1.8, updated.speed));
        updated.pitch = Math.max(0.5, Math.min(1.5, updated.pitch));
      }
      
      // Always ensure volume is in valid range
      updated.volume = Math.max(0.1, Math.min(1.0, updated.volume));
      
      return updated;
    });
  };

  const getTranslation = (key) => {
    const languageTranslations = translations[language] || translations.vi;
    return languageTranslations[key] || key;
  };

  const getCurrentVoiceConfig = () => {
    const currentVoice =
      availableVoices[language]?.find((v) => v.id === voiceSettings.voice) ||
      availableVoices.en?.[0];

    return {
      ...currentVoice,
      ...voiceSettings,
    };
  };

  // Initialize speech synthesis for cross-platform compatibility
  const initializeSpeechSynthesis = () => {
    // Load voices on component mount for better compatibility
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // Force load voices on different platforms
      speechSynthesis.getVoices();
      
      // Some browsers need this event to properly load voices
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => {
          console.log('Voices loaded:', speechSynthesis.getVoices().length);
        };
      }
    }
  };

  // Check speech synthesis support and get available voices
  const getSpeechSupport = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return {
        supported: false,
        reason: 'Speech synthesis not supported in this browser'
      };
    }

    const voices = speechSynthesis.getVoices();
    return {
      supported: true,
      voicesCount: voices.length,
      availableLanguages: [...new Set(voices.map(v => v.lang.split('-')[0]))],
      platform: {
        isMobile: /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()),
        isIOS: /ipad|iphone|ipod/.test(navigator.userAgent.toLowerCase()),
        isSafari: /safari/.test(navigator.userAgent.toLowerCase()) && !/chrome/.test(navigator.userAgent.toLowerCase())
      }
    };
  };

  const playText = (text, targetLanguage = "en") => {
    if (!text) return;

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    // Get the appropriate voice for the target language
    const targetVoices = availableVoices[targetLanguage] || availableVoices.en;
    const voiceConfig =
      targetVoices.find((v) => v.id === voiceSettings.voice) || targetVoices[0];

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voiceConfig.lang;
    utterance.rate = Math.max(0.1, Math.min(2.0, voiceSettings.speed)); // Clamp rate
    utterance.pitch = Math.max(0.1, Math.min(2.0, voiceSettings.pitch)); // Clamp pitch
    utterance.volume = Math.max(0.1, Math.min(1.0, voiceSettings.volume)); // Clamp volume

    // Cross-platform voice selection with fallbacks
    const selectBestVoice = () => {
      const voices = speechSynthesis.getVoices();
      if (voices.length === 0) return null;

      const targetLangCode = voiceConfig.lang.split('-')[0]; // e.g., 'en' from 'en-US'
      
      // Priority order for voice selection
      const voicePriorities = [
        // 1. Exact match with gender preference
        (voice) => 
          voice.lang === voiceConfig.lang && 
          (voiceConfig.gender === 'female' 
            ? voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('woman')
            : voice.name.toLowerCase().includes('male') || voice.name.toLowerCase().includes('man')),
        
        // 2. Exact language match
        (voice) => voice.lang === voiceConfig.lang,
        
        // 3. Same language, different region
        (voice) => voice.lang.startsWith(targetLangCode),
        
        // 4. Default system voice for the language
        (voice) => voice.default && voice.lang.startsWith(targetLangCode),
        
        // 5. Any voice with the target language
        (voice) => voice.lang.toLowerCase().includes(targetLangCode)
      ];

      for (const priority of voicePriorities) {
        const matchedVoice = voices.find(priority);
        if (matchedVoice) return matchedVoice;
      }

      // Fallback: first voice for the language or default voice
      return voices.find(voice => voice.lang.startsWith(targetLangCode)) || voices[0];
    };

    // Handle voice loading asynchronously for mobile devices
    const initializeAndSpeak = () => {
      const selectedVoice = selectBestVoice();
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      // Add event listeners for better cross-platform handling
      utterance.onstart = () => {
        console.log('Speech started');
      };

      utterance.onend = () => {
        console.log('Speech ended');
      };

      utterance.onerror = (event) => {
        console.warn('Speech error:', event.error);
        // Retry with simpler settings on error
        if (event.error === 'network' || event.error === 'synthesis-failed') {
          const fallbackUtterance = new SpeechSynthesisUtterance(text);
          fallbackUtterance.lang = 'en-US';
          fallbackUtterance.rate = 1;
          fallbackUtterance.pitch = 1;
          fallbackUtterance.volume = 0.8;
          speechSynthesis.speak(fallbackUtterance);
        }
      };

      // Platform-specific optimizations
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isIOS = /ipad|iphone|ipod/.test(userAgent);
      const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent);

      if (isIOS || isSafari) {
        // iOS/Safari specific handling
        utterance.rate = Math.max(0.5, Math.min(1.5, voiceSettings.speed));
        // iOS works better with shorter text chunks
        if (text.length > 200) {
          const chunks = text.match(/.{1,200}(?:\s|$)/g) || [text];
          chunks.forEach((chunk, index) => {
            setTimeout(() => {
              const chunkUtterance = new SpeechSynthesisUtterance(chunk.trim());
              chunkUtterance.voice = selectedVoice;
              chunkUtterance.lang = utterance.lang;
              chunkUtterance.rate = utterance.rate;
              chunkUtterance.pitch = utterance.pitch;
              chunkUtterance.volume = utterance.volume;
              speechSynthesis.speak(chunkUtterance);
            }, index * 100);
          });
          return;
        }
      }

      if (isMobile) {
        // Mobile-specific optimizations
        utterance.rate = Math.max(0.3, Math.min(1.8, voiceSettings.speed));
        // Ensure speech starts (mobile sometimes needs a small delay)
        setTimeout(() => {
          speechSynthesis.speak(utterance);
        }, 100);
      } else {
        // Desktop handling
        speechSynthesis.speak(utterance);
      }
    };

    // Wait for voices to load if needed
    if (speechSynthesis.getVoices().length === 0) {
      speechSynthesis.addEventListener('voiceschanged', initializeAndSpeak, { once: true });
    } else {
      initializeAndSpeak();
    }
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
    initializeSpeechSynthesis,
    getSpeechSupport,
    playText,
    t: getTranslation, // Shorthand for getTranslation
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

LanguageProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
