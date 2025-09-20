import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/useLanguage';

const VoiceTestComponent = () => {
  const { getSpeechSupport, playText, voiceSettings } = useLanguage();
  const [speechInfo, setSpeechInfo] = useState(null);
  const [testResults, setTestResults] = useState([]);

  useEffect(() => {
    if (getSpeechSupport) {
      const info = getSpeechSupport();
      setSpeechInfo(info);
    }
  }, [getSpeechSupport]);

  const runVoiceTests = () => {
    const tests = [
      { text: 'Hello world', language: 'en', description: 'Basic English test' },
      { text: 'I saw a blank at the zoo', language: 'en', description: 'Fill-in-blank simulation' },
      { text: 'What does apple mean', language: 'en', description: 'Question format' },
      { text: 'The quick brown fox jumps over the lazy dog', language: 'en', description: 'Long sentence test' }
    ];

    const results = [];
    
    tests.forEach((test, index) => {
      setTimeout(() => {
        console.log(`Running test ${index + 1}: ${test.description}`);
        const startTime = Date.now();
        
        try {
          playText(test.text, test.language);
          results.push({
            ...test,
            status: 'success',
            timestamp: new Date().toLocaleTimeString(),
            duration: Date.now() - startTime
          });
        } catch (error) {
          results.push({
            ...test,
            status: 'error',
            error: error.message,
            timestamp: new Date().toLocaleTimeString()
          });
        }
        
        setTestResults([...results]);
      }, index * 3000); // 3 second delay between tests
    });
  };

  if (!speechInfo) {
    return <div>Loading speech information...</div>;
  }

  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ccc', 
      borderRadius: '8px', 
      margin: '20px',
      backgroundColor: 'var(--card-background)' 
    }}>
      <h3>🎤 Voice Synthesis Test Panel</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <h4>Platform Information:</h4>
        <ul>
          <li>Speech Support: {speechInfo.supported ? '✅ Yes' : '❌ No'}</li>
          <li>Available Voices: {speechInfo.voicesCount}</li>
          <li>Platform: {speechInfo.platform?.isMobile ? '📱 Mobile' : '💻 Desktop'}</li>
          <li>iOS Device: {speechInfo.platform?.isIOS ? '✅ Yes' : '❌ No'}</li>
          <li>Safari Browser: {speechInfo.platform?.isSafari ? '✅ Yes' : '❌ No'}</li>
          <li>Available Languages: {speechInfo.availableLanguages?.join(', ')}</li>
        </ul>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>Current Voice Settings:</h4>
        <ul>
          <li>Speed: {voiceSettings.speed}</li>
          <li>Pitch: {voiceSettings.pitch}</li>
          <li>Volume: {voiceSettings.volume}</li>
          <li>Voice ID: {voiceSettings.voice}</li>
        </ul>
      </div>

      <button 
        onClick={runVoiceTests}
        style={{
          padding: '10px 20px',
          backgroundColor: 'var(--primary-color)',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        🧪 Run Voice Tests
      </button>

      {testResults.length > 0 && (
        <div>
          <h4>Test Results:</h4>
          {testResults.map((result, index) => (
            <div 
              key={index}
              style={{
                padding: '10px',
                margin: '5px 0',
                borderRadius: '4px',
                backgroundColor: result.status === 'success' ? '#d4edda' : '#f8d7da',
                border: `1px solid ${result.status === 'success' ? '#c3e6cb' : '#f5c6cb'}`
              }}
            >
              <strong>{result.description}</strong>
              <div>Text: "{result.text}"</div>
              <div>Status: {result.status === 'success' ? '✅ Success' : '❌ Error'}</div>
              <div>Time: {result.timestamp}</div>
              {result.error && <div>Error: {result.error}</div>}
              {result.duration && <div>Duration: {result.duration}ms</div>}
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '0.9em', color: 'var(--text-secondary)' }}>
        <strong>💡 Platform Tips:</strong>
        <ul>
          <li><strong>iOS/Safari:</strong> May require user interaction to enable speech</li>
          <li><strong>Android:</strong> Works best with Chrome browser</li>
          <li><strong>Desktop:</strong> Most browsers support full feature set</li>
          <li><strong>Mobile:</strong> Voice loading may take longer on first use</li>
        </ul>
      </div>
    </div>
  );
};

export default VoiceTestComponent;